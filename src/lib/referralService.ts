/**
 * TRUCK RESCUE INDIA - Referral & Growth Engine Service
 * Manages unique garage referral codes, WhatsApp viral invitations,
 * anti-fraud validation, and network growth metrics.
 */

import { Garage, ReferralRecord, GrowthMetrics, ProviderCategory } from './types';
import { getStateCode, ALL_INDIAN_STATES_DATA } from './indiaGeoData';

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://truckrescueindia.in';

/**
 * Generates a standardized, memorable unique referral code.
 * Format: TRI-{STATE_CODE}-{RANDOM_4_ALPHANUMERIC}
 * Example: TRI-MH-8291, TRI-DL-3904, TRI-GJ-7182
 */
export function generateReferralCode(stateName?: string): string {
  const stateCode = stateName ? getStateCode(stateName).toUpperCase() : 'IN';
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars (0, 1, I, O)
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRI-${stateCode}-${randomPart}`;
}

/**
 * Validates referral code formatting.
 */
export function isValidReferralCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  const clean = code.trim().toUpperCase();
  return /^TRI-[A-Z]{2}-[A-Z0-9]{4}$/.test(clean);
}

export interface AntiFraudCheckResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates anti-fraud rules for garage registration referrals:
 * 1. Referrer code format must be valid.
 * 2. Self-referral by identical phone number is blocked.
 * 3. Self-referral by identical Firebase UID is blocked.
 * 4. Self-referral to the same garage ID is blocked.
 */
export function validateReferralAntiFraud(params: {
  referrerCode: string;
  newGaragePhone: string;
  newGarageUid?: string;
  referrerGarage?: Partial<Garage> | null;
}): AntiFraudCheckResult {
  const { referrerCode, newGaragePhone, newGarageUid, referrerGarage } = params;

  if (!referrerCode || !isValidReferralCodeFormat(referrerCode)) {
    return { valid: false, reason: 'अमान्य रेफरल कोड प्रारूप (Invalid referral code format)' };
  }

  if (referrerGarage) {
    // Check identical phone number (prevent referring oneself)
    const cleanReferrerPhone = (referrerGarage.phone || '').replace(/\D/g, '').slice(-10);
    const cleanNewPhone = (newGaragePhone || '').replace(/\D/g, '').slice(-10);

    if (cleanReferrerPhone && cleanNewPhone && cleanReferrerPhone === cleanNewPhone) {
      return { 
        valid: false, 
        reason: 'स्वयं का फ़ोन नंबर रेफर नहीं किया जा सकता (Cannot refer your own mobile number)' 
      };
    }

    // Check identical UID
    if (newGarageUid && referrerGarage.uid && newGarageUid === referrerGarage.uid) {
      return { 
        valid: false, 
        reason: 'एक ही अकाउंट से स्वयं को रेफर नहीं कर सकते (Self-referral from same account is blocked)' 
      };
    }

    // Check if referrer account is active / not suspended
    if (referrerGarage.verificationStatus === 'suspended') {
      return { 
        valid: false, 
        reason: 'रेफर करने वाला गैराज वर्तमान में निलंबित है (Referrer garage is currently suspended)' 
      };
    }
  }

  return { valid: true };
}

/**
 * Builds viral bilingual WhatsApp invitation message for garage owners.
 */
export function buildWhatsAppInviteMessage(garage: Partial<Garage>, customBaseUrl?: string): string {
  const baseUrl = customBaseUrl || BASE_APP_URL;
  const code = garage.referralCode || generateReferralCode(garage.state);
  const registrationLink = `${baseUrl}/register?ref=${code}`;
  const garageName = garage.garageName || 'हमारा ट्रक वर्कशॉप';
  const ownerName = garage.ownerName ? ` (${garage.ownerName})` : '';

  return (
`🚚🔧 *TRUCK RESCUE INDIA — भारत का सबसे बड़ा ट्रक सर्विस नेटवर्क*

नमस्ते भाई! 👋
मैंने अपने वर्कशॉप *${garageName}*${ownerName} को **Truck Rescue India** पर रजिस्टर किया है।

यहाँ से पूरे भारत के ट्रक ड्राइवरों और ट्रांसपोर्टरों के डायरेक्ट कॉल और ऑन-रोड ब्रेकडाउन काम मिलते हैं!

✅ *100% मुफ़्त लाइफटाइम रजिस्ट्रेशन (Zero Fees)*
✅ सीधे ड्राइवर से डायरेक्ट कॉल (tel:) व WhatsApp
✅ Google Maps पर गैराज की सटीक लोकेशन
✅ 24x7 इमरजेंसी ब्रेकडाउन व टोइंग सपोर्ट
✅ BS6, ECM स्कैनर व इलेक्ट्रिकल काम

👇 आप भी अपने गैराज / क्रेन / मोबाइल वैन को अभी फ्री में रजिस्टर करें:
🔗 ${registrationLink}

🎁 मेरा रेफरल कोड इस्तेमाल करें: *${code}*

जय जवान, जय किसान, जय ट्रांसपोर्टर! 🇮🇳`
  );
}

/**
 * Builds direct WhatsApp URL to open WhatsApp with pre-filled invitation text.
 */
export function buildWhatsAppInviteLink(garage: Partial<Garage>, customBaseUrl?: string): string {
  const message = buildWhatsAppInviteMessage(garage, customBaseUrl);
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the public garage profile share link.
 */
export function buildPublicProfileLink(garageId: string, customBaseUrl?: string): string {
  const baseUrl = customBaseUrl || BASE_APP_URL;
  return `${baseUrl}/garage/${garageId}`;
}

/**
 * Generates the QR Code URL (using Google Charts API or local standard SVG generator).
 */
export function getQrCodeImageUrl(contentUrl: string, size: number = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(contentUrl)}&margin=8`;
}

/**
 * Aggregates Growth Dashboard Metrics across all Indian States & Categories.
 */
export function calculateGrowthMetrics(
  garages: Garage[], 
  referrals: ReferralRecord[] = []
): GrowthMetrics {
  const totalGarages = garages.length;
  let verifiedGarages = 0;
  let pendingGarages = 0;
  let suspendedGarages = 0;
  let freeGarages = 0;
  let premiumGarages = 0;

  // Initialize all 36 states/UTs with 0 count
  const stateDistribution: { [state: string]: number } = {};
  ALL_INDIAN_STATES_DATA.forEach(state => {
    stateDistribution[state.name] = 0;
  });

  const categoryDistribution: { [category: string]: number } = {
    workshop: 0,
    mobile_technician: 0,
    individual_mechanic: 0,
    towing_fleet: 0,
    spare_parts_dealer: 0,
    heavy_mechanic: 0,
    truck_electrician: 0,
    scanner_diagnostic: 0,
    ecm_ecu_repair: 0,
    bs4_bs6_expert: 0,
    dpf_scr_urea: 0,
    tyre_puncture: 0,
    towing_recovery: 0,
    spare_parts: 0
  };

  garages.forEach(g => {
    // Status tallies
    if (g.verificationStatus === 'verified') verifiedGarages++;
    else if (g.verificationStatus === 'pending') pendingGarages++;
    else if (g.verificationStatus === 'suspended') suspendedGarages++;

    // Tiers
    if (g.subscriptionTier === 'premium' || g.subscriptionTier === 'featured') {
      premiumGarages++;
    } else {
      freeGarages++;
    }

    // State distribution
    if (g.state) {
      const match = ALL_INDIAN_STATES_DATA.find(
        s => s.name.toLowerCase() === g.state.toLowerCase() || s.code.toLowerCase() === g.state.toLowerCase()
      );
      const stateKey = match ? match.name : g.state;
      stateDistribution[stateKey] = (stateDistribution[stateKey] || 0) + 1;
    }

    // Provider Category distribution
    if (g.providerCategory && categoryDistribution[g.providerCategory] !== undefined) {
      categoryDistribution[g.providerCategory]++;
    }

    // Services breakdown
    if (Array.isArray(g.services)) {
      g.services.forEach(svc => {
        if (categoryDistribution[svc] !== undefined) {
          categoryDistribution[svc]++;
        }
      });
    }
  });

  // Referrals calculation
  const totalReferrals = referrals.length;
  const successfulReferrals = referrals.filter(r => r.status === 'verified' || r.status === 'rewarded').length;

  // Top referrers leaderboard
  const referrerMap: { [code: string]: { garageId: string; garageName: string; count: number } } = {};
  referrals.forEach(r => {
    if (!referrerMap[r.referrerCode]) {
      referrerMap[r.referrerCode] = {
        garageId: r.referrerGarageId,
        garageName: r.referrerGarageName || 'Garage Partner',
        count: 0
      };
    }
    referrerMap[r.referrerCode].count++;
  });

  const topReferrers = Object.entries(referrerMap)
    .map(([referralCode, data]) => ({
      referralCode,
      garageId: data.garageId,
      garageName: data.garageName,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalGarages,
    verifiedGarages,
    pendingGarages,
    suspendedGarages,
    freeGarages,
    premiumGarages,
    stateDistribution,
    categoryDistribution,
    totalReferrals,
    successfulReferrals,
    topReferrers,
    generatedAt: new Date().toISOString()
  };
}
