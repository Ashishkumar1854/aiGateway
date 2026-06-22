import { ServiceDetailPage } from '@/components/ServiceDetailPage'

export const metadata = {
  title: 'Reels Automation — AiGateway',
  description: 'AI-powered reels automation. Script generation, caption writing, scheduling, and multi-platform analytics.',
}

const service = {
  icon: '🎬',
  slug: 'reels-automation',
  badge: 'SaaS Service',
  name: 'Reels Automation',
  title: 'Reels Automation',
  description: 'Automate your social media content pipeline. AI generates scripts, writes captions, schedules posts, and tracks performance across platforms.',
  price: '$99/mo',
  priceINR: '₹9,999/mo',
  pricePeriod: 'Billed monthly · Cancel anytime',
  features: [
    { icon: '📝', title: 'Script Generation', desc: 'AI generates engaging reel scripts based on your brand, niche, and trending topics.' },
    { icon: '✍️', title: 'Caption Writing', desc: 'Automatic caption and hashtag generation optimized for maximum reach and engagement.' },
    { icon: '📅', title: 'Smart Scheduling', desc: 'Schedule posts at optimal times across Instagram, YouTube Shorts, and TikTok.' },
    { icon: '📊', title: 'Performance Analytics', desc: 'Track views, engagement, reach, and growth metrics across all platforms in one dashboard.' },
    { icon: '🎨', title: 'Content Calendar', desc: 'AI maintains a content calendar with planned topics, scripts, and publishing schedule.' },
    { icon: '🔄', title: 'Multi-Platform Sync', desc: 'Publish and syndicate content across multiple social platforms simultaneously.' },
  ],
  steps: ['Choose content niche', 'AI generates scripts', 'Review & schedule', 'Track performance'],
}

export default function ReelsAutomationPage() {
  return <ServiceDetailPage service={service} />
}
