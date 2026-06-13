const router = require('express').Router()
const controller = require('./onboarding.controller')
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')

// ─── Admin routes (auth required + ADMIN role) ───
router.use(authenticate)

router.get('/',
  authorize('ADMIN', 'EMPLOYEE'),
  controller.list
)

router.get('/my-services',
  authorize('CLIENT'),
  controller.myServices
)

router.get('/:id',
  authorize('ADMIN', 'EMPLOYEE'),
  controller.getById
)

router.post('/:id/activate',
  authorize('ADMIN'),
  controller.activate
)

router.post('/:id/convert',
  authorize('ADMIN'),
  controller.convert
)

router.post('/:id/reject',
  authorize('ADMIN'),
  controller.reject
)

module.exports = router
