/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Flame, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface DestinationsViewProps {
  onNavigate: (view: string) => void;
}

const DESTINATIONS_DB = [
  {
    name: 'Udaipur',
    country: 'India',
    region: 'India',
    vibe: 'Culture',
    season: 'October to March (Winter)',
    score: 98,
    budget: '$1,200 - $3,500',
    tag: 'Luxury',
    climate: 'Moderate',
    desc: 'The absolute royal jewel of Rajasthan, surrounded by serene blue lakes, marble palaces, and vintage car heritage musems.',
    img: 'https://images.unsplash.com/photo-1591263152046-63e8006eedfb?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    region: 'Abroad',
    vibe: 'Spiritual',
    season: 'April to May (Cherry Blossom)',
    score: 96,
    budget: '$2,500 - $5,000',
    tag: 'Peaceful',
    climate: 'Cold',
    desc: 'The spiritual heart of Japan, featuring bamboo groves, silent moss gardens, and historic Geisha alleys.',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Swiss Alps (Interlaken)',
    country: 'Switzerland',
    region: 'Abroad',
    vibe: 'Mountains',
    season: 'June to September',
    score: 97,
    budget: '$3,000 - $7,000',
    tag: 'Adventure',
    climate: 'Cold',
    desc: 'Towering icy mountain peaks, extreme skydives, and high-altitude luxury lodges.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Andaman Islands',
    country: 'India',
    region: 'India',
    vibe: 'Beach',
    season: 'November to May',
    score: 94,
    budget: '$800 - $2,000',
    tag: 'Romantic',
    climate: 'Warm',
    desc: 'Exquisite isolated white sands, glowing bioluminescent planktons, and coral snorkeling reefs.',
    img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Maldives Overwater',
    country: 'Maldives',
    region: 'Abroad',
    vibe: 'Beach',
    season: 'December to April',
    score: 99,
    budget: '$4,000 - $9,000',
    tag: 'Luxury',
    climate: 'Warm',
    desc: 'Detached premium lagoon bungalows, dynamic private chefs, and absolute ultimate ocean privacy.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Ladakh (Leh)',
    country: 'India',
    region: 'India',
    vibe: 'Mountains',
    season: 'June to September',
    score: 95,
    budget: '$700 - $1,800',
    tag: 'Adventure',
    climate: 'Cold',
    desc: 'High mountain roadways, mystical ancient monasteries, and cold-desert caravans.',
    img: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?auto=format&fit=crop&q=80&w=500'
  },
  {
    name: 'Paris',
    country: 'France',
    region: 'Abroad',
    vibe: 'Romantic',
    season: 'May to September',
    score: 97,
    budget: '$2,000 - $5,500',
    tag: 'Romantic',
    climate: 'Moderate',
    desc: 'World-famous bistros, river Seine sunset cruises, and the unparalleled aura of fashion, history, and romance.',
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=500'
  }
];

export default function DestinationsView({ onNavigate }: DestinationsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  const filtered = DESTINATIONS_DB.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = regionFilter === 'all' || d.region === regionFilter;
    const matchesTag = tagFilter === 'all' || d.tag === tagFilter;

    return matchesSearch && matchesRegion && matchesTag;
  });

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Global Index</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Curated Global Sanctuaries
          </h1>
          <p className="text-sm text-zinc-400">
            Browse our pre-mapped elite destinations evaluated by popularity match metrics and seasons.
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search global spots (e.g. Udaipur, France, Mountains...)"
                className="w-full bg-zinc-950/80 border border-zinc-850 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="destination-search-input"
              />
            </div>

            {/* Quick Region Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setRegionFilter('all')}
                className={`px-4 py-2 text-xs font-serif rounded-lg capitalize border ${
                  regionFilter === 'all' 
                    ? 'bg-amber-500 text-black border-amber-500 font-semibold' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-white'
                }`}
                id="region-filter-all"
              >
                All Regions
              </button>
              <button
                onClick={() => setRegionFilter('India')}
                className={`px-4 py-2 text-xs font-serif rounded-lg border ${
                  regionFilter === 'India' 
                    ? 'bg-amber-500 text-black border-amber-500 font-semibold' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-white'
                }`}
                id="region-filter-india"
              >
                India
              </button>
              <button
                onClick={() => setRegionFilter('Abroad')}
                className={`px-4 py-2 text-xs font-serif rounded-lg border ${
                  regionFilter === 'Abroad' 
                    ? 'bg-amber-500 text-black border-amber-500 font-semibold' 
                    : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-white'
                }`}
                id="region-filter-abroad"
              >
                Abroad
              </button>
            </div>
          </div>

          {/* Vibe tagging filter line */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900/60 text-xs">
            <span className="text-zinc-500 flex items-center space-x-1 font-mono">
              <Filter className="w-3.5 h-3.5" />
              <span>Theme Tag:</span>
            </span>
            {['all', 'Luxury', 'Peaceful', 'Adventure', 'Romantic'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag === 'all' ? 'all' : tag)}
                className={`px-3 py-1.5 rounded-md font-mono text-[11px] ${
                  (tag === 'all' && tagFilter === 'all') || tagFilter === tag
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    : 'bg-zinc-950/60 text-zinc-400 hover:text-white border border-transparent'
                }`}
                id={`vibe-filter-${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/10 border border-dashed border-zinc-850 rounded-3xl space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500/40 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold">No Match found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn't locate pre-mapped spots fitting your search parameters. Try searching "India", "Abroad", "Luxury", or simple term keys like "Lakes".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest, idx) => (
              <div
                key={idx}
                className="group bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-800 transition-all duration-300"
                id={`index-dest-card-${idx}`}
              >
                <div className="h-60 relative overflow-hidden bg-zinc-900">
                  <img
                    referrerPolicy="no-referrer"
                    src={dest.img}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-zinc-300">
                    {dest.tag}
                  </span>
                  <div className="absolute top-4 right-4 bg-amber-500 text-black px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 shadow-lg">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{dest.score}% Match</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">{dest.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center space-x-0.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-650" />
                        <span>{dest.country}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-zinc-500 font-mono uppercase">Vibe Class</p>
                      <p className="text-xs text-amber-500 font-medium">{dest.vibe}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-2">
                    {dest.desc}
                  </p>

                  <hr className="border-zinc-900" />

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">Est. Cost Pool</p>
                      <p className="text-zinc-300 font-mono mt-0.5">{dest.budget}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase">Climate Vibe</p>
                      <p className="text-zinc-300 mt-0.5">{dest.climate}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full bg-zinc-900 group-hover:bg-amber-500 group-hover:text-black hover:font-bold text-zinc-300 font-sans text-xs py-3.5 rounded-xl transition-all duration-300 text-center flex items-center justify-center space-x-1"
                    id={`dest-index-plan-btn-${idx}`}
                  >
                    <span>Activate AI Planner Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
