/**
 * Migration Script: Populate matchResult for existing JobApplications
 * Run: node scripts/migrate-match-engine.js
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Dynamically load the service to prevent issues with pathing
const matchEngineService = require('../src/api/v1/smart-apply/services/match-engine.service');

const prisma = new PrismaClient();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('=== Starting Resume ↔ Job Match Engine Migration ===');

  // Find all job applications
  const allApplications = await prisma.jobApplication.findMany({
    select: {
      id: true,
      companyName: true,
      role: true,
      matchResult: true
    }
  });

  // Filter pending ones in JS (safely handles Prisma JSON null checks)
  const pendingApps = allApplications.filter(app => app.matchResult === null);

  console.log(`Found ${pendingApps.length} job application(s) pending match calculation.`);

  if (pendingApps.length === 0) {
    console.log('No pending matches to calculate. Done!');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pendingApps.length; i++) {
    const app = pendingApps[i];
    console.log(`[${i + 1}/${pendingApps.length}] Processing matching for application ${app.id} (Company: "${app.companyName}", Role: "${app.role}")...`);
    
    try {
      await matchEngineService.calculateAndSaveMatch(app.id);
      successCount++;
      console.log(`✓ Success: Application ${app.id} matched.`);
    } catch (err) {
      failCount++;
      console.error(`✗ Failed: Application ${app.id} failed to match:`, err.message);
    }

    // Rate-limiting delay to prevent Gemini API quota limits (429)
    if (i < pendingApps.length - 1) {
      console.log('Waiting 2 seconds before next request...');
      await delay(2000);
    }
  }

  console.log('\n=== Migration Completed ===');
  console.log(`Successfully matched: ${successCount}`);
  console.log(`Failed to match:     ${failCount}`);
}

main()
  .catch(err => {
    console.error('Migration crashed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
