import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { MapPin, ShieldCheck, ArrowLeft, Navigation } from 'lucide-react';

interface Props {
  params: { state: string; city: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = decodeURIComponent(params.city);
  const state = decodeURIComponent(params.state);
  return {
    title: `Truck Mechanic & Repair Services in ${city}, ${state} | TRUCK RESCUE INDIA`,
    description: `Find 24x7 heavy truck mechanics, electricians, scanner diagnostics, ECM flashing and towing recovery in ${city}, ${state}. Verified highway response.`,
  };
}

export default async function CityLocationPage({ params }: Props) {
  const city = decodeURIComponent(params.city);
  const state = decodeURIComponent(params.state);

  const allGarages = await fetchAllGarages();
  const matchedGarages = allGarages.filter(g =>
    g.city.toLowerCase().includes(city.toLowerCase()) ||
    g.state.toLowerCase().includes(state.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
        <div className="space-y-4 max-w-2xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline font-bold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.toUpperCase()}, {state.toUpperCase()} TRUCK NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Truck Breakdown & Garage Services in {city}
          </h1>

          <p className="text-sm text-slate-300">
            Connecting highway drivers and local transport operators in {city} ({state}) with verified heavy vehicle mechanics, diagnostic scanner specialists, and 24x7 towing services.
          </p>

          <div className="pt-2">
            <Link
              href={`/nearby?search=${encodeURIComponent(city)}`}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition shadow"
            >
              <Navigation className="w-4 h-4" />
              <span>Search Nearby in {city}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Available Garages & Service Providers ({matchedGarages.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedGarages.map((g) => (
            <GarageCard key={g.id} garage={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
