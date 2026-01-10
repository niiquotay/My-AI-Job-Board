import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowLeft, Loader2, ShieldCheck, AlertCircle, Linkedin, ShieldAlert, Users, ChevronRight, Sparkles, Info, Key } from 'lucide-react';
import { MOCK_USER, MOCK_EMPLOYER, STAFF_ACCOUNTS } from '../constants';
import { UserProfile, OperationalRole } from '../types';

interface SignInProps {
  onSignIn: (user: UserProfile) => void;
  onBack: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStaffPortal, setShowStaffPortal] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated auth delay
    setTimeout(() => {
      const emailLower = email.toLowerCase();
      
      // Admin Check
      if (emailLower === 'admin@jobconnect.ai' && password === 'admin123') {
        onSignIn(STAFF_ACCOUNTS.super_admin);
        setIsLoading(false);
        return;
      }

      // Seeker Check (Kester)
      if (emailLower === MOCK_USER.email.toLowerCase() && password === 'user123') {
        onSignIn(MOCK_USER);
        setIsLoading(false);
        return;
      }

      // Employer Check (James Miller)
      if (emailLower === MOCK_EMPLOYER.email.toLowerCase() && password === 'employer123') {
        onSignIn(MOCK_EMPLOYER);
        setIsLoading(false);
        return;
      }

      // Other Staff Accounts (Check email match for staff, password 'staff123')
      const staffMatch = Object.values(STAFF_ACCOUNTS).find(s => s.email.toLowerCase() === emailLower);
      if (staffMatch && password === 'staff123') {
        onSignIn(staffMatch);
        setIsLoading(false);
        return;
      }

      // Fallback for new accounts
      if (email.includes('@') && password.length >= 6) {
        onSignIn({
          ...MOCK_USER,
          name: email.split('@')[0],
          email: email,
          profileCompleted: false,
          isSubscribed: false,
          subscriptionTier: 'free',
          purchaseHistory: [],
          profileImages: []
        });
      } else {
        setError("Invalid credentials. Try admin@jobconnect.ai / admin123 or check demo info.");
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleSocialLogin = (provider: 'Google' | 'LinkedIn') => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      // For demo, social login logs you in as the Mock User (Kester)
      onSignIn(MOCK_USER);
      setIsLoading(false);
    }, 1500);
  };

  const handleStaffLoginShortcut = (role: OperationalRole) => {
    setIsLoading(true);
    setTimeout(() => {
      onSignIn(STAFF_ACCOUNTS[role]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a4179] text-white overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#41d599]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2ea38e]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="glass w-full max-w-md rounded-[40px] p-10 border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between mb-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </button>
          
          <button 
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className={`p-2 rounded-xl border transition-all ${showDemoInfo ? 'bg-[#F0C927] text-[#0a4179] border-[#F0C927]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
          >
            <Info size={16} />
          </button>
        </div>

        {showDemoInfo && (
          <div className="mb-8 p-6 rounded-3xl bg-[#F0C927]/10 border border-[#F0C927]/30 space-y-4 animate-in slide-in-from-top-4 overflow-y-auto max-h-[300px] custom-scrollbar">
             <h4 className="text-xs font-black uppercase tracking-widest text-[#F0C927] flex items-center gap-2">
               <Key size={14} /> Demo Credentials
             </h4>
             <div className="space-y-4">
               <div>
                 <p className="text-[9px] font-black uppercase text-white/40">Super Admin (Full Access)</p>
                 <p className="text-xs font-mono text-white/80">admin@jobconnect.ai / admin123</p>
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase text-white/40">Mock Employer (Hiring Hub)</p>
                 <p className="text-xs font-mono text-white/80">hiring@quantify.ai / employer123</p>
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase text-white/40">Mock Seeker (Talent Portal)</p>
                 <p className="text-xs font-mono text-white/80">niidjanie@gmail.com / user123</p>
               </div>
               <div>
                 <p className="text-[9px] font-black uppercase text-white/40">Other Staff Accounts</p>
                 <p className="text-xs font-mono text-white/80">Use any staff email / staff123</p>
               </div>
             </div>
          </div>
        )}

        {!showStaffPortal ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black">Secure Sign In</h2>
              <p className="text-white/40 text-xs mt-2 font-medium">Access your recruitment studio and AI copilot</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleSocialLogin('Google')} 
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-2xl transition-all active:scale-95 group disabled:opacity-50 shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Google</span>
              </button>
              <button 
                onClick={() => handleSocialLogin('LinkedIn')} 
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-2xl transition-all active:scale-95 group disabled:opacity-50 shadow-lg"
              >
                <Linkedin size={16} className="text-[#0077b5]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">LinkedIn</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.2em]">
                <span className="bg-[#0a4179] px-4 text-white/20">or use email</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 mb-6 animate-in slide-in-from-top-2">
                <AlertCircle className="text-red-400 shrink-0" size={18} />
                <p className="text-xs text-red-400 font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Professional Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                    placeholder="name@company.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Password</label>
                  <button type="button" className="text-[9px] font-black uppercase text-[#41d599] hover:underline">Recovery</button>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#41d599] text-[#0a4179] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-[#41d599]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                {isLoading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5">
              <button 
                onClick={() => setShowStaffPortal(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group border border-transparent hover:border-[#F0C927]/30"
              >
                <div className="flex items-center gap-3">
                   <ShieldAlert size={20} className="text-[#F0C927]" />
                   <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#F0C927]">Staff Entrance</p>
                      <p className="text-[9px] text-white/30 uppercase">Operations, CRM & Finance</p>
                   </div>
                </div>
                <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <button onClick={() => setShowStaffPortal(false)} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 group">
              <ArrowLeft size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Regular Login</span>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-[#F0C927]">Staff Portal</h2>
              <p className="text-white/40 text-xs mt-2 uppercase font-black tracking-widest">Select Department (Shortcut)</p>
            </div>

            <div className="grid gap-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
              {(Object.keys(STAFF_ACCOUNTS) as OperationalRole[]).map((role) => (
                <button 
                  key={role}
                  onClick={() => handleStaffLoginShortcut(role)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#F0C927]/30 transition-all group text-left shadow-md"
                >
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest group-hover:text-[#F0C927] transition-colors">{role.replace('_', ' ')}</p>
                      <p className="text-[9px] text-white/30 uppercase font-bold">{STAFF_ACCOUNTS[role].name}</p>
                   </div>
                   <ShieldCheck size={16} className="text-white/10 group-hover:text-[#41d599]" />
                </button>
              ))}
            </div>
            <div className="pt-4 text-center border-t border-white/5">
              <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Authorized Staff Personnel Only</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
