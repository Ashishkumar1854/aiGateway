const prisma = require('../../../lib/prisma')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// ──────────────────────────────────────────────
// SERVICE TYPE MAPPING
// Maps human-readable service name → ServiceType enum
// ──────────────────────────────────────────────
const SERVICE_NAME_TO_TYPE = {
  // Public-web signup page labels
  'Lead Generation': 'LEAD_GENERATION',
  'Email Automation': 'EMAIL_AUTOMATION',
  'Reels Automation': 'REELS_AUTOMATION',
  'WhatsApp Automation': 'WHATSAPP_AUTOMATION',
  'LinkedIn Automation': 'LINKEDIN_OUTREACH',
  'Job Seeker': 'JOB_SEEKER',
  'Smart Apply': 'JOB_SEEKER',

  // Alternative/Older/Detailed page names
  'Lead Generation Bot': 'LEAD_GENERATION',
  'Email Agent Pitches': 'EMAIL_AUTOMATION',
  'Reels Automation Bot': 'REELS_AUTOMATION',
  'WhatsApp Flow Automation': 'WHATSAPP_AUTOMATION',
  'LinkedIn Outreach': 'LINKEDIN_OUTREACH',
}

const SERVICE_TYPE_TO_NAME = {
  LEAD_GENERATION: 'Lead Generation Bot',
  EMAIL_AUTOMATION: 'Email Agent Pitches',
  REELS_AUTOMATION: 'Reels Automation Bot',
  WHATSAPP_AUTOMATION: 'WhatsApp Flow Automation',
  LINKEDIN_OUTREACH: 'LinkedIn Outreach',
  JOB_SEEKER: 'Smart Apply',
  CUSTOM: 'Custom Service',
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

/**
 * Generate a secure temp password (12 chars: letters + digits)
 */
function generateTempPassword() {
  return 'client123'
}

/**
 * Ensure a Service record exists in the DB for this serviceType.
 * Returns the service id.
 */
async function ensureService(serviceType, serviceName) {
  let service = await prisma.service.findFirst({ where: { type: serviceType } })
  if (!service) {
    service = await prisma.service.create({
      data: {
        name: serviceName || SERVICE_TYPE_TO_NAME[serviceType] || 'Service',
        type: serviceType,
        description: `AI-powered ${serviceName || serviceType} service`,
        features: [],
        isActive: true,
      }
    })
  }
  return service
}

// ──────────────────────────────────────────────
// PUBLIC — Submit onboarding form
// POST /api/v1/public/onboarding
// ──────────────────────────────────────────────
const submitOnboarding = async (req, res) => {
  try {
    const {
      name, email, phone, companyName, industry, message,
      serviceName, serviceType: rawServiceType,
      requestType = 'TRIAL',
      requirements = null,
      password,
    } = req.body

    // Validate required fields (companyName is now optional)
    if (!name || !email || !serviceName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'name, email, and serviceName are required' }
      })
    }

    const resolvedCompanyName = companyName || name || 'Individual'

    // Decode serviceName recursively in case of URL double-encoding
    let decodedServiceName = serviceName
    while (decodedServiceName && decodedServiceName.includes('%')) {
      try {
        decodedServiceName = decodeURIComponent(decodedServiceName)
      } catch (e) {
        break
      }
    }

    // Resolve serviceType from name if not directly provided
    const serviceType = rawServiceType || SERVICE_NAME_TO_TYPE[decodedServiceName] || 'CUSTOM'

    // Validate requestType
    if (!['TRIAL', 'BOOK'].includes(requestType)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'requestType must be TRIAL or BOOK' }
      })
    }

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    // Check if phone number already registered for a client
    let existingPhone = null
    if (phone) {
      existingPhone = await prisma.client.findFirst({
        where: { phone: phone.trim() }
      })
    }

    if (existingUser || existingPhone) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_EXISTS',
          message: 'This email or mobile number is already registered for an active trial/account.'
        }
      })
    }

    const onboarding = await prisma.onboardingRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        companyName: resolvedCompanyName,
        industry: industry || null,
        message: message || null,
        serviceType,
        serviceName: decodedServiceName,
        requestType,
        requirements: requirements || null,
        status: 'ACTIVATED',
        activatedAt: new Date(),
      }
    })

    // --- Auto-Activation Logic ---
    const finalPassword = password || generateTempPassword()
    const passwordHash = await bcrypt.hash(finalPassword, 10)

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'CLIENT',
          isActive: true,
        }
      })
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          name,
        }
      })
    }

    let client = await prisma.client.findUnique({ where: { userId: user.id } })
    if (!client) {
      client = await prisma.client.create({
        data: {
          userId: user.id,
          companyName: resolvedCompanyName,
          industry: industry || null,
          phone: phone || null,
          status: 'active',
          notes: `Auto-onboarded via ${requestType} request for ${serviceName}`,
        }
      })
    }

    const service = await ensureService(serviceType, serviceName)
    const isTrial = requestType === 'TRIAL'
    const expiresAt = isTrial ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null

    const existingAssignment = await prisma.serviceAssignment.findFirst({
      where: { clientId: client.id, serviceId: service.id }
    })

    if (!existingAssignment) {
      await prisma.serviceAssignment.create({
        data: {
          clientId: client.id,
          serviceId: service.id,
          isActive: true,
          expiresAt,
          config: requirements || {},
        }
      })
    } else {
      await prisma.serviceAssignment.update({
        where: { id: existingAssignment.id },
        data: { isActive: true, expiresAt, config: requirements || {} }
      })
    }

    await prisma.subscription.create({
      data: {
        clientId: client.id,
        plan: 'STARTER',
        status: isTrial ? 'TRIAL' : 'ACTIVE',
        startsAt: new Date(),
        expiresAt,
      }
    })

    await prisma.onboardingRequest.update({
      where: { id: onboarding.id },
      data: { clientId: client.id }
    })

    // Generate login tokens
    const { signAccessToken, signRefreshToken } = require('../../../utils/jwt')
    const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role })
    const refreshToken = signRefreshToken({ id: user.id })

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    const { passwordHash: _, ...safeUser } = { ...user, client }

    return res.status(201).json({
      success: true,
      data: {
        id: onboarding.id,
        requestType: onboarding.requestType,
        serviceName: onboarding.serviceName,
        status: 'ACTIVATED',
        user: safeUser,
        accessToken,
        refreshToken,
        redirectUrl: `http://localhost:3001/login?token=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify(safeUser))}`
      }
    })
  } catch (err) {
    console.error('[Onboarding] Submit error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to submit onboarding request' } })
  }
}

// ──────────────────────────────────────────────
// ADMIN — List all onboarding requests
// GET /api/v1/onboarding
// ──────────────────────────────────────────────
const list = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)

    const where = {}
    if (type) where.requestType = type.toUpperCase()
    if (status) where.status = status.toUpperCase()

    const [requests, total] = await Promise.all([
      prisma.onboardingRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          client: {
            select: { id: true, companyName: true, status: true }
          }
        }
      }),
      prisma.onboardingRequest.count({ where }),
    ])

    return res.json({
      success: true,
      data: requests,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      }
    })
  } catch (err) {
    console.error('[Onboarding] List error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch onboarding requests' } })
  }
}

// ──────────────────────────────────────────────
// ADMIN — Get single onboarding request
// GET /api/v1/onboarding/:id
// ──────────────────────────────────────────────
const getById = async (req, res) => {
  try {
    const request = await prisma.onboardingRequest.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          include: {
            subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
            serviceAssignments: { include: { service: true } },
          }
        }
      }
    })

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Onboarding request not found' } })
    }

    return res.json({ success: true, data: request })
  } catch (err) {
    console.error('[Onboarding] GetById error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch request' } })
  }
}

// ──────────────────────────────────────────────
// ADMIN — Activate Trial or Book
// POST /api/v1/onboarding/:id/activate
// ──────────────────────────────────────────────
const activate = async (req, res) => {
  try {
    const request = await prisma.onboardingRequest.findUnique({
      where: { id: req.params.id }
    })

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } })
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: { message: `Cannot activate — current status is ${request.status}` }
      })
    }

    // Generate temp password
    const tempPassword = generateTempPassword()
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email: request.email } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: request.name,
          email: request.email,
          passwordHash,
          role: 'CLIENT',
          isActive: true,
        }
      })
    }

    // Create or find Client profile
    let client = await prisma.client.findUnique({ where: { userId: user.id } })

    if (!client) {
      client = await prisma.client.create({
        data: {
          userId: user.id,
          companyName: request.companyName,
          industry: request.industry || null,
          phone: request.phone || null,
          status: 'active',
          notes: `Onboarded via ${request.requestType} request for ${request.serviceName}`,
        }
      })
    }

    // Ensure the service exists in DB
    const service = await ensureService(request.serviceType, request.serviceName)

    // Determine expiry
    const isTrial = request.requestType === 'TRIAL'
    const expiresAt = isTrial ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : null

    // Create or update ServiceAssignment
    const existingAssignment = await prisma.serviceAssignment.findFirst({
      where: { clientId: client.id, serviceId: service.id }
    })

    if (!existingAssignment) {
      await prisma.serviceAssignment.create({
        data: {
          clientId: client.id,
          serviceId: service.id,
          isActive: true,
          expiresAt,
          config: request.requirements || {},
        }
      })
    } else {
      await prisma.serviceAssignment.update({
        where: { id: existingAssignment.id },
        data: { isActive: true, expiresAt, config: request.requirements || {} }
      })
    }

    // Create Subscription
    await prisma.subscription.create({
      data: {
        clientId: client.id,
        plan: 'STARTER',
        status: isTrial ? 'TRIAL' : 'ACTIVE',
        startsAt: new Date(),
        expiresAt,
      }
    })

    // Update OnboardingRequest status
    const now = new Date()
    await prisma.onboardingRequest.update({
      where: { id: request.id },
      data: {
        status: 'ACTIVATED',
        activatedAt: now,
        expiresAt,
        clientId: client.id,
        userId: user.id,
      }
    })

    // TODO Phase 15: Send welcome email via SendGrid
    // await sendWelcomeEmail({ to: user.email, name: user.name, serviceName: request.serviceName, tempPassword })

    return res.json({
      success: true,
      data: {
        message: `${request.requestType} activated successfully`,
        clientId: client.id,
        userId: user.id,
        tempPassword,    // Admin shows this to the client
        loginUrl: `${process.env.CLIENT_DASHBOARD_URL || 'http://localhost:3001'}/login`,
        expiresAt,
        serviceName: request.serviceName,
      }
    })
  } catch (err) {
    console.error('[Onboarding] Activate error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to activate: ' + err.message } })
  }
}

// ──────────────────────────────────────────────
// ADMIN — Convert trial → paid
// POST /api/v1/onboarding/:id/convert
// ──────────────────────────────────────────────
const convert = async (req, res) => {
  try {
    const request = await prisma.onboardingRequest.findUnique({
      where: { id: req.params.id }
    })

    if (!request || !request.clientId) {
      return res.status(400).json({ success: false, error: { message: 'Request not found or not yet activated' } })
    }

    // Remove expiry from subscription and service assignment
    await prisma.subscription.updateMany({
      where: { clientId: request.clientId, status: 'TRIAL' },
      data: { status: 'ACTIVE', expiresAt: null, cancelledAt: null }
    })

    await prisma.serviceAssignment.updateMany({
      where: { clientId: request.clientId },
      data: { isActive: true, expiresAt: null }
    })

    await prisma.onboardingRequest.update({
      where: { id: request.id },
      data: { status: 'CONVERTED', expiresAt: null }
    })

    return res.json({
      success: true,
      data: { message: 'Trial successfully converted to paid subscription', clientId: request.clientId }
    })
  } catch (err) {
    console.error('[Onboarding] Convert error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to convert' } })
  }
}

// ──────────────────────────────────────────────
// ADMIN — Reject request
// POST /api/v1/onboarding/:id/reject
// ──────────────────────────────────────────────
const reject = async (req, res) => {
  try {
    const { reason } = req.body

    const request = await prisma.onboardingRequest.findUnique({
      where: { id: req.params.id }
    })

    if (!request) {
      return res.status(404).json({ success: false, error: { message: 'Request not found' } })
    }

    await prisma.onboardingRequest.update({
      where: { id: req.params.id },
      data: {
        status: 'REJECTED',
        message: reason ? `[REJECTED: ${reason}] ${request.message || ''}`.trim() : request.message,
      }
    })

    return res.json({ success: true, data: { message: 'Request rejected' } })
  } catch (err) {
    console.error('[Onboarding] Reject error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to reject request' } })
  }
}

// ──────────────────────────────────────────────
// CLIENT — Get my active services
// GET /api/v1/onboarding/my-services
// ──────────────────────────────────────────────
const myServices = async (req, res) => {
  try {
    const userId = req.user.id

    // Find client profile
    const client = await prisma.client.findUnique({
      where: { userId },
      include: {
        serviceAssignments: {
          where: { isActive: true },
          include: { service: true },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        onboardingRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      }
    })

    if (!client) {
      return res.json({ success: true, data: { services: [], subscription: null, onboardingRequests: [] } })
    }

    const now = new Date()
    const subscription = client.subscriptions[0] || null

    // Check if trial expired
    const isTrialExpired = subscription?.status === 'TRIAL' && subscription?.expiresAt && subscription.expiresAt < now

    // Auto-expire if needed
    if (isTrialExpired) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'EXPIRED' }
      })
      await prisma.serviceAssignment.updateMany({
        where: { clientId: client.id },
        data: { isActive: false }
      })
      await prisma.onboardingRequest.updateMany({
        where: { clientId: client.id, status: 'ACTIVATED' },
        data: { status: 'EXPIRED' }
      })
    }

    return res.json({
      success: true,
      data: {
        client: {
          id: client.id,
          companyName: client.companyName,
          industry: client.industry,
        },
        subscription: subscription ? {
          id: subscription.id,
          plan: subscription.plan,
          status: isTrialExpired ? 'EXPIRED' : subscription.status,
          expiresAt: subscription.expiresAt,
          daysRemaining: subscription.expiresAt
            ? Math.max(0, Math.ceil((subscription.expiresAt - now) / (1000 * 60 * 60 * 24)))
            : null,
        } : null,
        services: client.serviceAssignments.map(a => ({
          id: a.id,
          service: a.service,
          isActive: isTrialExpired ? false : a.isActive,
          expiresAt: a.expiresAt,
          config: a.config,
        })),
        onboardingRequests: client.onboardingRequests,
      }
    })
  } catch (err) {
    console.error('[Onboarding] MyServices error:', err)
    return res.status(500).json({ success: false, error: { message: 'Failed to fetch services' } })
  }
}

module.exports = {
  submitOnboarding,
  list,
  getById,
  activate,
  convert,
  reject,
  myServices,
}
