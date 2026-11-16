export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type ProviderCategory = 
  | 'workshop' 
  | 'mobile_technician' 
  | 'individual_mechanic' 
  | 'towing_fleet' 
  | 'spare_parts_dealer';

export type RegistrationSource = 
  | 'direct' 
  | 'referral' 
  | 'field_agent' 
  | 'whatsapp_invite' 
  | 'organic';

export type GarageType = 
  | 'workshop' 
  | 'mobile_only' 
  | 'hybrid' 
  | 'dealership_authorized' 
  | 'towing_recovery' 
  | 'spare_parts_shop';

export type EmergencyStatus = 
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'mechanic_on_way'
  | 'reached_location'
  | 'work_in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type EmergencyPriority = 'normal' | 'urgent' | 'critical';

export type VehicleFuelType = 'BS4' | 'BS6' | 'CNG' | 'LNG' | 'Other';

export interface StatusHistoryItem {
  status: EmergencyStatus;
  timestamp: string;
  updatedBy: string;
  role?: 'driver' | 'mechanic' | 'admin' | 'system';
  note?: string;
}

export interface EmergencyRequest {
  id: string;
  requestId: string; // Human readable e.g. SOS-83921
  driverUid?: string;
  driverPhone: string;
  driverName?: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleType: VehicleFuelType;
  breakdownCategory: string;
  description?: string;
  photos: string[]; // up to 5 photos
  latitude: number;
  longitude: number;
  geohash: string;
  address: string;
  highway?: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  requestedService: string; // 'roadside_van' | 'towing' | 'diagnostic_expert' | 'workshop'
  priority: EmergencyPriority;
  status: EmergencyStatus;
  statusHistory: StatusHistoryItem[];
  assignedGarageId?: string;
  assignedGarageName?: string;
  assignedGaragePhone?: string;
  assignedMechanicName?: string;
  assignedGarageDistanceKm?: number;
  cancellationReason?: string;
  cancelledBy?: 'driver' | 'mechanic' | 'admin' | 'system';
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  searchRadiusKm?: number;
}

export interface Garage {
  id: string;
  uid: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  garageName: string;
  garageType: GarageType;
  description: string;
  services: string[];
  brands: string[];
  equipment: string[];
  address: string;
  state: string;
  district: string;
  city: string;
  area: string;
  highway?: string;
  landmark: string;
  pincode: string;
  latitude: number;
  longitude: number;
  geohash: string;
  serviceRadiusKm: number;
  mobileService: boolean;
  twentyFourHours: boolean;
  isOpen: boolean;
  photos: string[];
  logoUrl?: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  reportedCount?: number;
  rating: number;
  reviewCount: number;
  ratingDistribution?: { 1: number; 2: number; 3: number; 4: number; 5: number };
  isFeatured?: boolean;
  isSponsored?: boolean;
  subscriptionTier?: 'free' | 'featured' | 'premium';
  subscriptionExpiresAt?: string;
  profileViews?: number;
  callClicks?: number;
  whatsappClicks?: number;
  normalCharges?: string;
  emergencyCharges?: string;
  providerCategory?: ProviderCategory;
  experienceYears?: number;
  referralCode?: string; // e.g. TRI-MH-7892
  referredBy?: string; // Referral code of referring mechanic/garage
  registrationSource?: RegistrationSource;
  workingHours?: string;
  isRoadsideVanAvailable?: boolean;
  scannerDiagnosticAvailable?: boolean;
  bs6ExpertAvailable?: boolean;
  truckElectricianAvailable?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number; // Calculated dynamically on client/api based on user coordinates
}

export interface ReferralRecord {
  id: string;
  referrerCode: string;
  referrerGarageId: string;
  referrerGarageName: string;
  referrerPhone: string;
  referredGarageId: string;
  referredGarageName: string;
  referredPhone: string;
  status: 'pending' | 'verified' | 'rewarded';
  rewardType?: 'featured_badge_30d' | 'priority_listing' | 'cashback';
  rewardGranted?: boolean;
  rewardGrantedAt?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface GrowthMetrics {
  totalGarages: number;
  verifiedGarages: number;
  pendingGarages: number;
  suspendedGarages: number;
  freeGarages: number;
  premiumGarages: number;
  stateDistribution: { [state: string]: number };
  categoryDistribution: { [category: string]: number };
  totalReferrals: number;
  successfulReferrals: number;
  topReferrers: {
    garageId: string;
    garageName: string;
    referralCode: string;
    count: number;
  }[];
  generatedAt: string;
}

export interface Review {
  id: string;
  garageId: string;
  driverUid?: string;
  authorName: string;
  driverPhone?: string;
  rating: number;
  comment: string;
  vehicleModel?: string;
  emergencyRequestId?: string;
  isVerifiedService?: boolean;
  photos?: string[];
  status?: 'active' | 'reported' | 'hidden';
  reportReason?: string;
  reportedAt?: string;
  reportedBy?: string;
  moderatedBy?: string;
  moderationReason?: string;
  moderatedAt?: string;
  ownerReply?: {
    text: string;
    repliedAt: string;
    ownerName?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  userUid: string;
  userName?: string;
  userPhone: string;
  garageId?: string;
  garageName?: string;
  emergencyRequestId?: string;
  complaintType: 'overcharging' | 'service_not_provided' | 'rude_behavior' | 'delayed_response' | 'damage_caused' | 'fake_listing' | 'other';
  description: string;
  evidencePhotos: string[];
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  adminNotes?: string;
  resolvedBy?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminUid: string;
  adminEmail?: string;
  adminName?: string;
  action: string;
  targetDocument: string;
  timestamp: string;
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
  details?: Record<string, any>;
}

export interface SubscriptionPlan {
  id: 'free' | 'featured' | 'premium';
  name: string;
  priceInr: number;
  durationDays: number;
  badge: string;
  features: string[];
  maxPhotos: number;
  priorityListing: boolean;
  analyticsEnabled: boolean;
  isPopular?: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  subscriptionId: string;
  garageId: string;
  garageName: string;
  ownerUid: string;
  ownerPhone: string;
  planId: 'free' | 'featured' | 'premium';
  status: 'active' | 'expired' | 'cancelled' | 'pending_payment';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  amount: number;
  currency: 'INR';
  paymentReference?: string;
  paymentOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentOrder {
  id: string;
  orderId: string;
  userUid: string;
  garageId: string;
  planId: string;
  amount: number;
  amountPaise: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  receipt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  orderId: string;
  userUid: string;
  garageId: string;
  garageName: string;
  planId: string;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'manual';
  gatewayPaymentId: string;
  gatewayOrderId: string;
  gatewaySignature?: string;
  paymentStatus: 'success' | 'failed' | 'refunded';
  invoiceNumber: string;
  paymentMethod?: string;
  failureReason?: string;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  adId: string;
  title: string;
  description: string;
  bannerUrl: string;
  destinationUrl: string;
  placement: 'homepage_banner' | 'category_page' | 'sponsored_section' | 'garage_profile';
  category?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'expired';
  impressionsCount: number;
  clicksCount: number;
  advertiserName: string;
  advertiserContact: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  uid: string;
  phone: string;
  name?: string;
  role: 'driver' | 'garage_owner' | 'admin';
  status: 'active' | 'suspended';
  garageId?: string;
  suspensionReason?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Enquiry {
  id: string;
  garageId: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber?: string;
  problemDescription: string;
  locationAddress: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface GarageReport {
  id: string;
  garageId: string;
  garageName: string;
  reason: string;
  details?: string;
  driverPhone?: string;
  createdAt: string;
}

export interface AdminStats {
  totalGarages: number;
  verifiedGarages: number;
  pendingGarages: number;
  rejectedGarages: number;
  suspendedGarages: number;
  totalDrivers: number;
  totalReports: number;
  totalEmergencies?: number;
  activeEmergencies?: number;
  completedEmergencies?: number;
  cancelledEmergencies?: number;
  totalReviews?: number;
  reportedReviews?: number;
  totalComplaints?: number;
  pendingComplaints?: number;
  activeSubscriptions?: number;
  totalRevenueInr?: number;
  monthlyRevenueInr?: number;
  subscriptionRevenueInr?: number;
  adRevenueInr?: number;
  stateCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
}
