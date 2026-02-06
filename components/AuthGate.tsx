import React, { useState, useEffect } from 'react';
import {
  UserPlus, Building2, ArrowRight, Zap, ShieldCheck,
  Sparkles, LogIn, ChevronRight, Briefcase, Users,
  Globe, Cpu, Rocket, Shield, Mail, Lock, Loader2, ArrowLeft,
  User, Check, Info, X
} from 'lucide-react';
import Tooltip from './Tooltip';
import { supabase } from '../lib/supabaseClient';

interface AuthGateProps {
  initialRole?: 'seeker' | 'employer';
  onSelectSeeker: (email: string) => void;
  onSelectEmployer: (email: string) => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

const AuthGate: React.FC<AuthGateProps> = ({ initialRole = 'seeker', onSelectSeeker, onSelectEmployer, onSignIn, onSignUp, onBack }) => {
  const [role, setRole] = useState<'seeker' | 'employer'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if initialRole changes externally
  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp();
  };

  const handleSocialSignUp = async (provider: 'google' | 'linkedin_oidc') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          data: {
            role: role,
            is_employer: role === 'employer',
            profileCompleted: false
          },
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Social Auth Error:', err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[#0a4179] overflow-y-auto custom-scrollbar flex flex-col items-center justify-start pt-10 md:pt-16 pb-12 px-4">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#41d599]/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#F0C927]/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>
      </div>

      <div className="glass w-full max-w-md rounded-[32px] md:rounded-[40px] p-6 md:p-8 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Top Navigation & Close Action - Tightened */}
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[7px] font-black uppercase tracking-widest text-[#F0C927]">
              <Sparkles size={8} className="animate-pulse" /> Identity Sync
            </div>
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-md active:scale-95"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Header Section - Reduced gap */}
        <div className="text-center mb-4 md:mb-5">
          <h2 className="text-2xl font-black uppercase tracking-tight">Create <span className="gradient-text">Identity</span></h2>
          <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.3em] mt-1">Neural synchronization v4.2</p>
        </div>

        {/* Role Segmented Control - Tightened */}
        <div className="p-1 bg-[#06213f]/60 rounded-xl border border-white/5 flex mb-4 md:mb-5 shadow-inner relative overflow-hidden">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${role === 'seeker' ? 'left-1 bg-[#F0C927]' : 'left-[calc(50%+4px)] bg-[#41d599]'
              }`}
          />
          <button
            onClick={() => setRole('seeker')}
            className={`flex-1 relative z-10 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${role === 'seeker' ? 'text-[#0a4179]' : 'text-white/30'
              }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => setRole('employer')}
            className={`flex-1 relative z-10 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${role === 'employer' ? 'text-[#0a4179]' : 'text-white/30'
              }`}
          >
            Organization
          </button>
        </div>

        {/* Social Tracks - reduced vertical footprint */}
        <div className="grid grid-cols-2 gap-3 mb-4 md:mb-5">
          <button
            onClick={() => handleSocialSignUp('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-xl transition-all active:scale-95 group disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Google</span>
          </button>
          <button
            onClick={() => handleSocialSignUp('linkedin_oidc')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-xl transition-all active:scale-95 group disabled:opacity-50"
          >
            <div className="text-[#0077b5]"><Rocket size={14} /></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">LinkedIn</span>
          </button>
        </div>

        <div className="relative mb-4 md:mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[7px] font-black uppercase tracking-[0.2em]">
            <span className="bg-[#0a4179] px-3 text-white/10 italic">or register with email</span>
          </div>
        </div>

        {/* Credentials Form - Tightened fields and gaps */}
        <form onSubmit={handleSignUp} className="space-y-3.5 md:space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/40 px-1 flex items-center gap-1.5">
              <Mail size={10} className="text-[#F0C927]/40" /> Official Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs outline-none transition-all placeholder:text-white/10 ${role === 'seeker' ? 'focus:border-[#F0C927]/50' : 'focus:border-[#41d599]/50'
                  }`}
                placeholder="name@organization.com"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/10" size={16} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/40 px-1 flex items-center gap-1.5">
              <Lock size={10} className="text-[#F0C927]/40" /> Security Hash
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs outline-none transition-all placeholder:text-white/10 ${role === 'seeker' ? 'focus:border-[#F0C927]/50' : 'focus:border-[#41d599]/50'
                  }`}
                placeholder="••••••••"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/10" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 ${role === 'seeker'
              ? 'bg-[#F0C927] text-[#0a4179] shadow-[#F0C927]/20'
              : 'bg-[#41d599] text-[#0a4179] shadow-[#41d599]/20'
              }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
            {isLoading ? 'Processing...' : 'Initialize Session'}
          </button>
        </form>

        {/* Footer Shortcut - Minimized */}
        <div className="mt-5 md:mt-6 pt-4 border-t border-white/5 text-center">
          <button
            onClick={onSignIn}
            className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 hover:text-[#F0C927] transition-colors"
          >
            Authorized? <span className="text-[#F0C927] underline underline-offset-4 font-black">Sign In Here</span>
          </button>
        </div>

        <div className="mt-2 text-center">
          <button
            onClick={onSignUp}
            className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30 hover:text-[#41d599] transition-colors"
          >
            No identity? <span className="text-[#41d599] underline underline-offset-4 font-black">Register New Identity</span>
          </button>
        </div>
      </div>

      {/* Global Status HUD */}
      <div className="flex justify-center gap-8 md:gap-12 opacity-10 pointer-events-none mt-10 pb-4">
        <div className="flex items-center gap-2">
          <Shield size={12} />
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={12} />
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Global Hub</span>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;