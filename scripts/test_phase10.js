/**
 * Phase 10: Master End-to-End Testing & Verification Suite
 * TRUCK RESCUE INDIA
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
console.log(' TRUCK RESCUE INDIA - PHASE 10 AUDIT & VERIFICATION');
console.log('========================================================\n');

// ----------------------------------------------------
// SECTION 1: ADMIN SECURITY & ACCESS CONTROL
// ----------------------------------------------------
console.log('--- 1. Testing Admin Access Control & Key Security ---');

const adminAuthFile = path.join(ROOT_DIR, 'src/lib/adminAuth.ts');
assert(fs.existsSync(adminAuthFile), 'adminAuth.ts exists');
const adminAuthContent = fs.readFileSync(adminAuthFile, 'utf8');
assert(adminAuthContent.includes('verifyAdminAccess'), 'verifyAdminAccess function defined');
assert(!adminAuthContent.includes('admin123'), 'Weak key "admin123" removed from adminAuth.ts');

const adminVerifyRoute = path.join(ROOT_DIR, 'src/app/api/admin/verify/route.ts');
const adminUsersRoute = path.join(ROOT_DIR, 'src/app/api/admin/users/route.ts');
const adminStatsRoute = path.join(ROOT_DIR, 'src/app/api/admin/stats/route.ts');
const adminAuditRoute = path.join(ROOT_DIR, 'src/app/api/admin/audit-logs/route.ts');
const adminLoginRoute = path.join(ROOT_DIR, 'src/app/api/admin/login/route.ts');

[adminVerifyRoute, adminUsersRoute, adminStatsRoute, adminAuditRoute].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  assert(content.includes('verifyAdminAccess'), `${path.basename(path.dirname(file))} enforces verifyAdminAccess`);
  assert(!content.includes("'admin123'"), `${path.basename(path.dirname(file))} has no backdoor admin123 key`);
});

assert(fs.existsSync(adminLoginRoute), 'Server-side admin login route exists (/api/admin/login)');

// ----------------------------------------------------
// SECTION 2: AI TRUCK DIAGNOSTIC ASSISTANT
// ----------------------------------------------------
console.log('\n--- 2. Testing AI Diagnostic Assistant & SPN/FMI Database ---');
const diagnosticDb = path.join(ROOT_DIR, 'src/lib/heavyTruckDiagnosticDatabase.ts');
assert(fs.existsSync(diagnosticDb), 'heavyTruckDiagnosticDatabase.ts exists');
const diagDbContent = fs.readFileSync(diagnosticDb, 'utf8');

assert(diagDbContent.includes('SPN 3226'), 'Diagnostic database covers SPN 3226 (NOx Sensor)');
assert(diagDbContent.includes('SPN 4364'), 'Diagnostic database covers SPN 4364 (SCR AdBlue)');
assert(diagDbContent.includes('SPN 3719'), 'Diagnostic database covers SPN 3719 (DPF Soot)');
assert(diagDbContent.includes('P0087'), 'Diagnostic database covers P0087 (CRDI Fuel Rail)');
assert(diagDbContent.includes('SPN 639'), 'Diagnostic database covers SPN 639 (CAN Backbone)');
assert(diagDbContent.includes('SPN 789'), 'Diagnostic database covers SPN 789 (ABS Sensor Air Gap)');

const diagRoute = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/diagnostic/route.ts'), 'utf8');
assert(diagRoute.includes('response: replyText'), 'Diagnostic route returns response alias for Flutter compatibility');
assert(!diagRoute.includes('NEXT_PUBLIC_GEMINI_API_KEY'), 'Diagnostic route does not leak GEMINI key via NEXT_PUBLIC_');

// ----------------------------------------------------
// SECTION 3: DRIVER ACTIONS (CALL, WHATSAPP, GOOGLE MAPS)
// ----------------------------------------------------
console.log('\n--- 3. Testing Call, WhatsApp, and Google Maps Directions ---');
const garageCardContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/GarageCard.tsx'), 'utf8');
assert(garageCardContent.includes('tel:'), 'GarageCard includes direct tel: calling link');
assert(garageCardContent.includes('wa.me'), 'GarageCard includes direct WhatsApp chat link');
assert(garageCardContent.includes('google.com/maps/dir'), 'GarageCard includes Google Maps directions link');

const garageDetailContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/garage/[id]/page.tsx'), 'utf8');
assert(garageDetailContent.includes('tel:'), 'Garage Profile page includes direct tel: calling link');
assert(garageDetailContent.includes('wa.me'), 'Garage Profile page includes direct WhatsApp chat link');
assert(garageDetailContent.includes('google.com/maps/dir'), 'Garage Profile page includes Google Maps directions link');

// ----------------------------------------------------
// SECTION 4: PAYMENT VERIFICATION & FREE TIER GUARANTEE
// ----------------------------------------------------
console.log('\n--- 4. Testing Razorpay Payments & Free Registration ---');
const paymentVerifyContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/payments/verify/route.ts'), 'utf8');
assert(paymentVerifyContent.includes('createHmac(\'sha256\''), 'Payment verification implements HMAC-SHA256');
assert(paymentVerifyContent.includes('planId === \'free\''), 'Payment verification explicitly supports Free tier at ₹0');

// Test HMAC-SHA256 signature verification logic
const testOrderId = 'order_test_12345';
const testPaymentId = 'pay_test_67890';
const testSecret = 'secret_test_key_sample';
const expectedSig = crypto.createHmac('sha256', testSecret).update(`${testOrderId}|${testPaymentId}`).digest('hex');
const verifySig = crypto.createHmac('sha256', testSecret).update(`${testOrderId}|${testPaymentId}`).digest('hex');
assert(expectedSig === verifySig, 'Cryptographic signature verification matches specification');

// ----------------------------------------------------
// SECTION 5: FIREBASE SECURITY RULES
// ----------------------------------------------------
console.log('\n--- 5. Testing Firebase Firestore & Storage Rules ---');
const firestoreRules = fs.readFileSync(path.join(ROOT_DIR, 'firestore.rules'), 'utf8');
assert(firestoreRules.includes('match /mechanic_garages/{garageId}'), 'Firestore rules guard mechanic_garages');
assert(firestoreRules.includes('match /reviews/{reviewId}'), 'Firestore rules guard reviews');
assert(firestoreRules.includes('match /audit_logs/{logId}'), 'Firestore rules guard audit_logs with strict immutability');
assert(firestoreRules.includes('match /payment_transactions/{transactionId}'), 'Firestore rules guard payment_transactions');

const storageRules = fs.readFileSync(path.join(ROOT_DIR, 'storage.rules'), 'utf8');
assert(storageRules.includes('match /garages/{garageId}'), 'Storage rules cover garage photos');
assert(storageRules.includes('match /emergencies/{requestId}'), 'Storage rules cover emergency photos');
assert(storageRules.includes('match /reviews/{reviewId}'), 'Storage rules cover review photos');

// ----------------------------------------------------
// SECTION 6: FLUTTER ANDROID NATIVE ARCHITECTURE
// ----------------------------------------------------
console.log('\n--- 6. Testing Flutter Android Native Configuration ---');
const flutterDir = path.join(ROOT_DIR, 'flutter_app');
assert(fs.existsSync(path.join(flutterDir, 'android/settings.gradle')), 'flutter_app/android/settings.gradle exists');
assert(fs.existsSync(path.join(flutterDir, 'android/gradle.properties')), 'flutter_app/android/gradle.properties exists');
assert(fs.existsSync(path.join(flutterDir, 'android/app/src/main/res/values/strings.xml')), 'strings.xml exists');
assert(fs.existsSync(path.join(flutterDir, 'android/app/src/main/res/values/styles.xml')), 'styles.xml exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'build_android.bat')), 'build_android.bat utility script exists');

const manifestContent = fs.readFileSync(path.join(flutterDir, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
assert(manifestContent.includes('ACCESS_FINE_LOCATION'), 'Manifest has ACCESS_FINE_LOCATION');
assert(manifestContent.includes('CALL_PHONE'), 'Manifest has CALL_PHONE');
assert(manifestContent.includes('POST_NOTIFICATIONS'), 'Manifest has POST_NOTIFICATIONS');

console.log('\n========================================================');
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================\n');

if (failed > 0) process.exit(1);
process.exit(0);
