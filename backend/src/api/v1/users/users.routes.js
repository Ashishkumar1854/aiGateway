const router = require('express').Router()
const controller = require('./users.controller')
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')

router.use(authenticate)
router.get('/', authorize('ADMIN'), controller.getAll)
router.get('/:id', authorize('ADMIN', 'EMPLOYEE'), controller.getById)
router.put('/:id', authorize('ADMIN'), controller.update)
router.delete('/:id', authorize('ADMIN'), controller.remove)

module.exports = router