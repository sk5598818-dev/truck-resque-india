'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Garage } from '@/lib/types';
import { 
  PhoneCall, 
  MessageSquare, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Star, 
  MapPin, 
  Wrench, 
  ExternalLink,
  Eye,
  AlertCircle
} from 'lucide-react';
import { formatDistance } from '@/lib/geo';
import { useLanguage } from './LanguageContext';

interface GarageCardProps {
  garage: Garage;
  userLat?: number;
  userLon?: number;
}

export default function GarageCard({ garage, userLat, userLon }: GarageCardProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  // Clean phone number for tel: and whatsapp:
  const rawPhone = (garage.phone || '').replace(/[^0-9]/g, '');
  const hasValidPhone = rawPhone.length >= 10;
  const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;
  
  const whatsappUrl = hasValidPhone
    ? `https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(garage.garageName)},%20I%20found%20you%20on%20Truck%20Rescue%20India.%20My%20heavy%20commercial%20vehicle%20needs%20assistance.`
    : '#';

  const directionsUrl = (garage.latitude && garage.longitude)
    ? `https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(garage.garageName + ' ' + garage.city)}`;

  // Default fallback image if workshop photo is missing
  const defaultPhoto = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80';
  const displayPhoto = (garage.photos && garage.photos.length > 0 && !imageError) 
    ? garage.photos[0] 
    : defaultPhoto;

  const categoryLabel = 
    garage.garageType === 'towing_recovery' ? 'Crane & Hydraulic Towing' :
    garage.garageType === 'mobile_only' ? 'Mobile Roadside Van' :
    garage.garageType === 'dealership_authorized' ? 'Authorized Truck Center' :
    garage.garageType === 'spare_parts_shop' ? 'Heavy Spare Parts' :
    'Heavy Truck Workshop';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between group">
      
      <div>
        {/* Photo Container with Status Overlay */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={displayPhoto}
            alt={garage.garageName}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Badges on Top of Photo */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap gap-1.5 pointer-events-auto">
              {garage.isSponsored && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                  👑 SPONSORED
                </span>
              )}
              {!garage.isSponsored && garage.isFeatured && (
                <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                  ⭐ FEATURED
                </span>
              )}

              {garage.verificationStatus === 'verified' && (
                <span className="inline-flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/60 text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  VERIFIED
                </span>
              )}

              {garage.isOpen ? (
                <span className="inline-flex items-center gap-1 bg-emerald-900/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700/60 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPEN NOW
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-rose-950/90 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-800/60 backdrop-blur-sm">
                  CLOSED
                </span>
              )}
            </div>

            {/* Distance Pill */}
            {garage.distanceKm !== undefined && (
              <div className="bg-orange-600/95 border border-orange-400/80 rounded-xl px-2.5 py-1 text-center shadow-lg pointer-events-auto backdrop-blur-sm">
                <span className="block text-xs sm:text-sm font-black text-white leading-none">
                  {garage.distanceKm < 1 ? `${Math.round(garage.distanceKm * 1000)}m` : `${garage.distanceKm} km`}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-orange-100 font-bold">away</span>
              </div>
            )}
          </div>

          {/* Category Pill at bottom of image */}
          <div className="absolute bottom-2 left-3">
            <span className="inline-block bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg shadow">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug hover:text-orange-400 transition">
              <Link href={`/garage/${garage.id}`}>{garage.garageName}</Link>
            </h3>
            
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Owner: <span className="text-slate-200 font-semibold">{garage.ownerName}</span>
            </p>
          </div>

          {/* Badges: 24x7, Roadside Van */}
          <div className="flex flex-wrap items-center gap-2">
            {garage.twentyFourHours && (
              <span className="inline-flex items-center gap-1 bg-blue-950/60 text-blue-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-blue-800">
                <Clock className="w-3 h-3 text-blue-400" />
                24x7 Service
              </span>
            )}

            {garage.mobileService && (
              <span className="inline-flex items-center gap-1 bg-amber-950/60 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-800">
                <Truck className="w-3 h-3 text-amber-400" />
                Roadside Rescue Van
              </span>
            )}
          </div>

          {/* Address & Highway */}
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                {garage.address}, {garage.city}, {garage.state} - {garage.pincode}
              </span>
            </div>

            {garage.highway && (
              <div className="text-[11px] text-amber-300 font-semibold pl-5">
                Highway: <span className="text-white font-medium">{garage.highway}</span>
              </div>
            )}
          </div>

          {/* Services Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {garage.services.slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="bg-slate-800/90 text-slate-300 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md border border-slate-700/80 flex items-center gap-1"
              >
                <Wrench className="w-2.5 h-2.5 text-orange-400" />
                {service}
              </span>
            ))}
            {garage.services.length > 3 && (
              <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-800/50 rounded">
                +{garage.services.length - 3} more
              </span>
            )}
          </div>

          {/* Vehicle Brands Handled */}
          {garage.brands && garage.brands.length > 0 && (
            <div className="text-[11px] text-slate-400 truncate pt-0.5">
              <span className="text-slate-500 font-semibold">Brands: </span>
              <span className="text-slate-300">{garage.brands.slice(0, 3).join(', ')}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-white text-sm">{garage.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-500">({garage.reviewCount} driver reviews)</span>
            </div>

            {garage.serviceRadiusKm && (
              <span className="text-[11px] text-slate-400">
                Radius: <strong className="text-slate-200">{garage.serviceRadiusKm} km</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Driver Action Buttons - High Contrast, Big Touch Targets */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {/* Call Button */}
          {hasValidPhone ? (
            <a
              href={`tel:${garage.phone}`}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-2 rounded-xl transition shadow-md shadow-emerald-700/20 text-center active:scale-95"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span className="text-xs uppercase tracking-wide">CALL</span>
            </a>
          ) : (
            <button
              disabled
              className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-slate-800 text-slate-500 font-bold py-2.5 px-2 rounded-xl text-center cursor-not-allowed opacity-60"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span className="text-xs">NO CALL</span>
            </button>
          )}

          {/* WhatsApp Button */}
          {hasValidPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black py-2.5 px-2 rounded-xl transition shadow-md text-center active:scale-95"
            >
              <MessageSquare className="w-4 h-4 shrink-0 fill-slate-950 text-slate-950" />
              <span className="text-xs uppercase tracking-wide">WHATSAPP</span>
            </a>
          ) : (
            <button
              disabled
              className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-slate-800 text-slate-500 font-bold py-2.5 px-2 rounded-xl text-center cursor-not-allowed opacity-60"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="text-xs">NO CHAT</span>
            </button>
          )}

          {/* Directions Button */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col sm:flex-row items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-2 rounded-xl transition shadow-md text-center active:scale-95"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-wide">MAP</span>
          </a>
        </div>

        {/* View Profile Full Button */}
        <Link
          href={`/garage/${garage.id}`}
          className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white py-2 px-3 rounded-xl border border-slate-800 text-xs font-semibold transition"
        >
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>View Full Garage Profile & Equipment</span>
        </Link>
      </div>

    </div>
  );
}
