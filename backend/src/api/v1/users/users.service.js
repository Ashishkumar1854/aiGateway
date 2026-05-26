const prisma = require('../../../lib/prisma')
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

module.exports = { getAll, getById, update, remove }