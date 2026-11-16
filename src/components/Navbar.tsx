'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, PhoneCall, ShieldCheck, MapPin, Menu, X, PlusCircle, UserCheck, LogOut, Wrench, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top Emergency Strip */}
      <div className="bg-orange-600 px-4 py-1.5 text-xs md:text-sm font-semibold text-white flex justify-between items-center">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5 animate-pulse text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
            {t('emergencyBanner')}
          </span>
          <div className="flex items-center gap-3">
            <a
              href="tel:1033"
              className="hidden sm:inline-flex items-center gap-1 bg-slate-950/60 hover:bg-slate-950 px-2 py-0.5 rounded text-amber-300 font-bold transition text-xs"
            >
              <span>NHAI: 1033</span>
            </a>
            <a
              href="tel:18002008899"
              className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-950 px-2.5 py-0.5 rounded text-amber-300 font-bold transition text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Helpline: 1800-200-8899</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-slate-950 border-2 border-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition transform">
              <Truck className="w-7 h-7 text-orange-400 group-hover:text-yellow-300 transition" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white">TRUCK RESCUE</span>
                <span className="text-xs uppercase bg-orange-600 text-white font-extrabold px-1.5 py-0.5 rounded tracking-widest">INDIA</span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-tight">
                24x7 Commercial Vehicle Highway Assistance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5">
            <Link
              href="/nearby"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 hover:text-orange-400 transition"
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>{t('findNearby')}</span>
            </Link>

            <Link
              href="/ai-diagnostic"
              className="flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-500/30"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>AI Diagnostic</span>
              <span className="text-[10px] bg-blue-500 text-white font-black px-1.5 py-0.2 rounded">PRO</span>
            </Link>

            <Link
              href="/services"
              className="text-sm font-semibold text-slate-200 hover:text-orange-400 transition"
            >
              Services
            </Link>

            <Link
              href="/garage-dashboard"
              className="flex items-center gap-1 text-sm font-semibold text-slate-200 hover:text-orange-400 transition"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin"
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 transition"
            >
              Admin
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md font-bold transition ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-md font-bold transition ${
                  lang === 'hi' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang('hinglish')}
                className={`px-2 py-1 rounded-md font-bold transition ${
                  lang === 'hinglish' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hinglish
              </button>
            </div>

            {/* User Auth State */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 py-1 px-2.5 rounded-xl text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold text-white tracking-wide">{user.phone || 'Driver Active'}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Log out"
                  className="p-1 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>{t('driverLogin')}</span>
              </Link>
            )}

            {/* Register Garage CTA */}
            <Link
              href="/register"
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-orange-600/30 transition transform hover:-translate-y-0.5 text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('registerGarage')}</span>
            </Link>
          </nav>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Language Toggle Quick */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : lang === 'hi' ? 'hinglish' : 'en')}
              className="text-xs bg-slate-800 border border-slate-700 text-orange-400 font-bold px-2 py-1.5 rounded"
            >
              {lang.toUpperCase()}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-white">{user.phone || 'Driver Logged In'}</span>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1 text-rose-400 font-bold hover:underline"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

          <Link
            href="/nearby"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 text-white font-bold"
          >
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>{t('findNearby')} (GPS Search)</span>
          </Link>

          <Link
            href="/ai-diagnostic"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 font-extrabold shadow"
          >
            <Bot className="w-5 h-5 text-blue-400" />
            <span>AI Truck Diagnostic (AI फाल्ट चेकर)</span>
          </Link>

          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-orange-600 text-white font-extrabold shadow"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('joinPlatform')}</span>
          </Link>

          {!user && (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 text-white font-semibold"
            >
              <UserCheck className="w-5 h-5 text-sky-400" />
              <span>{t('driverLogin')} / Garage Login</span>
            </Link>
          )}

          <Link
            href="/garage-dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/80 text-slate-200 text-sm font-semibold"
          >
            <Wrench className="w-4 h-4 text-orange-400" />
            <span>Garage Dashboard</span>
          </Link>

          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/80 text-slate-200 text-sm font-semibold"
          >
            <span>Truck Services Catalog</span>
          </Link>

          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 text-slate-400 text-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>National Admin Control Room</span>
          </Link>
        </div>
      )}
    </header>
  );
}
