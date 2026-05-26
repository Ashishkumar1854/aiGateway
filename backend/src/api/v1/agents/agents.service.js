const prisma = require('../../../lib/prisma')
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

module.exports = { getTasks, createTask, approveTask, rejectTask, getLogs, getMemory, getAgentStats }