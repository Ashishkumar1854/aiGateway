const router = require('express').Router()
const controller = require('./bot.controller')

router.post('/query', controller.queryBot)
router.get('/suggestions', controller.getSuggestions)

module.exports = router
