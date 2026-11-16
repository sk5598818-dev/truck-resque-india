import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail, MapPin, Clock, MessageSquare, ChevronRight, Send, ShieldCheck } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | TRUCK RESCUE INDIA Operations Desk',
  description: 'Reach TRUCK RESCUE INDIA National Operations Desk, Regional Support Centers in Mumbai, Delhi-NCR, and Bangalore, or request breakdown network support.'
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Contact Operations</span>
      </nav>

      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
          24x7 National Highway Support Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Contact TRUCK RESCUE INDIA
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          For emergency assistance, verification inquiries, fleet partnerships, or dispute mediation
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-base font-bold text-white">Emergency Hotline</h3>
          <p className="text-xs text-slate-400">24x7 Roadside Dispatch Help</p>
          <a href="tel:1800889988" className="text-base font-black text-emerald-400 block hover:underline">
            1800-889-988 (Toll Free)
          </a>
          <span className="text-[10px] text-slate-500 block">Available nationwide for drivers</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Operations Desk</h3>
          <p className="text-xs text-slate-400">Verification & Platform Support</p>
          <a href="mailto:ops@truckrescueindia.in" className="text-sm font-bold text-blue-400 block hover:underline">
            ops@truckrescueindia.in
          </a>
          <span className="text-[10px] text-slate-500 block">Typical response within 2 hours</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">WhatsApp Desk</h3>
          <p className="text-xs text-slate-400">Fast Scanner & Route Help</p>
          <a href="https://wa.me/919820011223" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#25D366] block hover:underline">
            +91 98200 11223
          </a>
          <span className="text-[10px] text-slate-500 block">Official verified WhatsApp channel</span>
        </div>
      </div>

      {/* Regional Operations Offices */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-400" />
          <span>Regional Operations Centers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-white block font-bold text-sm">Western Logistics Hub (HQ)</strong>
            <p className="text-slate-400">Sector 19, Vashi & Bhiwandi Highway Junction, Navi Mumbai, Maharashtra - 400705</p>
            <span className="text-[11px] text-orange-400 font-semibold block pt-1">Phone: +91 22 2789 4400</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-white block font-bold text-sm">Northern Freight Hub</strong>
            <p className="text-slate-400">Sanjay Gandhi Transport Nagar (SGTN), GT Karnal Road, Delhi - 110042</p>
            <span className="text-[11px] text-orange-400 font-semibold block pt-1">Phone: +91 11 2785 8800</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
            <strong className="text-white block font-bold text-sm">Southern Corridor Office</strong>
            <p className="text-slate-400">Hosur Road Transport Yard, Electronic City Phase 2, Bangalore, Karnataka - 560100</p>
            <span className="text-[11px] text-orange-400 font-semibold block pt-1">Phone: +91 80 4120 7700</span>
          </div>
        </div>
      </div>
    </div>
  );
}
