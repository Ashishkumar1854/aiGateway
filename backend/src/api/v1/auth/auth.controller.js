const authService = require('./auth.service')
const { sendSuccess, sendError } = require('../../../utils/response')

const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body)
    return sendSuccess(res, result, 'Account created successfully', 201)
  } catch (err) { next(err) }
}

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body)
    return sendSuccess(res, result, 'Login successful')
  } catch (err) { next(err) }
}

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return sendError(res, 'Refresh token required', 'VALIDATION_ERROR', 400)
    const result = await authService.refresh(refreshToken)
    return sendSuccess(res, result)
  } catch (err) { next(err) }
}

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    await authService.logout(refreshToken)
    return sendSuccess(res, null, 'Logged out successfully')
  } catch (err) { next(err) }
}

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id)
    return sendSuccess(res, user)
  } catch (err) { next(err) }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return sendError(res, 'Email is required', 'VALIDATION_ERROR', 400)
    const result = await authService.forgotPassword({ email })
    return sendSuccess(res, result, 'Password reset link simulated in console log')
  } catch (err) { next(err) }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return sendError(res, 'Token and password are required', 'VALIDATION_ERROR', 400)
    const result = await authService.resetPassword({ token, password })
    return sendSuccess(res, result, 'Password reset successful')
  } catch (err) { next(err) }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword
}