const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getTasks = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = {}
  if (query.status) where.status = query.status
  if (query.agentType) where.agentType = query.agentType
  if (query.leadId) where.leadId = query.leadId
  if (query.lead_id) where.leadId = query.lead_id

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
  // 1. Update task status
  const task = await prisma.agentTask.update({
    where: { id },
    data: { status: 'APPROVED', approvedById: userId, approvedAt: new Date() }
  })

  // 2. Call ai-workers to execute the task (non-blocking)
  const AI_WORKERS_URL = process.env.AI_WORKERS_URL || 'http://ai-workers:8000'
  const AI_WORKERS_SECRET = process.env.AI_WORKERS_SECRET || 'dev-ai-secret'

  fetch(`${AI_WORKERS_URL}/agents/tasks/${id}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ai-workers-secret': AI_WORKERS_SECRET,
    },
    body: JSON.stringify({
      task_id: id,
      agent_type: task.agentType,
      input_data: task.input,
    }),
  })
  .then(async (res) => {
    const data = await res.json()
    console.log(`✅ Task ${id} executed:`, data)
    // Update task status to COMPLETED
    await prisma.agentTask.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date(), output: data }
    })
  })
  .catch(async (err) => {
    console.error(`❌ Task ${id} execution failed:`, err.message)
    await prisma.agentTask.update({
      where: { id },
      data: { status: 'FAILED', error: err.message }
    })
  })

  return task
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