import { EmergencyRequest, EmergencyStatus, Garage, StatusHistoryItem } from './types';
import { calculateDistanceKm, encodeGeohash, getGeohashRanges } from './geo';
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
  onSnapshot,
  runTransaction
} from 'firebase/firestore';

const LOCAL_STORAGE_EMERGENCIES = 'truck_rescue_emergencies_v1';

// Seed initial realistic emergency requests for development/demo so radar is active
const INITIAL_EMERGENCY_MOCKS: EmergencyRequest[] = [
  {
    id: 'sos_mock_1',
    requestId: 'SOS-918241',
    driverPhone: '+91 98765 43210',
    driverName: 'Rajinder Singh',
    vehicleNumber: 'PB 08 CX 7789',
    vehicleBrand: 'Tata Motors (Prima, Signa, LPT)',
    vehicleModel: 'Signa 4825.TK 16-Wheeler',
    vehicleType: 'BS6',
    breakdownCategory: 'urea_scr_dpf',
    description: 'AdBlue urea dosing fault code, truck torque reduced to 20 km/h in limp mode on highway.',
    photos: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=60'
    ],
    latitude: 28.3845,
    longitude: 76.9421,
    geohash: encodeGeohash(28.3845, 76.9421),
    address: 'Near Manesar Toll Plaza, NH 48, KM 42',
    highway: 'NH 48 (Delhi-Jaipur Highway)',
    landmark: 'Opposite HPCL Petrol Pump, 2km before Bilaspur flyover',
    city: 'Gurugram',
    district: 'Gurugram',
    state: 'Haryana',
    pincode: '122051',
    requestedService: 'roadside_van',
    priority: 'urgent',
    status: 'searching',
    statusHistory: [
      {
        status: 'searching',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        updatedBy: 'Rajinder Singh',
        role: 'driver',
        note: 'Emergency roadside call initiated on NH 48'
      }
    ],
    searchRadiusKm: 50,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'sos_mock_2',
    requestId: 'SOS-847291',
    driverPhone: '+91 91234 56789',
    driverName: 'Murugan Selvam',
    vehicleNumber: 'TN 28 AJ 3412',
    vehicleBrand: 'Ashok Leyland (AVTR, Ecomet, Captain)',
    vehicleModel: 'AVTR 5525 Tractor Trailer',
    vehicleType: 'BS6',
    breakdownCategory: 'engine_problem',
    description: 'Sudden high engine coolant temperature alarm, white smoke from auxiliary radiator.',
    photos: [
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&auto=format&fit=crop&q=60'
    ],
    latitude: 19.2183,
    longitude: 73.0872,
    geohash: encodeGeohash(19.2183, 73.0872),
    address: 'Bhiwandi Bypass, KM 18 towards Nashik',
    highway: 'NH 160 (Mumbai - Nashik Corridor)',
    landmark: 'Near Indian Oil Dhabha, Mankoli Naka',
    city: 'Bhiwandi',
    district: 'Thane',
    state: 'Maharashtra',
    pincode: '421302',
    requestedService: 'roadside_van',
    priority: 'critical',
    status: 'accepted',
    assignedGarageId: 'shree-ganesh-truck-garage-mumbai',
    assignedGarageName: 'Shree Ganesh Heavy Truck Garage & Recovery',
    assignedGaragePhone: '+91 98200 45678',
    assignedMechanicName: 'Rameshwar Patil',
    assignedGarageDistanceKm: 14.2,
    acceptedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    statusHistory: [
      {
        status: 'searching',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updatedBy: 'Murugan Selvam',
        role: 'driver',
        note: 'Breakdown alert submitted'
      },
      {
        status: 'accepted',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updatedBy: 'Rameshwar Patil',
        role: 'mechanic',
        note: 'Garage accepted breakdown assistance. Rescue van preparing tools.'
      },
      {
        status: 'mechanic_on_way',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        updatedBy: 'Rameshwar Patil',
        role: 'mechanic',
        note: 'Mobile recovery van on the way. ETA 20 mins.'
      }
    ],
    searchRadiusKm: 50,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  }
];

function getLocalEmergencies(): EmergencyRequest[] {
  if (typeof window === 'undefined') return INITIAL_EMERGENCY_MOCKS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EMERGENCIES);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_EMERGENCIES, JSON.stringify(INITIAL_EMERGENCY_MOCKS));
      return INITIAL_EMERGENCY_MOCKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_EMERGENCY_MOCKS;
  }
}

function saveLocalEmergencies(list: EmergencyRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_EMERGENCIES, JSON.stringify(list));
    // Dispatch local storage event for cross-component re-renders
    window.dispatchEvent(new Event('truck_rescue_emergencies_updated'));
  } catch (e) {
    console.error('Failed to save emergencies to localStorage:', e);
  }
}

/**
 * Generate human readable SOS ID like SOS-482910
 */
export function generateSosId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SOS-${randomNum}`;
}

/**
 * Create a new emergency request
 */
export async function createEmergencyRequest(
  data: Omit<EmergencyRequest, 'id' | 'requestId' | 'geohash' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>
): Promise<EmergencyRequest> {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const requestId = generateSosId();
  const now = new Date().toISOString();
  const geohash = encodeGeohash(data.latitude, data.longitude);

  const initialHistoryItem: StatusHistoryItem = {
    status: 'searching',
    timestamp: now,
    updatedBy: data.driverName || data.driverPhone,
    role: 'driver',
    note: `Emergency request logged for ${data.vehicleBrand} (${data.vehicleNumber}). Searching nearby mechanics.`
  };

  const newRequest: EmergencyRequest = {
    ...data,
    id,
    requestId,
    geohash,
    status: 'searching',
    statusHistory: [initialHistoryItem],
    createdAt: now,
    updatedAt: now,
    searchRadiusKm: data.searchRadiusKm || 50
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'emergency_requests', id), newRequest);
    } catch (e) {
      console.warn('Firestore emergency create failed, saving locally:', e);
    }
  }

  const list = getLocalEmergencies();
  list.unshift(newRequest);
  saveLocalEmergencies(list);

  return newRequest;
}

/**
 * Fetch a single emergency request by document ID or human-readable requestId
 */
export async function fetchEmergencyRequestById(idOrRequestId: string): Promise<EmergencyRequest | null> {
  if (isFirebaseConfigured && db) {
    try {
      // 1. Direct doc lookup
      const docRef = doc(db, 'emergency_requests', idOrRequestId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as EmergencyRequest;
      }

      // 2. Query by requestId field (e.g. SOS-123456)
      const q = query(
        collection(db, 'emergency_requests'),
        where('requestId', '==', idOrRequestId),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        const d = querySnap.docs[0];
        return { id: d.id, ...d.data() } as EmergencyRequest;
      }
    } catch (e) {
      console.warn('Firestore emergency fetch failed, trying local storage:', e);
    }
  }

  const list = getLocalEmergencies();
  return list.find(r => r.id === idOrRequestId || r.requestId === idOrRequestId) || null;
}

/**
 * Subscribe to real-time updates for an emergency request
 */
export function subscribeEmergencyRequest(
  requestId: string,
  onUpdate: (request: EmergencyRequest | null) => void,
  onError?: (err: any) => void
): () => void {
  // If Firestore is available, use real onSnapshot
  let unsubFirestore: (() => void) | null = null;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'emergency_requests', requestId);
      unsubFirestore = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            onUpdate({ id: snap.id, ...snap.data() } as EmergencyRequest);
          } else {
            // Check by requestId
            fetchEmergencyRequestById(requestId).then(onUpdate).catch(() => onUpdate(null));
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot error, falling back to local observer:', error);
          if (onError) onError(error);
        }
      );
    } catch (e) {
      console.warn('Firestore listener setup failed:', e);
    }
  }

  // Also support cross-tab and local updates listener
  const handleLocalChange = () => {
    fetchEmergencyRequestById(requestId).then(onUpdate);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleLocalChange);
    window.addEventListener('truck_rescue_emergencies_updated', handleLocalChange);
    // Initial fetch
    fetchEmergencyRequestById(requestId).then(onUpdate);
  }

  return () => {
    if (unsubFirestore) unsubFirestore();
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleLocalChange);
      window.removeEventListener('truck_rescue_emergencies_updated', handleLocalChange);
    }
  };
}

/**
 * Fetch eligible nearby emergency requests for a mechanic/garage
 */
export async function fetchEmergencyRequestsForGarage(
  garage: Garage
): Promise<EmergencyRequest[]> {
  let allRequests: EmergencyRequest[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'emergency_requests'),
        limit(50)
      );
      const snap = await getDocs(q);
      allRequests = snap.docs.map(d => ({ id: d.id, ...d.data() } as EmergencyRequest));
    } catch (e) {
      console.warn('Firestore fetch emergency for garage failed, using local:', e);
      allRequests = getLocalEmergencies();
    }
  } else {
    allRequests = getLocalEmergencies();
  }

  // Filter requests that are relevant to this garage:
  // 1. Either assigned to this garage (any active status)
  // 2. OR currently in 'pending' / 'searching' status and within distance radius
  const maxRadiusKm = garage.serviceRadiusKm || 60;

  const relevant = allRequests.filter(req => {
    if (req.assignedGarageId === garage.id) return true;
    if (req.status !== 'pending' && req.status !== 'searching') return false;

    // Check distance if both coordinates exist
    if (garage.latitude && garage.longitude && req.latitude && req.longitude) {
      const dist = calculateDistanceKm(garage.latitude, garage.longitude, req.latitude, req.longitude);
      return dist <= maxRadiusKm;
    }

    // If matching state or district
    if (garage.state && req.state && garage.state.toLowerCase() === req.state.toLowerCase()) {
      return true;
    }

    return true;
  });

  // Calculate and attach distance
  return relevant.map(req => {
    let assignedGarageDistanceKm: number | undefined = undefined;
    if (garage.latitude && garage.longitude && req.latitude && req.longitude) {
      assignedGarageDistanceKm = calculateDistanceKm(
        garage.latitude,
        garage.longitude,
        req.latitude,
        req.longitude
      );
    }
    return { ...req, assignedGarageDistanceKm };
  }).sort((a, b) => (a.assignedGarageDistanceKm ?? 999) - (b.assignedGarageDistanceKm ?? 999));
}

/**
 * Atomic Acceptance of an Emergency Request
 * Prevents race condition / duplicate assignment when multiple mechanics accept at the same time.
 */
export async function acceptEmergencyRequest(
  requestId: string,
  garage: Garage,
  mechanicName?: string
): Promise<EmergencyRequest> {
  const now = new Date().toISOString();
  let distanceKm: number | undefined = undefined;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'emergency_requests', requestId);
      
      const updatedDoc = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(docRef);
        if (!snap.exists()) {
          throw new Error('Emergency request not found.');
        }

        const data = snap.data() as EmergencyRequest;
        if (data.status !== 'pending' && data.status !== 'searching') {
          throw new Error(`This request is already ${data.status === 'accepted' ? 'accepted by another mechanic' : data.status}.`);
        }

        if (garage.latitude && garage.longitude && data.latitude && data.longitude) {
          distanceKm = calculateDistanceKm(garage.latitude, garage.longitude, data.latitude, data.longitude);
        }

        const newHistoryItem: StatusHistoryItem = {
          status: 'accepted',
          timestamp: now,
          updatedBy: mechanicName || garage.ownerName,
          role: 'mechanic',
          note: `Assistance accepted by ${garage.garageName}. Mechanic dispatched.`
        };

        const patch: Partial<EmergencyRequest> = {
          status: 'accepted',
          assignedGarageId: garage.id,
          assignedGarageName: garage.garageName,
          assignedGaragePhone: garage.phone,
          assignedMechanicName: mechanicName || garage.ownerName,
          assignedGarageDistanceKm: distanceKm,
          acceptedAt: now,
          updatedAt: now,
          statusHistory: [...(data.statusHistory || []), newHistoryItem]
        };

        transaction.update(docRef, patch);
        return { ...data, ...patch } as EmergencyRequest;
      });

      // Mirror to local
      const list = getLocalEmergencies();
      const idx = list.findIndex(r => r.id === requestId);
      if (idx !== -1) {
        list[idx] = updatedDoc;
        saveLocalEmergencies(list);
      }

      return updatedDoc;
    } catch (e: any) {
      if (e.message && e.message.includes('already')) {
        throw e;
      }
      console.warn('Firestore transaction failed, falling back to atomic local operation:', e);
    }
  }

  // Local storage atomic simulation
  const list = getLocalEmergencies();
  const index = list.findIndex(r => r.id === requestId);
  if (index === -1) {
    throw new Error('Emergency request not found.');
  }

  const current = list[index];
  if (current.status !== 'pending' && current.status !== 'searching') {
    throw new Error(`This request was already accepted by another mechanic.`);
  }

  if (garage.latitude && garage.longitude && current.latitude && current.longitude) {
    distanceKm = calculateDistanceKm(garage.latitude, garage.longitude, current.latitude, current.longitude);
  }

  const newHistoryItem: StatusHistoryItem = {
    status: 'accepted',
    timestamp: now,
    updatedBy: mechanicName || garage.ownerName,
    role: 'mechanic',
    note: `Assistance accepted by ${garage.garageName}. Mechanic dispatched.`
  };

  const updated: EmergencyRequest = {
    ...current,
    status: 'accepted',
    assignedGarageId: garage.id,
    assignedGarageName: garage.garageName,
    assignedGaragePhone: garage.phone,
    assignedMechanicName: mechanicName || garage.ownerName,
    assignedGarageDistanceKm: distanceKm,
    acceptedAt: now,
    updatedAt: now,
    statusHistory: [...(current.statusHistory || []), newHistoryItem]
  };

  list[index] = updated;
  saveLocalEmergencies(list);

  return updated;
}

/**
 * Update request status (mechanic_on_way, reached_location, work_in_progress, completed)
 */
export async function updateEmergencyStatus(
  requestId: string,
  newStatus: EmergencyStatus,
  updatedBy: string,
  role: 'driver' | 'mechanic' | 'admin' | 'system' = 'mechanic',
  note?: string
): Promise<EmergencyRequest> {
  const now = new Date().toISOString();
  
  const historyItem: StatusHistoryItem = {
    status: newStatus,
    timestamp: now,
    updatedBy,
    role,
    note: note || `Status updated to ${newStatus}`
  };

  const patch: Partial<EmergencyRequest> = {
    status: newStatus,
    updatedAt: now,
    ...(newStatus === 'completed' ? { completedAt: now } : {})
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'emergency_requests', requestId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cur = snap.data() as EmergencyRequest;
        const history = [...(cur.statusHistory || []), historyItem];
        await updateDoc(docRef, { ...patch, statusHistory: history });
      }
    } catch (e) {
      console.warn('Firestore status update failed:', e);
    }
  }

  const list = getLocalEmergencies();
  const index = list.findIndex(r => r.id === requestId);
  if (index !== -1) {
    const cur = list[index];
    list[index] = {
      ...cur,
      ...patch,
      statusHistory: [...(cur.statusHistory || []), historyItem]
    };
    saveLocalEmergencies(list);
    return list[index];
  }

  throw new Error('Request not found');
}

/**
 * Revert request back to searching if mechanic has an emergency or can't attend
 */
export async function releaseEmergencyBackToSearching(
  requestId: string,
  garageName: string,
  reason: string
): Promise<EmergencyRequest> {
  const now = new Date().toISOString();
  const historyItem: StatusHistoryItem = {
    status: 'searching',
    timestamp: now,
    updatedBy: garageName,
    role: 'mechanic',
    note: `Mechanic released request (${reason}). Re-searching nearby mechanics.`
  };

  const patch: Partial<EmergencyRequest> = {
    status: 'searching',
    assignedGarageId: undefined,
    assignedGarageName: undefined,
    assignedGaragePhone: undefined,
    assignedMechanicName: undefined,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'emergency_requests', requestId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cur = snap.data() as EmergencyRequest;
        await updateDoc(docRef, {
          ...patch,
          statusHistory: [...(cur.statusHistory || []), historyItem]
        });
      }
    } catch (e) {
      console.warn('Firestore release failed:', e);
    }
  }

  const list = getLocalEmergencies();
  const index = list.findIndex(r => r.id === requestId);
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...patch,
      statusHistory: [...(list[index].statusHistory || []), historyItem]
    };
    saveLocalEmergencies(list);
    return list[index];
  }

  throw new Error('Request not found');
}

/**
 * Cancel request (by Driver or Admin)
 */
export async function cancelEmergencyRequest(
  requestId: string,
  cancelledBy: 'driver' | 'mechanic' | 'admin' | 'system',
  reason: string,
  updatedBy: string
): Promise<EmergencyRequest> {
  const now = new Date().toISOString();
  const historyItem: StatusHistoryItem = {
    status: 'cancelled',
    timestamp: now,
    updatedBy,
    role: cancelledBy,
    note: `Cancelled by ${cancelledBy}: ${reason}`
  };

  const patch: Partial<EmergencyRequest> = {
    status: 'cancelled',
    cancellationReason: reason,
    cancelledBy,
    cancelledAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'emergency_requests', requestId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cur = snap.data() as EmergencyRequest;
        await updateDoc(docRef, {
          ...patch,
          statusHistory: [...(cur.statusHistory || []), historyItem]
        });
      }
    } catch (e) {
      console.warn('Firestore cancel failed:', e);
    }
  }

  const list = getLocalEmergencies();
  const index = list.findIndex(r => r.id === requestId);
  if (index !== -1) {
    list[index] = {
      ...list[index],
      ...patch,
      statusHistory: [...(list[index].statusHistory || []), historyItem]
    };
    saveLocalEmergencies(list);
    return list[index];
  }

  throw new Error('Request not found');
}

/**
 * Fetch all emergencies for Admin panel
 */
export async function fetchAllEmergencies(filters?: {
  status?: string;
  state?: string;
  search?: string;
}): Promise<EmergencyRequest[]> {
  let list: EmergencyRequest[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'emergency_requests'),
        limit(150)
      );
      const snap = await getDocs(q);
      list = snap.docs.map(d => ({ id: d.id, ...d.data() } as EmergencyRequest));
    } catch (e) {
      list = getLocalEmergencies();
    }
  } else {
    list = getLocalEmergencies();
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter(r => r.status === filters.status);
  }

  if (filters?.state && filters.state !== 'all') {
    list = list.filter(r => r.state.toLowerCase() === filters.state?.toLowerCase());
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(r => 
      r.requestId.toLowerCase().includes(q) ||
      r.vehicleNumber.toLowerCase().includes(q) ||
      r.driverPhone.includes(q) ||
      (r.driverName && r.driverName.toLowerCase().includes(q)) ||
      (r.highway && r.highway.toLowerCase().includes(q)) ||
      r.city.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
