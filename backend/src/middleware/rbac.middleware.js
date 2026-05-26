const { sendError } = require('../utils/response')

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401)
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Access denied', 'FORBIDDEN', 403)
    }
    next()
  }
}

module.exports = { authorize }