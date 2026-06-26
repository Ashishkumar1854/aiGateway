const router = require('express').Router()
const controller = require('./clients.controller')
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')

router.use(authenticate)
router.get('/', authorize('ADMIN', 'EMPLOYEE'), controller.getAll)
router.post('/', authorize('ADMIN'), controller.create)
router.get('/:id', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getById)
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), controller.update)
router.delete('/:id', authorize('ADMIN'), controller.remove)
router.get('/:id/services', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getServices)
router.get('/:id/onboarding-history', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getOnboardingHistory)
router.post('/:id/services', authorize('ADMIN'), controller.assignService)

// Client workspace endpoints
router.get('/:id/leads', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getLeads)
router.post('/:id/leads', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.createLead)
router.get('/:id/outreach-logs', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getOutreachLogs)
router.post('/:id/outreach-logs', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.createOutreachLog)
router.post('/:id/job-seeker/apply', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.applyJobSeeker)
router.post('/:id/lead-generation/search', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.triggerLeadSearch)

module.exports = router