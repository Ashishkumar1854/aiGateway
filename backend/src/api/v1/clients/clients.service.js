const prisma = require('../../../lib/prisma')
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

module.exports = { getAll, getById, create, update, remove, getServices, assignService }