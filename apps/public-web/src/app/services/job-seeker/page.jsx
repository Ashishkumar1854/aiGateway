import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'Smart Apply — AiGateway',
  description: 'AI-powered job search and automation. Scrape job listings, find recruiter email contacts, optimize your resume for ATS, and auto-apply.',
}

const service = {
  icon: '💼',
  slug: 'job-seeker',
  badge: 'SaaS Service',
  name: 'Smart Apply',
  title: 'AI Smart Apply Automation',
  description: 'Deploy your personal AI job search assistant. Scrape listings, find recruiter emails, optimize your resume for ATS, auto-apply, and track dashboard replies.',
  price: '$39/mo',
  priceINR: '₹2,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '📝', title: 'ATS Resume Customization', desc: 'AI drafts customized outreach copy matching your skills and experience to the target job description to bypass applicant filters.' },
    { icon: '📤', title: 'Recruiter Direct Mailer', desc: 'Input any recruiter or HR contact email, and the system automatically sends personalized outreach emails with resume attachments.' },
    { icon: '🔎', title: 'Auto Recruiter Email Finder', desc: 'Automated lookup systems query LinkedIn, Indeed, and company directories to discover active recruiter emails.' },
    { icon: '🚀', title: 'Auto Job Applying', desc: 'Apply automatically to matching vacancies across top job boards and careers portals using our built-in application APIs.' },
    { icon: '✉️', title: 'Email Open & Reply Tracker', desc: 'Full client dashboard tracking shows when recruiters open your outreach mails or reply back to your application.' },
    { icon: '🔄', title: 'Real-time sync to CRM', desc: 'Sync your job applications pipeline directly to the AiGateway CRM dashboard, status automatically shifting to WON upon interview booking.' },
  ],
  steps: ['Upload resume & experience profile', 'Find target vacancies & emails', 'Auto-customize outreach message', 'Send application & track replies'],
}

export default function JobSeekerPage() {
  return <ServiceDetailPage service={service} />
}
