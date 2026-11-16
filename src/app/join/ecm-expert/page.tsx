import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as ECM / ECU & SCR Specialist | TRUCK RESCUE INDIA',
  description: 'Register as an engine control module specialist. Provide BS6 AdBlue dosing unit repair, NOx sensor calibration, DCU repair, and ECM programming.'
};

export default function JoinEcmExpertPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/join" className="hover:text-white">Join Network</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">ECM / ECU & BS6 Expert</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">Specialization: Microelectronics & Emission Control</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Join as ECM/ECU & BS6 Specialist (ईसीएम एक्सपर्ट)</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            High-value repair of Bosch EDC17, Continental, Delphi, and Cummins ECM hardware. Resolve urea dosing unit blockages, DEF pump errors, and DCU communication failures.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">ECM Specialist Trade Scope</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>BS6 DEF dosing pump & injector cleaning / pressure calibration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>ECM hardware power supply & injector driver MOSFET repairs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>CAN Bus 60-ohm communication fault finding</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>BS4 to BS6 transition diagnostics without violating emission norms</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?role=ecm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>REGISTER AS ECM SPECIALIST FREE</span>
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
