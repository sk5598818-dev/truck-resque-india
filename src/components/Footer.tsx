import React from 'react';
import Link from 'next/link';
import { Truck, PhoneCall, ShieldCheck, MapPin, Heart, Wrench, Zap, Cpu, Anchor } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Helpline Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-orange-950/60 border-b border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">NHAI & Emergency Highway Numbers</h3>
              <p className="text-xs text-slate-400">Keep these numbers saved on your commercial vehicle dashboard</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">NHAI Highway Emergency</span>
              <a href="tel:1033" className="text-base font-black text-amber-400 hover:text-amber-300">1033</a>
            </div>
            <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-center">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">All-India Emergency</span>
              <a href="tel:112" className="text-base font-black text-red-400 hover:text-red-300">112</a>
            </div>
            <div className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-center shadow-lg transition">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-orange-200">Truck Rescue Control</span>
              <a href="tel:18002008899" className="text-base font-black text-white">1800-200-8899</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="w-6 h-6 text-orange-500" />
              <span className="text-lg font-black text-white tracking-wider">TRUCK RESCUE INDIA</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              India&apos;s leading on-demand commercial vehicle breakdown and garage discovery platform. Connecting transport fleet owners, truck captains, and highway mechanics across all National Highways.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Garages & Mechanics Network</span>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Key Truck Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/nearby?category=mechanic" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-orange-500" />
                  Heavy Truck Mechanic (कमानी, ब्रेक, इंजन)
                </Link>
              </li>
              <li>
                <Link href="/nearby?category=electrician" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  Truck Electrician & Starter Alternator
                </Link>
              </li>
              <li>
                <Link href="/nearby?category=scanner" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" />
                  Laptop Diagnostic & Scanner Specialists
                </Link>
              </li>
              <li>
                <Link href="/nearby?category=ecm" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  ECM / ECU Flashing & BS6 DEF Urea System
                </Link>
              </li>
              <li>
                <Link href="/nearby?category=towing" className="hover:text-orange-400 transition flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-purple-400" />
                  50-Ton Hydraulic Crane & Truck Towing
                </Link>
              </li>
            </ul>
          </div>

          {/* Highway Corridors */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Major Corridors</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/nearby?search=NH44" className="hover:text-orange-400 transition">
                  NH 44: Kashmir to Kanyakumari
                </Link>
              </li>
              <li>
                <Link href="/nearby?search=NH48" className="hover:text-orange-400 transition">
                  NH 48: Delhi - Jaipur - Mumbai - Chennai
                </Link>
              </li>
              <li>
                <Link href="/nearby?search=NH19" className="hover:text-orange-400 transition">
                  NH 19: GT Road (Delhi - Varanasi - Kolkata)
                </Link>
              </li>
              <li>
                <Link href="/nearby?search=Bhiwandi" className="hover:text-orange-400 transition">
                  Bhiwandi Transport Hub (Mumbai/JNPT)
                </Link>
              </li>
              <li>
                <Link href="/nearby?search=SGTN" className="hover:text-orange-400 transition">
                  Sanjay Gandhi Transport Nagar (Delhi)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Garages & Workshops</h4>
            <p className="text-xs text-slate-400 mb-3">
              Are you a truck mechanic, electrician, or towing operator? Join India&apos;s fastest growing commercial vehicle network today.
            </p>
            <Link
              href="/register"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition"
            >
              Register Garage Free (फ्री रजिस्ट्रेशन)
            </Link>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              PWA Support enabled for Android. Install via browser menu.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TRUCK RESCUE INDIA. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for Indian Highway Truckers with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
            <span>across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
