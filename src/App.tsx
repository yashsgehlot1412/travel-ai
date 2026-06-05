/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import BlogView from './components/BlogView';
import ContactView from './components/ContactView';
import DestinationsView from './components/DestinationsView';
import PricingView from './components/PricingView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import { User, Session } from './types';

export default function App() {
  const [view, setView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionIsLoading, setSessionIsLoading] = useState<boolean>(true);

  // Sync active express session on startup
  useEffect(() => {
    const syncSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed syncing active express user session', err);
      } finally {
        setSessionIsLoading(false);
      }
    };
    syncSession();
  }, []);

  const handleNavigate = (targetView: string) => {
    if (targetView === 'dashboard' && !currentUser) {
      setView('login');
    } else {
      setView(targetView);
    }
    // Smooth scroll transition triggers
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleAuthSuccess = (session: Session) => {
    setCurrentUser(session.user);
    // Redirect instantly to workspace dashboard upon success
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setCurrentUser(null);
    setView('home');
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navigation Bar - Hidden under print pages */}
      <div className="print:hidden">
        <Navbar
          currentUser={currentUser}
          currentView={view}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {/* Main View Area */}
      <main className="flex-grow">
        {sessionIsLoading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="h-8 w-8 border-t-2 border-amber-500 rounded-full animate-spin" />
            <p className="text-xs text-zinc-550 font-mono">Verifying traveler credentials...</p>
          </div>
        ) : (
          <>
            {view === 'home' && (
              <HomeView onNavigate={handleNavigate} />
            )}
            {view === 'about' && (
              <AboutView />
            )}
            {view === 'destinations' && (
              <DestinationsView onNavigate={handleNavigate} />
            )}
            {view === 'blog' && (
              <BlogView />
            )}
            {view === 'pricing' && (
              <PricingView />
            )}
            {view === 'contact' && (
              <ContactView />
            )}
            {view === 'login' && (
              <AuthView
                initialMode="login"
                onAuthSuccess={handleAuthSuccess}
                onNavigate={handleNavigate}
              />
            )}
            {view === 'signup' && (
              <AuthView
                initialMode="signup"
                onAuthSuccess={handleAuthSuccess}
                onNavigate={handleNavigate}
              />
            )}
            {view === 'dashboard' && currentUser && (
              <DashboardView
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Footer - Hidden during print layouts */}
      <div className="print:hidden">
        <Footer onNavigate={handleNavigate} />
      </div>

    </div>
  );
}
