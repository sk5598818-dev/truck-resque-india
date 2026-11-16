import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import { Wrench, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Heavy Commercial Truck Services & Repairs | TRUCK RESCUE INDIA',
  description: 'Explore full network of heavy truck mechanics, electricians, scanner diagnostics, ECM flashing, tyre puncture and hydraulic recovery across India.',
};

export default function ServicesIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold text-orange-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ALL-INDIA COMMERCIAL VEHICLE SERVICE DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Truck Services Directory</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Select a category to find specialized verified technicians, diagnostic adapters, and roadside assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICE_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/services/${cat.id}`}
            className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 p-6 rounded-3xl transition group hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Wrench className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                {cat.label}
              </h2>
              <p className="text-xs text-slate-400 mt-1">{cat.hindi}</p>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-4 border-t border-slate-800 group-hover:text-orange-400 transition">
              <span>Find Nearby Specialists</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
