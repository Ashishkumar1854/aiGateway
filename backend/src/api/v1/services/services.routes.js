const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const prisma = require('../../../lib/prisma')
const { sendSuccess } = require('../../../utils/response')
const service = require('./services.service')

router.use(authenticate)
router.get('/', async (req, res, next) => {
  try { return sendSuccess(res, await service.getAll()) } catch(e) { next(e) }
})
router.get('/:id', async (req, res, next) => {
  try { return sendSuccess(res, await service.getById(req.params.id)) } catch(e) { next(e) }
})
router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.create(req.body), 'Service created', 201) } catch(e) { next(e) }
})
router.put('/:id', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.update(req.params.id, req.body), 'Service updated') } catch(e) { next(e) }
})

module.exports = router