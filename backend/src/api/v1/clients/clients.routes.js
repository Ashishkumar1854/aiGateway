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
router.post('/:id/services', authorize('ADMIN'), controller.assignService)

module.exports = router