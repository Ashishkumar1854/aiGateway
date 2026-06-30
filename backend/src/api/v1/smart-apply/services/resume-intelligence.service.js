/**
 * Resume Intelligence Engine Service
 * Converts parsed resume data into a rich, structured AI-ready intelligence profile.
 */

const prisma = require('../../../../lib/prisma');

/**
 * Call Gemini AI to enrich the parsed profile
 */
const generateIntelligenceProfile = async (parsedProfile) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  const prompt = `You are an expert AI Resume Analyst. Convert the following parsed resume profile into a rich, structured, and intelligent Resume Intelligence Profile.
Categorize the technical skills properly, identify career levels, years of experience, strengths, target industries, improvement areas, online profiles, and formulate a highly professional summary.

Input Parsed Resume Profile:
${JSON.stringify(parsedProfile, null, 2)}

Return a JSON object matching this exact schema:
{
  "primaryRole": "string (the main job title, e.g. 'Frontend Developer')",
  "secondaryRoles": ["string (other relevant job titles suitable for this profile)"],
  "careerLevel": "string (one of: 'Entry-level', 'Mid-level', 'Senior-level')",
  "yearsOfExperience": "string (e.g. '2 Years' or 'Fresher')",
  "resumeSummary": "string (a professional 2-3 sentence career summary)",
  "skills": ["string (general professional skills)"],
  "technologies": ["string (programming technologies, e.g. Node.js, React)"],
  "frameworks": ["string (libraries/frameworks, e.g. Next.js, Express)"],
  "languages": ["string (programming/scripting languages, e.g. JavaScript, Python, SQL)"],
  "databases": ["string (database engines used, e.g. MongoDB, PostgreSQL)"],
  "cloudPlatforms": ["string (cloud hosts/platforms, e.g. AWS, Vercel, Heroku)"],
  "devOpsTools": ["string (devops/infra tools, e.g. Docker, Git, CI/CD)"],
  "aiMlSkills": ["string (any AI/ML/data-science tools/skills, e.g. NLP, TensorFlow, or empty array if none)"],
  "projects": [
    {
      "name": "string",
      "description": "string (details of what was built)",
      "techStack": ["string"]
    }
  ],
  "achievements": ["string (notable career/educational accomplishments found in profile)"],
  "certifications": ["string"],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "endYear": number
    }
  ],
  "atsKeywords": ["string (keywords optimized for automated recruitment tracking)"],
  "strengths": ["string (3-4 professional strengths based on experience/skills)"],
  "improvementAreas": ["string (2-3 constructive areas they can improve on)"],
  "industries": ["string (target/relevant industry verticals, e.g. FinTech, SaaS, EdTech)"],
  "portfolioLinks": ["string (any personal websites or custom links found in projects/profile)"],
  "github": "string or null (parsed GitHub profile link, e.g. 'https://github.com/username' or null if not found)",
  "linkedin": "string or null (parsed LinkedIn profile link, e.g. 'https://linkedin.com/in/username' or null if not found)"
}

Do NOT hallucinate information that is not supported by the input profile details. If links or specific tools are not present, return null or empty arrays. Return ONLY the JSON object. Do not wrap in markdown code blocks (\`\`\`json).`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const retries = 4;
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    });

    if (response.status === 429) {
      let waitMs = 15000; // default 15s wait
      let isDailyLimit = false;
      try {
        const errJson = await response.clone().json();
        
        // Fast break on daily quota exhaustion to avoid unnecessary wait loops
        isDailyLimit = errJson.error?.details?.some(detail => 
          detail.violations?.some(v => v.quotaId?.includes('PerDay'))
        );

        if (!isDailyLimit) {
          const delayStr = errJson.error?.details?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo')?.retryDelay;
          if (delayStr) {
            const seconds = parseFloat(delayStr);
            if (!isNaN(seconds)) {
              waitMs = (seconds + 1) * 1000; // add 1s buffer
            }
          }
        }
      } catch (e) {
        // failed to parse or clone, fallback
      }

      if (isDailyLimit) {
        console.warn('[Resume Intelligence] Daily Gemini API quota limit reached. Proceeding to fallback.');
        throw new Error('Daily Gemini API quota limit reached');
      }

      if (attempt < retries) {
        console.warn(`[Resume Intelligence] Quota exceeded (429). Attempt ${attempt}/${retries}. Retrying in ${waitMs / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API call failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Gemini API returned an empty response.');
    }

    try {
      return JSON.parse(rawText.trim());
    } catch (err) {
      console.error('Failed to parse Gemini JSON response:', rawText);
      throw new Error(`Invalid JSON format returned from Gemini: ${err.message}`);
    }
  }
};

/**
 * Enriches a specific ResumeVersion with the AI intelligence profile and saves it
 */
const generateAndSaveProfile = async (resumeVersionId) => {
  const version = await prisma.resumeVersion.findUnique({
    where: { id: resumeVersionId },
    include: {
      resume: true
    }
  });

  if (!version) {
    throw new Error(`ResumeVersion ${resumeVersionId} not found`);
  }

  const inputProfile = {
    primaryRole: version.primaryRole,
    secondaryRoles: version.secondaryRoles,
    skills: version.skills,
    experience: version.experience,
    projects: version.projects,
    education: version.education,
    certifications: version.certifications,
    technologies: version.technologies,
    atsKeywords: version.atsKeywords,
    pdfLocation: version.pdfLocation
  };

  console.log(`[Resume Intelligence] Enriching resume version ${version.id} (v${version.version})...`);
  
  let intelligenceProfile;
  try {
    intelligenceProfile = await generateIntelligenceProfile(inputProfile);
  } catch (err) {
    console.warn(`[Resume Intelligence] AI enrichment failed, running local builder: ${err.message}`);
    intelligenceProfile = generateFallbackProfile(inputProfile);
  }

  // Update the database
  const updatedVersion = await prisma.resumeVersion.update({
    where: { id: resumeVersionId },
    data: {
      intelligenceProfile
    }
  });

  console.log(`[Resume Intelligence] Enriched resume version ${version.id} successfully.`);
  return updatedVersion;
};

/**
 * Generate fallback profile locally from parsed resume columns using heuristic mapping
 */
const generateFallbackProfile = (parsed) => {
  console.log('[Resume Intelligence] Generating dynamic fallback intelligence profile locally...');
  
  const skillsAndTech = [...(parsed.skills || []), ...(parsed.technologies || [])].map(s => s.toLowerCase());
  
  const frameworks = [];
  const languages = [];
  const databases = [];
  const cloudPlatforms = [];
  const devOpsTools = [];
  const aiMlSkills = [];
  
  const rules = [
    { list: frameworks, keywords: ['react', 'next.js', 'vue', 'angular', 'express', 'django', 'flask', 'laravel', 'spring', 'nest.js', 'bootstrap', 'tailwind'] },
    { list: languages, keywords: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'golang', 'rust', 'php', 'html', 'css', 'sql', 'bash'] },
    { list: databases, keywords: ['mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'dynamodb', 'oracle', 'cassandra', 'firebase'] },
    { list: cloudPlatforms, keywords: ['aws', 'gcp', 'azure', 'vercel', 'netlify', 'heroku', 'digitalocean', 'cloudflare'] },
    { list: devOpsTools, keywords: ['docker', 'kubernetes', 'jenkins', 'git', 'github', 'ci/cd', 'ansible', 'terraform', 'prometheus', 'grafana'] },
    { list: aiMlSkills, keywords: ['tensorflow', 'pytorch', 'scikit-learn', 'nlp', 'computer vision', 'opencv', 'keras', 'pandas', 'numpy', 'huggingface'] }
  ];

  skillsAndTech.forEach(item => {
    rules.forEach(rule => {
      rule.keywords.forEach(keyword => {
        if (item.includes(keyword)) {
          const original = [...(parsed.skills || []), ...(parsed.technologies || [])].find(s => s.toLowerCase() === item) || item;
          if (!rule.list.includes(original)) {
            rule.list.push(original);
          }
        }
      });
    });
  });

  return {
    primaryRole: parsed.primaryRole || "Software Engineer",
    secondaryRoles: parsed.secondaryRoles || [],
    careerLevel: parsed.experience?.toLowerCase().includes('year') && parseInt(parsed.experience) > 3 ? "Mid-level" : "Entry-level",
    yearsOfExperience: parsed.experience || "Fresher",
    resumeSummary: `A qualified professional specializing in ${parsed.primaryRole || 'software development'} with expertise in ${parsed.skills?.slice(0, 5).join(', ') || 'modern frameworks'}. Experienced in building robust solutions and working with collaborative engineering workflows.`,
    skills: parsed.skills || [],
    technologies: parsed.technologies || [],
    frameworks,
    languages,
    databases,
    cloudPlatforms,
    devOpsTools,
    aiMlSkills,
    projects: parsed.projects || [],
    achievements: [
      `Developed and deployed multiple applications utilizing ${parsed.technologies?.slice(0, 3).join(', ') || 'modern stacks'}.`,
      "Optimized codebase for search engines and recruiters through detailed keyword profiling."
    ],
    certifications: parsed.certifications || [],
    education: parsed.education || [],
    atsKeywords: parsed.atsKeywords || [],
    strengths: [
      "Technical proficiency and rapid adaptation to new tools/stacks.",
      "Detail-oriented project architecture and documentation.",
      "Collaborative project orchestration."
    ],
    improvementAreas: [
      "Expand certifications on industry-leading cloud platforms.",
      "Publish additional technical documentation or blogs about project learnings."
    ],
    industries: ["Information Technology", "Software Engineering", "Internet & SaaS"],
    portfolioLinks: [],
    github: null,
    linkedin: null
  };
};

module.exports = {
  generateIntelligenceProfile,
  generateFallbackProfile,
  generateAndSaveProfile
};
