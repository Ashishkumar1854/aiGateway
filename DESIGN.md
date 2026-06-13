# DESIGN.md — AiGateway Admin Dashboard Structure

## Navigation Structure (as of Phase 14C + Restructure)

The admin dashboard (`http://localhost:3002`) is organized into 3 clear sections.

---

## Sidebar Sections

### 📊 Dashboard
- `/dashboard` — Overview with 3-section summary cards + quick actions

---

### 🌐 Section 1: Public & CRM
*All sales-side activity — website leads, manual CRM, and custom freelance requests*

| Route | Page | Purpose |
|-------|------|---------|
| `/crm` | Pipeline | Kanban view of all CRM leads by stage |
| `/crm/leads` | All Leads | Full sortable/filterable leads list |
| `/crm/meetings` | Meetings | Scheduled meetings from CRM |
| `/crm/contacts` | Contacts | Contact form submissions (source: website_contact) |

---

### 🤖 Section 2: AI Workforce
*Internal AI agent pipelines — all actions require human approval (HITL)*

| Route | Page | Purpose |
|-------|------|---------|
| `/agents` | Overview | Stats + pipeline summary + bulk trigger UI |
| `/agents/tasks` | Tasks Queue | Awaiting approval → approve/reject individual tasks |
| `/agents/logs` | Logs | Completed agent actions log view |
| `/agents/research` | Research Agent | LEAD_RESEARCH job trigger + task list |
| `/agents/outreach` | Outreach Agent | EMAIL_OUTREACH drafts with preview |
| `/agents/meeting` | Meeting Agent | MEETING_SCHEDULE drafts + scheduled meetings |
| `/agents/orchestrator` | Orchestrator | Bulk pipeline trigger (Research → Email → Meeting) |

---

### 💼 Section 3: SaaS Clients
*Paying client management — separate from CRM/AI worker flow*

| Route | Page | Purpose |
|-------|------|---------|
| `/clients` | All Clients | Active paying client list with subscription status |
| `/clients/onboarding` | Onboarding | Trial + Book requests from public website. Activate/reject/convert |
| `/clients/subscriptions` | Subscriptions | All subscription records with plan + status |

---

## Dashboard Home Stats

The home page pulls live data from:
- `GET /api/v1/crm/leads` → total leads count
- `GET /api/v1/crm/meetings` → meeting count
- `GET /api/v1/agents/stats` → pending/completed/failed tasks
- `GET /api/v1/clients` → total clients count
- `GET /api/v1/onboarding?status=PENDING` → pending onboarding requests
- `GET /api/v1/subscriptions` → subscription count

---

## Key Design Rules

- **3 flows are ALWAYS separate**: CRM leads ≠ AI agent tasks ≠ SaaS clients
- **No auto-execution**: All AI outreach/meetings require admin approval (HITL)
- **JavaScript only**: No TypeScript in any dashboard file
- **Sidebar badge**: Tasks → shows red count badge when `agentStats.pending > 0`
- **Onboarding badge**: Shows pending count when trial/book requests are waiting
