import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { MapPin, ShieldCheck, ArrowLeft, Navigation, PhoneCall, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delhi NCR Truck Breakdown, SGTN Mechanic & Highway SOS | TRUCK RESCUE INDIA',
  description: 'Fast heavy commercial truck repair in Delhi NCR, Sanjay Gandhi Transport Nagar (SGTN), Kundli, KMP/KGP Peripheral Expressways, Faridabad, and Ghaziabad. BS6 scanner & towing.',
  keywords: 'truck mechanic delhi, sgtn mechanic, sanjay gandhi transport nagar truck repair, kundli truck breakdown, kmp expressway crane, delhi mumbai expressway breakdown'
};

export default async function DelhiNCRPage() {
  const allGarages = await fetchAllGarages();
  const delhiGarages = allGarages.filter(g => 
    (g.state && ['delhi', 'delhi ncr', 'haryana', 'uttar pradesh'].some(s => g.state.toLowerCase().includes(s))) &&
    (g.city && ['delhi', 'new delhi', 'kundli', 'gurugram', 'faridabad', 'noida', 'ghaziabad', 'sonipat'].some(c => g.city.toLowerCase().includes(c)))
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
            <span>NORTHERN FREIGHT GATEWAY — DELHI NCR & PERIPHERALS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Delhi NCR Heavy Truck Rescue & Garage Network
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Immediate mobile breakdown assistance across Sanjay Gandhi Transport Nagar (SGTN GT Karnal Road), Western & Eastern Peripheral Expressways (KMP / KGP), Kundli Industrial Belt, and NH 44 / NH 19 freight gateways.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/nearby?search=Delhi"
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Locate Delhi NCR Mechanics</span>
            </Link>

            <Link
              href="/emergency?state=Delhi%20NCR"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency SGTN / Highway SOS</span>
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

      {/* Delhi NCR Freight Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Sanjay Gandhi Transport Nagar', sub: 'Asia\'s Largest Transport Hub (NH 44)' },
          { name: 'Kundli & Sonipat Border', sub: 'Northern Inbound Logistics Hub' },
          { name: 'KMP & KGP Expressways', sub: 'High-Speed Freight Bypass' },
          { name: 'Faridabad & Mathura Road', sub: 'Industrial Manufacturing Hub (NH 19)' }
        ].map((h, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1">
            <p className="text-sm font-bold text-white">{h.name}</p>
            <p className="text-[11px] text-slate-400">{h.sub}</p>
          </div>
        ))}
      </div>

      {/* Garages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Garages Serving Delhi NCR ({delhiGarages.length})</span>
          </h2>
          <Link href="/nearby?search=Delhi" className="text-xs text-orange-400 hover:underline font-bold">
            Live Radar →
          </Link>
        </div>

        {delhiGarages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            All registered network mechanics serving Delhi NCR are available via live GPS search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {delhiGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
