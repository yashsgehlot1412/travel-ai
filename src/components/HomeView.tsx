/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Compass, Hotel, Utensils, MapPin, CloudSun, Globe, 
  Users, Flame, ArrowRight, Star, Heart, CheckCircle 
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', // Maldives Beach
  'https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=1200', // Udaipur Lake Palace
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200', // Swiss Alps
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200'  // Kyoto Shrines
];

const FEATURES_LIST = [
  {
    icon: Globe,
    title: 'AI Destination Matching',
    desc: 'Input your preferences, travel companion status, and micro-vibes. Our engine pairs you with matching global sanctuaries.'
  },
  {
    icon: Sparkles,
    title: 'Smart Itinerary Generator',
    desc: 'Generate complete travel plans covering morning, afternoon, and evening slots with distances and helpful advice.'
  },
  {
    icon: Hotel,
    title: 'Hotel Recommendations',
    desc: 'Discover live matching luxury resorts, boutique ryokans, or historic chalets personalized directly to your pocket.'
  },
  {
    icon: Utensils,
    title: 'Local Food Discovery',
    desc: 'Discover the deepest soul of regional traditions with curated, must-try local recipes and top-voted local bistros.'
  },
  {
    icon: MapPin,
    title: 'Attraction Finder',
    desc: 'Explore top rated landmarks and hidden viewpoints, with real distances, reviews count, entry rates, and opening times.'
  },
  {
    icon: CloudSun,
    title: 'Real-Time Weather Vibe',
    desc: 'Match your trip with your ideal climate profile—whether you crave cold crisp peaks, mild breezes, or tropical warmth.'
  }
];

const STEPS = [
  {
    num: '01',
    title: 'Select Region',
    desc: 'Decide if you want to explore the majestic heritage of India or venture into high-end International borders.'
  },
  {
    num: '02',
    title: 'Identify Companions',
    desc: 'Define who you are travelling with—whether traveling solo, a romantic couple honeymoon, or family seniors.'
  },
  {
    num: '03',
    title: 'State Your Vibe',
    desc: 'Select multiple micro-vibes like Spiritual, Mountains, Wellness, Beach, Party, or Culinary foods.'
  },
  {
    num: '04',
    title: 'Get Premium Plan',
    desc: 'Receive your dynamic AI-ranked destinations, safety reports, weather, hotel suite pairings, and customized routes.'
  }
];

const CURATED_DESTINATIONS = [
  {
    name: 'Udaipur',
    country: 'India',
    vibe: 'Culture',
    season: 'Oct - Mar',
    score: 98,
    budget: '$1,200 - $3,500',
    type: 'domestic',
    tag: 'Luxury',
    img: 'https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    vibe: 'Spiritual',
    season: 'Apr - May',
    score: 96,
    budget: '$2,500 - $5,000',
    type: 'international',
    tag: 'Peaceful',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Swiss Alps (Interlaken)',
    country: 'Switzerland',
    vibe: 'Mountains',
    season: 'Jun - Sep',
    score: 97,
    budget: '$3,000 - $7,000',
    type: 'international',
    tag: 'Adventure',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Andaman Islands',
    country: 'India',
    vibe: 'Beach',
    season: 'Nov - May',
    score: 94,
    budget: '$800 - $2,000',
    type: 'domestic',
    tag: 'Family',
    img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Ladakh (Leh)',
    country: 'India',
    vibe: 'Mountains',
    season: 'Jun - Sep',
    score: 95,
    budget: '$700 - $1,800',
    type: 'domestic',
    tag: 'Adventure',
    img: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Maldives Overwater',
    country: 'Maldives',
    vibe: 'Beach',
    season: 'Dec - Apr',
    score: 99,
    budget: '$4,000 - $9,000',
    type: 'international',
    tag: 'Luxury',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sarah Jenkins',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'TravelAI changed my whole honeymoon perspective! The romantic luxury matching led us straight to Udaipur and paired us with a gorgeous lake resort. The food suggestions were absolutely stellar.'
  },
  {
    name: 'Rohan Deshmukh',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'A truly world-class planner. I set my budget to high-end adventure, chose cold peaks, and Kyoto was recommendation #1. The day-by-day itineraries are wonderfully timed'
  },
  {
    name: 'Michael Chen',
    location: 'San Francisco, USA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'The AI Travel Assistant answered literally everything about packing and safety in milliseconds. We shared our itinerary link with friends who signed up immediately!'
  }
];

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  // Cycle slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredDests = CURATED_DESTINATIONS.filter((d) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'domestic') return d.type === 'domestic';
    if (activeFilter === 'international') return d.type === 'international';
    if (activeFilter === 'luxury') return d.tag === 'Luxury';
    if (activeFilter === 'adventure') return d.tag === 'Adventure';
    return d.vibe.toLowerCase() === activeFilter;
  });

  return (
    <div className="bg-zinc-950 text-white selection:bg-amber-500 selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden" id="hero">
        {/* Parallax cycle slide */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-out scaler ${
                idx === heroIndex ? 'opacity-40 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950" />
        </div>

        {/* Content */}
        <div className="relative max-w-5xl mx-auto px-4 text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-amber-500 text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Powered Exploration Engine</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold tracking-tight text-white leading-none leading-tight"
          >
            Discover Your Perfect <br />
            <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Journey with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed font-sans"
          >
            Personalized destination recommendations, itineraries, hotels, attractions, and local experiences powered by artificial intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-sans font-semibold px-8 py-4 rounded-full transition-all text-sm tracking-wide shadow-xl shadow-amber-500/10 flex items-center justify-center space-x-2"
              id="hero-planner-cta"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('destinations')}
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-300 hover:bg-zinc-900 active:scale-95 text-white font-sans font-semibold px-8 py-4 rounded-full transition-all text-sm tracking-wide flex items-center justify-center space-x-2"
              id="hero-explore-cta"
            >
              <span>Explore Destinations</span>
            </button>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-8 text-xs text-zinc-500 font-mono"
          >
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <span>100,000+ Travelers</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <span>50+ Countries Supported</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <span>State-of-the-art Model</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase">Core Mechanics</h2>
            <h3 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight">
              Designed for Discernment. Engineered for Travel.
            </h3>
            <p className="text-sm text-zinc-400 font-sans leading-relaxed">
              Ditch static PDFs and generic travel portals. TravelAI couples dynamic weather radars, global dining lists, and luxury stays directly into one workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES_LIST.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 hover:border-zinc-700/80 transition-all hover:-translate-y-1 group duration-350"
                  id={`feature-${idx}`}
                >
                  <div className="h-12 w-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-sans font-semibold text-white mb-2">{feat.title}</h4>
                  <p className="text-sm text-zinc-400 font-sans leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-900/20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
            <div className="space-y-4 lg:w-1/2">
              <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase">Interactive Timeline</h2>
              <h3 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight">
                How It Works
              </h3>
              <p className="text-sm text-zinc-400 font-sans leading-relaxed">
                Four simple steps to escape conventional planning limits and find your bespoke travel match.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-end">
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded-full flex items-center space-x-2 transition-all"
                id="how-it-works-start-cta"
              >
                <span>Launch Wizard Now</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {STEPS.map((step, idx) => (
              <div 
                key={idx} 
                className="relative bg-zinc-950 border border-zinc-900/80 rounded-3xl p-8 hover:border-zinc-800 duration-300"
                id={`step-${idx}`}
              >
                {/* Connector Line for Desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-zinc-800 z-10" />
                )}
                <span className="text-4xl font-mono text-amber-500/20 block mb-6 font-extrabold">{step.num}</span>
                <h4 className="text-md font-sans font-bold mb-2 text-white">{step.title}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-950" id="curated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-xs font-mono tracking-widest text-amber-500 uppercase">Master Index</h2>
              <h3 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight">
                Curated Recommendations
              </h3>
              <p className="text-sm text-zinc-400 font-sans">
                Browse our highest AI popularity rated global nodes instantly.
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'domestic', 'international', 'luxury', 'adventure'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-serif capitalize tracking-wide transition-all ${
                    activeFilter === f 
                      ? 'bg-amber-500 text-black font-semibold' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                  id={`filter-${f}`}
                >
                  {f === 'domestic' ? 'India' : f === 'international' ? 'International' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDests.map((dest, idx) => (
              <div
                key={idx}
                className="group bg-zinc-900/30 border border-zinc-900/80 rounded-3xl overflow-hidden hover:border-zinc-800/80 transition-all duration-300"
                id={`curated-dest-${idx}`}
              >
                {/* Photo frame */}
                <div className="h-56 relative overflow-hidden bg-zinc-900">
                  <img
                    referrerPolicy="no-referrer"
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Tag badge */}
                  <span className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-mono text-zinc-300">
                    {dest.tag}
                  </span>
                  {/* Score */}
                  <div className="absolute top-4 right-4 bg-amber-500 text-black px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 shadow-lg shadow-amber-500/20">
                    <Flame className="w-3.5 h-3.5 animate-bounce" />
                    <span>{dest.score}% Match</span>
                  </div>
                </div>

                {/* Info block */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-sans font-bold text-white group-hover:text-amber-500 transition-colors">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-zinc-500 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-zinc-600" />
                        <span>{dest.country}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 font-mono">Best Season</p>
                      <p className="text-xs text-amber-500 font-medium font-sans">{dest.season}</p>
                    </div>
                  </div>

                  <hr className="border-zinc-900" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-sans">Est. Budget Pool</span>
                    <span className="text-zinc-300 font-mono font-medium">{dest.budget}</span>
                  </div>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full bg-zinc-800/80 hover:bg-amber-500 group-hover:text-black group-hover:font-semibold text-zinc-300 font-sans text-xs py-3 rounded-xl transition-all duration-300 text-center flex items-center justify-center space-x-1"
                    id={`curated-plan-btn-${idx}`}
                  >
                    <span>Activate AI Planner</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-900/10" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <Heart className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="text-3xl font-sans font-bold tracking-tight">Traveler Feedback</h3>
            <p className="text-sm text-zinc-400">
              Word of mouth from our VIP travelers who custom-planned their journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, idx) => (
              <div
                key={idx}
                className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl flex flex-col justify-between hover:border-zinc-800 transition-colors"
                id={`testimonial-${idx}`}
              >
                <div className="space-y-4">
                  {/* Stars */}
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm font-sans leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-zinc-900">
                  <img
                    referrerPolicy="no-referrer"
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 object-cover rounded-full bg-zinc-900"
                  />
                  <div>
                    <h5 className="text-xs font-sans font-bold text-white">{test.name}</h5>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase">{test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-zinc-950 border-t border-zinc-900" id="cta">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <Compass className="w-12 h-12 text-amber-500 mx-auto animate-spin-slow" />
          <h2 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight">
            Ready For Your Next Adventure?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            State your companionship, pick your vibe list, and let our custom luxury travel model construct your complete visual map.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-sans font-bold px-10 py-5 rounded-full text-sm uppercase tracking-wider transition-all"
            id="cta-plan-trip-btn"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
