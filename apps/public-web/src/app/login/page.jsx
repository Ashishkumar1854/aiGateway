import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Redirecting to Login — AiGateway',
  description: 'Redirecting to your AiGateway client dashboard login.',
}

export default function LoginPage({ searchParams }) {
  const dashboardURL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'
  const params = new URLSearchParams(searchParams || {})
  const queryString = params.toString()
  const target = queryString ? `${dashboardURL}/login?${queryString}` : `${dashboardURL}/login`
  
  redirect(target)
  return null
}
