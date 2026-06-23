import Link from 'next/link'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'Case Studies — AiGateway',
  description: 'See how businesses use AiGateway to automate lead generation, email outreach, CRM, and WhatsApp campaigns.',
}

const caseStudies = [
  {
    icon: '🎯',
    category: 'Lead Generation',
    title: 'How a SaaS startup generated 1,200+ leads in 30 days',
    company: 'GrowthStack Agency',
    industry: 'Marketing Agency',
    result: '1,247 qualified leads',
    metric: '12x ROI',
    desc: 'A Bangalore-based marketing agency was spending ₹50,000/month on manual prospecting. After switching to AiGateway Lead Generation, they automated Google Maps scraping and LinkedIn prospecting, generating 1,247 qualified leads in their first month.',
    highlights: ['1,247 leads in 30 days', '₹50,000/mo saved on manual work', '85% ICP match rate', '34 meetings booked'],
  },
  {
    icon: '📧',
    category: 'Recruitment Automation',
    title: 'Recruiting firm cut sourcing time by 80% with AI outreach',
    company: 'RecruitFast',
    industry: 'HR & Recruiting',
    result: '80% time saved',
    metric: '3x placements',
    desc: 'A recruitment firm in Mumbai was manually sourcing candidates and sending outreach emails. AiGateway automated candidate discovery on LinkedIn and personalized email sequences, tripling their placement rate.',
    highlights: ['80% reduction in sourcing time', '3x more placements per month', 'Automated follow-up sequences', 'CRM pipeline integration'],
  },
  {
    icon: '📊',
    category: 'CRM Automation',
    title: 'Real estate company automated their entire sales pipeline',
    company: 'PropConnect Realty',
    industry: 'Real Estate',
    result: 'Full pipeline automation',
    metric: '45% more closings',
    desc: 'A real estate company in Delhi was managing leads in spreadsheets. AiGateway built them a custom CRM with automated lead assignment, follow-up sequences, and WhatsApp integration, resulting in 45% more closings.',
    highlights: ['Custom CRM dashboard', 'Automated lead assignment', 'WhatsApp follow-up flows', '45% increase in closings'],
  },
  {
    icon: '💬',
    category: 'WhatsApp Automation',
    title: 'E-commerce brand 5x their WhatsApp conversions',
    company: 'StyleBazaar',
    industry: 'E-commerce',
    result: '5x WhatsApp conversions',
    metric: '₹2L+ monthly revenue',
    desc: 'An online fashion brand was manually responding to WhatsApp inquiries. AiGateway automated their WhatsApp flows with product recommendations, order updates, and abandoned cart recovery, 5x their conversions.',
    highlights: ['Automated product recommendations', 'Cart recovery campaigns', 'Order status broadcasts', '5x conversion rate increase'],
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="bg-white text-slate-800 min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden pt-24 pb-20 border-b border-slate-100 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 relative z-10">
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Case Studies
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mt-5 leading-tight">Real Results</h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            See how businesses across industries are using AiGateway to automate growth.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-8">
          {caseStudies.map((cs) => (
            <div
              key={cs.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-indigo-250 hover:shadow-lg hover:shadow-indigo-50/20 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl">{cs.icon}</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {cs.category}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">{cs.title}</h2>

                  <div className="flex items-center gap-4 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{cs.company}</span>
                    <span>·</span>
                    <span>{cs.industry}</span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{cs.desc}</p>

                  <ul className="space-y-2 pt-2">
                    {cs.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-emerald-600 font-bold">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Key Metrics */}
                <div className="lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-4">
                  <div className="flex-1 rounded-xl border border-emerald-250 bg-emerald-50 p-4 text-center">
                    <p className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider mb-1">Result</p>
                    <p className="text-sm font-bold text-emerald-800">{cs.result}</p>
                  </div>
                  <div className="flex-1 rounded-xl border border-indigo-250 bg-indigo-50 p-4 text-center">
                    <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider mb-1">Impact</p>
                    <p className="text-sm font-bold text-indigo-850">{cs.metric}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  )
}
