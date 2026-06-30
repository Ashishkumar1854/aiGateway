/**
 * Migration Script: Populate intelligenceProfile for existing ResumeVersions
 * Run: node scripts/migrate-resume-intelligence.js
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Dynamically load the service to prevent issues with pathing
const resumeIntelligenceService = require('../src/api/v1/smart-apply/services/resume-intelligence.service');

const prisma = new PrismaClient();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('=== Starting Resume Intelligence Migration ===');

  // Find all resume versions
  const allVersions = await prisma.resumeVersion.findMany({
    include: {
      resume: {
        select: {
          name: true
        }
      }
    }
  });

  // Filter versions that are missing the intelligence profile
  const pendingVersions = allVersions.filter(v => v.intelligenceProfile === null);

  console.log(`Found ${pendingVersions.length} resume version(s) pending enrichment.`);

  if (pendingVersions.length === 0) {
    console.log('No pending versions to migrate. Done!');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pendingVersions.length; i++) {
    const version = pendingVersions[i];
    console.log(`[${i + 1}/${pendingVersions.length}] Processing version ${version.id} (Resume: "${version.resume?.name}", v${version.version})...`);
    
    try {
      await resumeIntelligenceService.generateAndSaveProfile(version.id);
      successCount++;
      console.log(`✓ Success: Version ${version.id} enriched.`);
    } catch (err) {
      failCount++;
      console.error(`✗ Failed: Version ${version.id} failed to enrich:`, err.message);
    }

    // Rate-limiting delay to prevent Gemini API quota limits (429)
    if (i < pendingVersions.length - 1) {
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
