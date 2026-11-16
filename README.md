# 🚛 TRUCK RESCUE INDIA (ट्रक रेस्क्यू इंडिया)
### 24x7 Heavy Commercial Vehicle Highway Breakdown & Garage Discovery Network

**TRUCK RESCUE INDIA** is a full-stack, production-ready digital platform built to connect Indian heavy commercial vehicle (HCV/MCV) drivers, fleet owners, and transport operators with verified nearby truck mechanics, electricians, scanner specialists, ECM/ECU experts, tyre shops, hydraulic crane operators, and spare parts dealers across all National Highway corridors (NH44, NH48, NH19, NH27, etc.).

---

## ⚡ Key Highlights & Capabilities

- **Zero-Friction Driver Experience**: Drivers stranded on dark highways do NOT have to fill long complex registration forms. With 1-click GPS detection, nearest verified mechanics appear within seconds.
- **Direct Calling & WhatsApp**: Big high-contrast touch targets for direct calling (`tel:+91...`) and pre-filled WhatsApp communication with live location sharing.
- **Turn-by-Turn Navigation**: One-click Google Maps driving directions to the workshop or mechanic's bay.
- **7-Step Registration Wizard**: Comprehensive onboarding for garage owners covering Owner KYC, Workshop Type, Highway Address & GPS Pin, Services Offered, Diagnostic Equipment (Cummins Inline, INSITE, samDiaX, RP1210, J2534), Availability (24x7, Mobile Rescue Van, Service Radius in km), and Pricing.
- **Real-Time Garage Owner Dashboard**: Garage owners can toggle live Open/Closed status, toggle 24/7 emergency service, toggle mobile van availability, and edit contact/location details.
- **National Operations Admin Panel**: Secure portal for operations officers to review pending garage registrations, inspect workshop photos and tools, verify/approve, reject, or suspend listings with 1 click.
- **High-Accuracy Geospatial Engine**: Pure TypeScript Haversine distance calculator and Geohash encoder/bounding-box filter.
- **Bilingual Interface**: High-contrast UI supporting English, Hindi (हिन्दी), and Hinglish (trucker-friendly terminology).
- **Progressive Web App (PWA)**: Installable directly on Android smartphones with custom web manifest, branded truck icons, and offline caching.
- **Enterprise Firebase Architecture**: Ready for Firebase Phone Authentication (OTP), Cloud Firestore, Firebase Storage, and App Check.

---

## 🏗️ Technology Architecture

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router) + React 18 |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS (Heavy vehicle navy & safety orange theme) |
| **Icons** | Lucide React |
| **Database** | Google Cloud Firestore (NoSQL) |
| **Authentication** | Firebase Phone Authentication (SMS OTP + RecaptchaVerifier) |
| **File Storage** | Firebase Cloud Storage (Workshop & equipment photos) |
| **Geospatial** | Haversine Formula + Geohashes + OpenStreetMap Reverse Geocoding + Google Maps Directions |
| **Admin Controls** | Firebase Admin SDK + Cryptographic Admin Key verification |
| **PWA** | Web App Manifest + Android Install Prompt Banner + Service Worker |

---

## 📁 Project Structure

```
truck-rescue-india/
├── public/
│   ├── manifest.json              # PWA Web App Manifest
│   ├── robots.txt                 # Search Engine Crawling Directives
│   ├── sitemap.xml                # SEO Dynamic Sitemap
│   └── icons/
│       ├── icon-192.png           # Android PWA Home Icon
│       ├── icon-512.png           # Android Splash Screen Icon
│       └── logo.svg               # Vector Brand Emblem
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root Layout with Language Provider & Navbar
│   │   ├── page.tsx               # Public Homepage with 1-Click GPS & Corridor Links
│   │   ├── globals.css            # Tailwind Directives & High-Contrast Highway Dark Theme
│   │   ├── nearby/
│   │   │   └── page.tsx           # Nearby Search Engine (Distance Sorting, Filters, GPS Lock)
│   │   ├── register/
│   │   │   └── page.tsx           # 7-Step Garage & Technician Registration Wizard
│   │   ├── login/
│   │   │   └── page.tsx           # Driver & Garage Owner Mobile OTP Login
│   │   ├── garage/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # SEO Public Profile (Call, WhatsApp, Maps, Reviews, Schema.org)
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Garage Owner Live Dashboard (Toggle Open/24x7, Edit Profile)
│   │   ├── admin/
│   │   │   └── page.tsx           # National Admin Control Room (Stats, Verify, Reject, Suspend)
│   │   ├── services/
│   │   │   ├── page.tsx           # Truck Services Catalog Directory
│   │   │   └── [slug]/
│   │   │       └── page.tsx       # SEO Category Landing Page (e.g. /services/truck_electrician)
│   │   ├── locations/
│   │   │   └── [state]/
│   │   │       └── [city]/
│   │   │           └── page.tsx   # Regional Highway SEO Page (e.g. /locations/maharashtra/bhiwandi)
│   │   └── api/
│   │       ├── garages/           # REST Endpoints for nearby search & registration
│   │       ├── admin/             # Verification actions & aggregated metrics
│   │       ├── reviews/           # Customer rating & feedback API
│   │       └── seed/              # 1-Click Firestore initial seeding endpoint
│   ├── components/
│   │   ├── Navbar.tsx             # Top Emergency Hotline Strip + Brand Navigation
│   │   ├── Footer.tsx             # NHAI 1033 Hotline + National Corridors + SEO links
│   │   ├── GarageCard.tsx         # Big Call, WhatsApp, Maps touch targets + Verified badge
│   │   ├── LocationPicker.tsx     # 1-Click GPS Location Lock + Coordinate Picker
│   │   ├── OtpAuthModal.tsx       # Indian Mobile OTP Dialog with Timer & Test Mode
│   │   ├── LanguageContext.tsx    # English / Hindi / Hinglish translation context
│   │   └── PWAInstallBanner.tsx   # Native Android Install Prompt Banner
│   └── lib/
│       ├── types.ts               # Strict TypeScript definitions for Garages, Reviews, Stats
│       ├── constants.ts           # Categories, Truck Brands, Scanners, States, Highways
│       ├── geo.ts                # Haversine distance calculator & Geohash encoder
│       ├── firebase.ts            # Client SDK with graceful offline/dev fallback
│       ├── firebaseAdmin.ts       # Server-Side Firebase Admin SDK
│       ├── garageService.ts       # Database abstraction layer (Firestore + Local Fallback)
│       └── mockGarages.ts         # Authentic seed dataset across Indian highway transport hubs
├── firestore.rules                # Production security rules for Cloud Firestore
├── storage.rules                  # Production security rules for Firebase Storage
├── firestore.indexes.json         # Query optimization indexes
├── firebase.json                  # Firebase Hosting & Emulator configuration
├── tailwind.config.ts             # Custom truck brand color palette
└── package.json                   # Dependencies and scripts
```

---

## 📱 Flutter Android Application Sharing Firebase Backend

The web platform and the Flutter mobile application share the exact same Firebase backend:

1. **Authentication (`Firebase Auth`)**:
   - Both Web and Flutter share the same Firebase project.
   - Flutter uses `firebase_auth` plugin: `FirebaseAuth.instance.verifyPhoneNumber(...)`.
   - The user UID returned by phone authentication corresponds to the same `uid` in the Firestore database.

2. **Cloud Firestore Schema (`mechanic_garages`)**:
   - Both applications read from and write to the same `mechanic_garages` collection using the identical schema defined in `src/lib/types.ts`.
   - Flutter uses `cloud_firestore` with geohash range queries or Haversine filtering:
     ```dart
     FirebaseFirestore.instance
         .collection('mechanic_garages')
         .where('verificationStatus', isEqualTo: 'verified')
         .snapshots();
     ```

3. **Storage (`Firebase Storage`)**:
   - Garage photos uploaded in the Flutter app to `/garages/{garageId}/photo.jpg` are instantly visible on the Web profile and vice versa.

---

## 🚀 Running Locally

1. **Navigate to the project directory**:
   ```bash
   cd "C:\Users\sapat\.gemini\antigravity\scratch\truck-rescue-india"
   ```

2. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🔒 Environment Configuration

Configure your `.env.local` with real Firebase credentials when connecting your live project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyYourActualApiKeyHere"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="truck-rescue-india.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="truck-rescue-india"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="truck-rescue-india.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:yourAppId"

# Admin Secret Key for Operations Portal
ADMIN_SECRET_KEY="TRUCK_RESCUE_ADMIN_2026_SECURE"
```

*Note: The platform includes a complete development fallback mode with realistic Indian highway garages, distance calculations, and mock OTP (code: `123456`), so it works out-of-the-box even before adding Firebase keys.*

---

## 🌐 Public Deployment Guide

### Option 1: Vercel (Recommended for Next.js SSR + API routes)
1. Push the code to GitHub / GitLab.
2. Import the repository into Vercel (`vercel.com`).
3. Add the environment variables from `.env.example`.
4. Deploy! Vercel handles automated SSL, custom domains, and edge routing.

### Option 2: Firebase Hosting + Cloud Functions
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize project: `firebase init`
4. Deploy rules, Cloud Functions, and app:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules,functions,hosting
   ```

### Connecting Custom Domain (e.g. `truckrescueindia.in`)
1. In Firebase Console or Vercel, go to **Domains** -> **Add Custom Domain**.
2. Enter `truckrescueindia.in` and `www.truckrescueindia.in`.
3. Add the provided DNS `A` records and `CNAME` records at your domain registrar (GoDaddy, Hostinger, Namecheap).
4. In Firebase Authentication -> **Settings** -> **Authorized domains**, add `truckrescueindia.in`.

---

## 🚨 Phase 3: Emergency Roadside Assistance & Live Tracking

### Architecture Overview
1. **Emergency SOS Broadcast**:
   - Drivers trigger the pulsating **EMERGENCY TRUCK HELP** button from the homepage or `/nearby`.
   - Driver enters vehicle registration (e.g. `RJ 14 GB 1234`), truck brand, model, BS4/BS6 fuel type, selects from 17 specific heavy commercial vehicle breakdown categories, and provides GPS coordinates or highway milestone location.
   - Up to 5 photos of error codes / damaged parts can be attached.
2. **Matching Engine & Firebase Cloud Functions**:
   - Stored in Firestore collection `emergency_requests`.
   - Cloud Function `onEmergencyCreated` queries verified active garages within 50-100 km radius.
   - Sends high-priority Firebase Cloud Messaging (FCM) multicast alerts to mechanic Android devices with custom emergency sirens and heads-up notifications.
3. **Atomic Mechanic Claim**:
   - Prevents duplicate claims across mechanics using Firestore transactions and `/api/emergency/[id]/accept`.
   - The first mechanic to accept locks the incident and is immediately granted driver direct calling (`tel:`), WhatsApp (`wa.me`), and turn-by-turn navigation to the highway coordinates.
4. **Real-Time Driver Tracking (`/emergency/[requestId]`)**:
   - Drivers track their rescue live across 6 status milestones: `Searching Mechanics` -> `Mechanic Assigned` -> `On The Way` -> `Reached Location` -> `Repair Underway` -> `Assistance Done`.
   - Real-time Firestore `onSnapshot` listener with polling fallback.
   - Integrated driver cancellation and toll-free helpline support.
5. **Admin Operations Control Room (`/admin`)**:
   - Live monitor for all national SOS incidents with status filters, force cancellation, re-dispatching, and incident auditing.

