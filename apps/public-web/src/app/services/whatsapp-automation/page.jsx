import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'WhatsApp Automation — AiGateway',
  description: 'AI-powered WhatsApp automation. Broadcasts, conversational flows, lead qualification, CRM integration, and analytics.',
}

const service = {
  icon: '💬',
  slug: 'whatsapp-automation',
  badge: 'SaaS Service',
  name: 'WhatsApp Automation',
  title: 'WhatsApp Automation',
  description: 'Automate WhatsApp conversations with intelligent flows, broadcast campaigns, and lead qualification bots. Every interaction is tracked and synced to your CRM.',
  price: '$99/mo',
  priceINR: '₹9,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '📢', title: 'Broadcasts', desc: 'Send targeted broadcast messages to segmented contact lists with rich media support.' },
    { icon: '🔀', title: 'Conversational Flows', desc: 'Build interactive chatbot flows that qualify leads, answer FAQs, and route conversations.' },
    { icon: '🎯', title: 'Lead Qualification', desc: 'AI automatically scores and qualifies leads based on their WhatsApp interactions.' },
    { icon: '🔄', title: 'CRM Integration', desc: 'Every WhatsApp conversation is logged as a lead in your CRM with full message history.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track message delivery, read rates, response times, and conversion metrics.' },
    { icon: '🤖', title: 'Smart Auto-Replies', desc: 'AI-powered auto-replies handle common queries instantly while routing complex ones to your team.' },
  ],
  steps: ['Connect WhatsApp API', 'Build conversation flows', 'Launch campaigns', 'Track leads in CRM'],
}

export default function WhatsAppAutomationPage() {
  return <ServiceDetailPage service={service} />
}
