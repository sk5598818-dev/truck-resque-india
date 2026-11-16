'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Navigation, 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Loader2, 
  AlertCircle,
  SlidersHorizontal,
  RefreshCw,
  Building,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { searchNearbyGarages } from '@/lib/garageService';
import { Garage } from '@/lib/types';
import GarageCard from '@/components/GarageCard';
import { useLanguage } from '@/components/LanguageContext';
import { SERVICE_CATEGORIES, TRUCK_BRANDS, INDIAN_STATES } from '@/lib/constants';
import { getDistrictsByState } from '@/lib/indiaGeoData';
import EmergencySosButton from '@/components/EmergencySosButton';
import AdBanner from '@/components/AdBanner';

function NearbySearchContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(true);

  // GPS Coordinates
  const [lat, setLat] = useState<number | undefined>(() => {
    const p = searchParams.get('lat');
    return p ? parseFloat(p) : undefined;
  });
  const [lon, setLon] = useState<number | undefined>(() => {
    const p = searchParams.get('lon');
    return p ? parseFloat(p) : undefined;
  });

  // Distance Radius: 5 km, 10 km, 25 km, 50 km, 100 km
  const [radiusKm, setRadiusKm] = useState<number>(50);

  // Filters
  const [category, setCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [brand, setBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('search') || '');
  const [is24x7, setIs24x7] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpenOnly, setIsOpenOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [hasScanner, setHasScanner] = useState<boolean>(false);
  const [hasElectrician, setHasElectrician] = useState<boolean>(false);
  const [hasBs6Expert, setHasBs6Expert] = useState<boolean>(false);

  // Manual Location Search State
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [manualState, setManualState] = useState('');
  const [manualDistrict, setManualDistrict] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualArea, setManualArea] = useState('');
  const [manualPincode, setManualPincode] = useState('');

  // UI state
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Execute Geospatial & Filter Search
  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchNearbyGarages({
        latitude: lat,
        longitude: lon,
        radiusKm,
        category,
        brand,
        searchQuery,
        is24x7,
        isMobile,
        isOpen: isOpenOnly,
        verifiedOnly,
        hasScanner,
        hasElectrician,
        hasBs6Expert,
        state: manualState,
        district: manualDistrict,
        city: manualCity,
        area: manualArea,
        pincode: manualPincode,
      });
      setGarages(results);
    } catch (err) {
      console.error('Failed to search nearby garages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [
    lat, 
    lon, 
    radiusKm, 
    category, 
    brand, 
    is24x7, 
    isMobile, 
    isOpenOnly, 
    verifiedOnly, 
    hasScanner,
    hasElectrician,
    hasBs6Expert,
    manualState, 
    manualDistrict,
    manualCity, 
    manualPincode
  ]);

  // Request GPS Location Permission and coordinates
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please use manual location search.');
      setShowManualSearch(true);
      return;
    }

    setLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const uLat = Math.round(pos.coords.latitude * 10000) / 10000;
        const uLon = Math.round(pos.coords.longitude * 10000) / 10000;
        setLat(uLat);
        setLon(uLon);
        setLocating(false);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${uLat}&lon=${uLon}`);
          if (res.ok) {
            const data = await res.json();
            setUserAddress(data.display_name?.split(',').slice(0, 3).join(', '));
          }
        } catch (e) {}
      },
      (err) => {
        setLocating(false);
        setGpsError('GPS location permission was denied or timed out. Switched to manual location search.');
        setShowManualSearch(true);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleManualSearchApply = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearManual = () => {
    setManualState('');
    setManualDistrict('');
    setManualCity('');
    setManualArea('');
    setManualPincode('');
    performSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HIGHWAY EMERGENCY SOS BANNER */}
      <EmergencySosButton variant="banner" />

      {/* Search Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Truck className="w-8 h-8 text-orange-500" />
              <span>Nearby Truck Rescue Network (नजदीकी मैकेनिक)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Geospatial discovery for heavy truck mechanics, scanners, ECM flashing, and towing recovery
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* GPS Quick Button */}
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg transition active:scale-95 text-sm shrink-0"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span>{locating ? 'Acquiring GPS...' : 'Use My Current GPS'}</span>
            </button>

            {/* Toggle Manual Location */}
            <button
              onClick={() => setShowManualSearch(!showManualSearch)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-3 rounded-xl transition border border-slate-700 shrink-0"
            >
              <Building className="w-4 h-4 text-sky-400" />
              <span>Manual Search</span>
              {showManualSearch ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* GPS Error Alert */}
        {gpsError && (
          <div className="bg-amber-950/70 border border-amber-500/50 p-3 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-300 mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{gpsError}</span>
            </div>
            <button onClick={() => setGpsError(null)} className="text-amber-200 hover:underline shrink-0">
              Dismiss
            </button>
          </div>
        )}

        {/* Current GPS Active Notice */}
        {lat && lon && (
          <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-300 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                GPS Active: <strong className="text-white">{lat}, {lon}</strong>
                {userAddress && <span className="text-slate-400"> ({userAddress})</span>}
              </span>
            </div>
            <button
              onClick={() => { setLat(undefined); setLon(undefined); setUserAddress(null); }}
              className="text-xs text-orange-400 hover:underline shrink-0"
            >
              Clear GPS
            </button>
          </div>
        )}

        {/* COLLAPSIBLE MANUAL LOCATION SEARCH DRAWER */}
        {showManualSearch && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Manual Location Search (बिना GPS के खोजें)</span>
              </div>
              <button
                type="button"
                onClick={handleClearManual}
                className="text-xs text-slate-400 hover:text-white"
              >
                Reset Fields
              </button>
            </div>

            <form onSubmit={handleManualSearchApply} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">State / UT (राज्य)</label>
                <select
                  value={manualState}
                  onChange={(e) => {
                    setManualState(e.target.value);
                    setManualDistrict('');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">All States & UTs (सभी राज्य)</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">District (जिला)</label>
                {manualState && getDistrictsByState(manualState).length > 0 ? (
                  <select
                    value={manualDistrict}
                    onChange={(e) => setManualDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="">All Districts (सभी जिले)</option>
                    {getDistrictsByState(manualState).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={manualDistrict}
                    onChange={(e) => setManualDistrict(e.target.value)}
                    placeholder="e.g. Thane, Jaipur"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">City / Transport Nagar (शहर)</label>
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="e.g. Bhiwandi, SGTN"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Area / Highway (एरिया/हाईवे)</label>
                <input
                  type="text"
                  value={manualArea}
                  onChange={(e) => setManualArea(e.target.value)}
                  placeholder="e.g. Mankoli Naka, NH48"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">PIN Code (पिन कोड)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={manualPincode}
                  onChange={(e) => setManualPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 421302"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
                >
                  Apply Location Filter
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Primary Search Bar */}
        <div className="space-y-4">
          <form
            onSubmit={(e) => { e.preventDefault(); performSearch(); }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Garage Name, Highway (NH44, NH48), City, or Part..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                category === 'all'
                  ? 'bg-orange-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Services
            </button>
            {SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.label)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  category === cat.label
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Filters Bar: Distance, Brands, Status Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs">
            
            {/* Distance Radius Selectors: 5 km, 10 km, 25 km, 50 km, 100 km */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Radius:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[5, 10, 25, 50, 100].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`px-2.5 py-1 rounded-lg font-black transition ${
                      radiusKm === r ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Brand Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Brand:</span>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Brands (Tata, Leyland, BharatBenz...)</option>
                {TRUCK_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Checkbox Toggles: 24x7, Roadside Van, Open Now, Verified */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={is24x7}
                  onChange={(e) => setIs24x7(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-orange-600 focus:ring-0"
                />
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>24x7 Only</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMobile}
                  onChange={(e) => setIsMobile(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-orange-600 focus:ring-0"
                />
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Roadside Van</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isOpenOnly}
                  onChange={(e) => setIsOpenOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Open Now</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-orange-600 focus:ring-0"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified First</span>
              </label>

              {/* Phase 11 Specialist Quick Filters */}
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasScanner}
                  onChange={(e) => setHasScanner(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-0"
                />
                <span className="text-[11px] text-purple-400 font-bold">💻 Scanner / OBD</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasElectrician}
                  onChange={(e) => setHasElectrician(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-yellow-500 focus:ring-0"
                />
                <span className="text-[11px] text-yellow-400 font-bold">⚡ Electrician</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasBs6Expert}
                  onChange={(e) => setHasBs6Expert(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-teal-400 focus:ring-0"
                />
                <span className="text-[11px] text-teal-400 font-bold">🛡️ BS6 / DEF Expert</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Non-intrusive Highway Sponsor Ad Banner */}
      <AdBanner placement="category_page" className="mb-6" />

      {/* Results Header & Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">
            Showing <strong className="text-white font-bold">{garages.length}</strong> verified service providers
            {lat && lon && <span> within <strong className="text-orange-400">{radiusKm} km</strong> of your GPS location</span>}
            {!lat && (manualCity || manualState) && (
              <span> in <strong className="text-orange-400">{[manualCity, manualDistrict, manualState, manualPincode].filter(Boolean).join(', ')}</strong></span>
            )}
          </p>
          <button
            onClick={performSearch}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Scanning network for active garages and roadside vans...</p>
          </div>
        ) : garages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Garages Found within {radiusKm} km</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No matching workshops found in this exact radius. Try expanding your radius to 50 km or 100 km, or search along major highways (e.g. NH44, NH48).
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => { setRadiusKm(100); setCategory('all'); setBrand('all'); }}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                Expand Search to 100 km
              </button>
              <button
                onClick={() => setShowManualSearch(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition border border-slate-700"
              >
                Try Manual City / State Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {garages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} userLat={lat} userLon={lon} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Emergency SOS Button */}
      <EmergencySosButton variant="floating" />

    </div>
  );
}

export default function NearbyPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
        Loading Nearby Search...
      </div>
    }>
      <NearbySearchContent />
    </Suspense>
  );
}
