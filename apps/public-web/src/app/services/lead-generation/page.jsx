import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'Lead Generation — AiGateway',
  description: 'AI-powered lead generation. Search businesses, scrape Google Maps & LinkedIn, enrich contacts, and sync to CRM automatically.',
}

const service = {
  icon: '🎯',
  slug: 'lead-generation',
  badge: 'SaaS Service',
  name: 'Lead Generation',
  title: 'AI Lead Generation',
  description: 'Our AI agents automatically search Google Maps, LinkedIn, and business directories to find your ideal prospects. Every lead is scored, enriched, and synced to your CRM pipeline.',
  price: '$99/mo',
  priceINR: '₹9,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '🔍', title: 'Search Businesses', desc: 'Automatically scan Google Maps, LinkedIn, and industry directories to find businesses matching your ICP.' },
    { icon: '🗺️', title: 'Google Maps Scraping', desc: 'Extract business details, reviews, ratings, and contact info from Google Maps at scale.' },
    { icon: '🔗', title: 'LinkedIn Prospecting', desc: 'Discover decision-makers and key contacts on LinkedIn using AI-powered search filters.' },
    { icon: '📊', title: 'Lead Enrichment', desc: 'Automatically enrich every lead with email, phone, website, industry, and company size data.' },
    { icon: '📤', title: 'CSV & API Exports', desc: 'Export enriched leads as CSV files or push them directly via API to your existing tools.' },
    { icon: '🔄', title: 'CRM Sync', desc: 'Real-time sync to your AiGateway CRM pipeline. Leads appear as COLD status with full enrichment data.' },
  ],
  steps: ['Define your ICP criteria', 'AI scrapes multiple sources', 'Leads scored & enriched', 'Synced to your CRM'],
}

export default function LeadGenerationPage() {
  return <ServiceDetailPage service={service} />
}
