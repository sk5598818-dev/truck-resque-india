import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, ShieldAlert } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer & Safety Guidelines | TRUCK RESCUE INDIA',
  description: 'Roadside safety guidelines, AI diagnostic assistant disclaimer, and heavy commercial vehicle emergency assistance legal notices.'
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Disclaimer</span>
      </nav>

      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Safety & Liability Guidelines</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Platform Disclaimer & Highway Safety</h1>
        <p className="text-xs text-slate-400">Published: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">1. AI Heavy Commercial Vehicle Diagnostic Assistant Disclaimer</h2>
        <p>
          The AI Diagnostic Assistant (`/ai-diagnostic`) provides technical guidance, J1939 SPN/FMI interpretations, OBD fault descriptions, and safe inspection checklists based on standard heavy commercial engineering literature (Tata, Leyland, Eicher, BharatBenz, Cummins).
        </p>
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-amber-200 text-xs space-y-2">
          <strong>Important Safety Notice:</strong>
          <p>
            AI diagnosis is an advisory tool and does not substitute for certified OBD diagnostic scanner live data readings or on-site physical inspection by an authorized heavy vehicle technician. Never attempt dangerous electrical bridge wires or high-pressure common rail disassemblies while the engine is running or under fuel rail pressure (up to 2,000 bar).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">2. Highway Breakdown Safety Rules for Drivers</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
          <li>Always pull your heavy vehicle as far left onto the paved highway shoulder as possible.</li>
          <li>Engage hazard warning blinkers immediately and position reflective emergency triangles 50 meters behind your truck.</li>
          <li>Wear high-visibility reflective safety vests during night breakdowns on busy National Highways.</li>
          <li>Never crawl beneath an unchocked truck on an incline. Always apply wheel stoppers and air spring-brake locks.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">3. Third-Party Mechanics & Towing Operators</h2>
        <p>
          Mechanics, electricians, and crane recovery services listed on TRUCK RESCUE INDIA are independent contractors and workshops. While our operations desk validates workshop trade identity, physical GPS location, and diagnostic equipment before verification, vehicle owners remain responsible for verifying invoice line items and observing work quality on site.
        </p>
      </section>
    </div>
  );
}
