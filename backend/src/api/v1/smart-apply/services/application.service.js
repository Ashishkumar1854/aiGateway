/**
 * Job Application Service Layer
 * Coordinates business logic, subscription checks, and active n8n automation webhook integrations.
 */

const applicationRepository = require('../repositories/application.repository');
const resumeRepository = require('../repositories/resume.repository');
const n8nService = require('../../../../services/n8n.service');
const prisma = require('../../../../lib/prisma');
const { JobApplicationStatus } = require('../types/smart-apply.types');

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

  // 3. Trigger n8n Email Generator Webhook
  const n8nResult = await n8nService.triggerWebhook('07PTSJrtKjQNEEvK/webhook-trigger/generate-email', {
    resumeProfile: {
      primaryRole: resumeVersion.primaryRole,
      secondaryRoles: resumeVersion.secondaryRoles,
      skills: resumeVersion.skills,
      experience: resumeVersion.experience,
      projects: resumeVersion.projects,
      education: resumeVersion.education,
      certifications: resumeVersion.certifications,
      technologies: resumeVersion.technologies,
      atsKeywords: resumeVersion.atsKeywords,
    },
    companyName: applicationData.companyName,
    role: applicationData.role,
    hrName: applicationData.hrName,
    additionalNotes: applicationData.additionalNotes,
  });

  if (!n8nResult.success || !n8nResult.data || !n8nResult.data.subject || !n8nResult.data.body) {
    console.error('[Application Service] Email generation failed:', n8nResult.error || 'Empty response payload');
    throw {
      statusCode: 502,
      code: 'EMAIL_GENERATION_FAILED',
      message: `Failed to generate application email via automation webhook: ${n8nResult.error || 'Invalid subject/body returned'}`,
    };
  }

  const { subject, body: emailContent } = n8nResult.data;

  return applicationRepository.createApplication(clientId, {
    ...applicationData,
    subject,
    emailContent,
  });
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
    const n8nResult = await n8nService.triggerWebhook('LLPQmXL6UVr0x8hv/webhook-trigger/send-email', {
      hrEmail: application.hrEmail,
      subject: application.subject,
      body: application.emailContent,
      pdfLocation: application.resumeVersion?.pdfLocation || null,
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

module.exports = {
  createApplicationDraft,
  getClientApplications,
  getApplicationDetails,
  updateApplicationDetails,
  submitRecruiterFeedback,
  addApplicationInterviewRound,
  updateApplicationInterviewRound,
};
