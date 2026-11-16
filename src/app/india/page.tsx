import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { 
  MapPin, ShieldCheck, ArrowRight, Navigation, PhoneCall, 
  Truck, Compass, CheckCircle2, AlertTriangle, Cpu, Wrench
} from 'lucide-react';
import { TOP_HIGHWAYS, INDIAN_STATES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Pan-India 24x7 Heavy Truck Breakdown & Highway Rescue Network | TRUCK RESCUE INDIA',
  description: 'National coverage across Golden Quadrilateral, North-South and East-West corridors. Locate verified BS4/BS6 truck mechanics, ECM programmers, and hydraulic crane towing across all 28 states and union territories.',
  keywords: 'truck breakdown india, national highway truck mechanic, nh 44 mechanic, nh 48 mechanic, delhi mumbai expressway crane, bs6 truck assistance india'
};

export default async function IndiaNationalNetworkPage() {
  const allGarages = await fetchAllGarages();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Hero Corridor Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>National Freight Corridor Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Pan-India Heavy Truck Roadside Assistance Network
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            TRUCK RESCUE INDIA connects interstate commercial truck drivers, transport fleet managers, and owner-operators with verified highway mechanics, diagnostic scanner engineers, ECM bench tuners, and towing recovery across all primary National Highways and Expressways.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/nearby"
              className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-orange-600/30 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Use Live GPS Radar Search</span>
            </Link>

            <Link
              href="/emergency"
              className="bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency SOS Request</span>
            </Link>

            <a
              href="tel:1800889988"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>National Toll-Free: 1800-889-988</span>
            </a>
          </div>
        </div>
      </div>

      {/* Corridor Map Quick-Jumps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Maharashtra Corridor', desc: 'Bhiwandi, JNPT, Pune, Nagpur, Samruddhi', href: '/maharashtra', count: 'NH 48 / NH 52' },
          { label: 'Delhi NCR Hub', desc: 'Sanjay Gandhi TN, Kundli, Faridabad, NH 44', href: '/delhi', count: 'NH 44 / NE 4' },
          { label: 'Mumbai Metropolitan', desc: 'Kalamboli, JNPT Port, Thane, Panvel', href: '/mumbai', count: 'NH 48 / E-way' },
          { label: 'Uttar Pradesh Corridor', desc: 'Kanpur, Agra, Varanasi, Lucknow E-Way', href: '/uttar-pradesh', count: 'NH 19 / E-ways' }
        ].map((hub, idx) => (
          <Link
            key={idx}
            href={hub.href}
            className="group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 transition space-y-2 block shadow-lg"
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-orange-400">{hub.count}</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-orange-400 transition" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition">{hub.label}</h3>
            <p className="text-xs text-slate-400">{hub.desc}</p>
          </Link>
        ))}
      </div>

      {/* Major Highway Coverage */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Covered National Highway Corridors</h2>
            <p className="text-xs sm:text-sm text-slate-400">Continuous 24x7 roadside mechanics stationed along India's freight arteries</p>
          </div>
          <Link href="/nearby" className="text-xs text-orange-400 hover:underline font-bold hidden sm:inline">
            Browse Nearby Garages →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOP_HIGHWAYS.map((hwy, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-200 font-medium">{hwy}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Verified Garages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>National Network Garages & Highway Workshops ({allGarages.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Verified heavy truck repair stations across India</p>
          </div>
          <Link href="/nearby" className="text-xs font-bold text-orange-400 hover:underline">
            GPS Radar View →
          </Link>
        </div>

        {allGarages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
            Garages are registering rapidly. Join the network today!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGarages.slice(0, 9).map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        )}
      </div>

      {/* State Directory Links */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Browse Network by State</h3>
        <div className="flex flex-wrap gap-2">
          {INDIAN_STATES.map((state) => (
            <Link
              key={state}
              href={`/nearby?state=${encodeURIComponent(state)}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600/20 text-slate-300 hover:text-orange-400 border border-slate-700 transition"
            >
              {state}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
