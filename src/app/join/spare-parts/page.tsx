import React from 'react';
import Link from 'next/link';
import { Package, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join as Heavy Truck Spare Parts Dealer | TRUCK RESCUE INDIA',
  description: 'Register as an authorized heavy vehicle parts dealer. Supply genuine Tata, Leyland, Eicher, BharatBenz, and Cummins parts directly to highway mechanics.'
};

export default function JoinSparePartsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/join" className="hover:text-white">Join Network</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Spare Parts Dealer</span>
      </nav>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">Specialization: Genuine Commercial Spares</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">Join as Heavy Truck Spare Parts Shop (स्पेयर पार्ट्स डीलर)</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Supply critical filters, fan belts, clutch sets, brake boosters, DEF fluid (AdBlue ISO 22241), sensors, and turbochargers directly to mechanics and highway breakdown drivers.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">Parts Dealer Benefits</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>High-volume inquiries from fleet drivers stranded on your highway stretch</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>List genuine OEM parts brands (Tata Genuine, Leyparts, Cummins, Wabco, Bosch)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Bulk AdBlue supply inquiries from transport companies</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Free shop listing with GPS coordinates & direct calling</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register?role=parts"
            className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl"
          >
            <span>REGISTER SPARE PARTS SHOP FREE</span>
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
