const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
  const res = await prisma.$queryRawUnsafe('SELECT data FROM n8n.execution_data WHERE "executionId" = 49');
  if (res.length === 0) {
    console.log('No data found for execution 49');
    return;
  }
  const rawData = res[0].data;
  console.log('Raw data length:', rawData.length);
  try {
    const parsed = JSON.parse(rawData);
    fs.writeFileSync('/app/exec_49.json', JSON.stringify(parsed, null, 2));
    console.log('Saved to /app/exec_49.json successfully');
  } catch (e) {
    console.log('Error parsing:', e.message);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
