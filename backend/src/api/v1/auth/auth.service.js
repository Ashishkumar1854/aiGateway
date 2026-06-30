const bcrypt = require('bcryptjs')
const prisma = require('../../../lib/prisma')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../utils/jwt')

// In-memory reset password tokens store
const resetTokens = new Map()

const signup = async ({ name, email, password, role = 'CLIENT' }) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw { statusCode: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role })
  const refreshToken = signRefreshToken({ id: user.id })

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  return { user, accessToken, refreshToken }
}

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    include: { client: true }
  })
  if (!user) throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw { statusCode: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role })
  const refreshToken = signRefreshToken({ id: user.id })

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  const { passwordHash, ...safeUser } = user
  return { user: safeUser, accessToken, refreshToken }
}

const refresh = async (token) => {
  const decoded = verifyRefreshToken(token)
  const stored = await prisma.refreshToken.findUnique({ where: { token } })
  if (!stored || stored.expiresAt < new Date()) {
    throw { statusCode: 401, code: 'INVALID_TOKEN', message: 'Refresh token invalid or expired' }
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role })
  return { accessToken }
}

const logout = async (token) => {
  await prisma.refreshToken.deleteMany({ where: { token } })
  return true
}

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
      client: true
    }
  })
  if (!user) throw { statusCode: 404, code: 'NOT_FOUND', message: 'User not found' }
  return user
}

const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email, deletedAt: null } })
  if (!user) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'User with this email not found' }
  }

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const expiresAt = Date.now() + 15 * 60 * 1000 // 15 mins
  resetTokens.set(token, { email, expiresAt })

  console.log('----------------------------------------------------')
  console.log('📧 PASSWORD RESET REQUEST SIMULATION')
  console.log(`To: ${email}`)
  console.log(`Token: ${token}`)
  console.log(`Reset link: http://localhost:3001/reset-password?token=${token}`)
  console.log('----------------------------------------------------')

  return { token }
}

const resetPassword = async ({ token, password }) => {
  const record = resetTokens.get(token)
  if (!record || record.expiresAt < Date.now()) {
    throw { statusCode: 400, code: 'INVALID_TOKEN', message: 'Reset token is invalid or has expired' }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash }
  })

  // Consume the token
  resetTokens.delete(token)

  return { success: true }
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