import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICE_CATEGORIES, TRUCK_BRANDS, INDIAN_STATES } from '@/lib/constants';
import { fetchAllGarages } from '@/lib/garageService';
import GarageCard from '@/components/GarageCard';
import { Wrench, ShieldCheck, ArrowLeft, ArrowRight, Navigation, PhoneCall } from 'lucide-react';

interface Props {
  params: { slug: string };
}

const SLUG_ALIASES: Record<string, string> = {
  'truck-mechanic': 'heavy_mechanic',
  'truck-electrician': 'truck_electrician',
  'truck-scanner': 'scanner_diagnostic',
  'ecm-repair': 'ecm_ecu_repair',
  'truck-tyre': 'tyre_puncture',
  'truck-towing': 'towing_recovery',
  'spare-parts': 'spare_parts',
  'mechanic': 'heavy_mechanic',
  'electrician': 'truck_electrician',
  'scanner': 'scanner_diagnostic',
  'towing': 'towing_recovery',
  'tyre': 'tyre_puncture',
  'battery': 'battery_service'
};

function resolveCategory(slug: string) {
  const normalized = slug.toLowerCase();
  const targetId = SLUG_ALIASES[normalized] || normalized.replace(/-/g, '_');
  return SERVICE_CATEGORIES.find(c => c.id === targetId || c.id === normalized || c.id === normalized.replace(/-/g, '_'));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = resolveCategory(params.slug);
  const title = category 
    ? `${category.label} Near Me | 24x7 Highway Truck Assistance | TRUCK RESCUE INDIA`
    : 'Truck Service Specialists in India';

  return {
    title,
    description: `Find top rated ${category?.label || 'commercial vehicle'} mechanics, diagnostic scanners and roadside assistance vans across India. Call directly or get WhatsApp support.`,
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const category = resolveCategory(params.slug);

  if (!category) {
    notFound();
  }

  const allGarages = await fetchAllGarages();
  const matchedGarages = allGarages.filter(g => 
    g.services.some(s => s.toLowerCase().includes(category.label.toLowerCase())) ||
    g.garageType.toLowerCase().includes(params.slug.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Category Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Truck Services</span>
          </Link>

          <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
            {category.hindi}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {category.label} Across India
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Need emergency roadside or workshop assistance for {category.label.toLowerCase()}? Browse verified heavy vehicle workshops equipped with genuine diagnostic tools and mobile highway rescue vans.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/nearby?category=${encodeURIComponent(category.label)}`}
              className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Locate Nearest {category.label}</span>
            </Link>

            <a
              href="tel:18002008899"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition border border-slate-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Helpline 24x7</span>
            </a>
          </div>
        </div>
      </div>

      {/* Matched Garages Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Verified {category.label} Service Providers ({matchedGarages.length})</span>
          </h2>

          <Link
            href={`/nearby?category=${encodeURIComponent(category.label)}`}
            className="text-xs text-orange-400 hover:underline font-bold"
          >
            Open in Nearby Distance Search →
          </Link>
        </div>

        {matchedGarages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 space-y-3">
            <p>No verified garages found specifically for this trade yet.</p>
            <Link
              href="/register"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Be the first {category.label} to register in your city
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
