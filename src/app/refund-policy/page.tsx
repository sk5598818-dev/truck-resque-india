import React from 'react';
import Link from 'next/link';
import { RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy | TRUCK RESCUE INDIA',
  description: 'Refund, cancellation, and billing dispute policies for TRUCK RESCUE INDIA garage subscription plans and sponsored listings.'
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Refund Policy</span>
      </nav>

      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Billing Transparency</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Refund and Cancellation Policy</h1>
        <p className="text-xs text-slate-400">Published: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">1. Free Tier Services</h2>
        <p>
          Basic garage registration, search visibility, phone connections, and driver emergency SOS alerts are provided completely free of charge. No payment is required, and no subscription fee is charged.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">2. Optional Paid Visibility Tiers (Featured & Premium)</h2>
        <p>
          Garage owners who choose to purchase optional promotional visibility tiers (Featured at ₹1,499/30-days or Premium at ₹3,999/30-days) receive instant activation of priority search badges and enhanced media galleries upon payment confirmation.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
          <li><strong className="text-white">Cancellation within 48 Hours:</strong> If an upgraded garage experiences technical failure or accidental double-billing, a full 100% refund is initiated within 5 to 7 business days via the original payment method (Razorpay / UPI).</li>
          <li><strong className="text-white">Pro-Rata Settlement:</strong> If a workshop listing is suspended by our operations desk due to verified trade non-compliance, remaining unused days are evaluated for refund less administrative verification overhead.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">3. Roadside Rescue Disputes</h2>
        <p>
          Payments for mechanical parts or on-site labor are made directly between the truck captain and the responding mechanic. In cases of overcharging or incomplete service, drivers may file a formal dispute via our <strong>Dispute Resolution Console</strong>. While TRUCK RESCUE INDIA mediates and enforces accountability up to permanent workshop removal, direct financial settlements are between the service parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">4. Refund Request Process</h2>
        <p>
          To request a subscription billing refund, email <strong className="text-white">billing@truckrescueindia.in</strong> with your Invoice Number (e.g., INV-2026-XXXXX), garage ID, and registered mobile number.
        </p>
      </section>
    </div>
  );
}
