# AiGateway — Final Production Implementation Plan

> **Senior Developer Approach** | Local → Docker → GitHub CI/CD → VPS
> 
> Build order: Structure → Backend APIs → Postman Test → Frontend → Deploy

---

## Current State (from screenshot)

✅ Monorepo with Turborepo + pnpm  
✅ apps/ai-agents, apps/client-dashboard, apps/public-web  
✅ backend/ with Prisma  
✅ n8n/ folder  
✅ docker/ folder  
✅ docs/agents/agent-types.md  
✅ packages/ for shared code  

**Key Decision:** AI Agents live inside `admin-dashboard` as a module — NOT as a separate domain.

---

## Final Folder Structure (Production)

```
AiGateway/
├── apps/
│   ├── public-web/              → yourcompany.com
│   ├── client-dashboard/        → app.yourcompany.com
│   └── admin-dashboard/         → admin.yourcompany.com
│       └── modules/
│           └── ai-agents/       ← AI Agents live HERE (admin module)
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       ├── users/
│   │   │       ├── clients/
│   │   │       ├── services/
│   │   │       ├── subscriptions/
│   │   │       ├── crm/
│   │   │       ├── workflows/
│   │   │       ├── agents/        ← AI agent control APIs
│   │   │       ├── analytics/
│   │   │       └── webhooks/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── services/
│   │   ├── queues/
│   │   ├── utils/
│   │   └── config/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── tests/
│
├── ai-workers/                  ← Python FastAPI (internal only)
│   ├── orchestrator/
│   ├── agents/
│   │   ├── lead_research/
│   │   ├── email_outreach/
│   │   ├── linkedin/
│   │   └── meeting/
│   ├── shared/
│   │   ├── memory.py
│   │   ├── crm_client.py
│   │   └── prompts/
│   └── main.py
│
├── n8n/
│   ├── workflows/
│   └── webhooks/
│
├── packages/
│   ├── ui/                      ← Shared components
│   ├── types/                   ← Shared TypeScript types
│   ├── auth/                    ← Shared auth utilities
│   └── utils/                   ← Shared helpers
│
├── infrastructure/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.prod.yml
│   │   └── Dockerfiles per service
│   └── scripts/
│       ├── setup.sh
│       ├── deploy.sh
│       └── backup.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docs/
│   ├── IMPLEMENTATION_PLAN.md   ← This file
│   ├── DESIGN.md                ← Workflow tracking
│   ├── API.md                   ← API documentation
│   └── agents/
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Domain + Port Map

| Domain | Internal Port | Service |
|--------|--------------|---------|
| yourcompany.com | 3000 | public-web |
| app.yourcompany.com | 3001 | client-dashboard |
| admin.yourcompany.com | 3002 | admin-dashboard |
| api.yourcompany.com | 5000 | backend API |
| — (internal) | 5678 | n8n |
| — (internal) | 8000 | ai-workers |

> n8n and ai-workers are **never exposed** to public internet. Backend calls them via internal Docker network.

---

## Tech Stack (Final)

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Package Manager | pnpm |
| Frontend | Next.js 14 + Tailwind + Shadcn |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT + Refresh Tokens |
| Automation | n8n |
| AI Workers | Python 3.11 + FastAPI |
| Queue | Bull (Redis-backed) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Reverse Proxy | Nginx |
| VPS | Hetzner / Contabo |

---

## Phase-Wise Implementation Plan

> **Rule:** Each phase = independently shippable. Never jump phases.  
> **Testing Rule:** After each backend phase → test with Postman before frontend.  
> **Git Rule:** feature/* → develop → main (production)

---

### PHASE 0 — Project Audit & Structure Lock
**Status:** 🟡 In Progress  
**Objective:** Freeze architecture, fix current structure, ensure monorepo works.

**Tasks:**
- [ ] Move `apps/ai-agents` logic → `apps/admin-dashboard/modules/ai-agents`
- [ ] Delete `apps/ai-agents` top-level app
- [ ] Create `ai-workers/` at root (Python FastAPI — internal service)
- [ ] Verify `turbo.json` build pipeline is correct
- [ ] Verify `pnpm-workspace.yaml` includes all packages
- [ ] Create `packages/types/index.ts` with all shared types
- [ ] Create `.env.example` with all required variables
- [ ] Create `DESIGN.md` for tracking (see separate file)

**Deliverable:** Clean monorepo that builds with `pnpm dev`

---

### PHASE 1 — Docker Local Environment
**Status:** 🔴 Not Started  
**Objective:** Single `docker-compose up` starts entire platform locally.

**Build:**
```yaml
Services:
  - nginx          → reverse proxy (ports 80/443)
  - postgres       → database (port 5432)
  - redis          → cache + queue (port 6379)
  - backend        → Node API (port 5000)
  - public-web     → Next.js (port 3000)
  - client-dash    → Next.js (port 3001)
  - admin-dash     → Next.js (port 3002)
  - n8n            → automation (port 5678, internal)
  - ai-workers     → Python FastAPI (port 8000, internal)
```

**Key Points:**
- Persistent volumes for postgres and redis
- Internal Docker network: `aigw_internal`
- Health checks on all services
- Hot reload in development mode
- Single `.env` file at root

**Local Hosts (`/etc/hosts`):**
```
127.0.0.1  aigw.local
127.0.0.1  app.aigw.local
127.0.0.1  admin.aigw.local
127.0.0.1  api.aigw.local
```

**Deliverable:** `docker-compose up -d` → all services running

---

### PHASE 2 — Database Schema Implementation
**Status:** 🔴 Not Started  
**Objective:** Production-safe PostgreSQL schema via Prisma.

**Core Modules (from your dbdiagram.io schema):**
```
users, roles, permissions
clients, client_contacts
services, service_assignments
subscriptions, subscription_plans
crm_leads, crm_conversations, crm_meetings, crm_notes, crm_tasks
workflows, workflow_logs
ai_agents, agent_tasks, agent_logs, agent_memory
analytics_events
payments, invoices
```

**Standards:**
- All PKs: UUID (`@default(uuid())`)
- All tables: `created_at`, `updated_at`, `deleted_at` (soft delete)
- Multi-tenant: all data scoped by `client_id` where applicable
- Indexes on: all FKs, `email`, `status`, `created_at`
- Enums for: `Role`, `LeadStatus`, `SubscriptionPlan`, `AgentType`, `TaskStatus`

**Commands:**
```bash
pnpm --filter backend prisma migrate dev --name init
pnpm --filter backend prisma generate
pnpm --filter backend prisma db seed
```

**Deliverable:** All migrations passing, seed data working

---

### PHASE 3 — Backend Core API
**Status:** 🔴 Not Started  
**Objective:** Build the central brain. All business logic lives here.

**Build Order (within this phase):**

#### 3a — Foundation
- Express app setup with TypeScript
- Middleware stack: cors, helmet, morgan, rate-limit
- Error handling middleware (centralized)
- Response formatter utility
- Environment config validation (Zod)
- Logger (Winston)

#### 3b — Auth APIs
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

> **Postman Test Checkpoint:** Test all auth APIs before proceeding.

#### 3c — Users & Roles
```
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/roles
POST   /api/v1/roles
```

#### 3d — Clients
```
GET    /api/v1/clients
POST   /api/v1/clients
GET    /api/v1/clients/:id
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id (soft delete)
GET    /api/v1/clients/:id/services
POST   /api/v1/clients/:id/services
```

> **Postman Test Checkpoint**

#### 3e — Services & Subscriptions
```
GET    /api/v1/services
POST   /api/v1/services
GET    /api/v1/subscriptions
POST   /api/v1/subscriptions
GET    /api/v1/subscriptions/:id
PUT    /api/v1/subscriptions/:id/cancel
```

#### 3f — CRM APIs
```
GET    /api/v1/crm/leads
POST   /api/v1/crm/leads
GET    /api/v1/crm/leads/:id
PUT    /api/v1/crm/leads/:id
GET    /api/v1/crm/leads/:id/conversations
POST   /api/v1/crm/conversations
POST   /api/v1/crm/meetings
GET    /api/v1/crm/pipeline
PUT    /api/v1/crm/leads/:id/stage
```

> **Postman Test Checkpoint**

#### 3g — Workflow APIs (n8n bridge)
```
GET    /api/v1/workflows
POST   /api/v1/workflows/trigger
GET    /api/v1/workflows/:id/logs
POST   /api/v1/webhooks/n8n
```

#### 3h — AI Agent Control APIs
```
GET    /api/v1/agents
POST   /api/v1/agents/tasks
GET    /api/v1/agents/tasks/:id
PUT    /api/v1/agents/tasks/:id/approve   ← Human approval
PUT    /api/v1/agents/tasks/:id/reject
GET    /api/v1/agents/logs
GET    /api/v1/agents/memory/:leadId
```

> **Postman Test Checkpoint — Full API suite done**

**RBAC Roles:**
```typescript
enum Role {
  ADMIN        // Full access
  EMPLOYEE     // Internal staff
  CLIENT       // SaaS users
  AI_AGENT     // System accounts for agents
}
```

**Deliverable:** All APIs documented in Postman, all tests passing

---

### PHASE 4 — Public Website
**Status:** 🔴 Not Started  
**Objective:** Marketing + lead generation at yourcompany.com

**Pages:**
- `/` — Landing page (hero, features, social proof)
- `/services` — Service descriptions
- `/pricing` — Plans with Razorpay/Stripe
- `/contact` — Contact form → CRM lead
- `/blog` — Blog listing + posts
- `/book-demo` — Calendly-style booking → CRM
- `/login` → redirect to app.yourcompany.com/login
- `/signup` → redirect to app.yourcompany.com/signup

**Key Notes:**
- SEO-first: metadata, og:tags, structured data
- Contact form → `POST /api/v1/crm/leads` (creates lead in CRM)
- Book demo → creates meeting + lead in CRM

**Deliverable:** Live marketing website with lead capture

---

### PHASE 5 — Admin Dashboard
**Status:** 🔴 Not Started  
**Objective:** Internal digital office at admin.yourcompany.com

**Modules:**

```
/admin/dashboard          → KPI overview
/admin/clients            → Client management
/admin/clients/:id        → Client detail + service assignment
/admin/subscriptions      → All subscriptions + billing
/admin/analytics          → Revenue, retention, churn
/admin/crm                → Full CRM pipeline
/admin/crm/leads          → Lead kanban board
/admin/crm/leads/:id      → Lead detail
/admin/workflows          → n8n workflow logs
/admin/agents             → AI agent monitoring  ← AI AGENTS HERE
/admin/agents/tasks       → Pending tasks (human approval queue)
/admin/agents/logs        → Agent activity logs
/admin/agents/memory      → Agent memory browser
/admin/settings           → System settings
```

**AI Agent module inside admin** — this is where you:
- See what each agent is doing
- Approve/reject agent actions
- View agent memory per lead
- Trigger agent tasks manually

**Deliverable:** Full admin office operational

---

### PHASE 6 — Client Dashboard
**Status:** 🔴 Not Started  
**Objective:** SaaS client platform at app.yourcompany.com

**Modules:**

```
/dashboard              → Overview: active services, reports
/services               → Service panels
  /services/reels       → Reels automation panel
  /services/email       → Email automation panel
  /services/leads       → Lead generation panel
  /services/whatsapp    → WhatsApp automation panel
/reports                → Analytics & deliverables
/billing                → Subscription + invoices
/uploads                → File uploads for content
/notifications          → System notifications
/settings               → Account settings
```

**Deliverable:** SaaS platform clients can log into

---

### PHASE 7 — Billing System
**Status:** 🔴 Not Started  
**Objective:** Recurring revenue via Razorpay (India) or Stripe.

**Build:**
- Razorpay subscription plans (Starter, Pro, Enterprise)
- Webhook handler: `POST /api/v1/webhooks/razorpay`
- Invoice generation (PDF)
- Usage limits enforcement in backend middleware
- Auto-expire + grace period logic

**Plans:**

| Plan | Price | Limits |
|------|-------|--------|
| Starter | ₹9,999/mo | 2 services, 500 leads/mo |
| Pro | ₹24,999/mo | 5 services, 2000 leads/mo |
| Enterprise | Custom | Unlimited |

**Deliverable:** Subscriptions + recurring billing working

---

### PHASE 8 — n8n Automation Layer
**Status:** 🔴 Not Started  
**Objective:** Workflow execution engine (not a backend replacement).

**First Workflows:**
1. `lead-intake.json` — New lead → enrich → CRM insert → notify
2. `email-sequence.json` — Drip email campaign automation
3. `reels-scheduler.json` — Schedule + post reels content
4. `whatsapp-followup.json` — WhatsApp message sequences

**n8n ↔ Backend contract:**
- n8n triggers via webhooks: `POST /api/v1/webhooks/n8n`
- Backend calls n8n to trigger: `POST http://n8n:5678/webhook/...`
- All via internal Docker network — never public

**Deliverable:** Core automations running

---

### PHASE 9 — CRM System
**Status:** 🔴 Not Started  
**Objective:** Internal sales pipeline — already APIs done in Phase 3.

**Frontend build (admin dashboard module):**
- Kanban board: cold → warm → qualified → proposal → negotiation → won/lost
- Lead detail view: full timeline, conversations, meetings, notes, tasks
- Calendar integration for meetings
- Email/WhatsApp conversation history
- Follow-up task system with reminders

**Deliverable:** Full CRM operational

---

### PHASE 10 — First AI Employee (Lead Research Agent)
**Status:** 🔴 Not Started  
**Objective:** First production AI worker in Python.

**Location:** `ai-workers/agents/lead_research/`

**Workflow:**
```
Trigger (manual or n8n)
  ↓
Scrape: Google Maps, LinkedIn, Indian Business directories
  ↓
Analyze: business type, size, social presence, contact info
  ↓
Score: 0-100 based on ICP criteria
  ↓
POST /api/v1/crm/leads  ← Insert into backend
  ↓
Create task: requires human approval before outreach
  ↓
Admin sees in /admin/agents/tasks
```

**Tools used:**
- Playwright (scraping)
- Claude API (analysis + scoring)
- httpx (backend calls)

**IMPORTANT:** Initially requires human approval for all actions.

**Deliverable:** AI researcher finds + scores leads, stores in CRM

---

### PHASE 11 — AI Outreach System
**Status:** 🔴 Not Started  
**Objective:** AI-powered cold outreach (draft → human approve → send).

**Agents:**
- `email_outreach/` — Personalized cold emails via SendGrid
- `linkedin/` — LinkedIn connection + message drafts
- `instagram/` — Instagram DM drafts

**Flow:**
```
Lead in CRM (status: qualified)
  ↓
Outreach Agent triggered
  ↓
Generate personalized message using lead memory
  ↓
Create task: "Review outreach draft for [company]"
  ↓
Admin approves → message sent
  ↓
Log outreach in CRM conversation
```

**Deliverable:** AI drafts outreach, human sends

---

### PHASE 12 — AI Meeting Agent
**Status:** 🔴 Not Started  
**Objective:** AI appointment setter.

**Flow:**
```
Prospect replies to outreach
  ↓
Meeting Agent reads conversation
  ↓
Detect interest signals
  ↓
Propose meeting slots (from calendar API)
  ↓
Book meeting → update CRM
  ↓
Escalate high-budget leads → human
```

**Deliverable:** AI schedules meetings autonomously

---

### PHASE 13 — Multi-Agent Orchestrator
**Status:** 🔴 Not Started  
**Objective:** Coordinate all AI agents as a unified workforce.

**Location:** `ai-workers/orchestrator/`

**Responsibilities:**
- Receive task from backend queue (Bull)
- Route to correct agent
- Monitor task completion
- Handle retries (max 3)
- Sync shared memory across agents
- Escalate failures to admin

**Memory System:**
```
Lead arrives
  ↓
All interactions stored: PostgreSQL (ai_memory table)
  ↓
Each agent retrieves history before acting
  ↓
Context: industry, budget, interest signals, conversation history
```

**Deliverable:** AI workforce operates as a coordinated team

---

### PHASE 14 — CI/CD Pipeline
**Status:** 🔴 Not Started  
**Objective:** Automated deployment on every push.

**GitHub Actions:**

```yaml
# ci.yml — runs on all PRs
- Lint (ESLint + Ruff for Python)
- Type check (tsc)
- Unit tests
- Docker build (verify images build)

# deploy.yml — runs on main branch push
- Build Docker images
- Push to GitHub Container Registry
- SSH to VPS
- docker-compose pull + up -d
- Health check
- Rollback if unhealthy
```

**Branch Strategy:**
```
main        → production (auto-deploy)
develop     → staging (manual trigger)
feature/*   → PR to develop
hotfix/*    → PR to main
```

**Deliverable:** Push to main = automatic production deploy

---

### PHASE 15 — VPS Production Deployment
**Status:** 🔴 Not Started  
**Objective:** Real server, real domains, real HTTPS.

**VPS Choice:** Hetzner CX31 (4 vCPU, 8GB RAM) — ~€12/month

**Setup Steps:**
```bash
# Initial server setup
apt update && apt upgrade -y
apt install docker.io docker-compose nginx certbot -y

# Clone repo
git clone https://github.com/your/aigw.git /opt/aigw

# SSL
certbot --nginx -d yourcompany.com -d app.yourcompany.com \
  -d admin.yourcompany.com -d api.yourcompany.com

# Start production
docker-compose -f docker-compose.prod.yml up -d
```

**Deliverable:** Live production system at your domains

---

### PHASE 16 — Monitoring & Observability
**Status:** 🔴 Not Started  
**Objective:** Know when things break before clients do.

**Stack:**
- Grafana + Prometheus → metrics dashboards
- Loki → log aggregation
- Uptime Kuma → uptime monitoring + alerts
- Sentry (frontend + backend) → error tracking

**Alerts:** Telegram/WhatsApp notification on downtime

**Deliverable:** Full observability stack

---

## API Standards

All APIs follow this response format:
```typescript
// Success
{
  success: true,
  data: {...} | [...],
  meta: { page, limit, total }  // for paginated responses
}

// Error
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Email is required",
    details: [...]
  }
}
```

All APIs require `Authorization: Bearer <token>` except:
- POST /api/v1/auth/signup
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/webhooks/* (webhook secret validation instead)

---

## Important Rules (DO NOT BREAK)

1. **Backend first, always** — Build API → Test Postman → Build frontend
2. **Human approval required** — AI agents never act autonomously until Phase 13+
3. **n8n is automation only** — Auth, RBAC, business logic = backend only
4. **Internal services stay internal** — n8n and ai-workers never exposed to internet
5. **One VPS until revenue** — Don't split VPS until traffic demands it
6. **No mobile app** — Not until SaaS is profitable
7. **No microservices** — Monolith first, split later
8. **No Kubernetes** — Docker Compose is enough

---

## First Success Target

Before anything else, validate with ONE real client:
- ✅ 1 working automation (lead scraping)
- ✅ 1 dashboard (client can see reports)
- ✅ 1 paying client (₹9,999/month)
- ✅ 1 AI assistant (lead researcher)

**Recommended first service:** Lead Generation Automation  
→ Direct ROI, easy to sell, AI agents immediately useful
