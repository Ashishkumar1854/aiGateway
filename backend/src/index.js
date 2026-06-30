const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middleware/error.middleware')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://aigw.local',
    'http://app.aigw.local',
    'http://admin.aigw.local'
  ],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check — no auth
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'aigw-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Public contact form endpoint — no auth required
app.post('/api/v1/public/contact', async (req, res) => {
  try {
    const prisma = require('./lib/prisma')
    const { name, email, phone, company, industry, message, companyName, contactName, notes } = req.body
    const lead = await prisma.lead.create({
      data: {
        companyName: company || companyName || 'Unknown',
        contactName: name || contactName,
        email,
        phone,
        industry,
        source: 'website_contact',
        notes: message || notes,
        status: 'COLD',
        score: 10,
      }
    })

    const n8nService = require('./services/n8n.service')
    if (n8nService && typeof n8nService.triggerLeadIntake === 'function') {
      n8nService.triggerLeadIntake(lead).catch(console.warn)
    }

    return res.status(201).json({ success: true, data: lead })
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: 'Failed to submit' } })
  }
})

// Bespoke freelancer/IT project request endpoint — no auth required
app.post('/api/v1/public/other-services', async (req, res) => {
  try {
    const prisma = require('./lib/prisma')
    const { companyName, contactName, email, phone, projectName, requirements, budget } = req.body
    
    const notesJSON = JSON.stringify({
      projectName: projectName || 'Bespoke Automation Project',
      requirements: requirements || '',
      budget: budget || 'Not Specified'
    })

    const lead = await prisma.lead.create({
      data: {
        companyName: companyName || 'Unknown',
        contactName: contactName || 'Unknown',
        email,
        phone,
        source: 'other_services',
        notes: notesJSON,
        status: 'COLD',
        score: 25,
      }
    })
    
    const n8nService = require('./services/n8n.service')
    if (n8nService && typeof n8nService.triggerLeadIntake === 'function') {
      n8nService.triggerLeadIntake(lead).catch(console.warn)
    }

    return res.status(201).json({ success: true, data: lead })
  } catch (err) {
    console.error("Failed to submit custom request:", err)
    return res.status(500).json({ success: false, error: { message: 'Failed to submit custom request' } })
  }
})

// Public onboarding form — no auth (Phase 14A)
app.post('/api/v1/public/onboarding', require('./api/v1/onboarding/onboarding.service').submitOnboarding)

// Routes
app.use('/api/v1/auth',          require('./api/v1/auth/auth.routes'))
app.use('/api/v1/users',         require('./api/v1/users/users.routes'))
app.use('/api/v1/clients',       require('./api/v1/clients/clients.routes'))
app.use('/api/v1/services',      require('./api/v1/services/services.routes'))
app.use('/api/v1/subscriptions', require('./api/v1/subscriptions/subscriptions.routes'))
app.use('/api/v1/crm',           require('./api/v1/crm/crm.routes'))
app.use('/api/v1/agents',        require('./api/v1/agents/agents.routes'))
app.use('/api/v1/workflows',     require('./api/v1/workflows/workflows.routes'))
app.use('/api/v1/webhooks',      require('./api/v1/webhooks/webhooks.routes'))
app.use('/api/v1/bot',           require('./api/v1/bot/bot.routes'))
app.use('/api/v1/onboarding',    require('./api/v1/onboarding/onboarding.routes'))
app.use('/api/v1/smart-apply',   require('./api/v1/smart-apply/api/smart-apply.routes'))
// Internal routes
const { authenticate } = require('./middleware/auth.middleware')

// Internal: trigger lead research agent
app.post('/api/v1/internal/lead-research', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'
    
    const response = await fetch(`${AI_WORKERS_URL}/agents/lead-research/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: trigger email outreach agent
app.post('/api/v1/internal/email-outreach', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'
    
    const response = await fetch(`${AI_WORKERS_URL}/agents/email-outreach/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: trigger linkedin outreach agent
app.post('/api/v1/internal/linkedin-outreach', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'
    
    const response = await fetch(`${AI_WORKERS_URL}/agents/linkedin-outreach/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: trigger meeting agent for a specific lead
app.post('/api/v1/internal/meeting-agent', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'

    // Fetch lead conversations from DB to send to agent
    const prisma = require('./lib/prisma')
    const leadId = req.body.lead_id || req.body.leadId

    let conversations = []
    if (leadId) {
      const lead = await prisma.lead.findFirst({
        where: { id: leadId },
        include: {
          conversations: {
            orderBy: { sentAt: 'desc' },
            take: 10,
          }
        }
      })
      conversations = lead?.conversations || []
    }

    const response = await fetch(`${AI_WORKERS_URL}/agents/meeting/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify({
        lead_id: leadId,
        lead_data: req.body.lead_data,
        conversations,
      }),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: run orchestrator for a single lead
app.post('/api/v1/internal/orchestrator/run', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'

    const response = await fetch(`${AI_WORKERS_URL}/orchestrator/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: bulk orchestration
app.post('/api/v1/internal/orchestrator/bulk', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'

    const response = await fetch(`${AI_WORKERS_URL}/orchestrator/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ai-workers-secret': AI_WORKERS_SECRET,
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// Internal: orchestrator status for a lead
app.get('/api/v1/internal/orchestrator/status/:leadId', authenticate, async (req, res) => {
  try {
    const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
    const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'

    const response = await fetch(
      `${AI_WORKERS_URL}/orchestrator/status/${req.params.leadId}`,
      {
        headers: { 'x-ai-workers-secret': AI_WORKERS_SECRET },
      }
    )
    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.path} not found` } })
})

// Centralized error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ AiGateway Backend running on port ${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health`)
  console.log(`   API:    http://localhost:${PORT}/api/v1`)
})