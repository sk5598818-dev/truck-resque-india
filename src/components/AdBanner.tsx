'use client';

import React, { useState, useEffect } from 'react';
import { Advertisement } from '@/lib/types';
import { fetchActiveAdvertisements, recordAdEvent } from '@/lib/businessService';
import { ExternalLink, Tag } from 'lucide-react';

interface AdBannerProps {
  placement: 'homepage_banner' | 'category_page' | 'sponsored_section' | 'garage_profile';
  category?: string;
  className?: string;
}

export default function AdBanner({ placement, category, className = '' }: AdBannerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const active = await fetchActiveAdvertisements(placement, category);
        if (mounted && active.length > 0) {
          setAds(active);
          // Record impression for the first visible ad
          recordAdEvent(active[0].id, 'impression');
        }
      } catch (e) {
        console.warn('Failed to load advertisements', e);
      }
    };

    load();

    const handleAdUpdate = () => load();
    window.addEventListener('truck_rescue_ads_updated', handleAdUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('truck_rescue_ads_updated', handleAdUpdate);
    };
  }, [placement, category]);

  if (ads.length === 0) return null;

  const currentAd = ads[currentAdIndex];

  const handleClick = () => {
    recordAdEvent(currentAd.id, 'click');
    if (currentAd.destinationUrl) {
      window.open(currentAd.destinationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-4 shadow-lg transition-all hover:border-amber-400/60 ${className}`}
      onClick={handleClick}
      role="banner"
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Ad media / icon */}
        {currentAd.bannerUrl && (
          <div className="h-20 w-full sm:w-36 flex-shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-slate-700">
            <img 
              src={currentAd.bannerUrl} 
              alt={currentAd.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}

        {/* Ad text content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-amber-400 border border-amber-500/30">
              <Tag className="w-2.5 h-2.5" /> Sponsored
            </span>
            <span className="text-xs text-slate-400">{currentAd.advertiserName}</span>
          </div>
          <h4 className="text-base font-bold text-white leading-snug group-hover:text-amber-400">
            {currentAd.title}
          </h4>
          <p className="mt-1 text-xs text-slate-300 line-clamp-2">
            {currentAd.description}
          </p>
        </div>

        {/* Call to action */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <button 
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
