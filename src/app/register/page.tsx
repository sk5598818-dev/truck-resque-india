'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, 
  Building2, 
  MapPin, 
  Wrench, 
  Cpu, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2,
  Phone,
  MessageSquare,
  Share2,
  QrCode,
  Copy,
  Gift,
  Shield,
  Award
} from 'lucide-react';
import { registerNewGarage } from '@/lib/garageService';
import LocationPicker from '@/components/LocationPicker';
import { TOP_HIGHWAYS, SERVICE_CATEGORIES, TRUCK_BRANDS, DIAGNOSTIC_EQUIPMENT, PROVIDER_CATEGORIES } from '@/lib/constants';
import { GarageType, ProviderCategory, RegistrationSource } from '@/lib/types';
import { getAllIndianStates, getDistrictsByState } from '@/lib/indiaGeoData';
import { buildWhatsAppInviteLink, getQrCodeImageUrl } from '@/lib/referralService';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');
  const refCodeParam = searchParams.get('ref') || '';

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner
    ownerName: '',
    phone: '',
    whatsapp: '',
    referredBy: refCodeParam,
    registrationSource: (refCodeParam ? 'referral' : 'direct') as RegistrationSource,
    otpVerified: false,
    otpInput: '',
    showOtpModal: false,

    // Step 2: Garage
    garageName: '',
    garageType: 'workshop' as GarageType,
    providerCategory: 'workshop' as ProviderCategory,
    experienceYears: 5,
    description: '',
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
    ],
    newPhotoUrl: '',

    // Step 3: Address
    state: 'Maharashtra',
    district: 'Thane (Bhiwandi)',
    city: '',
    area: '',
    highway: 'NH 48',
    landmark: '',
    pincode: '',
    latitude: 19.2968,
    longitude: 73.0631,

    // Step 4: Services
    services: initialRole === 'electrician' ? ['Truck Electrician', 'Wiring Harness Repair'] :
              initialRole === 'scanner' ? ['Laptop Diagnostic / Fault Codes', 'OBD / Scanner Diagnostic'] :
              initialRole === 'ecm' ? ['ECM / ECU Flashing & Repair', 'BS4 / BS6 Emission Expert'] :
              initialRole === 'tyre' ? ['Tyre Puncture & Replacement'] :
              initialRole === 'towing' ? ['Hydraulic Crane & Towing Service'] :
              initialRole === 'parts' ? ['Heavy Vehicle Spare Parts'] :
              ['Heavy Truck Mechanic'],
    brands: ['Tata Motors (Prima, Signa, LPT)', 'Ashok Leyland (AVTR, Ecomet, Captain)'],

    // Step 5: Equipment
    equipment: ['Cummins INLINE 6 / 7 Diagnostic Adapter', 'Tata INSITE / e-Diagnostic System'],

    // Step 6: Availability
    isOpen: true,
    twentyFourHours: true,
    mobileService: true,
    workingHours: '24 Hours',
    serviceRadiusKm: 50,
    normalCharges: '₹ 800 - ₹ 2,000 based on job',
    emergencyCharges: '₹ 1,500 inspection on highway',
  });

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (field: 'services' | 'brands' | 'equipment', item: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const handleAddPhoto = () => {
    if (formData.newPhotoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, prev.newPhotoUrl.trim()],
        newPhotoUrl: ''
      }));
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx)
    }));
  };

  const handleOtpVerify = () => {
    if (formData.otpInput === '123456' || formData.otpInput.length === 6) {
      updateField('otpVerified', true);
      alert('Mobile verified successfully!');
    } else {
      alert('Please enter a 6-digit OTP (e.g. 123456 for test mode)');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const created = await registerNewGarage({
        uid: `owner_${formData.phone.replace(/[^0-9]/g, '') || Math.random().toString(36).substring(2, 8)}`,
        ownerName: formData.ownerName,
        providerCategory: formData.providerCategory,
        experienceYears: Number(formData.experienceYears) || 0,
        workingHours: formData.workingHours,
        referredBy: formData.referredBy || undefined,
        registrationSource: formData.registrationSource,
        isRoadsideVanAvailable: formData.mobileService,
        scannerDiagnosticAvailable: formData.services.some(s => /scanner|diagnostic/i.test(s)) || formData.equipment.some(e => /scanner|inline|obd/i.test(e)),
        bs6ExpertAvailable: formData.services.some(s => /bs6|urea|dpf|scr|nox/i.test(s)),
        truckElectricianAvailable: formData.services.some(s => /electrician|wiring/i.test(s)),
        phone: formData.phone.startsWith('+91') ? formData.phone : `+91${formData.phone}`,
        whatsapp: formData.whatsapp.startsWith('+91') ? formData.whatsapp : `+91${formData.whatsapp || formData.phone}`,
        garageName: formData.garageName,
        garageType: formData.garageType,
        description: formData.description || 'Specialist truck repair and diagnostic center.',
        services: formData.services,
        brands: formData.brands,
        equipment: formData.equipment,
        address: `${formData.area}, ${formData.landmark ? formData.landmark + ', ' : ''}${formData.city}`,
        state: formData.state,
        district: formData.district || formData.city,
        city: formData.city,
        area: formData.area,
        highway: formData.highway,
        landmark: formData.landmark,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        geohash: '',
        serviceRadiusKm: formData.serviceRadiusKm,
        mobileService: formData.mobileService,
        twentyFourHours: formData.twentyFourHours,
        isOpen: formData.isOpen,
        photos: formData.photos,
        normalCharges: formData.normalCharges,
        emergencyCharges: formData.emergencyCharges,
      });

      setRegistrationSuccess(created);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (registrationSuccess) {
    const inviteLink = buildWhatsAppInviteLink(registrationSuccess);
    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/garage/${registrationSuccess.id}` : `https://truckrescueindia.in/garage/${registrationSuccess.id}`;
    const qrUrl = getQrCodeImageUrl(publicUrl, 260);

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>100% Free Lifetime Registration Confirmed (मुफ़्त रजिस्ट्रेशन)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Workshop Registered Successfully!</h1>
          <p className="text-slate-300 text-sm">
            Welcome to <strong className="text-orange-400">TRUCK RESCUE INDIA</strong> network.
          </p>
        </div>

        {/* Unique Referral & Viral Growth Card */}
        <div className="bg-gradient-to-br from-orange-950/60 to-slate-900 border border-orange-500/40 p-6 rounded-2xl text-left space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Award className="w-5 h-5" />
              <span>आपका पर्सनल रेफरल कोड (Referral Code):</span>
            </div>
            <span className="text-[11px] bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full font-bold">
              Active
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 p-2.5 rounded-xl">
            <span className="font-mono font-black text-lg text-white tracking-wider flex-1 text-center">
              {registrationSuccess.referralCode || 'TRI-IN-1001'}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(registrationSuccess.referralCode || '');
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-lg transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            📢 अपने साथी मैकेनिकों, इलेक्ट्रीशियन व क्रेन ऑपरेटरों को WhatsApp पर इनवाइट करें। हर सफल रजिस्ट्रेशन पर आपको मिलेगा <strong>फ्री 30-डे फीचर्ड बैज</strong>!
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl transition shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp पर साथी मैकेनिक को इनवाइट करें</span>
            </a>
          </div>
        </div>

        {/* QR Code and Garage Details Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-800 pb-4">
            <div className="bg-white p-2 rounded-xl shrink-0 shadow">
              <img src={qrUrl} alt="Garage QR Code" className="w-24 h-24 object-contain" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
                <QrCode className="w-3.5 h-3.5 text-orange-400" />
                <span>दुकान का क्यूआर कोड (Workshop QR Code)</span>
              </div>
              <h3 className="font-bold text-white text-base">{registrationSuccess.garageName}</h3>
              <p className="text-xs text-slate-400">
                ड्राइवर इस QR को स्कैन करके सीधे आपकी दुकान का पेज खोल सकते हैं और कॉल कर सकते हैं।
              </p>
              <a
                href={qrUrl}
                download={`${registrationSuccess.garageName}_QR.png`}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-orange-400 hover:underline pt-1"
              >
                📥 Download Printable QR
              </a>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Registration ID:</span>
              <span className="font-mono text-orange-400 font-bold">{registrationSuccess.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Verification Status:</span>
              <span className="font-bold text-amber-400 uppercase">Verification Pending (1-2 Hours)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Primary Contact:</span>
              <span className="font-bold text-white">{registrationSuccess.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-bold text-white">{registrationSuccess.city}, {registrationSuccess.state}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => router.push(`/garage/${registrationSuccess.id}`)}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg"
          >
            View Public Profile
          </button>
          <button
            onClick={() => router.push('/garage-dashboard')}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            Go to Garage Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GARAGE & SERVICE PROVIDER ONBOARDING</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          Register Your Truck Garage / Service Shop
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Step-by-step registration for Mechanics, Electricians, Scanner Specialists & Towing Providers
        </p>
      </div>

      {/* 100% Free Lifetime Registration Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>100% मुफ़्त लाइफटाइम रजिस्ट्रेशन</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-black">
                ₹0 FOREVER
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              कॉल और ब्रेकडाउन काम पर कोई कमीशन नहीं। सभी 36 भारतीय राज्यों व केंद्र शासित प्रदेशों के लिए हमेशा मुफ़्त।
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap">
          <Shield className="w-3.5 h-3.5" />
          <span>Zero Platform Commission</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-slate-900/60 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-slate-200">डेटा व गोपनीयता सुरक्षा:</strong> आपके व्यक्तिगत पहचान पत्र और दस्तावेज 100% सुरक्षित व एन्क्रिप्टेड हैं। यह कभी भी ड्राइवरों या किसी तीसरे पक्ष को सार्वजनिक रूप से नहीं दिखाए जाएंगे।
        </span>
      </div>

      {/* Step Progress Tracker */}
      <div className="grid grid-cols-6 gap-2 text-center text-xs">
        {[
          { num: 1, label: 'Owner' },
          { num: 2, label: 'Garage' },
          { num: 3, label: 'Address' },
          { num: 4, label: 'Services' },
          { num: 5, label: 'Tools' },
          { num: 6, label: 'Review' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`py-2 px-1 rounded-xl font-bold border transition ${
              currentStep === s.num
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                : currentStep > s.num
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span className="block text-sm sm:text-base font-black">{s.num}</span>
            <span className="hidden sm:block text-[11px] font-medium">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Container Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* STEP 1: OWNER INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 1: Owner Information</h2>
                <p className="text-xs text-slate-400">Enter owner or workshop manager contact details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner Full Name (मालिक का पूरा नाम) *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  placeholder="e.g. Gurmeet Singh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Calling Mobile Number (कॉलिंग नंबर) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="10-digit mobile (e.g. 9820123456)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  WhatsApp Number (व्हाट्सएप नंबर)
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Leave empty if same as calling number"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile OTP Verification
                </label>
                {formData.otpVerified ? (
                  <div className="h-[46px] flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-4 rounded-xl text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Mobile Number Verified</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.otpInput}
                      onChange={(e) => updateField('otpInput', e.target.value)}
                      placeholder="Enter 123456"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleOtpVerify}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 rounded-xl transition shrink-0"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </div>

              {/* Referral Code */}
              <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Referral / Invitation Code (रेफरल कोड - यदि किसी साथी मैकेनिक ने इनवाइट किया हो)</span>
                  <span className="text-[11px] text-slate-500 font-normal">Optional</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.referredBy}
                    onChange={(e) => updateField('referredBy', e.target.value.toUpperCase().trim())}
                    placeholder="e.g. TRI-MH-8291"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-orange-400 focus:outline-none focus:border-orange-500"
                  />
                  {formData.referredBy && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-2 rounded-xl font-bold whitespace-nowrap">
                      ✓ Code Applied
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  रेफरल कोड दर्ज करने पर दोनों वर्कशॉप को प्राथमिक वेरिफिकेशन सपोर्ट मिलता है।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: GARAGE INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 2: Garage & Shop Profile</h2>
                <p className="text-xs text-slate-400">Workshop name, business type, and photos</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Garage / Workshop Name (दुकान या गैराज का नाम) *
                </label>
                <input
                  type="text"
                  value={formData.garageName}
                  onChange={(e) => updateField('garageName', e.target.value)}
                  placeholder="e.g. National Truck Care & Scanner Diagnostics"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Setup Type (गैराज का प्रकार) *
                </label>
                <select
                  value={formData.garageType}
                  onChange={(e) => updateField('garageType', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="workshop">Heavy Commercial Workshop (गैराज / शेड)</option>
                  <option value="mobile_only">Mobile Rescue Van Only (केवल ऑन-रोड वैन)</option>
                  <option value="hybrid">Workshop + Roadside Mobile Van (दोनों)</option>
                  <option value="dealership_authorized">Authorized Service Center (अधिकृत केंद्र)</option>
                  <option value="towing_recovery">Crane & Hydraulic Towing Setup (क्रेन सर्विस)</option>
                  <option value="spare_parts_shop">Heavy Spare Parts Shop (स्पेयर पार्ट्स)</option>
                </select>
              </div>

              {/* Provider Category Selection */}
              <div className="sm:col-span-2 space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Business / Provider Category (सर्विस पार्टनर श्रेणी) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {PROVIDER_CATEGORIES.map((cat) => {
                    const isSelected = formData.providerCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => updateField('providerCategory', cat.id)}
                        className={`text-left p-3 rounded-xl border transition ${
                          isSelected
                            ? 'bg-orange-600/20 border-orange-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-bold text-xs text-white">{cat.label}</span>
                        <span className="block text-[11px] text-orange-400 font-medium">{cat.hindi}</span>
                        <span className="block text-[10px] text-slate-400 mt-1">{cat.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Years of Experience (कार्य अनुभव वर्ष) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={formData.experienceYears}
                  onChange={(e) => updateField('experienceYears', parseInt(e.target.value) || 0)}
                  placeholder="e.g. 10"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating Hours (कामकाजी घंटे)
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => updateField('workingHours', e.target.value)}
                  placeholder="e.g. 24 Hours or 08:00 AM - 10:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Description & Experience (अनुभव और विवरण)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Tell drivers about your specialization: e.g. 15 years experience in Tata BS6 DEF pump, Cummins scanners, round the clock roadside van..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              {/* Photos */}
              <div className="sm:col-span-2 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Shop & Garage Photos (दुकान / वर्कशॉप के फोटो)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.newPhotoUrl}
                    onChange={(e) => updateField('newPhotoUrl', e.target.value)}
                    placeholder="Enter image URL or photo link..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 rounded-xl shrink-0 transition"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {formData.photos.map((p, idx) => (
                    <div key={idx} className="relative group w-24 h-20 rounded-xl overflow-hidden border border-slate-700">
                      <img src={p} alt="Shop" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: COMPLETE ADDRESS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 3: Highway & City Address</h2>
                <p className="text-xs text-slate-400">Accurate highway corridor details and GPS pin</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State / UT (राज्य / केंद्र शासित प्रदेश) *</label>
                <select
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const districts = getDistrictsByState(newState);
                    updateField('state', newState);
                    updateField('district', districts[0] || '');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  {getAllIndianStates().map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">District (जिला) *</label>
                <select
                  value={formData.district}
                  onChange={(e) => updateField('district', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select District (जिला चुनें)</option>
                  {getDistrictsByState(formData.state).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                  <option value="Other">Other / Not Listed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City / Transport Nagar (शहर / नगर) *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="e.g. Bhiwandi, SGTN Delhi, Salem, Jaipur"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Highway / Bypass (हाईवे / बाईपास)</label>
                <input
                  type="text"
                  value={formData.highway}
                  onChange={(e) => updateField('highway', e.target.value)}
                  placeholder="e.g. NH 48, NH 44, Mumbai-Nashik Expressway"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Area / Road Name (एरिया)</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  placeholder="e.g. Mankoli Naka, Steel Market"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">PIN Code (पिन कोड) *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 421302"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Prominent Landmark (पहचान चिन्ह / पेट्रोल पंप)</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  placeholder="e.g. Behind HP Petrol Pump, Near Toll Plaza, Opp Dhaba"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Location Picker */}
              <div className="sm:col-span-2 pt-2">
                <LocationPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(lat, lon, details) => {
                    updateField('latitude', lat);
                    updateField('longitude', lon);
                    if (details) {
                      if (details.city) updateField('city', details.city);
                      if (details.state) updateField('state', details.state);
                      if (details.pincode) updateField('pincode', details.pincode);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SERVICES & BRANDS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 4: Services Offered & Vehicle Brands</h2>
                <p className="text-xs text-slate-400">Select all skills and vehicle makes you repair</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Service Capabilities (सभी लागू सेवाएं टिक करें):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isChecked = formData.services.includes(cat.label);
                  return (
                    <label
                      key={cat.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition ${
                        isChecked
                          ? 'bg-orange-600/20 border-orange-500/60 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('services', cat.label)}
                        className="mt-0.5 rounded border-slate-700 text-orange-600 focus:ring-0"
                      />
                      <div>
                        <span className="block text-white font-medium">{cat.label}</span>
                        <span className="block text-[11px] text-slate-400">{cat.hindi}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brands Supported */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Heavy Commercial Vehicle Brands Handled:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRUCK_BRANDS.map((brand) => {
                  const isChecked = formData.brands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500/60 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('brands', brand)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: EQUIPMENT */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 5: Diagnostic Tools & Testing Equipment</h2>
                <p className="text-xs text-slate-400">Highlight your specialized diagnostic adapters and bench tools</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Diagnostic Equipment Available at Workshop:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DIAGNOSTIC_EQUIPMENT.map((tool) => {
                  const isChecked = formData.equipment.includes(tool);
                  return (
                    <label
                      key={tool}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition ${
                        isChecked
                          ? 'bg-emerald-600/20 border-emerald-500/60 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArrayItem('equipment', tool)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                      />
                      <span>{tool}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: AVAILABILITY & CHARGES */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Step 6: Availability & Pricing</h2>
                <p className="text-xs text-slate-400">Roadside service radius, 24x7 timing and charges</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.twentyFourHours}
                    onChange={(e) => updateField('twentyFourHours', e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-0"
                  />
                  <div>
                    <span className="block text-sm font-bold text-white">24-Hour Round The Clock Service</span>
                    <span className="block text-xs text-slate-400">Available day and night on call</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.mobileService}
                    onChange={(e) => updateField('mobileService', e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-0"
                  />
                  <div>
                    <span className="block text-sm font-bold text-white">Mobile Roadside Rescue Van</span>
                    <span className="block text-xs text-slate-400">Can travel to highway breakdown spot</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOpen}
                    onChange={(e) => updateField('isOpen', e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-0"
                  />
                  <div>
                    <span className="block text-sm font-bold text-white">Garage Currently Open</span>
                    <span className="block text-xs text-slate-400">Can toggle live open/closed from dashboard</span>
                  </div>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Roadside Service Radius (हाईवे दायरा किमी में)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={10}
                      max={150}
                      step={10}
                      value={formData.serviceRadiusKm}
                      onChange={(e) => updateField('serviceRadiusKm', parseInt(e.target.value))}
                      className="w-full accent-orange-600"
                    />
                    <span className="text-sm font-bold text-white w-16 text-right">
                      {formData.serviceRadiusKm} km
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Normal Service Charges (सामान्य चार्ज)
                  </label>
                  <input
                    type="text"
                    value={formData.normalCharges}
                    onChange={(e) => updateField('normalCharges', e.target.value)}
                    placeholder="e.g. ₹ 800 - ₹ 2,000 based on work"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Highway Emergency Callout Fee (हाईवे विजिट चार्ज)
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyCharges}
                    onChange={(e) => updateField('emergencyCharges', e.target.value)}
                    placeholder="e.g. ₹ 1,500 inspection on highway"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (currentStep === 1 && !formData.ownerName) {
                  alert('Please enter Owner Name to continue');
                  return;
                }
                if (currentStep === 2 && !formData.garageName) {
                  alert('Please enter Garage Name to continue');
                  return;
                }
                setCurrentStep(prev => prev + 1);
              }}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-lg"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base px-8 py-3 rounded-xl transition shadow-xl disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Garage Registration</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading Wizard...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
