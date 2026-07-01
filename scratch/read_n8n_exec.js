const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres:password@localhost:5432/aigw'
  });
  await client.connect();
  const res = await client.query('SELECT data FROM n8n.execution_data WHERE "executionId" = 49');
  if (res.rows.length === 0) {
    console.log('No data found for execution 49');
    return;
  }
  const rawData = res.rows[0].data;
  console.log('Raw data length:', rawData.length);
  // Try to parse rawData
  try {
    const parsed = JSON.parse(rawData);
    console.log('Parsed top level keys:', Object.keys(parsed));
    
    // Look for node executions
    const executionData = parsed.executionData || parsed[0]?.executionData || parsed;
    // In n8n v1+, it's stored in parsed.resultData or inside the array
    fs.writeFileSync('/Users/AiGateway/exec_49.json', JSON.stringify(parsed, null, 2));
    console.log('Saved to /Users/AiGateway/exec_49.json');
  } catch (e) {
    console.log('Error parsing:', e.message);
    // Maybe it's compressed or stored differently
    console.log(rawData.substring(0, 1000));
  }
  await client.end();
}

const fs = require('fs');
main().catch(console.error);
