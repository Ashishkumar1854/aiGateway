const jwt = require('jsonwebtoken')

const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  })
}

const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  })
}

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }