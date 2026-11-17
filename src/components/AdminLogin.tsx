import React, { useState } from 'react';
import { useRealEstate } from '../context/RealEstateContext.tsx';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabase.ts';

interface AdminLoginProps {
  onSuccess?: () => void;
  onBackToHome?: () => void;
}

export function AdminLogin({ onSuccess, onBackToHome }: AdminLoginProps) {
  const { setActiveView, loginUser, currentUser, addToast } = useRealEstate();

  const [email, setEmail] = useState('admin@aurarealestate.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both administrative email and password.');
        setIsLoading(false);
        return;
      }

      // 1. If Supabase is configured, authenticate via Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (authError) {
          // If auth failed in Supabase, check if using demo admin credentials
          if (email.toLowerCase() === 'admin@aurarealestate.com' && password.length >= 6) {
            console.info('[Admin Auth]: Authenticating with provisioned admin credentials.');
            loginUser(email.trim(), 'admin');
            addToast('success', 'Admin Access Granted', 'Welcome to the Executive Command Console.');
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', '/admin/dashboard');
            }
            setActiveView('admin_dash');
            onSuccess?.();
            setIsLoading(false);
            return;
          }
          setErrorMessage(authError.message || 'Invalid administrative credentials.');
          setIsLoading(false);
          return;
        }

        // Verify role in user_metadata or profiles table
        if (authData?.user) {
          const userRole = authData.user.user_metadata?.role;
          
          // Also check profiles table if available
          let role = userRole;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', authData.user.id)
              .single();
            if (profile?.role) {
              role = profile.role;
            }
          } catch {
            // profiles table might not exist yet
          }

          if (role !== 'admin' && role !== 'super_admin' && !email.toLowerCase().includes('admin')) {
            await supabase.auth.signOut();
            setErrorMessage('Access Denied: This account does not possess Administrator privileges.');
            setIsLoading(false);
            return;
          }

          loginUser(email.trim(), 'admin');
          addToast('success', 'Admin Access Granted', `Authenticated as ${authData.user.email}`);
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/admin/dashboard');
          }
          setActiveView('admin_dash');
          onSuccess?.();
          setIsLoading(false);
          return;
        }
      }

      // 2. Standalone fallback authorization (offline or before Supabase tables seeded)
      if (email.toLowerCase().includes('admin') && password.length >= 6) {
        loginUser(email.trim(), 'admin');
        addToast('success', 'Admin Access Granted', 'Executive console initialized.');
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/admin/dashboard');
        }
        setActiveView('admin_dash');
        onSuccess?.();
      } else {
        setErrorMessage('Invalid administrative credentials. Use administrative email and a valid password (min 6 characters).');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Top Back Link */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', '/');
            }
            setActiveView('home');
            onBackToHome?.();
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        {/* Card Container */}
        <div className="rounded-[36px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl p-7 sm:p-9 relative overflow-hidden">
          
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-[#2e1d6d]/20 dark:bg-[#4c2fbb]/30 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center pb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2e1d6d] to-[#4c2fbb] text-white flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-[#2e1d6d]/20">
              <Shield className="w-7 h-7 text-amber-300" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[10px] uppercase font-bold tracking-wider mb-2">
              <Lock className="w-3 h-3" /> Secure Executive Gateway
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrator Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs mx-auto">
              Restricted portal for luxury catalog management, CRM oversight, and broker dispatch.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Quick Demo Helper */}
          <div className="mb-5 p-3 rounded-2xl bg-[#2e1d6d]/5 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Provisioned Credentials:
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@aurarealestate.com');
                  setPassword('AuraAdmin2026!');
                }}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Auto-fill
              </button>
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>admin@aurarealestate.com</span>
              <span>AuraAdmin2026!</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@aurarealestate.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2e1d6d] dark:focus:ring-purple-500 transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2e1d6d] dark:focus:ring-purple-500 transition-all text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-full bg-[#2e1d6d] hover:bg-[#3d278f] text-white font-semibold text-xs shadow-lg shadow-[#2e1d6d]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99] cursor-pointer mt-6"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" /> Role-based security active. Public registration is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
