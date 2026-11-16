import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, MapPin, Wrench, Users, Award, Clock, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | TRUCK RESCUE INDIA — Nationwide Commercial Vehicle Support',
  description: 'Connecting heavy commercial vehicle drivers, fleet managers, and transport operators with verified truck mechanics, electricians, scanner technicians, and crane services across Indian National Highways.'
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">About Us</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400">
          <Truck className="w-4 h-4" />
          <span>India's Dedicated Commercial Roadside Network</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Empowering Every Highway Truck Captain
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
          TRUCK RESCUE INDIA was built to solve the most critical bottleneck in India's logistics supply chain: sudden commercial vehicle breakdowns in unfamiliar highway territories.
        </p>
      </div>

      {/* Core Mission & Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Verified Mechanics Only</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every garage, roadside van, and towing operator undergoes trade verification, mobile validation, and physical highway inspection before public listing.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">24x7 Night & Day Assistance</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Breakdowns don't wait for business hours. Our network prioritizes round-the-clock emergency assistance along high-density freight corridors.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Free Lifetime Discovery</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Basic garage registration is guaranteed free forever. Truck drivers search and contact mechanics directly without commission markups.
          </p>
        </div>
      </div>

      {/* Corridors Covered */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">National Highway Reach</span>
          <h2 className="text-2xl font-black text-white">Connected Freight Corridors</h2>
          <p className="text-xs text-slate-400">
            Rapid roadside dispatch across India's busiest economic routes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">NH 48 (Delhi - Mumbai - Chennai)</strong>
            <span>Gurgaon, Jaipur, Ahmedabad, Surat, Vapi, Manor, Thane, Pune, Kolhapur, Hubli, Bangalore.</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">NH 44 (Srinagar - Kanyakumari)</strong>
            <span>Jalandhar, Ludhiana, Ambala, Karnal, Panipat, Agra, Gwalior, Jhansi, Nagpur, Hyderabad.</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">NH 19 (Delhi - Kolkata Corridor)</strong>
            <span>Faridabad, Mathura, Kanpur, Prayagraj, Varanasi, Mohania, Aurangabad, Dhanbad, Asansol.</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">NH 27 (Porbandar - Silchar East-West)</strong>
            <span>Rajkot, Samakhiali, Palanpur, Udaipur, Kota, Shivpuri, Jhansi, Kanpur, Lucknow, Gorakhpur.</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">NH 52 (Punjab - Karnataka Corridor)</strong>
            <span>Sangrur, Hisar, Fatehpur, Sikar, Jaipur, Tonk, Kota, Jhalawar, Indore, Dhule, Solapur.</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <strong className="text-white block font-bold mb-1">JNPT & Major Port Corridors</strong>
            <span>Nhava Sheva, Bhiwandi Logistics Hub, Kalamboli Steel Yard, Mundra, Kandla, Haldia Port.</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-8 text-center text-white space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black">Are You A Heavy Truck Mechanic?</h2>
        <p className="text-xs sm:text-sm text-orange-100 max-w-xl mx-auto">
          Join thousands of roadside assistance experts receiving direct calls and breakdown alerts from fleet drivers on your route.
        </p>
        <div className="pt-2">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl transition shadow-xl text-sm"
          >
            <span>JOIN TRUCK RESCUE INDIA FREE</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
