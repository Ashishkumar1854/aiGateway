const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const service = require('./subscriptions.service')

router.use(authenticate)
router.get('/', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.create(req.body), 'Subscription created', 201) } catch(e) { next(e) }
})
router.get('/:id', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), async (req, res, next) => {
  try { return sendSuccess(res, await service.getById(req.params.id)) } catch(e) { next(e) }
})
router.put('/:id/cancel', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.cancel(req.params.id), 'Subscription cancelled') } catch(e) { next(e) }
})

module.exports = router