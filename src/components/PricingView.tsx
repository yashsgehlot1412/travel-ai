/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Check, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingView() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [purchasedPlan, setPurchasedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free Portal',
      price: 0,
      desc: 'Perfect for quick tests or occasional local searches.',
      features: [
        'Curated stock recommendations matching',
        'Basic Day-by-Day structured timeline plans',
        '3 AI Assistant Chat responses per session',
        'Save up to 2 itineraries',
        'Standard PDF printing view'
      ],
      tag: 'Basic Use',
      cta: 'Explore Free'
    },
    {
      name: 'Bespoke Premium',
      price: billingPeriod === 'monthly' ? 29 : 19,
      desc: 'The master suite choice for deep and continuous global travelers.',
      features: [
        'Unlimited luxury AI-ranked generation',
        'Deep machine reasoning structure output',
        'Live weather forecasts and safety reports',
        'Unlimited AI chat with travel concierge',
        'Unlimited saved trips library',
        'Secure shareable static link copying'
      ],
      tag: 'Most Popular',
      cta: 'Activate Premium',
      popular: true
    },
    {
      name: 'VIP Concierge',
      price: billingPeriod === 'monthly' ? 149 : 119,
      desc: 'Elite integration connecting real human travel specialists.',
      features: [
        'All Bespoke Premium benefits',
        'Direct 24/7 WhatsApp human agent support',
        'Guaranteed booking discount allocations',
        'Custom local language translator calls',
        'Local restaurant reservation assistance',
        'Private airport lounge pass tokens'
      ],
      tag: 'Extreme Luxury',
      cta: 'Enter VIP Circle'
    }
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase font-semibold">Flexible Tiers</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Clear Tiers. Elite Access.
          </h1>
          <p className="text-sm text-zinc-400">
            Choose the planning capacity that matching your travel frequency. No hidden commissions or margins.
          </p>

          {/* Toggle Period */}
          <div className="inline-flex items-center space-x-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono pt-1.5 pb-1.5 mt-6">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                billingPeriod === 'monthly' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'
              }`}
            >
              Monthly Term
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                billingPeriod === 'yearly' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'
              }`}
            >
              Yearly (Save 33%)
            </button>
          </div>
        </div>

        {/* Modal Congratulations Overlay */}
        {purchasedPlan && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
              <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif">Welcome inside {purchasedPlan}!</h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  ✓ Simulated Luxury Gateway Confirmed! Your workspace features has been elevated. You have immediate access to unlimited machine-ranked outputs, deep itineraries, and 24/7 travel widgets.
                </p>
              </div>
              <button
                onClick={() => setPurchasedPlan(null)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-mono py-3.5 rounded-xl uppercase font-bold tracking-wide transition-colors"
              >
                Enter Premium Workspace
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Grid cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative bg-zinc-900/40 border rounded-3xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 ${
                p.popular 
                  ? 'border-amber-500 shadow-xl shadow-amber-500/5' 
                  : 'border-zinc-850 hover:border-zinc-800'
              }`}
              id={`pricing-card-${idx}`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-mono tracking-widest uppercase font-bold px-4 py-1 rounded-full">
                  {p.tag}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  {!p.popular && (
                    <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-550 border border-zinc-800 px-2 py-0.5 rounded-full block w-max mb-3">
                      {p.tag}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-zinc-500 mt-2 min-h-8 font-sans">{p.desc}</p>
                </div>

                <div className="flex items-baseline space-x-1 text-white border-b border-zinc-900 pb-6">
                  <span className="text-3xl font-serif font-bold">${p.price}</span>
                  <span className="text-xs text-zinc-500 font-mono">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                </div>

                {/* Features list */}
                <ul className="space-y-3.5">
                  {p.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-start space-x-2.5 text-xs">
                      <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-350 font-sans leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => setPurchasedPlan(p.name)}
                  className={`w-full py-3.5 rounded-xl text-center text-xs font-mono font-bold uppercase tracking-wide transition-all ${
                    p.popular 
                      ? 'bg-amber-500 hover:bg-amber-600 text-black' 
                      : 'bg-zinc-950 border border-zinc-800 text-white hover:border-zinc-300'
                  }`}
                  id={`pricing-buy-btn-${idx}`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security badges */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-3xl p-6 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs text-zinc-400 font-sans">SSL Encrypted merchant lines. 14 Days Refund Guarantee.</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-650 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-900">SECURE BILLING SUITE</span>
        </div>

      </div>
    </div>
  );
}
