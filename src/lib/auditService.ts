import { AuditLog } from './types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  limit, 
  orderBy 
} from 'firebase/firestore';

const LOCAL_STORAGE_AUDIT = 'truck_rescue_audit_logs_v1';

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_init_1',
    adminUid: 'admin_national_ops',
    adminName: 'National Ops Officer',
    adminEmail: 'ops@truckrescueindia.in',
    action: 'GARAGE_APPROVAL',
    targetDocument: 'mechanic_garages/shree-ganesh-heavy-truck-garage-mumbai',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    reason: 'Verified workshop trade license, physical GPS inspection, and BS6 diagnostic equipment.',
    previousStatus: 'pending',
    newStatus: 'verified',
    details: { state: 'Maharashtra', city: 'Mumbai / Bhiwandi' }
  },
  {
    id: 'audit_init_2',
    adminUid: 'admin_national_ops',
    adminName: 'National Ops Officer',
    adminEmail: 'ops@truckrescueindia.in',
    action: 'GARAGE_APPROVAL',
    targetDocument: 'mechanic_garages/karnal-highway-heavy-truck-hub',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    reason: 'Verified NH 44 crane recovery setup and Cummins diagnostic scanner certification.',
    previousStatus: 'pending',
    newStatus: 'verified',
    details: { state: 'Haryana', city: 'Karnal' }
  }
];

function getLocalAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUDIT);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_AUDIT, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

function saveLocalAuditLogs(logs: AuditLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_AUDIT, JSON.stringify(logs));
  } catch (e) {}
}

/**
 * Log an immutable administrative action
 */
export async function logAuditEvent(
  data: Omit<AuditLog, 'id' | 'timestamp'>
): Promise<AuditLog> {
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  const auditEntry: AuditLog = {
    ...data,
    id,
    timestamp
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'audit_logs', id), auditEntry);
    } catch (e) {
      console.warn('Firestore audit log save failed, persisting locally:', e);
    }
  }

  const logs = getLocalAuditLogs();
  logs.unshift(auditEntry);
  saveLocalAuditLogs(logs);

  return auditEntry;
}

/**
 * Fetch audit logs for Admin Audit Console
 */
export async function fetchAuditLogs(limitCount = 100): Promise<AuditLog[]> {
  let list: AuditLog[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'audit_logs'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AuditLog));
      }
    } catch (e) {
      list = getLocalAuditLogs();
    }
  } else {
    list = getLocalAuditLogs();
  }

  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
