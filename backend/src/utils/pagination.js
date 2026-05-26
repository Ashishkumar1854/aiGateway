const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

const buildMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit)
})

module.exports = { getPagination, buildMeta }