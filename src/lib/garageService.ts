import { Garage, Review, VerificationStatus, GarageReport, ProviderCategory } from './types';
import { INITIAL_GARAGES } from './mockGarages';
import { calculateDistanceKm, encodeGeohash, getGeohashRanges } from './geo';
import { generateReferralCode } from './referralService';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  limit,
  addDoc
} from 'firebase/firestore';

const STORAGE_KEY = 'truck_rescue_garages_v2';
const REPORTS_KEY = 'truck_rescue_reports_v1';

// In-memory fallback helper
function getLocalGarages(): Garage[] {
  if (typeof window === 'undefined') return INITIAL_GARAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GARAGES));
      return INITIAL_GARAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_GARAGES;
  }
}

function saveLocalGarages(garages: Garage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(garages));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

export async function fetchAllGarages(): Promise<Garage[]> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'mechanic_garages'),
        where('isActive', '==', true),
        limit(100)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Garage));
      }
    } catch (e) {
      console.warn('Firestore fetch failed, falling back to local database:', e);
    }
  }
  return getLocalGarages();
}

export async function fetchGaragesByOwner(ownerUid: string): Promise<Garage[]> {
  if (!ownerUid) return [];
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'mechanic_garages'),
        where('uid', '==', ownerUid)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Garage));
      }
    } catch (e) {
      console.warn('Firestore fetch by owner failed, falling back:', e);
    }
  }
  const all = getLocalGarages();
  return all.filter(g => g.uid === ownerUid);
}

export async function fetchGarageById(id: string): Promise<Garage | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'mechanic_garages', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Garage;
      }
    } catch (e) {
      console.warn('Firestore fetch by id failed, falling back:', e);
    }
  }
  const all = getLocalGarages();
  return all.find(g => g.id === id) || null;
}

export interface SearchNearbyParams {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  category?: string;
  providerCategory?: string;
  brand?: string;
  is24x7?: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  hasScanner?: boolean;
  hasElectrician?: boolean;
  hasBs6Expert?: boolean;
  verifiedOnly?: boolean;
  searchQuery?: string;
  state?: string;
  district?: string;
  city?: string;
  area?: string;
  pincode?: string;
}

/**
 * Real Geospatial Search Engine:
 * Queries multiple geohash ranges in Firestore, deduplicates results,
 * calculates precise Haversine distance, and sorts nearest garage first.
 */
export async function searchNearbyGarages(params: SearchNearbyParams): Promise<Garage[]> {
  const {
    latitude,
    longitude,
    radiusKm = 50,
    category,
    brand,
    is24x7,
    isMobile,
    isOpen,
    verifiedOnly,
    searchQuery,
    state,
    district,
    city,
    area,
    pincode,
    hasScanner,
    hasElectrician,
    hasBs6Expert,
    providerCategory
  } = params;

  let candidates: Garage[] = [];

  // 1. Try real Firestore Geohash Multi-Range Query if GPS coordinates available
  if (isFirebaseConfigured && db && latitude !== undefined && longitude !== undefined) {
    try {
      const ranges = getGeohashRanges(latitude, longitude, radiusKm);
      const deduplicatedMap = new Map<string, Garage>();

      // Execute range queries concurrently across bounding boxes
      await Promise.all(
        ranges.map(async (range) => {
          try {
            const q = query(
              collection(db, 'mechanic_garages'),
              where('verificationStatus', '==', 'verified'),
              where('geohash', '>=', range.start),
              where('geohash', '<=', range.end),
              limit(25)
            );
            const snap = await getDocs(q);
            snap.docs.forEach((docItem) => {
              deduplicatedMap.set(docItem.id, { id: docItem.id, ...docItem.data() } as Garage);
            });
          } catch (err) {
            // If composite index is pending, fallback gracefully
          }
        })
      );

      if (deduplicatedMap.size > 0) {
        candidates = Array.from(deduplicatedMap.values());
      }
    } catch (e) {
      console.warn('Geohash query error in Firestore, using full candidate set:', e);
    }
  }

  // Fallback to all garages if candidates list is empty
  if (candidates.length === 0) {
    candidates = await fetchAllGarages();
  }

  // 2. Calculate Distance using Haversine formula
  let results = candidates.map(g => {
    let distanceKm: number | undefined = undefined;
    if (latitude !== undefined && longitude !== undefined && g.latitude && g.longitude) {
      distanceKm = calculateDistanceKm(latitude, longitude, g.latitude, g.longitude);
    }
    return { ...g, distanceKm };
  });

  // 3. Strict Safety Filter: Only show approved and active garages for public search
  results = results.filter(g => 
    g.verificationStatus !== 'suspended' && 
    g.verificationStatus !== 'rejected' &&
    g.isActive !== false
  );

  // 4. Filter by Verified Status if selected
  if (verifiedOnly) {
    results = results.filter(g => g.verificationStatus === 'verified');
  }

  // 5. Filter by Open/Closed
  if (isOpen) {
    results = results.filter(g => g.isOpen);
  }

  // 6. Filter by 24-hour service
  if (is24x7) {
    results = results.filter(g => g.twentyFourHours);
  }

  // 7. Filter by Roadside Rescue Van
  if (isMobile) {
    results = results.filter(g => g.mobileService || g.isRoadsideVanAvailable);
  }

  // 7b. Phase 11 Quick Filters: Scanner, Electrician, BS6 Expert
  if (hasScanner) {
    results = results.filter(g => 
      g.scannerDiagnosticAvailable ||
      (Array.isArray(g.equipment) && g.equipment.some(e => /scanner|obd|inline|diagnostic|launch|autel/i.test(e))) ||
      (Array.isArray(g.services) && g.services.some(s => /scanner|diagnostic|fault/i.test(s)))
    );
  }

  if (hasElectrician) {
    results = results.filter(g => 
      g.truckElectricianAvailable ||
      (Array.isArray(g.services) && g.services.some(s => /electrician|wiring|starter|alternator/i.test(s)))
    );
  }

  if (hasBs6Expert) {
    results = results.filter(g => 
      g.bs6ExpertAvailable ||
      (Array.isArray(g.services) && g.services.some(s => /bs6|urea|scr|dpf|nox/i.test(s)))
    );
  }

  // 7c. Filter by Provider Category (Workshop, Mobile Van, Individual, Towing, Spares)
  if (providerCategory && providerCategory !== 'all') {
    results = results.filter(g => g.providerCategory === providerCategory || g.garageType === providerCategory);
  }

  // 8. Filter by Category
  if (category && category !== 'all') {
    const catLower = category.toLowerCase();
    results = results.filter(g => 
      g.services.some(s => s.toLowerCase().includes(catLower)) ||
      g.garageType.toLowerCase().includes(catLower)
    );
  }

  // 9. Filter by Vehicle Brand
  if (brand && brand !== 'all') {
    const brandLower = brand.toLowerCase();
    results = results.filter(g => 
      g.brands.some(b => b.toLowerCase().includes(brandLower))
    );
  }

  // 10. Manual Location Search Filters (State, District, City, Area, Pincode)
  if (state && state.trim()) {
    const sLower = state.toLowerCase().trim();
    results = results.filter(g => g.state.toLowerCase().includes(sLower));
  }
  if (district && district.trim()) {
    const dLower = district.toLowerCase().trim();
    results = results.filter(g => g.district.toLowerCase().includes(dLower));
  }
  if (city && city.trim()) {
    const cLower = city.toLowerCase().trim();
    results = results.filter(g => g.city.toLowerCase().includes(cLower));
  }
  if (area && area.trim()) {
    const aLower = area.toLowerCase().trim();
    results = results.filter(g => g.area.toLowerCase().includes(aLower));
  }
  if (pincode && pincode.trim()) {
    const pinClean = pincode.replace(/[^0-9]/g, '');
    results = results.filter(g => g.pincode.includes(pinClean));
  }

  // 11. Free-Text Search Filter (Garage name, Highway, City, Landmark, Service)
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(g => 
      g.garageName.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q) ||
      g.state.toLowerCase().includes(q) ||
      g.district.toLowerCase().includes(q) ||
      (g.highway && g.highway.toLowerCase().includes(q)) ||
      (g.area && g.area.toLowerCase().includes(q)) ||
      g.pincode.includes(q) ||
      g.services.some(s => s.toLowerCase().includes(q)) ||
      g.brands.some(b => b.toLowerCase().includes(q))
    );
  }

  // 12. Radius Filter and Priority Sorting (Phase 11: Verified First, then Distance)
  if (latitude !== undefined && longitude !== undefined) {
    // Filter out locations beyond radius
    results = results.filter(g => g.distanceKm === undefined || g.distanceKm <= radiusKm);
    // Sort with sponsored & featured priority, verified priority, then nearest first
    results.sort((a, b) => {
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Verified garages prioritized first
      const aVerified = a.verificationStatus === 'verified' ? 1 : 0;
      const bVerified = b.verificationStatus === 'verified' ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;

      return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
    });
  } else {
    // If no coordinates, sort by sponsored/featured, verified, then rating
    results.sort((a, b) => {
      if (a.isSponsored && !b.isSponsored) return -1;
      if (!a.isSponsored && b.isSponsored) return 1;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      const aVerified = a.verificationStatus === 'verified' ? 1 : 0;
      const bVerified = b.verificationStatus === 'verified' ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;

      return (b.rating || 0) - (a.rating || 0);
    });
  }

  return results;
}

export async function registerNewGarage(data: Omit<Garage, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'rating' | 'reviewCount' | 'isActive'>): Promise<Garage> {
  const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '').slice(-10);
  
  // Duplicate Registration Protection
  if (cleanPhone.length === 10) {
    const existingGarages = await fetchAllGarages();
    const duplicate = existingGarages.find(g => {
      const gPhone = (g.phone || '').replace(/[^0-9]/g, '').slice(-10);
      return gPhone && gPhone === cleanPhone;
    });

    if (duplicate) {
      throw new Error(`A garage with mobile number +91 ${cleanPhone} is already registered ("${duplicate.garageName}"). Please log in with this phone number to manage your profile.`);
    }
  }

  const id = data.garageName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40) + '-' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  const referralCode = data.referralCode || generateReferralCode(data.state);
  
  const newGarage: Garage = {
    ...data,
    id,
    referralCode,
    providerCategory: data.providerCategory || 'workshop',
    geohash: encodeGeohash(data.latitude, data.longitude),
    verificationStatus: 'pending',
    rating: 5.0,
    reviewCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'mechanic_garages', id), newGarage);
    } catch (e) {
      console.warn('Firestore write failed, persisting locally:', e);
    }
  }

  const existing = getLocalGarages();
  existing.unshift(newGarage);
  saveLocalGarages(existing);

  return newGarage;
}

export async function updateGarage(id: string, updates: Partial<Garage>): Promise<Garage> {
  const now = new Date().toISOString();
  
  // Re-encode geohash if coordinates updated
  let geohashPatch: { geohash?: string } = {};
  if (updates.latitude !== undefined && updates.longitude !== undefined) {
    geohashPatch = { geohash: encodeGeohash(updates.latitude, updates.longitude) };
  }

  const patch = { ...updates, ...geohashPatch, updatedAt: now };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'mechanic_garages', id), patch);
    } catch (e) {
      console.warn('Firestore update failed, updating locally:', e);
    }
  }

  const existing = getLocalGarages();
  const index = existing.findIndex(g => g.id === id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...patch };
    saveLocalGarages(existing);
    return existing[index];
  }

  throw new Error('Garage not found');
}

export async function updateGarageVerification(
  id: string, 
  status: VerificationStatus, 
  notes?: string,
  rejectionReason?: string
): Promise<void> {
  const now = new Date().toISOString();
  await updateGarage(id, { 
    verificationStatus: status,
    verificationNotes: notes || '',
    rejectionReason: rejectionReason || '',
    verifiedAt: now,
    verifiedBy: 'National Admin Operations'
  });
}

export async function reportGarage(report: Omit<GarageReport, 'id' | 'createdAt'>): Promise<GarageReport> {
  const id = `rep_${Date.now()}`;
  const now = new Date().toISOString();
  const newReport: GarageReport = {
    ...report,
    id,
    createdAt: now,
  };

  if (isFirebaseConfigured && db) {
    try {
      await addDoc(collection(db, 'garage_reports'), newReport);
    } catch (e) {
      console.warn('Firestore report write failed:', e);
    }
  }

  // Persist locally
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const list: GarageReport[] = raw ? JSON.parse(raw) : [];
    list.unshift(newReport);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(list));
  } catch (e) {}

  return newReport;
}
