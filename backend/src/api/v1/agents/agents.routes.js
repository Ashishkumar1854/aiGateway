const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const agents = require('./agents.service')

router.use(authenticate)

router.get('/stats', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.getAgentStats()) } catch(e) { next(e) }
})
router.get('/tasks', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await agents.getTasks(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/tasks', authorize('ADMIN', 'EMPLOYEE', 'AI_AGENT'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.createTask(req.body), 'Task created', 201) } catch(e) { next(e) }
})
router.put('/tasks/:id/approve', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.approveTask(req.params.id, req.user.id), 'Task approved') } catch(e) { next(e) }
})
router.put('/tasks/:id/reject', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.rejectTask(req.params.id, req.user.id, req.body.reason), 'Task rejected') } catch(e) { next(e) }
})
router.get('/logs', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await agents.getLogs(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.get('/memory/:leadId', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.getMemory(req.params.leadId)) } catch(e) { next(e) }
})

module.exports = router