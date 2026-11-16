const http = require('http');

const routes = [
  '/',
  '/nearby',
  '/register',
  '/emergency/new',
  '/ai-diagnostic',
  '/admin',
  '/garage-dashboard',
  '/login',
  '/driver-dashboard',
  '/plans',
  '/api/health',
  '/api/garages'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function main() {
  console.log('Testing localhost:3000 routes:');
  let passCount = 0;
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.status === 200 || res.status === 307 || res.status === 308) {
      console.log(`  ✓ [PASS] ${res.path} -> HTTP ${res.status}`);
      passCount++;
    } else {
      console.log(`  ✗ [FAIL] ${res.path} -> ${res.status || res.error}`);
    }
  }
  console.log(`\nResult: ${passCount}/${routes.length} routes reachable.`);
}

main();
