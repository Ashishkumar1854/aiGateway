const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = { success: true, data }
  if (message) response.message = message
  return res.status(statusCode).json(response)
}

const sendPaginated = (res, data, meta) => {
  return res.status(200).json({ success: true, data, meta })
}

const sendError = (res, message, code = 'INTERNAL_ERROR', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: { code, message }
  })
}

module.exports = { sendSuccess, sendPaginated, sendError }