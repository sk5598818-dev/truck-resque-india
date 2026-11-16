import { NextRequest, NextResponse } from 'next/server';
import { queryHeavyTruckFaultCode, FaultCodeDetail } from '@/lib/heavyTruckDiagnosticDatabase';

// Rate Limiting Map: IP -> { count, expiresAt }
const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);
  if (!record || now > record.resetTime) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }
  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'localhost';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many diagnostic requests. Please wait a minute before querying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    let messages = body.messages || [];
    const vehicleInfo = body.vehicleInfo || {};
    const faultCodeInput = body.faultCodeInput || body.faultCode || '';
    const language = body.language || 'en';

    // Support direct queries from Flutter mobile or third-party callers
    if ((!Array.isArray(messages) || messages.length === 0) && (body.query || body.faultCode)) {
      messages = [{ role: 'user', content: body.query || body.faultCode }];
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: messages array or query string is required.' },
        { status: 400 }
      );
    }

    const latestMessage = messages[messages.length - 1];
    const userQuery = `${faultCodeInput} ${latestMessage?.content || ''}`.trim();
    const uploadedImage = latestMessage?.image || null;

    const brand = body.brand || vehicleInfo.brand || 'Tata Motors';
    const model = body.model || vehicleInfo.model || 'Heavy Commercial Vehicle';
    const emission = body.fuelType || vehicleInfo.emission || 'BS6';

    // 1. Check local comprehensive Indian Heavy Vehicle Diagnostic Knowledge Base
    const matchedFault = queryHeavyTruckFaultCode(userQuery, brand);

    // 2. Check if server-side Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    // If Gemini key is available, execute multimodal / deep AI query
    if (geminiApiKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

        const promptText = `
You are the AI Heavy Commercial Vehicle Diagnostic Assistant for TRUCK RESCUE INDIA, an expert system used by Indian truck drivers, fleet operators, and heavy vehicle mechanics.

VEHICLE UNDER DIAGNOSIS:
- Brand: ${brand}
- Model: ${model}
- Emission / Fuel: ${emission}
- ECU/Engine: ${vehicleInfo.ecuType || vehicleInfo.engine || 'Standard Commercial Common Rail / AdBlue SCR System'}

USER QUERY & SYMPTOMS:
"${userQuery}"

DIAGNOSTIC GUIDELINES:
1. Explain probable technical meaning of any fault codes (SPN, FMI, P-codes, or symptoms).
2. Detail root causes based on Indian road conditions, highway vibration, temperature, and fuel/AdBlue quality.
3. Provide a safe roadside inspection checklist for drivers and mechanics.
4. Provide wiring, pinout, 24V supply, ground, and CAN-bus (60 ohms) inspection guidance where appropriate.
5. Provide sensor testing instructions using a digital multimeter.
6. Provide diagnostic sequence (what to test first before spending money on expensive replacements).
7. Indicate uncertainty and confidence level appropriately. Do NOT invent proprietary manufacturer definitions.
8. SAFETY: Warn before electrical, fuel, or engine work. NEVER advise bypassing emission or safety systems.
9. Language preference: ${language === 'hi' ? 'Hindi (हिंदी)' : language === 'hinglish' ? 'Roman Hindi / Hinglish' : 'English with clear Indian truck industry terminology'}.
`;

        const parts: any[] = [{ text: promptText }];

        // Multimodal image support if image attached
        if (uploadedImage && uploadedImage.includes('base64,')) {
          const mimeMatch = uploadedImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const base64Data = uploadedImage.split('base64,')[1];
          parts.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          });
        }

        const aiResponse = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1500
            }
          })
        });

        if (aiResponse.ok) {
          const aiJson = await aiResponse.json();
          const replyText = aiJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              success: true,
              reply: replyText,
              diagnosticData: matchedFault,
              recommendedCategory: matchedFault?.recommendedCategory || 'scanner_diagnostic',
              source: 'gemini_ai'
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to heavy commercial diagnostic engine:', geminiErr);
      }
    }

    // 3. Fallback: Commercial Truck Diagnostic Expert Engine
    let replyText = '';
    const isHindi = language === 'hi';
    const isHinglish = language === 'hinglish';

    if (matchedFault) {
      if (isHindi) {
        replyText = `### 🚨 डायग्नोस्टिक विश्लेषण: ${matchedFault.code}
**सिस्टम:** ${matchedFault.system}  
**समस्या:** ${matchedFault.hindiTitle}

**संक्षिप्त विवरण:**  
${matchedFault.hindiSummary}

---

### 🔍 संभावित मुख्य कारण (Root Causes):
${matchedFault.hindiCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

### 🛠️ सुरक्षित निरीक्षण चेकलिस्ट (Safe Step-by-Step Checklist):
${matchedFault.safeChecklist.map(s => `**चरण ${s.step}: ${s.hindiTitle}**  
${s.hindiAction}${s.safetyWarning ? `\n> ⚠️ **सुरक्षा चेतावनी:** ${s.safetyWarning}` : ''}`).join('\n\n')}

---

### ⚡ वायरिंग व मल्टीमीटर जांच मार्गदर्शन:
- **पिनआउट वोल्टेज:** ${matchedFault.wiringGuidance.voltageCheck}
- **रेजिस्टेंस चेक:** ${matchedFault.wiringGuidance.resistanceCheck}
- **CAN-बस सिग्नल:** ${matchedFault.wiringGuidance.canBusGuidance}

---

### 💡 संभावित समाधान व रिपेयर विकल्प:
${matchedFault.possibleRepairs.map((r, i) => `• ${r}`).join('\n')}

> ⚠️ **सुरक्षा व वैधानिक सूचना:** ${matchedFault.safetyNotice}  
> *यदि यह समस्या स्वयं हल नहीं होती है, तो नीचे दिए गए नजदीकी स्कैनर व ECM एक्सपर्ट से तुरंत संपर्क करें।*`;
      } else if (isHinglish) {
        replyText = `### 🚨 Heavy Truck Diagnostic Report: ${matchedFault.code}
**System:** ${matchedFault.system}  
**Title:** ${matchedFault.title} (${matchedFault.hindiTitle})

**Problem Summary:**  
${matchedFault.summary}  
*${matchedFault.hindiSummary}*

---

### 🔍 Root Causes (Mukhya Kaaran):
${matchedFault.commonCauses.map((c, i) => `${i + 1}. ${c} (*${matchedFault.hindiCauses[i] || ''}*)`).join('\n')}

---

### 🛠️ Safe Roadside Inspection Checklist:
${matchedFault.safeChecklist.map(s => `**Step ${s.step}: ${s.title} (${s.hindiTitle})**  
${s.action}  
*${s.hindiAction}*${s.safetyWarning ? `\n> ⚠️ **Safety Alert:** ${s.safetyWarning}` : ''}`).join('\n\n')}

---

### ⚡ Wiring & Multimeter Testing:
- **Pinout Voltage:** ${matchedFault.wiringGuidance.voltageCheck}
- **Resistance (Ohms):** ${matchedFault.wiringGuidance.resistanceCheck}
- **CAN-Bus Network:** ${matchedFault.wiringGuidance.canBusGuidance}

---

### 💡 Repair Options:
${matchedFault.possibleRepairs.map((r, i) => `• ${r}`).join('\n')}

> ⚠️ **Important Safety Notice:** ${matchedFault.safetyNotice}`;
      } else {
        replyText = `### 🚨 Commercial Vehicle Diagnostic Report: ${matchedFault.code}
**System:** ${matchedFault.system}  
**Definition:** ${matchedFault.title}

**Technical Summary:**  
${matchedFault.summary}

---

### 🔍 Probable Root Causes:
${matchedFault.commonCauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

### 🛠️ Safe Diagnostic Sequence & Inspection Checklist:
${matchedFault.safeChecklist.map(s => `**Step ${s.step}: ${s.title}**  
${s.action}${s.safetyWarning ? `\n> ⚠️ **Safety Warning:** ${s.safetyWarning}` : ''}`).join('\n\n')}

---

### ⚡ Wiring Harness & Sensor Testing Guidance:
- **Pinout Supply:** ${matchedFault.wiringGuidance.pinoutCheck}
- **Voltage Checks:** ${matchedFault.wiringGuidance.voltageCheck}
- **Resistance Checks:** ${matchedFault.wiringGuidance.resistanceCheck}
- **J1939 CAN-Bus:** ${matchedFault.wiringGuidance.canBusGuidance}

---

### 💡 Repair & Rectification Procedures:
${matchedFault.possibleRepairs.map((r, i) => `• ${r}`).join('\n')}

> ⚠️ **Safety & Regulatory Compliance:** ${matchedFault.safetyNotice}`;
      }
    } else {
      // General Heavy Truck Diagnostic Guidance
      replyText = `### 🚛 Heavy Commercial Vehicle Diagnostic Assistant
**Vehicle:** ${brand} ${model} (${emission})  
**Input Analyzed:** "${userQuery}"

**Initial Assessment:**  
The reported code or symptom requires live verification with an appropriate commercial heavy vehicle diagnostic scanner (Cummins INSITE, Ashok Leyland Al-Diag, Tata INSITE/e-Diagnostic, or Launch X431 HD).

**Recommended Safe Roadside Diagnostic Sequence:**
1. **Safety First**: Park the truck safely in a designated emergency bay on the highway shoulder. Deploy reflective warning triangles 50 meters behind the vehicle.
2. **Visual Electrical Check**: Inspect main 24V battery terminal clamps for tightness and white corrosion. Ensure battery voltage is above 24.2V (or > 12.4V per 12V block).
3. **Fluid Checks**: Verify engine oil dipstick level, coolant reservoir level in expansion tank, and AdBlue urea level.
4. **Air System Check**: Verify dual-needle air brake pressure gauges read between 8.5 bar and 10.0 bar before attempting vehicle movement.
5. **CAN-Bus Communication**: If multiple warning lamps (Check Engine, Stop Engine, ABS, SCR) are flashing together, inspect the twisted-pair CAN communication wiring harness near the cabin tilt hinge.

> ⚠️ **Note on Proprietary Fault Codes**: Manufacturer-specific sub-codes must not be guessed without scanner verification. We recommend connecting with a nearby verified scanner specialist below to pull live ECU freeze-frame data.`;
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      response: replyText,
      diagnosticData: matchedFault,
      recommendedCategory: matchedFault?.recommendedCategory || 'scanner_diagnostic',
      source: 'heavy_truck_diagnostic_engine'
    });
  } catch (error: any) {
    console.error('Diagnostic API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal diagnostic processing failure' },
      { status: 500 }
    );
  }
}
