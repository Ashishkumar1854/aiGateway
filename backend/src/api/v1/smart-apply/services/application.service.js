/**
 * Job Application Service Layer
 * Coordinates business logic, subscription checks, and active n8n automation webhook integrations.
 */

const applicationRepository = require('../repositories/application.repository');
const resumeRepository = require('../repositories/resume.repository');
const n8nService = require('../../../../services/n8n.service');
const prisma = require('../../../../lib/prisma');
const { JobApplicationStatus } = require('../types/smart-apply.types');
const jobIntelligenceService = require('./job-intelligence.service');
const matchEngineService = require('./match-engine.service');

/**
 * Validates client subscription status
 */
const validateClientSubscription = async (clientId) => {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      subscriptions: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!client) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Client profile not found' };
  }

  // Business Plan subscription status validation
  const activeSub = client.subscriptions[0];
  const isTrialOrActive = activeSub && (activeSub.status === 'ACTIVE' || activeSub.status === 'TRIAL');
  
  if (!isTrialOrActive) {
    throw {
      statusCode: 403,
      code: 'SUBSCRIPTION_REQUIRED',
      message: 'An active subscription plan or trial is required to proceed.',
    };
  }

  return client;
};

/**
 * Creates an application draft, verifying active subscription and generating email content via n8n
 */
const createApplicationDraft = async (clientId, applicationData) => {
  // 1. Validate subscription status
  await validateClientSubscription(clientId);

  // 2. Resolve target ResumeVersion
  const resumeVersion = await resumeRepository.findResumeVersionById(applicationData.resumeVersionId, clientId);
  if (!resumeVersion) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Selected resume version not found or invalid' };
  }

  // 3. Construct initial template email locally (instant response, zero latency)
  const greeting = applicationData.hrName ? `Dear ${applicationData.hrName},` : 'Dear Hiring Team,';
  const subject = `Application for ${applicationData.role} - ${applicationData.companyName}`;
  const emailContent = `${greeting}\n\nI am writing to express my interest in the ${applicationData.role} position at ${applicationData.companyName}. Please find my application details attached.\n\nBest regards,\n[Candidate Name]`;

  const application = await applicationRepository.createApplication(clientId, {
    ...applicationData,
    subject,
    emailContent,
  });

  // Trigger match engine calculations asynchronously in the background (self-heals missing job profile, then builds AI personalized email)
  matchEngineService.calculateAndSaveMatch(application.id).catch(err => {
    console.error(`[Application Service] Background matching failed for application ${application.id}:`, err.message);
  });

  return application;
};

/**
 * Lists client job applications
 */
const getClientApplications = async (clientId, filters) => {
  return applicationRepository.findApplicationsByClient(clientId, filters);
};

/**
 * Retrieves details of a job application including timeline log
 */
const getApplicationDetails = async (id, clientId) => {
  const application = await applicationRepository.findApplicationById(id, clientId);
  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }
  return application;
};

/**
 * Helper to format email body to HTML
 */
const formatHtmlEmail = (textBody, applicationId) => {
  const publicWebUrl = process.env.PUBLIC_WEB_URL || 'http://localhost:3000';
  const n8nPublicUrl = 'http://localhost:5678';
  
  const formattedText = textBody.replace(/\n/g, '<br />');

  const feedbackFooter = `
    <br /><br />
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
    <div style="font-family: sans-serif; font-size: 13px; color: #475569; line-height: 1.6;">
      <p style="font-weight: bold; margin-bottom: 8px;">How was your experience reviewing this application?</p>
      <p style="margin-bottom: 12px; color: #64748b; font-size: 12px;">Please share your feedback by clicking one of the options below:</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
        <tr>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=SKILLS_MISMATCH" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">🎯 Skills Don't Match</a>
          </td>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=EXPERIENCE_MISMATCH" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">📊 Experience Doesn't Match</a>
          </td>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=LOCATION_MISMATCH" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">📍 Location Mismatch</a>
          </td>
        </tr>
        <tr>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=POSITION_FILLED" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">✅ Position Filled</a>
          </td>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=HIRING_CLOSED" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">🔒 Hiring Closed</a>
          </td>
          <td style="padding-right: 10px; padding-bottom: 10px;">
            <a href="${publicWebUrl}/feedback/${applicationId}?type=RESUME_IMPROVEMENT" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px; text-decoration: none; font-size: 11px; font-weight: bold;">📝 Resume Needs Improvement</a>
          </td>
        </tr>
      </table>
      <p style="margin-top: 10px;"><a href="${publicWebUrl}/feedback/${applicationId}?type=OTHER" style="color: #4f46e5; text-decoration: underline; font-weight: bold; font-size: 12px;">Leave other detailed feedback →</a></p>
    </div>
    <!-- Open Tracking Pixel -->
    <img src="${n8nPublicUrl}/webhook/I0ciInZE3MpRiphJ/webhook-trigger/open-tracking/${applicationId}" width="1" height="1" style="display:none !important;" />
  `;

  return `<html><body>${formattedText}${feedbackFooter}</body></html>`;
};

/**
 * Updates application properties and handles status transitions (including trigger n8n email sending)
 */
const updateApplicationDetails = async (id, clientId, updateData) => {
  // Verify application belongs to the client
  const application = await applicationRepository.findApplicationById(id, clientId);
  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }

  let trackingNotes = updateData.trackingNotes;

  // If status transitions to SENT, trigger actual email delivery via n8n send-email webhook
  if (updateData.status === JobApplicationStatus.SENT && application.status === JobApplicationStatus.DRAFT) {
    const htmlBody = formatHtmlEmail(application.emailContent, id);
    const n8nResult = await n8nService.triggerWebhook('LLPQmXL6UVr0x8hv/webhook-trigger/send-email', {
      hrEmail: application.hrEmail,
      subject: application.subject,
      body: htmlBody,
      pdfLocation: application.resumeVersion?.pdfLocation || null,
      fileName: application.resumeVersion?.resume?.name ? `${application.resumeVersion.resume.name}.pdf` : 'Resume.pdf'
    });

    if (!n8nResult.success) {
      console.error('[Application Service] Send email failed:', n8nResult.error);
      
      // Log failure event in the database tracking timeline
      await applicationRepository.addTrackingEvent(
        id,
        application.status,
        `Email delivery failed: ${n8nResult.error || 'SMTP delivery failure'}`
      );

      throw {
        statusCode: 502,
        code: 'SEND_FAILED',
        message: `Failed to send email via automation webhook: ${n8nResult.error || 'SMTP delivery failure'}`,
      };
    }

    trackingNotes = 'Email sent to recruiter successfully via automation webhook.';
  }

  return applicationRepository.updateApplication(id, {
    ...updateData,
    trackingNotes,
  });
};

/**
 * Handles Recruiter feedback (PUBLIC API ENDPOINT)
 */
const submitRecruiterFeedback = async (id, feedbackType, feedbackText) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }

  const updatedApplication = await applicationRepository.updateApplication(id, {
    status: JobApplicationStatus.FEEDBACK_RECEIVED,
    feedbackType,
    feedbackText,
    feedbackReceivedAt: new Date(),
    trackingNotes: `Recruiter submitted feedback: ${feedbackType.replace(/_/g, ' ')}.`,
  });

  // Call n8n recruiter-feedback webhook to record/process feedback in n8n workflows
  try {
    await n8nService.triggerWebhook('UwUzExT3a6rSjc6H/webhook-trigger/recruiter-feedback', {
      applicationId: id,
      feedbackType,
      feedbackText,
    });
  } catch (err) {
    console.warn('[Application Service] Recruiter feedback webhook failed to notify n8n:', err.message);
  }

  return updatedApplication;
};

/**
 * Adds an interview round note to a job application
 */
const addApplicationInterviewRound = async (applicationId, clientId, noteData) => {
  // Verify application belongs to the client
  const application = await applicationRepository.findApplicationById(applicationId, clientId);
  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }

  return applicationRepository.addInterviewNote(applicationId, noteData);
};

/**
 * Updates details of an interview note
 */
const updateApplicationInterviewRound = async (applicationId, clientId, noteId, noteData) => {
  // Verify application belongs to the client
  const application = await applicationRepository.findApplicationById(applicationId, clientId);
  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }

  return applicationRepository.updateInterviewNote(noteId, noteData);
};

/**
 * Tracks when a job application email is opened
 */
const trackApplicationOpen = async (id) => {
  const application = await prisma.jobApplication.findUnique({
    where: { id },
  });

  if (!application) {
    throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
  }

  // Only transition to OPENED if it is currently in DRAFT, SENT, or DELIVERED status
  const canTransition = [
    JobApplicationStatus.DRAFT,
    JobApplicationStatus.SENT,
    JobApplicationStatus.DELIVERED
  ].includes(application.status);

  if (canTransition) {
    return applicationRepository.updateApplication(id, {
      status: JobApplicationStatus.OPENED,
      trackingNotes: 'Email opened by recruiter.',
    });
  }

  return application;
};

/**
 * Computes overall and per-resume stats for a client
 */
const getClientAnalytics = async (clientId) => {
  // 1. Fetch all applications (not draft) to compute overall and per-resume stats
  const applications = await prisma.jobApplication.findMany({
    where: {
      clientId,
      status: { not: JobApplicationStatus.DRAFT },
    },
    include: {
      resumeVersion: {
        include: {
          resume: true,
        },
      },
    },
  });

  const totalApplications = applications.length;
  const totalOpened = applications.filter(a =>
    [JobApplicationStatus.OPENED, JobApplicationStatus.FEEDBACK_RECEIVED].includes(a.status) ||
    a.status.startsWith('INTERVIEW') ||
    a.status === JobApplicationStatus.OFFER_RECEIVED
  ).length;
  
  const totalFeedback = applications.filter(a => a.status === JobApplicationStatus.FEEDBACK_RECEIVED).length;
  const totalInterviews = applications.filter(a => a.status.startsWith('INTERVIEW') || a.status === JobApplicationStatus.OFFER_RECEIVED).length;
  const totalOffers = applications.filter(a => a.status === JobApplicationStatus.OFFER_RECEIVED).length;

  const openRate = totalApplications > 0 ? Math.round((totalOpened / totalApplications) * 100) : 0;
  const successRate = totalApplications > 0 ? Math.round((totalOffers / totalApplications) * 100) : 0;

  // 2. Compute Resume-level stats
  // First get all resumes for client to ensure we list all of them
  const resumes = await prisma.resume.findMany({
    where: { clientId },
  });

  const resumeStatsMap = {};
  resumes.forEach(r => {
    resumeStatsMap[r.id] = {
      resumeId: r.id,
      resumeName: r.name,
      totalApplications: 0,
      totalOpened: 0,
      totalFeedback: 0,
      totalInterviews: 0,
      totalOffers: 0,
      openRate: 0,
      successRate: 0,
    };
  });

  // Aggregate application data into resumeStatsMap
  applications.forEach(app => {
    const resumeId = app.resumeVersion?.resumeId;
    if (resumeId && resumeStatsMap[resumeId]) {
      const stats = resumeStatsMap[resumeId];
      stats.totalApplications += 1;
      
      const isOpen = [JobApplicationStatus.OPENED, JobApplicationStatus.FEEDBACK_RECEIVED].includes(app.status) ||
                     app.status.startsWith('INTERVIEW') ||
                     app.status === JobApplicationStatus.OFFER_RECEIVED;
      if (isOpen) stats.totalOpened += 1;
      
      if (app.status === JobApplicationStatus.FEEDBACK_RECEIVED) stats.totalFeedback += 1;
      if (app.status.startsWith('INTERVIEW') || app.status === JobApplicationStatus.OFFER_RECEIVED) stats.totalInterviews += 1;
      if (app.status === JobApplicationStatus.OFFER_RECEIVED) stats.totalOffers += 1;
    }
  });

  // Calculate rates
  const resumeStats = Object.values(resumeStatsMap).map(stats => {
    const appsCount = stats.totalApplications;
    stats.openRate = appsCount > 0 ? Math.round((stats.totalOpened / appsCount) * 1000) / 10 : 0;
    stats.successRate = appsCount > 0 ? Math.round((stats.totalOffers / appsCount) * 1000) / 10 : 0;
    return stats;
  });

  return {
    overall: {
      totalApplications,
      totalOpened,
      totalFeedback,
      totalInterviews,
      totalOffers,
      openRate,
      successRate,
    },
    resumes: resumeStats,
  };
};

module.exports = {
  createApplicationDraft,
  getClientApplications,
  getApplicationDetails,
  updateApplicationDetails,
  submitRecruiterFeedback,
  addApplicationInterviewRound,
  updateApplicationInterviewRound,
  trackApplicationOpen,
  getClientAnalytics,
};
