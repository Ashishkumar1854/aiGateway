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