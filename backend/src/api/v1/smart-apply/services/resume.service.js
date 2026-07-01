const resumeRepository = require('../repositories/resume.repository');
const n8nService = require('../../../../services/n8n.service');
const resumeIntelligenceService = require('./resume-intelligence.service');

/**
 * Triggers n8n parsing webhook to extract structured info from PDF
 */
const parseResumePDF = async (pdfLocation) => {
  const n8nResult = await n8nService.triggerWebhook('3Jxy2Gvm0Ry6FEWy/webhook-trigger/resume-upload', {
    pdfLocation,
  });

  if (!n8nResult.success || !n8nResult.data || n8nResult.data.success === false) {
    const errorMsg = n8nResult.data?.error || n8nResult.error || 'Invalid profile data returned';
    console.error('[Resume Service] Parsing failed:', errorMsg);
    throw new Error(errorMsg);
  }

  // Ensure pdfLocation is returned along with the parsed profile fields
  return {
    ...n8nResult.data.resumeProfile,
    pdfLocation,
  };
};

/**
 * Performs n8n parsing and intelligence enrichment in the background
 */
const runBackgroundParse = async (versionId) => {
  console.log(`[Resume Service] Starting background parsing for version ${versionId}...`);
  try {
    // 1. Update status to PROCESSING
    await resumeRepository.updateResumeVersionParseResult(versionId, {
      parseStatus: 'PROCESSING'
    });

    const version = await resumeRepository.findResumeVersionById(versionId);
    if (!version) return;

    // 2. Call n8n parser
    const parsedData = await parseResumePDF(version.pdfLocation);

    // 3. Save parsed details and set COMPLETED
    await resumeRepository.updateResumeVersionParseResult(versionId, {
      ...parsedData,
      parseStatus: 'COMPLETED',
      parseError: null
    });

    // 4. Trigger resume intelligence profile generation
    await resumeIntelligenceService.generateAndSaveProfile(versionId);
    console.log(`[Resume Service] Background parsing and intelligence complete for version ${versionId}.`);
  } catch (err) {
    console.error(`[Resume Service] Background parsing failed for version ${versionId}:`, err.message);
    await resumeRepository.updateResumeVersionParseResult(versionId, {
      parseStatus: 'FAILED',
      parseError: err.message || 'Unknown parsing failure.'
    }).catch(dbErr => console.error('[Resume Service] Failed to save parse error state:', dbErr.message));
  }
};

/**
 * Creates a base Resume and parses/saves the first version in background
 */
const uploadAndCreateResume = async (clientId, resumeName, pdfLocation) => {
  const result = await resumeRepository.createResume(
    clientId,
    { name: resumeName },
    { pdfLocation, parseStatus: 'PENDING' }
  );

  const initialVersion = result.versions?.[0];
  if (initialVersion) {
    runBackgroundParse(initialVersion.id).catch(err => {
      console.error('[Resume Service] Async parsing launch failed:', err.message);
    });
  }

  return result;
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
 * Adds a new version of the resume and parses it in background
 */
const addResumeVersion = async (resumeId, clientId, pdfLocation) => {
  const resume = await resumeRepository.findResumeById(resumeId, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }

  const newVersion = await resumeRepository.createResumeVersion(resumeId, {
    pdfLocation,
    parseStatus: 'PENDING'
  });

  runBackgroundParse(newVersion.id).catch(err => {
    console.error('[Resume Service] Async parsing launch failed:', err.message);
  });

  return newVersion;
};

/**
 * Sets a specific resume version as active
 */
const selectActiveVersion = async (resumeId, clientId, versionId) => {
  const resume = await resumeRepository.findResumeById(resumeId, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }

  return resumeRepository.setCurrentVersion(resumeId, versionId);
};

/**
 * Retries parsing for a failed ResumeVersion
 */
const retryResumeVersionParsing = async (resumeId, clientId, versionId) => {
  const resume = await resumeRepository.findResumeById(resumeId, clientId);
  if (!resume) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume profile not found' };
  }

  const version = await resumeRepository.findResumeVersionById(versionId, clientId);
  if (!version) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Selected resume version not found' };
  }

  // Set parseStatus to 'RETRYING' synchronously before calling async background parsing
  await resumeRepository.updateResumeVersionParseResult(versionId, {
    parseStatus: 'RETRYING',
    parseError: null
  });

  runBackgroundParse(versionId).catch(err => {
    console.error('[Resume Service] Async parsing launch failed:', err.message);
  });

  return { success: true, message: 'Parsing retry task triggered successfully.' };
};

module.exports = {
  uploadAndCreateResume,
  getClientResumes,
  getResumeDetails,
  addResumeVersion,
  selectActiveVersion,
  retryResumeVersionParsing,
};
