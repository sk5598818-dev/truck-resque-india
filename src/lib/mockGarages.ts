import { Garage } from './types';
import { encodeGeohash } from './geo';

export const INITIAL_GARAGES: Garage[] = [
  {
    id: 'bhiwandi-truck-care',
    uid: 'owner_bhiwandi_01',
    ownerName: 'Gurmeet Singh & Parminder',
    phone: '+919820123456',
    whatsapp: '+919820123456',
    garageName: 'Punjab National Truck Care & ECM Center',
    garageType: 'hybrid',
    description: 'Specialists in Tata Prima, Signa and BharatBenz BS4/BS6 heavy trailers. 24x7 roadside mobile rescue van with Cummins INLINE scanner, J2534, DPF regeneration, and ECM flashing.',
    services: [
      'Heavy Truck Mechanic',
      'Truck Electrician',
      'Laptop Diagnostic / Fault Codes',
      'ECM / ECU Flashing & Repair',
      'BS4 / BS6 Emission Expert',
      'DPF / SCR / AdBlue Urea System',
      'NOx Sensor & Exhaust Repair',
      'Hydraulic Crane & Towing Service'
    ],
    brands: [
      'Tata Motors (Prima, Signa, LPT)',
      'BharatBenz (Heavy & Medium Duty)',
      'Ashok Leyland (AVTR, Ecomet, Captain)'
    ],
    equipment: [
      'Cummins INLINE 6 / 7 Diagnostic Adapter',
      'Tata INSITE / e-Diagnostic System',
      'samDiaX / samDia Commercial Bus Scanner',
      'ECM Bench Programmer (KTAG, KESS, Foxflash)',
      'High-Current Battery & Alternator Load Tester'
    ],
    address: 'Survey No. 44, Mumbai-Nashik Highway NH-3, Near Mankoli Toll Naka',
    state: 'Maharashtra',
    district: 'Thane',
    city: 'Bhiwandi',
    area: 'Mankoli Naka',
    highway: 'NH-48 / NH-3 Mumbai-Nashik Corridor',
    landmark: 'Behind HP Petrol Pump',
    pincode: '421302',
    latitude: 19.2968,
    longitude: 73.0631,
    geohash: encodeGeohash(19.2968, 73.0631),
    serviceRadiusKm: 60,
    mobileService: true,
    twentyFourHours: true,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 48,
    normalCharges: '₹ 800 - ₹ 2,500 based on job',
    emergencyCharges: '₹ 1,500 inspection + parts',
    isActive: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-11-01T15:30:00Z'
  },
  {
    id: 'sgtn-delhi-scanner-hub',
    uid: 'owner_sgtn_02',
    ownerName: 'Mohd. Imran Khan',
    phone: '+919811987654',
    whatsapp: '+919811987654',
    garageName: 'Imran ECM Diagnostics & Auto Electrician',
    garageType: 'workshop',
    description: 'Specialist in Leyland Al-Diag, Cummins, Bosch CRDI pump calibration and wiring harness faults. Complete electrical troubleshooting for Multi-Axle trailers and tippers.',
    services: [
      'Truck Electrician',
      'Wiring Harness Repair',
      'Laptop Diagnostic / Fault Codes',
      'ECM / ECU Flashing & Repair',
      'Self Starter & Alternator',
      'Truck Battery Jumpstart & Sales',
      'NOx Sensor & Exhaust Repair'
    ],
    brands: [
      'Ashok Leyland (AVTR, Ecomet, Captain)',
      'Tata Motors (Prima, Signa, LPT)',
      'Eicher Motors (Pro Series)'
    ],
    equipment: [
      'Leyland DIAG Tool / Al-Diag',
      'Cummins INLINE 6 / 7 Diagnostic Adapter',
      'J2534 PassThru Reprogramming Hardware',
      'Digital Automotive Multimeter & Oscilloscope'
    ],
    address: 'Plot No. 12, G.T. Karnal Road, Sanjay Gandhi Transport Nagar (SGTN)',
    state: 'Delhi NCR',
    district: 'North West Delhi',
    city: 'Delhi',
    area: 'Sanjay Gandhi Transport Nagar',
    highway: 'NH 44 (Delhi - Chandigarh - Jammu Highway)',
    landmark: 'Opposite Transport Union Building',
    pincode: '110042',
    latitude: 28.7495,
    longitude: 77.1352,
    geohash: encodeGeohash(28.7495, 77.1352),
    serviceRadiusKm: 40,
    mobileService: true,
    twentyFourHours: true,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 39,
    normalCharges: '₹ 1,000 diagnostic check',
    emergencyCharges: '₹ 2,000 on highway (NH44)',
    isActive: true,
    createdAt: '2026-02-14T08:00:00Z',
    updatedAt: '2026-11-05T12:00:00Z'
  },
  {
    id: 'jaipur-nh48-towing-crane',
    uid: 'owner_jaipur_03',
    ownerName: 'Rawat Singh Shekhawat',
    phone: '+919414055555',
    whatsapp: '+919414055555',
    garageName: 'Marwar 50-Ton Hydraulic Truck Crane & Towing',
    garageType: 'towing_recovery',
    description: 'Under-lift hydraulic recovery, 50-ton heavy crane for overturned container trucks, accident vehicle recovery and low-bed trailer transport between Delhi-Jaipur-Ajmer NH48.',
    services: [
      'Hydraulic Crane & Towing Service',
      'Heavy Truck Mechanic',
      'Trailer & Chassis Alignment',
      'Air Brake & Kamani / Suspension'
    ],
    brands: [
      'Tata Motors (Prima, Signa, LPT)',
      'Ashok Leyland (AVTR, Ecomet, Captain)',
      'BharatBenz (Heavy & Medium Duty)',
      'Volvo Commercial Trucks',
      'Scania Commercial Vehicles'
    ],
    equipment: [
      'Hydraulic 50-Ton Underlift Crane',
      'Chassis Puller & Hydraulic Jacks',
      'Gas Cutting & Heavy Electric Arc Welding'
    ],
    address: 'Near Shahpura Toll Plaza, Delhi-Jaipur Highway NH-48',
    state: 'Rajasthan',
    district: 'Jaipur',
    city: 'Shahpura / Jaipur',
    area: 'Highway Belt',
    highway: 'NH 48 (Delhi-Jaipur Corridor)',
    landmark: 'Shahpura Toll Barrier',
    pincode: '303103',
    latitude: 27.3879,
    longitude: 75.9598,
    geohash: encodeGeohash(27.3879, 75.9598),
    serviceRadiusKm: 120,
    mobileService: true,
    twentyFourHours: true,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 62,
    normalCharges: '₹ 3,500 towing base + ₹ 90/km',
    emergencyCharges: 'Standard round-the-clock rates',
    isActive: true,
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-11-10T16:00:00Z'
  },
  {
    id: 'kalamboli-navi-mumbai-tyre',
    uid: 'owner_kalamboli_04',
    ownerName: 'Rameshwar Yadav',
    phone: '+919930441122',
    whatsapp: '+919930441122',
    garageName: 'Yadav Heavy Commercial Radial Tyre & Alignment',
    garageType: 'workshop',
    description: 'Apollo, MRF, JK Tyre dealer for 295/90R20, 10.00R20 tubeless and tube truck tyres. High pressure nitrogen inflation, pneumatic impact guns for wheel changing, mobile tyre van for Mumbai-Pune Expressway.',
    services: [
      'Tyre Puncture & Replacement',
      'Heavy Vehicle Spare Parts',
      'Air Brake & Kamani / Suspension'
    ],
    brands: [
      'Tata Motors (Prima, Signa, LPT)',
      'Ashok Leyland (AVTR, Ecomet, Captain)',
      'BharatBenz (Heavy & Medium Duty)',
      'Eicher Motors (Pro Series)'
    ],
    equipment: [
      'Heavy Commercial 3D Laser Wheel Aligner',
      'Pneumatic High-Torque Wheel Gun',
      'Tyre Bead Breaker & Tubeless Plugs'
    ],
    address: 'Steel Market Road, Kalamboli Iron Market, Navi Mumbai',
    state: 'Maharashtra',
    district: 'Raigad',
    city: 'Navi Mumbai',
    area: 'Kalamboli',
    highway: 'Mumbai - Pune Expressway Entrance / JNPT Port Road',
    landmark: 'Near Kalamboli Police Station',
    pincode: '410218',
    latitude: 19.0263,
    longitude: 73.1042,
    geohash: encodeGeohash(19.0263, 73.1042),
    serviceRadiusKm: 35,
    mobileService: true,
    twentyFourHours: true,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 31,
    normalCharges: '₹ 150 puncture / ₹ 400 wheel change',
    emergencyCharges: '₹ 800 express roadside callout',
    isActive: true,
    createdAt: '2026-03-20T12:00:00Z',
    updatedAt: '2026-11-08T14:00:00Z'
  },
  {
    id: 'salem-tamil-nadu-ecm',
    uid: 'owner_salem_05',
    ownerName: 'K. Senthil Kumar',
    phone: '+919443210987',
    whatsapp: '+919443210987',
    garageName: 'Senthil Diesel & Common Rail ECM Service',
    garageType: 'hybrid',
    description: 'Master calibration bench for Bosch, Delphi, Denso CRI injectors and high pressure pumps. Ashok Leyland BS6 DEF doser pump testing and Cummins ECU programming for South India trucking lines.',
    services: [
      'Diesel Fuel Injection & CRDI Pump',
      'ECM / ECU Flashing & Repair',
      'Laptop Diagnostic / Fault Codes',
      'BS4 / BS6 Emission Expert',
      'DPF / SCR / AdBlue Urea System'
    ],
    brands: [
      'Ashok Leyland (AVTR, Ecomet, Captain)',
      'Tata Motors (Prima, Signa, LPT)',
      'BharatBenz (Heavy & Medium Duty)'
    ],
    equipment: [
      'Bosch EPS 205 / CRI Computerized Test Bench',
      'RP1210 / J1939 Compliant Heavy Duty VCI',
      'ECM Bench Programmer (KTAG, KESS, Foxflash)'
    ],
    address: 'NH 44 Bye-Pass Road, Kondalampatti Bypass, Salem',
    state: 'Tamil Nadu',
    district: 'Salem',
    city: 'Salem',
    area: 'Kondalampatti',
    highway: 'NH 44 & NH 544 (Bangalore - Coimbatore - Madurai Junction)',
    landmark: 'Near Kondalampatti Flyover',
    pincode: '636010',
    latitude: 11.6267,
    longitude: 78.1362,
    geohash: encodeGeohash(11.6267, 78.1362),
    serviceRadiusKm: 50,
    mobileService: true,
    twentyFourHours: false,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 54,
    normalCharges: '₹ 1,200 testing + repair',
    emergencyCharges: '₹ 2,000 on-site diagnostics',
    isActive: true,
    createdAt: '2026-04-05T09:00:00Z',
    updatedAt: '2026-11-12T11:00:00Z'
  },
  {
    id: 'kanpur-gt-road-spares',
    uid: 'owner_kanpur_06',
    ownerName: 'Vikas Gupta',
    phone: '+919336123456',
    whatsapp: '+919336123456',
    garageName: 'Kalyanpur Heavy Truck Spares & Kamani Works',
    garageType: 'spare_parts_shop',
    description: 'Genuine Tata Genuine Parts, Leyparts, Fleetguard filters, Meritor brake shoes, Gabriel shock absorbers, and heavy kamani leaf springs with express delivery to NH19 highway breakdown spots.',
    services: [
      'Heavy Vehicle Spare Parts',
      'Air Brake & Kamani / Suspension',
      'Heavy Truck Mechanic'
    ],
    brands: [
      'Tata Motors (Prima, Signa, LPT)',
      'Ashok Leyland (AVTR, Ecomet, Captain)',
      'Eicher Motors (Pro Series)'
    ],
    equipment: [
      'Hydraulic Spring Press 50-Ton',
      'Pneumatic Riveting Tool for Brake Lining'
    ],
    address: 'GT Road, Near Rania Industrial Area, Kanpur Dehat',
    state: 'Uttar Pradesh',
    district: 'Kanpur',
    city: 'Kanpur',
    area: 'Rania',
    highway: 'NH 19 (Delhi-Kolkata GT Road Corridor)',
    landmark: 'Near Rania Flyover',
    pincode: '209304',
    latitude: 26.4499,
    longitude: 80.0812,
    geohash: encodeGeohash(26.4499, 80.0812),
    serviceRadiusKm: 45,
    mobileService: true,
    twentyFourHours: true,
    isOpen: true,
    photos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'
    ],
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 27,
    normalCharges: 'MRP + standard labour',
    emergencyCharges: '₹ 500 highway delivery',
    isActive: true,
    createdAt: '2026-05-12T10:00:00Z',
    updatedAt: '2026-11-09T08:00:00Z'
  }
];
