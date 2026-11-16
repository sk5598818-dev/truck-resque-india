'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import { searchNearbyGarages } from '@/lib/garageService';
import { Garage } from '@/lib/types';
import { TRUCK_BRANDS, VEHICLE_FUEL_TYPES } from '@/lib/constants';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Wrench, 
  ShieldAlert, 
  Loader2, 
  Truck, 
  Cpu, 
  Zap, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Siren,
  SlidersHorizontal,
  Flame,
  BatteryCharging
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: string;
  diagnosticData?: any;
  recommendedCategory?: string;
}

const COMMON_FAULT_CHIPS = [
  { label: 'SPN 3226 FMI 9', desc: 'Outlet NOx Sensor', category: 'SCR / AdBlue' },
  { label: 'SPN 4364 FMI 18', desc: 'SCR Catalyst Low Conversion', category: 'AdBlue' },
  { label: 'P20EE', desc: 'SCR NOx Efficiency Below Threshold', category: 'Emission' },
  { label: 'SPN 1761 FMI 1', desc: 'AdBlue Tank Level Low (Limp Mode)', category: 'Urea' },
  { label: 'P0087', desc: 'Fuel Rail Pressure Too Low', category: 'CRDI Fuel' },
  { label: 'SPN 639 FMI 9', desc: 'J1939 CAN Bus Communication Fault', category: 'Electrical' },
  { label: 'SPN 789 FMI 1', desc: 'Wabco ABS Wheel Speed Sensor Gap', category: 'ABS Brake' },
  { label: 'P0299', desc: 'Turbocharger Underboost / Hose Leak', category: 'Turbo' }
];

const LOCAL_STORAGE_CHAT_KEY = 'truck_rescue_ai_chat_v1';

export default function AiDiagnosticPage() {
  const { lang, setLang } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'hinglish'>('en');

  // Vehicle Selection State
  const [selectedBrand, setSelectedBrand] = useState<string>(TRUCK_BRANDS[0]);
  const [vehicleModel, setVehicleModel] = useState<string>('Signa 4825.TK 16-Wheeler');
  const [emissionType, setEmissionType] = useState<string>('BS6');
  const [ecuType, setEcuType] = useState<string>('Cummins ISBe / Bosch EDC17');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendedGarages, setRecommendedGarages] = useState<Garage[]>([]);
  const [loadingGarages, setLoadingGarages] = useState(false);

  // Voice Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with global language
  useEffect(() => {
    if (lang === 'hi' || lang === 'hinglish') {
      setSelectedLang(lang as any);
    }
  }, [lang]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // Initial greeting
        setMessages([
          {
            id: 'welcome_msg',
            role: 'assistant',
            content: `### 🚛 Namaste! I am your AI Heavy Commercial Vehicle Diagnostic Assistant
I can analyze heavy commercial truck fault codes, J1939 SPN/FMI parameters, OBD P-codes, AdBlue/SCR limp mode errors, and electrical harness wiring for **Tata Motors, Ashok Leyland, BharatBenz, Eicher, Mahindra, and Volvo**.

**How can I help you today?**
• Enter a fault code (e.g. *SPN 3226 FMI 9*, *P20EE*, *P0087*)  
• Describe a symptom (e.g. *Truck in 20 km/h limp mode*, *White smoke from silencer*, *Air pressure not building*)  
• Upload a photo of your scanner tablet or dashboard error lights  
• Tap the **Microphone** icon to speak in Hindi or English!`,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.warn('Failed to parse chat history:', e);
    }
  }, []);

  // Save chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(messages));
      } catch (e) {}
    }
  }, [messages]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Setup Web Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [selectedLang]);

  // Voice toggle
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome or mobile browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition start failed:', e);
        setIsListening(false);
      }
    }
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Send message to AI Diagnostic backend
  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!queryText && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: queryText,
      image: selectedImage || undefined,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
            image: m.image
          })),
          vehicleInfo: {
            brand: selectedBrand,
            model: vehicleModel,
            emission: emissionType,
            ecuType
          },
          faultCodeInput: queryText,
          language: selectedLang
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process diagnostic analysis.');
      }

      const assistantMessage: ChatMessage = {
        id: `resp_${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
        diagnosticData: data.diagnosticData,
        recommendedCategory: data.recommendedCategory
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Fetch nearby recommended mechanics matching this category
      if (data.recommendedCategory) {
        loadRecommendedGarages(data.recommendedCategory);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Diagnostic Processing Error:** ${err.message || 'Could not connect to AI diagnostic server.'}  
Please check your internet connection or describe the fault code manually.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedGarages = async (category: string) => {
    setLoadingGarages(true);
    try {
      const results = await searchNearbyGarages({
        category,
        radiusKm: 75,
        verifiedOnly: false
      });
      setRecommendedGarages(results.slice(0, 3));
    } catch (e) {
      console.warn('Failed to load recommended garages:', e);
    } finally {
      setLoadingGarages(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear diagnostic conversation history?')) {
      localStorage.removeItem(LOCAL_STORAGE_CHAT_KEY);
      setMessages([
        {
          id: 'welcome_reset',
          role: 'assistant',
          content: '### 🚛 Diagnostic Session Reset\nEnter a new fault code, symptom, or upload a photo to begin inspection.',
          timestamp: new Date().toISOString()
        }
      ]);
      setRecommendedGarages([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col space-y-4">
        
        {/* HEADER BAR */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-zinc-900 border border-blue-500/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg border border-blue-300">
              <Bot className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  AI Commercial Vehicle Diagnostic v4.0
                </span>
                <span className="text-zinc-500 text-xs hidden sm:inline">• J1939 / OBD-II / SCR</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                AI Heavy Truck Diagnostic Assistant
              </h1>
              <p className="text-zinc-300 text-xs">
                Tata, Ashok Leyland, BharatBenz, Eicher, Cummins, Bosch & Wabco Fault Analysis
              </p>
            </div>
          </div>

          {/* Language Switcher & Controls */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedLang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hi')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedLang === 'hi' ? 'bg-orange-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hinglish')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedLang === 'hinglish' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Hinglish
              </button>
            </div>

            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* VEHICLE PROFILE ACCORDION / BAR */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Truck className="w-4 h-4 text-amber-500" />
              <span className="text-zinc-400">Inspecting Truck:</span>
              <span className="font-bold text-white bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                {selectedBrand} • {vehicleModel} • {emissionType}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>{showVehicleSelector ? 'Hide Specs' : 'Change Truck Model'}</span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {showVehicleSelector && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 mt-3 border-t border-zinc-800 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Truck Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {TRUCK_BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                  <option value="Volvo Commercial">Volvo Commercial</option>
                  <option value="Scania Heavy Duty">Scania Heavy Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Model / Gross Tonnage</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Signa 4825.TK, AVTR 5525"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Emission Norm</label>
                <select
                  value={emissionType}
                  onChange={(e) => setEmissionType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {VEHICLE_FUEL_TYPES.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">ECU / Engine Architecture</label>
                <input
                  type="text"
                  value={ecuType}
                  onChange={(e) => setEcuType(e.target.value)}
                  placeholder="e.g. Cummins ISBe, Bosch EDC17"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* COMMON FAULT CODE CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Quick Diagnostic:
          </span>
          {COMMON_FAULT_CHIPS.map(chip => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleSendMessage(`Analyze fault code: ${chip.label} (${chip.desc})`)}
              className="bg-zinc-900 hover:bg-blue-950/60 text-zinc-300 hover:text-blue-300 border border-zinc-800 hover:border-blue-500/40 px-3 py-1.5 rounded-xl font-medium shrink-0 transition flex items-center gap-1.5 shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>{chip.label}</span>
              <span className="text-[10px] text-zinc-500 hidden sm:inline">({chip.desc})</span>
            </button>
          ))}
        </div>

        {/* CHAT MESSAGES DISPLAY */}
        <div className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[420px] max-h-[620px] shadow-inner">
          {messages.map(msg => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow border border-blue-400">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-2xl w-full rounded-2xl p-4 sm:p-5 shadow-lg ${
                  isUser 
                    ? 'bg-blue-600 text-white ml-auto' 
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                }`}>
                  {/* Uploaded Image Preview */}
                  {msg.image && (
                    <div className="mb-3 max-w-sm rounded-xl overflow-hidden border border-zinc-700">
                      <img src={msg.image} alt="User Uploaded Scanner / Part" className="w-full h-auto object-cover max-h-56" />
                    </div>
                  )}

                  {/* Formatted Markdown Content */}
                  <div className="prose prose-invert prose-sm max-w-none space-y-3 leading-relaxed">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return <h3 key={pIdx} className="text-base sm:text-lg font-black text-yellow-300 mt-2">{paragraph.replace('### ', '')}</h3>;
                      }
                      if (paragraph.startsWith('**') && paragraph.includes(':')) {
                        return <p key={pIdx} className="font-semibold text-white">{paragraph}</p>;
                      }
                      if (paragraph.startsWith('> ⚠️')) {
                        return (
                          <div key={pIdx} className="p-3 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs">
                            {paragraph.replace('> ', '')}
                          </div>
                        );
                      }
                      return <p key={pIdx} className="text-xs sm:text-sm text-zinc-300">{paragraph}</p>;
                    })}
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-zinc-500 mt-3 flex items-center justify-between">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!isUser && msg.diagnosticData?.confidence && (
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-400 font-bold border border-emerald-500/30">
                        Confidence: {msg.diagnosticData.confidence}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-blue-400 bg-zinc-900 p-3 rounded-xl max-w-sm border border-zinc-800 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing fault telemetry & sensor pinouts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* RECOMMENDED REPAIR PARTNERS & ROADSIDE HELP */}
        {recommendedGarages.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Nearby Verified Specialists for This Issue
                </h3>
              </div>
              <Link
                href="/emergency/new"
                className="inline-flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-extrabold px-3 py-1.5 rounded-xl shadow animate-pulse"
              >
                <Siren className="w-3.5 h-3.5" />
                <span>Launch Roadside SOS</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {recommendedGarages.map(g => (
                <div key={g.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between text-xs space-y-2">
                  <div>
                    <h4 className="font-bold text-white text-sm truncate">{g.garageName}</h4>
                    <p className="text-zinc-400 text-[11px]">{g.city}, {g.state}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {g.twentyFourHours && <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">24x7</span>}
                      {g.mobileService && <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded">Roadside Van</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800">
                    <a
                      href={`tel:${g.phone}`}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${g.whatsapp?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-1.5 px-2 rounded-lg text-center flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INPUT COMPOSER BAR */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl">
          {/* Selected Image Thumbnail preview */}
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-blue-500">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 shadow"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Image Upload Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
              title="Upload scanner photo, warning light, or wiring"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition ${
                isListening
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400 border-zinc-800'
              }`}
              title={isListening ? 'Listening (Click to stop)...' : 'Speak in Hindi or English'}
            >
              {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : selectedLang === 'hi'
                  ? 'फाल्ट कोड या लक्षण लिखें (उदा. SPN 3226 FMI 9, यूरिया प्रेशर)...'
                  : 'Enter fault code or symptom (e.g. SPN 3226 FMI 9, P20EE, limp mode)...'
              }
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={loading || (!inputValue.trim() && !selectedImage)}
              className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl transition shadow-lg flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 px-1">
            <span>Voice & image supported • J1939 commercial protocol</span>
            <span className="text-zinc-400">Professional diagnostic tool for Indian truckers</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
