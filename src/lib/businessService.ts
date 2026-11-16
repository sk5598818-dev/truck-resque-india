import { 
  SubscriptionPlan, 
  Subscription, 
  PaymentOrder, 
  PaymentTransaction, 
  Advertisement 
} from './types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  limit, 
  orderBy 
} from 'firebase/firestore';
import { DEFAULT_SUBSCRIPTION_PLANS } from './constants';
import { updateGarage } from './garageService';
import { logAuditEvent } from './auditService';

const STORAGE_KEY_PLANS = 'truck_rescue_subscription_plans_v1';
const STORAGE_KEY_SUBSCRIPTIONS = 'truck_rescue_subscriptions_v1';
const STORAGE_KEY_ORDERS = 'truck_rescue_payment_orders_v1';
const STORAGE_KEY_TRANSACTIONS = 'truck_rescue_transactions_v1';
const STORAGE_KEY_ADS = 'truck_rescue_advertisements_v1';

// Initial realistic advertisement seed data
const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad_cummins_parts',
    adId: 'AD-101',
    title: 'Genuine Cummins ISBe & Leyland BS6 Engine Parts',
    description: 'Direct highway delivery for heavy commercial fleet components across Western Corridor.',
    bannerUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: 'https://truckrescueindia.in/services/spare_parts',
    placement: 'homepage_banner',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    status: 'active',
    impressionsCount: 1420,
    clicksCount: 89,
    advertiserName: 'Bharat Fleet Spares Pvt Ltd',
    advertiserContact: '+91 98201 99887',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  },
  {
    id: 'ad_valvoline_adblue',
    adId: 'AD-102',
    title: 'ISO 22241 Certified AdBlue (DEF) Highway Bulk Supply',
    description: 'Guaranteed 32.5% urea purity to prevent Limp Mode and NOx sensor fouling.',
    bannerUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: 'https://truckrescueindia.in/services/dpf_scr_urea',
    placement: 'category_page',
    category: 'dpf_scr_urea',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
    status: 'active',
    impressionsCount: 870,
    clicksCount: 54,
    advertiserName: 'Apex DEF Solutions India',
    advertiserContact: '+91 94160 88776',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

// Initial mock transactions
const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_init_1',
    transactionId: 'TXN-984210',
    orderId: 'ORD-77124',
    userUid: 'owner_rameshwar_98200',
    garageId: 'shree-ganesh-heavy-truck-garage-mumbai',
    garageName: 'Shree Ganesh Heavy Truck Garage & Recovery',
    planId: 'featured',
    amount: 1499,
    currency: 'INR',
    gateway: 'razorpay',
    gatewayPaymentId: 'pay_Nz82Kls99120',
    gatewayOrderId: 'order_Nz82Kls99120_ord',
    paymentStatus: 'success',
    invoiceNumber: 'INV-2026-00108',
    paymentMethod: 'UPI / NetBanking',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  }
];

// ==================== 1. SUBSCRIPTION PLANS ====================

export function getLocalPlans(): SubscriptionPlan[] {
  if (typeof window === 'undefined') return DEFAULT_SUBSCRIPTION_PLANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(DEFAULT_SUBSCRIPTION_PLANS));
      return DEFAULT_SUBSCRIPTION_PLANS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SUBSCRIPTION_PLANS;
  }
}

export function saveLocalPlans(plans: SubscriptionPlan[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plans));
  } catch (e) {}
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'subscription_plans'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionPlan));
      }
    } catch (e) {}
  }
  return getLocalPlans();
}

export async function updateSubscriptionPlan(
  planId: string, 
  updates: Partial<SubscriptionPlan>,
  adminUid: string
): Promise<SubscriptionPlan> {
  const plans = getLocalPlans();
  const idx = plans.findIndex(p => p.id === planId);
  if (idx === -1) throw new Error('Plan not found.');

  const updated = { ...plans[idx], ...updates };
  plans[idx] = updated;
  saveLocalPlans(plans);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'subscription_plans', planId), updates);
    } catch (e) {}
  }

  await logAuditEvent({
    adminUid,
    action: 'SETTINGS_CHANGE',
    targetDocument: `subscription_plans/${planId}`,
    reason: `Updated plan pricing or benefits for ${plans[idx].name}`,
    details: updates
  });

  return updated;
}

// ==================== 2. GARAGE SUBSCRIPTIONS ====================

function getLocalSubscriptions(): Subscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalSubscriptions(subs: Subscription[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(subs));
  } catch (e) {}
}

export async function fetchSubscriptionByGarage(garageId: string): Promise<Subscription | null> {
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('garageId', '==', garageId),
        where('status', '==', 'active'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as Subscription;
      }
    } catch (e) {}
  }

  const list = getLocalSubscriptions();
  return list.find(s => s.garageId === garageId && s.status === 'active') || null;
}

export async function fetchAllSubscriptions(): Promise<Subscription[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'subscriptions'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Subscription));
      }
    } catch (e) {}
  }
  return getLocalSubscriptions();
}

/**
 * Activate or Renew a garage subscription after successful verified payment
 */
export async function activateSubscription(params: {
  garageId: string;
  garageName: string;
  ownerUid: string;
  ownerPhone: string;
  planId: 'free' | 'featured' | 'premium';
  amount: number;
  paymentReference?: string;
  paymentOrderId?: string;
}): Promise<Subscription> {
  const { garageId, garageName, ownerUid, ownerPhone, planId, amount, paymentReference, paymentOrderId } = params;
  
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const subscriptionId = `SUB-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const startDate = now.toISOString();

  // Duration in days (30 days for paid, 365 for free)
  const durationDays = planId === 'free' ? 365 : 30;
  const end = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
  const endDate = end.toISOString();

  const newSub: Subscription = {
    id,
    subscriptionId,
    garageId,
    garageName,
    ownerUid,
    ownerPhone,
    planId,
    status: 'active',
    startDate,
    endDate,
    renewalDate: endDate,
    amount,
    currency: 'INR',
    paymentReference: paymentReference || `REF-${Date.now()}`,
    paymentOrderId,
    createdAt: startDate,
    updatedAt: startDate
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'subscriptions', id), newSub);
    } catch (e) {}
  }

  const list = getLocalSubscriptions();
  // Deactivate any existing active subscriptions for this garage
  list.forEach(s => {
    if (s.garageId === garageId && s.status === 'active') {
      s.status = 'expired';
    }
  });
  list.unshift(newSub);
  saveLocalSubscriptions(list);

  // Update garage document metadata
  await updateGarage(garageId, {
    subscriptionTier: planId,
    subscriptionExpiresAt: endDate,
    isFeatured: planId === 'featured' || planId === 'premium',
    isSponsored: planId === 'premium'
  });

  return newSub;
}

// ==================== 3. PAYMENTS & TRANSACTIONS ====================

function getLocalTransactions(): PaymentTransaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return raw ? JSON.parse(raw) : INITIAL_TRANSACTIONS;
  } catch (e) {
    return INITIAL_TRANSACTIONS;
  }
}

function saveLocalTransactions(txs: PaymentTransaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(txs));
  } catch (e) {}
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(10000 + Math.random() * 90000);
  return `INV-${year}-${seq}`;
}

export async function recordPaymentTransaction(
  data: Omit<PaymentTransaction, 'id' | 'transactionId' | 'invoiceNumber' | 'createdAt'>
): Promise<PaymentTransaction> {
  const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceNumber = generateInvoiceNumber();
  const createdAt = new Date().toISOString();

  const newTx: PaymentTransaction = {
    ...data,
    id,
    transactionId,
    invoiceNumber,
    createdAt
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'payment_transactions', id), newTx);
    } catch (e) {}
  }

  const list = getLocalTransactions();
  list.unshift(newTx);
  saveLocalTransactions(list);

  return newTx;
}

export async function fetchTransactions(filters?: {
  garageId?: string;
  status?: string;
}): Promise<PaymentTransaction[]> {
  let list = getLocalTransactions();

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'payment_transactions'));
      if (!snap.empty) {
        list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentTransaction));
      }
    } catch (e) {}
  }

  if (filters?.garageId) {
    list = list.filter(t => t.garageId === filters.garageId);
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter(t => t.paymentStatus === filters.status);
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==================== 4. ADVERTISEMENT SYSTEM ====================

function getLocalAds(): Advertisement[] {
  if (typeof window === 'undefined') return INITIAL_ADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADS);
    return raw ? JSON.parse(raw) : INITIAL_ADS;
  } catch (e) {
    return INITIAL_ADS;
  }
}

function saveLocalAds(ads: Advertisement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(ads));
    window.dispatchEvent(new Event('truck_rescue_ads_updated'));
  } catch (e) {}
}

export async function fetchActiveAdvertisements(
  placement?: string, 
  category?: string
): Promise<Advertisement[]> {
  let list = getLocalAds().filter(ad => ad.status === 'active');
  const now = new Date().toISOString();

  // Filter unexpired ads
  list = list.filter(ad => ad.startDate <= now && ad.endDate >= now);

  if (placement) {
    list = list.filter(ad => ad.placement === placement);
  }

  if (category) {
    list = list.filter(ad => !ad.category || ad.category === category);
  }

  return list;
}

export async function fetchAllAdvertisements(): Promise<Advertisement[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'advertisements'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement));
      }
    } catch (e) {}
  }
  return getLocalAds();
}

export async function createAdvertisement(
  data: Omit<Advertisement, 'id' | 'adId' | 'impressionsCount' | 'clicksCount' | 'createdAt' | 'updatedAt'>,
  adminUid: string
): Promise<Advertisement> {
  const id = `ad_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const adId = `AD-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newAd: Advertisement = {
    ...data,
    id,
    adId,
    impressionsCount: 0,
    clicksCount: 0,
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'advertisements', id), newAd);
    } catch (e) {}
  }

  const list = getLocalAds();
  list.unshift(newAd);
  saveLocalAds(list);

  await logAuditEvent({
    adminUid,
    action: 'SETTINGS_CHANGE',
    targetDocument: `advertisements/${id}`,
    reason: `Created new advertisement campaign: ${newAd.title}`
  });

  return newAd;
}

export async function updateAdvertisement(
  adId: string,
  updates: Partial<Advertisement>,
  adminUid: string
): Promise<Advertisement> {
  const list = getLocalAds();
  const idx = list.findIndex(a => a.id === adId || a.adId === adId);
  if (idx === -1) throw new Error('Advertisement not found.');

  const now = new Date().toISOString();
  const updated = { ...list[idx], ...updates, updatedAt: now };
  list[idx] = updated;
  saveLocalAds(list);

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'advertisements', list[idx].id), { ...updates, updatedAt: now });
    } catch (e) {}
  }

  await logAuditEvent({
    adminUid,
    action: 'SETTINGS_CHANGE',
    targetDocument: `advertisements/${list[idx].id}`,
    reason: `Updated advertisement ${list[idx].adId} (${updates.status ? 'status: ' + updates.status : 'details'})`
  });

  return updated;
}

/**
 * Record an ad view or click event safely
 */
export function recordAdEvent(adId: string, eventType: 'impression' | 'click'): void {
  const list = getLocalAds();
  const idx = list.findIndex(a => a.id === adId || a.adId === adId);
  if (idx === -1) return;

  if (eventType === 'impression') {
    list[idx].impressionsCount += 1;
  } else if (eventType === 'click') {
    list[idx].clicksCount += 1;
  }
  saveLocalAds(list);
}

// ==================== 5. REVENUE & BUSINESS ANALYTICS ====================

export async function calculateRevenueStats() {
  const transactions = await fetchTransactions({ status: 'success' });
  const subscriptions = await fetchAllSubscriptions();
  const ads = await fetchAllAdvertisements();

  let totalRevenueInr = 0;
  let subscriptionRevenueInr = 0;
  let adRevenueInr = 0;
  let monthlyRevenueInr = 0;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  transactions.forEach(t => {
    totalRevenueInr += t.amount;
    subscriptionRevenueInr += t.amount;
    if (new Date(t.createdAt).getTime() > thirtyDaysAgo) {
      monthlyRevenueInr += t.amount;
    }
  });

  // Estimate ad revenue based on active advertiser campaigns
  ads.forEach(ad => {
    if (ad.status === 'active') {
      const adCost = 2500; // Flat campaign fee
      totalRevenueInr += adCost;
      adRevenueInr += adCost;
      monthlyRevenueInr += adCost;
    }
  });

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' && s.planId !== 'free').length;

  return {
    totalRevenueInr,
    monthlyRevenueInr,
    subscriptionRevenueInr,
    adRevenueInr,
    activeSubscriptions,
    totalTransactions: transactions.length,
    activeAdsCount: ads.filter(a => a.status === 'active').length
  };
}
