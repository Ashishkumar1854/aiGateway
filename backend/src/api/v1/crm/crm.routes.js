const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const crm = require('./crm.service')

router.use(authenticate)

// Leads
router.get('/leads', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await crm.getLeads(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/leads', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.createLead(req.body), 'Lead created', 201) } catch(e) { next(e) }
})
router.get('/leads/:id', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.getLeadById(req.params.id)) } catch(e) { next(e) }
})
router.put('/leads/:id', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.updateLead(req.params.id, req.body), 'Lead updated') } catch(e) { next(e) }
})
router.put('/leads/:id/stage', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.updateLeadStage(req.params.id, req.body.status), 'Stage updated') } catch(e) { next(e) }
})
router.delete('/leads/:id', authorize('ADMIN'), async (req, res, next) => {
  try { await crm.deleteLead(req.params.id); return sendSuccess(res, null, 'Lead deleted') } catch(e) { next(e) }
})

// Pipeline (kanban data)
router.get('/pipeline', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.getPipeline()) } catch(e) { next(e) }
})

// Conversations
router.post('/conversations', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.addConversation(req.body), 'Conversation added', 201) } catch(e) { next(e) }
})

// Meetings
router.get('/meetings', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await crm.getMeetings(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/meetings', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.createMeeting(req.body), 'Meeting created', 201) } catch(e) { next(e) }
})

module.exports = router