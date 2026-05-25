/**
 * AiGateway — Backend API Entry Point
 * Scaffold only. Full implementation in Phase 3.
 */

require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

// Health check — used by Docker + CI
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'aigw-backend',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

app.listen(PORT, () => {
  console.log(`[AiGateway Backend] Running on port ${PORT}`)
})

module.exports = app
