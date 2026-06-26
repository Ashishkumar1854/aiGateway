const clientsService = require('./clients.service')
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

const getOnboardingHistory = async (req, res, next) => {
  try {
    const history = await clientsService.getOnboardingHistory(req.params.id)
    return sendSuccess(res, history)
  } catch (err) { next(err) }
}

const getLeads = async (req, res, next) => {
  try {
    const leads = await clientsService.getLeads(req.params.id)
    return sendSuccess(res, leads)
  } catch (err) { next(err) }
}

const createLead = async (req, res, next) => {
  try {
    const lead = await clientsService.createLead(req.params.id, req.body)
    return sendSuccess(res, lead, 'Lead created', 201)
  } catch (err) { next(err) }
}

const getOutreachLogs = async (req, res, next) => {
  try {
    const logs = await clientsService.getOutreachLogs(req.params.id)
    return sendSuccess(res, logs)
  } catch (err) { next(err) }
}

const createOutreachLog = async (req, res, next) => {
  try {
    const log = await clientsService.createOutreachLog(req.params.id, req.body)
    return sendSuccess(res, log, 'Outreach logged', 201)
  } catch (err) { next(err) }
}

const applyJobSeeker = async (req, res, next) => {
  try {
    const result = await clientsService.applyJobSeeker(req.params.id, req.body)
    return sendSuccess(res, result, 'Application sent', 201)
  } catch (err) { next(err) }
}

const triggerLeadSearch = async (req, res, next) => {
  try {
    const result = await clientsService.triggerLeadSearch(req.params.id, req.body)
    return sendSuccess(res, result, 'Leads generated successfully', 201)
  } catch (err) { next(err) }
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