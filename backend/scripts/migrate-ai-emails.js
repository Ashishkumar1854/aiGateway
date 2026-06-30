/**
 * Migration Script: Populate AI Personalized Emails for existing JobApplications
 * Run: node scripts/migrate-ai-emails.js
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Dynamically load the service to prevent issues with pathing
const emailGeneratorService = require('../src/api/v1/smart-apply/services/email-generator.service');

const prisma = new PrismaClient();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('=== Starting AI Personalized Email Engine Migration ===');

  // Find all job applications
  const allApplications = await prisma.jobApplication.findMany({
    select: {
      id: true,
      companyName: true,
      role: true,
      subject: true
    }
  });

  console.log(`Found ${allApplications.length} job application(s) to backfill AI emails for.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allApplications.length; i++) {
    const app = allApplications[i];
    console.log(`[${i + 1}/${allApplications.length}] Generating AI email for application ${app.id} (Company: "${app.companyName}", Role: "${app.role}")...`);
    
    try {
      await emailGeneratorService.generateAndSavePersonalizedEmail(app.id);
      successCount++;
      console.log(`✓ Success: Application ${app.id} email generated.`);
    } catch (err) {
      failCount++;
      console.error(`✗ Failed: Application ${app.id} failed:`, err.message);
    }

    // Rate-limiting delay to prevent Gemini API quota limits (429)
    if (i < allApplications.length - 1) {
      console.log('Waiting 2 seconds before next request...');
      await delay(2000);
    }
  }

  console.log('\n=== Migration Completed ===');
  console.log(`Successfully generated: ${successCount}`);
  console.log(`Failed to generate:     ${failCount}`);
}

main()
  .catch(err => {
    console.error('Migration crashed:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
