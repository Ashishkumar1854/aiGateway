/**
 * @fileoverview AiGateway — Shared Types & Enums
 * All shared data models across frontend, backend, and packages.
 * Uses JSDoc for type documentation (JavaScript — no TypeScript).
 *
 * @module @aigw/types
 */

// ─────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────

/**
 * User roles in the system
 * @enum {string}
 */
const Role = {
  ADMIN: 'ADMIN',       // Full platform access
  EMPLOYEE: 'EMPLOYEE', // Internal staff
  CLIENT: 'CLIENT',     // SaaS paying client
  AI_AGENT: 'AI_AGENT', // System accounts for AI agents
}

/**
 * CRM Lead pipeline stages
 * @enum {string}
 */
const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  WON: 'WON',
  LOST: 'LOST',
  UNQUALIFIED: 'UNQUALIFIED',
}

/**
 * SaaS subscription plans
 * @enum {string}
 */
const SubscriptionPlan = {
  STARTER: 'STARTER',       // ₹9,999/mo — 2 services, 500 leads
  PRO: 'PRO',               // ₹24,999/mo — 5 services, 2000 leads
  ENTERPRISE: 'ENTERPRISE', // Custom pricing — unlimited
}

/**
 * AI Agent types
 * @enum {string}
 */
const AgentType = {
  LEAD_RESEARCH: 'LEAD_RESEARCH',
  EMAIL_OUTREACH: 'EMAIL_OUTREACH',
  LINKEDIN: 'LINKEDIN',
  MEETING: 'MEETING',
  ORCHESTRATOR: 'ORCHESTRATOR',
}

/**
 * Agent task lifecycle status
 * @enum {string}
 */
const TaskStatus = {
  PENDING: 'PENDING',         // Waiting for execution
  AWAITING_APPROVAL: 'AWAITING_APPROVAL', // Needs human review
  APPROVED: 'APPROVED',       // Human approved
  REJECTED: 'REJECTED',       // Human rejected
  IN_PROGRESS: 'IN_PROGRESS', // Currently running
  COMPLETED: 'COMPLETED',     // Successfully done
  FAILED: 'FAILED',           // Error occurred
  RETRYING: 'RETRYING',       // Being retried (max 3)
}

/**
 * Subscription payment status
 * @enum {string}
 */
const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  TRIAL: 'TRIAL',
}

// ─────────────────────────────────────────────────────────────────
// API RESPONSE WRAPPERS
// ─────────────────────────────────────────────────────────────────

/**
 * Standard API success response
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Always true for success
 * @property {*} data - Response payload
 * @property {string} [message] - Optional human-readable message
 */

/**
 * Paginated API response
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success
 * @property {Array} data
 * @property {Object} meta
 * @property {number} meta.page - Current page
 * @property {number} meta.limit - Items per page
 * @property {number} meta.total - Total item count
 * @property {number} meta.totalPages - Total pages
 */

/**
 * Standard API error response
 * @typedef {Object} ApiError
 * @property {boolean} success - Always false for errors
 * @property {Object} error
 * @property {string} error.code - Machine-readable error code
 * @property {string} error.message - Human-readable message
 * @property {Array} [error.details] - Field-level validation errors
 */

// ─────────────────────────────────────────────────────────────────
// ENTITY INTERFACES (JSDoc)
// ─────────────────────────────────────────────────────────────────

/**
 * User entity
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} email
 * @property {string} name
 * @property {Role} role
 * @property {boolean} isActive
 * @property {string|null} clientId - Set if role === CLIENT
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Client entity (SaaS customer company)
 * @typedef {Object} Client
 * @property {string} id - UUID
 * @property {string} companyName
 * @property {string} industry
 * @property {string} contactEmail
 * @property {string} contactPhone
 * @property {SubscriptionPlan} plan
 * @property {SubscriptionStatus} subscriptionStatus
 * @property {boolean} isActive
 * @property {Date} createdAt
 */

/**
 * CRM Lead entity
 * @typedef {Object} Lead
 * @property {string} id - UUID
 * @property {string} companyName
 * @property {string} contactName
 * @property {string} email
 * @property {string} phone
 * @property {string} industry
 * @property {LeadStatus} status
 * @property {number} score - 0-100 lead score from AI
 * @property {string} source - How lead was acquired
 * @property {string|null} clientId - Which client this lead belongs to
 * @property {string|null} assignedUserId
 * @property {Date} createdAt
 */

/**
 * AI Agent Task entity
 * @typedef {Object} AgentTask
 * @property {string} id - UUID
 * @property {AgentType} agentType
 * @property {TaskStatus} status
 * @property {string} title - Human-readable task description
 * @property {Object} input - Task input data
 * @property {Object|null} output - Task result (set on completion)
 * @property {string|null} leadId - Related lead (if applicable)
 * @property {string|null} approvedBy - User ID who approved
 * @property {string|null} rejectedBy - User ID who rejected
 * @property {string|null} rejectionReason
 * @property {number} retryCount - Current retry attempt
 * @property {Date} createdAt
 * @property {Date|null} completedAt
 */

/**
 * Subscription entity
 * @typedef {Object} Subscription
 * @property {string} id - UUID
 * @property {string} clientId
 * @property {SubscriptionPlan} plan
 * @property {SubscriptionStatus} status
 * @property {number} priceInPaisa - Price in smallest currency unit
 * @property {Date} currentPeriodStart
 * @property {Date} currentPeriodEnd
 * @property {string|null} razorpaySubscriptionId
 * @property {Date} createdAt
 */

module.exports = {
  Role,
  LeadStatus,
  SubscriptionPlan,
  AgentType,
  TaskStatus,
  SubscriptionStatus,
}
