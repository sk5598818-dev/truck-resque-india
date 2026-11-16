import { Review, Garage } from './types';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  limit,
  orderBy
} from 'firebase/firestore';
import { updateGarage, fetchGarageById } from './garageService';
import { logAuditEvent } from './auditService';

const LOCAL_STORAGE_REVIEWS = 'truck_rescue_reviews_v2';

// Realistic initial seed reviews for verified highway garages
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    garageId: 'shree-ganesh-heavy-truck-garage-mumbai',
    driverUid: 'driver_rajinder_98765',
    authorName: 'Rajinder Singh (Fleet Owner, 12 Trucks)',
    driverPhone: '+91 98765 43210',
    rating: 5,
    comment: 'Exceptional AdBlue urea diagnostic expert! Our BS6 Tata Signa was stuck in 20 km/h limp mode on NH 48 near Manor. Rameshwar Patil arrived with diagnostic laptop in 25 mins, recalibrated the DPF pressure sensor and we were back on the road.',
    vehicleModel: 'Tata Signa 4825.TK',
    emergencyRequestId: 'sos_mock_2',
    isVerifiedService: true,
    photos: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=60'
    ],
    status: 'active',
    ownerReply: {
      text: 'Dhanyawad Rajinder ji! Glad our mobile rescue team could get your Signa back on track on NH 48. Highway safety is our priority.',
      repliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      ownerName: 'Rameshwar Patil'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'rev_2',
    garageId: 'shree-ganesh-heavy-truck-garage-mumbai',
    driverUid: 'driver_murugan_91234',
    authorName: 'Murugan Selvam',
    driverPhone: '+91 91234 56789',
    rating: 5,
    comment: '24x7 genuine roadside service. Replaced blown high-pressure radiator hose at 2 AM on Bhiwandi bypass. Very fair pricing and transparent bill.',
    vehicleModel: 'Ashok Leyland AVTR 5525',
    isVerifiedService: true,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'rev_3',
    garageId: 'karnal-highway-heavy-truck-hub',
    driverUid: 'driver_baljit_94160',
    authorName: 'Baljit Singh Dhillon',
    driverPhone: '+91 94160 12345',
    rating: 4,
    comment: 'Very skilled ECM flashing technicians. Solved Cummins ISBe injector coding error in 40 minutes. Good workshop with parking space for 16-wheelers.',
    vehicleModel: 'BharatBenz 2823R',
    isVerifiedService: false,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

function getLocalReviews(): Review[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

function saveLocalReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('truck_rescue_reviews_updated'));
  } catch (e) {
    console.error('Failed to save reviews locally:', e);
  }
}

/**
 * Fetch active reviews for a garage
 */
export async function fetchReviewsForGarage(
  garageId: string, 
  includeHidden = false
): Promise<Review[]> {
  let list: Review[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('garageId', '==', garageId),
        limit(100)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
      }
    } catch (e) {
      console.warn('Firestore fetch reviews failed, using local store:', e);
      list = getLocalReviews().filter(r => r.garageId === garageId);
    }
  } else {
    list = getLocalReviews().filter(r => r.garageId === garageId);
  }

  // Filter hidden unless requested by moderation console
  if (!includeHidden) {
    list = list.filter(r => r.status !== 'hidden');
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Recalculate garage rating, distribution, and review count
 */
export async function recalculateGarageRating(garageId: string): Promise<void> {
  const reviews = await fetchReviewsForGarage(garageId, false);
  const total = reviews.length;
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    sum += r.rating;
  });

  const avg = total > 0 ? Math.round((sum / total) * 10) / 10 : 5.0;

  try {
    await updateGarage(garageId, {
      rating: avg,
      reviewCount: total,
      ratingDistribution: distribution
    });
  } catch (e) {
    console.warn('Failed to update garage rating aggregates:', e);
  }
}

/**
 * Submit a customer review with validation and duplicate prevention
 */
export async function submitReview(
  data: Omit<Review, 'id' | 'createdAt' | 'status'>
): Promise<Review> {
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5 stars.');
  }

  if (!data.comment || data.comment.trim().length < 5) {
    throw new Error('Please write at least 5 characters sharing your service experience.');
  }

  const existingReviews = await fetchReviewsForGarage(data.garageId, true);

  // Duplicate Check 1: Prevent duplicate review for the same completed emergency request
  if (data.emergencyRequestId) {
    const duplicateSos = existingReviews.find(r => r.emergencyRequestId === data.emergencyRequestId);
    if (duplicateSos) {
      throw new Error('A verified review has already been submitted for this emergency breakdown service.');
    }
  }

  // Duplicate Check 2: Prevent spam from same driver within 24 hours
  if (data.driverUid || data.driverPhone) {
    const recent = existingReviews.find(r => {
      const matchUser = (data.driverUid && r.driverUid === data.driverUid) || 
                        (data.driverPhone && r.driverPhone === data.driverPhone);
      if (!matchUser) return false;
      const hoursDiff = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });

    if (recent) {
      throw new Error('You have already submitted a review for this garage recently. You can edit your existing review.');
    }
  }

  const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newReview: Review = {
    ...data,
    id,
    comment: data.comment.trim(),
    photos: Array.isArray(data.photos) ? data.photos.slice(0, 5) : [],
    status: 'active',
    createdAt: now,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'reviews', id), newReview);
    } catch (e) {
      console.warn('Firestore review set failed, saving locally:', e);
    }
  }

  const local = getLocalReviews();
  local.unshift(newReview);
  saveLocalReviews(local);

  // Update garage rating aggregate
  await recalculateGarageRating(data.garageId);

  return newReview;
}

/**
 * Edit an existing review (by review author)
 */
export async function editReview(
  reviewId: string,
  driverUidOrPhone: string,
  updates: Partial<Pick<Review, 'rating' | 'comment' | 'photos' | 'vehicleModel'>>
): Promise<Review> {
  const local = getLocalReviews();
  const index = local.findIndex(r => r.id === reviewId);
  if (index === -1) {
    throw new Error('Review not found.');
  }

  const review = local[index];
  if (review.driverUid !== driverUidOrPhone && review.driverPhone !== driverUidOrPhone) {
    throw new Error('Unauthorized: You can only edit your own reviews.');
  }

  const now = new Date().toISOString();
  const updated: Review = {
    ...review,
    ...updates,
    updatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Firestore review update failed:', e);
    }
  }

  local[index] = updated;
  saveLocalReviews(local);

  await recalculateGarageRating(review.garageId);
  return updated;
}

/**
 * Delete a review (by author or admin)
 */
export async function deleteReview(
  reviewId: string,
  driverUidOrPhone: string,
  isAdmin = false
): Promise<void> {
  const local = getLocalReviews();
  const index = local.findIndex(r => r.id === reviewId);
  if (index === -1) {
    throw new Error('Review not found.');
  }

  const review = local[index];
  if (!isAdmin && review.driverUid !== driverUidOrPhone && review.driverPhone !== driverUidOrPhone) {
    throw new Error('Unauthorized: You can only delete your own reviews.');
  }

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (e) {
      console.warn('Firestore review delete failed:', e);
    }
  }

  local.splice(index, 1);
  saveLocalReviews(local);

  await recalculateGarageRating(review.garageId);
}

/**
 * Garage Owner replies to a customer review
 */
export async function replyToReview(
  reviewId: string,
  garageId: string,
  ownerName: string,
  replyText: string
): Promise<Review> {
  if (!replyText || !replyText.trim()) {
    throw new Error('Reply text cannot be empty.');
  }

  const local = getLocalReviews();
  const index = local.findIndex(r => r.id === reviewId);
  if (index === -1) throw new Error('Review not found.');

  const review = local[index];
  if (review.garageId !== garageId) {
    throw new Error('Unauthorized: You can only reply to reviews for your own garage.');
  }

  const reply = {
    text: replyText.trim(),
    repliedAt: new Date().toISOString(),
    ownerName
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { ownerReply: reply });
    } catch (e) {}
  }

  local[index] = { ...review, ownerReply: reply };
  saveLocalReviews(local);

  return local[index];
}

/**
 * Report an abusive review for admin moderation
 */
export async function reportReview(
  reviewId: string,
  reportedBy: string,
  reason: string
): Promise<void> {
  const local = getLocalReviews();
  const index = local.findIndex(r => r.id === reviewId);
  if (index === -1) throw new Error('Review not found.');

  const now = new Date().toISOString();
  const patch = {
    status: 'reported' as const,
    reportReason: reason,
    reportedBy,
    reportedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), patch);
    } catch (e) {}
  }

  local[index] = { ...local[index], ...patch };
  saveLocalReviews(local);
}

/**
 * Admin Moderation: Hide policy-violating review or restore legitimate review
 */
export async function moderateReview(
  reviewId: string,
  adminUid: string,
  action: 'hide' | 'restore',
  reason: string
): Promise<Review> {
  const local = getLocalReviews();
  const index = local.findIndex(r => r.id === reviewId);
  if (index === -1) throw new Error('Review not found.');

  const review = local[index];
  const previousStatus = review.status || 'active';
  const newStatus = action === 'hide' ? 'hidden' : 'active';
  const now = new Date().toISOString();

  const patch = {
    status: newStatus as 'active' | 'hidden',
    moderatedBy: adminUid,
    moderationReason: reason,
    moderatedAt: now
  };

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), patch);
    } catch (e) {}
  }

  local[index] = { ...review, ...patch };
  saveLocalReviews(local);

  // Recalculate garage rating (hidden reviews excluded from rating)
  await recalculateGarageRating(review.garageId);

  // Log immutable audit event
  await logAuditEvent({
    adminUid,
    action: action === 'hide' ? 'REVIEW_HIDDEN' : 'REVIEW_RESTORED',
    targetDocument: `reviews/${reviewId}`,
    reason,
    previousStatus,
    newStatus,
    details: {
      garageId: review.garageId,
      rating: review.rating,
      authorName: review.authorName
    }
  });

  return local[index];
}

/**
 * Fetch all reported reviews for Admin Moderation Console
 */
export async function fetchReportedReviews(): Promise<Review[]> {
  let list: Review[] = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', 'in', ['reported', 'hidden']),
        limit(100)
      );
      const snap = await getDocs(q);
      list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
    } catch (e) {
      list = getLocalReviews().filter(r => r.status === 'reported' || r.status === 'hidden');
    }
  } else {
    list = getLocalReviews().filter(r => r.status === 'reported' || r.status === 'hidden');
  }

  return list.sort((a, b) => new Date(b.reportedAt || b.createdAt).getTime() - new Date(a.reportedAt || a.createdAt).getTime());
}
