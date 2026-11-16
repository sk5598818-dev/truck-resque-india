# GOOGLE PLAY STORE PUBLISHING PACKAGE & GUIDE
## Application: TRUCK RESCUE INDIA
**Package Name:** `com.truckrescue.india`

---

## 1. Store Listing Metadata

### App Title (Max 30 characters)
`Truck Rescue India - Roadside`

### Short Description (Max 80 characters)
`24x7 Heavy Truck Breakdown, GPS Mechanic Radar, AI BS6 Diagnostics & Towing.`

### Full Description (English)
```
TRUCK RESCUE INDIA connects heavy commercial vehicle (HCV) drivers, fleet operators, and transport owners with verified highway mechanics, 24x7 electricians, diagnostic laptop scanner experts, ECM/ECU repairers, and hydraulic crane towing across all Indian National Highways.

STRANDED ON THE HIGHWAY? GET 1-TAP EMERGENCY SOS:
Whether facing an engine breakdown, BS6 AdBlue / SCR error, NOx sensor limp mode, starter motor failure, air brake pressure drop, or a tyre puncture on the Golden Quadrilateral or Expressways, TRUCK RESCUE INDIA dispatches the nearest mobile roadside van straight to your GPS coordinates.

KEY FEATURES FOR COMMERCIAL TRUCK DRIVERS:
• Instant GPS Radar: Locate verified truck mechanics and tyre shops within 5 km to 100 km.
• Emergency SOS Dispatch: 1-tap roadside help with live status tracking from dispatch to arrival.
• AI Truck Diagnostic Assistant (Hindi & English): Instant explanations for SPN, FMI, and OBD-II fault codes, DPF soot regeneration advice, and sensor pinout checks.
• Direct Verified Calling & WhatsApp: Talk directly with garage owners with zero hidden brokerage.
• Verified Driver Reviews: Transparent ratings from real commercial transport operators.
• 24x7 Central Helpline: Toll-free connectivity to central operations (1800-889-988) and NHAI (1033).

SUPPORTED BRANDS:
Tata Motors (Prima, Signa, LPT), Ashok Leyland (AVTR, Ecomet, Captain), BharatBenz, Eicher Motors, Mahindra Truck & Bus (Blazo, Furio), Volvo Commercial, Scania, and MAN Trucks.

FOR GARAGE OWNERS & MECHANICS:
• 100% Free Lifetime Registration.
• Live Highway Radar alerts for nearby breakdowns.
• Boost your workshop visibility to thousands of passing interstate transport drivers.
```

### Full Description (Hindi — हिंदी)
```
ट्रक रेस्क्यू इंडिया (TRUCK RESCUE INDIA) भारतीय राष्ट्रीय राजमार्गों पर चलने वाले भारी कमर्शियल ट्रक ड्राइवरों, ट्रांसपोर्ट ऑपरेटरों और फ्लीट मालिकों को नजदीकी वेरीफाइड ट्रक मैकेनिक, इलेक्ट्रीशियन, लैपटॉप स्कैनर एक्सपर्ट, ECM/ECU रिपेयरर और हाइड्रोलिक क्रेन टोइंग सर्विस से जोड़ता है।

हाईवे पर गाड़ी खराब होने पर तुरंत 1-टैप इमरजेंसी मदद:
इंजन खराब होना, स्टार्ट न होना, BS6 यूरिया (AdBlue) / SCR फाल्ट, NOx सेंसर, सेल्फ स्टार्टर, कमानी टूटना, एयर ब्रेक प्रेशर फेल या टायर पंचर जैसी किसी भी समस्या में अपने मोबाइल जीपीएस से नजदीकी मैकेनिक वैन तुरंत बुलाएं।

मुख्य विशेषताएं:
• जीपीएस रडार खोज: 5 से 100 किमी के दायरे में वेरीफाइड 24 घंटे खुले गैराज खोजें।
• 1-टैप इमरजेंसी SOS: सीधे अपने जीपीएस लोकेशन पर सहायता प्राप्त करें और लाइव स्टेटस ट्रैक करें।
• AI भारी वाहन डायग्नोस्टिक (हिंदी व अंग्रेजी): SPN / FMI कोड, DPF रीजनरेशन और सेंसर चेकलिस्ट का तुरंत समाधान पाएं।
• सीधी कॉल और व्हाट्सएप: बिना किसी दलाली के सीधे गैराज मालिक से बात करें।
• राष्ट्रीय हेल्पलाइन: 1800-889-988 और NHAI 1033 पर 24 घंटे सहायता।

गैराज मालिकों के लिए:
• 100% फ्री लाइफटाइम रजिस्ट्रेशन।
• पास में फंसे ट्रकों के लाइव रडार अलर्ट पाएं और अपनी आमदनी बढ़ाएं।
```

---

## 2. Google Play Data Safety Questionnaire

| Data Type | Collected / Shared | Purpose | Required or Optional |
|-----------|--------------------|---------|----------------------|
| **Precise Location** | Collected | App functionality (Dispatching roadside assistance to stranded vehicle) | Required for Nearby & SOS |
| **Phone Number** | Collected | Account management (Firebase Phone OTP Authentication) & Mechanic Contact | Required for Drivers & Garages |
| **Photos / Videos** | Optional | Uploading photos of truck breakdown, damage, or instrument cluster error | Optional |
| **Device or other IDs** | Collected | Push notifications via Firebase Cloud Messaging (FCM) | Required for Radar Alerts |

*Security Practices:*
- Data is encrypted in transit over HTTPS (TLS 1.3).
- Users can request deletion of their account and data by emailing privacy@truckrescueindia.in.

---

## 3. Release Keystore Generation & Signing

### Step 1: Generate Release Keystore
Run in terminal (keep this file secure and backed up):
```bash
keytool -genkey -v -keystore truckrescue-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias truckrescue -storetype JKS
```

### Step 2: Configure `android/key.properties`
Create `flutter_app/android/key.properties`:
```properties
storePassword=YourKeystorePassword
keyPassword=YourKeyPassword
keyAlias=truckrescue
storeFile=/absolute/path/to/truckrescue-release.jks
```

### Step 3: Build Production Android App Bundle (.aab)
```bash
cd flutter_app
flutter build appbundle --release
```
The output file will be at:
`flutter_app/build/app/outputs/bundle/release/app-release.aab`
Upload this bundle to the **Google Play Console > Production track**.
