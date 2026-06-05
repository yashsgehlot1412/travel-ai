/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Menu, X, User, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

export default function Navbar({ currentView, onNavigate, currentUser, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Destinations', view: 'destinations' },
    { label: 'About Us', view: 'about' },
    { label: 'Blog', view: 'blog' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'Contact Us', view: 'contact' },
  ];

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2 cursor-pointer group"
            id="nav-logo"
          >
            <Compass className="h-8 w-8 text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
            <div>
              <span className="text-xl font-bold font-sans tracking-wider text-white">
                TRAVEL<span className="text-amber-500">AI</span>
              </span>
              <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Luxury Planner</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-sm font-sans font-medium tracking-wide transition-colors duration-200 ${
                  currentView === item.view 
                    ? 'text-amber-500' 
                    : 'text-zinc-300 hover:text-white'
                }`}
                id={`nav-${item.view}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono"
                    id="nav-admin-badge"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Mode</span>
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center space-x-2 text-zinc-300 hover:text-white text-sm font-sans"
                  id="nav-user-dashboard"
                >
                  <User className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">{currentUser.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Logout"
                  id="nav-logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-sans font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
                  id="nav-cta-planner"
                >
                  My Workspace
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-sans font-medium text-zinc-300 hover:text-white transition-colors"
                  id="nav-login"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="bg-zinc-100 hover:bg-white text-black text-xs font-sans font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full transition-all hover:scale-105"
                  id="nav-signup"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            {currentUser && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="p-2 text-amber-500"
                id="nav-mobile-user"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white focus:outline-none"
              id="nav-mobile-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-900 px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`text-left py-2 text-base font-medium tracking-wide ${
                  currentView === item.view ? 'text-amber-500' : 'text-zinc-300 hover:text-white'
                }`}
                id={`nav-mobile-${item.view}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <hr className="border-zinc-800" />

          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Logged in as: <strong className="text-white">{currentUser.fullName}</strong></span>
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">Admin</span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-center bg-amber-500 text-black font-sans font-semibold py-3 rounded-full text-sm"
                  id="nav-mobile-workspace"
                >
                  Enter Workspace
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-center bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-sans py-3 rounded-full text-sm flex items-center justify-center space-x-2"
                  id="nav-mobile-logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full text-center border border-zinc-800 text-white font-sans py-3 rounded-full text-sm"
                id="nav-mobile-login"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full text-center bg-zinc-100 text-black font-sans font-semibold py-3 rounded-full text-sm"
                id="nav-mobile-signup"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
