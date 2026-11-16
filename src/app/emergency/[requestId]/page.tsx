'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import { 
  fetchEmergencyRequestById, 
  subscribeEmergencyRequest, 
  cancelEmergencyRequest 
} from '@/lib/emergencyService';
import { EmergencyRequest, EmergencyStatus } from '@/lib/types';
import { EMERGENCY_STATUS_DISPLAY, BREAKDOWN_CATEGORIES } from '@/lib/constants';
import { 
  Siren, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Wrench, 
  ShieldCheck, 
  Loader2, 
  X, 
  ChevronRight,
  Radio,
  ExternalLink,
  Flame,
  AlertCircle
} from 'lucide-react';

const STEPS: { status: EmergencyStatus; label: string; hindi: string; icon: any }[] = [
  { status: 'searching', label: 'Searching Mechanics', hindi: 'मैकेनिक खोज रहे हैं', icon: Radio },
  { status: 'accepted', label: 'Mechanic Assigned', hindi: 'मैकेनिक कन्फर्म', icon: ShieldCheck },
  { status: 'mechanic_on_way', label: 'On The Way', hindi: 'रास्ते में है', icon: Truck },
  { status: 'reached_location', label: 'Reached Breakdown', hindi: 'मौके पर पहुँचा', icon: MapPin },
  { status: 'work_in_progress', label: 'Repair Underway', hindi: 'रिपेयरिंग चालू है', icon: Wrench },
  { status: 'completed', label: 'Assistance Done', hindi: 'सफलतापूर्वक पूर्ण', icon: CheckCircle2 }
];

export default function EmergencyTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLanguage();
  const isHindi = lang === 'hi';

  const requestId = params?.requestId as string;

  const [request, setRequest] = useState<EmergencyRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Found local mechanic / Vehicle started');
  const [cancelling, setCancelling] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!requestId) return;

    setLoading(true);
    const unsubscribe = subscribeEmergencyRequest(
      requestId,
      (data) => {
        if (data) {
          setRequest(data);
          setLoading(false);
        } else {
          // If not found yet, retry initial fetch
          fetchEmergencyRequestById(requestId).then(res => {
            setRequest(res);
            setLoading(false);
          });
        }
      },
      (err) => {
        console.warn('Real-time subscription error:', err);
        setLoading(false);
      }
    );

    // Backup polling every 4 seconds to guarantee fresh data
    const interval = setInterval(async () => {
      const refreshed = await fetchEmergencyRequestById(requestId);
      if (refreshed) {
        setRequest(refreshed);
      }
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [requestId]);

  const handleCancel = async () => {
    if (!request) return;
    setCancelling(true);
    try {
      const updated = await cancelEmergencyRequest(
        request.id,
        'driver',
        cancelReason,
        request.driverName || request.driverPhone
      );
      setRequest(updated);
      setCancelModalOpen(false);
    } catch (e: any) {
      alert(e.message || 'Failed to cancel request');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-white">Loading Live Breakdown Tracking...</h2>
          <p className="text-zinc-400 text-sm mt-1">Connecting to Emergency Operations System</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-white">Emergency Request Not Found</h1>
          <p className="text-zinc-400 text-sm mt-2 mb-6">
            We could not locate request ID <span className="font-mono text-amber-400 font-bold">{requestId}</span>. It may have expired or been removed.
          </p>
          <Link
            href="/emergency/new"
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg"
          >
            Create New SOS Request
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryObj = BREAKDOWN_CATEGORIES.find(c => c.id === request.breakdownCategory);
  const statusInfo = EMERGENCY_STATUS_DISPLAY[request.status] || {
    label: request.status,
    hindi: request.status,
    color: 'bg-zinc-700 text-white',
    step: 1
  };

  // Find step index
  const currentStepIndex = STEPS.findIndex(s => s.status === request.status);
  const isCancelled = request.status === 'cancelled';
  const isCompleted = request.status === 'completed';

  // Format mechanic phone for WhatsApp and Call
  const rawPhone = request.assignedGaragePhone ? request.assignedGaragePhone.replace(/[^0-9]/g, '') : '';
  const waNumber = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* TOP STATUS BAR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black tracking-wider text-yellow-400">
                    {request.requestId}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                    {isHindi ? statusInfo.hindi : statusInfo.label}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Logged on {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Priority: <strong className="text-red-400 uppercase">{request.priority}</strong>
                </p>
              </div>
            </div>

            {/* Cancel Button if not completed/cancelled */}
            {!isCompleted && !isCancelled && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-xs font-semibold text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/50 px-3 py-1.5 rounded-xl transition-all self-start sm:self-center"
              >
                {isHindi ? 'अनुरोध रद्द करें' : 'Cancel Request'}
              </button>
            )}
          </div>

          {/* REAL-TIME RADAR SEARCHING BANNER */}
          {request.status === 'searching' && (
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-zinc-900 border border-amber-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400">
                  <Radio className="w-6 h-6 text-yellow-300 animate-spin" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-yellow-300">
                    {isHindi ? 'नजदीकी मैकेनिकों को अलर्ट भेजा गया है...' : 'Broadcasting SOS to Nearby Mechanics & Rescue Vans...'}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Your breakdown location on <strong className="text-white">{request.highway || request.city}</strong> has been sent to verified heavy truck workshops within {request.searchRadiusKm || 50} km. The first available mechanic will accept.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CANCELLATION NOTICE */}
          {isCancelled && (
            <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-4 mb-6 text-red-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">This breakdown request was cancelled</h4>
                  <p className="text-xs text-red-300 mt-0.5">
                    Reason: {request.cancellationReason || 'Cancelled by driver'} (by {request.cancelledBy || 'Driver'})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE STEPPER */}
          {!isCancelled && (
            <div className="py-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isPast = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  let badgeStyle = 'bg-zinc-950 border-zinc-800 text-zinc-500';
                  if (isPast) {
                    badgeStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-400';
                  } else if (isCurrent) {
                    badgeStyle = 'bg-amber-950/80 border-amber-400 text-yellow-300 ring-2 ring-yellow-400/30';
                  }

                  return (
                    <div
                      key={step.status}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${badgeStyle}`}
                    >
                      <div className="mb-1.5">
                        <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-bounce text-yellow-300' : ''}`} />
                      </div>
                      <span className="text-[11px] font-bold leading-tight">
                        {isHindi ? step.hindi : step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] uppercase font-black tracking-widest text-amber-400 mt-1">
                          Current Stage
                        </span>
                      )}
                      {isPast && (
                        <span className="text-[9px] font-bold text-emerald-500 mt-1">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ASSIGNED MECHANIC / GARAGE CARD */}
        {request.assignedGarageName && (
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-emerald-500/60 rounded-2xl p-6 shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {isHindi ? 'नियुक्त मैकेनिक व वर्कशॉप' : 'Assigned Rescue Partner'}
                </h3>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Active Partner
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-black text-white">
                  {request.assignedGarageName}
                </h4>
                <p className="text-sm text-zinc-300 mt-0.5">
                  Mechanic in Charge: <strong className="text-yellow-400">{request.assignedMechanicName || 'Master Heavy Technician'}</strong>
                </p>
                {request.assignedGarageDistanceKm && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Estimated Distance: <strong className="text-white font-mono">{request.assignedGarageDistanceKm.toFixed(1)} km</strong> to your breakdown location
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS: Direct Call, WhatsApp & Navigation */}
              <div className="flex flex-wrap items-center gap-3">
                {request.assignedGaragePhone && (
                  <>
                    <a
                      href={`tel:${request.assignedGaragePhone}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-3 rounded-xl shadow-lg transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{isHindi ? 'मैकेनिक को कॉल करें' : 'CALL MECHANIC'}</span>
                    </a>

                    <a
                      href={`https://wa.me/${waNumber}?text=Hello%2C%20regarding%20Emergency%20Truck%20Breakdown%20${request.requestId}%20for%20vehicle%20${encodeURIComponent(request.vehicleNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-3 rounded-xl shadow-lg transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${request.latitude},${request.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl shadow-lg transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{isHindi ? 'नेविगेशन' : 'Breakdown Map'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* DETAILS GRID: Vehicle & Breakdown Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Vehicle Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isHindi ? 'ट्रक विवरण' : 'Vehicle Details'}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Truck Number:</span>
                <span className="font-mono font-bold text-yellow-400 text-base">{request.vehicleNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Brand & Model:</span>
                <span className="font-semibold text-white">{request.vehicleBrand} ({request.vehicleModel})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fuel / Emission:</span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold text-white">{request.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Requested Service:</span>
                <span className="text-zinc-200 capitalize">{request.requestedService.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Driver Phone:</span>
                <a href={`tel:${request.driverPhone}`} className="text-emerald-400 font-mono font-bold">{request.driverPhone}</a>
              </div>
            </div>
          </div>

          {/* Breakdown Issue Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
              <Wrench className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isHindi ? 'खराबी विवरण' : 'Reported Breakdown Issue'}
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Category:</span>
                <span className="bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded text-xs border border-red-800">
                  {categoryObj?.label || request.breakdownCategory}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block text-xs mb-1">Symptoms / Description:</span>
                <p className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-300 italic">
                  {request.description || 'No specific description provided. Mechanic inspection required on site.'}
                </p>
              </div>

              {/* Photos Thumbnails */}
              {request.photos && request.photos.length > 0 && (
                <div className="mt-3">
                  <span className="text-zinc-400 block text-xs mb-1.5">Breakdown Photos:</span>
                  <div className="flex gap-2">
                    {request.photos.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedPhoto(p)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-700 hover:border-yellow-400 transition-all"
                      >
                        <img src={p} alt="Breakdown" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOCATION & LANDMARK CARD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isHindi ? 'लोकेशन व लैंडमार्क' : 'Spot Location & Directions'}
              </h3>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-semibold"
            >
              <span>Open in Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-400">Highway & Road:</p>
              <p className="font-bold text-white">{request.highway || 'State Highway / Corridor'}</p>

              <p className="text-xs text-zinc-400 mt-2">Landmark:</p>
              <p className="font-medium text-zinc-200">{request.landmark || 'Near highway mile marker'}</p>
            </div>

            <div>
              <p className="text-xs text-zinc-400">Address / City:</p>
              <p className="font-medium text-zinc-200">{request.city}, {request.state} - {request.pincode}</p>

              <p className="text-xs text-zinc-400 mt-2">GPS Coordinates:</p>
              <p className="font-mono text-xs text-yellow-400">{request.latitude.toFixed(5)}, {request.longitude.toFixed(5)}</p>
            </div>
          </div>
        </div>

        {/* STATUS HISTORY TIMELINE AUDIT */}
        {request.statusHistory && request.statusHistory.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isHindi ? 'लाइव स्टेटस लॉग' : 'Live Incident History'}
              </h3>
            </div>

            <div className="space-y-3">
              {request.statusHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-white uppercase text-[11px]">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-zinc-300">{item.note}</p>
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      Updated by {item.updatedBy} ({item.role || 'system'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEED IMMEDIATE HELP BANNER */}
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="text-sm font-bold text-white">Need Emergency Helpline Support?</p>
            <p className="text-xs text-zinc-400">Call Truck Rescue India 24x7 Control Room for highway police or crane assistance.</p>
          </div>
          <a
            href="tel:18001234567"
            className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 font-bold px-4 py-2 rounded-xl border border-yellow-400/30 text-xs transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Toll-Free 1800-123-4567</span>
          </a>
        </div>
      </main>

      {/* CANCEL MODAL */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Cancel Breakdown Request?</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Please tell us why you want to cancel so we can alert the assigned mechanic or cancel the broadcast.
            </p>

            <div className="space-y-2 mb-4">
              {[
                'Found local mechanic / Vehicle started',
                'Arranged alternative towing / assistance',
                'Submitted by mistake',
                'Other reason'
              ].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setCancelReason(r)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    cancelReason === r
                      ? 'bg-red-950/60 border-red-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold"
              >
                Keep Request
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img src={selectedPhoto} alt="Breakdown Full" className="w-full h-auto object-contain max-h-[80vh]" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
