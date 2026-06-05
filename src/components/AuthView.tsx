/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Mail, Lock, User, Phone, Sparkles, KeyRound, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Session } from '../types';

interface AuthViewProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (session: Session) => void;
  onNavigate: (view: string) => void;
}

export default function AuthView({ initialMode, onAuthSuccess, onNavigate }: AuthViewProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [loginMode, setLoginMode] = useState<'email' | 'mobile'>('email');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Recovery States
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'mobile'>('email');
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);

  // Simulated OTP trackers shown inside UI as professional push prompts
  const [simulatedSMSCode, setSimulatedSMSCode] = useState('');
  const [smsNotification, setSmsNotification] = useState('');

  // Status & loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  // Password validation checks
  const getPasswordStrength = () => {
    if (!password) return { text: 'Empty', color: 'bg-zinc-850', score: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { text: 'Weak', color: 'bg-red-500', score: 25 };
      case 2:
      case 3:
        return { text: 'Moderate Strength', color: 'bg-amber-500', score: 65 };
      case 4:
        return { text: 'Extremely Strong', color: 'bg-emerald-500', score: 100 };
      default:
        return { text: 'Weak', color: 'bg-zinc-850', score: 0 };
    }
  };

  const strength = getPasswordStrength();

  // Send Simulated OTP to Mobile
  const handleSendOTP = async () => {
    if (!mobileNumber) {
      setErrorText('Please enter your mobile number first.');
      return;
    }
    setIsLoading(true);
    setErrorText('');
    setSmsNotification('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });
      const data = await response.json();
      if (data.otpCode) {
        setSimulatedSMSCode(data.otpCode);
        setSmsNotification(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorText('Failed dispatching OTP. Check node servers.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText('');
    setSuccessText('');

    if (loginMode === 'mobile' && otpCode !== simulatedSMSCode) {
      setErrorText('Incorrect dynamic OTP verification number typed.');
      setIsLoading(false);
      return;
    }

    try {
      const bodyPayload = loginMode === 'email' 
        ? { email, password, mode: 'email' }
        : { mobileNumber, mode: 'mobile' };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const resData = await response.json();
      if (response.ok) {
        setSuccessText('✓ Securely logged in. Syncing private workspace session...');
        setTimeout(() => {
          onAuthSuccess(resData);
        }, 1200);
      } else {
        setErrorText(resData.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setErrorText('Server communication link broken.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText('');
    setSuccessText('');

    if (password !== confirmPassword) {
      setErrorText('Password configurations do not match.');
      setIsLoading(false);
      return;
    }

    if (strength.score < 65) {
      setErrorText('Password strength must be at least Moderate Strength for defense.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, mobileNumber, password })
      });

      const resData = await response.json();
      if (response.ok) {
        setSuccessText('✓ Registration Approved! Allocating travel database tokens...');
        setTimeout(() => {
          onAuthSuccess(resData);
        }, 1200);
      } else {
        setErrorText(resData.error || 'Failed to complete registration.');
      }
    } catch (err) {
      console.error(err);
      setErrorText('Server communication link broken.');
    } finally {
      setIsLoading(false);
    }
  };

  // Single Click Google Bypass Simulator
  const handleGoogleAuthBypass = () => {
    setIsLoading(true);
    setSuccessText('Simulating secure Google OAuth pipeline redirect...');
    
    // Auto login as a beautiful VIP traveler Yash Gehlot after 1.5 seconds
    setTimeout(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'yash@test.com', password: 'password123' })
        });
        const resData = await response.json();
        if (response.ok) {
          setSuccessText('✓ Google ID verified. Workspace authenticated.');
          setTimeout(() => {
            onAuthSuccess(resData);
          }, 800);
        }
      } catch (err) {
        console.error(err);
        setErrorText('Google auth tunnel collapsed.');
      } finally {
        setIsLoading(false);
      }
    }, 1200);
  };

  // Recover Password Process
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');
    setIsLoading(true);

    if (recoveryStep === 1) {
      if (recoveryMethod === 'email' && !email) {
        setErrorText('Please specify recovery email address.');
        setIsLoading(false);
        return;
      }
      if (recoveryMethod === 'mobile' && !mobileNumber) {
        setErrorText('Please specify mobile numbers.');
        setIsLoading(false);
        return;
      }

      // Send dispatch triggers
      if (recoveryMethod === 'email') {
        const res = await fetch('/api/auth/send-reset-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const resData = await res.json();
        setSuccessText(`✓ reset details dispatch: ${resData.message}`);
        setTimeout(() => setRecoveryStep(2), 1500);
      } else {
        await handleSendOTP();
        setTimeout(() => setRecoveryStep(2), 1500);
      }
    } else if (recoveryStep === 2) {
      if (recoveryMethod === 'mobile' && otpCode !== simulatedSMSCode) {
        setErrorText('Invalid verification OTP code typed.');
        setIsLoading(false);
        return;
      }
      setSuccessText('Identity Authenticated successfully.');
      setTimeout(() => setRecoveryStep(3), 1200);
    } else if (recoveryStep === 3) {
      if (password !== confirmPassword) {
        setErrorText('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      setSuccessText('✓ Password reset successfully! Redirecting back to Login.');
      setTimeout(() => {
        setMode('login');
        setRecoveryStep(1);
        setSuccessText('');
        setErrorText('');
      }, 1500);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-[85vh] flex items-center justify-center py-16 px-4 font-sans">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* SMS Simulator visual toast notifications */}
        {smsNotification && (
          <div className="absolute top-0 inset-x-0 bg-amber-500 text-black px-4 py-2.5 text-center text-xs font-mono font-bold tracking-tight animate-bounce flex items-center justify-center space-x-1.5 z-50 shadow-lg">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{smsNotification}</span>
          </div>
        )}

        {/* Brand logo header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Compass className="h-6 w-6 text-amber-500" />
            <span className="text-md font-bold tracking-wider font-sans">TRAVEL<span className="text-amber-500">AI</span></span>
          </div>
          
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            {mode === 'login' && 'Log In to Workspace'}
            {mode === 'signup' && 'Register Luxury Account'}
            {mode === 'forgot' && 'Credential Recovery'}
          </h2>
          <p className="text-xs text-zinc-500">
            {mode === 'login' && 'Retrieve private saved itineraries & travel assistants.'}
            {mode === 'signup' && 'Join 100,000+ explorers planning premium vibes.'}
            {mode === 'forgot' && 'Reset your entry keys using SMS code or Mail.'}
          </p>
        </div>

        {/* Google Unified fast sign-in */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleAuthBypass}
              className="w-full bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-300 font-sans text-xs py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              id="google-bypass-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.5-1.14 2.76-2.4 3.61v3h3.86c2.26-2.08 3.67-5.14 3.67-8.46z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5.01H1.31v3.1A12 12 0 0012 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.24a7.19 7.19 0 010-4.48V6.66H1.31a12 12 0 000 10.68l3.93-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.92 11.92 0 0012 0a12 12 0 00-10.69 6.66l3.93 3.1c.95-2.88 3.61-5.01 6.76-5.01z"
                />
              </svg>
              <span>Continue with Google ID</span>
            </button>

            <div className="flex items-center justify-center space-x-2 text-zinc-700">
              <span className="h-px bg-zinc-850 flex-1" />
              <span className="text-[10px] font-mono whitespace-nowrap uppercase">Or private lines</span>
              <span className="h-px bg-zinc-850 flex-1" />
            </div>
          </div>
        )}

        {/* Global Action Toasts */}
        {errorText && (
          <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs flex items-start space-x-1.5 font-sans" id="auth-error-toast">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorText}</span>
          </div>
        )}
        {successText && (
          <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-xl text-xs flex items-center space-x-1.5 font-sans" id="auth-success-toast">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{successText}</span>
          </div>
        )}

        {/* LOGIN MODE FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Login toggler */}
            <div className="grid grid-cols-2 bg-zinc-950 p-1 border border-zinc-850 rounded-lg text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setLoginMode('email')}
                className={`py-1.5 rounded-md ${loginMode === 'email' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
              >
                E-mail Address
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('mobile')}
                className={`py-1.5 rounded-md ${loginMode === 'mobile' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
              >
                Mobile SMS
              </button>
            </div>

            {loginMode === 'email' ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">E-mail Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      placeholder="yash@gmail.com"
                      className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="login-email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                    <label className="text-zinc-500">Workspace Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-amber-500 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      placeholder="password123"
                      className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="login-password"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Register Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+918888888888"
                        className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        id="login-mobile"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="bg-zinc-950 border border-zinc-800 hover:border-zinc-500 text-white text-[10px] uppercase font-mono tracking-tight px-3 rounded-xl transition-all"
                    >
                      Send Code
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Interactive OTP Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="Enter verification code showed above"
                      className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      id="login-otp"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Remember Me control */}
            <div className="flex items-center justify-between text-xs font-sans text-zinc-400">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-600">AES-256 ENCRYPTED</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-semibold font-mono text-xs py-4 rounded-xl tracking-wide uppercase transition-all disabled:opacity-45"
              id="login-submit-btn"
            >
              {isLoading ? 'Verifying Safe Signatures...' : 'Enter Workspace Portal'}
            </button>

            <p className="text-center text-xs text-zinc-400">
              New to travel design?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-amber-500 hover:underline inline-block font-semibold"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* SIGN UP MODE FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Yash Gehlot"
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  id="signup-name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">E-mail address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="yashsgehlot1412@gmail.com"
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="signup-email"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase">Mobile Digits (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="tel"
                  placeholder="+919999999999"
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 pl-10 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  id="signup-mobile"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 chars"
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="signup-password"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Type again"
                  className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="signup-confirm"
                />
              </div>
            </div>

            {/* Password strength visualizer */}
            {password && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-500">
                  <span>Vulnerability Check: <strong className="text-white">{strength.text}</strong></span>
                  <span>{strength.score}% Secured</span>
                </div>
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-semibold font-mono text-xs py-4 rounded-xl tracking-wide uppercase transition-all disabled:opacity-45"
              id="signup-submit-btn"
            >
              {isLoading ? 'Creating Private Gateway...' : 'Initialize Secure Account'}
            </button>

            <p className="text-center text-xs text-zinc-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-amber-500 hover:underline inline-block font-semibold"
              >
                Log In
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleRecoverySubmit} className="space-y-4 animate-fade-in">
            {/* Steps block */}
            <div className="flex items-center justify-between text-[10px] font-mono uppercase border-b border-zinc-850 pb-3">
              <span className={recoveryStep === 1 ? 'text-amber-500 font-bold' : 'text-zinc-600'}>01. Verification</span>
              <span className={recoveryStep === 2 ? 'text-amber-500 font-bold' : 'text-zinc-600'}>02. OTP Auth</span>
              <span className={recoveryStep === 3 ? 'text-amber-500 font-bold' : 'text-zinc-600'}>03. Reset Key</span>
            </div>

            {recoveryStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 bg-zinc-950 p-1 border border-zinc-850 rounded-lg text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setRecoveryMethod('email')}
                    className={`py-1 rounded-md ${recoveryMethod === 'email' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
                  >
                    Use E-mail Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecoveryMethod('mobile')}
                    className={`py-1 rounded-md ${recoveryMethod === 'mobile' ? 'bg-amber-500 text-black font-semibold' : 'text-zinc-400'}`}
                  >
                    SMS OTP Code
                  </button>
                </div>

                {recoveryMethod === 'email' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase">Input Recovery Mail</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yashsgehlot1412@gmail.com"
                      className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Your Registered Mobile</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +919999999999"
                      className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black text-xs font-mono font-bold uppercase py-3.5 rounded-xl flex items-center justify-center space-x-1"
                >
                  <span>Dispatch Verification Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {recoveryStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                  Recover Dispatch Approved! Please enter the dynamic verify token code showed on top into the input field below.
                </p>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Security OTP Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter visual simulation token code"
                    className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl font-mono text-center tracking-widest text-white leading-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black text-xs font-mono font-bold uppercase py-3.5 rounded-xl"
                >
                  Confirm Security Token
                </button>
              </div>
            )}

            {recoveryStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Type new password keys</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 8 strong characters"
                    className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase">Confirm new password keys</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password"
                    className="w-full bg-zinc-950 border border-zinc-850 p-3 text-xs rounded-xl focus:outline-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black text-xs font-mono font-bold uppercase py-3.5 rounded-xl"
                >
                  Verify and Overwrite Keys
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => { setMode('login'); setRecoveryStep(1); }}
              className="text-center font-mono text-[10px] text-zinc-500 hover:text-white block mx-auto pt-2"
            >
              ← Back to login selection
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
