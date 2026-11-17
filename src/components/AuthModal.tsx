import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  X,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, loginUser, switchUserRole } = useRealEstate();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'otp'>(authMode);
  const [email, setEmail] = useState('alexander@aura-client.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [otpCode, setOtpCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'otp') {
      loginUser(email, selectedRole);
      return;
    }
    if (mode === 'register') {
      setMode('otp');
      return;
    }
    loginUser(email, selectedRole, password);
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    loginUser(demoEmail, role);
    switchUserRole(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 shadow-2xl border border-white/60 dark:border-white/10 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2e1d6d] to-[#4c2fbb] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {mode === 'login' && 'Welcome to AURA'}
            {mode === 'register' && 'Create Your Private Account'}
            {mode === 'forgot' && 'Reset Account Password'}
            {mode === 'otp' && 'Verify Mobile OTP'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access exclusive off-market listings, scheduled tours, and concierge services.
          </p>
        </div>

        {/* Quick Role Tester Pills */}
        <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 mb-5">
          <span className="block text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider mb-2 text-center">
            One-Click Verified Demo Access
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer', 'alexander@aura-client.com')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs font-semibold text-slate-800 dark:text-slate-200 text-center hover:bg-purple-50"
            >
              VIP Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('agent', 'm.vance@aurarealestate.com')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs font-semibold text-slate-800 dark:text-slate-200 text-center hover:bg-purple-50"
            >
              Agent CRM
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin@aurarealestate.com')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs font-semibold text-slate-800 dark:text-slate-200 text-center hover:bg-purple-50"
            >
              Admin HQ
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'otp' ? (
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Enter 6-Digit Verification Code sent to {email}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                placeholder="482910"
                className="w-full text-center text-xl font-mono tracking-widest px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white outline-none"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@aurarealestate.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Security Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#4c2fbb] dark:text-purple-400 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#2e1d6d] hover:bg-[#3d278f] text-white text-xs font-semibold shadow-lg transition-transform active:scale-98"
          >
            {mode === 'login' && 'Sign In to Portal'}
            {mode === 'register' && 'Continue to Verification'}
            {mode === 'forgot' && 'Send Reset Link'}
            {mode === 'otp' && 'Verify & Enter Portal'}
          </button>
        </form>

        {/* Bottom Switcher */}
        <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-semibold text-[#4c2fbb] dark:text-purple-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-[#4c2fbb] dark:text-purple-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
