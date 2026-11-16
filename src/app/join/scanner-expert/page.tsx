import React from 'react';
import Link from 'next/link';
import { Cpu, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as Laptop Scanner Expert | TRUCK RESCUE INDIA',
  description: 'Register as an OBD diagnostic scanner specialist. Clear limp mode, read J1939 fault codes, and troubleshoot Tata, Leyland, Eicher, and BharatBenz BS6 trucks.'
};

export default function JoinScannerExpertPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/join" className="hover:text-white">Join Network</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Scanner Diagnostic Expert</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center">
          <Cpu className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400">Specialization: Diagnostic Scanners & J1939</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Join as Diagnostic Scanner Expert (स्कैनर एक्सपर्ट)</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            BS6 commercial trucks in India enter severe speed de-rates (20 km/h Limp Mode) due to sensor faults. Fleets urgently search for scanner technicians equipped with laptop adapters.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">Diagnostic Scanner Services Needed</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Tata Motors INSITE & e-Diagnostic fault code clearing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ashok Leyland e-Diagnostics / Cummins INLINE adapter testing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>BharatBenz Xentry & Eicher E-Logs real-time live sensor graphing</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>NOx sensor, DPF differential pressure & rail pressure testing</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?role=scanner"
            className="bg-sky-600 hover:bg-sky-500 text-white font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>REGISTER AS SCANNER EXPERT FREE</span>
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
