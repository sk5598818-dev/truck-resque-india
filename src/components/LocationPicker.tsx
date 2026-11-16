'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number, addressDetails?: any) => void;
  label?: string;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  label = 'Garage GPS Coordinates'
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setStatusMsg('Acquiring high accuracy GPS lock...');
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lon = Math.round(pos.coords.longitude * 10000) / 10000;

        let addressDetails: any = null;
        try {
          // Reverse geocode via free OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (res.ok) {
            const data = await res.json();
            addressDetails = {
              city: data.address.city || data.address.town || data.address.village || data.address.suburb,
              state: data.address.state,
              district: data.address.state_district || data.address.county,
              pincode: data.address.postcode,
              displayName: data.display_name,
            };
          }
        } catch (e) {
          console.warn('Reverse geocode failed', e);
        }

        onChange(lat, lon, addressDetails);
        setLoading(false);
        setStatusMsg('GPS coordinates captured successfully!');
        setTimeout(() => setStatusMsg(null), 4000);
      },
      (err) => {
        setLoading(false);
        setErrorMsg('Unable to retrieve your location. Please check location permissions or enter coordinates manually.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg transition disabled:opacity-50 shadow"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{loading ? 'Locating...' : 'Use My Current GPS'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-[11px] text-slate-400 mb-1">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0, longitude)}
            placeholder="e.g. 19.2968"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <span className="block text-[11px] text-slate-400 mb-1">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => onChange(latitude, parseFloat(e.target.value) || 0)}
            placeholder="e.g. 73.0631"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {statusMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {latitude && longitude ? (
        <div className="pt-2">
          <a
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 underline inline-flex items-center gap-1"
          >
            Preview pinned location on Google Maps
          </a>
        </div>
      ) : null}
    </div>
  );
}
