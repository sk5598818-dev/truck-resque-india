import React from 'react';
import Link from 'next/link';
import { Wrench, CheckCircle2, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as Heavy Truck Mechanic | TRUCK RESCUE INDIA',
  description: 'Register as a verified commercial truck mechanic. Receive engine, transmission, brake, and chassis breakdown jobs from fleet drivers on your highway.'
};

export default function JoinMechanicPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/join" className="hover:text-white">Join Network</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Heavy Truck Mechanic</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center">
          <Wrench className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">Specialization: Engine & Chassis</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Join as Heavy Truck Mechanic (हेवी ट्रक मैकेनिक)</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Get direct road calls for clutch overhaul, brake chamber leakage, radiator hose bursts, spring leaf replacement, gearbox failure, and propeller shaft issues.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">Why Register on TRUCK RESCUE INDIA?</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>100% Free Lifetime Registration (Zero commission on labor)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Direct calls & WhatsApp from drivers on your highway corridor</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Emergency SOS Radar alerts for nearby highway breakdowns</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Verified partner badge builds fleet owner trust</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?role=mechanic"
            className="bg-orange-600 hover:bg-orange-500 text-white font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>REGISTER MECHANIC WORKSHOP FREE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-6 py-3.5 rounded-xl transition text-center text-sm"
          >
            Already Registered? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
