const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check — Docker needs this
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'aigw-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// Version check
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    message: 'AiGateway API — Phase 1',
  })
})

app.listen(PORT, () => {
  console.log(`✅ AiGateway Backend running on port ${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health`)
})
