/**
 * Smart Apply Controller Layer
 * Handles routing handlers, maps HTTP requests to service calls, and formats standard responses.
 */

const resumeService = require('../services/resume.service');
const applicationService = require('../services/application.service');
const { sendSuccess, sendError } = require('../../../../utils/response');
const prisma = require('../../../../lib/prisma');

/**
 * Helper to resolve Client ID from req.user
 */
const getClientId = async (userId) => {
  const client = await prisma.client.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!client) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Client profile not found for this user.' };
  }
  return client.id;
};

// ─── RESUMES ─────────────────────────────────────────────────────────────────

const createResume = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const { name, pdfLocation } = req.body;
    const data = await resumeService.uploadAndCreateResume(clientId, name, pdfLocation);
    return sendSuccess(res, data, 'Resume profile created successfully with version 1', 201);
  } catch (err) {
    next(err);
  }
};

const listResumes = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await resumeService.getClientResumes(clientId);
    return sendSuccess(res, data, 'Client resumes retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getResumeById = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await resumeService.getResumeDetails(req.params.id, clientId);
    return sendSuccess(res, data, 'Resume details retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const addResumeVersion = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const { pdfLocation } = req.body;
    const data = await resumeService.addResumeVersion(req.params.id, clientId, pdfLocation);
    return sendSuccess(res, data, 'New resume version added and parsed successfully', 201);
  } catch (err) {
    next(err);
  }
};

const setCurrentVersion = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const { versionId } = req.params;
    const data = await resumeService.selectActiveVersion(req.params.id, clientId, versionId);
    return sendSuccess(res, data, 'Active resume version updated successfully');
  } catch (err) {
    next(err);
  }
};

// ─── JOB APPLICATIONS ────────────────────────────────────────────────────────

const createApplicationDraft = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await applicationService.createApplicationDraft(clientId, req.body);
    return sendSuccess(res, data, 'Job Application draft created successfully with initial tracking timeline', 201);
  } catch (err) {
    next(err);
  }
};

const listApplications = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const { status, search } = req.query;
    const data = await applicationService.getClientApplications(clientId, { status, search });
    return sendSuccess(res, data, 'Client job applications retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await applicationService.getApplicationDetails(req.params.id, clientId);
    return sendSuccess(res, data, 'Job application details retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await applicationService.updateApplicationDetails(req.params.id, clientId, req.body);
    return sendSuccess(res, data, 'Job application updated successfully');
  } catch (err) {
    next(err);
  }
};

const submitFeedback = async (req, res, next) => {
  try {
    const { feedbackType, feedbackText } = req.body;
    const data = await applicationService.submitRecruiterFeedback(req.params.id, feedbackType, feedbackText);
    return sendSuccess(res, data, 'Feedback submitted successfully');
  } catch (err) {
    next(err);
  }
};

const addInterviewNote = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const data = await applicationService.addApplicationInterviewRound(req.params.id, clientId, req.body);
    return sendSuccess(res, data, 'Interview round notes added successfully', 201);
  } catch (err) {
    next(err);
  }
};

const updateInterviewNote = async (req, res, next) => {
  try {
    const clientId = await getClientId(req.user.id);
    const { noteId } = req.params;
    const data = await applicationService.updateApplicationInterviewRound(req.params.id, clientId, noteId, req.body);
    return sendSuccess(res, data, 'Interview round notes updated successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createResume,
  listResumes,
  getResumeById,
  addResumeVersion,
  setCurrentVersion,
  createApplicationDraft,
  listApplications,
  getApplicationById,
  updateApplication,
  submitFeedback,
  addInterviewNote,
  updateInterviewNote,
};
