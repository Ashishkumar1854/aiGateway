/**
 * Job Intelligence Engine Service
 * Converts plain-text job descriptions into rich, structured AI-ready job profiles.
 */

const prisma = require('../../../../lib/prisma');

/**
 * Call Gemini AI to structure the job description
 */
const generateJobProfile = async (companyName, role, jobDescription) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  // Sanitized fallback values if text is empty
  const jdText = jobDescription?.trim() || 'No detailed job description provided.';

  const prompt = `You are an expert AI Recruiting Analyst. Analyze the following job description details and convert it into a rich, structured, and intelligent Job Intelligence Profile.

Company Name: ${companyName}
Target Role: ${role}
Job Description Text:
${jdText}

Return a JSON object matching this exact schema:
{
  "company": "string (name of the company)",
  "role": "string (the target role)",
  "department": "string or null (e.g. Engineering, Sales, Product, Marketing)",
  "employmentType": "string (e.g. Full-time, Part-time, Internship, Contract)",
  "workMode": "string (one of: Remote, Hybrid, On-site, or Hybrid/Remote)",
  "location": "string or null (city/country details, e.g. 'San Francisco, CA')",
  "seniority": "string (e.g. Junior, Mid, Senior, Lead, Executive)",
  "experienceRequired": "string (e.g. '2+ years' or 'Fresher')",
  "requiredSkills": ["string (essential skills required for the role)"],
  "preferredSkills": ["string (nice-to-have skills/qualities)"],
  "responsibilities": ["string (key duties and requirements of the role)"],
  "qualifications": ["string (educational or experience credentials)"],
  "atsKeywords": ["string (optimized recruiter tracking keywords)"],
  "industry": "string or null (e.g. FinTech, SaaS, Healthcare)",
  "technologies": ["string (technologies, programming languages, databases, or frameworks mentioned, e.g. React, Node.js)"],
  "softSkills": ["string (interpersonal qualities, e.g. Communication, Leadership)"],
  "summary": "string (a professional 2-sentence summary summarizing the role and main responsibilities)"
}

Do NOT hallucinate information that is not supported by the job details. Return null or empty arrays if details are missing. Return ONLY the JSON object. Do not wrap in markdown code blocks (\`\`\`json).`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const retries = 3;
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
      let waitMs = 15000;
      let isDailyLimit = false;
      try {
        const errJson = await response.clone().json();
        
        // Fast break on daily quota exhaustion
        isDailyLimit = errJson.error?.details?.some(detail => 
          detail.violations?.some(v => v.quotaId?.includes('PerDay'))
        );
      } catch (e) {
        // failed to parse
      }

      if (isDailyLimit) {
        console.warn('[Job Intelligence] Daily Gemini API quota limit reached. Proceeding to fallback.');
        throw new Error('Daily Gemini API quota limit reached');
      }

      if (attempt < retries) {
        console.warn(`[Job Intelligence] Quota exceeded (429). Attempt ${attempt}/${retries}. Retrying in ${waitMs / 1000}s...`);
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
 * Generate fallback job profile locally from plain text parameters using heuristics
 */
const generateFallbackJobProfile = (companyName, role, jobDescription) => {
  console.log('[Job Intelligence] Generating dynamic fallback job profile locally...');
  
  const text = (jobDescription || '').toLowerCase();
  
  // Work Mode detection
  let workMode = 'On-site';
  if (text.includes('remote')) {
    workMode = 'Remote';
  } else if (text.includes('hybrid')) {
    workMode = 'Hybrid';
  }

  // Seniority detection
  let seniority = 'Mid';
  if (text.includes('junior') || text.includes('entry') || text.includes('associate')) {
    seniority = 'Junior';
  } else if (text.includes('senior') || text.includes('sr.')) {
    seniority = 'Senior';
  } else if (text.includes('lead') || text.includes('principal')) {
    seniority = 'Lead';
  }

  // Employment Type detection
  let employmentType = 'Full-time';
  if (text.includes('part-time') || text.includes('part time')) {
    employmentType = 'Part-time';
  } else if (text.includes('intern') || text.includes('co-op')) {
    employmentType = 'Internship';
  } else if (text.includes('contract') || text.includes('freelance')) {
    employmentType = 'Contract';
  }

  // Heuristic technology parsing
  const techKeywords = ['react', 'node', 'express', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'python', 'java', 'sql', 'postgres', 'mongodb', 'docker', 'aws', 'gcp', 'git', 'c++', 'c#', 'django', 'flask', 'tailwind', 'bootstrap'];
  const technologies = [];
  techKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      // Map to proper camel/capitalized casing
      const properNames = {
        'react': 'React.js',
        'node': 'Node.js',
        'express': 'Express.js',
        'next.js': 'Next.js',
        'vue': 'Vue.js',
        'angular': 'Angular',
        'javascript': 'JavaScript',
        'typescript': 'TypeScript',
        'python': 'Python',
        'java': 'Java',
        'sql': 'SQL',
        'postgres': 'PostgreSQL',
        'mongodb': 'MongoDB',
        'docker': 'Docker',
        'aws': 'AWS',
        'gcp': 'GCP',
        'git': 'Git',
        'c++': 'C++',
        'c#': 'C#',
        'django': 'Django',
        'flask': 'Flask',
        'tailwind': 'Tailwind CSS',
        'bootstrap': 'Bootstrap'
      };
      technologies.push(properNames[keyword] || keyword);
    }
  });

  return {
    company: companyName,
    role: role,
    department: text.includes('eng') || text.includes('developer') || text.includes('code') ? 'Engineering' : 'Other',
    employmentType,
    workMode,
    location: 'United States',
    seniority,
    experienceRequired: text.includes('1 year') ? '1 Year' : text.includes('2 year') ? '2 Years' : text.includes('3 year') ? '3 Years' : text.includes('5 year') ? '5+ Years' : 'Not Specified',
    requiredSkills: technologies.slice(0, 4),
    preferredSkills: technologies.slice(4, 7),
    responsibilities: [
      `Collaborate with team members at ${companyName} to build scalable solutions.`,
      `Design, implement, and maintain system features aligned with the ${role} requirements.`
    ],
    qualifications: [
      "Degree in Computer Science, Software Engineering, or equivalent professional experience."
    ],
    atsKeywords: [role, companyName, ...technologies.slice(0, 3)],
    industry: 'Information Technology',
    technologies,
    softSkills: ['Communication', 'Teamwork', 'Problem Solving'],
    summary: `This is a ${employmentType} ${role} role at ${companyName}. The candidate will work in a ${workMode} environment supporting the main technology stack and development pipeline.`
  };
};

/**
 * Enriches a specific JobApplication with the AI job intelligence profile and saves it
 */
const generateAndSaveProfile = async (applicationId) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId }
  });

  if (!application) {
    throw new Error(`JobApplication ${applicationId} not found`);
  }

  console.log(`[Job Intelligence] Structuring job description for application ${application.id} (Company: "${application.companyName}", Role: "${application.role}")...`);
  
  let jobIntelligence;
  try {
    jobIntelligence = await generateJobProfile(
      application.companyName,
      application.role,
      application.jobDescription || ''
    );
  } catch (err) {
    console.warn(`[Job Intelligence] AI structuring failed, running local builder: ${err.message}`);
    jobIntelligence = generateFallbackJobProfile(
      application.companyName,
      application.role,
      application.jobDescription || ''
    );
  }

  // Update the database
  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      jobIntelligence
    }
  });

  console.log(`[Job Intelligence] Structured job application ${application.id} successfully.`);
  return updatedApplication;
};

module.exports = {
  generateJobProfile,
  generateFallbackJobProfile,
  generateAndSaveProfile
};
