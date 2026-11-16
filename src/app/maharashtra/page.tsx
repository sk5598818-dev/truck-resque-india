import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { MapPin, ShieldCheck, ArrowLeft, Navigation, PhoneCall, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Maharashtra Truck Breakdown & Highway Mechanic Network | TRUCK RESCUE INDIA',
  description: '24x7 heavy commercial vehicle mechanics across Maharashtra. Instant roadside rescue in Bhiwandi, Kalamboli, JNPT, Pune, Nagpur, Samruddhi Mahamarg, and NH 48.',
  keywords: 'truck mechanic maharashtra, bhiwandi truck repair, kalamboli crane service, samruddhi mahamarg truck assistance, pune truck workshop, nh 48 mechanic'
};

export default async function MaharashtraPage() {
  const allGarages = await fetchAllGarages();
  const maharashtraGarages = allGarages.filter(g => 
    (g.state && g.state.toLowerCase().includes('maharashtra')) ||
    (g.city && ['mumbai', 'pune', 'nagpur', 'thane', 'bhiwandi', 'nashik', 'aurangabad', 'solapur', 'panvel', 'navi mumbai'].some(c => g.city.toLowerCase().includes(c)))
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
            <span>WESTERN LOGISTICS CORRIDOR — MAHARASHTRA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Maharashtra Truck Breakdown & 24x7 Highway Repair
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Covering critical high-density freight nodes across Maharashtra: JNPT port container trailers, Bhiwandi warehousing clusters, Samruddhi Expressway (Mumbai-Nagpur), Mumbai-Pune Expressway, and industrial belts of Chakan, Talegaon, and Waluj.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/nearby?state=Maharashtra"
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Locate Maharashtra Garages Near Me</span>
            </Link>

            <Link
              href="/emergency?state=Maharashtra"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Highway SOS</span>
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

      {/* High Density Transport Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { city: 'Bhiwandi', role: 'Warehousing Hub / Mankoli', slug: 'mumbai' },
          { city: 'Kalamboli & JNPT', role: 'Container Port / Steel Market', slug: 'mumbai' },
          { city: 'Pune (Chakan)', role: 'Auto Manufacturing Belt', slug: 'maharashtra' },
          { city: 'Nagpur (MIHAN)', role: 'Zero Mile Logistics Center', slug: 'maharashtra' },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
            <p className="text-sm font-extrabold text-white">{item.city}</p>
            <p className="text-[11px] text-slate-400">{item.role}</p>
          </div>
        ))}
      </div>

      {/* Garage List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Verified Garages in Maharashtra ({maharashtraGarages.length})</span>
          </h2>
          <Link href="/nearby?state=Maharashtra" className="text-xs text-orange-400 hover:underline font-bold">
            View Live Radar →
          </Link>
        </div>

        {maharashtraGarages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No garages specifically registered under Maharashtra filter yet. All India network mechanics can still be accessed via live GPS search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maharashtraGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
