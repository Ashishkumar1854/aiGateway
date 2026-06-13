const { sendSuccess } = require('../../../utils/response')

// Multi-depth FAQ knowledge base with follow-up suggestions
const FAQ_KB = {
  "what is aigateway?": {
    answer: "AiGateway is an **AI-Powered Workforce platform** that deploys virtual employees — built in Python — to automate your business operations. From lead scraping to cold outreach and calendar scheduling, every AI action runs under strict **human-in-the-loop oversight** so your brand stays safe.",
    suggestions: [
      "How does the 2-day setup work?",
      "What services do you offer?",
      "What is the pricing model?",
      "What is the approval queue?",
    ],
  },

  "what services do you offer?": {
    answer: "AiGateway offers four core AI-powered SaaS services:\n\n🎯 **Lead Generation Bot** — Scrapes Google Maps, LinkedIn & directories, scores leads 0-100, and syncs to your CRM.\n\n📧 **Email Agent Pitches** — Writes personalized cold outreach emails with multi-step follow-ups, requiring your approval before sending.\n\n🎬 **Reels Automation Bot** — Auto-generates scripts, captions, and schedules uploads to YouTube & Instagram.\n\n💬 **WhatsApp Flow Automation** — NLP-powered auto-replies, drip broadcasts, and lead capture, all within WhatsApp API compliance.\n\nWe also build **Custom & Personal Branding** solutions on request!",
    suggestions: [
      "Tell me about the Lead Generation Bot",
      "How does WhatsApp automation work?",
      "Tell me about personal branding services",
      "What is the pricing model?",
    ],
  },

  "tell me about the lead generation bot": {
    answer: "The **Lead Generation Bot** is your 24/7 AI prospecting employee:\n\n✅ Scans Google Maps, LinkedIn, Justdial & Indian directories for businesses matching your target customer profile.\n✅ Scores every prospect 0-100 based on your ICP criteria (industry, location, size).\n✅ Enriches data — phone, email, address, website — automatically.\n✅ Syncs enriched leads directly to your CRM pipeline as COLD status.\n✅ Triggers your email outreach workflow automatically.\n\nAll within 48 hours of activation!",
    suggestions: [
      "How does the approval queue work?",
      "How does email outreach work?",
      "How does the 2-day setup work?",
      "What is the pricing model?",
    ],
  },

  "how does whatsapp automation work?": {
    answer: "The **WhatsApp Flow Automation** service keeps your leads warm at every stage:\n\n✅ Sends broadcast sequences (text + media) to opted-in contacts.\n✅ NLP auto-replies handle common questions instantly — no manual effort.\n✅ Interactive branches qualify leads with conversational logic.\n✅ New inbound leads get logged to the CRM database automatically.\n✅ Fully compliant with WhatsApp Cloud API rules — no ban risk.\n\nPerfect for appointment bookings, quote requests, and support funnels.",
    suggestions: [
      "Tell me about personal branding services",
      "Can you build a custom WhatsApp CRM for me?",
      "What is the pricing model?",
      "How does the 2-day setup work?",
    ],
  },

  "tell me about personal branding services": {
    answer: "Beyond our standard SaaS plans, AiGateway builds **fully bespoke digital solutions** tailored to your business:\n\n🌐 **Personal & Business Websites** — High-quality Next.js sites with modern design, SEO, and CMS.\n📊 **Custom CRM Systems** — Built from scratch or integrated with HubSpot, Salesforce, or your own stack.\n⚙️ **CRM Automation Pipelines** — Auto-assign leads, trigger sequences, and build intelligent rule workflows.\n💬 **WhatsApp CRM Integration** — Connect WhatsApp directly into your CRM so every chat is a tracked opportunity.\n🤖 **Custom AI Bots** — Knowledge base bots, booking bots, support agents, and scraper bots built to your specs.\n\nEvery project gets a **dedicated scoping call**, fixed price quote, and delivery within agreed timelines.",
    suggestions: [
      "Can you build a custom WhatsApp CRM for me?",
      "How do I submit a custom project?",
      "What does a custom project cost?",
      "How does the 2-day setup work?",
    ],
  },

  "can you build a custom whatsapp crm for me?": {
    answer: "Absolutely! A **Custom WhatsApp CRM** is one of our most popular bespoke builds. Here's what we typically include:\n\n✅ WhatsApp Cloud API integration (official, no risk of ban).\n✅ Conversation logs synced to a central database.\n✅ Lead tagging, stage tracking, and sales pipeline view.\n✅ Automated responses for common queries.\n✅ Team inbox — multiple agents handling chats from one dashboard.\n✅ Reports on message volume, response rates, and conversion.\n\nBudget range: ₹30,000 – ₹1,50,000 depending on scope. Submit your requirements and we'll give you a detailed quote within 24 hours!",
    suggestions: [
      "How do I submit a custom project?",
      "What does a custom project cost?",
      "What is the pricing model?",
      "How does the 2-day setup work?",
    ],
  },

  "how do i submit a custom project?": {
    answer: "Submitting a custom project scope is easy:\n\n1️⃣ Go to our **Personal Branding** page from the navigation bar.\n2️⃣ Fill in your company name, contact details, and **project name**.\n3️⃣ Select your **estimated budget range** (₹15k – ₹2L+).\n4️⃣ Describe your **requirements** in as much detail as possible.\n5️⃣ Hit **Submit Custom Project** — our team receives it instantly.\n\nWe'll review your scope and get back within **24 hours** with a timeline and quote!",
    suggestions: [
      "What does a custom project cost?",
      "How does the 2-day setup work?",
      "What is the pricing model?",
      "Tell me about personal branding services",
    ],
  },

  "what does a custom project cost?": {
    answer: "Custom project pricing depends on scope and complexity:\n\n💼 **Simple Website or Landing Page** — ₹15,000 – ₹30,000\n📊 **Custom CRM / Dashboard** — ₹30,000 – ₹75,000\n⚙️ **CRM + Automation Pipelines** — ₹50,000 – ₹1,50,000\n💬 **WhatsApp CRM Integration** — ₹30,000 – ₹1,50,000\n🤖 **Custom AI Bot / Scraper** — ₹75,000 – ₹2,00,000+\n\nAll projects come with a **fixed price quote** after a free 30-minute scoping call. No surprise billing!",
    suggestions: [
      "How do I submit a custom project?",
      "What is the pricing model?",
      "How does the 2-day setup work?",
      "What is the approval queue?",
    ],
  },

  "what is the approval queue?": {
    answer: "The **Human-in-the-Loop Approval Queue** is a core safety feature of AiGateway:\n\n🔒 No AI employee can send an email, book a meeting, or take any external action on its own.\n\nHere's how it works:\n1. An AI agent drafts an action — e.g. a personalized cold email.\n2. The draft goes into your **'Awaiting Approval'** queue in the admin dashboard.\n3. You review the content, make any edits, and click **Approve**.\n4. Only then does the AI execute the action.\n\nThis means **100% brand safety** — your reputation is always in your hands.",
    suggestions: [
      "What is AiGateway?",
      "How does the 2-day setup work?",
      "What services do you offer?",
      "What is the pricing model?",
    ],
  },

  "how does the 2-day setup work?": {
    answer: "Getting started with AiGateway is **fast and guided**:\n\n📋 **Day 0** — Submit your inquiry via the Contact or Get Started form.\n📞 **Day 1 (Morning)** — Our team schedules a 30-minute onboarding call to understand your ICP and target market.\n⚙️ **Day 1 (Afternoon)** — We configure your lead generation criteria, outreach templates, and dashboard.\n🚀 **Day 2** — Your AI workforce goes live. First leads start appearing in your CRM pipeline.\n\nOur team handles all setup, Docker deployment, and integration. You just watch leads roll in!",
    suggestions: [
      "What is the pricing model?",
      "What is the approval queue?",
      "What services do you offer?",
      "How do I get support?",
    ],
  },

  "what is the pricing model?": {
    answer: "AiGateway has transparent, flat monthly pricing:\n\n🟡 **Starter Plan — ₹9,999/month**\n• Up to 2 active AI services\n• 500 leads per month\n• Email outreach automation\n• Human approval dashboard\n\n🟢 **Pro Plan — ₹24,999/month**\n• Up to 5 active AI services\n• 2,000 leads per month\n• All services + WhatsApp automation\n• Priority support & reporting\n\n💼 **Custom / Enterprise**\n• Bespoke builds & integrations\n• Fixed price, scoped per project\n• Dedicated delivery manager\n\nAll plans include a **free 2-day setup** and onboarding session.",
    suggestions: [
      "How does the 2-day setup work?",
      "How do I get support?",
      "Tell me about personal branding services",
      "How do I submit a custom project?",
    ],
  },

  "how do i get support?": {
    answer: "AiGateway offers **multi-channel support** for all clients:\n\n📧 **Email** — hello@aigateway.com (response within 4 hours on business days)\n💬 **WhatsApp** — Direct message support for urgent issues (Pro plan)\n📞 **Phone** — Scheduled calls via your dashboard\n🎫 **Ticket System** — Log issues inside your Client Dashboard, tracked to resolution\n\nFor custom project clients, you get a **dedicated Slack/WhatsApp channel** with your delivery team for the project duration.",
    suggestions: [
      "What is the pricing model?",
      "How does the 2-day setup work?",
      "What is AiGateway?",
      "What services do you offer?",
    ],
  },
}

// Default suggestions shown at open
const DEFAULT_SUGGESTIONS = [
  "What is AiGateway?",
  "What services do you offer?",
  "Tell me about personal branding services",
  "What is the pricing model?",
  "How does the 2-day setup work?",
]

const queryBot = async (req, res, next) => {
  try {
    const { question } = req.body
    if (!question) {
      return res.status(400).json({ success: false, error: { message: "Question query parameter is required." } })
    }

    const queryKey = question.toLowerCase().trim().replace(/[?!.,]$/, '').replace(/[?!.,]/g, '').trim()
    
    // Try exact match first
    let match = FAQ_KB[question.toLowerCase().trim()]
    
    // Try normalized key match
    if (!match) {
      const normalized = question.toLowerCase().trim()
      match = FAQ_KB[normalized]
    }

    // Try partial key match  
    if (!match) {
      const keys = Object.keys(FAQ_KB)
      const partialKey = keys.find(k => k.includes(queryKey) || queryKey.includes(k.replace('?', '').trim()))
      if (partialKey) match = FAQ_KB[partialKey]
    }

    if (match) {
      return sendSuccess(res, {
        question,
        answer: match.answer,
        suggestions: match.suggestions,
      })
    }

    return sendSuccess(res, {
      question,
      answer: "Thank you for asking! I'm trained on AiGateway-specific topics. Please select one of the suggested topics below, or email us at **hello@aigateway.com** for a personalized conversation.",
      suggestions: DEFAULT_SUGGESTIONS,
    })
  } catch (err) {
    next(err)
  }
}

const getSuggestions = async (req, res, next) => {
  try {
    return sendSuccess(res, { suggestions: DEFAULT_SUGGESTIONS })
  } catch (err) {
    next(err)
  }
}

module.exports = { queryBot, getSuggestions }
