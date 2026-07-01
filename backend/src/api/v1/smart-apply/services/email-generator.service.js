/**
 * AI Personalized Email Engine Service
 * Generates highly targeted, non-templated job application outreach emails.
 */

const prisma = require('../../../../lib/prisma');

/**
 * Call Gemini AI to write the personalized email
 */
const generateEmailWithAI = async ({
  resumeVersion,
  jobIntelligence,
  matchResult,
  companyName,
  role,
  hrName,
  additionalNotes,
  candidateName
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  const prompt = `You are a world-class professional career coach and recruiting strategist writing a highly personalized, natural, and human-like job application cold email on behalf of the candidate.

Before writing the email, you MUST internally evaluate the candidate exactly like a recruiter.
Perform this internal reasoning checklist step-by-step:
1. Determine Candidate Type & Experience Rule:
   - If the candidate is a pure fresher (no prior work experience or experience < 1 year), do NOT mention years of experience in the email at all. Focus on projects, key skills, and learning speed.
   - If they have work experience, count it in their tech skills/niche and mention it accurately.
   - If the experience is predominantly internships or freelance work, refer to it explicitly as an internship or freelance role. Do NOT fabricate or estimate years.
2. Select the Best Single Resume Project:
   - Evaluate and score every single project in the candidate's profile against the target role's key requirements.
   - Select ONLY the highest-scoring project. Do NOT list multiple projects.
3. Identify Top 5 Job Description (JD) Keywords.
4. Identify Top Matching Skills: Map candidate's skills to the JD. Focus on highlighting exact technical alignment rather than raw-dumping skills.
5. Identify What should NOT be mentioned: Do not list missing skills, and do not use banned words.
6. Determine the Best Dynamic Opening Style and natural company context integration (utilizing the provided company summary).

ONLY after completing this internal reasoning evaluation, write the email. Do NOT output the evaluation or the checklist steps in the response; output ONLY the final JSON containing the subject and the written email body.

Strict Writing Rules:
Rule 1: Never summarize the resume. Give the recruiter a compelling reason to open the attached resume.
Rule 2: Choose exactly ONE project to highlight based on your scoring.
Rule 3: Mention only matching skills naturally (e.g. "The role's emphasis on backend services and scalable APIs aligns with my recent work building..."). Avoid raw lists of skills.
Rule 4: Never mention missing skills.
Rule 5: Banned Phrases (Violators will be rejected):
   - "I am writing to express my interest..."
   - "Throughout my career..."
   - "I am excited to apply..."
   - "Please find my resume/application attached..."
   - "Dear Hiring Manager"
Rule 6: Use a dynamic opening (e.g. "I came across the Software Engineer opening...", "Your backend engineering role caught my attention...", "After reading the responsibilities...").
Rule 7: Mention the company naturally. Do NOT say generic compliments like "I like [Company]". If the company summary is available, mention it naturally: ${JSON.stringify(jobIntelligence?.companySummary || '')}. If the company summary is generic or not available, do NOT mention it at all.
Rule 8: Salutation: If Recruiter Name is provided, use "Hi ${hrName},". If not, use "Hello Hiring Team," or "Hello ${companyName} Team,".
Rule 9: CTA & Sign-off:
   - Use exactly this combination of CTAs:
     "If you think my background fits your team, I'd be happy to discuss further.
     
     I'd appreciate your feedback even if my profile isn't selected. Your feedback will help me improve future applications."
   - Sign off naturally as:
     "Best regards,
     ${candidateName}"

Input Parameters:
- Candidate Name: ${candidateName}
- Target Company: ${companyName}
- Target Role: ${role}
- Recruiter / Contact Name: ${hrName || 'Not Available'}
- Candidate's Resume Profile:
${JSON.stringify(resumeVersion.intelligenceProfile || resumeVersion, null, 2)}
- Job Description Structured Profile:
${JSON.stringify(jobIntelligence, null, 2)}
- Resume ↔ Job Match Analysis:
${JSON.stringify(matchResult, null, 2)}
- Candidate's Additional Notes / Preferences: ${additionalNotes || 'None'}

Return a JSON object matching this exact schema:
{
  "subject": "string (a creative, specific, non-generic subject line that catches a recruiter's eye)",
  "body": "string (the complete email body text, fully formatted with paragraphs and line breaks)"
}

Do NOT wrap the output in markdown code blocks (\`\`\`json). Return ONLY the JSON object.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const retries = 3;
  let attempt = 0;

  while (attempt < retries) {
    attempt++;
    let response;
    try {
      response = await fetch(url, {
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
    } catch (fetchErr) {
      if (attempt < retries) {
        console.warn(`[AI Email Engine] Transient network error. Attempt ${attempt}/${retries}. Retrying in 2s...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      throw new Error(`TIMEOUT: ${fetchErr.message}`);
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('INVALID_API_KEY');
    }

    if (response.status === 400) {
      throw new Error('INVALID_PROMPT');
    }

    if (response.status === 429) {
      let waitMs = 15000;
      let isDailyLimit = false;
      try {
        const errJson = await response.clone().json();
        
        isDailyLimit = errJson.error?.details?.some(detail => 
          detail.violations?.some(v => v.quotaId?.includes('PerDay'))
        );
      } catch (e) {
        // failed to parse
      }

      if (isDailyLimit) {
        console.warn('[AI Email Engine] Daily Gemini API quota limit reached.');
        throw new Error('QUOTA_EXHAUSTED');
      }

      if (attempt < retries) {
        console.warn(`[AI Email Engine] Quota exceeded (429). Attempt ${attempt}/${retries}. Retrying in ${waitMs / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      throw new Error('QUOTA_EXHAUSTED');
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
      if (attempt < retries) {
        console.warn(`[AI Email Engine] JSON parse error. Attempt ${attempt}/${retries}. Retrying in 2s...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      throw new Error('JSON_PARSE_ERROR');
    }
  }
};

/**
 * Generate fallback email locally using structured heuristic synthesis
 */
const generateFallbackEmail = ({
  companyName,
  role,
  hrName,
  resumeVersion,
  jobIntelligence,
  matchResult,
  candidateName
}) => {
  console.log('[AI Email Engine] Generating high-quality fallback email draft locally using heuristic synthesizer...');

  const greeting = hrName ? `Hi ${hrName},` : `Hello ${companyName} Team,`;
  
  const profile = resumeVersion.intelligenceProfile || resumeVersion;
  const primaryRole = profile.primaryRole || 'Software Engineer';
  const experience = ((resumeVersion.experience || profile.yearsOfExperience || '').trim()) || '0 years';

  // 2. Parse experience years to determine Fresher vs Experienced vs Internship/Freelance
  const expStr = experience.toLowerCase();
  const match = expStr.match(/(\d+)/);
  const years = match ? parseInt(match[1]) : 0;
  
  const isFresher = years < 1 || expStr.includes('fresher') || expStr.includes('0 years');
  const isInternship = expStr.includes('intern');
  const isFreelance = expStr.includes('freelance');

  // 3. Extract and match skills
  let matchedSkillsList = [];
  const resumeSkills = profile.skills || [];
  const jobSkills = jobIntelligence?.requiredSkills || jobIntelligence?.technologies || [];
  
  if (matchResult && Array.isArray(matchResult.matchedSkills) && matchResult.matchedSkills.length > 0) {
    matchedSkillsList = matchResult.matchedSkills;
  } else {
    matchedSkillsList = resumeSkills.filter(s => 
      jobSkills.some(js => js.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(js.toLowerCase()))
    );
    if (matchedSkillsList.length === 0) {
      matchedSkillsList = resumeSkills.slice(0, 4);
    }
  }

  // 4. Project scoring algorithm
  let bestProject = null;
  const projects = profile.projects;
  if (Array.isArray(projects) && projects.length > 0) {
    let highestScore = -1;
    for (const proj of projects) {
      let score = 0;
      const techStack = proj.techStack || [];
      const descriptionText = (proj.description || '').toLowerCase();
      const nameText = (proj.name || '').toLowerCase();

      // score based on tech stack matches
      for (const tech of techStack) {
        if (jobSkills.some(js => js.toLowerCase() === tech.toLowerCase())) {
          score += 3;
        }
        if (matchedSkillsList.some(ms => ms.toLowerCase() === tech.toLowerCase())) {
          score += 2;
        }
      }
      
      // score based on description/name keyword matches
      for (const reqSkill of jobSkills) {
        if (descriptionText.includes(reqSkill.toLowerCase()) || nameText.includes(reqSkill.toLowerCase())) {
          score += 1;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestProject = proj;
      }
    }
  }

  // 5. Dynamic opening selection
  const openings = [
    `I came across the ${role} opening at ${companyName} and wanted to connect.`,
    `Your ${role} role at ${companyName} caught my attention, especially with the focus on building scalable systems.`,
    `After reading the engineering responsibilities for the ${role} position at ${companyName}, I decided to reach out.`
  ];
  const openingIndex = (role.length + companyName.length) % openings.length;
  const opening = openings[openingIndex];

  // 6. Natural company context integration (filter generic summaries)
  const isGenericSummary = !jobIntelligence?.companySummary || 
    jobIntelligence.companySummary.toLowerCase().includes('innovative organization') || 
    jobIntelligence.companySummary.toLowerCase().includes('delivering high-quality solutions');

  const companySummaryClean = !isGenericSummary
    ? jobIntelligence.companySummary.replace(new RegExp(`^${companyName}\\s+(is\\s+)?(an\\s+)?`, 'i'), '').replace(/\.$/, '')
    : '';

  const companyContext = companySummaryClean
    ? `Given ${companyName}'s work as ${companySummaryClean}, I believe my background aligns well with your team.`
    : `The engineering work being done at ${companyName} aligns closely with the type of technical environments I thrive in.`;

  // 7. Structure candidate type focus paragraphs & strict experience representation
  let focusParagraph = '';
  let expText = '';
  
  if (!isFresher) {
    if (isInternship) {
      expText = `with internship experience working with ${matchedSkillsList.slice(0, 3).join(', ')}`;
    } else if (isFreelance) {
      expText = `with freelance experience working with ${matchedSkillsList.slice(0, 3).join(', ')}`;
    } else {
      expText = `with ${experience} of experience working with ${matchedSkillsList.slice(0, 3).join(', ')}`;
    }
  } else {
    expText = `specializing in ${matchedSkillsList.slice(0, 3).join(', ')}`;
  }

  if (isFresher) {
    // Focus on: Projects -> Relevant Tech Stack -> Learning Ability -> Open Source
    const projectInfo = bestProject 
      ? `A great example of my practical experience is my project, "${bestProject.name}"—${(bestProject.description || '').replace(/\.$/, '')} using ${Array.isArray(bestProject.techStack) ? bestProject.techStack.join(', ') : 'modern frameworks'}.`
      : `I have spent my time building robust systems and mastering JavaScript, SQL, and other key tools.`;
      
    focusParagraph = `I am a ${primaryRole} ${expText}. ${projectInfo} I pick up new concepts quickly, focus on clean architecture, and am eager to apply my learning directly to your engineering stack.`;
  } else {
    // Focus on: Experience -> Achievements -> Metrics -> Relevant Project
    const projectInfo = bestProject 
      ? `A notable project I engineered is "${bestProject.name}" built with ${Array.isArray(bestProject.techStack) ? bestProject.techStack.join(', ') : 'modern tools'}, designed to solve scalable integration tasks.`
      : `I've previously focused on engineering high-performance features and improving system metrics.`;

    focusParagraph = `I'm a ${primaryRole} ${expText}. ${projectInfo} My career highlights include shipping stable, maintainable APIs and driving technical features to production.`;
  }

  // 8. Construct body
  const subject = `Application: ${role} - ${candidateName}`;
  const body = `${greeting}

${opening} ${companyContext}

${focusParagraph}

If you think my background fits your team, I'd be happy to discuss further.

I'd appreciate your feedback even if my profile isn't selected. Your feedback will help me improve future applications.

Best regards,

${candidateName}`;

  return { subject, body };
};

/**
 * Generates personalized email for a JobApplication and stores it in database
 */
const generateAndSavePersonalizedEmail = async (applicationId) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      resumeVersion: true,
      client: {
        include: {
          user: true
        }
      }
    }
  });

  if (!application) {
    throw new Error(`JobApplication ${applicationId} not found`);
  }

  const candidateName = application.client?.user?.name || 'Ashish Kumar';

  console.log(`[AI Email Engine] Generating personalized outreach email for application ${application.id} (Candidate: ${candidateName})...`);

  let emailPayload;
  try {
    emailPayload = await generateEmailWithAI({
      resumeVersion: application.resumeVersion,
      jobIntelligence: application.jobIntelligence,
      matchResult: application.matchResult,
      companyName: application.companyName,
      role: application.role,
      hrName: application.hrName,
      additionalNotes: application.additionalNotes,
      candidateName
    });
  } catch (err) {
    if (err.message === 'QUOTA_EXHAUSTED') {
      console.warn(`[AI Email Engine] Quota limit reached, running local fallback builder`);
      emailPayload = generateFallbackEmail({
        companyName: application.companyName,
        role: application.role,
        hrName: application.hrName,
        resumeVersion: application.resumeVersion,
        jobIntelligence: application.jobIntelligence,
        matchResult: application.matchResult,
        candidateName
      });
    } else {
      console.error(`[AI Email Engine] AI email generation failed critically with fatal error: ${err.message}`);
      throw err;
    }
  }

  // Update the application's subject and body
  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      subject: emailPayload.subject,
      emailContent: emailPayload.body
    }
  });

  console.log(`[AI Email Engine] Email draft generated and saved for application ${application.id} successfully.`);
  return updatedApplication;
};

module.exports = {
  generateEmailWithAI,
  generateFallbackEmail,
  generateAndSavePersonalizedEmail
};
