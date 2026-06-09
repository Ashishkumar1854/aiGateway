# AiGateway — DESIGN.md
# Build Tracker | What's Done | What's Next

> Update this file daily. This is your source of truth.
> Format: ✅ Done | 🟡 In Progress | 🔴 Not Started | ⚠️ Blocked

---

## System Architecture Overview

```
Internet
    │
   Nginx (reverse proxy)
    │
    ├── yourcompany.com      → public-web     (:3000)
    ├── app.yourcompany.com  → client-dash    (:3001)
    ├── admin.yourcompany.com→ admin-dash     (:3002)
    └── api.yourcompany.com  → backend        (:5000)
                                  │
                         Internal Docker Network
                                  │
                    ┌─────────────┼──────────────┐
                    │             │              │
                  PostgreSQL    Redis           n8n
                  (:5432)      (:6379)         (:5678)
                                               
                    ai-workers (Python FastAPI :8000)
```

---

## Full Build Flow

```
PHASE 0: Project Audit
    ↓
PHASE 1: Docker Local Setup
    ↓
PHASE 2: Database Schema
    ↓
PHASE 3: Backend APIs        ← Postman test each sub-phase
    ↓
PHASE 4: Public Website
    ↓
PHASE 5: Admin Dashboard     ← AI Agents module here
    ↓
PHASE 6: Client Dashboard
    ↓
PHASE 7: Billing
    ↓
PHASE 8: n8n Automation
    ↓
PHASE 9: CRM Frontend
    ↓
PHASE 10: Lead Research Agent
    ↓
PHASE 11: Outreach Agents
    ↓
PHASE 12: Meeting Agent
    ↓
PHASE 13: Orchestrator
    ↓
PHASE 14: CI/CD
    ↓
PHASE 15: VPS Deploy
    ↓
PHASE 16: Monitoring
```

---

## Phase Completion Tracker

### PHASE 0 — Project Audit & Structure Lock
**Status:** 🟡 In Progress  
**Started:** 2026-05-23  
**Completed:** —

**Checklist:**
- [ ] Move ai-agents logic to admin-dashboard/modules/ai-agents
- [ ] Create ai-workers/ at root (Python)
- [ ] Verify turbo.json pipeline
- [ ] Create packages/types shared types
- [ ] Create .env.example
- [ ] Final folder structure matches IMPLEMENTATION_PLAN.md

**Notes:**
- Current monorepo looks good (Turborepo + pnpm)
- Need to restructure apps/ai-agents → admin module

---

### PHASE 1 — Docker Local Environment
**Status:** ✅ Complete
**Started:** 2026-05-25
**Completed:** 2026-05-25

**Checklist:**
- [x] docker-compose.yml with all services
- [x] nginx.conf with local routing
- [x] Postgres volume + health check
- [x] Redis volume + health check
- [x] Backend Dockerfile (Node)
- [x] Frontend Dockerfiles (Next.js)
- [x] ai-workers Dockerfile (Python)
- [x] n8n container configured
- [x] `docker-compose up` → all services healthy

**Test:** `curl localhost:5001/health` → `{"status":"ok"}`

**Notes:**
- Used port 5001 for backend host mapping to avoid macOS AirPlay Receiver port 5000 conflict. Internal Docker port remains 5000.

---

### PHASE 2 — Database Schema
**Status:** ✅ Complete
**Started:** 2026-05-25
**Completed:** 2026-05-25

**Checklist:**
- [x] Prisma schema matches dbdiagram.io design
- [x] All enums defined
- [x] All relations correct
- [x] Indexes added (FKs, email, status, created_at)
- [x] `prisma migrate dev --name init` passes
- [x] Seed file creates: 1 admin, 1 test client, sample data
- [x] `prisma studio` — all tables visible

**Schema Modules:**
- [x] users + roles + permissions
- [x] clients + client_contacts
- [x] services + service_assignments
- [x] subscriptions + plans
- [x] crm_leads + conversations + meetings + notes + tasks
- [x] workflows + workflow_logs
- [x] ai_agents + agent_tasks + agent_logs + agent_memory
- [x] analytics_events
- [x] payments + invoices

**Notes:**
- DB diagram URL: https://dbdiagram.io/d/aigateway-6a0c3267697f99c167aeaa0d

---

### PHASE 3 — Backend Core API
**Status:** ✅ Complete  
**Started:** 2026-05-26  
**Completed:** 2026-05-26

#### 3a — Foundation
- [ ] Express + TypeScript setup
- [ ] Middleware: cors, helmet, morgan, express-rate-limit
- [ ] Centralized error handler
- [ ] Response formatter
- [ ] Config validation (Zod)
- [ ] Logger (Winston)

#### 3b — Auth APIs
- [ ] POST /api/v1/auth/signup
- [ ] POST /api/v1/auth/login
- [ ] POST /api/v1/auth/refresh
- [ ] POST /api/v1/auth/logout
- [ ] GET /api/v1/auth/me
- [ ] POST /api/v1/auth/forgot-password
- [ ] POST /api/v1/auth/reset-password
- [ ] **✅ Postman tested**

#### 3c — Users & Roles
- [ ] CRUD /api/v1/users
- [ ] CRUD /api/v1/roles
- [ ] RBAC middleware working
- [ ] **✅ Postman tested**

#### 3d — Clients
- [ ] CRUD /api/v1/clients
- [ ] /api/v1/clients/:id/services
- [ ] Soft delete working
- [ ] **✅ Postman tested**

#### 3e — Services & Subscriptions
- [ ] CRUD /api/v1/services
- [ ] CRUD /api/v1/subscriptions
- [ ] Plan limit enforcement middleware
- [ ] **✅ Postman tested**

#### 3f — CRM APIs
- [ ] CRUD /api/v1/crm/leads
- [ ] /api/v1/crm/leads/:id/conversations
- [ ] /api/v1/crm/pipeline (kanban data)
- [ ] /api/v1/crm/leads/:id/stage (move lead)
- [ ] /api/v1/crm/meetings CRUD
- [ ] **✅ Postman tested**

#### 3g — Workflow APIs
- [ ] GET/POST /api/v1/workflows
- [ ] POST /api/v1/workflows/trigger
- [ ] POST /api/v1/webhooks/n8n
- [ ] **✅ Postman tested**

#### 3h — AI Agent APIs
- [ ] GET /api/v1/agents
- [ ] POST /api/v1/agents/tasks
- [ ] GET /api/v1/agents/tasks (pending queue)
- [ ] PUT /api/v1/agents/tasks/:id/approve
- [ ] PUT /api/v1/agents/tasks/:id/reject
- [ ] GET /api/v1/agents/logs
- [ ] GET /api/v1/agents/memory/:leadId
- [ ] **✅ Postman tested**

**Notes:**
—

---

### PHASE 4 — Admin Dashboard
**Status:** ✅ Complete  
**Started:** 2026-05-26  
**Completed:** 2026-05-26

**Pages:**
- [ ] / (landing)
- [ ] /services
- [ ] /pricing
- [ ] /contact (→ CRM lead)
- [ ] /book-demo (→ CRM meeting)
- [ ] /blog
- [ ] SEO meta tags all pages

**Notes:**
—

---

### PHASE 5 — Client Dashboard
**Status:** ✅ Complete  
**Started:** 2026-05-31  
**Completed:** 2026-05-31

**Modules:**
- [ ] /admin/dashboard (KPIs)
- [ ] /admin/clients (list + detail)
- [ ] /admin/subscriptions
- [ ] /admin/analytics
- [ ] /admin/crm (pipeline view)
- [ ] /admin/workflows (n8n logs)
- [ ] /admin/agents (monitoring)
- [ ] /admin/agents/tasks (approval queue)
- [ ] /admin/agents/logs
- [ ] /admin/agents/memory

**AI Agents module notes:**
- Agents are managed FROM admin, not a separate app
- Task approval is a simple table with approve/reject buttons
- Agent memory is a timeline view per lead

**Notes:**
—

---

### PHASE 6 — Public Website
**Status:** ✅ Complete  
**Started:** 2026-05-31  
**Completed:** 2026-05-31

**Pages:**
- [ ] /dashboard
- [ ] /services/reels
- [ ] /services/email
- [ ] /services/leads
- [ ] /services/whatsapp
- [ ] /reports
- [ ] /billing
- [ ] /uploads
- [ ] /settings

**Notes:**
—

---

### PHASE 8 — Billing
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

**Checklist:**
- [ ] Razorpay account + API keys
- [ ] Subscription plans created in Razorpay dashboard
- [ ] POST /api/v1/webhooks/razorpay handler
- [ ] Invoice PDF generation
- [ ] Usage limit middleware per plan
- [ ] Billing page in client dashboard

**Notes:**
—

---

### PHASE 7 — n8n Automation
**Status:** ✅ Complete  
**Started:** 2026-05-31  
**Completed:** 2026-05-31

**Workflows:**
- [ ] lead-intake.json
- [ ] email-sequence.json
- [ ] reels-scheduler.json
- [ ] whatsapp-followup.json
- [ ] Backend webhook handler working

**Notes:**
—

---

### PHASE 9 — CRM Frontend
**Status:** ✅ Complete  
**Started:** 2026-06-02  
**Completed:** 2026-06-02

- [x] Kanban lead board
- [x] Lead detail view
- [x] Conversation history
- [x] Meeting scheduler
- [x] Task + follow-up system

**Notes:**
—

---

### PHASE 10 — Lead Research Agent (First AI Employee)
**Status:** ✅ Complete  
**Started:** 2026-06-09  
**Completed:** 2026-06-09

**Location:** `ai-workers/agents/lead_research/`

**Checklist:**
- [x] FastAPI endpoint: POST /agents/lead-research/run
- [x] Playwright scraping: Google Maps + LinkedIn
- [x] Lead scoring algorithm (0-100)
- [x] Backend integration: POST /api/v1/crm/leads
- [x] Human approval task created automatically
- [x] Admin can see + approve in /admin/agents/tasks

**Notes:**
— Initial version: manual trigger only, no auto-run

---

### PHASE 11 — Outreach Agents
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] Email outreach agent (SendGrid)
- [ ] LinkedIn agent (drafts only)
- [ ] All outreach creates approval task first

**Notes:**
—

---

### PHASE 12 — Meeting Agent
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] Reply detection
- [ ] Interest scoring
- [ ] Calendar slot proposal
- [ ] Meeting booking + CRM update
- [ ] Escalation to human for high-value leads

**Notes:**
—

---

### PHASE 13 — Multi-Agent Orchestrator
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] Orchestrator service in ai-workers/
- [ ] Bull queue integration with backend
- [ ] Shared memory system (PostgreSQL)
- [ ] Agent routing logic
- [ ] Retry mechanism
- [ ] Full flow: Lead → Research → Outreach → Meeting

**Notes:**
—

---

### PHASE 14 — CI/CD
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] .github/workflows/ci.yml (lint, type-check, test)
- [ ] .github/workflows/deploy.yml (build → push → deploy)
- [ ] GitHub Container Registry setup
- [ ] Branch protection rules
- [ ] Staging environment on develop branch

**Notes:**
—

---

### PHASE 15 — VPS Deployment
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] Hetzner VPS purchased
- [ ] Ubuntu 24.04 setup
- [ ] Docker + Docker Compose installed
- [ ] Nginx + Certbot SSL
- [ ] Domains pointed to VPS IP
- [ ] docker-compose.prod.yml deployed
- [ ] All services healthy on production
- [ ] Smoke test: all 4 domains working

**Notes:**
—

---

### PHASE 16 — Monitoring
**Status:** 🔴 Not Started  
**Started:** —  
**Completed:** —

- [ ] Uptime Kuma setup
- [ ] Grafana + Prometheus
- [ ] Sentry (frontend + backend)
- [ ] Telegram alert bot on downtime

**Notes:**
—

---

## Environment Variables Reference

```env
# App
NODE_ENV=development
APP_URL=http://localhost:5000

# Database
DATABASE_URL=postgresql://postgres:password@postgres:5432/aigw

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# n8n (internal)
N8N_URL=http://n8n:5678
N8N_WEBHOOK_SECRET=your-n8n-secret

# AI Workers (internal)
AI_WORKERS_URL=http://ai-workers:8000
AI_WORKERS_SECRET=your-ai-secret

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Billing (Razorpay)
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Email (SendGrid)
SENDGRID_API_KEY=SG....
FROM_EMAIL=hello@yourcompany.com

# Frontend URLs
PUBLIC_WEB_URL=http://localhost:3000
CLIENT_DASHBOARD_URL=http://localhost:3001
ADMIN_DASHBOARD_URL=http://localhost:3002
```

---

## Key Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-23 | AI Agents in admin-dashboard, not separate app | Simpler architecture, less complexity |
| 2026-05-23 | Single VPS until revenue | Cost efficiency, simpler ops |
| 2026-05-23 | Human approval for all AI actions initially | Safety first, build trust |
| 2026-05-23 | n8n internal only, no public domain | Security |
| 2026-05-23 | Backend API → Postman test → Frontend | Catch bugs early |

---

## Bugs & Blockers

| Date | Phase | Issue | Status | Fix |
|------|-------|-------|--------|-----|
| — | — | — | — | — |

---

## Completed Milestones

| Date | Milestone |
|------|-----------|
| 2026-05-25 | Phase 0 — Project Audit & Structure Lock Completed |
| 2026-05-25 | Phase 1 — Docker Local Environment Completed |
| 2026-05-25 | Phase 2 — Database Schema Completed |
| 2026-05-26 | Phase 3 — Backend Core API Completed |
| 2026-05-26 | Phase 4 — Admin Dashboard Completed |
| 2026-05-31 | Phase 5 — Client Dashboard Completed |
| 2026-05-31 | Phase 6 — Public Website Completed |
| 2026-05-31 | Phase 7 — n8n Automation Layer Completed |
| 2026-06-02 | Phase 9 — CRM Frontend (Kanban Board) Completed |
| 2026-06-09 | Phase 10 — First AI Employee (Lead Research Agent) Completed |

---

> **Remember:** Update this file after every work session. 
> The goal is: you should be able to pick this up after a 2-week break and know exactly where you are.
