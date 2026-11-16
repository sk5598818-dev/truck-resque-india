'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Phone, KeyRound, Shield, CheckCircle, ArrowRight, UserCheck, Wrench, LogOut, Navigation } from 'lucide-react';
import OtpAuthModal from '@/components/OtpAuthModal';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeModal, setActiveModal] = useState<'driver' | 'garage' | null>(null);

  const handleAuthSuccess = (authUser: any) => {
    if (activeModal === 'garage') {
      router.push('/garage-dashboard');
    } else {
      router.push('/nearby');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Brand Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-orange-600/20 text-orange-500 border border-orange-500/40 flex items-center justify-center mx-auto shadow-lg">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Login to Truck Rescue India</h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Fast and secure mobile OTP login for commercial vehicle drivers, fleet managers, and garage owners.
        </p>
      </div>

      {/* If user is already logged in */}
      {user ? (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">You Are Already Logged In</h2>
            <p className="text-xs text-slate-400 mt-1">Mobile: <strong className="text-white">{user.phone}</strong></p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/nearby"
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow"
            >
              <Navigation className="w-4 h-4" />
              <span>Go to Nearby Garage Search</span>
            </Link>

            <Link
              href="/garage-dashboard"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-slate-700"
            >
              <Wrench className="w-4 h-4 text-orange-400" />
              <span>Open Garage Dashboard</span>
            </Link>

            <button
              onClick={() => logout()}
              className="bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition border border-slate-800 mt-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out Current Account</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* DRIVER LOGIN CARD */}
          <div className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl transition group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">For Drivers & Fleets</span>
                <h2 className="text-xl font-bold text-white mt-1">Truck Driver Login</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Log in with your 10-digit mobile number to quickly bookmark trusted highway mechanics, save emergency contacts, and search nearby services with zero friction.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('driver')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Driver OTP Login (ड्राइवर लॉगिन)</span>
            </button>
          </div>

          {/* GARAGE OWNER LOGIN CARD */}
          <div className="bg-slate-900 border border-slate-800 hover:border-orange-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl transition group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">For Service Providers</span>
                <h2 className="text-xl font-bold text-white mt-1">Garage & Mechanic Login</h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Manage your garage listing, toggle open/closed status, update highway location, add diagnostic scanners, and view incoming customer calls.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('garage')}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>Garage Dashboard Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Otp Modal */}
      <OtpAuthModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        onSuccess={handleAuthSuccess}
        role={activeModal || 'driver'}
        title={activeModal === 'garage' ? 'Garage Owner OTP Login' : 'Driver Mobile Login'}
        subtitle="Enter your 10-digit Indian phone number to receive instant SMS verification code."
      />
    </div>
  );
}
