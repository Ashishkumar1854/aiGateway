const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

const getLeads = async (query) => {
  const { page, limit, skip } = getPagination(query)
  const where = { deletedAt: null }
  if (query.status) where.status = query.status
  if (query.source) where.source = query.source
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
  const lead = await prisma.lead.create({ data })
  
  // Trigger n8n lead intake workflow (non-blocking)
  const n8nService = require('../../../services/n8n.service')
  n8nService.triggerLeadIntake(lead).catch(console.warn)
  
  return lead
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
}