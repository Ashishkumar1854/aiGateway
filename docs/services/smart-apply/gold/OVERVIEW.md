FIRST SEE THIS : (Lekin isme Enterprise section hata do.

Ye file sirf Gold ke liye hai.)

# AiGateway — Smart Apply (Gold & Enterprise Final Engineering Specification)

## Service Name

**Smart Apply**

Purpose:

Automatically discover relevant jobs, intelligently match resumes, generate personalized applications, and manage the complete job application lifecycle.

---

# Product Philosophy

Smart Apply is **NOT** a job board.

Smart Apply is **NOT** an email sender.

Smart Apply is an **AI Career Automation Platform**.

The service has three subscription levels.

* Business
* Gold
* Enterprise (Future)

Business (Manual Apply) has already been finalized.

This document focuses on **Gold** and **Enterprise**.

---

# Overall Architecture

```
Student

↓

Smart Apply

↓

Student Career Profile

↓

Resume Library

↓

Job Discovery Engine

↓

Master Job Database

↓

Eligibility Engine

↓

Resume Matching Engine

↓

AI Apply Score Engine

↓

Application Strategy Engine

↓

Tracking Engine

↓

Dashboard
```

Everything revolves around these engines.

Each engine is independent.

---

# GOLD PLAN

## Purpose

The student should **never search jobs manually again.**

The platform searches jobs automatically.

The platform recommends the best jobs.

The platform generates personalized applications.

The final application is still **Email Based**.

No browser automation.

---

# GOLD PLAN COMPLETE WORKFLOW

```
Student

↓

Profile Setup

↓

Resume Library

↓

Job Discovery Engine

↓

Master Job Database

↓

Eligibility Engine

↓

Resume Matching

↓

AI Apply Score

↓

Pending Queue

↓

Application Strategy Engine

↓

Email Apply

↓

Tracking

↓

Dashboard
```

---

# STEP 1 — Student Career Profile

Student completes profile only once.

Store

* Full Name
* Email
* Phone
* LinkedIn
* Portfolio
* GitHub
* Education
* Experience
* Notice Period
* Visa Status
* Work Authorization
* Preferred Countries
* Preferred Roles
* Preferred Job Types
* Expected Salary
* Resume Profiles

This profile is reused everywhere.

---

# STEP 2 — Resume Library

Student uploads multiple resumes.

Example

```
Frontend Resume

Backend Resume

Full Stack Resume

Python Resume
```

Every resume is parsed once.

Store

* Skills
* Projects
* Experience
* ATS Keywords
* Resume Version
* Structured Resume Profile

Never parse the same PDF again.

---

# STEP 3 — Job Discovery Engine

This is the biggest difference between Business and Gold.

Business

```
Student provides HR Email.
```

Gold

```
System discovers jobs automatically.
```

---

## Job Sources

### Official ATS APIs (Preferred)

These are official job board APIs exposed by ATS platforms.

Supported Sources

* Greenhouse
* Lever
* Ashby
* Workable
* Teamtailor
* Recruitee

Advantages

* Official
* Stable
* Structured
* Free for public job listings

---

### Job Aggregation Layer

Use JobSpy initially.

JobSpy aggregates jobs from multiple platforms including:

* LinkedIn
* Indeed
* Google Jobs
* Glassdoor
* ZipRecruiter
* Naukri
* Bayt
* Additional supported sources as the project evolves

JobSpy should only be treated as one collector.

Never make business logic depend directly on JobSpy.

---

### Company Career Pages

Many companies expose jobs only on their own career websites.

Examples

* Google Careers
* Microsoft Careers
* Amazon Careers
* Netflix Careers

The system periodically collects jobs from these pages.

---

# Job Collection Strategy

Never search separately for every student.

Instead

```
Every 30 Minutes

↓

Job Collectors

↓

ATS APIs

↓

JobSpy

↓

Career Crawlers

↓

Normalize

↓

Remove Duplicates

↓

Master Job Database
```

100 students use the same database.

This dramatically reduces infrastructure cost.

---

# STEP 4 — Eligibility Engine

Purpose

Avoid wasting applications.

Checks

* Experience
* Country
* Visa
* Employment Type
* Role
* Salary
* Required Skills

Example

Required Experience

5 Years

Student

1 Year

↓

Skip

No AI call.

---

# STEP 5 — Resume Matching Engine

Compare

Job

↓

Available Resume Profiles

↓

Select Best Resume

Example

Frontend Resume

92%

Backend Resume

38%

Automatically choose Frontend Resume.

---

# STEP 6 — AI Apply Score Engine

AI calculates

* Resume Match
* Skills Match
* Experience Match
* Eligibility Match

Output

Overall Score

Example

```
Resume Score       91%

Skills Score       88%

Experience         95%

Eligibility        90%

Overall            91%
```

Dashboard

🟢 Highly Recommended

---

Threshold

Admin Configurable

Example

Minimum Score

85%

Below threshold

↓

Skip

---

# STEP 7 — Pending Queue

Every recommended application enters

Status

```
Pending
```

Nothing is sent automatically yet.

---

# STEP 8 — Application Strategy Engine

Gold supports two execution modes.

---

## Mode 1

Manual Apply

Student clicks

Apply

↓

Backend

↓

n8n

↓

Email Application

↓

Status

Applied

↓

Popup

Application Sent Successfully

---

## Mode 2

Scheduled Email Apply

Student configures

```
Automation

ON
```

Scheduler

Example

09:00

13:00

18:00

22:00

Maximum

4 executions per day.

Every schedule

↓

Find Pending Applications

↓

Score >= Threshold

↓

Daily Limit Check

↓

Send Email

↓

Status

Applied

---

Student Configuration

Application Mode

Manual

OR

Scheduled

Daily Limit

20

Minimum AI Score

85%

Preferred Countries . 

USA

Canada

UK

Germany

UAE

Preferred Employment Type

Full Time

Internship

Contract

Preferred Work Mode

Remote

Hybrid

On-site

Preferred Roles

Frontend

Backend

Full Stack

---

# IMPORTANT

Gold NEVER performs browser automation.

Gold only performs

Email Based Applications.

---

# Application Tracking

Automatically

* Email Sent
* Email Delivered
* Email Opened
* Recruiter Feedback

Student manually updates

* Interview Round 1
* Interview Round 2
* Final Interview
* Offer Received

---

# ENTERPRISE PLAN (Future)

Enterprise is NOT another product.

Enterprise extends Gold.

Everything from Gold remains unchanged.

Only the execution layer changes.

---

## GOLD

```
Job Discovery

↓

Application Strategy

↓

Email Apply
```

---

## ENTERPRISE

```
Job Discovery

↓

Application Strategy

↓

Browser Automation
```

Everything before Application Strategy is identical.

---

# Browser Automation Engine

Technology

* Playwright
* Chromium
* Docker

Purpose

Apply directly on career websites.

---

Workflow

```
Job Found

↓

Eligibility

↓

Resume Match

↓

AI Score

↓

Pending

↓

Scheduler

↓

Browser Worker

↓

Open Career Page

↓

Click Apply

↓

Fill Form

↓

Upload Resume

↓

Upload Cover Letter

↓

Fill Stored Answers

↓

Submit

↓

Take Screenshot

↓

Dashboard Updated
```

---

# Student Career Profile

Browser Automation reuses stored profile.

Example

Store

* Name
* Email
* Phone
* Address
* LinkedIn
* Portfolio
* GitHub
* Visa
* Salary
* Notice Period

No repeated typing.

---

# Unknown Questions

If browser encounters

Unknown Question

↓

Pause

↓

Student Notification

↓

Student Answers

↓

Save Answer

↓

Continue

Next application

↓

Auto Fill

---

# Browser Infrastructure

Browser Automation consumes significant CPU and RAM.

Never execute Browser Automation on the Main VPS.

Architecture

```
Main VPS

↓

Backend

↓

Redis Queue

↓

Browser Queue

↓

Browser VPS

↓

Playwright Workers
```

---

# Why Browser Automation is Enterprise Only

Reasons

* High CPU
* High RAM
* Browser Sessions
* Screenshot Storage
* Queue Management

Therefore

Business

No Browser

Gold

No Browser

Enterprise

Browser Automation Enabled

---

# Tracking Engine

Same for all plans.

Automatically

* Sent
* Delivered
* Opened
* Feedback

Manual

* Interview Round 1
* Interview Round 2
* Final Interview
* Offer

---

# Dashboard

Tabs

Dashboard

Resume Library

Job Discovery

Pending Applications

Applied

Interview Tracker

Analytics

Settings

---

# Analytics

Applications

Opened

Feedback

Interview Calls

Offers

Resume Performance

Top Companies

Success Rate

---

# Infrastructure Strategy

## Phase 1 (Current)

One VPS

Hostinger KVM 4

Runs

* Public Website
* Client Dashboard
* Admin Dashboard
* Backend
* PostgreSQL
* Redis
* n8n
* Internal AI Employees
* Lead Generation
* WhatsApp Automation
* CRM
* Email Automation
* Smart Apply Business
* Smart Apply Gold

Browser Automation

Disabled

---

## Phase 2

Revenue Starts

Purchase Second VPS

Runs

* Browser Workers
* Playwright
* Chromium
* Browser Queue
* Smart Apply Enterprise

Main SaaS remains unaffected.

---

# Engineering Principles

1. Job Discovery is centralized.

Collect once.

Serve all students.

2. Resume parsing happens only once.

3. Business Logic always remains inside Backend.

4. n8n is only an orchestration engine.

5. AI is only used for intelligence.

6. Browser Automation is isolated.

7. Gold never depends on Browser Automation.

8. Enterprise extends Gold instead of replacing it.

9. Every application is permanently stored.

10. Every engine must be replaceable.

Example

Today

JobSpy

Tomorrow

Commercial Job API

Frontend should require zero changes.

---

# Final Product Hierarchy

```
Smart Apply

│

├── Business

│      Manual Email Apply

│

├── Gold

│      AI Job Discovery
│      AI Resume Matching
│      AI Apply Score
│      Manual Email Apply
│      Scheduled Email Apply

│

└── Enterprise (Future)

       Gold Features

       +

       Browser Automation

       +

       ATS Form Filling

       +

       Auto Career Site Applications
```

## Founder Decision

The platform launches with **Business + Gold** on a single VPS.

Enterprise remains architecturally ready but disabled.

When paying demand for full browser automation appears, deploy a second VPS dedicated to Browser Workers. No changes are required to the core platform architecture because Enterprise only replaces the execution layer while reusing every engine built for Gold.
