import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';
import { AuthProvider } from '@/components/AuthContext';
import PWAInstallBanner from '@/components/PWAInstallBanner';

export const metadata: Metadata = {
  title: 'TRUCK RESCUE INDIA | 24x7 Heavy Commercial Vehicle Highway Breakdown Network',
  description: 'Instant nearby truck mechanic, truck electrician, laptop scanner diagnostics, ECM/ECU flashing, tyre repair, and 50-ton hydraulic towing assistance across all Indian National Highways.',
  keywords: [
    'truck rescue india',
    'truck mechanic near me',
    'truck electrician highway',
    'ecm repair india',
    'bs6 urea adblue repair',
    'tata truck mechanic',
    'leyland scanner diagnostic',
    'bharatbenz roadside assistance',
    'truck towing 24x7 india',
    'highway emergency 1033'
  ],
  authors: [{ name: 'TRUCK RESCUE INDIA' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'TRUCK RESCUE INDIA | Highway Breakdown & Garage Network',
    description: 'Find verified heavy vehicle mechanics, electricians, scanner specialists, and towing services across India.',
    url: 'https://truckrescueindia.in',
    siteName: 'TRUCK RESCUE INDIA',
    locale: 'en_IN',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <PWAInstallBanner />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
