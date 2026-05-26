const fs = require('fs');
const path = require('path');

const files = {
  'src/lib/prisma.js': `const { PrismaClient } = require('@prisma/client')

const globalForPrisma = global

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

module.exports = prisma`,

  'src/utils/response.js': `const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = { success: true, data }
  if (message) response.message = message
  return res.status(statusCode).json(response)
}

const sendPaginated = (res, data, meta) => {
  return res.status(200).json({ success: true, data, meta })
}

const sendError = (res, message, code = 'INTERNAL_ERROR', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message }
  })
}

module.exports = { sendSuccess, sendPaginated, sendError }`,

  'src/utils/jwt.js': `const jwt = require('jsonwebtoken')

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

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }`,

  'src/utils/pagination.js': `const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
})

module.exports = { getPagination, buildMeta }`,

  'src/middleware/auth.middleware.js': `const { verifyAccessToken } = require('../utils/jwt')
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

module.exports = { authenticate }`,

  'src/middleware/rbac.middleware.js': `const { sendError } = require('../utils/response')

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

module.exports = { authorize }`,

  'src/middleware/error.middleware.js': `const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message)

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_ENTRY', message: 'Record already exists' }
      })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Record not found' }
      })
    }
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong'
    }
  })
}

module.exports = { errorHandler }`,

  'src/api/v1/auth/auth.service.js': `const bcrypt = require('bcryptjs')
const prisma = require('../../../lib/prisma')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../utils/jwt')

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
  const user = await prisma.user.findUnique({ where: { email, deletedAt: null } })
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
    select: { id: true, name: true, email: true, role: true, lastLoginAt: true, createdAt: true }
  })
  if (!user) throw { statusCode: 404, code: 'NOT_FOUND', message: 'User not found' }
  return user
}

module.exports = { signup, login, refresh, logout, getMe }`,

  'src/api/v1/auth/auth.controller.js': `const authService = require('./auth.service')
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

module.exports = { signup, login, refresh, logout, getMe }`,

  'src/api/v1/auth/auth.routes.js': `const router = require('express').Router()
const controller = require('./auth.controller')
const { authenticate } = require('../../../middleware/auth.middleware')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.post('/refresh', controller.refresh)
router.post('/logout', controller.logout)
router.get('/me', authenticate, controller.getMe)

module.exports = router`,

  'src/api/v1/users/users.service.js': `const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = { deletedAt: null }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } }
    ]
  }
  if (query.role) where.role = query.role

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where, skip, take: limit,
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const getById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
  })
  if (!user) throw { statusCode: 404, code: 'NOT_FOUND', message: 'User not found' }
  return user
}

const update = async (id, data) => {
  const { name, isActive } = data
  return prisma.user.update({
    where: { id },
    data: { ...(name && { name }), ...(isActive !== undefined && { isActive }) },
    select: { id: true, name: true, email: true, role: true, isActive: true, updatedAt: true }
  })
}

const remove = async (id) => {
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
}

module.exports = { getAll, getById, update, remove }`,

  'src/api/v1/users/users.controller.js': `const usersService = require('./users.service')
const { sendSuccess, sendPaginated, sendError } = require('../../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await usersService.getAll(req.query)
    return sendPaginated(res, data, meta)
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id)
    return sendSuccess(res, user)
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const user = await usersService.update(req.params.id, req.body)
    return sendSuccess(res, user, 'User updated')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id)
    return sendSuccess(res, null, 'User deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, update, remove }`,

  'src/api/v1/users/users.routes.js': `const router = require('express').Router()
const controller = require('./users.controller')
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')

router.use(authenticate)
router.get('/', authorize('ADMIN'), controller.getAll)
router.get('/:id', authorize('ADMIN', 'EMPLOYEE'), controller.getById)
router.put('/:id', authorize('ADMIN'), controller.update)
router.delete('/:id', authorize('ADMIN'), controller.remove)

module.exports = router`,

  'src/api/v1/clients/clients.service.js': `const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = { deletedAt: null }
  if (query.search) {
    where.OR = [
      { companyName: { contains: query.search, mode: 'insensitive' } },
      { industry: { contains: query.search, mode: 'insensitive' } }
    ]
  }
  if (query.status) where.status = query.status

  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where, skip, take: limit,
      include: {
        user: { select: { id: true, name: true, email: true } },
        subscriptions: { where: { status: 'ACTIVE' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.client.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const getById = async (id) => {
  const client = await prisma.client.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true } },
      subscriptions: true,
      serviceAssignments: { include: { service: true } }
    }
  })
  if (!client) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Client not found' }
  return client
}

const create = async (data) => {
  const { name, email, password, companyName, industry, website, phone } = data
  const bcrypt = require('bcryptjs')
  const { signAccessToken, signRefreshToken } = require('../../../utils/jwt')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw { statusCode: 409, code: 'EMAIL_EXISTS', message: 'Email already exists' }

  const passwordHash = await bcrypt.hash(password || 'changeme123', 10)

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, passwordHash, role: 'CLIENT' }
    })
    const client = await tx.client.create({
      data: { userId: user.id, companyName, industry, website, phone },
      include: { user: { select: { id: true, name: true, email: true } } }
    })
    return client
  })
  return result
}

const update = async (id, data) => {
  const { companyName, industry, website, phone, status, notes } = data
  return prisma.client.update({
    where: { id },
    data: {
      ...(companyName && { companyName }),
      ...(industry && { industry }),
      ...(website && { website }),
      ...(phone && { phone }),
      ...(status && { status }),
      ...(notes !== undefined && { notes })
    },
    include: { user: { select: { id: true, name: true, email: true } } }
  })
}

const remove = async (id) => {
  return prisma.client.update({ where: { id }, data: { deletedAt: new Date() } })
}

const getServices = async (clientId) => {
  return prisma.serviceAssignment.findMany({
    where: { clientId, isActive: true },
    include: { service: true }
  })
}

const assignService = async (clientId, serviceId, config) => {
  return prisma.serviceAssignment.upsert({
    where: { clientId_serviceId: { clientId, serviceId } },
    update: { isActive: true, config },
    create: { clientId, serviceId, config, isActive: true },
    include: { service: true }
  })
}

module.exports = { getAll, getById, create, update, remove, getServices, assignService }`,

  'src/api/v1/clients/clients.controller.js': `const clientsService = require('./clients.service')
const { sendSuccess, sendPaginated, sendError } = require('../../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await clientsService.getAll(req.query)
    return sendPaginated(res, data, meta)
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const client = await clientsService.getById(req.params.id)
    return sendSuccess(res, client)
  } catch (err) { next(err) }
}

const create = async (req, res, next) => {
  try {
    const client = await clientsService.create(req.body)
    return sendSuccess(res, client, 'Client created', 201)
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const client = await clientsService.update(req.params.id, req.body)
    return sendSuccess(res, client, 'Client updated')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await clientsService.remove(req.params.id)
    return sendSuccess(res, null, 'Client deleted')
  } catch (err) { next(err) }
}

const getServices = async (req, res, next) => {
  try {
    const services = await clientsService.getServices(req.params.id)
    return sendSuccess(res, services)
  } catch (err) { next(err) }
}

const assignService = async (req, res, next) => {
  try {
    const { serviceId, config } = req.body
    const assignment = await clientsService.assignService(req.params.id, serviceId, config)
    return sendSuccess(res, assignment, 'Service assigned', 201)
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, create, update, remove, getServices, assignService }`,

  'src/api/v1/clients/clients.routes.js': `const router = require('express').Router()
const controller = require('./clients.controller')
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')

router.use(authenticate)
router.get('/', authorize('ADMIN', 'EMPLOYEE'), controller.getAll)
router.post('/', authorize('ADMIN'), controller.create)
router.get('/:id', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getById)
router.put('/:id', authorize('ADMIN', 'EMPLOYEE'), controller.update)
router.delete('/:id', authorize('ADMIN'), controller.remove)
router.get('/:id/services', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), controller.getServices)
router.post('/:id/services', authorize('ADMIN'), controller.assignService)

module.exports = router`,

  'src/api/v1/services/services.service.js': `const prisma = require('../../../lib/prisma')

const getAll = async () => {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })
}

const getById = async (id) => {
  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Service not found' }
  return service
}

const create = async (data) => {
  return prisma.service.create({ data })
}

const update = async (id, data) => {
  return prisma.service.update({ where: { id }, data })
}

module.exports = { getAll, getById, create, update }`,

  'src/api/v1/services/services.routes.js': `const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const prisma = require('../../../lib/prisma')
const { sendSuccess } = require('../../../utils/response')
const service = require('./services.service')

router.use(authenticate)
router.get('/', async (req, res, next) => {
  try { return sendSuccess(res, await service.getAll()) } catch(e) { next(e) }
})
router.get('/:id', async (req, res, next) => {
  try { return sendSuccess(res, await service.getById(req.params.id)) } catch(e) { next(e) }
})
router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.create(req.body), 'Service created', 201) } catch(e) { next(e) }
})
router.put('/:id', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.update(req.params.id, req.body), 'Service updated') } catch(e) { next(e) }
})

module.exports = router`,

  'src/api/v1/subscriptions/subscriptions.service.js': `const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getAll = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = {}
  if (query.status) where.status = query.status
  if (query.clientId) where.clientId = query.clientId

  const [data, total] = await Promise.all([
    prisma.subscription.findMany({
      where, skip, take: limit,
      include: { client: { select: { companyName: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.subscription.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const getById = async (id) => {
  const sub = await prisma.subscription.findUnique({
    where: { id },
    include: { client: true, payments: { take: 5, orderBy: { createdAt: 'desc' } } }
  })
  if (!sub) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Subscription not found' }
  return sub
}

const create = async (data) => {
  return prisma.subscription.create({ data, include: { client: true } })
}

const cancel = async (id) => {
  return prisma.subscription.update({
    where: { id },
    data: { status: 'CANCELLED', cancelledAt: new Date() }
  })
}

module.exports = { getAll, getById, create, cancel }`,

  'src/api/v1/subscriptions/subscriptions.routes.js': `const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const service = require('./subscriptions.service')

router.use(authenticate)
router.get('/', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.create(req.body), 'Subscription created', 201) } catch(e) { next(e) }
})
router.get('/:id', authorize('ADMIN', 'EMPLOYEE', 'CLIENT'), async (req, res, next) => {
  try { return sendSuccess(res, await service.getById(req.params.id)) } catch(e) { next(e) }
})
router.put('/:id/cancel', authorize('ADMIN'), async (req, res, next) => {
  try { return sendSuccess(res, await service.cancel(req.params.id), 'Subscription cancelled') } catch(e) { next(e) }
})

module.exports = router`,

  'src/api/v1/crm/crm.service.js': `const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getLeads = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = { deletedAt: null }
  if (query.status) where.status = query.status
  if (query.search) {
    where.OR = [
      { companyName: { contains: query.search, mode: 'insensitive' } },
      { contactName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } }
    ]
  }

  const [data, total] = await Promise.all([
    prisma.lead.findMany({
      where, skip, take: limit,
      include: {
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { conversations: true, meetings: true } }
      },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }]
    }),
    prisma.lead.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const getLeadById = async (id) => {
  const lead = await prisma.lead.findFirst({
    where: { id, deletedAt: null },
    include: {
      conversations: { orderBy: { sentAt: 'desc' }, take: 20 },
      meetings: { orderBy: { scheduledAt: 'desc' } },
      leadNotes: { orderBy: { createdAt: 'desc' } },
      tasks: { where: { isCompleted: false } },
      agentTasks: { orderBy: { createdAt: 'desc' }, take: 10 },
      outreachLogs: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  })
  if (!lead) throw { statusCode: 404, code: 'NOT_FOUND', message: 'Lead not found' }
  return lead
}

const createLead = async (data) => {
  return prisma.lead.create({ data })
}

const updateLead = async (id, data) => {
  return prisma.lead.update({ where: { id }, data })
}

const updateLeadStage = async (id, status) => {
  return prisma.lead.update({
    where: { id },
    data: { status },
    select: { id: true, companyName: true, status: true }
  })
}

const deleteLead = async (id) => {
  return prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } })
}

const getPipeline = async () => {
  const statuses = ['COLD', 'WARM', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']
  const pipeline = await Promise.all(
    statuses.map(async (status) => {
      const leads = await prisma.lead.findMany({
        where: { status, deletedAt: null },
        select: { id: true, companyName: true, contactName: true, score: true, industry: true, updatedAt: true },
        orderBy: { score: 'desc' }
      })
      return { status, count: leads.length, leads }
    })
  )
  return pipeline
}

const addConversation = async (data) => {
  return prisma.conversation.create({ data })
}

const createMeeting = async (data) => {
  return prisma.meeting.create({
    data,
    include: { lead: { select: { companyName: true } } }
  })
}

const getMeetings = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = {}
  if (query.status) where.status = query.status
  const [data, total] = await Promise.all([
    prisma.meeting.findMany({
      where, skip, take: limit,
      include: { lead: { select: { companyName: true, contactName: true } } },
      orderBy: { scheduledAt: 'asc' }
    }),
    prisma.meeting.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

module.exports = {
  getLeads, getLeadById, createLead, updateLead, updateLeadStage,
  deleteLead, getPipeline, addConversation, createMeeting, getMeetings
}`,

  'src/api/v1/crm/crm.routes.js': `const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const crm = require('./crm.service')

router.use(authenticate)

// Leads
router.get('/leads', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await crm.getLeads(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/leads', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.createLead(req.body), 'Lead created', 201) } catch(e) { next(e) }
})
router.get('/leads/:id', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.getLeadById(req.params.id)) } catch(e) { next(e) }
})
router.put('/leads/:id', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.updateLead(req.params.id, req.body), 'Lead updated') } catch(e) { next(e) }
})
router.put('/leads/:id/stage', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.updateLeadStage(req.params.id, req.body.status), 'Stage updated') } catch(e) { next(e) }
})
router.delete('/leads/:id', authorize('ADMIN'), async (req, res, next) => {
  try { await crm.deleteLead(req.params.id); return sendSuccess(res, null, 'Lead deleted') } catch(e) { next(e) }
})

// Pipeline (kanban data)
router.get('/pipeline', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.getPipeline()) } catch(e) { next(e) }
})

// Conversations
router.post('/conversations', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.addConversation(req.body), 'Conversation added', 201) } catch(e) { next(e) }
})

// Meetings
router.get('/meetings', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await crm.getMeetings(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/meetings', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await crm.createMeeting(req.body), 'Meeting created', 201) } catch(e) { next(e) }
})

module.exports = router`,

  'src/api/v1/agents/agents.service.js': `const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getTasks = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = {}
  if (query.status) where.status = query.status
  if (query.agentType) where.agentType = query.agentType

  const [data, total] = await Promise.all([
    prisma.agentTask.findMany({
      where, skip, take: limit,
      include: {
        lead: { select: { id: true, companyName: true, contactName: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.agentTask.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const createTask = async (data) => {
  return prisma.agentTask.create({ data })
}

const approveTask = async (id, userId) => {
  return prisma.agentTask.update({
    where: { id },
    data: { status: 'APPROVED', approvedById: userId, approvedAt: new Date() }
  })
}

const rejectTask = async (id, userId, reason) => {
  return prisma.agentTask.update({
    where: { id },
    data: { status: 'REJECTED', rejectedById: userId, rejectedAt: new Date(), error: reason }
  })
}

const getLogs = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = {}
  if (query.agentTaskId) where.agentTaskId = query.agentTaskId
  if (query.level) where.level = query.level

  const [data, total] = await Promise.all([
    prisma.agentLog.findMany({
      where, skip, take: limit,
      include: { agentTask: { select: { agentType: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.agentLog.count({ where })
  ])
  return { data, meta: buildMeta(page, limit, total) }
}

const getMemory = async (leadId) => {
  return prisma.agentMemory.findMany({
    where: { leadId },
    orderBy: { updatedAt: 'desc' }
  })
}

const getAgentStats = async () => {
  const [total, pending, approved, completed, failed] = await Promise.all([
    prisma.agentTask.count(),
    prisma.agentTask.count({ where: { status: 'AWAITING_APPROVAL' } }),
    prisma.agentTask.count({ where: { status: 'APPROVED' } }),
    prisma.agentTask.count({ where: { status: 'COMPLETED' } }),
    prisma.agentTask.count({ where: { status: 'FAILED' } }),
  ])
  return { total, pending, approved, completed, failed }
}

module.exports = { getTasks, createTask, approveTask, rejectTask, getLogs, getMemory, getAgentStats }`,

  'src/api/v1/agents/agents.routes.js': `const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const agents = require('./agents.service')

router.use(authenticate)

router.get('/stats', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.getAgentStats()) } catch(e) { next(e) }
})
router.get('/tasks', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await agents.getTasks(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.post('/tasks', authorize('ADMIN', 'EMPLOYEE', 'AI_AGENT'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.createTask(req.body), 'Task created', 201) } catch(e) { next(e) }
})
router.put('/tasks/:id/approve', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.approveTask(req.params.id, req.user.id), 'Task approved') } catch(e) { next(e) }
})
router.put('/tasks/:id/reject', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.rejectTask(req.params.id, req.user.id, req.body.reason), 'Task rejected') } catch(e) { next(e) }
})
router.get('/logs', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { const { data, meta } = await agents.getLogs(req.query); return sendPaginated(res, data, meta) } catch(e) { next(e) }
})
router.get('/memory/:leadId', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try { return sendSuccess(res, await agents.getMemory(req.params.leadId)) } catch(e) { next(e) }
})

module.exports = router`,

  'src/api/v1/workflows/workflows.routes.js': `const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

router.use(authenticate)

router.get('/', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const [data, total] = await Promise.all([
      prisma.workflow.findMany({ skip, take: limit, include: { _count: { select: { logs: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.workflow.count()
    ])
    return sendPaginated(res, data, buildMeta(page, limit, total))
  } catch(e) { next(e) }
})

router.post('/trigger', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const { workflowId, input } = req.body
    const log = await prisma.workflowLog.create({
      data: { workflowId, status: 'running', input, triggeredAt: new Date() }
    })
    return sendSuccess(res, log, 'Workflow triggered', 201)
  } catch(e) { next(e) }
})

router.get('/:id/logs', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const logs = await prisma.workflowLog.findMany({
      where: { workflowId: req.params.id },
      orderBy: { triggeredAt: 'desc' },
      take: 50
    })
    return sendSuccess(res, logs)
  } catch(e) { next(e) }
})

module.exports = router`,

  'src/api/v1/webhooks/webhooks.routes.js': `const router = require('express').Router()
const { sendSuccess } = require('../../../utils/response')

// n8n webhook — no auth (uses secret header)
router.post('/n8n', async (req, res, next) => {
  try {
    const secret = req.headers['x-n8n-secret']
    if (secret !== process.env.N8N_WEBHOOK_SECRET) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } })
    }
    console.log('n8n webhook received:', req.body)
    return sendSuccess(res, { received: true })
  } catch(e) { next(e) }
})

// Razorpay webhook — will be completed in Phase 7
router.post('/razorpay', async (req, res, next) => {
  try {
    console.log('Razorpay webhook received:', req.body)
    return sendSuccess(res, { received: true })
  } catch(e) { next(e) }
})

module.exports = router`,

  'src/index.js': `const express = require('express')
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
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: \`Route \${req.path} not found\` } })
})

// Centralized error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(\`✅ AiGateway Backend running on port \${PORT}\`)
  console.log(\`   Health: http://localhost:\${PORT}/health\`)
  console.log(\`   API:    http://localhost:\${PORT}/api/v1\`)
})`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created:', filePath);
}
