const router = require('express').Router()
const controller = require('./auth.controller')
const { authenticate } = require('../../../middleware/auth.middleware')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
router.get('/me', authenticate, controller.getMe)

module.exports = router