# Service Template.md

# AiGateway Engineering Design Document (EDD)

> Every new service must complete this document before development begins.

---

# 1. Basic Information

## Service Name

```
Lead Generation
```

---

## Category

```
SaaS

or

Personal Branding
```

---

## Version

```
v1.0
```

---

## Status

```
Planning

Development

Testing

Production
```

---

# 2. Business Understanding

## Problem Statement

What problem does this service solve?

---

## Target Customers

Example

* Recruiters
* Agencies
* Freelancers
* Startups
* Real Estate

---

## Expected Business Outcome

Example

```
Generate qualified leads automatically.

Reduce manual work.

Increase meetings.
```

---

## Why Will Customers Pay?

Clearly define business value.

---

# 3. User Journey

Define complete customer journey.

```
Homepage

↓

Service Page

↓

Purchase

↓

Dashboard

↓

Configuration

↓

Automation

↓

Results
```

---

# 4. Dashboard Design

## Dashboard Name

Example

```
Lead Generation
```

---

## Sidebar Menu

List every sidebar item.

---

## Dashboard Cards

Example

```
Credits Remaining

Generated Leads

Meetings

Subscription
```

---

## Tables

Example

```
Lead Table

Columns

Company

Phone

Email

Status
```

---

## Filters

Example

```
Country

Industry

Source
```

---

## Buttons

Example

```
Generate

Export

Send Email

Call
```

---

# 5. User Inputs

Everything customer can configure.

Example

```
Keywords

Country

Lead Limit

Sources
```

---

# 6. Workflow

Complete business workflow.

```
User

↓

Frontend

↓

Backend

↓

Database

↓

Automation

↓

Results
```

Explain every step.

---

# 7. Status Pipeline

Define lifecycle.

Example

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

Explain every status.

---

# 8. Database Design

Tables required.

Example

```
Lead

Campaign

Credits

Logs
```

Relationships.

Indexes.

Foreign Keys.

---

# 9. Backend APIs

List all APIs.

Example

```
POST

/api/lead/search

GET

/api/leads

DELETE

/api/leads/:id
```

Purpose of every endpoint.

---

# 10. Frontend Pages

Example

```
Overview

Search

Results

Reports
```

---

# 11. Frontend Components

List components.

Example

```
SearchForm

LeadTable

StatusBadge

CreditCard

Filters
```

---

# 12. Automation Design

Will automation be used?

YES / NO

---

Automation Engine

```
n8n
```

---

Workflow Name

Example

```
Lead Search Workflow
```

---

Trigger

```
Webhook

Schedule

Manual
```

---

External Services

```
Google Maps

LinkedIn

OpenAI

Apify
```

---

Outputs

```
Database

Email

Notification
```

---

# 13. AI Usage

Will AI be used?

YES / NO

---

Purpose

Example

```
Generate Email

Summarize Data

Classify Leads
```

---

LLM

```
OpenAI

Gemini

Claude
```

---

Prompt Version

```
v1
```

---

# 14. RAG

Required?

YES / NO

Knowledge Source

```
PDF

Database

Vector Store
```

---

# 15. Credits System

Credit Cost

Example

```
1 Search

=

20 Credits
```

Daily Limit

Monthly Limit

Upgrade Behaviour

---

# 16. Subscription Plans

Business

Features

Limits

Credits

---

Gold

Features

Limits

Credits

---

Enterprise

Features

Limits

Credits

---

Admin Editable?

YES

Everything should be dynamic.

---

# 17. Reports

KPIs

Example

```
Searches

Generated Leads

Meetings

Credits Used

Conversion Rate
```

---

# 18. Notifications

Dashboard

Email

Webhook

When should notifications be sent?

---

# 19. Integrations

Example

```
Google Workspace

WhatsApp

Stripe

Calendly
```

---

# 20. Security

Authentication

Authorization

Rate Limits

Permissions

Secrets

---

# 21. Logs

What should be logged?

Example

```
Search Created

Workflow Triggered

Lead Exported
```

---

# 22. Error Handling

Possible failures.

Examples

```
Credits Finished

Workflow Failed

Provider Timeout

API Error
```

Recovery plan.

---

# 23. Testing Checklist

Database

Backend

Frontend

Automation

Credits

Permissions

Subscriptions

Notifications

---

# 24. Folder Structure

Example

```
modules/

service-name/

pages/

components/

hooks/

api/

types/

services/

workflows/
```

---

# 25. Deployment Checklist

Database Migration

Environment Variables

n8n Workflow Imported

Webhook Updated

Production Tested

Monitoring Enabled

---

# 26. Future Improvements

Features planned for future versions.

---

# Final Engineering Approval

Business Approved

YES / NO

Architecture Approved

YES / NO

Backend Approved

YES / NO

Frontend Approved

YES / NO

Automation Approved

YES / NO

Ready For Development

YES / NO

Ready For Production

YES / NO
