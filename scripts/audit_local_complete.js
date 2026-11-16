const http = require('http');

const allPages = [
  { path: '/', expected: [200], name: 'Homepage' },
  { path: '/nearby', expected: [200], name: 'Nearby Search' },
  { path: '/register', expected: [200], name: 'Garage Registration' },
  { path: '/emergency', expected: [200, 307], name: 'Emergency SOS Hub (Redirect)' },
  { path: '/emergency/new', expected: [200], name: 'New SOS Breakdown Form' },
  { path: '/ai-diagnostic', expected: [200], name: 'AI Diagnostic Assistant' },
  { path: '/admin', expected: [200], name: 'Admin Console' },
  { path: '/admin/login', expected: [200], name: 'Admin Login' },
  { path: '/garage-dashboard', expected: [200], name: 'Garage Owner Dashboard' },
  { path: '/login', expected: [200], name: 'Phone OTP Login' },
  { path: '/dashboard', expected: [200], name: 'Driver Dashboard' },
  { path: '/services', expected: [200], name: 'Services Hub' },
  { path: '/services/ecm-repair', expected: [200], name: 'ECM Repair Service' },
  { path: '/services/towing', expected: [200], name: 'Towing Service' },
  { path: '/india', expected: [200], name: 'India States Directory' },
  { path: '/join', expected: [200], name: 'Join Network Hub' },
  { path: '/about', expected: [200], name: 'About TRI' },
  { path: '/contact', expected: [200], name: 'Contact & Helpline' },
  { path: '/terms', expected: [200], name: 'Terms of Service' },
  { path: '/privacy', expected: [200], name: 'Privacy Policy' },
  { path: '/refund-policy', expected: [200], name: 'Refund Policy' },
  { path: '/disclaimer', expected: [200], name: 'Legal Disclaimer' }
];

const allApis = [
  { path: '/api/garages', method: 'GET', expected: [200], name: 'Garages API' },
  { path: '/api/emergency', method: 'GET', expected: [200], name: 'Emergency SOS List API' },
  { path: '/api/diagnostic', method: 'POST', body: JSON.stringify({ query: 'SPN 3226 FMI 9', language: 'hi' }), expected: [200], name: 'AI Diagnostic API' },
  { path: '/api/admin/login', method: 'POST', body: JSON.stringify({ securityKey: 'TRUCK_RESCUE_ADMIN_2026_SECURE' }), expected: [200], name: 'Admin Auth API (Valid Key)' },
  { path: '/api/admin/growth', method: 'GET', headers: { 'x-admin-key': 'TRUCK_RESCUE_ADMIN_2026_SECURE' }, expected: [200], name: 'Admin Growth API (Authorized)' },
  { path: '/api/reviews?garageId=garage-1', method: 'GET', expected: [200], name: 'Reviews List API' }
];

function fetchUrl(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL('http://localhost:3000' + path);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'TIMEOUT' });
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function run() {
  console.log('====================================================');
  console.log('TRUCK RESCUE INDIA — LOCAL LAPTOP FULL AUDIT');
  console.log('====================================================\n');

  console.log('--- 1. VERIFYING ALL CORE PAGES ---');
  let pagePassed = 0;
  for (const page of allPages) {
    const res = await fetchUrl(page.path);
    const isOk = page.expected.includes(res.status);
    if (isOk) {
      console.log(`  ✓ [PASS] ${page.name.padEnd(32)} (${page.path}) -> HTTP ${res.status}`);
      pagePassed++;
    } else {
      console.log(`  ✗ [FAIL] ${page.name.padEnd(32)} (${page.path}) -> HTTP ${res.status || res.error}`);
    }
  }

  console.log(`\nPage Results: ${pagePassed}/${allPages.length} Passed.\n`);

  console.log('--- 2. VERIFYING BACKEND / API ENDPOINTS ---');
  let apiPassed = 0;
  for (const api of allApis) {
    const res = await fetchUrl(api.path, api.method, api.body, api.headers);
    const isOk = api.expected.includes(res.status);
    if (isOk) {
      console.log(`  ✓ [PASS] ${api.name.padEnd(32)} (${api.path}) -> HTTP ${res.status}`);
      apiPassed++;
    } else {
      console.log(`  ✗ [FAIL] ${api.name.padEnd(32)} (${api.path}) -> HTTP ${res.status || res.error}`);
    }
  }

  console.log(`\nAPI Results: ${apiPassed}/${allApis.length} Passed.\n`);
  if (pagePassed === allPages.length && apiPassed === allApis.length) {
    console.log('🎉 ALL 28 PAGES AND APIS ARE 100% OPERATIONAL ON LOCALHOST:3000!');
  }
}

run();
