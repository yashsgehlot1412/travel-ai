/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Send, ShieldCheck, Award, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <Compass className="h-7 w-7 text-amber-500" />
              <span className="text-lg font-bold font-sans tracking-wider">
                TRAVEL<span className="text-amber-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
              Designing tailored, authentic experiences for the modern explorer. No cookie-cutters. Powered by cutting-edge intelligence to matching your ultimate vibe.
            </p>
            {/* Badges */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-1 text-xs text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Secured</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-zinc-500">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Top Agency</span>
              </div>
            </div>
          </div>

          {/* Quick Explorer Paths */}
          <div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-4">Discover</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onNavigate('destinations')} className="text-sm font-sans text-zinc-400 hover:text-white transition-colors">
                  Top Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="text-sm font-sans text-zinc-400 hover:text-white transition-colors">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="text-sm font-sans text-zinc-400 hover:text-white transition-colors">
                  Travel Blogs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm font-sans text-zinc-400 hover:text-white transition-colors">
                  Our Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Core Support Links */}
          <div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-4">Inquiries</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm font-sans text-zinc-400 hover:text-white transition-colors">
                  Support Desk
                </button>
              </li>
              <li>
                <span className="text-sm font-sans text-zinc-400">
                  Phone: +1 (555) 902-1412
                </span>
              </li>
              <li>
                <span className="text-sm font-sans text-zinc-400">
                  Email: concierge@travelai.com
                </span>
              </li>
              <li>
                <span className="text-sm font-sans text-zinc-400">
                  Office: Suite 400, Silicon Beach, CA
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Subscribe Insights</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Enter your email to receive bespoke travel guides, custom flight alerts, and secret spots.
            </p>
            {subscribed ? (
              <div className="p-3 bg-zinc-900 border border-amber-500/30 rounded-lg text-xs text-amber-400 font-sans">
                ✓ Perfect! You are on our luxury priority dispatch roster.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="flex-1 min-w-0 bg-zinc-900 text-white placeholder-zinc-500 border border-zinc-800 rounded-l-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-black px-4 rounded-r-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-600 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL CDN STATIONS STABLE</span>
            </div>
          </div>
        </div>

        <hr className="border-zinc-900 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 font-sans">
          <span>&copy; {new Date().getFullYear()} TravelAI Inc. All luxury rights reserved.</span>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
