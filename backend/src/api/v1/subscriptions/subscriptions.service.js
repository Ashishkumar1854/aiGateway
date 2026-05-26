const prisma = require('../../../lib/prisma')
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

module.exports = { getAll, getById, create, cancel }