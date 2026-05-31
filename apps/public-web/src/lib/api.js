const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export async function submitContactForm(data) {
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
      notes: data.message,
      status: 'COLD',
      score: 10,
    }),
  })
  if (!res.ok) throw new Error('Failed to submit')
  return res.json()
}
