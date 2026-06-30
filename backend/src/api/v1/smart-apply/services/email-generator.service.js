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
  additionalNotes
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  const prompt = `You are a world-class professional recruiter and career coach. Write a highly personalized, unique, and natural job application email.
Avoid templates or repetitive structures. Write it as if you personally composed it specifically for this company and role.

Input Parameters:
- Candidate's Resume Profile:
${JSON.stringify(resumeVersion.intelligenceProfile || resumeVersion, null, 2)}
- Job Description Profile:
${JSON.stringify(jobIntelligence, null, 2)}
- Resume ↔ Job Match Analysis:
${JSON.stringify(matchResult, null, 2)}
- Target Company: ${companyName}
- Target Role: ${role}
- Recruiter / Contact Name: ${hrName || 'Not Available'}
- Candidate's Additional Notes / Preferences: ${additionalNotes || 'None'}

Formatting & Writing Rules:
1. Subject Line: Create a compelling, professional subject line.
2. Greeting: Use a personalized greeting. If Recruiter Name is provided, use "Dear [Recruiter Name],". If not, use "Dear Hiring Team,".
3. Introduction: Write a strong, customized introduction outlining interest in ${companyName} for the ${role} position.
4. Experience & Projects: Highlight the most relevant experience and projects mentioned in the candidate's Resume Profile that align with the Job Profile and Technologies.
5. Skills & Strengths: Emphasize key strengths and overlapping technology stack. Do NOT mention any missing skills identified in the match analysis.
6. Professional Tone: Read naturally, avoiding generic template-like text or excessive resume bullet repetition.
7. CTA Footer Requirement: You MUST end the email naturally with this exact CTA text:
"I'd appreciate your feedback even if my profile isn't selected. Your feedback will help me improve future applications."
8. Professional Closing & Signature: Conclude with a clean sign-off (e.g. "Best regards,") and placeholders for the candidate name.

Return a JSON object matching this exact schema:
{
  "subject": "string (the customized subject line)",
  "body": "string (the complete email body text)"
}

Do NOT wrap the output in markdown code blocks (\`\`\`json). Return ONLY the JSON object.`;

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
        console.warn('[AI Email Engine] Daily Gemini API quota limit reached. Proceeding to fallback.');
        throw new Error('Daily Gemini API quota limit reached');
      }

      if (attempt < retries) {
        console.warn(`[AI Email Engine] Quota exceeded (429). Attempt ${attempt}/${retries}. Retrying in ${waitMs / 1000}s...`);
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
 * Generate fallback email locally using structured heuristic synthesis
 */
const generateFallbackEmail = ({
  companyName,
  role,
  hrName,
  resumeVersion,
  jobIntelligence
}) => {
  console.log('[AI Email Engine] Generating fallback email draft locally...');
  
  const greeting = hrName ? `Dear ${hrName},` : 'Dear Hiring Team,';
  
  // Highlight candidate's primary role and key skills
  const primaryRole = resumeVersion.primaryRole || 'Software Professional';
  const matchSkills = (resumeVersion.skills || []).slice(0, 4).join(', ');
  const technologies = (jobIntelligence?.technologies || []).slice(0, 3).join(', ') || 'modern stacks';

  const subject = `Application for ${role} position - ${companyName}`;
  const body = `${greeting}

I am writing to express my strong interest in the ${role} position at ${companyName}. As a qualified ${primaryRole} with practical experience building software systems, I believe my background aligns well with your team's goals.

Throughout my career, I have developed applications using ${matchSkills}. I am familiar with working on complex engineering tasks and am eager to contribute to the technologies utilized by ${companyName}, including ${technologies}.

I'd appreciate your feedback even if my profile isn't selected. Your feedback will help me improve future applications.

Thank you for your time and consideration.

Best regards,
[Candidate Name]`;

  return { subject, body };
};

/**
 * Generates personalized email for a JobApplication and stores it in database
 */
const generateAndSavePersonalizedEmail = async (applicationId) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      resumeVersion: true
    }
  });

  if (!application) {
    throw new Error(`JobApplication ${applicationId} not found`);
  }

  console.log(`[AI Email Engine] Generating personalized outreach email for application ${application.id}...`);

  let emailPayload;
  try {
    emailPayload = await generateEmailWithAI({
      resumeVersion: application.resumeVersion,
      jobIntelligence: application.jobIntelligence,
      matchResult: application.matchResult,
      companyName: application.companyName,
      role: application.role,
      hrName: application.hrName,
      additionalNotes: application.additionalNotes
    });
  } catch (err) {
    console.warn(`[AI Email Engine] AI generation failed, running local builder: ${err.message}`);
    emailPayload = generateFallbackEmail({
      companyName: application.companyName,
      role: application.role,
      hrName: application.hrName,
      resumeVersion: application.resumeVersion,
      jobIntelligence: application.jobIntelligence
    });
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
