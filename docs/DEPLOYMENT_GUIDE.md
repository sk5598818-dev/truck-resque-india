# TRUCK RESCUE INDIA — PRODUCTION DEPLOYMENT & INFRASTRUCTURE GUIDE

This guide provides end-to-end instructions for launching **TRUCK RESCUE INDIA** into production, configuring the custom domain (`truckrescueindia.in`), deploying Firebase services, and managing multi-target hosting.

---

## 1. Domain Configuration (`truckrescueindia.in`)

To connect your custom domain to **TRUCK RESCUE INDIA**, update your DNS records at your domain registrar (GoDaddy, Namecheap, Hostinger, Google Domains, etc.):

### Option A: Vercel Production Deployment (Recommended for Next.js SSR)
1. Add domain `truckrescueindia.in` in **Vercel Project Settings > Domains**.
2. Configure DNS records:
   | Type | Host / Name | Target / Value | TTL |
   |------|-------------|----------------|-----|
   | **A** | `@` (root) | `76.76.21.21` | Auto / 3600 |
   | **CNAME** | `www` | `cname.vercel-dns.com.` | Auto / 3600 |

### Option B: Firebase Hosting Deployment
1. Add domain in **Firebase Console > Hosting > Custom Domain**.
2. Add verification TXT records and the two Firebase A records:
   | Type | Host / Name | Target / Value |
   |------|-------------|----------------|
   | **A** | `@` | `199.36.158.100` |
   | **A** | `@` | `199.36.158.100` |
   | **CNAME** | `www` | `truckrescueindia.in` |

### SSL & HTTP/2
- SSL certificates are automatically provisioned via Let's Encrypt or Google Trust Services within 15–30 minutes after DNS propagation.
- HTTPS redirection is enforced automatically (HSTS enabled).

---

## 2. Environment Variables Checklist (`.env.local`)

Ensure all required production environment variables are configured before running builds:

```env
# ========================================================
# 1. CORE APPLICATION CONFIG
# ========================================================
NEXT_PUBLIC_APP_URL=https://truckrescueindia.in
NODE_ENV=production

# ========================================================
# 2. FIREBASE PUBLIC CLIENT SDK
# ========================================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=truck-rescue-india.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=truck-rescue-india
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=truck-rescue-india.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ========================================================
# 3. FIREBASE ADMIN SDK (SERVER-SIDE ONLY)
# ========================================================
FIREBASE_PROJECT_ID=truck-rescue-india
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@truck-rescue-india.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...-----END PRIVATE KEY-----\n"

# ========================================================
# 4. PAYMENT GATEWAY (RAZORPAY)
# ========================================================
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_production_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_signature_secret

# ========================================================
# 5. AI DIAGNOSTIC ENGINE (SERVER-SIDE ONLY)
# ========================================================
GEMINI_API_KEY=AIzaSy...
# Or OPENAI_API_KEY=sk-...

# ========================================================
# 6. MAPS & GEOCODING
# ========================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## 3. Firebase Security Rules Deployment

Deploy your hardened Firestore and Storage security rules:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Google Cloud / Firebase
firebase login

# Set active project
firebase use truck-rescue-india

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

---

## 4. Automated Build & Deploy via CLI

Use the included production deployment script:

```bash
# Windows
deploy_production.bat

# Or run manual production build
npm run build
```

---

## 5. Mobile PWA Installation Verification

1. Open `https://truckrescueindia.in` in Google Chrome on an Android device.
2. The custom **"Install Truck Rescue App"** bottom bar will appear automatically.
3. Tap **Install** to add the native-like standalone app to the Android home screen and app launcher.
4. When disconnected in poor highway cell coverage, the PWA service worker (`public/sw.js`) serves `public/offline.html`, keeping emergency calling numbers (`1800-889-988`, `1033`) accessible at zero data.
