import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'Email Automation — AiGateway',
  description: 'AI-powered email automation. Campaign builder, personalized followups, reply tracking, and human-approved outreach.',
}

const service = {
  icon: '📧',
  slug: 'email-automation',
  badge: 'SaaS Service',
  name: 'Email Automation',
  title: 'Email Automation',
  description: 'AI writes, schedules, and manages personalized email outreach campaigns. Multi-step follow-ups, reply detection, and complete human-in-the-loop approval.',
  price: '$99/mo',
  priceINR: '₹9,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '✏️', title: 'Campaign Builder', desc: 'Build multi-step email sequences with AI-generated personalized copy tailored to each prospect.' },
    { icon: '🔄', title: 'Smart Followups', desc: 'Automatic follow-up scheduling based on open rates, reply patterns, and engagement signals.' },
    { icon: '📬', title: 'Reply Tracking', desc: 'Detect positive replies, out-of-office messages, and interest signals automatically.' },
    { icon: '🛡️', title: 'Human Approval', desc: 'Every email draft goes through your approval queue before sending. Complete control.' },
    { icon: '📊', title: 'Reports & Analytics', desc: 'Track open rates, reply rates, bounce rates, and conversion metrics in real-time dashboards.' },
    { icon: '🎯', title: 'A/B Testing', desc: 'Test different subject lines, copy variations, and send times to maximize engagement.' },
  ],
  steps: ['Upload or sync leads', 'AI generates email drafts', 'Review & approve in queue', 'Track replies & meetings'],
}

export default function EmailAutomationPage() {
  return <ServiceDetailPage service={service} />
}
