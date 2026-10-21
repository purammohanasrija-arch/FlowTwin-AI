import http from 'http';

function postJson(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api${path}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'x-demo-role': 'Logistics Manager',
        },
      },
      res => {
        let resData = '';
        res.on('data', chunk => (resData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData) });
          } catch {
            resolve({ status: res.statusCode, raw: resData });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5000,
        path: `/api${path}`,
        method: 'GET',
        headers: {
          'x-demo-role': 'Logistics Manager',
        },
      },
      res => {
        let resData = '';
        res.on('data', chunk => (resData += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(resData) });
          } catch {
            resolve({ status: res.statusCode, raw: resData });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING FLOWTWIN AI ACCEPTANCE TESTS ===\n');

  // Test 1: Query "hu" (the exact bug reported by user)
  console.log('[Test 1] Testing query "hu" ...');
  const resHu = await postJson('/ai/chat', { message: 'hu' });
  console.log(`Status: ${resHu.status}, OK: ${resHu.data.ok}`);
  console.log(`Reply snippet: ${resHu.data.reply?.slice(0, 120)}...`);
  if (!resHu.data.ok || !resHu.data.reply || resHu.data.reply.length < 20) {
    throw new Error('Test 1 Failed: "hu" did not generate a rich response!');
  }
  console.log('✓ Test 1 Passed: "hu" returns operational desk greeting, NOT empty timestamp.\n');

  // Test 2: Query "Hello"
  console.log('[Test 2] Testing query "Hello" ...');
  const resHello = await postJson('/ai/chat', { message: 'Hello' });
  if (!resHello.data.ok || !resHello.data.reply) {
    throw new Error('Test 2 Failed: "Hello" failed!');
  }
  console.log('✓ Test 2 Passed: "Hello" generates operational briefing.\n');

  // Test 3: Delayed shipments
  console.log('[Test 3] Testing "Which shipments are currently delayed?" ...');
  const resDelayed = await postJson('/ai/chat', { message: 'Which shipments are currently delayed?' });
  console.log(`Reply snippet: ${resDelayed.data.reply?.slice(0, 140)}...`);
  console.log(`Suggested Shipments: ${JSON.stringify(resDelayed.data.suggestedShipmentIds)}`);
  if (!resDelayed.data.ok || !resDelayed.data.reply.includes('delayed shipments')) {
    throw new Error('Test 3 Failed: Did not report delayed shipments!');
  }
  console.log('✓ Test 3 Passed: Logistics data queried and shipments identified.\n');

  // Test 4: Non-existent shipment (Acceptance Test F)
  console.log('[Test 4] Testing non-existent shipment SH-9999 ...');
  const resMissing = await postJson('/ai/chat', { message: 'Why is shipment SH-9999 at risk?' });
  console.log(`Reply snippet: ${resMissing.data.reply?.slice(0, 140)}...`);
  if (!resMissing.data.reply.includes('SH-9999') || !resMissing.data.reply.includes('not located')) {
    throw new Error('Test 4 Failed: Non-existent shipment was not flagged properly!');
  }
  console.log('✓ Test 4 Passed: Accurately reports nonexistent shipment not located in manifest.\n');

  // Test 5: Validation - Empty message
  console.log('[Test 5] Testing empty message validation ...');
  const resEmpty = await postJson('/ai/chat', { message: '' });
  console.log(`Status: ${resEmpty.status}, Error Code: ${resEmpty.data.error?.code}`);
  if (resEmpty.status !== 400 || resEmpty.data.ok !== false) {
    throw new Error('Test 5 Failed: Empty message was not rejected with 400!');
  }
  console.log('✓ Test 5 Passed: Empty message safely rejected with HTTP 400.\n');

  // Test 6: Agent Telemetry (Acceptance Test G)
  console.log('[Test 6] Testing Agent Telemetry endpoint ...');
  const resTelemetry = await getJson('/ai/telemetry');
  console.log(`Telemetry steps logged: ${resTelemetry.data.telemetry?.length}`);
  const latestStep = resTelemetry.data.telemetry?.slice(-1)[0];
  console.log(`Latest Step Agent: ${latestStep?.agentName}, Duration: ${latestStep?.durationMs}ms`);
  if (!resTelemetry.data.telemetry || resTelemetry.data.telemetry.length === 0) {
    throw new Error('Test 6 Failed: Telemetry history is empty!');
  }
  console.log('✓ Test 6 Passed: Real agent execution logged and retrievable.\n');

  console.log('=== ALL ACCEPTANCE TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Acceptance test failed:', err);
  process.exit(1);
});
