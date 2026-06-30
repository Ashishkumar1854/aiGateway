Lekin 2 changes karke.

Change 1
Service Name

Job Seeker

↓

Service Name

Smart Apply
Change 2

Resume section update.

Old

Every application

↓

Read Resume PDF

↓

AI

Replace with

Student uploads Resume

↓

Backend stores PDF

↓

AI parses Resume ONLY ONE TIME

↓

Extract

Skills

Projects

Experience

Education

ATS Keywords

↓

Store Structured Resume Profile

↓

Resume Version v1

Application time

Application

↓

Database

↓

Structured Resume Profile

↓

AI Email

Never reopen PDF.

///////////////////////////////////////////Servicessssssssssss//////////////////////////////

Job Seeker Service — Manual Apply (v1.0)
Service Overview
Service Name: Job Seeker
Mode: Manual Apply
Purpose
Help students send highly personalized job application emails using AI while tracking the complete application lifecycle.
This is not a bulk email sender.
This is an AI-assisted professional job application platform.

Business Goal
Student should not manually:
Rewrite every email
Read resume every time
Customize every application
Track applications in Excel
The platform handles everything automatically.
Student only provides:
Resume
HR Email
Company Details
Role
Everything else is generated automatically.



Complete Workflow
Student Login

↓

Job Seeker

↓

Resume Library

↓

Manual Apply

↓

Fill Form

↓

Backend Validation

↓

AI Resume Matching

↓

AI Email Generation

↓

Student Preview

↓

Send Email

↓

Track

↓

Dashboard Analytics

STEP 1 — Resume Library
Before applying, the student uploads resumes.
Example
Frontend Resume
Backend Resume
Full Stack Resume
Python Resume
Every resume belongs to a Resume Profile.

Resume Upload Workflow
Student Uploads Resume
↓
Backend Stores PDF
↓
AI Resume Parser
↓
Extract
Skills
Experience
Projects
Education
Certifications
Technologies
ATS Keywords
↓
Store Structured Profile
Resume is parsed only once.
Never parse the PDF again during applications.

Resume Profile
Each resume should store:
Resume Name
Primary Role
Secondary Roles
Skills
Projects
Experience
Education
ATS Keywords
Resume Version
PDF Location
Created Date
Updated Date

Example
Resume
Frontend Resume v2
Primary Role
Frontend Developer
Secondary Roles
Full Stack Developer
Skills
React
Next.js
Redux
TypeScript
Projects
Phoneo
AiGateway
Experience
2 Years
ATS Keywords
React
REST API
Tailwind CSS
Next.js

STEP 2 — Manual Apply
Student opens
Job Seeker
↓
Manual Apply
Form Fields
Required
Select Resume
Role Applying For
HR Email
Company Name
Optional
HR Name
Job Description
Additional Notes

Example
Resume
Frontend Resume
Role
Frontend Developer
HR Email
jobs@google.com
Company
Google
HR Name
Ashish
Job Description
(Optional)

STEP 3 — Backend Validation
Validate
User Logged In
Subscription Active
Credits Available
Resume Exists
Valid Email
Role Selected
If validation fails
Return proper error.
No AI call should happen before validation.

STEP 4 — Resume Selection Logic
System first selects Resume Profile.
Student already selected
Frontend Resume
↓
Use Resume Profile
Not PDF
Structured Resume Data
↓
Role Match
↓
Job Description Match
↓
Generate Context
This reduces AI cost significantly.

STEP 5 — AI Email Generation
Input
Resume Profile
Role
Company Name
HR Name
Job Description
Additional Notes
AI Responsibilities
Generate Subject
Generate Personalized Greeting
Highlight Relevant Skills
Highlight Relevant Projects
Mention Relevant Experience
Generate Closing
Generate Professional CTA
Never hallucinate.
Use only resume information.

Greeting Logic
If HR Name exists
Dear Ashish,
Else
Dear Hiring Team,

CTA
Always end with
"I'd appreciate your feedback even if my profile isn't selected.
Your feedback will help me improve future applications."

STEP 6 — Student Preview
Before sending
Student sees
Subject
Email
Resume Used
Recipient
Buttons
Edit
Regenerate
Send
Nothing is sent automatically.
Human Approval First.

STEP 7 — Email Sending
Student clicks
Send
↓
Backend
↓
Save Application
Status
Sent
↓
Trigger n8n
↓
Gmail API
↓
HR
↓
Update Database

STEP 8 — Recruiter Experience
Recruiter receives
Professional Email
↓
Feedback Section
Buttons
Skills Don't Match
Experience Doesn't Match
Location Mismatch
Position Filled
Hiring Closed
Resume Needs Improvement
Other
Below buttons
Optional Feedback Text
Example
"You need stronger backend experience."
Buttons should redirect to AiGateway Feedback Page.
Do not rely on interactive email controls.

STEP 9 — Tracking
System automatically tracks
Delivered
Opened
Feedback Received
Manual updates by student
Interview Round 1
Interview Round 2
Final Interview
Offer Received

Student Dashboard
Every application has its own timeline.
Example
Google
Frontend Developer
Resume Used
Frontend Resume v2
Timeline
Draft
↓
Sent
↓
Opened
↓
Feedback Received
↓
Interview Round 1
↓
Interview Round 2
↓
Final Interview
↓
Offer Received

Student Manual Updates
Interview emails are not processed by AI.
Student manually updates status.
Dropdown
Applied
Opened
Rejected
Interview Round 1
Interview Round 2
Final Interview
Offer Received
Reason
Reading every recruiter reply using AI increases cost.
Manual update is simpler, cheaper, and reliable.

Dashboard Reports
Cards
Applications Sent
Opened
Feedback Received
Interview Round 1
Interview Round 2
Final Interviews
Offers
Success Rate

Application Details
Each application stores
Company
Role
Resume Used
Applied Date
Email Status
Open Status
Feedback
Current Status
Interview Notes
Offer Date

Interview Notes
Student can maintain notes.
Round 1
Date
Questions Asked
Result
Round 2
Date
Questions Asked
Result
This becomes valuable interview history.

Resume Analytics
Track performance of every resume.
Example
Frontend Resume
Applications
120
Opened
58
Feedback
30
Interview Calls
14
Offers
2
Success Rate
1.6%

Future AI Recommendation
Not part of MVP.
AI can later analyse
Resume Performance
Common Feedback
Interview History
Resume Versions
and recommend improvements.

Folder Structure
modules/
job-seeker/
manual-apply/
resume-library/
applications/
analytics/
settings/
api/
workflows/
types/

Engineering Principles
Resume is parsed only once.
Frontend never talks to AI directly.
Backend controls every operation.
n8n is only the automation engine.
AI is only used where intelligence is required.
Every application is stored permanently.
Everything is measurable.
Human always approves before sending.
