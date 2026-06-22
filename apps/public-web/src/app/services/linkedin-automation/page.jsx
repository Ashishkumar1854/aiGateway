import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'LinkedIn Automation — AiGateway',
  description: 'AI-powered LinkedIn automation. Connection requests, smart followups, prospect discovery, and outreach tracking.',
}

const service = {
  icon: '🔗',
  slug: 'linkedin-automation',
  badge: 'SaaS Service',
  name: 'LinkedIn Automation',
  title: 'LinkedIn Automation',
  description: 'Automate your LinkedIn outreach with AI-powered connection requests, personalized followups, and prospect discovery. Build relationships at scale without manual effort.',
  price: '$99/mo',
  priceINR: '₹9,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '🤝', title: 'Connection Requests', desc: 'Send targeted connection requests to decision-makers matching your ideal customer profile.' },
    { icon: '🔄', title: 'Smart Followups', desc: 'AI schedules and sends personalized follow-up messages based on connection activity.' },
    { icon: '🔍', title: 'Prospect Discovery', desc: 'AI continuously finds new prospects on LinkedIn based on your configured criteria.' },
    { icon: '📊', title: 'Outreach Tracking', desc: 'Track connection acceptance rates, message responses, and profile visit analytics.' },
    { icon: '📝', title: 'Message Personalization', desc: 'AI generates unique messages for each prospect based on their profile and activity data.' },
    { icon: '🛡️', title: 'Safety Limits', desc: 'Built-in rate limiting and safety controls to keep your LinkedIn account secure.' },
  ],
  steps: ['Define target audience', 'AI finds prospects', 'Sends connection requests', 'Followup & track'],
}

export default function LinkedInAutomationPage() {
  return <ServiceDetailPage service={service} />
}
