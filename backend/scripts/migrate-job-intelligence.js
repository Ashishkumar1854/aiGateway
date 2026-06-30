/**
 * Migration Script: Populate jobIntelligence for existing JobApplications
 * Run: node scripts/migrate-job-intelligence.js
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Dynamically load the service to prevent issues with pathing
const jobIntelligenceService = require('../src/api/v1/smart-apply/services/job-intelligence.service');

const prisma = new PrismaClient();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('=== Starting Job Intelligence Migration ===');

  // Find all job applications
  const allApplications = await prisma.jobApplication.findMany({
    select: {
      id: true,
      companyName: true,
      role: true,
      jobDescription: true,
      jobIntelligence: true
    }
  });

  // Filter pending ones in JS (safely handles Prisma JSON null checks)
  const pendingApps = allApplications.filter(app => app.jobIntelligence === null && app.jobDescription !== null);

  console.log(`Found ${pendingApps.length} job application(s) pending enrichment.`);

  if (pendingApps.length === 0) {
    console.log('No pending job applications to migrate. Done!');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pendingApps.length; i++) {
    const app = pendingApps[i];
    console.log(`[${i + 1}/${pendingApps.length}] Processing application ${app.id} (Company: "${app.companyName}", Role: "${app.role}")...`);
    
    try {
      await jobIntelligenceService.generateAndSaveProfile(app.id);
      successCount++;
      console.log(`✓ Success: Application ${app.id} enriched.`);
    } catch (err) {
      failCount++;
      console.error(`✗ Failed: Application ${app.id} failed to enrich:`, err.message);
    }

    // Rate-limiting delay to prevent Gemini API quota limits (429)
    if (i < pendingApps.length - 1) {
      console.log('Waiting 2 seconds before next request...');
      await delay(2000);
    }
  }

  console.log('\n=== Migration Completed ===');
  console.log(`Successfully enriched: ${successCount}`);
  console.log(`Failed to enrich:     ${failCount}`);
}

main()
  .catch(err => {
    console.error('Migration crashed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
