'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthContext';
import { useLanguage } from '@/components/LanguageContext';
import { 
  TRUCK_BRANDS, 
  INDIAN_STATES, 
  TOP_HIGHWAYS, 
  BREAKDOWN_CATEGORIES, 
  VEHICLE_FUEL_TYPES,
  EMERGENCY_SERVICE_TYPES 
} from '@/lib/constants';
import { createEmergencyRequest } from '@/lib/emergencyService';
import { 
  AlertTriangle, 
  MapPin, 
  Truck, 
  Phone, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Navigation, 
  ShieldAlert, 
  Siren,
  X,
  Info
} from 'lucide-react';

export default function NewEmergencyRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { lang } = useLanguage();
  const isHindi = lang === 'hi';

  // Driver info
  const [driverPhone, setDriverPhone] = useState(user?.phone || '');
  const [driverName, setDriverName] = useState((user as any)?.name || (user as any)?.displayName || '');

  // Vehicle info
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState(TRUCK_BRANDS[0]);
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleType, setVehicleType] = useState<any>('BS6');

  // Breakdown & Service
  const [breakdownCategory, setBreakdownCategory] = useState('engine_problem');
  const [description, setDescription] = useState('');
  const [requestedService, setRequestedService] = useState('roadside_van');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'critical'>('urgent');

  // Photos (up to 5 base64 previews)
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState('');

  // Location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Manual location
  const [highway, setHighway] = useState('');
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState(INDIAN_STATES[0]);
  const [pincode, setPincode] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Auto-request GPS on mount
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Update phone if auth changes
  useEffect(() => {
    if (user?.phone && !driverPhone) {
      setDriverPhone(user.phone);
    }
  }, [user]);

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setGpsAccuracy(Math.round(pos.coords.accuracy));
        setGpsLoading(false);

        // Attempt reverse geocode via OpenStreetMap Nominatim if possible
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=14&addressdetails=1`)
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
              const addr = data.address;
              if (addr.state) {
                const matchedState = INDIAN_STATES.find(s => s.toLowerCase() === addr.state.toLowerCase());
                if (matchedState) setState(matchedState);
              }
              if (addr.city || addr.town || addr.village || addr.county) {
                const detectedCity = addr.city || addr.town || addr.village || addr.county || '';
                setCity(detectedCity);
                setDistrict(addr.state_district || addr.county || detectedCity);
              }
              if (addr.postcode) setPincode(addr.postcode);
              if (addr.road) setHighway(addr.road);
              if (data.display_name) setAddress(data.display_name.slice(0, 120));
            }
          })
          .catch(() => {
            // Silently ignore reverse geocode errors on mobile
          });
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('Could not detect GPS coordinates. Please enter your location manually below.');
        // Default to central highway corridor (Delhi-Jaipur corridor) as fallback
        setLatitude(28.3845);
        setLongitude(76.9421);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setPhotoError('Maximum 5 photos allowed.');
      return;
    }
    setPhotoError('');

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos(prev => [...prev.slice(0, 4), event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!driverPhone.trim()) {
      setSubmitError('Please enter your 10-digit driver mobile number for mechanic contact.');
      return;
    }

    if (!vehicleNumber.trim()) {
      setSubmitError('Please enter your truck registration number (e.g. RJ 14 GB 1234).');
      return;
    }

    if (!city.trim() && !highway.trim() && !address.trim()) {
      setSubmitError('Please specify your current highway, city, or nearest landmark.');
      return;
    }

    setSubmitting(true);

    try {
      const lat = latitude || 28.3845;
      const lon = longitude || 76.9421;

      const created = await createEmergencyRequest({
        driverPhone: driverPhone.trim(),
        driverName: driverName.trim() || 'Truck Driver',
        driverUid: user?.uid,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        vehicleBrand,
        vehicleModel: vehicleModel.trim() || 'Heavy Truck',
        vehicleType,
        breakdownCategory,
        description: description.trim(),
        photos,
        latitude: lat,
        longitude: lon,
        address: address.trim() || `${highway || 'National Highway'}, Near ${landmark || city || 'Toll Plaza'}`,
        highway: highway.trim(),
        landmark: landmark.trim(),
        city: city.trim() || 'Highway Corridor',
        district: district.trim() || city.trim() || 'District',
        state,
        pincode: pincode.trim() || '110001',
        requestedService,
        priority
      });

      // Redirect immediately to live tracking page
      router.push(`/emergency/${created.id}`);
    } catch (err: any) {
      console.error('Error creating SOS request:', err);
      setSubmitError(err.message || 'Failed to dispatch SOS request. Please try again or call emergency helpline.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Header Alert Banner */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-amber-600 rounded-2xl p-6 shadow-2xl mb-8 border-2 border-yellow-400">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center flex-shrink-0 border border-yellow-300">
              <Siren className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <span className="inline-block bg-black/50 text-yellow-300 text-xs font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                {isHindi ? '🚨 24x7 तत्काल आपातकालीन सहायता' : '🚨 24x7 HIGHWAY EMERGENCY SOS'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {isHindi ? 'ट्रक ब्रेकडाउन रिपोर्ट करें' : 'Emergency Truck Breakdown Request'}
              </h1>
              <p className="text-zinc-100 text-xs sm:text-sm mt-1">
                {isHindi 
                  ? 'अपनी लोकेशन और समस्या दर्ज करें। 50 किमी दायरे के सभी एक्टिव ट्रक मैकेनिक और रिकवरी वैन को तुरंत अलर्ट भेजा जाएगा।'
                  : 'Fill truck and breakdown details. Real-time alert is broadcast to all active verified mechanics and recovery vans within 50 km.'}
              </p>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p className="text-sm font-semibold">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: GPS & LOCATION */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">
                  1. {isHindi ? 'गाड़ी की लोकेशन (GPS व पता)' : 'Breakdown Location (GPS & Address)'}
                </h2>
              </div>
              <button
                type="button"
                onClick={fetchCurrentLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-400/30 transition-all"
              >
                {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                {isHindi ? 'GPS रीफ्रेश करें' : 'Refresh GPS'}
              </button>
            </div>

            {/* GPS Status Box */}
            <div className="mb-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${latitude ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                <span className="text-xs sm:text-sm font-medium text-zinc-300">
                  {latitude && longitude ? (
                    <>
                      GPS Coordinates Locked: <strong className="text-white">{latitude.toFixed(5)}, {longitude.toFixed(5)}</strong>
                      {gpsAccuracy && <span className="text-zinc-400 text-xs ml-2"> (±{gpsAccuracy}m accuracy)</span>}
                    </>
                  ) : (
                    'Detecting GPS location...'
                  )}
                </span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {latitude ? 'Google Maps Linked' : 'Awaiting GPS Permission'}
              </span>
            </div>

            {gpsError && (
              <p className="text-xs text-amber-400 mb-4 bg-amber-950/40 p-2.5 rounded-lg border border-amber-600/30">
                {gpsError}
              </p>
            )}

            {/* Manual Location Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'हाईवे / रोड का नाम *' : 'Highway / Road Name *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. NH 48, KM 42 / Agra-Lucknow Expressway"
                  value={highway}
                  onChange={(e) => setHighway(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'नजदीकी लैंडमार्क / ढाबा / टोल प्लाजा *' : 'Nearest Landmark / Dhabha / Toll *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Opposite HPCL Pump, 2km before Bilaspur"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'शहर / कस्बा *' : 'City / Town *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gurugram, Jaipur, Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'राज्य (State) *' : 'State *'}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'जिला (District)' : 'District'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Thane, Gurugram, Rewari"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'पिन कोड (PIN Code)' : 'PIN Code (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 122051"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: VEHICLE DETAILS */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-800 pb-3">
              <Truck className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-white">
                2. {isHindi ? 'ट्रक / वाहन की जानकारी' : 'Truck / Vehicle Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'गाड़ी नंबर (Registration Number) *' : 'Vehicle Number (e.g. RJ 14 GB 1234) *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. RJ 14 GB 1234 / NL 01 B 5566"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-base font-mono uppercase font-bold text-yellow-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'ट्रक कंपनी (Brand) *' : 'Truck Brand *'}
                </label>
                <select
                  value={vehicleBrand}
                  onChange={(e) => setVehicleBrand(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {TRUCK_BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'मॉडल (Model)' : 'Vehicle Model'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signa 4825.TK, AVTR 5525, Blazo 28"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'एमिशन / फ्यूल टाइप (BS4 / BS6 / CNG)' : 'Emission / Fuel System *'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {VEHICLE_FUEL_TYPES.map(fuel => (
                    <button
                      type="button"
                      key={fuel}
                      onClick={() => setVehicleType(fuel)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center border transition-all ${
                        vehicleType === fuel
                          ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: BREAKDOWN CATEGORY */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-white">
                  3. {isHindi ? 'खराबी की श्रेणी (Breakdown Category) *' : 'Breakdown Category *'}
                </h2>
              </div>
              <span className="text-xs text-zinc-400">Select main problem</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {BREAKDOWN_CATEGORIES.map(cat => {
                const isSelected = breakdownCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setBreakdownCategory(cat.id)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-red-950/70 border-red-500 ring-2 ring-red-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50'
                    }`}
                  >
                    <span className="text-xs font-bold leading-tight text-white mb-0.5">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-hindi">
                      {cat.hindi}
                    </span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Description Textarea */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {isHindi ? 'खराबी का विवरण (आवाज, धुआं, मीटर में लाइट आदि)' : 'Breakdown Description & Symptoms'}
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Cluster meter showing Red STOP light with DPF error. Truck stopped suddenly after pulling uphill. White smoke from exhaust."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Photo Upload */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {isHindi ? 'खराबी या डैशबोर्ड की फोटो (अधिकतम 5 फोटो)' : 'Upload Breakdown / Dashboard Photos (Max 5)'}
              </label>
              <p className="text-xs text-zinc-400 mb-2">
                Clear photos of error codes on cluster meter, broken parts, or tyre help mechanics bring the exact tools.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {photos.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 group">
                    <img src={src} alt="Breakdown" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {photos.length < 5 && (
                  <label className="cursor-pointer w-20 h-20 rounded-xl border-2 border-dashed border-zinc-700 hover:border-red-500 bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-all">
                    <Camera className="w-6 h-6 mb-1 text-zinc-500" />
                    <span className="text-[10px] font-bold">+ Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {photoError && <p className="text-xs text-red-400 mt-1">{photoError}</p>}
            </div>
          </div>

          {/* SECTION 4: SERVICE TYPE & PRIORITY */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-800 pb-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">
                4. {isHindi ? 'सेवा का प्रकार व प्राथमिकता' : 'Service Type & Priority'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {EMERGENCY_SERVICE_TYPES.map(st => (
                <div
                  key={st.id}
                  onClick={() => setRequestedService(st.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    requestedService === st.id
                      ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <p className="text-sm font-bold text-white mb-0.5">{st.label}</p>
                  <p className="text-xs text-zinc-400">{st.desc}</p>
                </div>
              ))}
            </div>

            {/* Priority Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-zinc-300 mb-2">
                {isHindi ? 'आपातकालीन प्राथमिकता (Emergency Priority)' : 'Emergency Urgency Priority'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPriority('normal')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priority === 'normal'
                      ? 'bg-blue-600 text-white border-blue-400 font-bold shadow-md'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold">Normal</div>
                  <div className="text-[10px] text-zinc-300">Parked in bay / safe spot</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priority === 'urgent'
                      ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-md'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold">Urgent</div>
                  <div className="text-[10px] text-zinc-200">Highway shoulder / Delivery schedule</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('critical')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priority === 'critical'
                      ? 'bg-red-600 text-white border-red-400 font-extrabold shadow-md animate-pulse'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold">Critical</div>
                  <div className="text-[10px] text-zinc-200">Traffic blocked / Night danger / Hazardous</div>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 5: DRIVER CONTACT */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4 border-b border-zinc-800 pb-3">
              <Phone className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold text-white">
                5. {isHindi ? 'ड्राइवर संपर्क (Driver Contact)' : 'Driver Contact Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'मोबाइल नंबर (मैकेनिक सीधे फोन करेगा) *' : 'Driver Mobile Number (Direct Mechanic Call) *'}
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-base font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  {isHindi ? 'ड्राइवर का नाम' : 'Driver Name (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaswinder Singh / Ramesh Kumar"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* BIG SUBMIT BUTTON */}
          <div className="sticky bottom-4 z-30 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-2xl border-2 border-yellow-400 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-300" />
                  <span>{isHindi ? 'नजदीकी मैकेनिकों को भेजा जा रहा है...' : 'Broadcasting SOS to Nearby Mechanics...'}</span>
                </>
              ) : (
                <>
                  <Siren className="w-7 h-7 text-yellow-300 animate-bounce" />
                  <span>{isHindi ? '🚨 आपातकालीन मदद (SOS) भेजें' : '🚨 SUBMIT EMERGENCY SOS REQUEST'}</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-zinc-400 mt-2 font-medium">
              By submitting, your live location and breakdown problem are sent to verified truck mechanics within 50 km.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
