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
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 }
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

const getOnboardingHistory = async (clientId) => {
  return prisma.onboardingRequest.findMany({
    where: { clientId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      serviceName: true,
      serviceType: true,
      requestType: true,
      status: true,
      createdAt: true,
      activatedAt: true,
      expiresAt: true,
    }
  })
}

const getLeads = async (clientId) => {
  return prisma.lead.findMany({
    where: { clientId, deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })
}

const createLead = async (clientId, data) => {
  return prisma.lead.create({
    data: {
      companyName: data.companyName || 'Unknown',
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      industry: data.industry,
      location: data.location,
      status: data.status || 'COLD',
      source: data.source || 'client_portal',
      notes: data.notes,
      clientId,
    }
  })
}

const getOutreachLogs = async (clientId) => {
  return prisma.outreachLog.findMany({
    where: { lead: { clientId } },
    include: { lead: { select: { companyName: true, contactName: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  })
}

const createOutreachLog = async (clientId, data) => {
  const lead = await prisma.lead.findFirst({
    where: { id: data.leadId, clientId }
  })
  if (!lead) throw { statusCode: 404, message: 'Lead not found or access denied' }

  return prisma.outreachLog.create({
    data: {
      leadId: data.leadId,
      agentType: data.agentType || 'EMAIL_OUTREACH',
      channel: data.channel || 'email',
      subject: data.subject || null,
      content: data.content,
      status: data.status || 'sent',
      sentAt: new Date(),
    }
  })
}

const applyJobSeeker = async (clientId, data) => {
  const { recruiterName, recruiterEmail, companyName, jobRole, jobDescription } = data

  const lead = await prisma.lead.create({
    data: {
      clientId,
      companyName: companyName || 'Recruiter Direct',
      contactName: recruiterName || 'Recruiter',
      email: recruiterEmail,
      status: 'COLD',
      source: 'job_application',
      notes: `Target Role: ${jobRole || 'N/A'}\n\nJob Description:\n${jobDescription || ''}`,
    }
  })

  const clientInfo = await prisma.client.findFirst({
    where: { id: clientId },
    include: { user: true, serviceAssignments: { include: { service: true } } }
  })

  const candidateName = clientInfo?.user?.name || 'Candidate'
  const candidateEmail = clientInfo?.user?.email || 'candidate@email.com'

  const jobSeekerAssignment = clientInfo?.serviceAssignments?.find(
    a => a.service?.type === 'JOB_SEEKER'
  )
  const resumeLink = jobSeekerAssignment?.config?.resume_link || 'https://drive.google.com/file/d/candidate-resume/view'

  const subject = `Application for ${jobRole || 'Open Position'} - ${candidateName}`
  const body = `Hi ${recruiterName || 'Hiring Team'},\n\nI hope this email finds you well.\n\nI am writing to express my strong interest in the ${jobRole || 'position'} at ${companyName || 'your company'}. My target search and skills align with your requirements.\n\nI have attached my details and customized my application. You can review my full profile and download my resume here: ${resumeLink}\n\nI would appreciate the opportunity to connect and discuss how I can contribute to your goals.\n\nBest regards,\n${candidateName}\n${candidateEmail}`

  const outreach = await prisma.outreachLog.create({
    data: {
      leadId: lead.id,
      agentType: 'EMAIL_OUTREACH',
      channel: 'email',
      subject,
      content: body,
      status: 'sent',
      sentAt: new Date(),
    }
  })

  return { lead, outreach }
}

const triggerLeadSearch = async (clientId, data) => {
  const { keyword, location, limit = 10, sources = ['Google Maps'] } = data

  const mockNames = [
    { company: `${keyword} Hub`, contact: 'John Doe', email: 'info@hub.com', phone: '+1-555-0199' },
    { company: `Apex ${keyword}s`, contact: 'Jane Smith', email: 'contact@apex.com', phone: '+1-555-0234' },
    { company: `Elite ${keyword} Group`, contact: 'Robert Johnson', email: 'sales@elite.com', phone: '+1-555-0567' },
    { company: `${keyword} Partners`, contact: 'Emily Davis', email: 'partner@partners.com', phone: '+1-555-0789' },
    { company: `Modern ${keyword} Co`, contact: 'Michael Brown', email: 'hello@modern.com', phone: '+1-555-0912' },
  ]

  const count = Math.min(limit, mockNames.length)
  const createdLeads = []

  for (let i = 0; i < count; i++) {
    const mock = mockNames[i]
    const lead = await prisma.lead.create({
      data: {
        clientId,
        companyName: mock.company,
        contactName: mock.contact,
        email: mock.email,
        phone: mock.phone,
        location: location || 'Anywhere',
        status: 'COLD',
        source: sources.join(', '),
      }
    })
    createdLeads.push(lead)
  }

  return createdLeads
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getServices,
  assignService,
  getOnboardingHistory,
  getLeads,
  createLead,
  getOutreachLogs,
  createOutreachLog,
  applyJobSeeker,
  triggerLeadSearch,
}