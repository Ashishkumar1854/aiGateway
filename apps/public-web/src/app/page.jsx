import { HeroSection }        from '@/components/HeroSection'
import { BuiltForSection }    from '@/components/BuiltForSection'
import { HowItWorks }         from '@/components/HowItWorks'
import { ServicesSection }    from '@/components/ServicesSection'
import { PricingSection }     from '@/components/PricingSection'
import { WhyAiGateway }       from '@/components/WhyAiGateway'
import { ROICalculator }      from '@/components/ROICalculator'
import { ComparisonTable }    from '@/components/ComparisonTable'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { FAQSection }         from '@/components/FAQSection'
import { CTASection }         from '@/components/CTASection'

export const metadata = {
  title: 'AiGateway — AI-Powered Business Automation Platform',
  description: 'Generate leads, automate outreach, and scale faster with AI employees. Lead Generation, Email, WhatsApp, LinkedIn & Reels Automation.',
}

export default function HomePage() {
  return (
    <>
      {/* S2 — Hero */}
      <HeroSection />

      {/* S3 — Built For */}
      <BuiltForSection />

      {/* S4 — How It Works */}
      <HowItWorks />

      {/* S5 — SaaS Services */}
      <ServicesSection />

      {/* S10 — Pricing (per-service, INR/USD) */}
      <PricingSection />

      {/* S7 — Why AiGateway */}
      <WhyAiGateway />

      {/* S8 — ROI Calculator */}
      <ROICalculator />

      {/* S9 — Comparison Table */}
      <ComparisonTable />

      {/* S11 — Testimonials */}
      <TestimonialsSection />

      {/* S12 — FAQ */}
      <FAQSection />

      {/* S13 — Final CTA */}
      <CTASection />
    </>
  )
}
