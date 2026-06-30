/**
 * Resume Service Layer
 * Coordinates business logic and triggers actual n8n AI parsing for resume versions.
 */

const resumeRepository = require('../repositories/resume.repository');
const n8nService = require('../../../../services/n8n.service');

/**
 * Triggers n8n parsing webhook to extract structured info from PDF
 */
const parseResumePDF = async (pdfLocation) => {
  const n8nResult = await n8nService.triggerWebhook('3Jxy2Gvm0Ry6FEWy/webhook-trigger/resume-upload', {
    pdfLocation,
  });

  if (!n8nResult.success || !n8nResult.data || !n8nResult.data.resumeProfile) {
    const errorMsg = n8nResult.data?.error || n8nResult.error || 'Invalid profile data returned';
    console.error('[Resume Service] Parsing failed:', errorMsg);
    throw {
      statusCode: 502,
      code: 'PARSING_FAILED',
      message: `Failed to parse resume PDF via automation webhook: ${errorMsg}`,
    };
  }

  // Ensure pdfLocation is returned along with the parsed profile fields
  return {
    ...n8nResult.data.resumeProfile,
    pdfLocation,
  };
};

/**
 * Creates a base Resume and parses/saves the first version
 */
const uploadAndCreateResume = async (clientId, resumeName, pdfLocation) => {
  // Parse PDF structured information using active n8n parser webhook
  const structuredData = await parseResumePDF(pdfLocation);

  return resumeRepository.createResume(
    clientId,
    { name: resumeName },
    structuredData
  );
};

/**
 * Lists all client resumes
 */
const getClientResumes = async (clientId) => {
  return resumeRepository.findResumesByClient(clientId);
};

/**
 * Retrieves a resume profile details including its version list
 */
const getResumeDetails = async (id, clientId) => {
  const resume = await resumeRepository.findResumeById(id, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }
  return resume;
};

/**
 * Adds a new version of the resume and parses it once
 */
const addResumeVersion = async (resumeId, clientId, pdfLocation) => {
  // 1. Verify resume ownership
  const resume = await resumeRepository.findResumeById(resumeId, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }

  // 2. Parse PDF structured information using active n8n parser webhook
  const structuredData = await parseResumePDF(pdfLocation);

  // 3. Create the version
  return resumeRepository.createResumeVersion(resumeId, structuredData);
};

/**
 * Sets a specific resume version as active
 */
const selectActiveVersion = async (resumeId, clientId, versionId) => {
  // Verify resume ownership
  const resume = await resumeRepository.findResumeById(resumeId, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }

  return resumeRepository.setCurrentVersion(resumeId, versionId);
};

module.exports = {
  uploadAndCreateResume,
  getClientResumes,
  getResumeDetails,
  addResumeVersion,
  selectActiveVersion,
};
