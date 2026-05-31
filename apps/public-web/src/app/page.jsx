import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { ServicesSection } from '@/components/ServicesSection'
import { PricingSection } from '@/components/PricingSection'
import { CTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
