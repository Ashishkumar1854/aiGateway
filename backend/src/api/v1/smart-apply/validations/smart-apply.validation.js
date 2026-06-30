/**
 * Smart Apply Input Validation Middleware
 */

const { JobApplicationStatus, RecruiterFeedbackType } = require('../types/smart-apply.types');

/**
 * Helper to check valid email
 */
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Middleware validator for creating a new Resume profile
 */
const validateCreateResume = (req, res, next) => {
  const { name, pdfLocation } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'name is required and must be a non-empty string' }
    });
  }

  if (!pdfLocation || typeof pdfLocation !== 'string' || pdfLocation.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'pdfLocation is required and must be a valid file path or URL' }
    });
  }

  next();
};

/**
 * Middleware validator for adding a new version to an existing Resume
 */
const validateAddResumeVersion = (req, res, next) => {
  const { pdfLocation } = req.body;

  if (!pdfLocation || typeof pdfLocation !== 'string' || pdfLocation.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'pdfLocation is required and must be a valid file path or URL' }
    });
  }

  next();
};

/**
 * Middleware validator for creating a new Job Application draft
 */
const validateCreateApplication = (req, res, next) => {
  const { resumeVersionId, companyName, role, hrEmail } = req.body;

  if (!resumeVersionId || typeof resumeVersionId !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'resumeVersionId is required' }
    });
  }

  if (!companyName || typeof companyName !== 'string' || companyName.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'companyName is required and must be a non-empty string' }
    });
  }

  if (!role || typeof role !== 'string' || role.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'role is required and must be a non-empty string' }
    });
  }

  if (!hrEmail || !isValidEmail(hrEmail)) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'hrEmail is required and must be a valid email address' }
    });
  }

  next();
};

/**
 * Middleware validator for updating application fields or status
 */
const validateUpdateApplication = (req, res, next) => {
  const { status, hrEmail } = req.body;

  if (status && !JobApplicationStatus[status]) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: `Invalid status. Must be one of: ${Object.keys(JobApplicationStatus).join(', ')}` }
    });
  }

  if (hrEmail && !isValidEmail(hrEmail)) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'hrEmail must be a valid email address' }
    });
  }

  next();
};

/**
 * Middleware validator for recruiter feedback submissions
 */
const validateRecruiterFeedback = (req, res, next) => {
  const { feedbackType, feedbackText } = req.body;

  if (!feedbackType || !RecruiterFeedbackType[feedbackType]) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: `feedbackType is required and must be one of: ${Object.keys(RecruiterFeedbackType).join(', ')}` }
    });
  }

  if (feedbackText && typeof feedbackText !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'feedbackText must be a string value' }
    });
  }

  next();
};

/**
 * Middleware validator for creating/updating interview round notes
 */
const validateInterviewNote = (req, res, next) => {
  const { roundName } = req.body;

  if (!roundName || typeof roundName !== 'string' || roundName.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'roundName is required and must be a non-empty string' }
    });
  }

  next();
};

module.exports = {
  validateCreateResume,
  validateAddResumeVersion,
  validateCreateApplication,
  validateUpdateApplication,
  validateRecruiterFeedback,
  validateInterviewNote,
};
