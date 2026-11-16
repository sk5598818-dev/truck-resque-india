/**
 * Geospatial Utilities for Truck Rescue India
 * Calculates distance using the Haversine formula and handles Geohash encode/decode
 * Supports multi-range bounding box queries for Cloud Firestore
 */

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export interface GeohashRange {
  start: string;
  end: string;
}

/**
 * Calculates distance between two points in Kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
  dist = dist * 60 * 1.1515 * 1.609344; // to Kilometers

  return Math.round(dist * 10) / 10; // Round to 1 decimal place (e.g. 4.2 km)
}

/**
 * Encodes latitude & longitude into a standard Geohash string
 */
export function encodeGeohash(latitude: number, longitude: number, precision: number = 8): string {
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

/**
 * Decodes a geohash string into latitude & longitude bounds
 */
export function decodeGeohash(geohash: string): { latitude: number; longitude: number } {
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
        if ((cd & mask) !== 0) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        const latMid = (latMin + latMax) / 2;
        if ((cd & mask) !== 0) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      isEven = !isEven;
    }
  }

  return {
    latitude: (latMin + latMax) / 2,
    longitude: (lonMin + lonMax) / 2,
  };
}

/**
 * Computes multiple geohash query bounds covering a given radius in kilometers
 * Used for high-efficiency Firestore range queries without downloading the whole database
 */
export function getGeohashRanges(lat: number, lon: number, radiusKm: number): GeohashRange[] {
  let precision = 3;
  if (radiusKm <= 5) {
    precision = 5;
  } else if (radiusKm <= 35) {
    precision = 4;
  } else if (radiusKm <= 150) {
    precision = 3;
  } else {
    precision = 2;
  }

  const latDelta = radiusKm / 110.574;
  const lonDelta = radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));

  const minLat = Math.max(-90, lat - latDelta);
  const maxLat = Math.min(90, lat + latDelta);
  const minLon = Math.max(-180, lon - lonDelta);
  const maxLon = Math.min(180, lon + lonDelta);

  const hashes = new Set<string>();
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

  const ranges: GeohashRange[] = Array.from(hashes).map((h) => ({
    start: h,
    end: h + '~',
  }));

  return ranges;
}

/**
 * Formats distance display string
 */
export function formatDistance(km?: number): string {
  if (km === undefined || km === null) return 'Distance unknown';
  if (km < 1) {
    return `${Math.round(km * 1000)} m away`;
  }
  return `${km.toFixed(1)} km away`;
}
