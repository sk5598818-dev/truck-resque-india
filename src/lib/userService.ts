import { UserAccount } from './types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { logAuditEvent } from './auditService';

const LOCAL_STORAGE_USERS = 'truck_rescue_user_accounts_v1';

const INITIAL_USERS: UserAccount[] = [
  {
    uid: 'admin_national_ops',
    phone: '+91 99999 88888',
    name: 'National Ops Officer',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    lastLoginAt: new Date().toISOString()
  },
  {
    uid: 'owner_rameshwar_98200',
    phone: '+91 98200 11223',
    name: 'Rameshwar Patil (Garage Owner)',
    role: 'garage_owner',
    status: 'active',
    garageId: 'shree-ganesh-heavy-truck-garage-mumbai',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    uid: 'driver_baljit_94160',
    phone: '+91 94160 12345',
    name: 'Baljit Singh Dhillon',
    role: 'driver',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    uid: 'driver_suresh_98765',
    phone: '+91 98765 43210',
    name: 'Suresh Kumar Yadav',
    role: 'driver',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    uid: 'owner_gurpreet_98150',
    phone: '+91 98150 99887',
    name: 'Gurpreet Singh (Garage Owner)',
    role: 'garage_owner',
    status: 'active',
    garageId: 'karnal-highway-heavy-truck-hub',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

function getLocalUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveLocalUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS, JSON.stringify(users));
  } catch (e) {}
}

export async function fetchUsers(): Promise<UserAccount[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserAccount));
      }
    } catch (e) {}
  }
  return getLocalUsers();
}

export async function getUserAccount(uid: string): Promise<UserAccount | null> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() } as UserAccount;
      }
    } catch (e) {}
  }
  const users = getLocalUsers();
  return users.find(u => u.uid === uid) || null;
}

export async function updateUserStatus(
  uid: string,
  status: 'active' | 'suspended',
  reason: string,
  adminUid: string
): Promise<UserAccount> {
  const users = getLocalUsers();
  const idx = users.findIndex(u => u.uid === uid);
  if (idx === -1) {
    throw new Error('User not found');
  }

  const prevStatus = users[idx].status;
  users[idx].status = status;
  users[idx].suspensionReason = status === 'suspended' ? reason : undefined;
  saveLocalUsers(users);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        status,
        suspensionReason: status === 'suspended' ? reason : null
      });
    } catch (e) {}
  }

  await logAuditEvent({
    adminUid,
    action: status === 'suspended' ? 'USER_SUSPENSION' : 'USER_REACTIVATION',
    targetDocument: `users/${uid}`,
    reason,
    previousStatus: prevStatus,
    newStatus: status,
    details: { userPhone: users[idx].phone, role: users[idx].role }
  });

  return users[idx];
}
