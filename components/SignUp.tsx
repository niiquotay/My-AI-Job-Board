import React, { useState } from 'react';
import {
    ArrowRight, Mail, Lock, User, MapPin, Globe, Phone,
    ArrowLeft, Loader2, ShieldCheck, AlertCircle,
    Sparkles, Info, Key, Building2, UserPlus, Linkedin
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface SignUpProps {
    onSignUp: (user: UserProfile) => void;
    onBack: () => void;
    onSignInClick: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onBack, onSignInClick }) => {
    const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('Global');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Register with Supabase Auth
            const { data, error: sbError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                        phone: phone,
                        city: city,
                        country: country,
                        is_employer: role === 'employer'
                    }
                }
            });

            if (sbError) throw sbError;

            if (data.user) {
                setSuccess(true);
                // We'll let the user know they need to check their email if confirmation is on
                // or just log them in if it's off. 
                // For this demo, we'll wait a bit and then maybe proceed or show success.
            }

        } catch (err: any) {
            setError(err.message || 'Error creating account');
            setIsLoading(false);
        }
    };

    const handleSocialSignUp = async (provider: 'google' | 'linkedin_oidc') => {
        setIsLoading(true);
        setError(null);
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
            setError(err.message || `Failed to initialize ${provider} synchronization`);
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a4179] text-white relative">
                <div className="glass w-full max-w-md rounded-[40px] p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-[#41d599]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={40} className="text-[#41d599]" />
                    </div>
                    <h2 className="text-3xl font-black">Account Initialized</h2>
                    <p className="text-white/60">
                        We've sent a synchronization link to <span className="text-[#41d599] font-bold">{email}</span>.
                        Please verify your identity to activate your neural profile.
                    </p>
                    <button
                        onClick={onSignInClick}
                        className="w-full bg-[#41d599] text-[#0a4179] py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a4179] text-white overflow-y-auto relative py-20">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#41d599]/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#F0C927]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="glass w-full max-w-xl rounded-[40px] p-8 md:p-10 border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Sparkles size={12} className="text-[#F0C927]" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">New Identity Sync</span>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black">Join the Network</h2>
                    <p className="text-white/40 text-xs mt-2 font-medium uppercase tracking-[0.2em]">Create your professional AI-matched profile</p>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setRole('seeker')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${role === 'seeker' ? 'bg-[#F0C927] border-[#F0C927] text-[#0a4179]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                        <User size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Job Seeker</span>
                    </button>
                    <button
                        onClick={() => setRole('employer')}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${role === 'employer' ? 'bg-[#41d599] border-[#41d599] text-[#0a4179]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                        <Building2 size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Employer</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => handleSocialSignUp('google')}
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
                        onClick={() => handleSocialSignUp('linkedin_oidc')}
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
                        <span className="bg-[#0a4179] px-4 text-white/20">or use credentials</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 mb-6 animate-in slide-in-from-top-2">
                        <AlertCircle className="text-red-400 shrink-0" size={18} />
                        <p className="text-xs text-red-400 font-bold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSignUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="John Doe"
                            />
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="name@example.com"
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="+1 234 567 890"
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">City</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="New York"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Country</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#41d599] outline-none transition-all placeholder:text-white/10"
                                placeholder="United States"
                            />
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-95 ${role === 'seeker' ? 'bg-[#F0C927] text-[#0a4179] shadow-[#F0C927]/20' : 'bg-[#41d599] text-[#0a4179] shadow-[#41d599]/20'}`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                            {isLoading ? "Synchronizing..." : "Initialize Identity"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-4">Already have an identity?</p>
                    <button
                        onClick={onSignInClick}
                        className="text-[#41d599] text-xs font-black uppercase tracking-widest hover:underline underline-offset-4"
                    >
                        Sign In to Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
