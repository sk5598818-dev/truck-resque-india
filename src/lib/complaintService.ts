import { Complaint } from './types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { logAuditEvent } from './auditService';

const LOCAL_STORAGE_COMPLAINTS = 'truck_rescue_complaints_v1';

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'comp_init_1',
    complaintId: 'CMP-78214',
    userUid: 'driver_baljit_94160',
    userName: 'Baljit Singh Dhillon',
    userPhone: '+91 94160 12345',
    garageId: 'panipat-express-crane-service',
    garageName: 'Panipat Express Heavy Towing & Crane',
    emergencyRequestId: 'sos_mock_1',
    complaintType: 'overcharging',
    description: 'Quoted ₹4,500 for towing on call, but upon reaching highway site demanded ₹8,000 citing night charges.',
    evidencePhotos: [],
    status: 'under_review',
    adminNotes: 'Contacted garage owner Vikram Sharma for rate card clarification.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  }
];

function getLocalComplaints(): Complaint[] {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COMPLAINTS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_COMPLAINTS;
  }
}

function saveLocalComplaints(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_COMPLAINTS, JSON.stringify(complaints));
    window.dispatchEvent(new Event('truck_rescue_complaints_updated'));
  } catch (e) {}
}

export function generateComplaintId(): string {
  return `CMP-${Math.floor(10000 + Math.random() * 90000)}`;
}

/**
 * File a customer complaint
 */
export async function createComplaint(
  data: Omit<Complaint, 'id' | 'complaintId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<Complaint> {
  if (!data.description || data.description.trim().length < 10) {
    throw new Error('Please provide at least 10 characters detailing your complaint.');
  }

  const id = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const complaintId = generateComplaintId();
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    ...data,
    id,
    complaintId,
    status: 'pending',
    evidencePhotos: Array.isArray(data.evidencePhotos) ? data.evidencePhotos.slice(0, 5) : [],
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'complaints', id), newComplaint);
    } catch (e) {
      console.warn('Firestore complaint save failed, saving locally:', e);
    }
  }

  const list = getLocalComplaints();
  list.unshift(newComplaint);
  saveLocalComplaints(list);

  return newComplaint;
}

/**
 * Fetch all complaints for Admin Panel
 */
export async function fetchComplaints(filters?: {
  status?: string;
  garageId?: string;
  userUid?: string;
  search?: string;
}): Promise<Complaint[]> {
  let list: Complaint[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'complaints'),
        limit(150)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Complaint));
      }
    } catch (e) {
      list = getLocalComplaints();
    }
  } else {
    list = getLocalComplaints();
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter(c => c.status === filters.status);
  }

  if (filters?.garageId) {
    list = list.filter(c => c.garageId === filters.garageId);
  }

  if (filters?.userUid) {
    list = list.filter(c => c.userUid === filters.userUid);
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(c => 
      c.complaintId.toLowerCase().includes(q) ||
      (c.garageName && c.garageName.toLowerCase().includes(q)) ||
      c.userPhone.includes(q) ||
      (c.userName && c.userName.toLowerCase().includes(q)) ||
      c.description.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Resolve or update complaint status (Admin only)
 */
export async function resolveComplaint(
  complaintId: string,
  statusOrParams: 'under_review' | 'resolved' | 'rejected' | {
    status: 'under_review' | 'resolved' | 'rejected';
    adminUid: string;
    resolution?: string;
    adminNotes?: string;
  },
  adminUid?: string,
  resolution?: string,
  adminNotes?: string
): Promise<Complaint> {
  let newStatus: 'under_review' | 'resolved' | 'rejected';
  let effectiveAdminUid: string;
  let effectiveResolution: string;
  let effectiveNotes: string | undefined;

  if (typeof statusOrParams === 'object') {
    newStatus = statusOrParams.status;
    effectiveAdminUid = statusOrParams.adminUid;
    effectiveResolution = statusOrParams.resolution || '';
    effectiveNotes = statusOrParams.adminNotes;
  } else {
    newStatus = statusOrParams;
    effectiveAdminUid = adminUid || 'admin_ops';
    effectiveResolution = resolution || '';
    effectiveNotes = adminNotes;
  }

  const local = getLocalComplaints();
  const index = local.findIndex(c => c.id === complaintId || c.complaintId === complaintId);
  if (index === -1) throw new Error('Complaint not found.');

  const current = local[index];
  const previousStatus = current.status;
  const now = new Date().toISOString();

  const patch = {
    status: newStatus,
    resolution: effectiveResolution,
    adminNotes: effectiveNotes || current.adminNotes || '',
    resolvedBy: effectiveAdminUid,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'complaints', current.id), patch);
    } catch (e) {}
  }

  local[index] = { ...current, ...patch };
  saveLocalComplaints(local);

  // Log audit event
  await logAuditEvent({
    adminUid: effectiveAdminUid,
    action: 'COMPLAINT_RESOLUTION',
    targetDocument: `complaints/${current.id}`,
    reason: effectiveResolution,
    previousStatus,
    newStatus,
    details: {
      complaintId: current.complaintId,
      garageId: current.garageId,
      complaintType: current.complaintType
    }
  });

  return local[index];
}
