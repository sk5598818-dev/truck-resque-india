import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TRUCK RESCUE INDIA',
  description: 'Privacy Policy and data protection compliance for TRUCK RESCUE INDIA under the Information Technology Act 2000 and Digital Personal Data Protection Act 2023.'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Privacy Policy</span>
      </nav>

      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DPDPA 2023 & IT Act 2000 Compliant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Privacy & Data Protection Policy</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026 | Effective for all drivers, mechanics, and fleet operators</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">1. Introduction & Overview</h2>
        <p>
          TRUCK RESCUE INDIA ("we", "us", or "our") operates the heavy commercial vehicle roadside network connecting drivers with mechanics across Indian National Highways. We take driver privacy, location confidentiality, and telematics protection seriously.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">2. Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
          <li><strong className="text-white">Mobile Authentication:</strong> Indian phone numbers (+91) verified via Firebase Phone OTP.</li>
          <li><strong className="text-white">GPS Coordinates:</strong> Real-time latitude, longitude, and geohashes collected strictly when searching for nearby mechanics or triggering an Emergency SOS.</li>
          <li><strong className="text-white">Vehicle Information:</strong> Vehicle registration number, brand, model, and emission standard (BS4/BS6/CNG).</li>
          <li><strong className="text-white">Workshop Listings:</strong> Workshop name, physical trade address, GPS location, service trade licenses, and equipment capabilities.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">3. Location Data & Driver Tracking Protection</h2>
        <p>
          We do not continuously track drivers in the background. GPS coordinates are gathered only with active browser/app permission at the precise moment of an emergency SOS dispatch or nearby search query. Location coordinates are shared only with the specific responding mechanic who accepts the rescue job.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">4. Data Retention & Security</h2>
        <p>
          All data is transmitted via encrypted HTTPS TLS 1.3. Cryptographic HMAC SHA-256 signatures are enforced on payment verifications, and regulatory audit trails are immutably archived. Driver phone numbers are never sold to third-party telemarketers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">5. Grievance Officer</h2>
        <p>
          In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the Grievance Officer can be contacted at <strong className="text-white">privacy@truckrescueindia.in</strong>.
        </p>
      </section>
    </div>
  );
}
