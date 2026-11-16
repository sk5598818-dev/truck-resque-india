'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'hinglish';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    siteTitle: 'TRUCK RESCUE INDIA',
    siteTagline: '24x7 Emergency Highway Service & Heavy Truck Garage Network',
    findNearby: 'Find Nearby Mechanic',
    emergencyHelp: 'Emergency Truck Help',
    emergencyBanner: 'Highway Breakdown? Need Immediate Assistance?',
    callHelpline: 'Emergency Call 24x7',
    driverLogin: 'Driver Login',
    garageLogin: 'Garage Login',
    registerGarage: 'Register Your Garage',
    joinPlatform: 'JOIN TRUCK RESCUE INDIA',
    useGps: 'Locate Me (GPS)',
    searchPlaceholder: 'Search by State, District, City, Highway or PIN Code...',
    allCategories: 'All Categories',
    withinKm: 'Within',
    filterOpen: 'Open Now',
    filter24x7: '24x7 Service',
    filterMobile: 'Mobile Roadside Van',
    filterVerified: 'Verified Only',
    callNow: 'Call Mechanic',
    whatsappChat: 'WhatsApp',
    getDirections: 'Directions',
    viewProfile: 'View Details',
    emergencyCharges: 'Emergency Charges',
    normalCharges: 'Normal Charges',
    serviceRadius: 'Service Radius',
    supportedBrands: 'Supported Truck Brands',
    diagnosticTools: 'Diagnostic & Scanner Tools',
    customerReviews: 'Customer Reviews',
    writeReview: 'Write a Review',
    statusOpen: 'OPEN NOW',
    statusClosed: 'CLOSED',
    verifiedBadge: 'VERIFIED GARAGE',
    pendingVerification: 'Verification Pending',
  },
  hi: {
    siteTitle: 'ट्रक रेस्क्यू इंडिया',
    siteTagline: '24x7 हाईवे इमरजेंसी सर्विस व हेवी ट्रक गैराज नेटवर्क',
    findNearby: 'नजदीकी मैकेनिक खोजें',
    emergencyHelp: 'आपातकालीन ट्रक सहायता',
    emergencyBanner: 'हाईवे पर गाड़ी खराब? तुरंत सहायता पाएं!',
    callHelpline: 'इमरजेंसी कॉल 24x7',
    driverLogin: 'ड्राइवर लॉगिन',
    garageLogin: 'गैराज लॉगिन',
    registerGarage: 'अपना गैराज रजिस्टर करें',
    joinPlatform: 'ट्रक रेस्क्यू इंडिया से जुड़ें',
    useGps: 'मेरी लोकेशन (GPS)',
    searchPlaceholder: 'राज्य, जिला, शहर, हाईवे या पिन कोड से खोजें...',
    allCategories: 'सभी सेवाएं',
    withinKm: 'दूरी दायरे में',
    filterOpen: 'अभी खुला है',
    filter24x7: '24x7 सेवा',
    filterMobile: 'मोबाइल रेस्क्यू वैन',
    filterVerified: 'वेरिफाइड गैराज',
    callNow: 'कॉल करें',
    whatsappChat: 'व्हाट्सएप',
    getDirections: 'रास्ता देखें (मैप)',
    viewProfile: 'पूरा विवरण देखें',
    emergencyCharges: 'इमरजेंसी चार्ज',
    normalCharges: 'सामान्य चार्ज',
    serviceRadius: 'सेवा दायरा',
    supportedBrands: 'सपोर्टेड ट्रक ब्रांड्स',
    diagnosticTools: 'स्कैनर व डायग्नोस्टिक टूल्स',
    customerReviews: 'ड्राइवर भाइयों की राय',
    writeReview: 'राय लिखें',
    statusOpen: 'अभी खुला है',
    statusClosed: 'बंद है',
    verifiedBadge: 'वेरिफाइड गैराज',
    pendingVerification: 'वेरिफिकेशन जारी है',
  },
  hinglish: {
    siteTitle: 'TRUCK RESCUE INDIA',
    siteTagline: '24x7 Highway Emergency & Heavy Commercial Garage Network',
    findNearby: 'Paas Wala Mechanic Dhoondhein',
    emergencyHelp: 'Emergency Truck Help',
    emergencyBanner: 'Gaadi Breakdown? Roadside Help Chahiye?',
    callHelpline: 'Toll-Free Emergency Call',
    driverLogin: 'Driver Login',
    garageLogin: 'Garage Login',
    registerGarage: 'Apna Garage Register Karein',
    joinPlatform: 'JOIN TRUCK RESCUE INDIA',
    useGps: 'Apna GPS On Karein',
    searchPlaceholder: 'City, Highway, Pincode ya Mechanic search karein...',
    allCategories: 'Sabhi Services',
    withinKm: 'Distance',
    filterOpen: 'Khula Hai',
    filter24x7: '24 Ghante Service',
    filterMobile: 'Mobile Gaadi Aayegi',
    filterVerified: 'Sirf Verified',
    callNow: 'Direct Call Karein',
    whatsappChat: 'WhatsApp Par Baat Karein',
    getDirections: 'Rasta / Maps',
    viewProfile: 'Profile Dekhein',
    emergencyCharges: 'Emergency Charges',
    normalCharges: 'Normal Rate',
    serviceRadius: 'Service Radius',
    supportedBrands: 'Gaadi Brands',
    diagnosticTools: 'Scanner Tools',
    customerReviews: 'Driver Reviews',
    writeReview: 'Review Dein',
    statusOpen: 'OPEN HAI',
    statusClosed: 'BAND HAI',
    verifiedBadge: 'VERIFIED GARAGE',
    pendingVerification: 'Verification Pending',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('truck_rescue_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'hinglish')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('truck_rescue_lang', newLang);
    }
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
