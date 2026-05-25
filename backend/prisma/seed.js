/**
 * Prisma Seed — Phase 2 will add real seed data
 * Scaffold only.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  // Phase 2: Add admin user, test client, sample data
  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
