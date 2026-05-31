const N8N_URL = process.env.N8N_URL || 'http://n8n:5678'
const N8N_SECRET = process.env.N8N_WEBHOOK_SECRET || 'dev-n8n-secret'

/**
 * Trigger an n8n webhook workflow
 * @param {string} webhookPath - the webhook path in n8n
 * @param {object} payload - data to send
 */
async function triggerWebhook(webhookPath, payload) {
  try {
    const url = `${N8N_URL}/webhook/${webhookPath}`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n8n-secret': N8N_SECRET,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`n8n webhook error [${webhookPath}]:`, text)
      return { success: false, error: text }
    }

    const data = await res.json().catch(() => ({ received: true }))
    return { success: true, data }
  } catch (err) {
    // n8n is optional — don't crash if unavailable
    console.warn(`n8n unavailable [${webhookPath}]:`, err.message)
    return { success: false, error: err.message }
  }
}

/**
 * Trigger lead intake workflow when new lead is created
 */
async function triggerLeadIntake(lead) {
  return triggerWebhook('lead-intake', {
    event: 'lead.created',
    lead: {
      id: lead.id,
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      industry: lead.industry,
      source: lead.source,
      score: lead.score,
      status: lead.status,
    },
    timestamp: new Date().toISOString(),
  })
}

/**
 * Trigger email sequence workflow
 */
async function triggerEmailSequence(lead, sequenceType = 'cold_outreach') {
  return triggerWebhook('email-sequence', {
    event: 'email.sequence.start',
    lead: {
      id: lead.id,
      companyName: lead.companyName,
      contactName: lead.contactName,
      email: lead.email,
    },
    sequenceType,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Trigger notification workflow
 */
async function triggerNotification(type, data) {
  return triggerWebhook('notifications', {
    event: `notification.${type}`,
    data,
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  triggerWebhook,
  triggerLeadIntake,
  triggerEmailSequence,
  triggerNotification,
}
