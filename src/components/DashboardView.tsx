/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, MapPin, Sparkles, Calendar, DollarSign, Clock, Users,
  Send, Globe, Trash2, Printer, Share2, MessageSquare, ChevronRight,
  ShieldCheck, AlertTriangle, Eye, RefreshCw, BarChart2, Briefcase,
  Layers, Smile, Plane, ShieldAlert, Star, Hotel, Utensils, Check
} from 'lucide-react';
import { 
  User, RecommendedDestination, SavedTrip, ChatMessage, AdminAnalytics, TripPreferences,
  VibePreference, CompanionPreference, BudgetPreference, DurationPreference, TransportPreference, WeatherPreference
} from '../types';

interface DashboardViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export default function DashboardView({ currentUser, onNavigate }: DashboardViewProps) {
  // Navigation tabs in workspace: 'planner' | 'saved' | 'chat' | 'admin'
  const [activeTab, setActiveTab] = useState<'planner' | 'saved' | 'chat' | 'admin'>(
    currentUser.role === 'admin' ? 'admin' : 'planner'
  );

  // Wizard preferences
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [region, setRegion] = useState<'India' | 'Abroad'>('India');
  const [companion, setCompanion] = useState<CompanionPreference>('Solo');
  const [selectedVibes, setSelectedVibes] = useState<VibePreference[]>(['Adventure']);
  const [budget, setBudget] = useState<BudgetPreference>('Standard');
  const [duration, setDuration] = useState<DurationPreference>('5 Days');
  const [transport, setTransport] = useState<TransportPreference>('Flight');
  const [weather, setWeather] = useState<WeatherPreference>('Moderate');

  // Generated recommendation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [activeResult, setActiveResult] = useState<RecommendedDestination | null>(null);
  const [showShareConfirm, setShowShareConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // History & saved plans
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [savedIsLoading, setSavedIsLoading] = useState(false);

  // Chatbot states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Admin section states
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [adminIsLoading, setAdminIsLoading] = useState(false);

  // Load user saved itineraries
  const fetchSavedItineraries = async () => {
    setSavedIsLoading(true);
    try {
      const response = await fetch(`/api/trips/user/${currentUser.id}`);
      const data = await response.json();
      setSavedTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSavedIsLoading(false);
    }
  };

  // Load Admin Data
  const fetchAdminData = async () => {
    if (currentUser.role !== 'admin') return;
    setAdminIsLoading(true);
    try {
      // Fetch stats
      const graphRes = await fetch('/api/admin/analytics');
      const graphData = await graphRes.json();
      setAnalytics(graphData);

      // Fetch users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setAdminIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedItineraries();
    if (currentUser.role === 'admin') {
      fetchAdminData();
    }
  }, [currentUser, activeTab]);

  // Handle active chatbot scrolling
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleVibe = (v: VibePreference) => {
    if (selectedVibes.includes(v)) {
      setSelectedVibes(selectedVibes.filter(item => item !== v));
    } else {
      setSelectedVibes([...selectedVibes, v]);
    }
  };

  // Trigger Planner Engine
  const handleGenerateTrip = async () => {
    setIsGenerating(true);
    setActiveResult(null);

    // Dynamic luxurious loaders to boost high-end UX
    const loaderPrompts = [
      'Scanning flight corridors and rail routes with transportation grids...',
      'Mapping climate trends, daily weather logs, and safety dossiers...',
      'Matching travel companions with authentic micro-vibe clusters...',
      'Vetting luxury boutique hotels, homestays, and resort inventories...',
      'Aggregating local gourmet delicacies and verified dining reviews...',
      'Custom compiling your day-by-day complete holiday itinerary...'
    ];

    let pIdx = 0;
    setLoadingStepText(loaderPrompts[0]);
    const promptTimer = setInterval(() => {
      pIdx = (pIdx + 1) % loaderPrompts.length;
      setLoadingStepText(loaderPrompts[pIdx]);
    }, 2000);

    try {
      const payload = {
        region,
        companion,
        vibes: selectedVibes,
        budget,
        duration,
        transport,
        weather
      };

      const response = await fetch('/api/trips/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success && data.destination) {
        setActiveResult(data.destination);
        // Pre-populate chat assistant with greeting context
        setChatMessages([
          {
            id: 'chat-init',
            sender: 'assistant',
            content: `Greetings! I am your premium local guide for **${data.destination.name}, ${data.destination.country}**. Let me answer any questions about hidden sights, luggage lists, or local dining secrets!`,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
      } else {
        alert('We faced an execution error inside our travel server models. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network tunnel configuration failure.');
    } finally {
      clearInterval(promptTimer);
      setIsGenerating(false);
    }
  };

  // Save trip to database
  const handleSaveTrip = async () => {
    if (!activeResult) return;
    setSaveStatus('Saving...');
    try {
      const response = await fetch('/api/trips/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          preferences: { region, companion, vibes: selectedVibes, budget, duration, transport, weather },
          destination: activeResult
        })
      });
      const data = await response.json();
      if (data.success) {
        setSaveStatus('✓ Saved!');
        fetchSavedItineraries();
        setTimeout(() => setSaveStatus(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('Failed to save.');
    }
  };

  // Share Static Link Mimic
  const handleShareTrip = () => {
    const mockShareLink = `${window.location.origin}/share/trip?id=trip-${Date.now()}`;
    navigator.clipboard.writeText(mockShareLink);
    setShowShareConfirm(true);
    setTimeout(() => setShowShareConfirm(false), 2500);
  };

  // Trigger Local PDF Print Format
  const handlePrintTrip = () => {
    window.print();
  };

  // Delete Trip from list
  const handleDeleteTrip = async (id: string) => {
    if (!confirm('Are you certain you wish to delete this saved plan?')) return;
    try {
      const res = await fetch(`/api/trips/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSavedItineraries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Chat assistant query dispatcher
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      sender: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatIsLoading(true);

    try {
      const context = activeResult ? {
        destinationName: activeResult.name,
        companion,
        vibe: selectedVibes.join(', ')
      } : {};

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          ...context
        })
      });

      const data = await response.json();
      const assistMsg: ChatMessage = {
        id: 'chat-as-' + Date.now(),
        sender: 'assistant',
        content: data.response || 'Apologies, my satellite communication link timed out.',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, assistMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatIsLoading(false);
    }
  };

  // Delete User from Admin Dashboard
  const handleDeleteUser = async (uId: string) => {
    if (uId === currentUser.id) {
      alert('You cannot delete your own session.');
      return;
    }
    if (!confirm('Proceed to remove this traveler database entirely?')) return;
    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uId })
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-10 font-sans print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Workspace banner tabs - Hidden during dynamic print layouts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 print:hidden">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-tight">
              Concierge Workspace
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Role: <strong className="text-amber-500">{currentUser.role === 'admin' ? 'ROOT_SYS_ADMIN' : 'VIP_EXPLORER'}</strong> • Verified User ID: {currentUser.fullName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-zinc-900 p-1 border border-zinc-850 rounded-xl">
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'admin' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
                id="tab-admin"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('planner')}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'planner' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
              id="tab-planner"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Plan Wizard</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 relative ${
                activeTab === 'saved' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
              id="tab-saved"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Saved Journeys</span>
              {savedTrips.length > 0 && (
                <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 bg-amber-500 text-black font-extrabold text-[9px] rounded-full">
                  {savedTrips.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors flex items-center space-x-1.5 ${
                activeTab === 'chat' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
              id="tab-chat"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Travel AI Chat</span>
            </button>
          </div>
        </div>

        {/* =======================================================
            TAB 1: AI PLANNER WIZARD BUILDER
            ======================================================= */}
        {activeTab === 'planner' && !activeResult && !isGenerating && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
            {/* Step Left Block */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6 lg:col-span-2">
              {/* Step indicator header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">Step {step} of 4</span>
                <span className="text-xs text-zinc-500 font-mono">Preferences Compiler</span>
              </div>

              {/* STEP 1: INDIA OR ABROAD */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif">Where do you want to explore?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* India Card */}
                    <div
                      onClick={() => setRegion('India')}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border relative h-64 transition-all duration-300 ${
                        region === 'India' 
                          ? 'border-amber-500 scale-[1.01] shadow-lg shadow-amber-500/10' 
                          : 'border-zinc-800 hover:border-zinc-700/80'
                      }`}
                      id="opt-region-india"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src="https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=500"
                        alt="India landscapes"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        <h4 className="text-md font-bold font-serif text-white flex items-center space-x-1.5">
                          <Plane className="w-4.5 h-4.5 text-amber-500" />
                          <span>INDIA HOLIDAYS</span>
                        </h4>
                        <p className="text-[11px] text-zinc-350 leading-relaxed font-sans">
                          Explore regal lakeside fortresses, cold mystical valleys, and tropical backwaters.
                        </p>
                      </div>
                    </div>

                    {/* Abroad Card */}
                    <div
                      onClick={() => setRegion('Abroad')}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border relative h-64 transition-all duration-300 ${
                        region === 'Abroad' 
                          ? 'border-amber-500 scale-[1.01] shadow-lg shadow-amber-500/10' 
                          : 'border-zinc-800 hover:border-zinc-700/80'
                      }`}
                      id="opt-region-abroad"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=500"
                        alt="Abroad landscapes"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
                      <div className="absolute bottom-5 left-5 right-5 space-y-1">
                        <h4 className="text-md font-bold font-serif text-white flex items-center space-x-1.5">
                          <Globe className="w-4.5 h-4.5 text-amber-500" />
                          <span>ABROAD ADVENTURES</span>
                        </h4>
                        <p className="text-[11px] text-zinc-350 leading-relaxed font-sans">
                          Glide through silent bamboo shrines, paraglide over glaciers, or cruise the Seine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: WHO ARE YOU TRAVELING WITH */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif">Who are you traveling with?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {([
                      { id: 'Solo', label: 'Solo', icon: '👤', desc: 'Inner silent path' },
                      { id: 'Couple', label: 'Couple', icon: '❤️', desc: 'Romantic escape' },
                      { id: 'Family', label: 'Family entourage', icon: '👨‍👩‍👧‍👦', desc: 'Multigen bond' },
                      { id: 'Friends', label: 'Friends team', icon: '🎒', desc: 'Wild laugh tracks' },
                      { id: 'Honeymoon', label: 'Honeymoon Special', icon: '💍', desc: 'Extreme romance' },
                      { id: 'Business', label: 'Business Retreat', icon: '💼', desc: 'Focus & corporate' },
                      { id: 'Senior Citizens', label: 'Senior Citizens', icon: '👴🏼', desc: 'Leisured pacing' },
                      { id: 'Adventure Group', label: 'Adventure Group', icon: '🧗', desc: 'Glacial trails' }
                    ] as { id: CompanionPreference; label: string; icon: string; desc: string }[]).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCompanion(item.id)}
                        className={`cursor-pointer bg-zinc-950 p-5 rounded-2xl border text-center space-y-2 transition-all duration-200 ${
                          companion === item.id 
                            ? 'border-amber-500 bg-amber-500/5 text-amber-500' 
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                        id={`opt-companion-${item.id.replace(/\s+/g, '-')}`}
                      >
                        <span className="text-3xl block">{item.icon}</span>
                        <h5 className="text-xs font-bold font-sans uppercase tracking-tight">{item.label}</h5>
                        <p className="text-[9px] text-zinc-550 leading-none">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: CHOOSE YOUR VIBE */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif">Choose your micro-vibes</h3>
                    <p className="text-xs text-zinc-500">You can select multiple preferences to tailor matching ratios.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {([
                      'Spiritual', 'Romantic', 'Adventure', 'Luxury', 'Peaceful',
                      'Culture', 'Nature', 'Wildlife', 'Food', 'Beach', 'Mountains', 'Party', 'Wellness'
                    ] as VibePreference[]).map((v) => (
                      <div
                        key={v}
                        onClick={() => toggleVibe(v)}
                        className={`cursor-pointer p-4 rounded-xl border text-center text-xs font-mono transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                          selectedVibes.includes(v)
                            ? 'bg-amber-500 text-black border-amber-500 font-bold'
                            : 'bg-zinc-950 text-zinc-350 border-zinc-850 hover:border-zinc-750'
                        }`}
                        id={`opt-vibe-${v}`}
                      >
                        {selectedVibes.includes(v) && <Check className="w-3.5 h-3.5" />}
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: TRIP PREFERENCES */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-serif">Configure trip parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
                    {/* Budget */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Wallet Budget Tier</label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {['Budget', 'Standard', 'Premium', 'Luxury'].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b as BudgetPreference)}
                            className={`p-3 rounded-xl border transition-all ${
                              budget === b ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Trip Length</label>
                      <select
                        className="w-full bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value as DurationPreference)}
                      >
                        <option value="Weekend">Weekend Short trip</option>
                        <option value="3 Days">3 Days Exploration</option>
                        <option value="5 Days">5 Days Standard Vacation</option>
                        <option value="7 Days">7 Days Deep Discovery</option>
                        <option value="10+ Days">10+ Days Ultimate Expedition</option>
                      </select>
                    </div>

                    {/* Transportation */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Preferred Transport</label>
                      <select
                        className="w-full bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={transport}
                        onChange={(e) => setTransport(e.target.value as TransportPreference)}
                      >
                        <option value="Flight">Flight VIP Carrier</option>
                        <option value="Train">Heritage Train / Rails</option>
                        <option value="Road Trip">Private Chauffeur Road Trip</option>
                        <option value="Bus">Standard Tourist Coach</option>
                      </select>
                    </div>

                    {/* Weather */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Climate Vibe Preferred</label>
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        {['Cold', 'Moderate', 'Warm'].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setWeather(w as WeatherPreference)}
                            className={`p-3 rounded-xl border transition-all ${
                              weather === w ? 'bg-amber-500 text-black border-amber-500 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard navigation footer buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-5 py-2.5 rounded-lg border border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-500 text-xs font-mono uppercase tracking-tight transition-colors disabled:opacity-40"
                  id="wizard-prev-btn"
                >
                  Back Step
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev + 1) as any)}
                    className="bg-amber-500 hover:bg-amber-600 px-6 py-2.5 rounded-lg text-black text-xs font-mono uppercase tracking-tight font-bold flex items-center space-x-1"
                    id="wizard-next-btn"
                  >
                    <span>Proceed Forward</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateTrip}
                    className="bg-amber-500 hover:bg-amber-600 px-6 py-2.5 rounded-lg text-black text-xs font-mono uppercase tracking-widest font-extrabold flex items-center space-x-1 shadow-lg shadow-amber-500/20"
                    id="wizard-generate-btn"
                  >
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                    <span>Generate AI Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step Right Instructions Panel */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl space-y-4">
                <h4 className="font-serif text-md font-bold">Selected compilation</h4>
                
                <div className="space-y-3.5 text-xs font-sans">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Region preference:</span>
                    <span className="text-amber-500 font-mono font-medium">{region}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Companions entourage:</span>
                    <span className="text-zinc-300 font-medium">{companion}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-500 block">Identified Vibes:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedVibes.map(v => (
                        <span key={v} className="bg-zinc-950 border border-zinc-850 text-zinc-450 px-2 py-0.5 rounded text-[10px] font-mono">{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Cost pocket tier:</span>
                    <span className="text-zinc-300 font-mono font-medium">{budget}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Trip Length:</span>
                    <span className="text-zinc-300 font-mono font-medium">{duration}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-mono text-amber-500 flex items-start space-x-2">
                  <ShieldCheck className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <span>The machine planner aggregates real-time satellite maps, weather radars, and luxury dining tables dynamically. Never uses outdated indexes.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            SPECIAL CASE: LUXURY AI ACTION LOADER SCREEN
            ======================================================= */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 px-4 space-y-6 text-center animate-pulse print:hidden">
            <div className="relative h-20 w-20">
              <Compass className="absolute inset-0 h-full w-full text-amber-500 animate-spin" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-serif font-bold tracking-tight">Tailoring Bespoke Journey...</h3>
              <p className="text-[11px] font-mono text-zinc-500 leading-normal lowercase tracking-wide block">
                {loadingStepText}
              </p>
            </div>

            <div className="w-full max-w-xs bg-zinc-900 border border-zinc-850 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-1/2 rounded-full animate-marquee" />
            </div>
          </div>
        )}

        {/* =======================================================
            RECOMMENDED DESTINATION DETAIL RESULTS VIEW
            ======================================================= */}
        {activeResult && (
          <div className="space-y-10 animate-fade-in print:bg-white print:text-black">
            
            {/* Quick action buttons row - Hidden during print */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 print:hidden">
              <button
                onClick={() => { setActiveResult(null); setStep(1); }}
                className="text-xs font-mono text-zinc-400 hover:text-white"
                id="back-to-wizard-btn"
              >
                ← Clear and start plan again
              </button>

              <div className="flex items-center space-x-3.5">
                {showShareConfirm && (
                  <span className="text-xs text-amber-500 font-mono animate-fade-in">✓ Share Link copied!</span>
                )}
                
                <button
                  onClick={handleSaveTrip}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-xs px-4 py-2 rounded-xl flex items-center space-x-1"
                  id="action-save-trip"
                >
                  <span>{saveStatus || 'Save Itinerary'}</span>
                </button>

                <button
                  onClick={handleShareTrip}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-mono text-xs px-4 py-2 rounded-xl flex items-center space-x-1"
                  id="action-share-trip"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handlePrintTrip}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1"
                  id="action-print-trip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Editorial Title Banner */}
            <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                referrerPolicy="no-referrer"
                src={activeResult.imageUrl}
                alt={activeResult.name}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 space-y-2 max-w-2xl">
                <span className="bg-amber-500 text-black text-xs font-mono font-bold px-3 py-1 rounded-full uppercase">
                  {activeResult.matchPercentage}% AI Vibe Score Match
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-none">
                  {activeResult.name}, <span className="text-zinc-300">{activeResult.country}</span>
                </h1>
                <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed font-sans font-medium">
                  {activeResult.reasonForRecommendation}
                </p>
              </div>
            </div>

            {/* Local Information Index Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-550 block">Best Season Visit</span>
                <span className="text-xs text-amber-500 font-bold">{activeResult.bestSeason}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-550 block">Climate Radar</span>
                <span className="text-xs text-zinc-300 font-bold">{activeResult.weatherForecast}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-550 block">Spoken Languages</span>
                <span className="text-xs text-zinc-300 font-bold">{activeResult.localLanguage}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-zinc-550 block">Region Currency</span>
                <span className="text-xs text-zinc-300 font-bold font-mono">{activeResult.currency}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl text-center space-y-1 col-span-2 md:col-span-1">
                <span className="text-[10px] uppercase font-mono text-zinc-550 block">Visa Guidelines</span>
                <span className="text-xs text-zinc-300 font-bold">{activeResult.visaInformation}</span>
              </div>
            </div>

            {/* Overview & Safety Guidelines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-2xl p-6 sm:p-8 md:col-span-2 space-y-3">
                <h3 className="font-serif text-lg font-bold">Immersive Destination Overview</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {activeResult.overview}
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-rose-500">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h4 className="font-serif text-md font-bold text-white">Traveler Safety Dossier</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {activeResult.safetyInfo}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 text-[10px] font-mono text-zinc-600">
                  MONITORED REAL-TIME FROM SATELLITE LINKS
                </div>
              </div>
            </div>

            {/* Attractions Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <MapPin className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-xl font-bold">Dynamic Sights & Viewpoints</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {activeResult.attractions && activeResult.attractions.map((att, idx) => (
                  <div key={idx} className="group bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 duration-300">
                    <div className="h-44 bg-zinc-900 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={att.imageUrl || 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=500'}
                        alt={att.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-4 right-4 bg-amber-500 text-black font-mono font-bold text-xs px-2 py-0.5 rounded flex items-center space-x-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{att.rating}</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3.5">
                      <div>
                        <h4 className="font-bold text-white font-sans text-sm line-clamp-1">{att.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-550 block mt-0.5">{att.distance}</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                        {att.description}
                      </p>
                      <hr className="border-zinc-950/60" />
                      <div className="grid grid-cols-2 text-[10px] font-mono text-zinc-500">
                        <div>
                          <p className="uppercase text-[9px] text-zinc-600">Hours</p>
                          <p className="mt-0.5">{att.timings}</p>
                        </div>
                        <div>
                          <p className="uppercase text-[9px] text-zinc-600">Entry Rates</p>
                          <p className="mt-0.5 text-amber-500 font-medium">{att.entryFee}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotel Recommendations Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Hotel className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-xl font-bold">Luxury Suite & Resort Vettings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeResult.hotels && activeResult.hotels.map((hot, idx) => (
                  <div key={idx} className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 flex flex-col sm:flex-row duration-300">
                    <div className="w-full sm:w-1/3 h-48 sm:h-full bg-zinc-900 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={hot.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=500'}
                        alt={hot.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white font-sans text-sm line-clamp-1">{hot.name}</h4>
                          <span className="text-xs text-amber-500 font-mono font-bold shrink-0">{hot.price}</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-sans leading-relaxed">{hot.locationDesc}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {hot.amenities && hot.amenities.map(a => (
                          <span key={a} className="bg-zinc-950 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded text-[9px] font-mono">{a}</span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-950 flex items-center justify-between text-[10px] font-mono text-zinc-650">
                        <span>Accredited Resort Class</span>
                        <span className="text-amber-500 flex items-center space-x-0.5 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>{hot.rating} ({hot.reviewsCount} reviews)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gourmet Food Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Utensils className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-xl font-bold">Gastronomic Local Discoveries</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeResult.foods && activeResult.foods.map((food, idx) => (
                  <div key={idx} className="bg-zinc-900/30 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 flex flex-col sm:flex-row duration-300">
                    <div className="w-full sm:w-1/3 h-48 sm:h-full bg-zinc-900 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500'}
                        alt={food.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white font-sans text-sm font-bold line-clamp-1">{food.name}</h4>
                          <span className="text-[10px] text-amber-500 font-mono bg-amber-500/15 px-2 py-0.5 rounded shrink-0">{food.priceRange}</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-sans leading-relaxed">{food.description}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-zinc-550 block uppercase">Recommended Gourmet Bistro list</span>
                        <div className="flex flex-wrap gap-1">
                          {food.recommendedRestaurants && food.recommendedRestaurants.map(r => (
                            <span key={r} className="bg-zinc-950 text-zinc-400 border border-zinc-850 px-2.5 py-0.5 rounded text-[9px] font-sans">{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Day-by-day Itinerary Grid */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif text-xl font-bold">AI Day-by-Day Journey Itinerary Plans</h3>
              </div>

              <div className="space-y-8 font-sans">
                {activeResult.itinerary && activeResult.itinerary.map((day) => (
                  <div key={day.dayNumber} className="border-l-2 border-amber-500 pl-6 sm:pl-10 space-y-5 relative">
                    {/* Day circle */}
                    <div className="absolute top-0 -left-3 h-5.5 w-5.5 bg-amber-500 text-black text-[10px] font-mono font-extrabold rounded-full flex items-center justify-center border-4 border-zinc-950">
                      {day.dayNumber}
                    </div>

                    {/* Day Header */}
                    <div>
                      <h4 className="text-lg font-bold">Itinerary Route: Day {day.dayNumber}</h4>
                      <div className="flex items-center space-x-4 text-[10px] font-mono text-zinc-500 mt-0.5">
                        <span>Total Road Cover: {day.totalDistanceCovered}</span>
                        <span>•</span>
                        <span>Optimized for {transport} Travel</span>
                      </div>
                    </div>

                    {/* Timeline morning, afternoon, evening cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Morning card */}
                      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800 pb-1.5">
                          <span>🌄 Morning 08:30 AM</span>
                          <span>{day.morning.duration}</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed">{day.morning.activity}</p>
                        <p className="text-[10px] font-mono text-amber-500 uppercase">Cost: {day.morning.cost}</p>
                      </div>

                      {/* Afternoon card */}
                      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800 pb-1.5">
                          <span>☀️ Afternoon 01:00 PM</span>
                          <span>{day.afternoon.duration}</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed">{day.afternoon.activity}</p>
                        <p className="text-[10px] font-mono text-amber-500 uppercase">Cost: {day.afternoon.cost}</p>
                      </div>

                      {/* Evening card */}
                      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800 pb-1.5">
                          <span>🌌 Evening 06:00 PM</span>
                          <span>{day.evening.duration}</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed">{day.evening.activity}</p>
                        <p className="text-[10px] font-mono text-amber-500 uppercase">Cost: {day.evening.cost}</p>
                      </div>
                    </div>

                    {/* Pro tip box */}
                    <div className="p-4 bg-zinc-900/60 border border-zinc-850 rounded-xl text-xs text-zinc-400 leading-normal flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Concierge Pro Advice:</strong> {day.dailyAdvice}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating quick chat access banner - Hidden print */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
              <div className="space-y-1">
                <h4 className="font-serif text-md font-bold">Have questions regarding this Itinerary plan?</h4>
                <p className="text-xs text-zinc-400">Launch our integrated TravelAI chat assistant below to consult packing details or landmarks safety!</p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wide shrink-0 transition-colors"
              >
                Launch AI Chat Consults
              </button>
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 2: SAVED TRIP ARCHIVES
            ======================================================= */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-fade-in print:hidden">
            <h3 className="font-serif text-xl font-bold">Your Saved Bespoke Travel archives</h3>
            
            {savedIsLoading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 text-amber-500 mx-auto animate-spin" />
                <p className="text-xs text-zinc-500 mt-2 font-mono">Loading itinerary catalog database...</p>
              </div>
            ) : savedTrips.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-zinc-850 rounded-3xl space-y-4">
                <Calendar className="w-8 h-8 text-zinc-500 mx-auto animate-pulse" />
                <h4 className="text-md font-bold">Bespoke catalog is empty</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Launch the AI Match wizard planner, state your preferences vibes, generate plans and save them securely inside your login.
                </p>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="bg-amber-500 text-black text-xs font-mono font-bold px-4 py-2.5 rounded-lg uppercase"
                >
                  Start Planner Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedTrips.map((val) => (
                  <div key={val.id} className="bg-zinc-900 border border-zinc-850 rounded-3xl overflow-hidden hover:border-zinc-800 duration-350 flex flex-col justify-between">
                    <div className="h-44 bg-zinc-950 relative">
                      <img
                        referrerPolicy="no-referrer"
                        src={val.destination.imageUrl}
                        alt={val.destination.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <button
                        onClick={() => handleDeleteTrip(val.id)}
                        className="absolute top-4 right-4 bg-black/60 p-2 text-rose-400 hover:text-rose-500 rounded-lg transition-colors border border-rose-500/20"
                        title="Delete itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-lg font-serif font-bold">{val.destination.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-550 block">{val.destination.country} • Saved {new Date(val.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {val.preferences && val.preferences.vibes && val.preferences.vibes.map(v => (
                          <span key={v} className="bg-zinc-950 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded text-[8px] font-mono uppercase">{v}</span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setRegion(val.preferences.region);
                          setCompanion(val.preferences.companion);
                          setSelectedVibes(val.preferences.vibes);
                          setBudget(val.preferences.budget);
                          setDuration(val.preferences.duration);
                          setTransport(val.preferences.transport);
                          setWeather(val.preferences.weather);
                          
                          setActiveResult(val.destination);
                          setActiveTab('planner');
                        }}
                        className="w-full bg-zinc-950 border border-zinc-850 hover:bg-amber-500 hover:text-black font-mono text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1"
                        id={`load-trip-${val.id}`}
                      >
                        <Eye className="w-4 h-4 shrink-0" />
                        <span>Load Active Workspace</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAB 3: AI TRAVEL ASSISTANT CHAT PANEL
            ======================================================= */}
        {activeTab === 'chat' && (
          <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-4 sm:p-6 max-w-3xl mx-auto h-[70vh] flex flex-col justify-between print:hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                <div>
                  <h3 className="font-serif text-md font-bold">Private Conciege Assistant</h3>
                  {activeResult ? (
                    <p className="text-[10px] tracking-tight text-zinc-500">Active context: <strong className="text-amber-500">{activeResult.name}, {activeResult.country}</strong></p>
                  ) : (
                    <p className="text-[10px] tracking-tight text-zinc-500">General global travel expert active</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setChatMessages([])}
                className="text-[10px] font-mono text-zinc-500 hover:text-white"
              >
                Reset thread
              </button>
            </div>

            {/* Message threads list */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[50vh]">
              {chatMessages.length === 0 && (
                <div className="text-center py-16 space-y-3">
                  <Compass className="w-10 h-10 text-amber-500 mx-auto animate-spin-slow" />
                  <h4 className="text-sm font-bold">Ask anything about your destination!</h4>
                  <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                    "Is this destination safe for solo travelers?", "What should I pack?", "Any hidden gems?" or "Top 3 romantic restaurants nearby?"
                  </p>
                </div>
              )}

              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-black font-semibold rounded-br-none'
                      : 'bg-zinc-950 border border-zinc-850 text-zinc-350 rounded-bl-none'
                  }`}>
                    {msg.content}
                    <span className="block text-[8px] opacity-40 text-right mt-1.5 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {chatIsLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-950 border border-zinc-850 text-zinc-500 p-4 rounded-2xl rounded-bl-none text-xs flex items-center space-x-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Travel Concierge is typing rules...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat submit footer */}
            <form onSubmit={handleChatSubmit} className="flex gap-2.5 mt-4 border-t border-zinc-800 pt-4">
              <input
                type="text"
                placeholder="Ask about packing rules, hidden spots, weather dress checks..."
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                id="chatbot-input"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-black px-5 rounded-xl flex items-center justify-center transition-colors"
                id="chatbot-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* =======================================================
            TAB 4: REVENUE, SUBSCRIPTIONS & ADMIN CONTROL PANEL
            ======================================================= */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-8 animate-fade-in print:hidden">
            
            {/* Stats row */}
            {adminIsLoading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mx-auto" />
                <p className="text-xs text-zinc-500 mt-2">Connecting Admin analytics terminal databases...</p>
              </div>
            ) : analytics ? (
              <div className="space-y-8">
                {/* Micro Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase">Total User base</span>
                    <span className="text-3xl font-serif font-bold block text-white">{analytics.totalUsers}</span>
                    <p className="text-[9px] text-emerald-500">✓ Fully synced database</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase">itineraries compile</span>
                    <span className="text-3xl font-serif font-bold block text-white">{analytics.totalTripsGenerated}</span>
                    <p className="text-[9px] text-amber-500">✓ Real-time generated</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase">active sessions</span>
                    <span className="text-3xl font-serif font-bold block text-white">{analytics.activeSessions}</span>
                    <p className="text-[9px] text-zinc-500">Node API live</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-zinc-550 uppercase">AI Token limits</span>
                    <span className="text-3xl font-serif font-bold block text-white">99.8%</span>
                    <p className="text-[9px] text-emerald-500">Sufficient allowances</p>
                  </div>
                </div>

                {/* Distributions graphs in pure clean styled HTML & Tailwind */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Budget Distribution */}
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold font-serif uppercase tracking-tight">Trip Budget Distribute Profile</h4>
                    <div className="space-y-4">
                      {analytics.budgetDistribution.map((item, idx) => {
                        const total = analytics.budgetDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
                        const pct = Math.round((item.count / total) * 100);
                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="text-zinc-400">{item.tier} Pool</span>
                              <span className="text-white font-bold">{item.count} plans ({pct}%)</span>
                            </div>
                            <div className="w-full bg-zinc-950 border border-zinc-850 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Popular Vibes distribution */}
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold font-serif uppercase tracking-tight">Micro-Vibe Matching parameters</h4>
                    <div className="space-y-4">
                      {analytics.popularVibes.map((item, idx) => {
                        const maxVal = Math.max(...analytics.popularVibes.map(v => v.count)) || 1;
                        const barWidth = Math.round((item.count / maxVal) * 100);
                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-mono">
                              <span className="text-zinc-400">{item.vibe} Vibe</span>
                              <span className="text-white font-bold">{item.count} hits</span>
                            </div>
                            <div className="w-full bg-zinc-950 border border-zinc-850 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-amber-450 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Users Management Grid list representation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* User records */}
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl lg:col-span-2 space-y-4">
                    <h4 className="font-serif text-lg font-bold">Explorer Account records</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead>
                          <tr className="border-b border-zinc-800 text-zinc-550 font-mono text-[9px] uppercase">
                            <th className="pb-3">Traveler Name</th>
                            <th className="pb-3">Mail Index</th>
                            <th className="pb-3">Mobile Contact</th>
                            <th className="pb-3">System Role</th>
                            <th className="pb-3 text-right">Terminus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {users.map((u) => (
                            <tr key={u.id} className="hover:bg-zinc-950/40">
                              <td className="py-3.5 font-bold text-white">{u.fullName}</td>
                              <td className="py-3.5 text-zinc-400">{u.email}</td>
                              <td className="py-3.5 text-zinc-500 font-mono">{u.mobileNumber || 'N/A'}</td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${u.role === 'admin' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-zinc-950 text-zinc-500 border border-zinc-850'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-rose-400 hover:text-rose-500 transition-colors p-1"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-4 h-4 justify-self-end" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* System Activities */}
                  <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl lg:col-span-1 space-y-4">
                    <h4 className="font-serif text-lg font-bold">Satellite Logs</h4>
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                      {analytics.recentActivity.map((act) => (
                        <div key={act.id} className="border-l-2 border-zinc-800 pl-4 space-y-1 text-xs">
                          <p className="text-zinc-300 leading-normal">{act.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-zinc-650 font-mono">
                            <span>{act.user || 'System'}</span>
                            <span>{act.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fast blog creation helper links */}
                <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-3xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="font-bold">Need to publish luxury journals or flight updates?</h5>
                    <p className="text-xs text-zinc-500">Go directly to public blog tab to write verified diaries and watched them update.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('blog')}
                    className="bg-amber-500 text-black px-4.5 py-2.5 rounded-lg text-xs font-mono font-bold uppercase shrink-0"
                  >
                    Manage Blogs Gazette
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
}
