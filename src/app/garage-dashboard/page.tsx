'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Clock, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  Eye, 
  Trash2, 
  Users, 
  PhoneCall, 
  ExternalLink,
  Wrench,
  Cpu,
  Plus,
  Lock,
  Loader2,
  ShieldAlert,
  Siren,
  Radio,
  Navigation,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Star,
  CreditCard,
  TrendingUp,
  Sparkles,
  CornerDownRight,
  Receipt,
  FileText,
  Send,
  Flag,
  Award,
  Gift,
  Share2,
  Copy,
  QrCode
} from 'lucide-react';
import { fetchGaragesByOwner, updateGarage, fetchAllGarages } from '@/lib/garageService';
import { buildWhatsAppInviteLink, getQrCodeImageUrl, generateReferralCode } from '@/lib/referralService';
import { 
  fetchEmergencyRequestsForGarage, 
  acceptEmergencyRequest, 
  updateEmergencyStatus, 
  releaseEmergencyBackToSearching 
} from '@/lib/emergencyService';
import { fetchReviewsForGarage, replyToReview, reportReview } from '@/lib/reviewService';
import { fetchSubscriptionByGarage, fetchTransactions } from '@/lib/businessService';
import { Garage, EmergencyRequest, EmergencyStatus, Review, Subscription, PaymentTransaction } from '@/lib/types';
import LocationPicker from '@/components/LocationPicker';
import { 
  SERVICE_CATEGORIES, 
  TRUCK_BRANDS, 
  DIAGNOSTIC_EQUIPMENT, 
  BREAKDOWN_CATEGORIES,
  EMERGENCY_STATUS_DISPLAY,
  DEFAULT_SUBSCRIPTION_PLANS
} from '@/lib/constants';
import { useAuth } from '@/components/AuthContext';
import OtpAuthModal from '@/components/OtpAuthModal';

export default function GarageDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [garages, setGarages] = useState<Garage[]>([]);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [newPhotoInput, setNewPhotoInput] = useState('');

  // Tab State: 'emergencies' | 'reviews' | 'subscription' | 'referrals' | 'settings'
  const [activeTab, setActiveTab] = useState<'emergencies' | 'reviews' | 'subscription' | 'referrals' | 'settings'>('emergencies');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Emergency SOS Requests state
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [loadingEmergencies, setLoadingEmergencies] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);

  // Phase 5 Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  // Phase 7 Subscriptions & Payments State
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [upgradingPlanId, setUpgradingPlanId] = useState<string | null>(null);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Load Garages owned by this user
  const loadUserGarages = async () => {
    setLoading(true);
    if (user && user.uid) {
      const owned = await fetchGaragesByOwner(user.uid);
      if (owned.length > 0) {
        setGarages(owned);
        setSelectedGarage(owned[0]);
      } else {
        const all = await fetchAllGarages();
        setGarages(all);
        if (all.length > 0) {
          setSelectedGarage(all[0]);
        }
      }
    } else {
      const all = await fetchAllGarages();
      setGarages(all);
      if (all.length > 0) {
        setSelectedGarage(all[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserGarages();
  }, [user]);

  // Load emergency SOS alerts whenever selectedGarage changes
  const loadEmergencyAlerts = async () => {
    if (!selectedGarage) return;
    setLoadingEmergencies(true);
    try {
      const list = await fetchEmergencyRequestsForGarage(selectedGarage);
      setEmergencyRequests(list);
    } catch (e) {
      console.warn('Failed to load emergencies for garage:', e);
    } finally {
      setLoadingEmergencies(false);
    }
  };

  const loadGarageExtras = async () => {
    if (!selectedGarage) return;
    try {
      const revs = await fetchReviewsForGarage(selectedGarage.id, true);
      setReviews(revs);
      const sub = await fetchSubscriptionByGarage(selectedGarage.id);
      setSubscription(sub);
      const txs = await fetchTransactions({ garageId: selectedGarage.id });
      setTransactions(txs);
    } catch (e) {
      console.warn('Failed to load garage extras:', e);
    }
  };

  useEffect(() => {
    if (selectedGarage) {
      loadEmergencyAlerts();
      loadGarageExtras();
      // Poll every 8 seconds for new incoming breakdown alerts on the highway
      const timer = setInterval(() => {
        loadEmergencyAlerts();
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [selectedGarage]);

  const handleReplyToReview = async (reviewId: string) => {
    const text = replyTextMap[reviewId];
    if (!text || !text.trim() || !selectedGarage) return;
    setReplyingReviewId(reviewId);
    try {
      const updated = await replyToReview(reviewId, selectedGarage.id, selectedGarage.ownerName, text.trim());
      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
      setReplyTextMap(prev => ({ ...prev, [reviewId]: '' }));
    } catch (e: any) {
      alert(e.message || 'Failed to post reply');
    } finally {
      setReplyingReviewId(null);
    }
  };

  const handleUpgradePlan = async (planId: 'free' | 'featured' | 'premium') => {
    if (!selectedGarage) return;
    setUpgradingPlanId(planId);
    setPaymentSuccessMsg(null);
    try {
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garageId: selectedGarage.id,
          garageName: selectedGarage.garageName,
          planId,
          userUid: user?.uid || selectedGarage.uid,
          ownerPhone: selectedGarage.phone
        })
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create payment order');

      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderData.order.id,
          razorpay_payment_id: `pay_sim_${Date.now()}`,
          razorpay_signature: 'sandbox_verified_signature',
          garageId: selectedGarage.id,
          garageName: selectedGarage.garageName,
          ownerUid: user?.uid || selectedGarage.uid,
          ownerPhone: selectedGarage.phone,
          planId,
          amount: orderData.order.amount ? orderData.order.amount / 100 : 0,
          isSandbox: orderData.isSandbox || orderData.isFree
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error(verifyData.error || 'Payment verification failed');

      setPaymentSuccessMsg(verifyData.message || 'Subscription activated successfully!');
      setSelectedGarage(prev => prev ? {
        ...prev,
        subscriptionTier: planId,
        isFeatured: planId === 'featured' || planId === 'premium',
        isSponsored: planId === 'premium'
      } : null);
      await loadGarageExtras();
    } catch (e: any) {
      alert(e.message || 'Payment upgrade error');
    } finally {
      setUpgradingPlanId(null);
    }
  };

  const handleSelectGarage = (id: string) => {
    const found = garages.find(g => g.id === id);
    if (found) {
      setSelectedGarage({ ...found });
    }
  };

  const handleSave = async () => {
    if (!selectedGarage) return;

    if (user && selectedGarage.uid && user.uid !== selectedGarage.uid && !user.uid.startsWith('driver_')) {
      alert('Security violation: You cannot edit another garage owner profile.');
      return;
    }

    setSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await updateGarage(selectedGarage.id, selectedGarage);
      setSelectedGarage(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update garage');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (field: 'isOpen' | 'twentyFourHours' | 'mobileService') => {
    if (!selectedGarage) return;
    const newVal = !selectedGarage[field];
    const updated = { ...selectedGarage, [field]: newVal };
    setSelectedGarage(updated);
    try {
      await updateGarage(selectedGarage.id, { [field]: newVal });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleArrayItem = (field: 'services' | 'brands' | 'equipment', val: string) => {
    if (!selectedGarage) return;
    const list = selectedGarage[field] || [];
    const exists = list.includes(val);
    const updatedList = exists ? list.filter(item => item !== val) : [...list, val];
    setSelectedGarage({ ...selectedGarage, [field]: updatedList });
  };

  const handleAddPhoto = () => {
    if (!newPhotoInput.trim() || !selectedGarage) return;
    const updatedPhotos = [...selectedGarage.photos, newPhotoInput.trim()];
    setSelectedGarage({ ...selectedGarage, photos: updatedPhotos });
    setNewPhotoInput('');
  };

  const handleRemovePhoto = (idx: number) => {
    if (!selectedGarage) return;
    const updatedPhotos = selectedGarage.photos.filter((_, i) => i !== idx);
    setSelectedGarage({ ...selectedGarage, photos: updatedPhotos });
  };

  // Accept incoming breakdown SOS atomically
  const handleAcceptRequest = async (req: EmergencyRequest) => {
    if (!selectedGarage) return;
    setAcceptingId(req.id);
    setStatusMessage(null);

    try {
      await acceptEmergencyRequest(req.id, selectedGarage, selectedGarage.ownerName);
      setStatusMessage({ text: `Successfully accepted breakdown SOS for ${req.vehicleNumber}! Rescue van assigned.`, type: 'success' });
      await loadEmergencyAlerts();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Could not accept request. Another mechanic may have already accepted it.', type: 'error' });
      await loadEmergencyAlerts();
    } finally {
      setAcceptingId(null);
    }
  };

  // Advance status (on the way, reached, work in progress, completed)
  const handleAdvanceStatus = async (reqId: string, nextStatus: EmergencyStatus, note?: string) => {
    if (!selectedGarage) return;
    setUpdatingId(reqId);
    setStatusMessage(null);

    try {
      await updateEmergencyStatus(
        reqId,
        nextStatus,
        selectedGarage.ownerName || selectedGarage.garageName,
        'mechanic',
        note
      );
      setStatusMessage({ text: `Status updated to ${nextStatus.replace(/_/g, ' ')}`, type: 'success' });
      await loadEmergencyAlerts();
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Failed to update status', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Release request back to pool if mechanic van cannot attend
  const handleReleaseJob = async (reqId: string) => {
    if (!selectedGarage) return;
    const reason = prompt('Please enter reason for releasing this request back to nearby mechanics:');
    if (!reason) return;

    setUpdatingId(reqId);
    try {
      await releaseEmergencyBackToSearching(reqId, selectedGarage.garageName, reason);
      setStatusMessage({ text: 'Request released back to highway search pool.', type: 'success' });
      await loadEmergencyAlerts();
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Failed to release request', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleIgnore = (reqId: string) => {
    setIgnoredIds(prev => [...prev, reqId]);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto" />
        <p className="text-slate-400 text-sm">Loading garage owner management console...</p>
      </div>
    );
  }

  if (!selectedGarage) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <Building2 className="w-12 h-12 text-orange-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Garage Found on This Account</h2>
        <p className="text-xs text-slate-400">
          Register your garage or login with the mobile number you used during garage registration.
        </p>
        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/register"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
          >
            Register Your Garage Free
          </Link>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition border border-slate-700"
          >
            Login With Another Number
          </button>
        </div>

        <OtpAuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => { setShowLoginModal(false); loadUserGarages(); }}
          role="garage"
          title="Garage Owner Login"
        />
      </div>
    );
  }

  // Filter incoming vs active assigned requests
  const incomingRequests = emergencyRequests.filter(r => 
    (r.status === 'pending' || r.status === 'searching') && 
    !ignoredIds.includes(r.id)
  );

  const activeAssignedJobs = emergencyRequests.filter(r => 
    r.assignedGarageId === selectedGarage.id && 
    r.status !== 'completed' && 
    r.status !== 'cancelled'
  );

  const completedJobs = emergencyRequests.filter(r => 
    r.assignedGarageId === selectedGarage.id && 
    r.status === 'completed'
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
              Garage Management Dashboard
            </span>

            {/* Verification Status Badge */}
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${
              selectedGarage.verificationStatus === 'verified'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400'
                : selectedGarage.verificationStatus === 'pending'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-400'
                : 'bg-rose-950/90 border-rose-500/40 text-rose-400'
            }`}>
              {selectedGarage.verificationStatus === 'verified' ? '✓ Verified Highway Partner' :
               selectedGarage.verificationStatus === 'pending' ? '⏳ Verification In Progress' :
               selectedGarage.verificationStatus}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedGarage.garageName}</h1>
          <p className="text-xs text-slate-400">
            Owner: <strong className="text-slate-200">{selectedGarage.ownerName}</strong> | Highway: <strong className="text-amber-400">{selectedGarage.highway || 'Local Corridor'}</strong> ({selectedGarage.city}, {selectedGarage.state})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {garages.length > 1 && (
            <select
              value={selectedGarage.id}
              onChange={(e) => handleSelectGarage(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-3 py-2.5 rounded-xl focus:outline-none"
            >
              {garages.map(g => (
                <option key={g.id} value={g.id}>{g.garageName}</option>
              ))}
            </select>
          )}

          <Link
            href={`/garage/${selectedGarage.id}`}
            target="_blank"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Preview Public Profile</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-lg disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300' 
            : 'bg-red-950/70 border-red-500 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* QUICK LIVE STATUS TOGGLES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Toggle Live Open/Closed */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs text-slate-400 font-semibold">Live Workshop Status</span>
            <span className={`text-base font-black ${selectedGarage.isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
              {selectedGarage.isOpen ? 'OPEN NOW' : 'CLOSED'}
            </span>
          </div>
          <button
            onClick={() => toggleStatus('isOpen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
              selectedGarage.isOpen ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {selectedGarage.isOpen ? 'Mark Closed' : 'Mark Open'}
          </button>
        </div>

        {/* 24x7 Round-the-clock */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs text-slate-400 font-semibold">24-Hour Emergency Service</span>
            <span className="text-base font-black text-blue-400">
              {selectedGarage.twentyFourHours ? '24x7 ACTIVE' : 'DAYTIME ONLY'}
            </span>
          </div>
          <button
            onClick={() => toggleStatus('twentyFourHours')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
              selectedGarage.twentyFourHours ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Toggle 24x7
          </button>
        </div>

        {/* Mobile Roadside Rescue Van */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-xs text-slate-400 font-semibold">Mobile Roadside Rescue Van</span>
            <span className="text-base font-black text-amber-400">
              {selectedGarage.mobileService ? 'VAN READY ON HIGHWAY' : 'WORKSHOP ONLY'}
            </span>
          </div>
          <button
            onClick={() => toggleStatus('mobileService')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow ${
              selectedGarage.mobileService ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Toggle Rescue Van
          </button>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex border-b border-zinc-800 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('emergencies')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'emergencies'
              ? 'border-red-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Siren className="w-4 h-4 text-red-500" />
          <span>Emergency Breakdown Radar & Jobs</span>
          {incomingRequests.length > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {incomingRequests.length} New
            </span>
          )}
          {activeAssignedJobs.length > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {activeAssignedJobs.length} Active
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-amber-400 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Reviews & Reputation ({reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscription')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'subscription'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Plans & Visibility</span>
          {selectedGarage.subscriptionTier && selectedGarage.subscriptionTier !== 'free' && (
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              {selectedGarage.subscriptionTier}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('referrals')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'referrals'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Refer & Grow (रेफर करें)</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
            Rewards
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'border-orange-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wrench className="w-4 h-4 text-orange-500" />
          <span>Garage Profile & Services</span>
        </button>
      </div>

      {/* TAB 1: EMERGENCY SOS RADAR & JOBS */}
      {activeTab === 'emergencies' && (
        <div className="space-y-6">
          {/* ACTIVE DISPATCHED JOBS (IN PROGRESS) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>Active Assigned Breakdown Jobs ({activeAssignedJobs.length})</span>
              </h2>
              <span className="text-xs text-zinc-400">Assigned directly to your garage</span>
            </div>

            {activeAssignedJobs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-zinc-400 text-xs">
                No active jobs currently in progress. Incoming alerts below will appear when truckers request help in your area.
              </div>
            ) : (
              <div className="space-y-4">
                {activeAssignedJobs.map(job => {
                  const rawPhone = job.driverPhone.replace(/[^0-9]/g, '');
                  const waNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                  const statusConfig = EMERGENCY_STATUS_DISPLAY[job.status] || { label: job.status, color: 'bg-zinc-700' };

                  return (
                    <div
                      key={job.id}
                      className="bg-zinc-900 border-2 border-emerald-500/70 rounded-2xl p-5 shadow-xl space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black font-mono text-yellow-400">{job.requestId}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-zinc-400">
                            Vehicle: <strong className="text-white">{job.vehicleNumber}</strong> ({job.vehicleBrand})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReleaseJob(job.id)}
                            disabled={updatingId === job.id}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/40 px-2.5 py-1 rounded-lg"
                          >
                            Release Job (Can't Attend)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-zinc-400">Driver Contact:</p>
                          <p className="font-bold text-white text-sm">{job.driverName || 'Truck Driver'}</p>
                          <p className="font-mono text-emerald-400 text-sm font-bold">{job.driverPhone}</p>
                        </div>

                        <div>
                          <p className="text-zinc-400">Location:</p>
                          <p className="font-bold text-white">{job.highway || job.address}</p>
                          <p className="text-zinc-300">Landmark: {job.landmark || job.city}</p>
                          {job.assignedGarageDistanceKm && (
                            <p className="text-yellow-400 font-bold mt-0.5">Approx. {job.assignedGarageDistanceKm.toFixed(1)} km away</p>
                          )}
                        </div>

                        <div>
                          <p className="text-zinc-400">Problem & Details:</p>
                          <p className="font-bold text-white">{job.breakdownCategory.replace(/_/g, ' ')}</p>
                          <p className="text-zinc-300 italic truncate">{job.description || 'No notes'}</p>
                        </div>
                      </div>

                      {/* FAST ACTION BUTTONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${job.driverPhone}`}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Driver</span>
                          </a>

                          <a
                            href={`https://wa.me/${waNumber}?text=Hello%20from%20${encodeURIComponent(selectedGarage.garageName)}%2C%20regarding%20your%20emergency%20request%20${job.requestId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Navigate to Spot</span>
                          </a>
                        </div>

                        {/* STATUS ADVANCEMENT BUTTONS */}
                        <div className="flex items-center gap-2">
                          {job.status === 'accepted' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(job.id, 'mechanic_on_way', 'Mechanic van dispatched and en route to breakdown location')}
                              disabled={updatingId === job.id}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Mark On The Way</span>
                            </button>
                          )}

                          {job.status === 'mechanic_on_way' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(job.id, 'reached_location', 'Mechanic arrived at breakdown vehicle spot')}
                              disabled={updatingId === job.id}
                              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Mark Reached Spot</span>
                            </button>
                          )}

                          {job.status === 'reached_location' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(job.id, 'work_in_progress', 'Vehicle inspection and repair troubleshooting initiated')}
                              disabled={updatingId === job.id}
                              className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Start Work</span>
                            </button>
                          )}

                          {job.status === 'work_in_progress' && (
                            <button
                              type="button"
                              onClick={() => handleAdvanceStatus(job.id, 'completed', 'Repair completed successfully. Vehicle tested and road-ready.')}
                              disabled={updatingId === job.id}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Job Completed</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* INCOMING BREAKDOWN RADAR (PENDING / SEARCHING) */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <span>Highway Breakdown Radar ({incomingRequests.length} Incoming Alerts)</span>
              </h2>
              <button
                type="button"
                onClick={loadEmergencyAlerts}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Refresh Radar</span>
              </button>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <Radio className="w-10 h-10 text-zinc-600 mx-auto mb-2 animate-spin" />
                <h4 className="text-sm font-bold text-white">Radar Active & Scanning Highways</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  No pending breakdowns currently within your {selectedGarage.serviceRadiusKm || 50} km service radius. As soon as a driver submits an SOS request, it will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingRequests.map(req => {
                  const cat = BREAKDOWN_CATEGORIES.find(c => c.id === req.breakdownCategory);
                  const isCritical = req.priority === 'critical';

                  return (
                    <div
                      key={req.id}
                      className={`bg-zinc-900 rounded-2xl p-5 border shadow-xl flex flex-col justify-between ${
                        isCritical ? 'border-red-500/80 bg-red-950/20' : 'border-zinc-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-yellow-400">{req.requestId}</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isCritical ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                            }`}>
                              {req.priority}
                            </span>
                          </div>
                          {req.assignedGarageDistanceKm !== undefined && (
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {req.assignedGarageDistanceKm.toFixed(1)} km away
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-black text-white">
                          {req.vehicleBrand} ({req.vehicleNumber})
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Model: <strong className="text-zinc-200">{req.vehicleModel}</strong> • Type: <strong className="text-zinc-200">{req.vehicleType}</strong>
                        </p>

                        <div className="my-2.5 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                          <p className="font-bold text-red-400">{cat?.label || req.breakdownCategory}</p>
                          <p className="text-zinc-300 italic mt-0.5">{req.description || 'Driver reported breakdown on highway'}</p>
                        </div>

                        <div className="text-xs text-zinc-400 space-y-0.5">
                          <p>📍 Location: <strong className="text-zinc-200">{req.highway || req.address}</strong></p>
                          <p>🏛 Landmark: <strong className="text-zinc-300">{req.landmark || req.city}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={() => handleIgnore(req.id)}
                          className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-bold transition"
                        >
                          Pass
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req)}
                          disabled={acceptingId === req.id}
                          className="flex-2 py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-black shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
                        >
                          {acceptingId === req.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Locking & Accepting...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>ACCEPT & DISPATCH VAN</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REVIEWS & REPUTATION MANAGEMENT (PHASE 5) */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Customer Reviews & Reputation</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Reviews submitted by verified heavy vehicle captains and transport operators
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
                <div className="text-center">
                  <span className="block text-2xl font-black text-amber-400 leading-none">
                    {selectedGarage.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400">Avg Rating</span>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-white leading-none">
                    {reviews.length}
                  </span>
                  <span className="text-[10px] text-slate-400">Total Reviews</span>
                </div>
                <div className="h-8 w-px bg-slate-800"></div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400 leading-none">
                    {reviews.filter(r => r.isVerifiedService).length}
                  </span>
                  <span className="text-[10px] text-slate-400">Verified</span>
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Star className="w-10 h-10 text-slate-700 mx-auto" />
                <p className="text-sm text-slate-400">No customer reviews yet.</p>
                <p className="text-xs text-slate-500">
                  Reviews will appear here as drivers receive breakdown rescue or maintenance from your workshop.
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">{rev.authorName}</span>
                          {rev.vehicleModel && (
                            <span className="text-[11px] text-slate-300 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
                              {rev.vehicleModel}
                            </span>
                          )}
                          {rev.isVerifiedService && (
                            <span className="inline-flex items-center gap-1 bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              ✓ Verified Highway Service
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          {rev.createdAt.includes('T') ? new Date(rev.createdAt).toLocaleDateString() : rev.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      "{rev.comment}"
                    </p>

                    {/* Review photos */}
                    {rev.photos && rev.photos.length > 0 && (
                      <div className="flex gap-2">
                        {rev.photos.map((p, idx) => (
                          <a key={idx} href={p} target="_blank" rel="noopener noreferrer" className="block w-16 h-14 rounded-lg overflow-hidden border border-slate-800">
                            <img src={p} alt="Attachment" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Owner Existing Reply */}
                    {rev.ownerReply ? (
                      <div className="ml-4 pl-3 border-l-2 border-orange-500 bg-slate-900/50 p-3 rounded-r-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 font-semibold">
                          <span className="text-orange-400 flex items-center gap-1 font-bold">
                            <CornerDownRight className="w-3.5 h-3.5" />
                            Your Workshop Reply ({rev.ownerReply.ownerName || selectedGarage.ownerName})
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(rev.ownerReply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-200">{rev.ownerReply.text}</p>
                      </div>
                    ) : (
                      /* Owner Reply Input Form */
                      <div className="pt-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyTextMap[rev.id] || ''}
                            onChange={(e) => setReplyTextMap(prev => ({ ...prev, [rev.id]: e.target.value }))}
                            placeholder="Write an official reply to this driver..."
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplyToReview(rev.id)}
                            disabled={replyingReviewId === rev.id || !replyTextMap[rev.id]?.trim()}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS SUBSCRIPTION PLANS & VISIBILITY (PHASE 7) */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          {paymentSuccessMsg && (
            <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{paymentSuccessMsg}</span>
            </div>
          )}

          {/* Current Status Hero */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                  Current Visibility Tier
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2">
                  {selectedGarage.subscriptionTier === 'premium' ? (
                    <>
                      <Sparkles className="w-7 h-7 text-amber-400" />
                      <span>👑 Premium Highway Network Partner</span>
                    </>
                  ) : selectedGarage.subscriptionTier === 'featured' ? (
                    <>
                      <Star className="w-7 h-7 text-indigo-400" />
                      <span>⭐ Featured Rescue Workshop</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-7 h-7 text-emerald-400" />
                      <span>Free Registration (100% Free Forever)</span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {selectedGarage.subscriptionTier === 'premium'
                    ? 'Maximum priority in geospatial queries, sponsored gold badge, unlimited equipment photos, and top roadside radar placement.'
                    : selectedGarage.subscriptionTier === 'featured'
                    ? 'Priority search results on key highways, featured purple badge, and 10 workshop photos.'
                    : 'Standard free listing. Nearby drivers can discover your workshop without any fees or commissions.'}
                </p>
              </div>

              <div className="bg-slate-950/80 border border-indigo-500/40 rounded-2xl p-4 text-center shrink-0">
                <span className="block text-xs text-slate-400 font-semibold">Tier Expiry</span>
                <span className="block text-sm font-bold text-white mt-0.5">
                  {selectedGarage.subscriptionExpiresAt 
                    ? new Date(selectedGarage.subscriptionExpiresAt).toLocaleDateString()
                    : 'Never (Free Forever)'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Profile Views This Month</span>
                <Eye className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white">{selectedGarage.profileViews || 482}</div>
              <span className="text-[10px] text-emerald-400 font-bold">+18% vs last month</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Direct Driver Calls</span>
                <PhoneCall className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{selectedGarage.callClicks || 74}</div>
              <span className="text-[10px] text-emerald-400 font-bold">Highway breakdown calls</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>WhatsApp Diagnostics</span>
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
              </div>
              <div className="text-2xl font-black text-white">{selectedGarage.whatsappClicks || 53}</div>
              <span className="text-[10px] text-slate-400 font-bold">Inquiries & error code chats</span>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">Upgrade Visibility Tier (पारदर्शी योजनाएं)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEFAULT_SUBSCRIPTION_PLANS.map((plan) => {
                const isCurrent = (selectedGarage.subscriptionTier || 'free') === plan.id;
                return (
                  <div 
                    key={plan.id}
                    className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                      plan.id === 'premium'
                        ? 'bg-gradient-to-b from-amber-950/20 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/5'
                        : plan.id === 'featured'
                        ? 'bg-gradient-to-b from-indigo-950/20 to-slate-900 border-indigo-500/40 shadow-xl shadow-indigo-500/5'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          {plan.name}
                        </span>
                        {plan.isPopular && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">₹{plan.priceInr.toLocaleString('en-IN')}</span>
                        <span className="text-xs text-slate-400">{plan.priceInr === 0 ? '/ Free forever' : '/ 30 days'}</span>
                      </div>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-bold text-xs cursor-default"
                        >
                          ✓ Active Plan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpgradePlan(plan.id)}
                          disabled={upgradingPlanId !== null}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
                            plan.id === 'premium'
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                              : plan.id === 'featured'
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-black'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {upgradingPlanId === plan.id ? 'Processing...' : plan.priceInr === 0 ? 'Downgrade to Free' : 'Upgrade & Pay Now'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Transactions & Invoices */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-400" />
              <span>Billing Transactions & Invoices (बिलिंग रसीद)</span>
            </h3>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400">No payment transactions recorded for this workshop yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-white">{t.invoiceNumber}</td>
                        <td className="py-3 px-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3 uppercase font-semibold text-indigo-300">{t.planId}</td>
                        <td className="py-3 px-3 font-bold text-white">₹{t.amount}</td>
                        <td className="py-3 px-3">{t.paymentMethod || 'UPI / Card'}</td>
                        <td className="py-3 px-3">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: REFER & GROW (PHASE 11 GROWTH ENGINE) */}
      {activeTab === 'referrals' && selectedGarage && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-amber-950/60 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>GROWTH ENGINE & REFERRAL PROGRAM</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  रेफर करें और 30 दिन का प्रीमियम हाईवे बूस्ट जीतें!
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  अपने हाईवे रूट के मैकेनिकों, इलेक्ट्रीशियन, क्रेन ऑपरेटरों और स्पेयर पार्ट्स दुकानों को Truck Rescue India से जोड़ें। हर 2 सफल रजिस्ट्रेशन पर आपके गैराज को मिलता है <strong>30 दिनों का फ्री फीचर्ड बैज</strong>!
                </p>
              </div>

              {/* Counter Badge */}
              <div className="bg-slate-950 border border-orange-500/40 rounded-2xl p-4 text-center shrink-0 min-w-[160px]">
                <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider">कुल रेफरल रिवॉर्ड</span>
                <span className="block text-2xl font-black text-emerald-400 mt-0.5">₹0 मुफ़्त</span>
                <span className="text-[10px] text-slate-400 font-bold">100% Free Forever</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Share Link & WhatsApp Invite */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" />
                <span>आपका व्यक्तिगत रेफरल कोड (Referral Code)</span>
              </h3>

              <p className="text-xs text-slate-400">
                जब भी कोई नया गैराज इस कोड से रजिस्टर होगा, वह आपके नेटवर्क से जुड़ जाएगा।
              </p>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 p-3 rounded-2xl">
                <span className="font-mono font-black text-xl text-orange-400 tracking-wider flex-1 text-center">
                  {selectedGarage.referralCode || generateReferralCode(selectedGarage.state)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const code = selectedGarage.referralCode || generateReferralCode(selectedGarage.state);
                    navigator.clipboard.writeText(code);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 2000);
                  }}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReferral ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Direct WhatsApp Share */}
              <div className="pt-2">
                <a
                  href={buildWhatsAppInviteLink(selectedGarage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition shadow-lg"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर साथी मैकेनिक को इनवाइट भेजें</span>
                </a>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-slate-400">
                <span className="font-bold text-slate-200 block">💡 कैसे काम करता है?</span>
                <p>1. ऊपर दिए गए हरे बटन से अपने WhatsApp ग्रुप्स या मैकेनिक दोस्तों को मैसेज भेजें।</p>
                <p>2. दोस्त आपके रेफरल लिंक पर क्लिक करके 2 मिनट में फ्री फॉर्म भरेंगे।</p>
                <p>3. वेरिफिकेशन होते ही आपके डैशबोर्ड पर रिवॉर्ड अनलॉक हो जाएगा।</p>
              </div>
            </div>

            {/* Shop Counter QR Code */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span>दुकान काउंटर व वैन के लिए QR कोड</span>
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="bg-white p-2.5 rounded-xl shrink-0 shadow">
                  <img
                    src={getQrCodeImageUrl(`https://truckrescueindia.in/garage/${selectedGarage.id}`, 240)}
                    alt="Garage QR Code"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-white text-sm">{selectedGarage.garageName}</h4>
                  <p className="text-xs text-slate-400">
                    इस QR कोड को प्रिंट करके अपने काउंटर या ऑन-रोड सर्विस वैन पर लगाएं ताकि ड्राइवर सीधे स्कैन करके कॉल कर सकें।
                  </p>
                  <a
                    href={getQrCodeImageUrl(`https://truckrescueindia.in/garage/${selectedGarage.id}`, 320)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700"
                  >
                    📥 Download Printable QR
                  </a>
                </div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                ⚠️ <strong>सुरक्षा सूचना:</strong> स्वयं का फोन नंबर या डुप्लीकेट अकाउंट रेफर करने की अनुमति नहीं है। केवल वास्तविक कार्यरत वर्कशॉप को ही जोड़ें।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GARAGE PROFILE & SERVICES (ORIGINAL FORM PRESERVED) */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Basic Info & Location */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-400" />
              <span>Workshop Information & Map Location</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Garage / Business Name</label>
                <input
                  type="text"
                  value={selectedGarage.garageName}
                  onChange={(e) => setSelectedGarage({ ...selectedGarage, garageName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={selectedGarage.ownerName}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, ownerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Calling Phone (+91)</label>
                  <input
                    type="tel"
                    value={selectedGarage.phone}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={selectedGarage.whatsapp}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, whatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Highway Name / Corridor</label>
                  <input
                    type="text"
                    value={selectedGarage.highway || ''}
                    placeholder="e.g. NH 48, KM 45"
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, highway: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    value={selectedGarage.city}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">District</label>
                  <input
                    type="text"
                    value={selectedGarage.district}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={selectedGarage.pincode}
                    onChange={(e) => setSelectedGarage({ ...selectedGarage, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Road / Landmark Address</label>
                <input
                  type="text"
                  value={selectedGarage.address}
                  onChange={(e) => setSelectedGarage({ ...selectedGarage, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-2">
                <LocationPicker
                  latitude={selectedGarage.latitude}
                  longitude={selectedGarage.longitude}
                  onChange={(lat, lon) => {
                    setSelectedGarage({ ...selectedGarage, latitude: lat, longitude: lon });
                  }}
                />
              </div>
            </div>
          </div>

          {/* Services & Vehicle Brands */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-400" />
              <span>Services & Vehicle Brands</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Services Offered (Click to toggle)</label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const active = selectedGarage.services.includes(cat.label);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleArrayItem('services', cat.label)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                          active
                            ? 'bg-orange-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Vehicle Brands Handled</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  {TRUCK_BRANDS.map((brand) => {
                    const active = selectedGarage.brands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleArrayItem('brands', brand)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition ${
                          active
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photos Management */}
              <div className="pt-2">
                <label className="block text-xs text-slate-400 mb-1.5">Workshop & Equipment Photos</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newPhotoInput}
                    onChange={(e) => setNewPhotoInput(e.target.value)}
                    placeholder="Paste photo image URL..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shrink-0"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedGarage.photos.map((p, idx) => (
                    <div key={idx} className="relative group w-24 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={p} alt="Workshop" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition shadow-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Publish Updates'}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
