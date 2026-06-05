/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Shield, Award, Heart, Mail } from 'lucide-react';

export default function AboutView() {
  const CoreValues = [
    {
      icon: Shield,
      title: 'Bespoke Authenticity',
      desc: 'We discard generic catalog trips. Every plan recommended matches your exact chosen vibes and companion requirements.'
    },
    {
      icon: Award,
      title: 'Vetted Luxury',
      desc: 'Our hotel suites and food dishes are hand-mapped according to strict premium standards of luxury, ratings, and scenery.'
    },
    {
      icon: Heart,
      title: 'Mindful Travel',
      desc: 'We integrate local culture, local language guides, and safety checks directly into your itinerary for serene travels.'
    }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Who We Are</span>
          <h1 className="text-4xl sm:text-5xl font-serif tracking-tight text-white font-bold leading-tight">
            We Plan Your Vibe.<br />Not Just Your Destination.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl mx-auto">
            TravelAI was established in 2026 to dismantle the static booking catalog. We believe travel represents deep personal identity. By connecting cutting-edge machine reasoning with native local expertise, we construct living itineraries that adjust seamlessly to your state of mind.
          </p>
        </div>

        {/* Feature Image Frame */}
        <div className="relative h-96 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200"
            alt="Travel group exploration"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 max-w-md">
            <span className="text-[10px] uppercase tracking-widest font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">The Vision</span>
            <p className="text-lg sm:text-xl font-serif text-white mt-4 font-italic">
              "We don\'t sell room keys. We match travelers with sanctuaries that trigger raw awe."
            </p>
          </div>
        </div>

        {/* Values Block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {CoreValues.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <div key={idx} className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-8 hover:border-zinc-800 transition-colors">
                <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 mb-6">
                  <IconComp className="w-5 h-5" />
                </div>
                <h4 className="text-md font-sans font-bold mb-2">{val.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{val.desc}</p>
              </div>
            );
          })}
        </div>

        <hr className="border-zinc-900" />

        {/* Co-founders section */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold">Behind the Intelligence</h3>
            <p className="text-xs text-zinc-500">Our senior design and operations team.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl mx-auto pt-4">
            <div className="text-center space-y-3">
              <div className="h-44 w-44 mx-auto rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                  alt="Co-founder Sophia"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-sm font-bold">Sophia Sterling</h5>
                <p className="text-xs text-amber-500 font-mono">Co-Founder & Travel Architect</p>
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Formerly leading global itinerary design in Milan. Driven by quiet beaches and traditional stone-cooked foods.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="h-44 w-44 mx-auto rounded-full overflow-hidden border border-zinc-800 bg-zinc-900">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
                  alt="Co-founder Kabir"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="text-sm font-bold">Kabir Sen</h5>
                <p className="text-xs text-amber-500 font-mono">Co-Founder & AI Systems Lead</p>
              </div>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Machine learning specialist. Engineered TravelAI\'s core contextual vector matching loops.
              </p>
            </div>
          </div>
        </div>

        {/* Global CDN Network banner */}
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-8 text-center space-y-4">
          <Compass className="w-8 h-8 text-amber-500 mx-auto animate-spin-slow" />
          <h4 className="text-md font-bold">In partnership with 2,500+ Luxury Local Experts</h4>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl mx-auto">
            From regional Mewari historians inside Rajasthan to certified Swiss glacier climbers in Grindelwald, we keep actual human oversight over every AI recommended travel plan.
          </p>
        </div>

      </div>
    </div>
  );
}
