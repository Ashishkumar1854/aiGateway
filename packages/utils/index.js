/**
 * @fileoverview AiGateway — Shared Utility Functions
 * Used across frontend apps and backend.
 *
 * @module @aigw/utils
 */

/**
 * Format a Date object into a human-readable string
 * @param {Date|string} date - Date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 *
 * @example
 * formatDate(new Date()) // "25 May 2026"
 * formatDate(new Date(), { includeTime: true }) // "25 May 2026, 12:00 PM"
 */
function formatDate(date, options = {}) {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'

  const dateStr = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  if (options.includeTime) {
    const timeStr = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${dateStr}, ${timeStr}`
  }

  return dateStr
}

/**
 * Format a number as Indian Rupee currency
 * @param {number} amount - Amount in rupees (not paisa)
 * @param {Object} [options]
 * @param {boolean} [options.inPaisa=false] - If true, convert from paisa first
 * @returns {string} Formatted currency string
 *
 * @example
 * formatCurrency(9999) // "₹9,999"
 * formatCurrency(999900, { inPaisa: true }) // "₹9,999"
 */
function formatCurrency(amount, options = {}) {
  const value = options.inPaisa ? amount / 100 : amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Truncate a string to a maximum length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} [maxLength=100] - Maximum character count
 * @returns {string} Truncated string
 *
 * @example
 * truncate("Hello World", 5) // "Hello..."
 */
function truncate(str, maxLength = 100) {
  if (!str || typeof str !== 'string') return ''
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Convert a string into a URL-safe slug
 * @param {string} str - String to slugify
 * @returns {string} URL slug
 *
 * @example
 * slugify("Hello World! 123") // "hello-world-123"
 * slugify("AiGateway — Platform") // "aigateway-platform"
 */
function slugify(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Delay execution for a specified number of milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Safely parse JSON, returning null on failure
 * @param {string} str - JSON string to parse
 * @returns {*|null} Parsed value or null
 */
function safeJsonParse(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

/**
 * Generate a random alphanumeric string (for IDs, tokens etc.)
 * @param {number} [length=16] - Length of the string
 * @returns {string}
 */
function randomString(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Pick specific keys from an object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to pick
 * @returns {Object}
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

/**
 * Omit specific keys from an object
 * @param {Object} obj - Source object
 * @param {string[]} keys - Keys to omit
 * @returns {Object}
 */
function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))
}

module.exports = {
  formatDate,
  formatCurrency,
  truncate,
  slugify,
  sleep,
  safeJsonParse,
  randomString,
  pick,
  omit,
}
