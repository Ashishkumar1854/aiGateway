/**
 * Smart Apply Routes Configuration
 * Defines HTTP endpoints, validation middlewares, and authorization guards.
 */

const router = require('express').Router();
const controller = require('./smart-apply.controller');
const { authenticate } = require('../../../../middleware/auth.middleware');
const { authorize } = require('../../../../middleware/rbac.middleware');
const {
  validateCreateResume,
  validateAddResumeVersion,
  validateCreateApplication,
  validateUpdateApplication,
  validateRecruiterFeedback,
  validateInterviewNote,
} = require('../validations/smart-apply.validation');

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

/**
 * Public Endpoint: Recruiter submits feedback.
 * Does not require client authentication.
 */
router.post(
  '/applications/:id/feedback',
  validateRecruiterFeedback,
  controller.submitFeedback
);

// ─── PROTECTED ROUTES (Client Context Only) ───────────────────────────────────

router.use(authenticate);
router.use(authorize('CLIENT'));

// Resumes
router.post('/resumes', validateCreateResume, controller.createResume);
router.get('/resumes', controller.listResumes);
router.get('/resumes/:id', controller.getResumeById);
router.post('/resumes/:id/versions', validateAddResumeVersion, controller.addResumeVersion);
router.put('/resumes/:id/versions/:versionId/current', controller.setCurrentVersion);

// Job Applications
router.post('/applications', validateCreateApplication, controller.createApplicationDraft);
router.get('/applications', controller.listApplications);
router.get('/applications/:id', controller.getApplicationById);
router.put('/applications/:id', validateUpdateApplication, controller.updateApplication);

// Interview notes
router.post('/applications/:id/interviews', validateInterviewNote, controller.addInterviewNote);
router.put('/applications/:id/interviews/:noteId', validateInterviewNote, controller.updateInterviewNote);

module.exports = router;
