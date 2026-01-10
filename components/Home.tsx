import React from 'react';
import { 
  Briefcase, ArrowRight, Shield, Zap, Sparkles, Globe, UserCheck, 
  BarChart3, FileText, Search, Crown, MapPin, DollarSign, 
  ChevronRight, Target, Video, EyeOff, BellRing, Wand2, Users, Cpu,
  UserPlus, Building, LogIn, FileStack, MessageSquare, ShieldCheck,
  Fingerprint, Layers, Receipt, Smartphone, Package, Award, Check,
  ShoppingCart, Landmark, Settings, CheckCircle2, ShieldAlert,
  Monitor, Building2, FileCheck
} from 'lucide-react';
import { Job, ViewType } from '../types';
import Tooltip from './Tooltip';

interface HomeProps {
  onSeekerSignUp: () => void;
  onEmployerSignUp: () => void;
  onSignInClick: () => void;
  onViewCompany: (name: string) => void;
  onNavigateToModule: (view: ViewType) => void;
  premiumJobs: Job[];
  userCountry?: string;
}

const Home: React.FC<HomeProps> = ({ 
  onSeekerSignUp, 
  onEmployerSignUp, 
  onSignInClick, 
  onViewCompany, 
  onNavigateToModule,
  premiumJobs, 
  userCountry 
}) => {
  const companies = [
    "Nexus AI", "FinFlow", "Loom Studio", "Quantum Dynamics", "Stripe", "Airbnb", 
    "Vercel", "Linear", "Raycast", "Arc Browser", "OpenAI", "Anthropic"
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start p-6 custom-scrollbar text-white">
      <div className="max-w-5xl w-full space-y-8 relative z-10 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#F0C927] mb-1 animate-bounce">
            <Sparkles size={12} /> The Future of Business is AI
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase text-white">
            NO PLAY; <br />
            <span className="gradient-text">JUST JOBS</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
            AI-JobConnect is the definitive recruitment intelligence platform. Manage your talent acquisition, human capital, and professional trajectory in one unified ecosystem.
          </p>
          <div className="pt-2 flex flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Tooltip text="Create a professional profile, upload your CV, and start applying to AI-matched roles instantly.">
                <button 
                  onClick={onSeekerSignUp}
                  className="group flex items-center gap-3 bg-[#F0C927] hover:bg-[#F0C927]/90 text-[#0a4179] px-8 py-4 rounded-2xl transition-all duration-300 font-black text-sm shadow-xl shadow-[#F0C927]/20 active:scale-95 hover:-translate-y-1"
                >
                  <UserPlus size={20} />
                  Job Seeker Sign Up
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Tooltip>
              
              <Tooltip text="Access our hiring studio to post job listings, manage applicant pipelines, and use the Employer AI Copilot.">
                <button 
                  onClick={onEmployerSignUp}
                  className="group relative flex items-center gap-3 bg-[#1F8E85] hover:bg-[#1F8E85]/90 text-white px-8 py-4 rounded-2xl border border-white/10 transition-all duration-300 font-black text-sm active:scale-95 hover:-translate-y-1"
                >
                  <Building size={20} />
                  Employer Sign Up
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Tooltip>
            </div>
            
            <button 
              onClick={onSignInClick}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all group"
            >
              <LogIn size={14} className="group-hover:translate-x-1 transition-transform text-[#F0C927]" />
              Already have an account? <span className="underline decoration-[#F0C927]/30 underline-offset-8">Sign In</span>
            </button>
          </div>
        </div>

        {/* Featured Premium Jobs List */}
        {premiumJobs.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F0C927]/10 rounded-lg border border-[#F0C927]/20 text-[#F0C927]">
                  <Crown size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Priority Roles in {userCountry || 'Global'}</h3>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Premium Market Opportunities</p>
                </div>
              </div>
              <button onClick={onSeekerSignUp} className="text-xs font-black uppercase tracking-widest text-[#F0C927] hover:text-white transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                View All Jobs <ArrowRight size={14} />
              </button>
            </div>

            <div className="glass rounded-[32px] overflow-hidden shadow-2xl border-white/5">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                {premiumJobs.map((job) => (
                  <Tooltip key={job.id} text={`Apply to ${job.title} at ${job.company}. Position based in ${job.city}.`} className="w-full">
                    <div 
                      className="group hover:bg-[#F0C927]/5 transition-all duration-300 p-4 md:px-8 md:py-4 flex items-center justify-between cursor-pointer gap-4 hover:shadow-2xl border-l-[4px] border-l-transparent hover:border-l-[#F0C927] relative"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Tooltip text={`View ${job.company} Company Profile`}>
                          <div 
                            onClick={(e) => { e.stopPropagation(); onViewCompany(job.company); }}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black border border-[#F0C927]/20 text-xs text-[#F0C927] group-hover:bg-[#F0C927] group-hover:text-[#0a4179] transition-all overflow-hidden cursor-pointer shadow-inner"
                          >
                            {job.logoUrl ? (
                              <img src={job.logoUrl} alt={job.company} className="w-full h-full object-cover" />
                            ) : (
                              <span className="uppercase">{job.company?.charAt(0) || '?'}</span>
                            )}
                          </div>
                        </Tooltip>
                        <div className="min-w-0 flex-1" onClick={onSeekerSignUp}>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-[#F0C927] group-hover:text-white transition-colors truncate">{job.title}</h4>
                            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#F0C927]/10 text-[#F0C927] border border-[#F0C927]/20 text-[6px] font-black uppercase tracking-[0.2em]">
                              <Crown size={8} /> Premium
                            </span>
                          </div>
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-0.5">
                            <p 
                              onClick={(e) => { e.stopPropagation(); onViewCompany(job.company); }}
                              className="text-xs text-white/50 font-bold truncate hover:text-[#F0C927] hover:underline"
                            >
                              {job.company}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] text-white/30 font-black uppercase tracking-wider">
                              <MapPin size={10} className="text-[#F0C927]/60" /> {job.city}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 shrink-0" onClick={onSeekerSignUp}>
                        <div className="hidden md:flex flex-col items-end">
                          <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Comp.</p>
                          <div className="flex items-center gap-1 text-sm font-black text-[#41d599] whitespace-nowrap">
                            <DollarSign size={12} /> {job.salary}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-[#F0C927]/20 flex items-center justify-center text-[#F0C927] group-hover:bg-[#F0C927] group-hover:text-[#0a4179] transition-all">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services & Solutions Section */}
        <section className="space-y-6 py-8 border-t border-white/5 relative">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black tracking-tight uppercase">Platform <span className="text-[#41d599]">Solutions</span></h2>
            <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.3em]">Specialized protocols for high-stakes hiring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* For Talent */}
            <div className="glass rounded-[32px] p-6 border-white/5 flex flex-col gap-6 relative overflow-hidden group hover:bg-white/[0.03] transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-white pointer-events-none group-hover:scale-110 transition-transform">
                <Target size={120} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#F0C927]/10 text-[#F0C927] flex items-center justify-center border border-[#F0C927]/20">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">For Seeker Identity</h3>
                  <p className="text-[8px] text-[#F0C927] font-black uppercase tracking-tighter">Maximize Market Visibility</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'AI Match Scores', icon: Zap },
                  { label: 'Video Pitches', icon: Video },
                  { label: 'CV Optimization', icon: FileStack },
                  { label: 'Interview Prep', icon: Monitor }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <item.icon size={12} className="text-[#F0C927]" />
                    <span className="text-[9px] font-bold text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={onSeekerSignUp} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-[#F0C927] hover:text-[#0a4179] transition-all">Initialize Seeker Track</button>
            </div>

            {/* For Organizations */}
            <div className="glass rounded-[32px] p-6 border-white/5 flex flex-col gap-6 relative overflow-hidden group hover:bg-white/[0.03] transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-white pointer-events-none group-hover:scale-110 transition-transform">
                <Building2 size={120} />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#41d599]/10 text-[#41d599] flex items-center justify-center border border-[#41d599]/20">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">For Organizations</h3>
                  <p className="text-[8px] text-[#41d599] font-black uppercase tracking-tighter">Next-Gen Talent Acquisition</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Employer AI Copilot', icon: Cpu },
                  { label: 'Shortlist Service', icon: Award },
                  { label: 'Aptitude Testing', icon: FileCheck },
                  { label: 'Pipeline Analytics', icon: BarChart3 }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <item.icon size={12} className="text-[#41d599]" />
                    <span className="text-[9px] font-bold text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={onEmployerSignUp} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-[#41d599] hover:text-[#0a4179] transition-all">Deploy Enterprise Track</button>
            </div>
          </div>
        </section>

        {/* Unified Ecosystem Grid - Refined Layout & Reduced Height */}
        <section className="space-y-4 py-6 border-t border-white/5 relative">
           <div className="text-center space-y-1">
              <h2 className="text-xl font-black tracking-tight uppercase">Unified <span className="text-[#F0C927]">Business Ecosystem</span></h2>
              <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.3em]">The complete organizational management suite</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Tooltip text="Current Module: Access the world-class recruitment marketplace.">
                <div className="glass rounded-2xl p-4 border-[#F0C927]/30 bg-[#F0C927]/5 shadow-lg transition-all cursor-default flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-[#F0C927] text-[#0a4179] flex items-center justify-center mb-3 shadow-md">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="text-xs font-black uppercase mb-1">Job Board</h3>
                  <div className="flex items-center gap-1.5 text-[#F0C927] text-[7px] font-black uppercase tracking-widest">
                    <Check size={8} /> Active Module
                  </div>
                </div>
              </Tooltip>

              <div 
                onClick={() => onNavigateToModule('hrm-landing')}
                className="glass group rounded-2xl p-4 border-white/5 hover:border-[#41d599]/40 hover:bg-[#41d599]/5 transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#41d599] group-hover:text-[#0a4179] flex items-center justify-center mb-3 transition-all">
                  <Users size={18} />
                </div>
                <h3 className="text-xs font-black uppercase mb-1 group-hover:text-[#41d599]">HRM Solution</h3>
                <div className="flex items-center gap-1 text-white/20 group-hover:text-[#41d599] text-[7px] font-black uppercase tracking-widest">
                  Deploying Q3 <ChevronRight size={8} />
                </div>
              </div>

              <div 
                onClick={() => onNavigateToModule('payroll-landing')}
                className="glass group rounded-2xl p-4 border-white/5 hover:border-blue-400/40 hover:bg-blue-400/5 transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-400 group-hover:text-[#0a4179] flex items-center justify-center mb-3 transition-all">
                  <Landmark size={18} />
                </div>
                <h3 className="text-xs font-black uppercase mb-1 group-hover:text-blue-400">Payroll Studio</h3>
                <div className="flex items-center gap-1 text-white/20 group-hover:text-blue-400 text-[7px] font-black uppercase tracking-widest">
                  Deploying Q4 <ChevronRight size={8} />
                </div>
              </div>

              <div 
                onClick={() => onNavigateToModule('vendor-landing')}
                className="glass group rounded-2xl p-4 border-white/5 hover:border-purple-400/40 hover:bg-purple-400/5 transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 group-hover:bg-purple-400 group-hover:text-[#0a4179] flex items-center justify-center mb-3 transition-all">
                  <ShoppingCart size={18} />
                </div>
                <h3 className="text-xs font-black uppercase mb-1 group-hover:text-purple-400">Vendors Hub</h3>
                <div className="flex items-center gap-1 text-white/20 group-hover:text-purple-400 text-[7px] font-black uppercase tracking-widest">
                  Beta Testing <ChevronRight size={8} />
                </div>
              </div>
           </div>
        </section>

        {/* Global Footer Logos */}
        <div className="py-6 border-b border-white/5 relative overflow-hidden">
          <div className="text-center mb-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Trusted by industry-leading teams</p>
          </div>
          <div className="relative flex items-center">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-16 md:gap-32">
              {[...companies, ...companies].map((name, i) => (
                <Tooltip key={i} text={`Hiring partner: ${name}.`}>
                  <div 
                    onClick={() => onViewCompany(name)}
                    className="flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-[#F0C927] group-hover:bg-[#F0C927]/10 transition-all shadow-inner">
                      {name[0]}
                    </div>
                    <span className="text-[10px] font-bold tracking-tight text-white/40 group-hover:text-white transition-colors">{name}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a4179] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a4179] to-transparent z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;