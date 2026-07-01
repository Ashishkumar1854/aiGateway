/**
 * Resume Repository Layer
 * Interacts directly with Prisma for Resume and ResumeVersion models.
 */

const prisma = require('../../../../lib/prisma');

/**
 * Creates a new Resume profile along with its initial ResumeVersion (v1)
 */
const createResume = async (clientId, resumeData, versionData) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create the base Resume
    const resume = await tx.resume.create({
      data: {
        clientId,
        name: resumeData.name,
        isActive: resumeData.isActive !== undefined ? resumeData.isActive : true,
      },
    });

    // 2. Create the first ResumeVersion (v1)
    const initialVersion = await tx.resumeVersion.create({
      data: {
        resumeId: resume.id,
        version: 1,
        pdfLocation: versionData.pdfLocation,
        primaryRole: versionData.primaryRole || null,
        secondaryRoles: versionData.secondaryRoles || [],
        skills: versionData.skills || [],
        projects: versionData.projects || null,
        experience: versionData.experience || null,
        education: versionData.education || null,
        certifications: versionData.certifications || [],
        technologies: versionData.technologies || [],
        atsKeywords: versionData.atsKeywords || [],
        isCurrent: true,
        parseStatus: versionData.parseStatus || 'PENDING',
        parseError: versionData.parseError || null,
      },
    });

    return {
      ...resume,
      versions: [initialVersion],
    };
  });
};

/**
 * Lists all Resumes for a specific client
 */
const findResumesByClient = async (clientId) => {
  return prisma.resume.findMany({
    where: { clientId, isActive: true },
    include: {
      versions: {
        orderBy: { version: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Retrieves a single Resume profile by id, including all versions
 */
const findResumeById = async (id, clientId) => {
  const where = { id };
  if (clientId) where.clientId = clientId;

  return prisma.resume.findFirst({
    where,
    include: {
      versions: {
        orderBy: { version: 'desc' },
      },
    },
  });
};

/**
 * Appends a new ResumeVersion to a Resume profile
 */
const createResumeVersion = async (resumeId, versionData) => {
  return prisma.$transaction(async (tx) => {
    // 1. Find the latest version number
    const latestVersion = await tx.resumeVersion.findFirst({
      where: { resumeId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    const nextVersionNum = latestVersion ? latestVersion.version + 1 : 1;

    // 2. Set all existing versions for this resume to isCurrent = false
    await tx.resumeVersion.updateMany({
      where: { resumeId },
      data: { isCurrent: false },
    });

    // 3. Create the new ResumeVersion and set it as isCurrent = true
    const newVersion = await tx.resumeVersion.create({
      data: {
        resumeId,
        version: nextVersionNum,
        pdfLocation: versionData.pdfLocation,
        primaryRole: versionData.primaryRole || null,
        secondaryRoles: versionData.secondaryRoles || [],
        skills: versionData.skills || [],
        projects: versionData.projects || null,
        experience: versionData.experience || null,
        education: versionData.education || null,
        certifications: versionData.certifications || [],
        technologies: versionData.technologies || [],
        atsKeywords: versionData.atsKeywords || [],
        isCurrent: true,
        parseStatus: versionData.parseStatus || 'PENDING',
        parseError: versionData.parseError || null,
      },
    });

    return newVersion;
  });
};

/**
 * Sets a specific ResumeVersion to isCurrent = true and others to false
 */
const setCurrentVersion = async (resumeId, versionId) => {
  return prisma.$transaction(async (tx) => {
    // Validate version belongs to the resume
    const version = await tx.resumeVersion.findFirst({
      where: { id: versionId, resumeId },
    });

    if (!version) {
      throw { statusCode: 404, code: 'NOT_FOUND', message: 'Resume version not found on this resume' };
    }

    // Set all versions of this resume to false
    await tx.resumeVersion.updateMany({
      where: { resumeId },
      data: { isCurrent: false },
    });

    // Set target version to true
    return tx.resumeVersion.update({
      where: { id: versionId },
      data: { isCurrent: true },
    });
  });
};

/**
 * Finds a single ResumeVersion by id
 */
const findResumeVersionById = async (id, clientId) => {
  const version = await prisma.resumeVersion.findUnique({
    where: { id },
    include: {
      resume: true,
    },
  });

  if (version && clientId && version.resume.clientId !== clientId) {
    return null;
  }

  return version;
};

/**
 * Updates the parsing result and status of a ResumeVersion
 */
const updateResumeVersionParseResult = async (id, data) => {
  return prisma.resumeVersion.update({
    where: { id },
    data: {
      primaryRole: data.primaryRole || null,
      secondaryRoles: data.secondaryRoles || [],
      skills: data.skills || [],
      projects: data.projects || null,
      experience: data.experience || null,
      education: data.education || null,
      certifications: data.certifications || [],
      technologies: data.technologies || [],
      atsKeywords: data.atsKeywords || [],
      parseStatus: data.parseStatus,
      parseError: data.parseError || null,
    },
  });
};

module.exports = {
  createResume,
  findResumesByClient,
  findResumeById,
  createResumeVersion,
  setCurrentVersion,
  findResumeVersionById,
  updateResumeVersionParseResult,
};
