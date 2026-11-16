'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PhoneCall, 
  MessageSquare, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Star, 
  MapPin, 
  Wrench, 
  Cpu, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign,
  ChevronRight,
  Send,
  Flag,
  X,
  ShieldAlert,
  Award,
  CornerDownRight,
  Camera,
  ThumbsUp,
  AlertTriangle,
  FileText,
  QrCode
} from 'lucide-react';
import { fetchGarageById, reportGarage } from '@/lib/garageService';
import { fetchReviewsForGarage, submitReview, reportReview } from '@/lib/reviewService';
import { createComplaint } from '@/lib/complaintService';
import { Garage, Review } from '@/lib/types';
import { calculateDistanceKm, formatDistance } from '@/lib/geo';
import { getQrCodeImageUrl } from '@/lib/referralService';
import { useLanguage } from '@/components/LanguageContext';
import { useAuth } from '@/components/AuthContext';
import AdBanner from '@/components/AdBanner';

export default function GarageProfilePage() {
  const params = useParams();
  const garageId = params?.id as string;
  const { t } = useLanguage();
  const { user } = useAuth();

  const [garage, setGarage] = useState<Garage | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDist, setUserDist] = useState<number | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewVehicle, setReviewVehicle] = useState('Tata Signa 4825.TK');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState('');
  const [reviewSosId, setReviewSosId] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Report Review Modal State
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReviewReason, setReportReviewReason] = useState('Abusive or Offensive Language');
  const [reportingReviewSuccess, setReportingReviewSuccess] = useState(false);

  // Report Garage Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect Phone / Unresponsive');
  const [reportDetails, setReportDetails] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Complaint Filing Modal State
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintType, setComplaintType] = useState<'overcharging' | 'service_not_provided' | 'rude_behavior' | 'delayed_response' | 'damage_caused' | 'fake_listing' | 'other'>('overcharging');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSosId, setComplaintSosId] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // QR Code Modal State
  const [showQrModal, setShowQrModal] = useState(false);

  const loadData = async () => {
    if (!garageId) return;
    try {
      const data = await fetchGarageById(garageId);
      setGarage(data);
      const revs = await fetchReviewsForGarage(garageId);
      setReviews(revs);
    } catch (e) {
      console.warn('Error loading garage data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (garage && garage.latitude && garage.longitude) {
            const dist = calculateDistanceKm(
              pos.coords.latitude,
              pos.coords.longitude,
              garage.latitude,
              garage.longitude
            );
            setUserDist(dist);
          }
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, [garageId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto" />
        <p className="text-slate-400 text-sm">Loading garage profile details...</p>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Garage Profile Not Found</h2>
        <p className="text-xs text-slate-400">
          The garage profile you are looking for may have been removed or updated.
        </p>
        <Link
          href="/nearby"
          className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Browse Nearby Garages
        </Link>
      </div>
    );
  }

  const isOwner = user && user.uid === garage.uid;
  const isPubliclyVisible = garage.verificationStatus === 'verified' && garage.isActive;

  const rawPhone = (garage.phone || '').replace(/[^0-9]/g, '');
  const hasValidPhone = rawPhone.length >= 10;
  const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
  
  const whatsappUrl = hasValidPhone
    ? `https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(garage.garageName)},%20I%20saw%20your%20verified%20profile%20on%20Truck%20Rescue%20India.%20My%20heavy%20commercial%20vehicle%20needs%20assistance.`
    : '#';

  const directionsUrl = (garage.latitude && garage.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garage.garageName + ' ' + garage.city)}`;

  const shareOnWhatsApp = () => {
    const shareText = `*${garage.garageName}*\nVerified Heavy Commercial Vehicle Service on Truck Rescue India\nLocation: ${garage.city}, ${garage.state} (${garage.highway || ''})\nCall: ${garage.phone}\nProfile Link: ${typeof window !== 'undefined' ? window.location.href : ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Rating Distribution Calculation
  const totalReviewsCount = reviews.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let ratingTotalSum = 0;
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1|2|3|4|5;
    ratingCounts[star]++;
    ratingTotalSum += r.rating;
  });
  const computedAverage = totalReviewsCount > 0 ? (ratingTotalSum / totalReviewsCount).toFixed(1) : garage.rating.toFixed(1);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('Please provide your name and review details.');
      return;
    }

    setSubmittingReview(true);
    try {
      const newRev = await submitReview({
        garageId: garage.id,
        driverUid: user?.uid,
        driverPhone: user?.phone,
        authorName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        vehicleModel: reviewVehicle.trim() || undefined,
        emergencyRequestId: reviewSosId.trim() || undefined,
        isVerifiedService: Boolean(reviewSosId.trim()),
        photos: reviewPhotoUrl.trim() ? [reviewPhotoUrl.trim()] : []
      });

      setReviews([newRev, ...reviews]);
      setReviewSubmitted(true);
      setReviewName('');
      setReviewComment('');
      setReviewPhotoUrl('');
      setReviewSosId('');
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReportReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReviewId) return;

    try {
      await reportReview(reportingReviewId, reportReviewReason, user?.uid || 'anonymous');
      setReportingReviewSuccess(true);
      setTimeout(() => {
        setReportingReviewId(null);
        setReportingReviewSuccess(false);
      }, 2000);
    } catch (e: any) {
      alert(e.message || 'Failed to report review');
    }
  };

  const handleReportGarageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await reportGarage({
        garageId: garage.id,
        garageName: garage.garageName,
        reason: reportReason,
        details: reportDetails,
        driverPhone: reportPhone || user?.phone || '',
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportDetails('');
      }, 2500);
    } catch (e) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;
    setSubmittingComplaint(true);

    try {
      await createComplaint({
        userUid: user?.uid || 'guest_driver',
        userName: user?.phone || 'Highway Driver',
        userPhone: complaintPhone || user?.phone || '+91 99999 00000',
        garageId: garage.id,
        garageName: garage.garageName,
        emergencyRequestId: complaintSosId.trim() || undefined,
        complaintType,
        description: complaintDesc.trim(),
        evidencePhotos: []
      });
      setComplaintSuccess(true);
      setTimeout(() => {
        setShowComplaintModal(false);
        setComplaintSuccess(false);
        setComplaintDesc('');
      }, 2500);
    } catch (e: any) {
      alert(e.message || 'Failed to file complaint');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/nearby" className="hover:text-white">Nearby</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold truncate">{garage.garageName}</span>
      </nav>

      {/* Unapproved Warning Banner if owner previewing */}
      {!isPubliclyVisible && (
        <div className="bg-amber-950/80 border-2 border-amber-500/60 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-200 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block text-white font-bold">Preview Mode: Listing Pending Verification</strong>
              <span>This garage is undergoing verification by Truck Rescue India operations. It is not publicly visible in search yet.</span>
            </div>
          </div>
          {isOwner && (
            <Link
              href="/garage-dashboard"
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg shrink-0"
            >
              Open Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Main Garage Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {garage.isSponsored && (
                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  👑 SPONSORED TRUCK NETWORK PARTNER
                </span>
              )}
              {!garage.isSponsored && garage.isFeatured && (
                <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  ⭐ FEATURED RESCUE PROVIDER
                </span>
              )}

              {garage.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-black px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  VERIFIED TRUCK SERVICE PROVIDER
                </span>
              )}

              {garage.isOpen ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-900/40 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t('statusOpen')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-950/60 text-rose-300 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-800">
                  {t('statusClosed')}
                </span>
              )}

              {garage.twentyFourHours && (
                <span className="inline-flex items-center gap-1.5 bg-blue-950/60 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-800">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  24x7 Emergency Service
                </span>
              )}

              {garage.mobileService && (
                <span className="inline-flex items-center gap-1.5 bg-amber-950/60 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-800">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Mobile Roadside Van
                </span>
              )}

              {garage.providerCategory && (
                <span className="inline-flex items-center gap-1.5 bg-purple-950/60 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full border border-purple-800 uppercase">
                  <Wrench className="w-3.5 h-3.5 text-purple-400" />
                  {garage.providerCategory.replace(/_/g, ' ')}
                </span>
              )}

              {garage.workingHours && (
                <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {garage.workingHours}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              {garage.garageName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="text-slate-400">
                Owner / Expert: <strong className="text-white font-bold">{garage.ownerName}</strong>
              </span>

              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-white">{computedAverage}</span>
                <span className="text-slate-400">({totalReviewsCount} driver reviews)</span>
              </div>

              {userDist !== null && (
                <span className="text-orange-400 font-bold bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/60">
                  {formatDistance(userDist)}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{garage.address}, {garage.city}, {garage.state} - {garage.pincode}</span>
              </div>
              {garage.highway && (
                <div className="text-xs text-amber-300 font-semibold pl-6">
                  Highway Corridor: <span className="text-white font-bold">{garage.highway}</span>
                </div>
              )}
            </div>
          </div>

          {/* Share & Report Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl transition border border-slate-700"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Share</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700"
              title="Workshop QR Code"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => setShowComplaintModal(true)}
              className="flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold px-3 py-2 rounded-xl transition border border-amber-800/60"
              title="File formal dispute"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>File Dispute</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1.5 bg-slate-800/60 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl transition border border-slate-700"
              title="Report listing issue"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* HIGH CONTRAST BIG DRIVER CALL TO ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800">
          {hasValidPhone ? (
            <a
              href={`tel:${garage.phone}`}
              className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-95 text-base sm:text-lg"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>DIRECT CALL ({garage.phone})</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-3 bg-slate-800 text-slate-500 font-bold py-4 px-6 rounded-2xl opacity-60 cursor-not-allowed text-base"
            >
              <PhoneCall className="w-6 h-6" />
              <span>NO PHONE AVAILABLE</span>
            </button>
          )}

          {hasValidPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-95 text-base sm:text-lg"
            >
              <MessageSquare className="w-6 h-6 fill-slate-950" />
              <span>WHATSAPP CHAT</span>
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-3 bg-slate-800 text-slate-500 font-bold py-4 px-6 rounded-2xl opacity-60 cursor-not-allowed text-base"
            >
              <MessageSquare className="w-6 h-6" />
              <span>NO WHATSAPP</span>
            </button>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-95 text-base sm:text-lg"
          >
            <Navigation className="w-6 h-6" />
            <span>GOOGLE MAPS</span>
          </a>
        </div>
      </div>

      {/* Workshop Photos */}
      {garage.photos && garage.photos.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Workshop & Equipment Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {garage.photos.map((photo, idx) => (
              <div key={idx} className="h-56 rounded-2xl overflow-hidden border border-slate-800 shadow-lg bg-slate-900">
                <img
                  src={photo}
                  alt={`${garage.garageName} photo ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Services & Capabilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            <span>Services & Repair Capabilities</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {garage.services.map((service, idx) => (
              <span
                key={idx}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Brands & Advanced Equipment */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Supported Commercial Brands</h3>
            <div className="flex flex-wrap gap-2">
              {garage.brands.map((brand, idx) => (
                <span
                  key={idx}
                  className="bg-orange-950/40 border border-orange-800/60 text-orange-300 text-xs px-2.5 py-1 rounded-lg font-semibold"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Scanners & Tools</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {garage.equipment.map((eq, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-slate-800 text-emerald-300 text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1"
                >
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>{eq}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Description */}
      {garage.description && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2">
          <h3 className="text-base font-bold text-white">About This Workshop</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{garage.description}</p>
        </div>
      )}

      {/* Non-intrusive Ad Banner in garage profile */}
      <AdBanner placement="garage_profile" />

      {/* PHASE 5: CUSTOMER REVIEWS & RATING BREAKDOWN */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>Driver Reviews & Ratings ({reviews.length})</span>
          </h2>
        </div>

        {/* Detailed Rating Breakdown Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Aggregate Score Card */}
            <div className="text-center md:border-r border-slate-800 md:pr-6">
              <div className="text-5xl font-black text-white">{computedAverage}</div>
              <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= Math.round(Number(computedAverage)) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">Based on {totalReviewsCount} driver experiences</p>
            </div>

            {/* Progress Bars for 5 down to 1 star */}
            <div className="col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingCounts[star as 1|2|3|4|5] || 0;
                const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-14 text-slate-300 font-semibold">{star} Star</span>
                    <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="w-16 text-right text-slate-400">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            <span>Share Your Highway Rescue Experience (अपनी राय लिखें)</span>
          </h3>

          {reviewSubmitted && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your review has been added for other truck captains.</span>
            </div>
          )}

          {reviewError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{reviewError}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Your Name / Fleet (नाम)</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Jaswinder Singh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Vehicle Model (गाड़ी मॉडल)</label>
                <input
                  type="text"
                  value={reviewVehicle}
                  onChange={(e) => setReviewVehicle(e.target.value)}
                  placeholder="e.g. Tata Signa 4825.TK"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-orange-500"
                >
                  <option value={5}>★★★★★ 5 Stars (Excellent Service)</option>
                  <option value={4}>★★★★☆ 4 Stars (Good Service)</option>
                  <option value={3}>★★★☆☆ 3 Stars (Average)</option>
                  <option value={2}>★★☆☆☆ 2 Stars (Needs Improvement)</option>
                  <option value={1}>★☆☆☆☆ 1 Star (Poor Experience)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Emergency SOS ID (Optional - for Verified Badge)</label>
                <input
                  type="text"
                  value={reviewSosId}
                  onChange={(e) => setReviewSosId(e.target.value)}
                  placeholder="e.g. SOS-83921 (Optional)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Service Photo URL (Optional)</label>
                <input
                  type="url"
                  value={reviewPhotoUrl}
                  onChange={(e) => setReviewPhotoUrl(e.target.value)}
                  placeholder="https://... photo of repair or bill"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Your Experience / Review</label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Mention response time, scanner diagnosis accuracy, charges transparency, and repair quality..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
            >
              {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Post Review (रिव्यू भेजें)</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-sm">{rev.authorName}</span>
                  {rev.vehicleModel && (
                    <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {rev.vehicleModel}
                    </span>
                  )}
                  {rev.isVerifiedService && (
                    <span className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      ✓ Verified Highway Service
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <button
                    onClick={() => setReportingReviewId(rev.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                    title="Report abusive review"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{rev.comment}</p>

              {/* Review Photos */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {rev.photos.map((p, idx) => (
                    <a key={idx} href={p} target="_blank" rel="noopener noreferrer" className="block w-20 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                      <img src={p} alt="Review attachment" className="w-full h-full object-cover hover:scale-105 transition" />
                    </a>
                  ))}
                </div>
              )}

              {/* Owner Reply Block */}
              {rev.ownerReply && (
                <div className="mt-2 pl-4 border-l-2 border-orange-500 bg-slate-950/50 rounded-r-xl p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-orange-400 font-bold">
                      <CornerDownRight className="w-3 h-3" />
                      Response from Workshop Owner ({rev.ownerReply.ownerName || 'Garage Owner'})
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(rev.ownerReply.repliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 italic">{rev.ownerReply.text}</p>
                </div>
              )}

              <div className="text-[10px] text-slate-500">
                {rev.createdAt.includes('T') ? new Date(rev.createdAt).toLocaleDateString() : rev.createdAt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT REVIEW MODAL */}
      {reportingReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white space-y-4">
            <button
              onClick={() => setReportingReviewId(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Report Customer Review</h3>
                <p className="text-xs text-slate-400">Flag abusive, fake, or extortionary review content</p>
              </div>
            </div>

            {reportingReviewSuccess ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs text-center font-bold">
                ✓ Flag recorded. Our moderation team will investigate.
              </div>
            ) : (
              <form onSubmit={handleReportReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reason for Reporting</label>
                  <select
                    value={reportReviewReason}
                    onChange={(e) => setReportReviewReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Abusive or Offensive Language">Abusive or Offensive Language</option>
                    <option value="Fake Review / Never visited garage">Fake Review / Never visited garage</option>
                    <option value="Extortion / Threatening behavior">Extortion / Threatening behavior</option>
                    <option value="Competitor sabotage">Competitor sabotage</option>
                    <option value="Spam / Advertisements">Spam / Advertisements</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingReviewId(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition shadow"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FILE OFFICIAL COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white space-y-4">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">File Official Dispute / Complaint</h3>
                <p className="text-xs text-slate-400">Escalate directly to Truck Rescue India Operations Desk</p>
              </div>
            </div>

            {complaintSuccess ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs text-center font-bold">
                ✓ Complaint registered. A case officer will investigate and contact you within 24 hours.
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dispute Type</label>
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="overcharging">Excessive Overcharging / Billing Fraud</option>
                    <option value="service_not_provided">Service Not Provided After Quoting</option>
                    <option value="damage_caused">Vehicle Damage Caused During Towing/Repair</option>
                    <option value="rude_behavior">Rude / Hostile Behavior on Highway</option>
                    <option value="delayed_response">Unreasonable Delay (&gt;2 Hours)</option>
                    <option value="fake_listing">Fake Listing or Unauthorized Mechanic</option>
                    <option value="other">Other Commercial Dispute</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={complaintPhone}
                    onChange={(e) => setComplaintPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Emergency SOS ID (if applicable)</label>
                  <input
                    type="text"
                    value={complaintSosId}
                    onChange={(e) => setComplaintSosId(e.target.value)}
                    placeholder="e.g. SOS-83921"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detailed Explanation</label>
                  <textarea
                    rows={3}
                    required
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="State what occurred, amounts charged, time of breakdown..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowComplaintModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingComplaint}
                    className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow"
                  >
                    {submittingComplaint ? 'Submitting...' : 'Register Formal Dispute'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT GARAGE MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white space-y-4">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Report This Garage Listing</h3>
                <p className="text-xs text-slate-400">Reports are reviewed directly by our verification desk</p>
              </div>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs text-center font-bold">
                ✓ Report submitted. Thank you for keeping the highway network reliable!
              </div>
            ) : (
              <form onSubmit={handleReportGarageSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Incorrect Phone / Unresponsive">Incorrect Phone Number / Unresponsive</option>
                    <option value="Fraudulent Charges / Unfair Billing">Fraudulent Charges / Unfair Billing</option>
                    <option value="Location Mismatch on Highway">Location Mismatch on Highway</option>
                    <option value="Workshop Closed Permanently">Workshop Closed Permanently</option>
                    <option value="Incompetent Repair / Broken Tools">Incompetent Repair / Broken Tools</option>
                    <option value="Other Issue">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Additional Details</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Describe what occurred during your breakdown call..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    value={reportPhone}
                    onChange={(e) => setReportPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition shadow"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* QR Code Share Modal */}
      {showQrModal && garage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-400" />
                <span>Workshop QR Code</span>
              </h3>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-md">
              <img
                src={getQrCodeImageUrl(`https://truckrescueindia.in/garage/${garage.id}`, 240)}
                alt={`${garage.garageName} QR Code`}
                className="w-48 h-48 object-contain mx-auto"
              />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">{garage.garageName}</h4>
              <p className="text-xs text-slate-400">
                Scan with any smartphone camera or UPI scanner to open this garage's live roadside assistance profile.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={getQrCodeImageUrl(`https://truckrescueindia.in/garage/${garage.id}`, 400)}
                target="_blank"
                rel="noreferrer"
                download={`${garage.garageName}_QR.png`}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-lg"
              >
                📥 Download High-Res QR Image
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://truckrescueindia.in/garage/${garage.id}`);
                  alert('Profile URL copied to clipboard!');
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition text-xs border border-slate-700"
              >
                Copy Profile Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
