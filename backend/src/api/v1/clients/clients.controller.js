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

module.exports = { getAll, getById, create, update, remove, getServices, assignService }