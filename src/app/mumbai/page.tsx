import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { MapPin, ShieldCheck, ArrowLeft, Navigation, PhoneCall, Truck, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mumbai Truck Breakdown, Electrician & Crane Towing Services | TRUCK RESCUE INDIA',
  description: 'Emergency truck roadside repair in Mumbai, Navi Mumbai, JNPT, Kalamboli, Bhiwandi, Thane and Panvel. 24x7 heavy vehicle mechanics, diagnostic scanner, and trailer hydraulic recovery.',
  keywords: 'truck mechanic mumbai, jnpt container trailer repair, kalamboli crane towing, bhiwandi truck mechanic, navi mumbai truck breakdown'
};

export default async function MumbaiPage() {
  const allGarages = await fetchAllGarages();
  const mumbaiGarages = allGarages.filter(g => 
    (g.city && ['mumbai', 'navi mumbai', 'thane', 'bhiwandi', 'panvel', 'kalamboli'].some(c => g.city.toLowerCase().includes(c))) ||
    (g.address && ['mumbai', 'navi mumbai', 'thane', 'bhiwandi', 'jnpt'].some(c => g.address.toLowerCase().includes(c)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Link href="/maharashtra" className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Maharashtra Hub</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>COMMERCIAL CAPITAL FREIGHT REGION — MUMBAI MMR</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Mumbai Truck Rescue & Roadside Garage Network
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Fast emergency assistance for container trailers at JNPT / Nhava Sheva port, heavy steel haulers at Kalamboli, and interstate e-commerce fleets passing through Bhiwandi and Thane Ghodbunder Road.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/nearby?search=Mumbai"
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Locate Nearest Mumbai Mechanic</span>
            </Link>

            <Link
              href="/emergency?city=Mumbai"
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency Port & Highway SOS</span>
            </Link>

            <a
              href="tel:1800889988"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>24x7 Help: 1800-889-988</span>
            </a>
          </div>
        </div>
      </div>

      {/* MMR Key Transport Corridors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          'JNPT Port Nhava Sheva',
          'Kalamboli Steel Terminal',
          'Bhiwandi Warehousing Belt',
          'Thane Ghodbunder Road',
          'Panvel - Pune Expressway Toll',
          'Vashi APMC Mandi'
        ].map((area, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center">
            <p className="text-xs font-bold text-slate-200">{area}</p>
          </div>
        ))}
      </div>

      {/* Garages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Active Workshops in Mumbai Metropolitan Region ({mumbaiGarages.length})</span>
          </h2>
          <Link href="/nearby?search=Mumbai" className="text-xs text-orange-400 hover:underline font-bold">
            GPS Distance View →
          </Link>
        </div>

        {mumbaiGarages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
            All registered network mechanics serving the greater MMR corridor are searchable via GPS live radar.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mumbaiGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
