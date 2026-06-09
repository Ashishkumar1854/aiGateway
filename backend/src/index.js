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
    const { name, email, phone, company, industry, message } = req.body
    const lead = await prisma.lead.create({
      data: {
        companyName: company || 'Unknown',
        contactName: name,
        email,
        phone,
        industry,
        source: 'website_contact',
        notes: message,
        status: 'COLD',
        score: 10,
      }
    })
    return res.status(201).json({ success: true, data: lead })
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: 'Failed to submit' } })
  }
})

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
// Internal: trigger lead research agent
app.post('/api/v1/internal/lead-research', async (req, res) => {
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