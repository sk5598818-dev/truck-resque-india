/**
 * Automated Verification Test Suite for Phase 8 (Public Launch & SEO) & Phase 9 (Flutter Android Application)
 * TRUCK RESCUE INDIA
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log(' TRUCK RESCUE INDIA - PHASE 8 & 9 VERIFICATION SUITE');
console.log('========================================================\n');

// ----------------------------------------------------
// SECTION 1: PHASE 8 - PUBLIC PAGES & LEGAL
// ----------------------------------------------------
console.log('--- 1. Testing Phase 8 Legal & Public Pages ---');
const requiredLegalPages = [
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/refund-policy/page.tsx',
  'src/app/disclaimer/page.tsx',
];

requiredLegalPages.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(fullPath), `Legal page exists: ${file}`);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.length > 500, `${file} has comprehensive content (${content.length} chars)`);
  }
});

// ----------------------------------------------------
// SECTION 2: PHASE 8 - JOIN SYSTEM (100% FREE PRESERVED)
// ----------------------------------------------------
console.log('\n--- 2. Testing Phase 8 Join System & Free Registration ---');
const joinPages = [
  'src/app/join/page.tsx',
  'src/app/join/mechanic/page.tsx',
  'src/app/join/electrician/page.tsx',
  'src/app/join/scanner-expert/page.tsx',
  'src/app/join/ecm-expert/page.tsx',
  'src/app/join/tyre-service/page.tsx',
  'src/app/join/towing/page.tsx',
  'src/app/join/spare-parts/page.tsx',
];

joinPages.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(fullPath), `Join page exists: ${file}`);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    assert(content.toLowerCase().includes('free'), `${file} explicitly guarantees FREE registration`);
  }
});

// ----------------------------------------------------
// SECTION 3: PHASE 8 - SEO LOCATION PAGES & SITEMAP
// ----------------------------------------------------
console.log('\n--- 3. Testing Phase 8 Location SEO & Sitemaps ---');
const locationPages = [
  'src/app/india/page.tsx',
  'src/app/maharashtra/page.tsx',
  'src/app/mumbai/page.tsx',
  'src/app/delhi/page.tsx',
  'src/app/uttar-pradesh/page.tsx',
];

locationPages.forEach(file => {
  const fullPath = path.join(ROOT_DIR, file);
  assert(fs.existsSync(fullPath), `Location SEO page exists: ${file}`);
});

assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/sitemap.ts')), 'Dynamic sitemap.ts exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/robots.ts')), 'robots.ts exists');

// ----------------------------------------------------
// SECTION 4: PHASE 8 - PWA OFFLINE SUPPORT
// ----------------------------------------------------
console.log('\n--- 4. Testing Phase 8 PWA & Offline Support ---');
assert(fs.existsSync(path.join(ROOT_DIR, 'public/manifest.json')), 'public/manifest.json exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'public/sw.js')), 'public/sw.js service worker exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'public/offline.html')), 'public/offline.html offline fallback exists');

const swContent = fs.readFileSync(path.join(ROOT_DIR, 'public/sw.js'), 'utf8');
assert(swContent.includes('offline.html'), 'Service worker registers offline fallback route');

// ----------------------------------------------------
// SECTION 5: PHASE 9 - FLUTTER NATIVE ANDROID APPLICATION
// ----------------------------------------------------
console.log('\n--- 5. Testing Phase 9 Flutter Project Structure ---');
const flutterDir = path.join(ROOT_DIR, 'flutter_app');
assert(fs.existsSync(flutterDir), 'flutter_app directory exists');

const pubspecPath = path.join(flutterDir, 'pubspec.yaml');
assert(fs.existsSync(pubspecPath), 'flutter_app/pubspec.yaml exists');
if (fs.existsSync(pubspecPath)) {
  const pubContent = fs.readFileSync(pubspecPath, 'utf8');
  assert(pubContent.includes('firebase_core'), 'pubspec includes firebase_core');
  assert(pubContent.includes('firebase_auth'), 'pubspec includes firebase_auth');
  assert(pubContent.includes('cloud_firestore'), 'pubspec includes cloud_firestore');
  assert(pubContent.includes('geolocator'), 'pubspec includes geolocator');
  assert(pubContent.includes('provider'), 'pubspec includes provider state management');
}

const manifestPath = path.join(flutterDir, 'android/app/src/main/AndroidManifest.xml');
assert(fs.existsSync(manifestPath), 'Android Manifest exists');
if (fs.existsSync(manifestPath)) {
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  assert(manifest.includes('ACCESS_FINE_LOCATION'), 'Manifest has ACCESS_FINE_LOCATION permission');
  assert(manifest.includes('CALL_PHONE'), 'Manifest has CALL_PHONE permission');
  assert(manifest.includes('POST_NOTIFICATIONS'), 'Manifest has POST_NOTIFICATIONS permission');
  assert(manifest.includes('package="com.truckrescue.india"'), 'Manifest package is com.truckrescue.india');
}

// ----------------------------------------------------
// SECTION 6: PHASE 9 - FLUTTER ARCHITECTURE & SCREENS
// ----------------------------------------------------
console.log('\n--- 6. Testing Phase 9 Dart Models, Services, Providers & Screens ---');
const requiredDartFiles = [
  'lib/main.dart',
  'lib/core/theme.dart',
  'lib/core/constants.dart',
  'lib/models/garage.dart',
  'lib/models/emergency_request.dart',
  'lib/models/review.dart',
  'lib/models/user_profile.dart',
  'lib/services/auth_service.dart',
  'lib/services/firestore_service.dart',
  'lib/services/location_service.dart',
  'lib/services/fcm_service.dart',
  'lib/services/ai_service.dart',
  'lib/providers/auth_provider.dart',
  'lib/providers/garage_provider.dart',
  'lib/providers/emergency_provider.dart',
  'lib/screens/auth/phone_login_screen.dart',
  'lib/screens/driver/driver_home_screen.dart',
  'lib/screens/driver/nearby_garages_screen.dart',
  'lib/screens/driver/garage_detail_screen.dart',
  'lib/screens/driver/emergency_sos_screen.dart',
  'lib/screens/driver/emergency_tracking_screen.dart',
  'lib/screens/driver/ai_diagnostic_screen.dart',
  'lib/screens/garage/garage_dashboard_screen.dart',
  'lib/screens/admin/admin_console_screen.dart',
];

requiredDartFiles.forEach(file => {
  const full = path.join(flutterDir, file);
  assert(fs.existsSync(full), `Flutter clean architecture file exists: ${file}`);
});

// ----------------------------------------------------
// SECTION 7: PLAY STORE & DEPLOYMENT DOCUMENTATION
// ----------------------------------------------------
console.log('\n--- 7. Testing Deployment & Play Store Guides ---');
assert(fs.existsSync(path.join(ROOT_DIR, 'deploy_production.bat')), 'deploy_production.bat exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'docs/DEPLOYMENT_GUIDE.md')), 'docs/DEPLOYMENT_GUIDE.md exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'docs/PLAY_STORE_PUBLISHING.md')), 'docs/PLAY_STORE_PUBLISHING.md exists');

const playStoreGuide = fs.readFileSync(path.join(ROOT_DIR, 'docs/PLAY_STORE_PUBLISHING.md'), 'utf8');
assert(playStoreGuide.includes('com.truckrescue.india'), 'Play Store guide references com.truckrescue.india package');
assert(playStoreGuide.includes('Short Description'), 'Play Store guide contains short description');
assert(playStoreGuide.includes('Data Safety Questionnaire'), 'Play Store guide contains Data Safety responses');

console.log('\n========================================================');
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
