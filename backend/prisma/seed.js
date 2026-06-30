const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Admin User ──────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aigateway.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@aigateway.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Test Client User ────────────────────────
  const clientPassword = await bcrypt.hash('client123', 10)
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@testcompany.com' },
    update: {},
    create: {
      name: 'Test Client',
      email: 'client@testcompany.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
    },
  })

  // ── Test Client Profile ─────────────────────
  const client = await prisma.client.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      userId: clientUser.id,
      companyName: 'Test Company Pvt Ltd',
      industry: 'E-commerce',
      website: 'https://testcompany.com',
      status: 'active',
    },
  })
  console.log('✅ Test client:', client.companyName)

  // ── Services ────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-reels' },
      update: {},
      create: {
        id: 'service-reels',
        name: 'Reels Automation',
        type: 'REELS_AUTOMATION',
        description: 'Automated Instagram/YouTube Reels creation and posting',
        features: ['Auto scheduling', 'AI captions', 'Hashtag optimization'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-email' },
      update: {},
      create: {
        id: 'service-email',
        name: 'Email Automation',
        type: 'EMAIL_AUTOMATION',
        description: 'AI-powered email sequences and follow-ups',
        features: ['Drip campaigns', 'Personalization', 'A/B testing'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-leads' },
      update: {},
      create: {
        id: 'service-leads',
        name: 'Lead Generation',
        type: 'LEAD_GENERATION',
        description: 'AI-powered lead research and scoring',
        features: ['Auto scraping', 'Lead scoring', 'CRM sync'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-whatsapp' },
      update: {},
      create: {
        id: 'service-whatsapp',
        name: 'WhatsApp Automation',
        type: 'WHATSAPP_AUTOMATION',
        description: 'WhatsApp business messaging automation',
        features: ['Auto replies', 'Broadcasts', 'Flow builder'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-linkedin' },
      update: {},
      create: {
        id: 'service-linkedin',
        name: 'LinkedIn Automation',
        type: 'LINKEDIN_OUTREACH',
        description: 'AI-driven LinkedIn connection and outreach automation',
        features: ['Connection Requests', 'Followups', 'Prospect Discovery', 'Outreach Tracking'],
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-job-seeker' },
      update: {
        name: 'Smart Apply',
      },
      create: {
        id: 'service-job-seeker',
        name: 'Smart Apply',
        type: 'JOB_SEEKER',
        description: 'AI job search automation, recruiter email direct mailer, and ATS customization',
        features: ['ATS Optimization', 'Auto Resume Attach', 'Recruiter Mail Finder', 'Auto Job Applying', 'Reply Dashboard'],
      },
    }),
  ])
  console.log('✅ Services seeded:', services.length)

  // ── Test Subscription ───────────────────────
  await prisma.subscription.upsert({
    where: { id: 'sub-test-001' },
    update: {},
    create: {
      id: 'sub-test-001',
      clientId: client.id,
      plan: 'STARTER',
      status: 'ACTIVE',
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })
  console.log('✅ Test subscription created')

  // ── Sample Leads ─────────────────────────────
  const leads = await Promise.all([
    prisma.lead.upsert({
      where: { id: 'lead-001' },
      update: {},
      create: {
        id: 'lead-001',
        companyName: 'Sharma Fitness Studio',
        contactName: 'Rahul Sharma',
        email: 'rahul@sharmafitness.com',
        phone: '+91 98765 43210',
        industry: 'Fitness',
        location: 'Mumbai',
        status: 'WARM',
        score: 72,
        source: 'lead_research_agent',
        notes: 'Active on Instagram, 15k followers, looking for content automation',
      },
    }),
    prisma.lead.upsert({
      where: { id: 'lead-002' },
      update: {},
      create: {
        id: 'lead-002',
        companyName: 'Delhi Cafe Chain',
        contactName: 'Priya Gupta',
        email: 'priya@delhicafe.com',
        phone: '+91 87654 32109',
        industry: 'Food & Beverage',
        location: 'Delhi',
        status: 'QUALIFIED',
        score: 85,
        source: 'manual',
        notes: 'Owns 5 cafe locations, wants WhatsApp + Reels automation',
      },
    }),
    prisma.lead.upsert({
      where: { id: 'lead-003' },
      update: {},
      create: {
        id: 'lead-003',
        companyName: 'TechStart Solutions',
        contactName: 'Amit Patel',
        email: 'amit@techstart.in',
        industry: 'Technology',
        location: 'Bangalore',
        status: 'COLD',
        score: 45,
        source: 'lead_research_agent',
      },
    }),
  ])
  console.log('✅ Sample leads seeded:', leads.length)

  console.log('\n🎉 Seeding complete!')
  console.log('──────────────────────────────')
  console.log('Admin:  admin@aigateway.com / admin123')
  console.log('Client: client@testcompany.com / client123')
  console.log('──────────────────────────────')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
