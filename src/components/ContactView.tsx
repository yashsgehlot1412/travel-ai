/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Send, Mail, Phone, MapPin, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Plan Consultation');
  const [message, setMessage] = useState('');
  
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setFeedback('All fields marked as core must be fully typed.');
      setErrorStatus(true);
      return;
    }

    setIsSending(true);
    setFeedback('');
    setErrorStatus(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await response.json();
      if (data.success) {
        setFeedback('✓ Successfully dispatched! Your private TravelAI advisor will contact you within 12 hours.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setFeedback('Failed to deliver message.');
        setErrorStatus(true);
      }
    } catch (err) {
      console.error(err);
      setFeedback('Error linking with server. Please try again.');
      setErrorStatus(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        
        {/* Editorial Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Consultations Desk</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Connect With Our Concierge
          </h1>
          <p className="text-sm text-zinc-400">
            Facing custom group planning conditions or need direct corporate help? Drop our design agents a private query below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
          {/* Info Column */}
          <div className="space-y-8 md:col-span-1">
            <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-2xl space-y-5">
              <h3 className="font-serif text-lg font-bold">Contact Coordinates</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs text-zinc-350">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">VIP Concierge Lines</p>
                    <p className="font-mono text-[11px] text-zinc-500 mt-1">+1 (555) 902-1412</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-zinc-350">
                  <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">E-mail Dispatch</p>
                    <p className="font-mono text-[11px] text-zinc-500 mt-1">concierge@travelai.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-zinc-350">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Design Studio</p>
                    <p className="font-sans text-zinc-500 mt-1 leading-relaxed">
                      Suite 400, Silicon Beach, Santa Monica, California
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="p-6 bg-zinc-900/50 border border-zinc-900 rounded-2xl flex items-center space-x-3 text-xs text-zinc-400">
              <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
              <span>Verified luxury certified agency, accredited by the Global Travel Council.</span>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 sm:p-8 md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              <span className="text-xs font-mono tracking-wider font-semibold">Consolidated Query Portal</span>
            </div>

            {feedback && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm font-sans flex items-start space-x-2 ${
                errorStatus 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/25'
              }`}>
                {errorStatus ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash Gehlot"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="contact-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">Your E-mail Inbox</label>
                  <input
                    type="email"
                    required
                    placeholder="yash@gmail.com"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="contact-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Nature of Inquiry</label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  id="contact-subject"
                >
                  <option value="Bespoke Plan Consultation">Bespoke Plan Consultation</option>
                  <option value="Corporate/Group Retails">Corporate or Group Retails Booking</option>
                  <option value="Billing & Merchant Suite support">Billing & Account Support</option>
                  <option value="Local guides registration request">Local Guides Onboarding</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Detailed Message Specifications</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us about your upcoming travel plan parameters, target budget sizes, passenger numbers, or technical integration questions..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-xs text-white placeholder-zinc-650 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="contact-message"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-semibold font-mono tracking-wide py-4 rounded-xl text-xs uppercase transition-all disabled:opacity-40 flex items-center justify-center space-x-2"
                id="contact-submit-btn"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Dispatching Message...' : 'Securely Deliver Query'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
