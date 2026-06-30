Enhancement 1

# Smart Apply Specification Enhancement Request

Read the existing "Smart Apply (Gold & Enterprise Final Engineering Specification)" completely before making any changes.

Do NOT rewrite the entire document.

Only enhance and modify the following sections.

The architecture, workflow, and engineering principles already defined should remain unchanged unless explicitly mentioned below.

---

# 1. Replace "Preferred Countries"

Current design:

Preferred Countries

USA
Canada
UK
Germany
UAE

Replace this with a dynamic architecture.

New Section:

## Target Markets

Student should NOT be restricted to predefined countries.

Instead provide a searchable multi-select component.

Example:

Target Markets

[ India ]
[ USA ]
[ Canada ]
[ Germany ]
[ UAE ]

+ Search Country

Users can select any country.

Store ISO Country Code internally.

Example

IN
US
CA
DE
AE

Never hardcode countries.

Backend should dynamically filter jobs according to selected countries.

---

# 2. Separate Remote Logic

Remote is NOT a country.

Remote should become an independent filter.

Create a new section:

Job Location Type

Selectable options

□ Remote

□ Hybrid

□ On-site

Allow multiple selection.

Examples

Remote only

Hybrid + On-site

Remote + Hybrid

---

# 3. Remote Search Logic

Add backend logic.

Case 1

Target Markets

USA
Canada

Location Type

Remote

Search

USA Remote Jobs

Canada Remote Jobs

---

Case 2

Target Markets

None

Location Type

Remote

Search

Worldwide Remote Jobs

(No country restriction)

---

Case 3

Target Markets

India
Germany

Location

Remote + Hybrid

Search

India Remote

India Hybrid

Germany Remote

Germany Hybrid

---

# 4. Rename Student Configuration

Current

Preferred Countries

Replace with

Target Markets

Current

Preferred Work Mode

Replace with

Job Location Type

---

# 5. Add Job Preferences Engine

Create a new subsection.

Purpose

Centralize all student job preferences.

Store

Target Markets

Job Location Type

Preferred Roles

Employment Types

Experience Levels

Salary Range

Remote Preference

Visa Preference

Preferred Industries (Future)

Preferred Company Size (Future)

Preferred Tech Stack (Future)

Everything should be reusable by Job Discovery Engine.

---

# 6. Salary

Replace

Expected Salary

with

Salary Preference

Minimum Salary

Maximum Salary

Currency should automatically change according to selected Target Market.

Examples

India → INR

USA → USD

Germany → EUR

---

# 7. Experience

Replace

Entry

Junior

Senior

with

Experience Range

0–1 Years

1–3 Years

3–5 Years

5–8 Years

8+ Years

---

# 8. Employment Types

Expand

Current

Full Time

Internship

Contract

Replace with

Full Time

Internship

Contract

Part Time

Freelance

Apprenticeship

---

# 9. Visa Preferences

Create a new reusable profile section.

Store

Work Authorized

Need Sponsorship

Open to Relocation

Open to Visa Sponsorship

Backend should use these during Eligibility Engine.

---

# 10. Company Preferences (Future Ready)

Add optional filters.

Company Size

Startup

SME

Enterprise

Funding Stage

Seed

Series A

Series B

Public Company

Industry

AI

Healthcare

FinTech

EdTech

SaaS

E-commerce

Gaming

etc.

These fields remain optional.

---

# 11. Backend Search Query Builder

Add a new subsection explaining how Job Discovery Engine builds queries.

Input

Target Markets

Roles

Employment Type

Location Type

Experience

Visa

↓

Generate Search Queries

↓

ATS APIs

↓

JobSpy

↓

Career Pages

↓

Normalize

↓

Master Job Database

This query builder should be configurable and reusable.

---

# 12. Future Scalability

Mention that the architecture should never depend on fixed countries or hardcoded filters.

All search filters must come from database configuration or user profile so that new countries, industries, or job types can be added without code changes.

---

Do not modify any existing workflow unless required by these enhancements.

Maintain enterprise SaaS architecture and engineering quality.
Smart Apply Specification Enhancement Request

(Remove hardcoded countries, Target Markets, Remote Logic...)


Bhai, ye point bahut important hai aur mujhe lagta hai current document me isko change karna chahiye.

Current:

Preferred Countries

USA
Canada
UK
Germany
UAE

Ye rigid design hai.

Production SaaS me aisa nahi hota.

Better Design
Job Preferences Engine

Student profile me static countries nahi honge.

Instead:

Preferred Job Locations

UI:

🌍 Search Countries

[ India        ✕ ]
[ USA          ✕ ]
[ Canada       ✕ ]
[ UK           ✕ ]
[ Germany      ✕ ]
[ UAE          ✕ ]

+ Add Country

Ye searchable multi-select hoga.

Remote Jobs

Ye bahut important hai.

Actually "Remote" country nahi hota.

Remote ek Job Location Type hai.

Isliye isko alag field banana chahiye.

Example

Job Location Type

☑ Remote

☑ Hybrid

☑ On-site
Remote Logic

Suppose student select karta hai:

Countries

USA

Canada

Aur

Remote

Enabled

Tab query banegi:

USA Remote

Canada Remote

Suppose student sirf:

Remote Only

select karta hai.

Tab query hogi:

Remote Jobs

Worldwide

Matlab country ignore.

Aur better

Main teen modes dunga.

Mode 1

Remote Only

☑ Remote

☐ Hybrid

☐ On-site

Search:

Worldwide Remote
Mode 2

Country Specific

USA

Canada

↓

Search

USA

Canada
Mode 3

Mixed

USA

Canada

Remote

↓

Search

USA Jobs

Canada Jobs

Worldwide Remote Jobs

Ye mujhe sabse practical lagta hai.

Experience bhi dynamic hona chahiye

Instead of

Entry

Main dunga

Experience

0-1

1-3

3-5

5+
Salary bhi

Instead of

Expected Salary

Main dunga

Minimum Salary

Maximum Salary

Country ke hisab se currency automatically change hogi.

Example

India

↓

INR

USA

↓

USD

Germany

↓

EUR

Job Type

Dynamic

☑ Full Time

☑ Internship

☑ Contract

☑ Part Time

☑ Freelance
Visa

Ye bhi bahut important hai.

Work Authorization

☑ Authorized

☑ Need Sponsorship

☑ Open to Visa

Isse AI eligibility bahut improve hogi.





Enhancement 2

# Enhancement — Master Configuration Architecture (Production SaaS)

Read the existing Smart Apply specification before implementing this enhancement.

This enhancement replaces every hardcoded option with dynamic master data managed by the database.

The goal is to ensure the platform never requires source code changes when adding new countries, regions, industries, employment types, or future filters.

---

# Philosophy

Never hardcode business data inside frontend or backend.

Everything visible to the student should come from Master Configuration tables.

Frontend only renders data.

Backend only validates data.

Admin manages master data.

---

# Master Configuration Module

Create a dedicated module.

Master Configuration

├── Countries
├── Regions
├── Employment Types
├── Work Modes
├── Industries
├── Company Sizes
├── Funding Stages
├── Experience Ranges
├── Salary Currencies
├── Preferred Roles
├── Tech Stacks
├── Visa Options

All future services should reuse these masters.

---

# Countries Master

Database Table

countries

Fields

id
name
iso_code
currency
region_id
flag_icon
is_active
display_order

Example

India

IN

INR

Asia

USA

US

USD

North America

Germany

DE

EUR

Europe

---

# Regions Master

Table

regions

Fields

id
name
description
is_active

Example

Asia

Europe

North America

South America

Middle East

Africa

Oceania

Worldwide Remote

This allows future expansion without code changes.

---

# Work Modes Master

Table

work_modes

Remote

Hybrid

On-site

Flexible

Future work modes can be added without deployment.

---

# Employment Types Master

Table

employment_types

Full Time

Internship

Contract

Freelance

Part Time

Apprenticeship

---

# Experience Ranges Master

Table

experience_ranges

0-1 Years

1-3 Years

3-5 Years

5-8 Years

8+ Years

Admin can modify ranges anytime.

---

# Company Size Master

startup

small_business

mid_market

enterprise

fortune_500

---

# Funding Stage Master

Bootstrapped

Seed

Series A

Series B

Series C

Public Company

Government

Non Profit

---

# Industry Master

AI

SaaS

Healthcare

FinTech

EdTech

E-commerce

Gaming

Manufacturing

Construction

Real Estate

Logistics

Future industries can be added dynamically.

---

# Preferred Roles Master

Instead of hardcoding

Frontend

Backend

etc.

Create

roles

Table

id

title

category

is_active

display_order

Examples

Frontend Developer

Backend Developer

Full Stack Developer

React Developer

Node.js Developer

Python Developer

AI Engineer

Data Scientist

Product Manager

DevOps Engineer

QA Engineer

etc.

---

# Tech Stack Master

Table

tech_stacks

React

Next.js

Node.js

Express

MongoDB

PostgreSQL

FastAPI

Python

Docker

AWS

Azure

Kubernetes

Redis

n8n

LangGraph

OpenAI

Gemini

Claude

etc.

Used by Resume Matching Engine.

---

# Visa Master

Table

visa_options

Authorized

Need Sponsorship

Citizen

PR Holder

Student Visa

Open to Relocation

Open to Sponsorship

---

# Currency Master

Instead of hardcoding currency.

Store

currencies

id

code

symbol

country_id

Example

INR

₹

USD

$

EUR

€

AED

د.إ

Automatically selected according to Target Market.

---

# Dynamic UI

Frontend must never contain hardcoded dropdown values.

Instead

Frontend

↓

Backend API

↓

Master Tables

↓

Render Dropdowns

Every dropdown in Smart Apply should be generated dynamically.

---

# Admin Dashboard

Create a Master Configuration section.

Admin should be able to

Add Country

Disable Country

Add Industry

Add Role

Add Tech Stack

Add Experience Range

Add Employment Type

Reorder Display

Enable/Disable Values

No developer intervention should be required.

---

# Query Builder Enhancement

Job Discovery Engine must use Master Configuration.

Student Preferences

↓

Query Builder

↓

Generate Dynamic Queries

↓

ATS APIs

↓

JobSpy

↓

Career Pages

↓

Master Job Database

No hardcoded country or role names should exist inside the Query Builder.

---

# Long-Term Engineering Rule

Business logic must never depend on hardcoded values.

Every configurable business option must originate from Master Configuration tables.

This architecture will allow AiGateway to scale globally without changing application code whenever new countries, industries, roles, currencies, or filters are introduced.