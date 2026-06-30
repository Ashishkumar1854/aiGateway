/**
 * Resume ↔ Job Match Engine Service
 * Compares structured Resume Intelligence Profiles against Job Intelligence Profiles
 * to calculate detailed suitability scores and matching metrics.
 */

const prisma = require('../../../../lib/prisma');
const resumeIntelligenceService = require('./resume-intelligence.service');
const jobIntelligenceService = require('./job-intelligence.service');
const emailGeneratorService = require('./email-generator.service');

/**
 * Call Gemini AI to perform structured profile matching
 */
const calculateMatch = async (intelligenceProfile, jobIntelligence) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
  }

  const prompt = `You are an expert AI Job Recruiter. Compare the candidate's Resume Intelligence Profile and the Job Intelligence Profile to calculate a detailed suitability match report.

Resume Profile:
${JSON.stringify(intelligenceProfile, null, 2)}

Job Profile:
${JSON.stringify(jobIntelligence, null, 2)}

Return a JSON object matching this exact schema:
{
  "overallScore": number (0-100, weighted overall match score),
  "resumeScore": number (0-100, score reflecting alignment of primary role and achievements),
  "skillsScore": number (0-100, score reflecting technology stack and skill requirements match),
  "experienceScore": number (0-100, score reflecting years of experience and work responsibilities match),
  "eligibilityScore": number (0-100, score reflecting location, visa, and work mode match),
  "recommendation": "string (one of: 'Highly Recommended', 'Good Fit', 'Average Fit', 'Not Recommended')",
  "skillsMatch": {
    "matched": ["string (skills/technologies present in both resume and job)"],
    "missing": ["string (skills/technologies requested in job but missing/not found in resume)"]
  },
  "experienceMatch": {
    "description": "string (1-2 sentence comparison of candidate's career level against role requirements)"
  },
  "eligibilityMatch": {
    "description": "string (1-2 sentence comparison of candidate's location, visa, and work mode preferences against job requirements)"
  },
  "reasoning": "string (a professional 2-3 sentence overview explaining why the candidate matches or does not match this role)"
}

Be analytical and objective. Do NOT wrap in markdown code blocks (\`\`\`json). Return ONLY the JSON object.`;

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
        console.warn('[Match Engine] Daily Gemini API quota limit reached. Proceeding to fallback.');
        throw new Error('Daily Gemini API quota limit reached');
      }

      if (attempt < retries) {
        console.warn(`[Match Engine] Quota exceeded (429). Attempt ${attempt}/${retries}. Retrying in ${waitMs / 1000}s...`);
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
 * Generate fallback match report locally using heuristic profile comparisons
 */
const generateFallbackMatch = (resume, job) => {
  console.log('[Match Engine] Generating dynamic fallback match report locally...');

  // Normalize lists
  const resumeSkills = [...(resume.skills || []), ...(resume.technologies || []), ...(resume.frameworks || [])].map(s => s.toLowerCase());
  const jobSkillsRequired = (job.requiredSkills || []).map(s => s.toLowerCase());
  const jobSkillsPreferred = (job.preferredSkills || []).map(s => s.toLowerCase());
  const allJobSkills = [...jobSkillsRequired, ...jobSkillsPreferred];

  // 1. Calculate Skills Match
  const matched = [];
  const missing = [];

  if (allJobSkills.length > 0) {
    allJobSkills.forEach(skill => {
      // Direct or partial match
      if (resumeSkills.some(r => r.includes(skill) || skill.includes(r))) {
        // Retrieve original casing
        const originalName = [...(job.requiredSkills || []), ...(job.preferredSkills || [])].find(s => s.toLowerCase() === skill) || skill;
        if (!matched.includes(originalName)) {
          matched.push(originalName);
        }
      } else {
        const originalName = [...(job.requiredSkills || []), ...(job.preferredSkills || [])].find(s => s.toLowerCase() === skill) || skill;
        if (!missing.includes(originalName)) {
          missing.push(originalName);
        }
      }
    });
  } else {
    // If job profile list is empty, default some skills check
    matched.push("General Professional Skills");
  }

  const totalJobSkills = allJobSkills.length || 1;
  const skillsScore = Math.min(Math.round((matched.length / totalJobSkills) * 100), 100);

  // 2. Calculate Resume/Role Match
  let resumeScore = 60; // base score
  const resumeRole = (resume.primaryRole || '').toLowerCase();
  const jobRole = (job.role || '').toLowerCase();
  if (resumeRole.includes(jobRole) || jobRole.includes(resumeRole)) {
    resumeScore = 95;
  } else if (resume.secondaryRoles?.some(r => r.toLowerCase().includes(jobRole))) {
    resumeScore = 80;
  }

  // 3. Experience Match
  let experienceScore = 70; // base score
  const resumeExp = (resume.yearsOfExperience || '').toLowerCase();
  const jobExp = (job.experienceRequired || '').toLowerCase();
  if (jobExp !== 'not specified' && resumeExp !== 'fresher') {
    const resumeYears = parseInt(resumeExp);
    const jobYears = parseInt(jobExp);
    if (!isNaN(resumeYears) && !isNaN(jobYears)) {
      if (resumeYears >= jobYears) {
        experienceScore = 95;
      } else {
        experienceScore = Math.max(50, 95 - (jobYears - resumeYears) * 15);
      }
    }
  }

  // 4. Eligibility Match
  let eligibilityScore = 80; // base
  const resumeWorkMode = 'remote'; // default assumption
  const jobWorkMode = (job.workMode || '').toLowerCase();
  if (jobWorkMode.includes('remote')) {
    eligibilityScore = 95;
  } else if (jobWorkMode.includes('hybrid')) {
    eligibilityScore = 85;
  }

  // Overall Score & Recommendation
  const overallScore = Math.round((resumeScore * 0.25) + (skillsScore * 0.35) + (experienceScore * 0.25) + (eligibilityScore * 0.15));
  
  let recommendation = 'Average Fit';
  if (overallScore >= 85) {
    recommendation = 'Highly Recommended';
  } else if (overallScore >= 70) {
    recommendation = 'Good Fit';
  } else if (overallScore < 50) {
    recommendation = 'Not Recommended';
  }

  return {
    overallScore,
    resumeScore,
    skillsScore,
    experienceScore,
    eligibilityScore,
    recommendation,
    skillsMatch: {
      matched,
      missing
    },
    experienceMatch: {
      description: `Candidate experience level is classified as ${resume.careerLevel || 'Entry'} (${resume.yearsOfExperience || 'Not Specified'}). The role requires ${job.experienceRequired || 'Not Specified'} experience.`
    },
    eligibilityMatch: {
      description: `Target work mode: ${job.workMode || 'Not Specified'} located in ${job.location || 'Not Specified'}.`
    },
    reasoning: `Match analysis indicates an overall rating of ${overallScore}% (${recommendation}). Candidate shows strong alignment in ${matched.slice(0, 3).join(', ') || 'general core skills'} with minor differences in other parameters.`
  };
};

/**
 * Calculates match result for a specific JobApplication draft and saves it
 */
const calculateAndSaveMatch = async (applicationId) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      resumeVersion: true
    }
  });

  if (!application) {
    throw new Error(`JobApplication ${applicationId} not found`);
  }

  let jobIntelligence = application.jobIntelligence;
  let intelligenceProfile = application.resumeVersion?.intelligenceProfile;

  // Self-heal: generate profiles if missing asynchronously/synchronously for matching dependency
  if (!jobIntelligence) {
    console.log(`[Match Engine] Job Intelligence missing on application ${application.id}. Enriching now...`);
    const enrichedJob = await jobIntelligenceService.generateAndSaveProfile(application.id);
    jobIntelligence = enrichedJob.jobIntelligence;
  }

  if (!intelligenceProfile) {
    console.log(`[Match Engine] Resume Intelligence missing on version ${application.resumeVersionId}. Enriching now...`);
    const enrichedResume = await resumeIntelligenceService.generateAndSaveProfile(application.resumeVersionId);
    intelligenceProfile = enrichedResume.intelligenceProfile;
  }

  console.log(`[Match Engine] Matching Resume Version ${application.resumeVersionId} against Job Application ${application.id}...`);

  let matchResult;
  try {
    matchResult = await calculateMatch(intelligenceProfile, jobIntelligence);
  } catch (err) {
    console.warn(`[Match Engine] AI matching failed, running local builder: ${err.message}`);
    matchResult = generateFallbackMatch(intelligenceProfile, jobIntelligence);
  }

  // Save matching metrics
  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      matchResult
    }
  });

  console.log(`[Match Engine] Matched successfully with score ${matchResult.overallScore}%`);

  // Hook: trigger AI Personalized Email generation asynchronously/sequentially in the background
  try {
    await emailGeneratorService.generateAndSavePersonalizedEmail(applicationId);
  } catch (err) {
    console.error(`[Match Engine] Background personalized email generation failed for application ${applicationId}:`, err.message);
  }

  return updatedApplication;
};

module.exports = {
  calculateMatch,
  generateFallbackMatch,
  calculateAndSaveMatch
};
