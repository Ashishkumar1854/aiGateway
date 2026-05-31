const router = require('express').Router()
const { sendSuccess } = require('../../../utils/response')
const prisma = require('../../../lib/prisma')

// n8n → backend webhook (n8n calls this to update data)
router.post('/n8n', async (req, res, next) => {
  try {
    const secret = req.headers['x-n8n-secret']
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } })
    }

    const { event, data } = req.body
    console.log('n8n webhook received:', event)

    // Handle different n8n events
    switch (event) {
      case 'workflow.completed':
        await prisma.workflowLog.updateMany({
          where: { id: data.logId },
          data: { status: 'success', output: data.output, duration: data.duration }
        })
        break
      case 'workflow.failed':
        await prisma.workflowLog.updateMany({
          where: { id: data.logId },
          data: { status: 'failed', error: data.error }
        })
        break
      default:
        console.log('Unknown n8n event:', event)
    }

    return sendSuccess(res, { received: true, event })
  } catch (err) {
    next(err)
  }
})

// Razorpay webhook — Phase 8 billing
router.post('/razorpay', async (req, res, next) => {
  try {
    console.log('Razorpay webhook received:', req.body?.event)
    return sendSuccess(res, { received: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router