'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Siren, Wrench, ShieldAlert } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface EmergencySosButtonProps {
  variant?: 'banner' | 'floating' | 'inline' | 'compact';
  onOpenModal?: () => void;
  className?: string;
}

export default function EmergencySosButton({
  variant = 'banner',
  onOpenModal,
  className = ''
}: EmergencySosButtonProps) {
  const { lang } = useLanguage();

  const isHindi = lang === 'hi';

  const handleClick = (e: React.MouseEvent) => {
    if (onOpenModal) {
      e.preventDefault();
      onOpenModal();
    }
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-20 right-4 z-40 sm:bottom-6 sm:right-6 ${className}`}>
        <Link
          href="/emergency/new"
          onClick={handleClick}
          prefetch={false}
          className="group relative flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3.5 rounded-full shadow-2xl border-2 border-yellow-400 animate-pulse hover:animate-none transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label="Emergency Truck Breakdown Help"
        >
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400"></span>
          </span>
          <Siren className="w-6 h-6 text-yellow-300 animate-bounce" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-sm font-black tracking-wider uppercase text-yellow-200">
              {isHindi ? 'आपातकालीन सहायता' : 'EMERGENCY TRUCK HELP'}
            </span>
            <span className="text-[10px] text-white/90 font-medium">
              {isHindi ? 'हाईवे ब्रेकडाउन SOS' : 'Instant Mechanic SOS'}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href="/emergency/new"
        onClick={handleClick}
        prefetch={false}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-lg border border-yellow-300/40 transition-all ${className}`}
      >
        <Siren className="w-4 h-4 text-yellow-300 animate-pulse" />
        <span>{isHindi ? 'आपातकालीन मदद (SOS)' : 'EMERGENCY TRUCK HELP'}</span>
      </Link>
    );
  }

  // Default Banner Variant - High-visibility highway emergency banner
  return (
    <div className={`w-full ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-orange-600 p-1 shadow-2xl border-2 border-yellow-400/80">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative bg-zinc-950/90 backdrop-blur-md rounded-[14px] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-lg border border-yellow-300">
              <Siren className="w-8 h-8 sm:w-9 sm:h-9 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-300"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-red-600/30 text-yellow-300 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-red-500/40">
                  {isHindi ? 'हाईवे 24x7 इमरजेंसी' : '24x7 National Highway SOS'}
                </span>
                <span className="text-zinc-400 text-xs hidden sm:inline">• 15-30 Min Response</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">
                {isHindi ? 'ट्रक ब्रेकडाउन या खराबी? तुरंत मदद पाएं' : 'BROKEN DOWN ON THE HIGHWAY?'}
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm mt-0.5">
                {isHindi 
                  ? 'इंजन, वायरिंग, यूरिया, ब्रेक या टायर समस्या के लिए नजदीकी मैकेनिक वैन तुरंत बुलाएं' 
                  : 'Engine, wiring, AdBlue urea, brake, tyre or towing: Nearby mobile rescue van dispatched to your spot.'}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <Link
              href="/emergency/new"
              onClick={handleClick}
              prefetch={false}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-base sm:text-lg px-6 py-3.5 rounded-xl shadow-xl border-2 border-yellow-400 hover:scale-105 active:scale-95 transition-all text-center tracking-wide"
            >
              <AlertTriangle className="w-6 h-6 text-yellow-300 animate-bounce" />
              <span>{isHindi ? 'आपातकालीन सहायता (SOS)' : 'EMERGENCY TRUCK HELP'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
