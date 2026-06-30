/**
 * Smart Apply Phase 1 Types & Constants
 * Defines enums and typedefs used throughout the Smart Apply module.
 */

/**
 * @typedef {Object} ResumeProfile
 * @property {string} name - The human-readable name of the resume (e.g. "Frontend Developer")
 * @property {string} primaryRole - Primary targeted job role
 * @property {string[]} secondaryRoles - Secondary roles suitable for this resume
 * @property {string[]} skills - Array of technical/soft skills
 * @property {Array<Object>} projects - List of project details (name, description, techStack)
 * @property {string} experience - Description of experience level (e.g. "2 Years")
 * @property {Array<Object>} education - Structured education details
 * @property {string[]} certifications - List of certifications
 * @property {string[]} technologies - Highlighted technologies
 * @property {string[]} atsKeywords - Keywords optimised for ATS parsing
 * @property {string} pdfLocation - Local path or URL to the stored Resume PDF
 */

/**
 * @typedef {Object} ProjectDetail
 * @property {string} name - Project name
 * @property {string} description - Brief project summary
 * @property {string[]} techStack - Tech stack used
 */

/**
 * @typedef {Object} EducationDetail
 * @property {string} institution - Name of school/university
 * @property {string} degree - Degree earned (e.g. B.Tech)
 * @property {string} fieldOfStudy - Major/Niche (e.g. Computer Science)
 * @property {number} endYear - Year of graduation
 */

/**
 * Application Status Constants
 * Matches JobApplicationStatus database enum.
 */
const JobApplicationStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  OPENED: 'OPENED',
  FEEDBACK_RECEIVED: 'FEEDBACK_RECEIVED',
  REJECTED: 'REJECTED',
  INTERVIEW_ROUND_1: 'INTERVIEW_ROUND_1',
  INTERVIEW_ROUND_2: 'INTERVIEW_ROUND_2',
  FINAL_INTERVIEW: 'FINAL_INTERVIEW',
  OFFER_RECEIVED: 'OFFER_RECEIVED',
};

/**
 * Recruiter feedback options for redirect page.
 */
const RecruiterFeedbackType = {
  SKILLS_MISMATCH: 'SKILLS_MISMATCH',
  EXPERIENCE_MISMATCH: 'EXPERIENCE_MISMATCH',
  LOCATION_MISMATCH: 'LOCATION_MISMATCH',
  POSITION_FILLED: 'POSITION_FILLED',
  HIRING_CLOSED: 'HIRING_CLOSED',
  RESUME_IMPROVEMENT: 'RESUME_IMPROVEMENT',
  OTHER: 'OTHER',
};

module.exports = {
  JobApplicationStatus,
  RecruiterFeedbackType,
};
