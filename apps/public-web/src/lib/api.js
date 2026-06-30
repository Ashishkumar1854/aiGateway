const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

// ─── Existing: Generic contact form (CRM lead) ───────────────────────────────
export async function submitContactForm(data) {
  const serviceNote = data.serviceInterest
    ? `[Service Interest: ${data.serviceInterest}]\n\n${data.message || ''}`.trim()
    : data.message || ''

  const res = await fetch(`${BASE_URL}/api/v1/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: data.company,
      contactName: data.name,
      email: data.email,
      phone: data.phone,
      industry: data.industry,
      source: 'website_contact',
      notes: serviceNote,
      status: 'COLD',
      score: 10,
    }),
  })
  if (!res.ok) throw new Error('Failed to submit')
  return res.json()
}

// ─── Existing: Personal Branding / custom project request ────────────────────
export async function submitCustomRequest(data) {
  const res = await fetch(`${BASE_URL}/api/v1/public/other-services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      projectName: data.projectName,
      requirements: data.requirements,
      budget: data.budget,
    }),
  })
  if (!res.ok) throw new Error('Failed to submit custom request')
  return res.json()
}

// ─── NEW (Phase 14B): Trial / Book service onboarding request ─────────────────
export async function submitOnboardingRequest(data) {
  const res = await fetch(`${BASE_URL}/api/v1/public/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      companyName: data.company,
      industry: data.industry || null,
      message: data.message || null,
      serviceName: data.serviceName,
      serviceType: data.serviceType || null,
      requestType: data.requestType, // 'TRIAL' or 'BOOK'
      requirements: data.requirements || null,
      password: data.password || null,
    }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(json?.error?.message || 'Failed to submit onboarding request')
  }
  return json
}
