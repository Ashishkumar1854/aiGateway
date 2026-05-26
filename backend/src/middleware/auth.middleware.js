const { verifyAccessToken } = require('../utils/jwt')
const { sendError } = require('../utils/response')

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 'UNAUTHORIZED', 401)
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 'UNAUTHORIZED', 401)
  }
}

module.exports = { authenticate }