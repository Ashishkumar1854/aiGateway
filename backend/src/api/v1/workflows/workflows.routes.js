const router = require('express').Router()
const { authenticate } = require('../../../middleware/auth.middleware')
const { authorize } = require('../../../middleware/rbac.middleware')
const { sendSuccess, sendPaginated } = require('../../../utils/response')
const prisma = require('../../../lib/prisma')
const { getPagination, buildMeta } = require('../../../utils/pagination')

router.use(authenticate)

router.get('/', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const [data, total] = await Promise.all([
      prisma.workflow.findMany({ skip, take: limit, include: { _count: { select: { logs: true } } }, orderBy: { createdAt: 'desc' } }),
      prisma.workflow.count()
    ])
    return sendPaginated(res, data, buildMeta(page, limit, total))
  } catch(e) { next(e) }
})

router.post('/trigger', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const { workflowId, input } = req.body
    const log = await prisma.workflowLog.create({
      data: { workflowId, status: 'running', input, triggeredAt: new Date() }
    })
    return sendSuccess(res, log, 'Workflow triggered', 201)
  } catch(e) { next(e) }
})

router.get('/:id/logs', authorize('ADMIN', 'EMPLOYEE'), async (req, res, next) => {
  try {
    const logs = await prisma.workflowLog.findMany({
      where: { workflowId: req.params.id },
      orderBy: { triggeredAt: 'desc' },
      take: 50
    })
    return sendSuccess(res, logs)
  } catch(e) { next(e) }
})

module.exports = router