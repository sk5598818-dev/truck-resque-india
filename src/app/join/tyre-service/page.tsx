import React from 'react';
import Link from 'next/link';
import { Disc, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as Commercial Radial Tyre Service | TRUCK RESCUE INDIA',
  description: 'Register as a highway truck tyre shop or mobile puncture van. Receive heavy commercial tyre burst and replacement jobs.'
};

export default function JoinTyreServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/join" className="hover:text-white">Join Network</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Tyre Service</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
          <Disc className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Specialization: Commercial Radial Tyres</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Join as Commercial Tyre Service (टायर व पंचर सर्विस)</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Multi-axle 10-wheeler, 14-wheeler, 16-wheeler, and trailer tyre bursts require pneumatic tools, high-capacity hydraulic bottle jacks, and heavy radial tubes on highways.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">Commercial Tyre Services Highlighted</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Heavy pneumatic impact wrench roadside stud removal</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>295/80 R22.5 & 10.00 R20 radial tyre sales & fitting</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Cold vulcanized patch repair for high-ply tyres</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>50-ton hydraulic bottle jack roadside assistance</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?role=tyre"
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>REGISTER TYRE SHOP FREE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3.5 rounded-xl transition text-center text-sm"
          >
            Owner Login
          </Link>
        </div>
      </div>
    </div>
  );
}
