const router = require('express').Router()
const { sendSuccess } = require('../../../utils/response')

// n8n webhook — no auth (uses secret header)
router.post('/n8n', async (req, res, next) => {
  try {
    const secret = req.headers['x-n8n-secret']
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } })
    }
    console.log('n8n webhook received:', req.body)
    return sendSuccess(res, { received: true })
  } catch(e) { next(e) }
})

// Razorpay webhook — will be completed in Phase 7
router.post('/razorpay', async (req, res, next) => {
  try {
    console.log('Razorpay webhook received:', req.body)
    return sendSuccess(res, { received: true })
  } catch(e) { next(e) }
})

module.exports = router