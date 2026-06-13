const service = require('./onboarding.service')
const { sendSuccess, sendError } = require('../../../utils/response')

const list = async (req, res, next) => {
  try { await service.list(req, res) } catch (err) { next(err) }
}

const getById = async (req, res, next) => {
  try { await service.getById(req, res) } catch (err) { next(err) }
}

const activate = async (req, res, next) => {
  try { await service.activate(req, res) } catch (err) { next(err) }
}

const convert = async (req, res, next) => {
  try { await service.convert(req, res) } catch (err) { next(err) }
}

const reject = async (req, res, next) => {
  try { await service.reject(req, res) } catch (err) { next(err) }
}

const myServices = async (req, res, next) => {
  try { await service.myServices(req, res) } catch (err) { next(err) }
}

module.exports = { list, getById, activate, convert, reject, myServices }
