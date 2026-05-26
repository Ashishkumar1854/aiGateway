const prisma = require('../../../lib/prisma')

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

module.exports = { getAll, getById, create, update }