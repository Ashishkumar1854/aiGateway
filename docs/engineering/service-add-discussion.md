# Service Add Discussion.md

# AiGateway Engineering Standard

Version: 1.0

---

# Purpose

Every new SaaS service must follow the same engineering process.

No service should be developed by directly writing code.

The service must first be designed from a product, business, and architecture perspective.

This document is mandatory for:

* Developers
* AI Coding Agents (Codex, Claude Code, Cursor, Antigravity)
* Future Engineers
* Internal Team Members

If a service does not follow this document, it should not be merged into production.

---

# Core Philosophy

AiGateway is **not an automation collection.**

AiGateway is a SaaS platform.

n8n is only an automation engine.

LLMs are only intelligence providers.

Backend is the orchestration layer.

The frontend should never directly depend on n8n, OpenAI, Gemini, or any external service.

Always follow this architecture:

```
Client
↓

Frontend

↓

Backend API

↓

Database

↓

Automation Layer (n8n)

↓

LLM / External APIs

↓

Database Update

↓

Frontend Result
```

Backend always controls the platform.

Automation engines are replaceable.

---

# Step 1 — Business Understanding

Before coding anything answer:

* What problem is being solved?
* Who is the customer?
* Why would someone pay for this?
* What is the expected business outcome?

Example

Lead Generation

Customer:
Recruiters

Problem:
Finding prospects manually

Outcome:
Generate qualified leads automatically

---

# Step 2 — User Journey

Define the complete customer journey.

Example

```
Homepage

↓

Service Page

↓

Trial / Purchase

↓

Dashboard

↓

Configuration

↓

Automation

↓

Result
```

Every button should already be decided before coding.

---

# Step 3 — Dashboard Design

Every service must have its own dashboard.

Never build generic dashboards.

Define:

* Sidebar
* KPI cards
* Tables
* Filters
* Buttons
* Statuses
* Reports

Questions:

What will the customer see?

What action should the customer take?

What should be automated?

---

# Step 4 — Workflow Design

Every service needs its own workflow.

Example

Lead Generation

```
Search

↓

Credits Check

↓

Generate Leads

↓

Save Database

↓

Display Results

↓

Optional Outreach

↓

Meetings

↓

Won / Lost
```

Never skip workflow design.

---

# Step 5 — Database Design

Design database before APIs.

Define:

Tables

Relationships

Indexes

Status

Logs

History

Every workflow should be represented in the database.

---

# Step 6 — API Design

Only after database.

Create REST APIs.

Frontend must only communicate with Backend APIs.

Never with automation engines.

Example

```
POST /api/lead-generation/search

GET /api/leads

POST /api/email/send
```

---

# Step 7 — Frontend

Only after APIs exist.

Frontend responsibilities:

Input

Display

Validation

Progress

Reports

Never put business logic inside React.

---

# Step 8 — Automation Design

Now create automation.

Preferred engine:

n8n

Typical flow

```
Webhook

↓

Validation

↓

AI

↓

External APIs

↓

Save Database

↓

Return Result
```

Workflow must never directly update UI.

Always update database.

Frontend reads database.

---

# Step 9 — AI Layer

Only use AI where necessary.

Examples

Email writing

Lead qualification

Content generation

Data extraction

Summaries

Avoid calling LLMs for simple business logic.

Business rules belong in Backend.

---

# Step 10 — RAG (When Needed)

Use RAG only if the service requires company knowledge.

Examples

Support Bot

Knowledge Assistant

Internal Documents

Do not add RAG to every service.

---

# Step 11 — Credits

If a service consumes resources,

define

* Credits consumed
* Daily limits
* Monthly limits
* Upgrade behaviour

Credits are always validated in Backend.

Never in Frontend.

---

# Step 12 — Subscription Rules

Every service must define:

Business Plan

Gold Plan

Enterprise Plan

Admin controls:

Price

Limits

Credits

Features

Visibility

Everything must be dynamic.

Never hardcode plans.

---

# Step 13 — Status Pipeline

Every service needs its own status lifecycle.

Example

Lead Generation

```
New

↓

Warm

↓

Meeting Booked

↓

Won

↓

Lost
```

Statuses should represent business progress.

---

# Step 14 — Notifications

Ask:

Should user receive

Dashboard notification

Email

Webhook

Only notify when it provides business value.

---

# Step 15 — Reports

Every service should answer:

How successful is this service?

Examples

Leads Generated

Emails Sent

Meetings Booked

Revenue

Conversion Rate

Credits Used

---

# Step 16 — Logging

Every important action should be logged.

Examples

Lead Search

Campaign Created

Workflow Triggered

Subscription Updated

Logs help debugging.

---

# Step 17 — Security

Never expose

API Keys

Webhook URLs

Internal IDs

LLM Providers

Automation Engines

Everything goes through Backend.

---

# Step 18 — Testing

Before production verify:

Database

APIs

Frontend

Automation

Permissions

Credits

Subscriptions

Edge cases

Only then deploy.

---

# Step 19 — Folder Structure

Every service lives inside its own module.

```
modules/

lead-generation/

email-automation/

whatsapp-automation/

crm/

future-service/
```

Each module owns:

pages

components

hooks

api

types

services

workflows

Nothing should be mixed.

---

# Step 20 — Production Checklist

Before release verify:

✓ Public Website updated

✓ Dashboard updated

✓ Backend APIs completed

✓ Database migrated

✓ n8n workflow completed

✓ Credits configured

✓ Subscription configured

✓ Billing verified

✓ Logs working

✓ Testing completed

Only after all items pass should the service go live.

---

# Engineering Rule

Never start from automation.

Never start from frontend.

Never start from AI.

Always follow:

```
Business

↓

Workflow

↓

Dashboard

↓

Database

↓

Backend APIs

↓

Frontend

↓

Automation

↓

LLM

↓

Testing

↓

Production
```

This is the mandatory development process for every service inside AiGateway.
