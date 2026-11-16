import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { MapPin, ShieldCheck, ArrowLeft, Navigation, PhoneCall, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Uttar Pradesh Truck Mechanic, Highway Breakdown & Crane Service | TRUCK RESCUE INDIA',
  description: '24x7 heavy vehicle repair in Uttar Pradesh. Fast response on Yamuna Expressway, Agra-Lucknow Expressway, Purvanchal Expressway, NH 19 (GT Road), Kanpur Transport Nagar, and Varanasi.',
  keywords: 'truck mechanic uttar pradesh, kanpur transport nagar mechanic, agra expressway truck crane, lucknow truck repair, nh 19 gt road breakdown'
};

export default async function UttarPradeshPage() {
  const allGarages = await fetchAllGarages();
  const upGarages = allGarages.filter(g => 
    (g.state && g.state.toLowerCase().includes('uttar pradesh')) ||
    (g.city && ['kanpur', 'lucknow', 'agra', 'varanasi', 'prayagraj', 'gorakhpur', 'meerut', 'aligarh', 'mathura', 'jhansi'].some(c => g.city.toLowerCase().includes(c)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Link href="/india" className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All India Corridors</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>CENTRAL FREIGHT ARTERY — UTTAR PRADESH & EXPRESSWAYS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Uttar Pradesh Heavy Truck Rescue & Highway Services
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            24x7 highway breakdown support across the GT Road (NH 19), Yamuna Expressway, Agra-Lucknow Expressway, Purvanchal Expressway, Bundelkhand Expressway, and central hubs like Kanpur Transport Nagar and Varanasi bypass.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/nearby?state=Uttar%20Pradesh"
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Locate UP Mechanics Near Me</span>
            </Link>

            <Link
              href="/emergency?state=Uttar%20Pradesh"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Highway SOS</span>
            </Link>

            <a
              href="tel:1800889988"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Helpline 1800-889-988</span>
            </a>
          </div>
        </div>
      </div>

      {/* High Density UP Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { city: 'Kanpur Transport Nagar', desc: 'Central UP Logistics Engine (NH 19)' },
          { city: 'Agra Expressway Junction', desc: 'Yamuna & Lucknow Expressway Interchange' },
          { city: 'Lucknow Transport Nagar', desc: 'Nadarganj & Shaheed Path Terminal' },
          { city: 'Varanasi GT Road Bypass', desc: 'Eastern India & Bihar Gateway' },
        ].map((h, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
            <p className="text-sm font-bold text-white">{h.city}</p>
            <p className="text-[11px] text-slate-400">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* Garages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Verified Garages in Uttar Pradesh ({upGarages.length})</span>
          </h2>
          <Link href="/nearby?state=Uttar%20Pradesh" className="text-xs text-orange-400 hover:underline font-bold">
            Live Radar →
          </Link>
        </div>

        {upGarages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            All registered network mechanics serving Uttar Pradesh are accessible via live GPS radar search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
