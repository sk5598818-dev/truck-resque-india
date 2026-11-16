import React from 'react';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | TRUCK RESCUE INDIA',
  description: 'Terms of service, user agreement, and platform policies governing TRUCK RESCUE INDIA emergency breakdown network and mechanic directory.'
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-200 font-semibold">Terms & Conditions</span>
      </nav>

      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold text-blue-400">
          <FileText className="w-3.5 h-3.5" />
          <span>Platform Service Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Terms and Conditions of Use</h1>
        <p className="text-xs text-slate-400">Published: November 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">1. Nature of the Platform</h2>
        <p>
          TRUCK RESCUE INDIA is a technology discovery platform that connects commercial vehicle drivers and transport operators with independent third-party truck mechanics, auto electricians, diagnostic scanner technicians, crane operators, and spare parts suppliers across India.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">2. Free Driver Access & Free Garage Registration</h2>
        <p>
          Registration for garage owners, truck mechanics, electricians, and towing providers is fundamentally free. Finding nearby mechanics and initiating calls or WhatsApp inquiries is completely free for drivers and fleet operators.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">3. Roadside Assistance & Commercial Agreements</h2>
        <p>
          The final cost of mechanical repair, spare parts replacement, towing distances, and roadside service charges is determined directly between the vehicle operator and the attending garage. TRUCK RESCUE INDIA does not dictate mechanic labor rates, although all providers agree to fair, transparent pricing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">4. Account Safety & Misconduct Policy</h2>
        <p>
          Submitting fraudulent SOS calls, extortionary demands on highways, or abusive behavior will result in immediate account suspension and blacklisting from the national network. Operations administrators reserve the right to suspend any garage or driver under dispute investigation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white">5. Governing Law & Jurisdiction</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of the use of this platform shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.
        </p>
      </section>
    </div>
  );
}
