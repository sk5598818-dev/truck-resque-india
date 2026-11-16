/**
 * Comprehensive Indian Heavy Commercial Vehicle Diagnostic Knowledge Base
 * Covers Tata Motors, Ashok Leyland, BharatBenz, Eicher Motors, Mahindra Truck & Bus, Volvo, and Scania.
 * Supports P-codes, J1939 SPN/FMI, and MID/PID/SID fault codes.
 */

export interface InspectionStep {
  step: number;
  title?: string;
  hindiTitle?: string;
  action: string;
  hindiAction: string;
  safetyWarning?: string;
}

export interface FaultCodeDetail {
  code: string; // e.g. "SPN 3226 FMI 9" or "P20EE"
  standard: 'J1939' | 'OBD2' | 'J1587' | 'OEM';
  system: string;
  title: string;
  hindiTitle: string;
  summary: string;
  hindiSummary: string;
  commonCauses: string[];
  hindiCauses: string[];
  safeChecklist: InspectionStep[];
  wiringGuidance: {
    pinoutCheck: string;
    resistanceCheck: string;
    voltageCheck: string;
    canBusGuidance: string;
  };
  possibleRepairs: string[];
  confidence: 'high' | 'medium' | 'requires_scanner';
  recommendedCategory: string; // e.g. 'bs4_bs6_expert', 'truck_electrician', 'ecm_ecu_repair'
  safetyNotice: string;
}

export const HEAVY_TRUCK_FAULT_CODES: FaultCodeDetail[] = [
  {
    code: 'SPN 3226 FMI 9',
    standard: 'J1939',
    system: 'Aftertreatment SCR / NOx Emission System',
    title: 'Aftertreatment 1 Outlet NOx Sensor Abnormal Update Rate / Communication Timeout',
    hindiTitle: 'साइलेंसर आउटलेट NOx सेंसर संचार त्रुटि / टाइमआउट (AdBlue सिस्टम)',
    summary: 'The Engine Control Module (ECM) has stopped receiving valid CAN-bus telemetry from the downstream SCR Outlet NOx sensor for more than 5.0 seconds.',
    hindiSummary: 'इंजन ECM को साइलेंसर के पिछले हिस्से में लगे NOx सेंसर से CAN बस सिग्नल नहीं मिल रहा है। यह 50 किमी बाद 20 किमी/घंटा लिम्प मोड (पावर कट) कर देगा।',
    commonCauses: [
      'NOx sensor wiring harness melted or chafed against hot exhaust silencer pipe',
      'Blown 24V fuse powering the smart NOx sensor module in chassis fuse box',
      'Corrosion or water ingress in the 4-pin/5-pin weather-pack connector',
      'Internal sensor element failure or ceramic heater circuit burned out',
      'J1939 CAN backbone termination resistor open or high resistance'
    ],
    hindiCauses: [
      'NOx सेंसर का तार साइलेंसर के गर्म पाइप से छूकर जल गया है',
      'चेसिस फ्यूज बॉक्स में 24V NOx सेंसर का फ्यूज उड़ गया है',
      'सेंसर के 4-पिन कनेक्टर में पानी या कीचड़ से जंग लग गई है',
      'सेंसर की आंतरिक सिरेमिक प्लेट या हीटर सर्किट खराब हो गया है',
      'CAN वायर (पीला व हरा तार) कहीं से कट गया है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Safety Wait & Battery Isolation',
        hindiTitle: 'इग्निशन बंद करें और ठंडा होने दें',
        action: 'Turn ignition OFF. Wait at least 2 minutes for the AdBlue dosing pump to purge and exhaust pipes to cool down.',
        hindiAction: 'इग्निशन चाबी बंद करें। कम से कम 2 मिनट इंतजार करें ताकि यूरिया डोजर पाइप की सफाई पूरी हो जाए और साइलेंसर ठंडा हो जाए।',
        safetyWarning: 'Exhaust silencer operates above 350°C. Never touch exhaust pipes with bare hands.'
      },
      {
        step: 2,
        title: 'Check 24V Power Supply Fuse',
        hindiTitle: '24V सप्लाई फ्यूज चेक करें',
        action: 'Locate the Aftertreatment / NOx sensor fuse (usually 10A or 15A) in the main battery box or chassis electrical panel. Verify filament continuity with multimeter.',
        hindiAction: 'बैटरी बॉक्स या चेसिस इलेक्ट्रिकल पैनल में NOx सेंसर का 10A/15A फ्यूज निकाल कर मल्टीमीटर से चेक करें।'
      },
      {
        step: 3,
        title: 'Inspect Harness & Moisture',
        hindiTitle: 'वायरिंग हार्नेस और कनेक्टर की जांच करें',
        action: 'Inspect the harness from sensor module to main chassis loom. Disconnect the 4-pin/5-pin plug and check for green oxidation, backed-out pins, or moisture.',
        hindiAction: 'सेंसर के 4-पिन प्लग को खोलें। पिनों पर जंग या पानी देखें। तारों पर कोई कट या घिसाव न हो।'
      },
      {
        step: 4,
        title: 'Multimeter Pinout Voltage Test',
        hindiTitle: 'मल्टीमीटर से वोल्टेज नापें',
        action: 'With Key ON (Engine OFF), test pin 1 for 24V battery supply and pin 2 for solid ground (< 0.2 ohms resistance to chassis).',
        hindiAction: 'चाबी ON करें (इंजन बंद)। पिन 1 पर 24V बैटरी वोल्टेज और पिन 2 पर ग्राउंड (< 0.2 ओम) नापें।'
      },
      {
        step: 5,
        title: 'CAN-Bus Resistance Integrity Test',
        hindiTitle: 'CAN बस 60 ओम रेजिस्टेंस टेस्ट',
        action: 'Turn Key OFF. Measure resistance across CAN High (Yellow) and CAN Low (Green) pins. Reading must be approximately 60 ohms (two 120-ohm terminating resistors in parallel).',
        hindiAction: 'चाबी बंद करें। CAN High और CAN Low तारों के बीच रेजिस्टेंस 60 ओम आनी चाहिए। 120 ओम आने पर टर्मिनेटर खुला है।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'Pin 1: +24V Battery Feed; Pin 2: Power Ground; Pin 3: CAN High (Yellow/White); Pin 4: CAN Low (Green/Blue)',
      resistanceCheck: 'CAN H to CAN L: 58 - 62 Ohms with ignition OFF. Ground to Chassis: < 0.2 Ohms.',
      voltageCheck: 'Ignition ON: Pin 1 = 23.5V - 28.2V; CAN H = 2.6V - 2.8V; CAN L = 2.2V - 2.4V.',
      canBusGuidance: 'Check twisted pair integrity. CAN wires must maintain at least 1 twist per inch to reject high-power starter motor EMF noise.'
    },
    possibleRepairs: [
      'Replace blown 15A Aftertreatment power fuse and seal connector with dielectric grease',
      'Repair chafed harness section using heat-shrink tubing and route away from exhaust pipe',
      'Replace Outlet NOx Sensor assembly (smart probe + electronic module) if internal heater circuit failed',
      'Perform NOx sensor adaptation reset via commercial diagnostic tablet (INSITE, Al-Diag, or Launch HD)'
    ],
    confidence: 'high',
    recommendedCategory: 'bs4_bs6_expert',
    safetyNotice: 'CRITICAL: Never attempt to short or bypass NOx sensor wires. BS6 emission control architecture will enforce severe 20 km/h Limp Mode if sensor signal is bypassed.'
  },
  {
    code: 'SPN 4364 FMI 18',
    standard: 'J1939',
    system: 'SCR Aftertreatment Catalyst Conversion',
    title: 'Aftertreatment 1 SCR Catalyst Conversion Efficiency Below Normal',
    hindiTitle: 'SCR कैटलिस्ट यूरिया कन्वर्जन क्षमता कम (AdBlue साइलेंसर फाल्ट)',
    summary: 'The ratio of NOx measured before the SCR catalyst vs. after the SCR catalyst shows insufficient conversion efficiency. Catalytic reduction of NOx is impaired.',
    hindiSummary: 'साइलेंसर में यूरिया (AdBlue) द्वारा जहरीली गैसों का शुद्धिकरण ठीक से नहीं हो रहा है। इसके मुख्य कारण खराब यूरिया, चोक नोजल या कमजोर डोजर पंप हैं।',
    commonCauses: [
      'Diluted, spurious, or low-concentration AdBlue/DEF (below 32.5% urea content)',
      'AdBlue dosing nozzle clogged with crystallized white urea deposits on exhaust pipe',
      'Contaminated DEF fluid (diesel or coolant mixed into AdBlue tank)',
      'Upstream exhaust gas temperature sensor reading incorrectly low (< 200°C disables dosing)',
      'Defective Inlet or Outlet NOx sensor giving drifting sensor values',
      'De-waxing or sulfur poisoning of the SCR catalyst brick'
    ],
    hindiCauses: [
      'टंकी में पानी मिला या घटिया किस्म का नकली यूरिया (AdBlue) भरा गया है',
      'यूरिया छिड़कने वाली नोजल में सफेद क्रिस्टल (पपड़ी) जमकर छेद बंद हो गए हैं',
      'यूरिया टंकी में डीजल या मोबिल ऑइल की मिलावट हो गई है',
      'एग्जॉस्ट टेम्परेचर सेंसर खराब होने से 200 डिग्री का तापमान रिपोर्ट नहीं हो रहा',
      'साइलेंसर के अंदर की जाली (कैटलिस्ट) सल्फर या धुएं से चोक हो गई है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Check AdBlue / DEF Fluid Quality',
        hindiTitle: 'यूरिया (AdBlue) की क्वालिटी चेक करें',
        action: 'Use an optical refractometer to test urea concentration from the tank. Refractive index must read exactly 32.5% ± 0.7%. Smell for ammonia contamination.',
        hindiAction: 'रिफ्रैक्टोमीटर से यूरिया की शुद्धता नापें। यह ठीक 32.5% होनी चाहिए। यदि पानी या मिलावट हो तो पूरी टंकी खाली करें।'
      },
      {
        step: 2,
        title: 'Inspect Dosing Injector Nozzle',
        hindiTitle: 'यूरिया डोजर नोजल की जांच',
        action: 'Unbolt DEF dosing unit from the exhaust pipe. Inspect the 3 micro-spray orifices for white solid crystallization.',
        hindiAction: 'साइलेंसर पर लगी डोजर नोजल को खोलें। उसके छिद्रों पर सफेद क्रिस्टल देखें। इसे केवल गर्म डिस्टिल्ड पानी में धोएं, तार से न कुरेदें।',
        safetyWarning: 'Only clean dosing nozzles with hot distilled water. Never use metal wires or scrapers which ruin precision spray angles.'
      },
      {
        step: 3,
        title: 'Perform Dosing Actuation Test',
        hindiTitle: 'स्कैनर से यूरिया डोजिंग टेस्ट करें',
        action: 'Connect commercial diagnostic scanner and trigger "DEF Dosing Override Test" into a graduated beaker. Correct flow rate is 80 - 120 ml in 3 minutes at 8.5 bar.',
        hindiAction: 'स्कैनर से डोजिंग टेस्ट चालू करें। 3 मिनट में 80 से 120 मिली यूरिया का छिड़काव 8.5 बार प्रेशर पर होना चाहिए।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'DEF Injector 2-pin connector: Pin 1 (+24V Dosing Relay); Pin 2 (PWM Ground control from DCU/ECM)',
      resistanceCheck: 'Dosing solenoid coil resistance: 12.0 - 16.5 Ohms at 25°C ambient temperature.',
      voltageCheck: 'Pin 1 to Ground with Key ON = 24V; PWM Signal frequency ~ 10Hz during active injection.',
      canBusGuidance: 'Check Dosing Control Unit (DCU) CAN telemetry on pins 19 and 20 of main DCU connector.'
    },
    possibleRepairs: [
      'Drain contaminated DEF tank, flush lines with demineralized water, and refill with ISO 22241 certified DEF',
      'Clean dosing injector nozzle in ultrasonic hot water bath',
      'Replace DEF dosing pump module if pressure fails to reach 8.5 bar (123 psi)',
      'Execute stationary SCR High-Temperature Regeneration cycle to de-crystallize catalyst'
    ],
    confidence: 'high',
    recommendedCategory: 'dpf_scr_urea',
    safetyNotice: 'Never run engine on diesel-contaminated DEF. Petroleum destroys the EPDM rubber seals inside the DCU dosing pump within minutes.'
  },
  {
    code: 'P20EE',
    standard: 'OBD2',
    system: 'SCR Aftertreatment Catalytic Converter',
    title: 'SCR NOx Catalyst Efficiency Below Threshold (Bank 1)',
    hindiTitle: 'SCR कैटलिस्ट एमिशन शुद्धिकरण स्तर सीमा से कम (Bank 1)',
    summary: 'Standard OBD2 emission fault code indicating the Selective Catalytic Reduction catalyst NOx conversion is below 70% efficiency under standard highway load.',
    hindiSummary: 'गाड़ी के साइलेंसर में NOx शुद्धिकरण तय सीमा से कम हो रहा है। यह SPN 4364 FMI 18 का मानक OBD2 समकक्ष कोड है।',
    commonCauses: [
      'Low concentration or contaminated AdBlue / DEF urea solution',
      'Crystallized urea blockage on DEF dosing injector nozzle',
      'Exhaust leak upstream of the SCR catalyst inlet cone',
      'Fouled NOx sensor or faulty SCR inlet temperature sensor'
    ],
    hindiCauses: [
      'नकली या पानी मिला यूरिया (AdBlue)',
      'यूरिया नोजल में सफेद पपड़ी जमना',
      'साइलेंसर के आगे के पाइप में गैस लीकेज',
      'NOx सेंसर या टेम्परेचर सेंसर में खराबी'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Check Exhaust Leaks',
        hindiTitle: 'साइलेंसर गैस लीकेज चेक करें',
        action: 'Inspect exhaust flex pipe and V-band clamps upstream of the SCR canister for black soot trails indicating pressure leaks.',
        hindiAction: 'साइलेंसर के फ्लेक्स पाइप और क्लेम्प पर काले धुएं के निशान देखें। गैस लीक होने पर प्रेशर गिर जाता है।'
      },
      {
        step: 2,
        title: 'Refill Certified AdBlue',
        hindiTitle: 'प्रमाणित AdBlue यूरिया भरें',
        action: 'Fill high-grade ISO 22241 urea from a sealed container. Avoid roadside loose open-drum urea.',
        hindiAction: 'सील पैक कंपनी का नया AdBlue भरें। खुले ड्रम का यूरिया न डालें।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'Check Exhaust Gas Temperature (EGT) sensor harness routing away from prop shaft.',
      resistanceCheck: 'PT200 EGT Sensor resistance: ~220 Ohms at 25°C, increasing to ~350 Ohms at 200°C.',
      voltageCheck: 'Sensor 5V reference supply from ECM.',
      canBusGuidance: 'Check OBD-II pin 6 (CAN H) and pin 14 (CAN L) for clean waveform.'
    },
    possibleRepairs: [
      'Drain and replace DEF fluid with genuine ISO 22241 standard AdBlue',
      'Replace cracked exhaust flex pipe / tighten loose V-band clamps',
      'Clean dosing injector and perform forced highway regeneration'
    ],
    confidence: 'high',
    recommendedCategory: 'bs4_bs6_expert',
    safetyNotice: 'Driving for more than 48 hours with code P20EE will trigger automated Inducement Limp Mode with severe engine de-rate.'
  },
  {
    code: 'SPN 1761 FMI 1',
    standard: 'J1939',
    system: 'Diesel Exhaust Fluid (DEF) Tank Level',
    title: 'Aftertreatment 1 Diesel Exhaust Fluid Tank Level Severely Low',
    hindiTitle: 'यूरिया (AdBlue) टैंक का स्तर बहुत कम - लिम्प मोड एक्टिव होने वाला है',
    summary: 'Diesel Exhaust Fluid level inside the plastic urea tank has dropped below 5%. First stage driver inducement alert active.',
    hindiSummary: 'यूरिया टंकी लगभग खाली हो चुकी है (5% से कम)। इंजन कुछ ही समय में स्पीड और टॉर्क कम करके 20 किमी/घंटा कर देगा।',
    commonCauses: [
      'DEF tank empty after long highway run without replenishment',
      'DEF tank level sensor ultrasonic float stuck at the bottom by urea crystallization',
      'Broken wiring to the tank level/temperature/quality header unit',
      'Failed ultrasonic level sender'
    ],
    hindiCauses: [
      'लंबी दूरी तय करने के बाद यूरिया खत्म हो गया है',
      'यूरिया टैंक का फ्लोट सफेद पपड़ी जमने से नीचे ही चिपक गया है',
      'टैंक के ऊपर लगे 4-पिन सेंसर का तार कट गया है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Top Up AdBlue Tank',
        hindiTitle: 'तुरंत 20 लीटर AdBlue भरें',
        action: 'Add at least 20 litres of certified DEF into the blue-capped urea tank. Never put DEF into the diesel fuel tank!',
        hindiAction: 'नीले ढक्कन वाली टंकी में कम से कम 20 लीटर नया यूरिया डालें। भूलकर भी इसे डीजल टंकी में न डालें!',
        safetyWarning: 'NEVER pour AdBlue into the diesel tank. AdBlue in diesel will destroy high-pressure common rail pump and all injectors within minutes.'
      },
      {
        step: 2,
        title: 'Ignition Cycle Reset',
        hindiTitle: 'चाबी बंद-चालू करके सेंसर रिसेट करें',
        action: 'Turn ignition ON, wait 60 seconds, turn OFF for 30 seconds, then restart engine. The ultrasonic sensor takes 30-60 seconds to calibrate fluid level.',
        hindiAction: 'चाबी ON करें, 60 सेकंड रुकें, फिर चाबी बंद करें और 30 सेकंड बाद स्टार्ट करें। सेंसर को स्तर नापने में 1 मिनट लगता है।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'DEF Header unit 4-pin: Pin 1 (Level Signal), Pin 2 (Temperature Signal), Pin 3 (5V Sensor Supply), Pin 4 (Sensor Ground)',
      resistanceCheck: 'Level sensor circuit: 0 to 180 ohms (analog type) or digital PWM output.',
      voltageCheck: '5.0V steady DC supply on Pin 3.',
      canBusGuidance: 'Some BS6 models (Tata Prima, BharatBenz) use LIN-bus on Pin 1 for combined quality/level sensor.'
    },
    possibleRepairs: [
      'Refill DEF tank with 20-40 litres of certified AdBlue',
      'Gently tap the DEF tank bottom to free sticky level float if filled but still showing empty',
      'Replace DEF header suction unit if level sensor electronic probe is failed'
    ],
    confidence: 'high',
    recommendedCategory: 'dpf_scr_urea',
    safetyNotice: 'Do not fill plain water into the DEF tank. Modern BS6 trucks have quality sensor and optical refractive density checks that detect water within 3 minutes and permanently lock ECM.'
  },
  {
    code: 'SPN 3719 FMI 16',
    standard: 'J1939',
    system: 'Diesel Particulate Filter (DPF) System',
    title: 'Aftertreatment 1 Diesel Particulate Filter Soot Load Level 3 - Above Normal',
    hindiTitle: 'DPF साइलेंसर में कालिख (Soot) अत्यधिक जमाव - लेवल 3 चेतावनी',
    summary: 'The DPF differential pressure sensor indicates soot accumulation has exceeded normal automatic regeneration limits (typically > 105% capacity). A manual parked stationary regeneration is required.',
    hindiSummary: 'साइलेंसर में लगा DPF फिल्टर धुएं की कालिख से 105% से ज्यादा भर चुका है। गाड़ी चलते हुए अपने आप साफ नहीं हो पा रही है। सुरक्षित जगह गाड़ी रोककर पार्कड रीजनरेशन (Parked Regen) करना जरूरी है।',
    commonCauses: [
      'Frequent low-speed city driving or extended highway idling without reaching exhaust temperature (> 250°C)',
      'Faulty DPF differential pressure sensor or cracked silicone sampling tubes',
      'Defective 7th injector / Hydrocarbon (HC) doser not spraying diesel to heat DPF',
      'Engine burning lube oil due to turbocharger seal leak or worn valve stem seals',
      'Intercooler hose split causing excessive black smoke generation'
    ],
    hindiCauses: [
      'लगातार धीमी गति या जाम में गाड़ी चलाना जिससे साइलेंसर पर्याप्त गर्म नहीं हो पाया',
      'DPF डिफरेंशियल प्रेशर सेंसर की पतली पाइप मुड़ना या फटना',
      'टर्बोचार्जर से इंजन ऑयल लीक होकर साइलेंसर में जलना',
      'इंटरकूलर का पाइप फटने से काला धुआं अधिक निकलना'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Safety Positioning',
        hindiTitle: 'सुरक्षित स्थान पर पार्किंग',
        action: 'Park the truck in a clear open area away from dry grass, fuel tankers, or flammable cargo.',
        hindiAction: 'ट्रक को सूखी घास, पेट्रोल टैंकर या ज्वलनशील सामान से दूर सुरक्षित खुली जगह पर पार्क करें।'
      },
      {
        step: 2,
        title: 'Operating Preconditions',
        hindiTitle: 'रीजनरेशन पूर्व शर्तें',
        action: 'Ensure gear is in Neutral, handbrake applied, foot off accelerator and clutch pedals, and coolant temperature above 65°C.',
        hindiAction: 'गियर न्यूट्रल करें, हैंडब्रेक लगाएं, रेस और क्लच से पैर हटाएं, कूलेंट टेम्परेचर 65°C से ऊपर होना चाहिए।'
      },
      {
        step: 3,
        title: 'Initiate Parked Regeneration',
        hindiTitle: 'पार्क्ड रीजनरेशन शुरू करें',
        action: 'Press and hold the DPF Manual Regeneration dashboard switch for 3 to 5 seconds until engine RPM raises automatically to 1400-1800 RPM.',
        hindiAction: 'डैशबोर्ड पर लगा DPF रीजनरेशन स्विच 3 से 5 सेकंड तक दबाए रखें जब तक इंजन की रेस अपने आप 1400-1800 RPM पर न बढ़ जाए।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'Inspect 3-pin connector on DPF Differential Pressure Sensor. Pin 1: 5.0V Reference, Pin 2: Ground, Pin 3: Signal (0.5V to 4.5V DC proportional to exhaust backpressure).',
      voltageCheck: '5.0V DC +/- 0.1V between Ref Pin and Sensor Ground with ignition ON.',
      resistanceCheck: 'Wiring harness ground to engine block must show less than 0.3 Ohms resistance.',
      canBusGuidance: 'Check DPF temperature sensors (DOC Inlet, DPF Inlet, DPF Outlet) via diagnostic scanner to ensure all 3 sensors read ambient temperature before cranking.'
    },
    possibleRepairs: [
      'Initiate 35-minute stationary manual DPF regeneration cycle',
      'Clean or blow out carbon from DPF differential pressure metal sampling lines',
      'Replace cracked turbo boost hose to eliminate excessive black smoke',
      'Perform forced scanner service regeneration or offline pneumatic DPF core washing if soot level reaches Level 4'
    ],
    confidence: 'high',
    recommendedCategory: 'dpf_scr_urea',
    safetyNotice: 'The DPF exhaust tailpipe temperature exceeds 600°C during active regeneration. Keep personnel and flammables at least 5 meters away.'
  },
  {
    code: 'P0087',
    standard: 'OBD2',
    system: 'CRDI High-Pressure Fuel Rail System',
    title: 'Fuel Rail / System Pressure Too Low (Common Rail)',
    hindiTitle: 'डीजल कॉमन रेल प्रेशर बहुत कम - गाड़ी पिकअप नहीं लेगी या बंद हो जाएगी',
    summary: 'The actual measured diesel fuel rail pressure in the common rail accumulator is significantly below the ECM target setpoint (typically < 300 bar cranking or < 1400 bar under load).',
    hindiSummary: 'इंजन की डीजल कॉमन रेल में जरूरी 1600-2000 बार का प्रेशर नहीं बन रहा है। गाड़ी लोड खींचना छोड़ देगी या चलते-चलते बंद हो जाएगी।',
    commonCauses: [
      'Choked primary diesel fuel filter or pre-filter water separator element',
      'Air trapped in the diesel fuel suction supply line',
      'Worn out high-pressure diesel injection pump (CP3 / CP4 pump)',
      'Excessive injector back-leakage returning all pressurized fuel back to tank',
      'Pressure Relief Valve (PRV) on end of common rail stuck open',
      'Faulty Suction Control Valve (SCV / MPROP / IMV valve) on high-pressure pump'
    ],
    hindiCauses: [
      'डीजल का मुख्य फिल्टर या वाटर सेपरेटर कचरे से चोक हो गया है',
      'डीजल पाइप में एयर (हवा) घुस गई है',
      'हाई प्रेशर डीजल पंप (CP3/CP4) घिस गया है',
      'एक या अधिक डीजल नोजल (इंजेक्टर) लीक होकर डीजल वापस रिटर्न में फेंक रहे हैं',
      'कॉमन रेल का प्रेशर रिलीफ वाल्व (PRV) खुला अटक गया है',
      'पंप पर लगा MPROP / SCV वाल्व जाम हो गया है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Check Diesel Hand Primer Pump',
        hindiTitle: 'डीजल हैंड प्राइमर पंप चलाकर एयर निकालें',
        action: 'Locate the manual hand primer pump on the fuel filter head. Pump vigorously 50-80 times until the plunger becomes rock-hard. If it remains soft and spongy, air is leaking into the suction lines.',
        hindiAction: 'डीजल फिल्टर के ऊपर लगे प्राइमर पंप को 50-80 बार दबाएं। जब तक पंप एकदम कड़ा न हो जाए तब तक एयर निकालते रहें।',
        safetyWarning: 'Do NOT crack open high-pressure steel injector lines with engine cranking. High-pressure diesel (> 1500 bar) can puncture human skin and cause fatal gangrene.'
      },
      {
        step: 2,
        title: 'Check Fuel Filter & Water Trap',
        hindiTitle: 'वाटर सेपरेटर से गंदा पानी और कचरा निकालें',
        action: 'Unscrew the plastic drain thumb-screw at the bottom of the transparent water separator bowl. Drain water, dark residue, or paraffin wax buildup.',
        hindiAction: 'वाटर सेपरेटर की निचली घुंडी खोलकर जमा पानी और कचरा बाहर निकालें।'
      },
      {
        step: 3,
        title: 'Check Pressure Relief Valve (PRV) Return Tube',
        hindiTitle: 'PRV वाल्व की रिटर्न पाइप चेक करें',
        action: 'Disconnect the rubber return pipe on the end of the common rail. Crank engine: zero diesel should leak out of the PRV fitting. If diesel flows out, the PRV mechanical valve is damaged and leaking rail pressure.',
        hindiAction: 'कॉमन रेल के किनारे लगे PRV वाल्व की रिटर्न नली हटाएं। सेल्फ मारते समय यहां से बूंद भी डीजल नहीं आना चाहिए।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'Rail Pressure Sensor (RPS) 3-Pin: Pin 1 (Ground), Pin 2 (Signal to ECM), Pin 3 (+5.0V Reference Supply)',
      resistanceCheck: 'Suction Control Valve (SCV) solenoid coil: 2.1 - 4.5 Ohms at 20°C.',
      voltageCheck: 'RPS Signal Voltage: 0.50V at Key ON (0 bar); 1.0V - 1.3V at Idle (350 bar); 3.8V - 4.2V at full throttle acceleration (1800 bar).',
      canBusGuidance: 'Check ECM diagnostic PID for Rail Pressure Target vs Actual.'
    },
    possibleRepairs: [
      'Replace primary fuel filter and secondary 2-micron diesel filter cartridge',
      'Bleed air from fuel system and tighten loose hose jubilee clips',
      'Replace Rail Pressure Relief Valve (PRV) if leaking return fuel',
      'Test injector back-leakage with test vials and replace high-leakage injector'
    ],
    confidence: 'high',
    recommendedCategory: 'diesel_fuel_system',
    safetyNotice: 'Never crank starter motor continuously for more than 15 seconds. Allow 2 minutes cooling between attempts to avoid burning heavy 24V starter motor.'
  },
  {
    code: 'SPN 639 FMI 9',
    standard: 'J1939',
    system: 'J1939 Backbone CAN-Bus Network',
    title: 'J1939 Network #1 Primary CAN Data Link Abnormal Update Rate',
    hindiTitle: 'J1939 मुख्य CAN बस संचार लाइन खराब - सभी मीटर व लाइटें बंद/फ्लिकर',
    summary: 'The master vehicle CAN communication backbone has failed or intermittent packet collisions are occurring between the Engine ECM, Instrument Cluster, BCM, and ABS module.',
    hindiSummary: 'गाड़ी के सभी कम्प्यूटरों (ECM, क्लस्टर मीटर, ABS, BCM) को जोड़ने वाली मुख्य CAN बस लाइन कट गई है या शॉर्ट हो गई है। क्लस्टर में कई लाइटें एक साथ जल उठेंगी।',
    commonCauses: [
      'Severed, crushed, or rubbed-through twisted pair CAN wires (Yellow and Green) near chassis articulation point',
      'Failed 120-ohm terminating resistor (either at rear chassis or inside instrument cluster)',
      'Water ingress or internal short-circuit inside ABS or Retarder ECU pulling CAN bus down',
      'Damaged OBD / J1939 9-pin diagnostic connector behind dashboard'
    ],
    hindiCauses: [
      'पीला और हरा CAN तार चेसिस या केबिन के नीचे दबकर कट गया है',
      '120 ओम का टर्मिनेटर रेसिस्टर जल गया है',
      'ABS या ट्रांसमिशन ECU में पानी घुसने से पूरी लाइन शॉर्ट हो गई है',
      'डैशबोर्ड के नीचे लगा 9-पिन डायग्नोस्टिक सॉकेट खराब हो गया है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Measure CAN Bus Resistance at Diagnostic Port',
        hindiTitle: 'डायग्नोस्टिक सॉकेट पर 60 ओम रेजिस्टेंस नापें',
        action: 'Turn ignition Key OFF. Locate the 9-pin Deutsch or 16-pin OBD port. Connect digital multimeter in Ohms mode between CAN High (Pin C on 9-pin / Pin 6 on OBD) and CAN Low (Pin D on 9-pin / Pin 14 on OBD).',
        hindiAction: 'चाबी OFF करें। डायग्नोस्टिक पोर्ट पर CAN High और CAN Low के बीच मल्टीमीटर से रेजिस्टेंस नापें।',
        safetyWarning: 'Always turn ignition switch OFF before measuring CAN bus resistance to avoid damaging multimeter electronics.'
      },
      {
        step: 2,
        title: 'Interpret Resistance Reading',
        hindiTitle: 'रेजिस्टेंस परिणाम का विश्लेषण',
        action: '60 Ohms = Normal termination. 120 Ohms = One terminating resistor or wire open. 0 Ohms = Short between CAN H and CAN L. Infinity / Mega-ohms = Both terminating resistors disconnected or broken backbone.',
        hindiAction: '60 ओम = बिल्कुल सही। 120 ओम = एक तरफ का तार कटा है। 0 ओम = दोनों तार आपस में चिपक गए हैं। मेगा-ओम = पूरी लाइन टूटी है।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: 'J1939 CAN Port: Pin C = CAN High (Yellow); Pin D = CAN Low (Green); Pin A = Battery (-); Pin B = Battery (+24V)',
      resistanceCheck: 'CAN H to CAN L = 59 - 61 Ohms. CAN H to Ground = Mega-ohms (no short). CAN L to Ground = Mega-ohms.',
      voltageCheck: 'Ignition ON: CAN High = 2.65V to 2.85V; CAN Low = 2.15V to 2.35V. Sum should equal approximately 5.0V.',
      canBusGuidance: 'Always maintain tightly twisted pair cable (minimum 33 twists per meter) with continuous shielding grounded at only one end to prevent ground loops.'
    },
    possibleRepairs: [
      'Locate broken CAN bus section near cabin tilt hinge and solder with double heat-shrink insulation',
      'Replace external 120-ohm terminating resistor plug on rear chassis crossmember',
      'Unplug auxiliary ECUs (such as telematics or aftermarket GPS) one by one to find offending unit shorting bus'
    ],
    confidence: 'high',
    recommendedCategory: 'wiring_repair',
    safetyNotice: 'Never use scotch-locks or unsealed crimps on CAN bus wires. Any impedance discontinuity causes signal reflection and packet drops.'
  },
  {
    code: 'SPN 789 FMI 1',
    standard: 'J1939',
    system: 'Wabco / Knorr / Bendix Commercial ABS Braking',
    title: 'Wheel Speed Sensor Axle 1 Left Abnormal Air Gap / Weak Signal',
    hindiTitle: 'आगे का बायां ABS पहिया स्पीड सेंसर एयर गैप फाल्ट (Wabco ब्रेक)',
    summary: 'The ABS Electronic Control Unit detected a weak or missing wheel speed pulse from the front left wheel speed sensor during initial vehicle rollout above 10 km/h.',
    hindiSummary: 'आगे के बाएं पहिए पर लगा ABS सेंसर पोल व्हील (दांतेदार रिंग) से दूर हो गया है या दांते में कचरा भर गया है। ABS बत्ती जल जाएगी।',
    commonCauses: [
      'Sensor pushed back into clamping sleeve due to road vibrations, causing excessive air gap (> 1.2 mm)',
      'Caked mud, iron filings, or thick grease coating the toothed pole wheel (exciter ring)',
      'Excessive wheel hub bearing play causing erratic sensor-to-ring gap',
      'Cracked pole wheel ring teeth'
    ],
    hindiCauses: [
      'सेंसर अपनी क्लिप में पीछे खिसक गया है जिससे गैप ज्यादा हो गया है',
      'पहिए के दांतेदार चक्र (पोल व्हील) पर कीचड़, ग्रीस या लोहे का बुरादा जम गया है',
      'पहिए के हब बेरिंग में चाल (प्ले) आने से गैप हिल रहा है',
      'सेंसर की केबल राजा-पिन या कमानी से घिस गई है'
    ],
    safeChecklist: [
      {
        step: 1,
        title: 'Push Sensor Inwards (Automatic Air Gap Setting)',
        hindiTitle: 'सेंसर को हाथ से अंदर दबाएं (ऑटोमैटिक गैप)',
        action: 'Reach behind the brake dust shield. Push the cylindrical ABS sensor barrel inwards until it gently contacts the toothed pole wheel. When the truck drives, the ring will push it back to the exact required 0.5 mm operating clearance.',
        hindiAction: 'ब्रेक प्लेट के पीछे से ABS सेंसर को धीरे से आगे की ओर दबाएं जब तक वह दांतेदार चक्र को छू न ले। पहिया घूमने पर सही गैप अपने आप बन जाता है।',
        safetyWarning: 'Ensure parking brake is locked and wheel chocks are placed before reaching near wheels.'
      },
      {
        step: 2,
        title: 'Test Sensor Coil Resistance',
        hindiTitle: 'सेंसर कॉइल का रेजिस्टेंस नापें',
        action: 'Unplug the 2-pin bayonet connector. Measure resistance across the sensor pins: must read between 1050 Ohms and 1550 Ohms. Rotate the wheel: AC voltage should generate 0.2V - 0.5V AC.',
        hindiAction: '2-पिन प्लग खोलकर रेजिस्टेंस नापें: 1050 से 1550 ओम आना चाहिए। पहिया घुमाने पर 0.2V से 0.5V AC करंट बनना चाहिए।'
      }
    ],
    wiringGuidance: {
      pinoutCheck: '2-Pin Sensor Connector: Reversible passive inductive magnetic pickup',
      resistanceCheck: 'Normal coil resistance: 1050 - 1550 Ohms at 20°C ambient. If infinite, coil wire broken.',
      voltageCheck: 'Spin wheel by hand at 1 rev/sec: multimeter in AC Volts mode should display > 0.25V AC.',
      canBusGuidance: 'ABS unit communicates via J1939 to Engine ECM to cut throttle during wheel-slip events.'
    },
    possibleRepairs: [
      'Reset sensor barrel position by pushing fully into stainless steel clamping bush',
      'Clean toothed pole wheel with brake cleaner spray and wire brush',
      'Replace ABS wheel speed sensor and clamping sleeve if harness is damaged'
    ],
    confidence: 'high',
    recommendedCategory: 'air_brake_suspension',
    safetyNotice: 'While normal foundation air brakes continue to function, Anti-lock Braking will remain disabled during heavy rain or panic stops.'
  }
];

/**
 * Searches the heavy commercial vehicle diagnostic database for fault codes or symptoms.
 */
export function queryHeavyTruckFaultCode(inputQuery: string, vehicleBrand?: string): FaultCodeDetail | null {
  if (!inputQuery || !inputQuery.trim()) return null;
  const q = inputQuery.toUpperCase().trim();

  // 1. Direct code exact match (e.g. "SPN 3226 FMI 9", "P20EE", "3226", "4364", "P0087")
  const exact = HEAVY_TRUCK_FAULT_CODES.find(f => {
    if (f.code.toUpperCase() === q) return true;
    const parts = f.code.toUpperCase().split(' ');
    // Match SPN numbers like "3226"
    if (parts.includes(q)) return true;
    return false;
  });
  if (exact) return exact;

  // 2. Substring or code parts match (e.g. user entered "3226 fmi 9" or "spn 4364")
  const substringMatch = HEAVY_TRUCK_FAULT_CODES.find(f => {
    const fUpper = f.code.toUpperCase();
    if (q.includes(fUpper) || fUpper.includes(q)) return true;
    
    // Check SPN number
    const spnMatch = fUpper.match(/SPN\s*(\d+)/);
    if (spnMatch && q.includes(spnMatch[1])) return true;

    // Check P-code (e.g. P20EE, P0087)
    const pMatch = fUpper.match(/P\d{4}[A-Z0-9]*/);
    if (pMatch && q.includes(pMatch[0])) return true;

    return false;
  });
  if (substringMatch) return substringMatch;

  // 3. Keyword / symptom match
  const qLower = inputQuery.toLowerCase();
  const keywordMatch = HEAVY_TRUCK_FAULT_CODES.find(f => {
    if (qLower.includes('adblue') || qLower.includes('urea') || qLower.includes('यूरिया')) {
      if (f.code.includes('4364') || f.code.includes('1761') || f.code.includes('3226')) return true;
    }
    if (qLower.includes('nox') || qLower.includes('सेंसर')) {
      if (f.code.includes('3226')) return true;
    }
    if (qLower.includes('rail') || qLower.includes('diesel') || qLower.includes('crdi') || qLower.includes('प्रेशर')) {
      if (f.code.includes('P0087')) return true;
    }
    if (qLower.includes('can') || qLower.includes('मीटर') || qLower.includes('wiring') || qLower.includes('वायरिंग')) {
      if (f.code.includes('639')) return true;
    }
    if (qLower.includes('abs') || qLower.includes('ब्रेक')) {
      if (f.code.includes('789')) return true;
    }
    return false;
  });

  return keywordMatch || null;
}
