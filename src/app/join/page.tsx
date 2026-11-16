import React from 'react';
import Link from 'next/link';
import { 
  Wrench, 
  Zap, 
  Cpu, 
  Disc, 
  Anchor, 
  Package, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join TRUCK RESCUE INDIA | Free Garage & Mechanic Registration',
  description: 'Register your heavy truck workshop, auto electrical service, OBD scanner setup, ECM flashing, tyre shop, or hydraulic towing crane on India’s national roadside network.'
};

export default function JoinPortalPage() {
  const categories = [
    {
      slug: 'mechanic',
      roleParam: 'mechanic',
      title: 'Heavy Truck Mechanic',
      hindi: 'हेवी ट्रक मैकेनिक',
      icon: Wrench,
      color: 'from-orange-600 to-amber-600',
      tag: 'Engine & Transmission',
      desc: 'Clutch plate, engine overhaul, suspension leaf springs, air brake overhaul, propeller shaft, gearbox.'
    },
    {
      slug: 'electrician',
      roleParam: 'electrician',
      title: 'Truck Auto Electrician',
      hindi: 'ट्रक ऑटो इलेक्ट्रीशियन',
      icon: Zap,
      color: 'from-yellow-600 to-amber-600',
      tag: 'Starter & Alternator',
      desc: 'High-current starter motor repair, 24V alternator, wiring short circuits, relay replacement, battery jumpstarts.'
    },
    {
      slug: 'scanner-expert',
      roleParam: 'scanner',
      title: 'Scanner & Diagnostic Expert',
      hindi: 'लैपटॉप स्कैनर एक्सपर्ट',
      icon: Cpu,
      color: 'from-sky-600 to-blue-600',
      tag: 'OBD & J1939 Codes',
      desc: 'Tata INSITE, Leyland e-Diagnostic, Bosch KTS, BharatBenz Xentry, Limp Mode clearing, sensor diagnosis.'
    },
    {
      slug: 'ecm-expert',
      roleParam: 'ecm',
      title: 'ECM / ECU & SCR Specialist',
      hindi: 'ईसीएम / ईसीयू व AdBlue एक्सपर्ट',
      icon: Sparkles,
      color: 'from-emerald-600 to-teal-600',
      tag: 'BS6 Emission Expert',
      desc: 'BS6 AdBlue dosing pump repair, DEF crystallization cleaning, NOx sensor testing, DCU & ECU flashing.'
    },
    {
      slug: 'tyre-service',
      roleParam: 'tyre',
      title: 'Commercial Radial Tyre Service',
      hindi: 'रेडियल टायर व पंचर सर्विस',
      icon: Disc,
      color: 'from-amber-600 to-yellow-600',
      tag: 'Highway Tyre Support',
      desc: 'Heavy radial tyre changes, pneumatic impact wrench roadside service, cold vulcanized patches, rim alignment.'
    },
    {
      slug: 'towing',
      roleParam: 'towing',
      title: 'Hydraulic Towing & Crane',
      hindi: 'हाइड्रोलिक टोइंग व क्रेन सर्विस',
      icon: Anchor,
      color: 'from-purple-600 to-indigo-600',
      tag: 'Breakdown Recovery',
      desc: 'Heavy commercial underlift towing, hydraulic crane lifting, accident truck recovery, inter-state towing.'
    },
    {
      slug: 'spare-parts',
      roleParam: 'parts',
      title: 'Heavy Truck Spare Parts Shop',
      hindi: 'हेवी ट्रक स्पेयर पार्ट्स',
      icon: Package,
      color: 'from-blue-600 to-slate-700',
      tag: 'Highway Parts Stockist',
      desc: 'Filters, hoses, fan belts, injectors, brake boosters, genuine Tata, Leyland & Cummins parts supply.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Join Network</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Free Lifetime Registration (कोई कमीशन नहीं)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          JOIN TRUCK RESCUE INDIA NETWORK
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 leading-relaxed">
          Receive direct phone calls, WhatsApp messages, and emergency breakdown SOS alerts from commercial drivers on your highway stretch. Select your specialization below to begin:
        </p>
      </div>

      {/* 7 Specialized Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <div 
              key={c.slug}
              className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 flex flex-col justify-between transition group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${c.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 border border-slate-800">
                    {c.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                    {c.title}
                  </h3>
                  <span className="text-xs text-orange-400 font-semibold">{c.hindi}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <Link
                  href={`/join/${c.slug}`}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Register as {c.title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5-Step Process Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">Easy 5-Step Registration</span>
          <h2 className="text-2xl font-black text-white">How Workshop Registration Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="w-7 h-7 rounded-full bg-orange-600 text-white font-black inline-flex items-center justify-center mx-auto text-xs">1</span>
            <strong className="block text-white font-bold">Mobile OTP</strong>
            <p className="text-[11px] text-slate-400">Verify your Indian mobile number via OTP.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="w-7 h-7 rounded-full bg-orange-600 text-white font-black inline-flex items-center justify-center mx-auto text-xs">2</span>
            <strong className="block text-white font-bold">Shop Details</strong>
            <p className="text-[11px] text-slate-400">Enter garage name, phone, WhatsApp & photo.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="w-7 h-7 rounded-full bg-orange-600 text-white font-black inline-flex items-center justify-center mx-auto text-xs">3</span>
            <strong className="block text-white font-bold">GPS Location</strong>
            <p className="text-[11px] text-slate-400">Pin highway location so nearby drivers discover you.</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="w-7 h-7 rounded-full bg-orange-600 text-white font-black inline-flex items-center justify-center mx-auto text-xs">4</span>
            <strong className="block text-white font-bold">Select Brands</strong>
            <p className="text-[11px] text-slate-400">Choose supported brands (Tata, Leyland, Eicher, etc.).</p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5 text-center">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black inline-flex items-center justify-center mx-auto text-xs">5</span>
            <strong className="block text-white font-bold">Fast Approval</strong>
            <p className="text-[11px] text-slate-400">Desk verifies listing and publishes live.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
