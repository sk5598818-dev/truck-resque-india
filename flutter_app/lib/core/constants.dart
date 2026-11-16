class AppConstants {
  static const String appName = 'TRUCK RESCUE INDIA';
  static const String appTagline = '24x7 Heavy Commercial Vehicle Highway Breakdown Network';
  
  // Helplines
  static const String nationalHelpline = '1800889988';
  static const String nhaiHelpline = '1033';
  static const String nationalHelplineDisplay = '1800-889-988';

  // Backend API URL
  static const String apiBaseUrl = 'https://truckrescueindia.in/api';

  // Firestore Collections (matches web architecture exactly)
  static const String colGarages = 'garages';
  static const String colEmergencies = 'emergencies';
  static const String colReviews = 'reviews';
  static const String colUsers = 'users';
  static const String colComplaints = 'complaints';
  static const String colAuditLogs = 'audit_logs';

  // Service Categories
  static const List<Map<String, String>> serviceCategories = [
    {'id': 'heavy_mechanic', 'label': 'Heavy Truck Mechanic', 'hindi': 'भारी ट्रक मैकेनिक'},
    {'id': 'truck_electrician', 'label': 'Truck Electrician', 'hindi': 'ट्रक इलेक्ट्रीशियन'},
    {'id': 'laptop_diagnostic', 'label': 'Diagnostic Scanner / Codes', 'hindi': 'लैपटॉप स्कैनर / फाल्ट कोड'},
    {'id': 'ecm_ecu_repair', 'label': 'ECM / ECU Flashing & Repair', 'hindi': 'ईसीएम / ईसीयू रिपेयर'},
    {'id': 'dpf_scr_urea', 'label': 'AdBlue SCR / DPF Emission', 'hindi': 'यूरिया / DPF साइलेंसर'},
    {'id': 'nox_sensor', 'label': 'NOx Sensor & Exhaust', 'hindi': 'NOx सेंसर व एग्जॉस्ट'},
    {'id': 'starter_alternator', 'label': 'Starter & Alternator', 'hindi': 'सेल्फ स्टार्टर व अल्टरनेटर'},
    {'id': 'battery_service', 'label': 'Truck Battery Jumpstart', 'hindi': 'बैटरी जम्पस्टार्ट'},
    {'id': 'tyre_puncture', 'label': 'Tyre Repair & Replacement', 'hindi': 'टायर पंचर व नया टायर'},
    {'id': 'towing_recovery', 'label': 'Hydraulic Crane & Towing', 'hindi': 'हाइड्रोलिक टोइंग व क्रेन'},
    {'id': 'spare_parts', 'label': 'Heavy Vehicle Spare Parts', 'hindi': 'स्पेयर पार्ट्स'},
  ];

  // Truck Brands
  static const List<String> truckBrands = [
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
    'Other / Imported'
  ];

  // Breakdown Categories
  static const List<Map<String, dynamic>> breakdownCategories = [
    {'id': 'engine_problem', 'label': 'Engine problem', 'hindi': 'इंजन की समस्या', 'severity': 'high'},
    {'id': 'truck_not_starting', 'label': 'Truck not starting', 'hindi': 'गाड़ी स्टार्ट नहीं हो रही', 'severity': 'critical'},
    {'id': 'electrical_problem', 'label': 'Electrical problem', 'hindi': 'इलेक्ट्रिकल समस्या', 'severity': 'medium'},
    {'id': 'wiring_problem', 'label': 'Wiring problem', 'hindi': 'वायरिंग जलना / शार्ट', 'severity': 'high'},
    {'id': 'ecm_ecu_problem', 'label': 'ECM / ECU problem', 'hindi': 'ECM / ECU समस्या', 'severity': 'critical'},
    {'id': 'scanner_diagnostic', 'label': 'Scanner / Fault code', 'hindi': 'स्कैनर / फाल्ट कोड', 'severity': 'medium'},
    {'id': 'urea_scr_dpf', 'label': 'UREA / SCR / DPF problem', 'hindi': 'यूरिया / DPF साइलेंसर', 'severity': 'high'},
    {'id': 'nox_sensor', 'label': 'NOx sensor problem', 'hindi': 'NOx सेंसर फाल्ट', 'severity': 'medium'},
    {'id': 'tyre_problem', 'label': 'Tyre problem', 'hindi': 'टायर बर्स्ट / पंचर', 'severity': 'high'},
    {'id': 'brake_problem', 'label': 'Air Brake failure', 'hindi': 'एयर ब्रेक फेल', 'severity': 'critical'},
    {'id': 'accident_towing', 'label': 'Accident / Crane Towing', 'hindi': 'दुर्घटना / क्रेन जरूरी', 'severity': 'critical'},
  ];
}
