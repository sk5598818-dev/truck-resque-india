import { getAllIndianStates } from './indiaGeoData';

export const SERVICE_CATEGORIES = [
  { id: 'heavy_mechanic', label: 'Heavy Truck Mechanic', hindi: 'भारी ट्रक मैकेनिक', icon: 'Wrench' },
  { id: 'truck_electrician', label: 'Truck Electrician', hindi: 'ट्रक इलेक्ट्रीशियन', icon: 'Zap' },
  { id: 'wiring_repair', label: 'Wiring Harness Repair', hindi: 'वायरिंग रिपेयर', icon: 'Cpu' },
  { id: 'laptop_diagnostic', label: 'Laptop Diagnostic / Fault Codes', hindi: 'लैपटॉप डायग्नोस्टिक / फाल्ट कोड', icon: 'Laptop' },
  { id: 'scanner_diagnostic', label: 'OBD / Scanner Diagnostic', hindi: 'स्कैनर डायग्नोसिस', icon: 'Scan' },
  { id: 'ecm_ecu_repair', label: 'ECM / ECU Flashing & Repair', hindi: 'ईसीएम / ईसीयू रिपेयर', icon: 'CircuitBoard' },
  { id: 'bs4_bs6_expert', label: 'BS4 / BS6 Emission Expert', hindi: 'BS4 / BS6 एमिशन एक्सपर्ट', icon: 'ShieldAlert' },
  { id: 'dpf_scr_urea', label: 'DPF / SCR / AdBlue Urea System', hindi: 'यूरिया (AdBlue) / DPF साइलेंसर', icon: 'Filter' },
  { id: 'nox_sensor', label: 'NOx Sensor & Exhaust Repair', hindi: 'NOx सेंसर व एग्जॉस्ट', icon: 'Gauge' },
  { id: 'starter_alternator', label: 'Self Starter & Alternator', hindi: 'सेल्फ स्टार्टर व अल्टरनेटर', icon: 'RotateCw' },
  { id: 'battery_service', label: 'Truck Battery Jumpstart & Sales', hindi: 'ट्रक बैटरी जम्पस्टार्ट व बिक्री', icon: 'BatteryCharging' },
  { id: 'tyre_puncture', label: 'Tyre Puncture & Replacement', hindi: 'टायर पंचर व नया टायर', icon: 'Disc' },
  { id: 'towing_recovery', label: 'Hydraulic Crane & Towing Service', hindi: 'हाइड्रोलिक टोइंग व क्रेन सर्विस', icon: 'Truck' },
  { id: 'spare_parts', label: 'Heavy Vehicle Spare Parts', hindi: 'हैवी व्हीकल स्पेयर पार्ट्स', icon: 'Package' },
  { id: 'diesel_fuel_system', label: 'Diesel Fuel Injection & CRDI Pump', hindi: 'डीजल सीआरडीआई पम्प व नोजल', icon: 'Fuel' },
  { id: 'ac_cabin_repair', label: 'Truck Cabin AC & Heating', hindi: 'केबिन एसी रिपेयरिंग', icon: 'Wind' },
  { id: 'air_brake_suspension', label: 'Air Brake & Kamani / Suspension', hindi: 'एयर ब्रेक व कमानी सस्पेंशन', icon: 'Anchor' },
  { id: 'trailer_chassis', label: 'Trailer & Chassis Alignment', hindi: 'ट्रेलर व चेसिस वेल्डिंग', icon: 'Compass' }
];

export const PROVIDER_CATEGORIES = [
  { id: 'workshop', label: 'Commercial Truck Workshop / Garage', hindi: 'हैवी ट्रक वर्कशॉप / गैराज', icon: 'Wrench', description: 'Full-service workshop with pit, bays, and multi-mechanic team' },
  { id: 'mobile_technician', label: 'Mobile Roadside Breakdown Van', hindi: 'ऑन-रोड मोबाइल सर्विस वैन', icon: 'Truck', description: 'Fully equipped van traveling directly to highway breakdown spots' },
  { id: 'individual_mechanic', label: 'Individual Truck Mechanic / Electrician', hindi: 'स्वतंत्र मैकेनिक / इलेक्ट्रीशियन', icon: 'User', description: 'Independent specialist technician (mechanic, electrician, ECM/scanner)' },
  { id: 'towing_fleet', label: 'Hydraulic Crane & Towing Fleet', hindi: 'हाइड्रोलिक टोइंग व क्रेन सर्विस', icon: 'Shield', description: 'Heavy recovery vehicles, underlift towing, and hydraulic cranes' },
  { id: 'spare_parts_dealer', label: 'Truck Spare Parts & Lubricants Shop', hindi: 'स्पेयर पार्ट्स व लूब्रिकेंट दुकान', icon: 'Package', description: 'OEM & aftermarket truck spares, filters, DEF, coolant & oils' }
];

export const TRUCK_BRANDS = [
  'Tata Motors (Prima, Signa, LPT)',
  'Ashok Leyland (AVTR, Ecomet, Captain)',
  'BharatBenz (Heavy & Medium Duty)',
  'Eicher Motors (Pro Series)',
  'Mahindra Truck & Bus (Blazo, Furio)',
  'Volvo Commercial Trucks',
  'Scania Commercial Vehicles',
  'MAN Trucks India',
  'Force Motors Commercial',
  'SML Isuzu',
  'AMW Trucks'
];

export const DIAGNOSTIC_EQUIPMENT = [
  'Cummins INLINE 6 / 7 Diagnostic Adapter',
  'Tata INSITE / e-Diagnostic System',
  'Leyland DIAG Tool / Al-Diag',
  'BharatBenz Star Diagnosis / Xentry',
  'Eicher IDIS Diagnostic Tool',
  'samDiaX / samDia Commercial Bus Scanner',
  'RP1210 / J1939 Compliant Heavy Duty VCI',
  'J2534 PassThru Reprogramming Hardware',
  'D-PDU API Commercial Diagnostic Interface',
  'Launch X431 HD / Heavy Duty Tablet Scanner',
  'Autel MaxiSys MS908CV Commercial Scanner',
  'ECM Bench Programmer (KTAG, KESS, Foxflash)',
  'High-Current Battery & Alternator Load Tester',
  'Digital Automotive Multimeter & Oscilloscope'
];

export const INDIAN_STATES = getAllIndianStates();

export const TOP_HIGHWAYS = [
  'NH 44 (Srinagar - Kanyakumari Corridor)',
  'NH 48 (Delhi - Jaipur - Ahmedabad - Mumbai - Bangalore - Chennai)',
  'NH 19 (Delhi - Kolkata / GT Road Corridor)',
  'NH 27 (Porbandar - Silchar East-West Corridor)',
  'NH 52 (Punjab - Rajasthan - MP - Maharashtra - Karnataka)',
  'Delhi - Mumbai Expressway (NE-4)',
  'Yamuna Expressway & Agra-Lucknow Expressway',
  'Samruddhi Mahamarg (Mumbai - Nagpur Expressway)',
  'Purvanchal & Bundelkhand Expressway'
];

export const BREAKDOWN_CATEGORIES = [
  { id: 'engine_problem', label: 'Engine problem', hindi: 'इंजन की समस्या', icon: 'Flame', severity: 'high' },
  { id: 'truck_not_starting', label: 'Truck not starting', hindi: 'गाड़ी स्टार्ट नहीं हो रही', icon: 'PowerOff', severity: 'critical' },
  { id: 'electrical_problem', label: 'Electrical problem', hindi: 'इलेक्ट्रिकल समस्या', icon: 'Zap', severity: 'medium' },
  { id: 'wiring_problem', label: 'Wiring problem', hindi: 'वायरिंग जलना / शॉर्ट सर्किट', icon: 'Cpu', severity: 'high' },
  { id: 'ecm_ecu_problem', label: 'ECM / ECU problem', hindi: 'ECM / ECU समस्या', icon: 'Server', severity: 'critical' },
  { id: 'scanner_diagnostic', label: 'Scanner / Diagnostic problem', hindi: 'स्कैनर / डायग्नोस्टिक फाल्ट', icon: 'Activity', severity: 'medium' },
  { id: 'urea_scr_dpf', label: 'UREA / SCR / DPF problem', hindi: 'यूरिया / DPF / SCR साइलेंसर चोक', icon: 'Filter', severity: 'high' },
  { id: 'nox_sensor', label: 'NOx sensor problem', hindi: 'NOx सेंसर फाल्ट', icon: 'Gauge', severity: 'medium' },
  { id: 'battery_problem', label: 'Battery problem', hindi: 'बैटरी डाउन / डेड', icon: 'BatteryCharging', severity: 'medium' },
  { id: 'starter_problem', label: 'Starter problem', hindi: 'सेल्फ स्टार्टर खराब', icon: 'RotateCw', severity: 'medium' },
  { id: 'alternator_problem', label: 'Alternator problem', hindi: 'अल्टरनेटर चार्जिंग समस्या', icon: 'RefreshCw', severity: 'medium' },
  { id: 'tyre_problem', label: 'Tyre problem', hindi: 'टायर बर्स्ट / पंचर', icon: 'Disc', severity: 'high' },
  { id: 'brake_problem', label: 'Brake problem', hindi: 'एयर ब्रेक / प्रेशर फेल', icon: 'ShieldAlert', severity: 'critical' },
  { id: 'fuel_system_problem', label: 'Fuel system problem', hindi: 'डीजल पम्प / एयर लॉक', icon: 'Fuel', severity: 'high' },
  { id: 'cooling_system_problem', label: 'Cooling system problem', hindi: 'रेडिएटर / कूलेंट लीक / हीटिंग', icon: 'Thermometer', severity: 'high' },
  { id: 'accident_towing', label: 'Accident / towing', hindi: 'दुर्घटना / टोइंग व क्रेन जरूरी', icon: 'Truck', severity: 'critical' },
  { id: 'other', label: 'Other', hindi: 'अन्य समस्या', icon: 'HelpCircle', severity: 'low' }
];

export const VEHICLE_FUEL_TYPES = [
  'BS6',
  'BS4',
  'CNG',
  'LNG',
  'Other'
];

export const EMERGENCY_SERVICE_TYPES = [
  { id: 'roadside_van', label: 'Roadside Rescue Van (मौके पर मैकेनिक)', desc: 'Mobile mechanic van dispatched to highway spot' },
  { id: 'towing_recovery', label: 'Hydraulic Towing / Crane (टोइंग क्रेन)', desc: 'Towing truck to move vehicle safely off highway' },
  { id: 'diagnostic_expert', label: 'Laptop / Scanner Expert (लैपटॉप मैकेनिक)', desc: 'Specialist for BS6 / AdBlue / ECU error code clearing' },
  { id: 'workshop', label: 'Nearest Heavy Workshop (नजदीकी वर्कशॉप)', desc: 'Major overhaul or component replacement' }
];

export const EMERGENCY_STATUS_DISPLAY: Record<string, { label: string; hindi: string; color: string; step: number }> = {
  pending: { label: 'Request Received', hindi: 'अनुरोध प्राप्त हुआ', color: 'bg-yellow-500 text-black', step: 1 },
  searching: { label: 'Searching Nearby Mechanics', hindi: 'नजदीकी मैकेनिक खोजे जा रहे हैं', color: 'bg-amber-500 text-black', step: 1 },
  accepted: { label: 'Mechanic Assigned & Confirmed', hindi: 'मैकेनिक ने स्वीकार किया', color: 'bg-blue-600 text-white', step: 2 },
  mechanic_on_way: { label: 'Mechanic On The Way', hindi: 'मैकेनिक रास्ते में है', color: 'bg-indigo-600 text-white', step: 3 },
  reached_location: { label: 'Mechanic Reached Breakdown Spot', hindi: 'मैकेनिक मौके पर पहुँच गया', color: 'bg-purple-600 text-white', step: 4 },
  work_in_progress: { label: 'Repair In Progress', hindi: 'गाड़ी की रिपेयरिंग चालू है', color: 'bg-orange-600 text-white', step: 5 },
  completed: { label: 'Assistance Completed', hindi: 'काम सफलतापूर्वक संपन्न', color: 'bg-emerald-600 text-white', step: 6 },
  cancelled: { label: 'Request Cancelled', hindi: 'अनुरोध रद्द किया गया', color: 'bg-red-600 text-white', step: 0 },
  expired: { label: 'Request Expired', hindi: 'अनुरोध की समय सीमा समाप्त', color: 'bg-gray-600 text-white', step: 0 }
};

export const DEFAULT_SUBSCRIPTION_PLANS = [
  {
    id: 'free' as const,
    name: 'Free Basic Garage',
    priceInr: 0,
    durationDays: 365,
    badge: 'Standard Partner',
    features: [
      '100% Free Lifetime Registration',
      'Verified Public Directory Listing',
      'Customer Direct Calling & WhatsApp',
      'Normal Nearby GPS Search Presence',
      'Up to 3 Workshop Photos',
      'Receive Highway Emergency Inquiries'
    ],
    maxPhotos: 3,
    priorityListing: false,
    analyticsEnabled: false,
    isActive: true
  },
  {
    id: 'featured' as const,
    name: 'Featured Highway Partner',
    priceInr: 1499,
    durationDays: 30,
    badge: '⭐ Featured Partner',
    features: [
      'Prominent "Featured" Gold Badge on Search',
      'Priority Search Placement in 50km Highway Radius',
      'Up to 10 High-Resolution Workshop & Van Photos',
      'Real-Time Radar Breakdown Lead Alerts',
      'Customer Review Reply & Verified Service Badges',
      'Direct Click-to-Call & WhatsApp Analytics'
    ],
    maxPhotos: 10,
    priorityListing: true,
    analyticsEnabled: true,
    isPopular: true,
    isActive: true
  },
  {
    id: 'premium' as const,
    name: 'Premium Fleet Network',
    priceInr: 3999,
    durationDays: 30,
    badge: '👑 Premium Network',
    features: [
      'Top Sponsored Placement in All Highway Searches',
      'Promotional Banner Showcase on Homepage & Corridors',
      'Unlimited Photos & Equipment Badges',
      'Instant Auto-SMS & Push Notifications for SOS Leads',
      'Fleet & Logistics B2B Lead Referral Priority',
      'Full Revenue, Call & Conversion Business Analytics',
      'Dedicated Regional Account Manager'
    ],
    maxPhotos: 25,
    priorityListing: true,
    analyticsEnabled: true,
    isActive: true
  }
];

export const COMPLAINT_TYPES = [
  { id: 'overcharging', label: 'Overcharging / Price gouging (अधिक शुल्क वसूलना)' },
  { id: 'service_not_provided', label: 'Service not provided after acceptance (स्वीकार करने के बाद नहीं आए)' },
  { id: 'rude_behavior', label: 'Rude / Unprofessional behavior (दुर्व्यवहार)' },
  { id: 'delayed_response', label: 'Unreasonable delay on highway (अत्यधिक देरी)' },
  { id: 'damage_caused', label: 'Vehicle damage caused during repair (वाहन को नुकसान)' },
  { id: 'fake_listing', label: 'Fake garage / Wrong contact info (गलत जानकारी)' },
  { id: 'other', label: 'Other issue (अन्य समस्या)' }
];

export const ADVERTISEMENT_PLACEMENTS = [
  { id: 'homepage_banner', label: 'Homepage National Banner' },
  { id: 'category_page', label: 'Category & Service Pages Banner' },
  { id: 'sponsored_section', label: 'Nearby Search Sponsored Spot' },
  { id: 'garage_profile', label: 'Garage Profile Promotional Slot' }
];
