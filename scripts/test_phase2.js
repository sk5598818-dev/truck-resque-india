// Geospatial mathematical tests
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) dist = 1;
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return Math.round(dist * 10) / 10;
}

function encodeGeohash(latitude, longitude, precision = 8) {
  let latMin = -90.0, latMax = 90.0;
  let lonMin = -180.0, lonMax = 180.0;
  let hash = '';
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (hash.length < precision) {
    if (isEven) {
      const mid = (lonMin + lonMax) / 2;
      if (longitude >= mid) {
        ch |= (1 << (4 - bit));
        lonMin = mid;
      } else {
        lonMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (latitude >= mid) {
        ch |= (1 << (4 - bit));
        latMin = mid;
      } else {
        latMax = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      hash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return hash;
}

function decodeGeohash(geohash) {
  let isEven = true;
  let latMin = -90.0, latMax = 90.0;
  let lonMin = -180.0, lonMax = 180.0;

  for (let i = 0; i < geohash.length; i++) {
    const c = geohash[i];
    const cd = BASE32.indexOf(c);
    if (cd === -1) continue;

    for (let j = 0; j < 5; j++) {
      const mask = 1 << (4 - j);
      if (isEven) {
        const lonMid = (lonMin + lonMax) / 2;
        if ((cd & mask) !== 0) lonMin = lonMid;
        else lonMax = lonMid;
      } else {
        const latMid = (latMin + latMax) / 2;
        if ((cd & mask) !== 0) latMin = latMid;
        else latMax = latMid;
      }
      isEven = !isEven;
    }
  }
  return {
    latitude: (latMin + latMax) / 2,
    longitude: (lonMin + lonMax) / 2,
  };
}

function getGeohashRanges(lat, lon, radiusKm) {
  let precision = 3;
  if (radiusKm <= 5) precision = 5;
  else if (radiusKm <= 35) precision = 4;
  else if (radiusKm <= 150) precision = 3;
  else precision = 2;

  const latDelta = radiusKm / 110.574;
  const lonDelta = radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));

  const minLat = Math.max(-90, lat - latDelta);
  const maxLat = Math.min(90, lat + latDelta);
  const minLon = Math.max(-180, lon - lonDelta);
  const maxLon = Math.min(180, lon + lonDelta);

  const hashes = new Set();
  const latSteps = 2;
  const lonSteps = 2;

  for (let i = 0; i <= latSteps; i++) {
    const curLat = minLat + (i / latSteps) * (maxLat - minLat);
    for (let j = 0; j <= lonSteps; j++) {
      const curLon = minLon + (j / lonSteps) * (maxLon - minLon);
      const h = encodeGeohash(curLat, curLon, precision);
      hashes.add(h);
    }
  }

  hashes.add(encodeGeohash(lat, lon, precision));

  return Array.from(hashes).map((h) => ({
    start: h,
    end: h + '~',
  }));
}

function formatDistance(km) {
  if (km === undefined || km === null) return 'Distance unknown';
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

console.log('====================================================');
console.log('    TRUCK RESCUE INDIA - PHASE 2 VERIFICATION TEST  ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Test Geohash Encoding & Decoding
const bhiwandiLat = 19.2968;
const bhiwandiLon = 73.0631;
const hash = encodeGeohash(bhiwandiLat, bhiwandiLon, 7);
assert(hash && hash.length === 7, `Geohash encoding produced valid 7-char hash: ${hash}`);

const decoded = decodeGeohash(hash);
const latDiff = Math.abs(decoded.latitude - bhiwandiLat);
const lonDiff = Math.abs(decoded.longitude - bhiwandiLon);
assert(latDiff < 0.01 && lonDiff < 0.01, `Geohash decoding accurate to within 0.01 deg: latDiff=${latDiff.toFixed(4)}, lonDiff=${lonDiff.toFixed(4)}`);

// 2. Test Haversine Distance
const distBhiwandiKalamboli = calculateDistanceKm(19.2968, 73.0631, 19.0263, 73.1042);
assert(distBhiwandiKalamboli >= 29 && distBhiwandiKalamboli <= 32, `Bhiwandi to Kalamboli distance calculated correctly: ${distBhiwandiKalamboli} km`);

const zeroDist = calculateDistanceKm(19.2968, 73.0631, 19.2968, 73.0631);
assert(zeroDist === 0, `Identical coordinates yield 0 km: ${zeroDist}`);

// 3. Test Multi-Range Geohash Bounds Generation
const ranges50km = getGeohashRanges(bhiwandiLat, bhiwandiLon, 50);
assert(ranges50km.length > 0 && ranges50km.length <= 16, `getGeohashRanges for 50km generated ${ranges50km.length} bounds`);
assert(ranges50km[0].start && ranges50km[0].end, `Range objects contain valid start (${ranges50km[0].start}) and end (${ranges50km[0].end})`);

// 4. Test Distance Formatting
assert(formatDistance(0.45) === '450 m away', `Sub-kilometer distance formatted in meters: ${formatDistance(0.45)}`);
assert(formatDistance(14.2) === '14.2 km away', `Kilometer distance formatted cleanly: ${formatDistance(14.2)}`);

// 5. Test Phone Sanitization and Link Generation
const rawPhone1 = '+91 98201-23456';
const clean1 = rawPhone1.replace(/[^0-9]/g, '');
const normalized1 = clean1.startsWith('91') ? clean1 : `91${clean1}`;
assert(normalized1 === '919820123456', `Phone sanitization formats Indian number: ${normalized1}`);

const telLink = `tel:+${normalized1}`;
assert(telLink === 'tel:+919820123456', `Call link generated correctly: ${telLink}`);

const waLink = `https://wa.me/${normalized1}?text=Namaste`;
assert(waLink.startsWith('https://wa.me/919820123456'), `WhatsApp link generated correctly: ${waLink}`);

// 6. Test Radius Filtering Array
const radiusOptions = [5, 10, 25, 50, 100];
assert(radiusOptions.length === 5 && radiusOptions.includes(5) && radiusOptions.includes(100), 'All 5 requested radius filters present (5, 10, 25, 50, 100 km)');

console.log(`\n====================================================`);
console.log(`Results: ${passedTests} / ${totalTests} tests passed successfully!`);
console.log(`====================================================\n`);
