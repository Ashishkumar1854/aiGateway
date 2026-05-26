const usersService = require('./users.service')
const { sendSuccess, sendPaginated, sendError } = require('../../../utils/response')

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await usersService.getAll(req.query)
    return sendPaginated(res, data, meta)
  } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id)
    return sendSuccess(res, user)
  } catch (err) { next(err) }
}

const update = async (req, res, next) => {
  try {
    const user = await usersService.update(req.params.id, req.body)
    return sendSuccess(res, user, 'User updated')
  } catch (err) { next(err) }
}

const remove = async (req, res, next) => {
  try {
    await usersService.remove(req.params.id)
    return sendSuccess(res, null, 'User deleted')
  } catch (err) { next(err) }
}

module.exports = { getAll, getById, update, remove }