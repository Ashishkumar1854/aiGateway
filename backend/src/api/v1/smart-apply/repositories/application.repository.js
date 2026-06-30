/**
 * Job Application Repository Layer
 * Interacts directly with Prisma for JobApplication, JobApplicationTracking, and InterviewNote models.
 */

const prisma = require('../../../../lib/prisma');
const { JobApplicationStatus } = require('../types/smart-apply.types');

/**
 * Creates a new JobApplication draft and adds the initial DRAFT tracking entry.
 */
const createApplication = async (clientId, applicationData) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create the JobApplication
    const application = await tx.jobApplication.create({
      data: {
        clientId,
        resumeVersionId: applicationData.resumeVersionId,
        companyName: applicationData.companyName,
        role: applicationData.role,
        hrEmail: applicationData.hrEmail,
        hrName: applicationData.hrName || null,
        jobDescription: applicationData.jobDescription || null,
        additionalNotes: applicationData.additionalNotes || null,
        subject: applicationData.subject || null,
        emailContent: applicationData.emailContent || null,
        status: JobApplicationStatus.DRAFT,
      },
    });

    // 2. Log initial status tracking timeline entry
    await tx.jobApplicationTracking.create({
      data: {
        applicationId: application.id,
        status: JobApplicationStatus.DRAFT,
        notes: 'Application draft created.',
      },
    });

    return application;
  });
};

/**
 * Lists all Job Applications for a client with optional filters
 */
const findApplicationsByClient = async (clientId, filters = {}) => {
  const where = { clientId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    where.OR = [
      { companyName: { contains: filters.search, mode: 'insensitive' } },
      { role: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.jobApplication.findMany({
    where,
    include: {
      resumeVersion: {
        include: {
          resume: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Retrieves a single JobApplication including timeline tracking log and interview notes
 */
const findApplicationById = async (id, clientId) => {
  const where = { id };
  if (clientId) where.clientId = clientId;

  return prisma.jobApplication.findFirst({
    where,
    include: {
      resumeVersion: {
        include: {
          resume: true,
        },
      },
      tracking: {
        orderBy: { createdAt: 'asc' },
      },
      interviewNotes: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
};

/**
 * Updates application details and handles status transitions (writing tracking log)
 */
const updateApplication = async (id, updateData) => {
  return prisma.$transaction(async (tx) => {
    // 1. Fetch current application state
    const currentApp = await tx.jobApplication.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!currentApp) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Application not found' };
    }

    const { status: newStatus, trackingNotes, ...fieldsToUpdate } = updateData;

    // Check if status is transitioning
    const isTransitioning = newStatus && newStatus !== currentApp.status;

    // Prepare update payload
    const data = { ...fieldsToUpdate };
    if (isTransitioning) {
      data.status = newStatus;
      if (newStatus === JobApplicationStatus.SENT) {
        data.appliedAt = new Date();
      }
    }

    // 2. Perform the update
    const updatedApplication = await tx.jobApplication.update({
      where: { id },
      data,
    });

    // 3. Write tracking entry if transitioning
    if (isTransitioning) {
      await tx.jobApplicationTracking.create({
        data: {
          applicationId: id,
          status: newStatus,
          notes: trackingNotes || `Status updated to ${newStatus}.`,
        },
      });
    }

    return updatedApplication;
  });
};

/**
 * Manually logs a status tracking/timeline event (used for direct state updates)
 */
const addTrackingEvent = async (applicationId, status, notes) => {
  return prisma.jobApplicationTracking.create({
    data: {
      applicationId,
      status,
      notes,
    },
  });
};

/**
 * Adds an Interview Note for a job application
 */
const addInterviewNote = async (applicationId, noteData) => {
  return prisma.interviewNote.create({
    data: {
      applicationId,
      roundName: noteData.roundName,
      scheduledAt: noteData.scheduledAt ? new Date(noteData.scheduledAt) : null,
      questionsAsked: noteData.questionsAsked || null,
      result: noteData.result || 'Pending',
      notes: noteData.notes || null,
    },
  });
};

/**
 * Updates an existing Interview Note
 */
const updateInterviewNote = async (noteId, noteData) => {
  return prisma.interviewNote.update({
    where: { id: noteId },
    data: {
      roundName: noteData.roundName,
      scheduledAt: noteData.scheduledAt ? new Date(noteData.scheduledAt) : null,
      questionsAsked: noteData.questionsAsked || null,
      result: noteData.result || null,
      notes: noteData.notes || null,
    },
  });
};

module.exports = {
  createApplication,
  findApplicationsByClient,
  findApplicationById,
  updateApplication,
  addTrackingEvent,
  addInterviewNote,
  updateInterviewNote,
};
