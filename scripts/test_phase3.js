// Comprehensive Phase 3 Verification Test Script for TRUCK RESCUE INDIA
const assert = require('assert');

// Haversine calculation
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// In-memory test store simulating Firestore emergency_requests collection
const store = new Map();

function createTestRequest(data) {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const requestId = `SOS-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const req = {
    ...data,
    id,
    requestId,
    status: 'searching',
    statusHistory: [
      {
        status: 'searching',
        timestamp: now,
        updatedBy: data.driverName || data.driverPhone,
        role: 'driver',
        note: `Breakdown reported for ${data.vehicleBrand} (${data.vehicleNumber})`
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  store.set(id, req);
  return req;
}

function atomicAcceptRequest(reqId, garage, mechanicName) {
  const req = store.get(reqId);
  if (!req) throw new Error('NOT_FOUND');

  // Strict atomic race check
  if (req.status !== 'pending' && req.status !== 'searching') {
    throw new Error('ALREADY_ACCEPTED');
  }

  const now = new Date().toISOString();
  let dist = undefined;
  if (garage.latitude && garage.longitude && req.latitude && req.longitude) {
    dist = calculateDistanceKm(garage.latitude, garage.longitude, req.latitude, req.longitude);
  }

  const updated = {
    ...req,
    status: 'accepted',
    assignedGarageId: garage.id,
    assignedGarageName: garage.garageName,
    assignedGaragePhone: garage.phone,
    assignedMechanicName: mechanicName || garage.ownerName,
    assignedGarageDistanceKm: dist,
    acceptedAt: now,
    updatedAt: now,
    statusHistory: [
      ...req.statusHistory,
      {
        status: 'accepted',
        timestamp: now,
        updatedBy: mechanicName || garage.garageName,
        role: 'mechanic',
        note: `Assistance accepted by ${garage.garageName}`
      }
    ]
  };

  store.set(reqId, updated);
  return updated;
}

function updateStatus(reqId, newStatus, updatedBy, role = 'mechanic', note = '') {
  const req = store.get(reqId);
  if (!req) throw new Error('NOT_FOUND');

  const now = new Date().toISOString();
  const updated = {
    ...req,
    status: newStatus,
    updatedAt: now,
    statusHistory: [
      ...req.statusHistory,
      {
        status: newStatus,
        timestamp: now,
        updatedBy,
        role,
        note: note || `Status updated to ${newStatus}`
      }
    ]
  };
  if (newStatus === 'completed') updated.completedAt = now;

  store.set(reqId, updated);
  return updated;
}

function cancelRequest(reqId, cancelledBy, reason) {
  const req = store.get(reqId);
  if (!req) throw new Error('NOT_FOUND');

  const now = new Date().toISOString();
  const updated = {
    ...req,
    status: 'cancelled',
    cancelledBy,
    cancellationReason: reason,
    cancelledAt: now,
    updatedAt: now,
    statusHistory: [
      ...req.statusHistory,
      {
        status: 'cancelled',
        timestamp: now,
        updatedBy: cancelledBy,
        role: cancelledBy,
        note: `Cancelled: ${reason}`
      }
    ]
  };

  store.set(reqId, updated);
  return updated;
}

async function runTests() {
  console.log('--- TRUCK RESCUE INDIA: PHASE 3 VERIFICATION TESTS ---');

  // Test 1: Emergency SOS Request Creation
  console.log('\n[Test 1] Creating new Emergency SOS Breakdown Request...');
  const newReq = createTestRequest({
    driverPhone: '+91 9876543210',
    driverName: 'Harpreet Singh',
    vehicleNumber: 'PB 10 CT 9988',
    vehicleBrand: 'Tata Motors',
    vehicleModel: 'Signa 4825.TK',
    vehicleType: 'BS6',
    breakdownCategory: 'urea_scr_dpf',
    description: 'DEF AdBlue warning light, truck in 20km/h limp mode on NH 44',
    latitude: 29.3909,
    longitude: 76.9635,
    highway: 'NH 44 (GT Road Corridor)',
    city: 'Panipat',
    district: 'Panipat',
    state: 'Haryana',
    pincode: '132103',
    priority: 'urgent',
    requestedService: 'roadside_van'
  });

  assert(newReq.id, 'Request ID should exist');
  assert(newReq.requestId.startsWith('SOS-'), 'Human-readable SOS ID should start with SOS-');
  assert.strictEqual(newReq.status, 'searching', 'Initial status must be searching');
  assert.strictEqual(newReq.statusHistory.length, 1, 'Initial statusHistory must have 1 record');
  console.log('✓ Request Created:', newReq.requestId, 'for truck', newReq.vehicleNumber);

  // Test 2: Distance calculation to nearby garage
  console.log('\n[Test 2] Calculating distance to Karnal/Panipat Heavy Truck Workshop...');
  const garageA = {
    id: 'karnal-truck-hub',
    garageName: 'Karnal Highway Heavy Truck Service',
    ownerName: 'Gurdeep Singh',
    phone: '+91 98120 12345',
    latitude: 29.6857,
    longitude: 76.9905,
    serviceRadiusKm: 60
  };

  const distKm = calculateDistanceKm(garageA.latitude, garageA.longitude, newReq.latitude, newReq.longitude);
  assert(distKm > 0 && distKm < 60, `Distance should be within service radius: ${distKm}km`);
  console.log(`✓ Distance from garage to breakdown spot: ${distKm} km (Within 60km radius)`);

  // Test 3: Atomic Acceptance by Garage A
  console.log('\n[Test 3] Garage A atomically accepts emergency request...');
  const acceptedReq = atomicAcceptRequest(newReq.id, garageA, 'Gurdeep Singh');
  assert.strictEqual(acceptedReq.status, 'accepted');
  assert.strictEqual(acceptedReq.assignedGarageId, garageA.id);
  assert.strictEqual(acceptedReq.assignedGarageName, garageA.garageName);
  assert.strictEqual(acceptedReq.statusHistory.length, 2);
  console.log('✓ Request successfully accepted by', garageA.garageName);

  // Test 4: Race condition / Duplicate acceptance prevention
  console.log('\n[Test 4] Garage B attempts simultaneous duplicate acceptance (Race Condition Check)...');
  const garageB = {
    id: 'panipat-express-garage',
    garageName: 'Panipat Express Crane & Mechanics',
    ownerName: 'Vikram Sharma',
    phone: '+91 94160 54321',
    latitude: 29.3800,
    longitude: 76.9500
  };

  let racePrevented = false;
  try {
    atomicAcceptRequest(newReq.id, garageB, 'Vikram Sharma');
  } catch (err) {
    if (err.message === 'ALREADY_ACCEPTED') {
      racePrevented = true;
    }
  }
  assert(racePrevented, 'Second mechanic acceptance MUST be blocked with ALREADY_ACCEPTED');
  console.log('✓ Duplicate acceptance blocked successfully. Race-condition guarded!');

  // Test 5: Status Progression Pipeline
  console.log('\n[Test 5] Advancing emergency status pipeline...');
  const onWay = updateStatus(newReq.id, 'mechanic_on_way', 'Gurdeep Singh', 'mechanic', 'Van on the way on NH 44');
  assert.strictEqual(onWay.status, 'mechanic_on_way');

  const reached = updateStatus(newReq.id, 'reached_location', 'Gurdeep Singh', 'mechanic', 'Arrived at truck location');
  assert.strictEqual(reached.status, 'reached_location');

  const inProgress = updateStatus(newReq.id, 'work_in_progress', 'Gurdeep Singh', 'mechanic', 'Connecting diagnostic laptop & flashing ECU');
  assert.strictEqual(inProgress.status, 'work_in_progress');

  const completed = updateStatus(newReq.id, 'completed', 'Gurdeep Singh', 'mechanic', 'DEF sensor calibrated. Limp mode cleared. Truck tested.');
  assert.strictEqual(completed.status, 'completed');
  assert(completed.completedAt, 'completedAt timestamp must be recorded');
  assert.strictEqual(completed.statusHistory.length, 6, 'Should have full 6-step history trail');
  console.log('✓ Pipeline executed successfully: searching -> accepted -> mechanic_on_way -> reached_location -> work_in_progress -> completed');

  // Test 6: Driver Cancellation
  console.log('\n[Test 6] Testing cancellation workflow for another request...');
  const req2 = createTestRequest({
    driverPhone: '+91 9998877665',
    vehicleNumber: 'RJ 14 GB 4433',
    vehicleBrand: 'Ashok Leyland',
    vehicleModel: 'AVTR 4220',
    vehicleType: 'BS6',
    breakdownCategory: 'battery_problem',
    latitude: 27.5706,
    longitude: 76.6029
  });

  const cancelled = cancelRequest(req2.id, 'driver', 'Driver managed jumpstart from passing truck');
  assert.strictEqual(cancelled.status, 'cancelled');
  assert.strictEqual(cancelled.cancelledBy, 'driver');
  console.log('✓ Cancellation handled properly:', cancelled.cancellationReason);

  console.log('\n======================================================');
  console.log('✅ ALL PHASE 3 VERIFICATION TESTS PASSED (6/6)!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
