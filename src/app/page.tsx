'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Wrench, 
  Zap, 
  Cpu, 
  Disc, 
  Anchor, 
  Package, 
  Search, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  Navigation, 
  Star,
  Users,
  Compass,
  AlertTriangle,
  Bot,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { fetchAllGarages } from '@/lib/garageService';
import { Garage } from '@/lib/types';
import GarageCard from '@/components/GarageCard';
import { INDIAN_STATES, TOP_HIGHWAYS, SERVICE_CATEGORIES } from '@/lib/constants';
import EmergencySosButton from '@/components/EmergencySosButton';
import AdBanner from '@/components/AdBanner';

export default function HomePage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [garages, setGarages] = useState<Garage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchAllGarages().then(data => {
      // Prioritize sponsored/featured garages for organic discovery
      const sorted = [...data].sort((a, b) => {
        if (a.isSponsored && !b.isSponsored) return -1;
        if (!a.isSponsored && b.isSponsored) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
      setGarages(sorted.slice(0, 6));
    });
  }, []);

  const handleGpsSearch = () => {
    if (!navigator.geolocation) {
      router.push('/nearby');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        router.push(`/nearby?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
      },
      () => {
        setLocating(false);
        router.push('/nearby');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    router.push(`/nearby?${params.toString()}`);
  };

  const joinRoles = [
    { title: 'Truck Mechanic', hindi: 'ट्रक मैकेनिक', icon: Wrench, color: 'text-orange-400', link: '/register?role=mechanic' },
    { title: 'Truck Electrician', hindi: 'ट्रक इलेक्ट्रीशियन', icon: Zap, color: 'text-yellow-400', link: '/register?role=electrician' },
    { title: 'Scanner Expert', hindi: 'स्कैनर एक्सपर्ट', icon: Cpu, color: 'text-sky-400', link: '/register?role=scanner' },
    { title: 'ECM/ECU Expert', hindi: 'ईसीएम / ईसीयू एक्सपर्ट', icon: Cpu, color: 'text-emerald-400', link: '/register?role=ecm' },
    { title: 'Tyre Service', hindi: 'टायर सर्विस व पंचर', icon: Disc, color: 'text-amber-400', link: '/register?role=tyre' },
    { title: 'Towing Provider', hindi: 'हाइड्रोलिक टोइंग / क्रेन', icon: Anchor, color: 'text-purple-400', link: '/register?role=towing' },
    { title: 'Spare Parts Dealer', hindi: 'स्पेयर पार्ट्स डीलर', icon: Package, color: 'text-blue-400', link: '/register?role=parts' }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-orange-600/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
            <span>24x7 All-India Heavy Commercial Vehicle Support Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            {lang === 'hi' ? (
              <>हाईवे पर कभी भी नहीं रुकेंगे <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">आपके ट्रक के पहिए</span></>
            ) : lang === 'hinglish' ? (
              <>Highway Pe Kabhi Mat Ruko: <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Instant Truck Mechanic</span></>
            ) : (
              <>Emergency Truck Assistance <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                Anywhere Across India
              </span></>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300">
            Connect directly with verified heavy truck mechanics, laptop diagnostics, ECM specialists, 
            tyre shops, and 50-ton hydraulic towing recovery within 15 to 45 minutes on any National Highway.
          </p>

          {/* EMERGENCY HIGHWAY SOS BANNER */}
          <div className="pt-2 max-w-2xl mx-auto">
            <EmergencySosButton variant="banner" />
          </div>

          {/* TWO PRIMARY BIG DRIVER ACTION BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            {/* 1-Click GPS Button */}
            <button
              onClick={handleGpsSearch}
              disabled={locating}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-orange-600/30 transition transform hover:-translate-y-0.5 text-base sm:text-lg active:scale-95"
            >
              <Navigation className={`w-6 h-6 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Locating via GPS...' : t('useGps')}</span>
            </button>

            {/* Direct Helpline Call */}
            <a
              href="tel:18002008899"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-red-700/30 transition transform hover:-translate-y-0.5 text-base sm:text-lg active:scale-95"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>{t('callHelpline')}</span>
            </a>
          </div>

          {/* QUICK SEARCH FORM */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="bg-slate-900/90 border border-slate-700 p-2 sm:p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <MapPin className="w-5 h-5 text-orange-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-slate-300 focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Services (सभी सेवाएं)</option>
                <option value="mechanic">Heavy Mechanic</option>
                <option value="electrician">Electrician</option>
                <option value="scanner">Laptop Diagnostic / Scanner</option>
                <option value="ecm">ECM / ECU Repair</option>
                <option value="tyre">Tyre Repair / Puncture</option>
                <option value="towing">Hydraulic Towing / Crane</option>
                <option value="spare">Spare Parts</option>
              </select>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Quick Corridor Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-2">
            <span className="font-semibold text-slate-300">Popular Corridors:</span>
            <Link href="/nearby?search=NH44" className="hover:text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">NH 44</Link>
            <Link href="/nearby?search=NH48" className="hover:text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">NH 48</Link>
            <Link href="/nearby?search=Bhiwandi" className="hover:text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Bhiwandi</Link>
            <Link href="/nearby?search=SGTN" className="hover:text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">SGTN Delhi</Link>
            <Link href="/nearby?search=Samruddhi" className="hover:text-orange-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">Samruddhi Expressway</Link>
          </div>

        </div>
      </section>

      {/* AI TRUCK DIAGNOSTIC BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
              <Bot className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  New: AI Diagnostic Assistant
                </span>
                <span className="text-zinc-400 text-xs hidden sm:inline">• Free Voice & Scanner Support</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Got a Fault Code or Dashboard Warning Light?
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-0.5 max-w-xl">
                Enter J1939 SPN/FMI, OBD P-codes, AdBlue/SCR errors, or upload a photo of your scanner screen. Get instant technical checklists and pinout guidance in Hindi or English.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/ai-diagnostic"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition transform hover:scale-105 text-sm sm:text-base text-center"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>Launch AI Diagnostic Tool</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SPONSORED PLATFORM PARTNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner placement="homepage_banner" />
      </section>

      {/* JOIN TRUCK RESCUE INDIA PROMINENT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center lg:text-left">
            <div className="inline-block bg-slate-950/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-orange-200">
              For Garages, Mechanics & Towing Operators
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              JOIN TRUCK RESCUE INDIA NETWORK
            </h2>
            <p className="text-sm sm:text-base text-orange-100 font-medium">
              Are you running a truck garage, diagnostic scanner setup, or mobile mechanic van? Register today to receive breakdown leads directly from transport drivers and fleet managers on your highway.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl transition transform hover:scale-105 text-center flex items-center justify-center gap-2 text-base sm:text-lg"
            >
              <PlusCircle className="w-6 h-6 text-orange-400" />
              <span>Register Your Garage Free</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-4 rounded-2xl transition text-center"
            >
              Garage Owner Login
            </Link>
          </div>
        </div>
      </section>

      {/* JOIN AS SPECIALIST ROLES (Prompt Step 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Register By Specialization / अपनी विशेषज्ञता चुनें
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click on your service trade to start your step-by-step verified registration wizard
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {joinRoles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <Link
                key={idx}
                href={role.link}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 p-4 rounded-2xl transition group flex flex-col justify-between hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-slate-800 ${role.color} group-hover:scale-110 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] text-slate-500 group-hover:text-orange-400 font-bold transition flex items-center gap-0.5">
                    Register <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition">
                    Join as {role.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">{role.hindi}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED / NEARBY VERIFIED GARAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
              <span>Verified Highway Network Garages</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Trusted commercial vehicle specialists with proven test benches, scanners, and 24x7 roadside response
            </p>
          </div>

          <Link
            href="/nearby"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 transition"
          >
            <span>View All Nearby Garages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {garages.map((garage) => (
            <GarageCard key={garage.id} garage={garage} />
          ))}
        </div>
      </section>

      {/* SUPPORTED COMMERCIAL VEHICLE BRANDS */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Specialized Support For Major Heavy Commercial Vehicle Brands
            </h3>
            <p className="text-xs text-slate-400">
              Diagnostics, genuine spare parts, wiring harness and ECM calibration
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              'Tata Motors Prima & Signa',
              'Ashok Leyland AVTR & Captain',
              'BharatBenz Heavy Duty',
              'Eicher Motors Pro Series',
              'Mahindra Blazo & Furio',
              'Volvo Commercial Trucks',
              'Scania Multi-Axle Pullers',
              'Cummins ISBe & ISLe Engines',
              'Bosch CRDI Fuel Systems'
            ].map((brand, idx) => (
              <span
                key={idx}
                className="bg-slate-950 border border-slate-700/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 shadow"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FOR DRIVERS (Zero friction) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How Truck Rescue Works For Drivers (ड्राइवर भाइयों के लिए)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            No complicated forms. Instant connection when your vehicle is stuck on highway.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-white">1-Click GPS Location</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the website and tap &quot;Locate Me (GPS)&quot;. Our system instantly pinpoints your highway location without asking you to fill any long vehicle forms.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-white">See Nearest Mechanics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse verified garages sorted by exact distance in kilometers. Filter by scanner experts, electricians, tyres, or 24x7 roadside service.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-white">Call or WhatsApp Direct</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tap the big green CALL button or WhatsApp icon to speak directly to the mechanic or garage owner. Share your live pin or request roadside rescue vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Emergency SOS Button */}
      <EmergencySosButton variant="floating" />

    </div>
  );
}
