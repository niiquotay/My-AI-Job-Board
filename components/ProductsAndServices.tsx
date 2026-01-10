import React from 'react';
import { 
  Crown, Zap, Rocket, ShieldCheck, Star, Cpu, Video,
  Briefcase, TrendingUp, ArrowUpCircle, MessageSquare,
  Package, Check, Lock, Shield, Layers, Target,
  DollarSign, Globe, Smartphone, Sparkles, Award,
  Plus, AlertCircle, ShoppingCart, History,
  CheckCircle2, ChevronRight, Vault
} from 'lucide-react';
import { UserProfile } from '../types';
import Tooltip from './Tooltip';

interface ProductsAndServicesProps {
  user: UserProfile;
  onUpgradeRequest: (type?: 'seeker' | 'employer', tierId?: string) => void;
}

const seekerProducts = [
  {
    id: 'seeker_premium',
    creditKey: null,
    name: 'Seeker Premium',
    price: '$28/yr',
    desc: 'Full AI career power.',
    icon: Crown,
    color: 'text-[#F0C927]',
    bgColor: 'bg-[#F0C927]/10',
    features: ['Match Intelligence', 'Video Intro Sync', 'Stealth Protocol']
  },
  {
    id: 'ai_interview_sim',
    creditKey: null,
    name: 'Interview Sim',
    price: 'Free',
    desc: 'Practice with Gemini 3.',
    icon: Video,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    features: ['Sentiment Analysis', 'STAR Method Grading']
  }
];

const employerProducts = [
  {
    id: 'employer_standard',
    creditKey: 'standard',
    name: 'Standard Post',
    price: '$28/ea',
    desc: 'Listed in verified feed.',
    icon: Briefcase,
    color: 'text-[#41d599]',
    bgColor: 'bg-[#41d599]/10',
    features: ['7-Day Visibility', 'Basic Candidate ATS', 'Email Sync']
  },
  {
    id: 'employer_premium',
    creditKey: 'premium',
    name: 'Gold Tier',
    price: '$100/ea',
    desc: '10x visibility boost.',
    icon: Award,
    color: 'text-[#F0C927]',
    bgColor: 'bg-[#F0C927]/10',
    features: ['Pinned Feed Header', 'Direct Push Alerts', 'AI Candidate Rank']
  },
  {
    id: 'employer_shortlist',
    creditKey: 'shortlist',
    name: 'Shortlist',
    price: '$250/ea',
    desc: '24h vetted delivery.',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    features: ['24h Screened Lists', 'Video Vetting Tools', 'Hiring Manager']
  },
  {
    id: 'employer_professional',
    creditKey: null,
    name: 'Elite Search',
    price: 'Custom',
    desc: 'Full executive search.',
    icon: Rocket,
    color: 'text-[#1F8E85]',
    bgColor: 'bg-[#1F8E85]/10',
    features: ['End-to-End Cycle', 'Confidential Search', 'Negotiable Fee']
  }
];

const ProductsAndServices: React.FC<ProductsAndServicesProps> = ({ user, onUpgradeRequest }) => {
  const isEmployer = user.isEmployer;
  const credits = user.productCredits || { standard: 0, premium: 0, shortlist: 0 };

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-700 text-white pb-10 px-2 md:px-0">
      {/* Header Section - Minimized */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#F0C927]">
            <Sparkles size={10} /> Marketplace
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none">
            {isEmployer ? 'Enterprise ' : 'Career '}
            <span className="gradient-text">Services</span>
          </h1>
          <p className="text-white/30 text-xs font-medium leading-relaxed max-w-lg">
            Manage acquisition inventory and provision high-performance licenses.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/30 hover:text-white transition-all active:scale-95">
             <History size={14} />
          </button>
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F0C927]/10 border border-[#F0C927]/20">
             <div className="w-1 h-1 rounded-full bg-[#F0C927] animate-pulse"></div>
             <span className="text-xs font-black uppercase tracking-widest text-[#F0C927]">Vault Synced</span>
          </div>
        </div>
      </div>

      {/* Main Grid - Compact Density */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <div className="p-1 rounded-md bg-[#41d599]/10 text-[#41d599] border border-[#41d599]/20">
             <Vault size={12} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight">Active <span className="text-[#41d599]">Inventory Vault</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
           { (isEmployer ? employerProducts : seekerProducts).map(prod => {
             const availableCredits = isEmployer && prod.creditKey ? (credits[prod.creditKey as keyof typeof credits] || 0) : null;
             const hasCredits = availableCredits !== null && availableCredits > 0;
             
             return (
               <div key={prod.id} className="flex flex-col">
                  <div className={`glass h-full rounded-[18px] p-3.5 border-white/5 space-y-3 shadow-lg flex flex-col relative overflow-hidden group transition-all hover:-translate-y-0.5 hover:bg-white/[0.03]`}>
                     
                     {/* ENHANCED CREDIT BADGE - Visibility Fix */}
                     {availableCredits !== null && (
                       <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-[18px] border-l border-b transition-all z-10 ${hasCredits ? 'bg-[#41d599] border-[#41d599]/20 shadow-[0_4px_12px_rgba(65,213,153,0.3)]' : 'bg-white/5 border-white/10 opacity-40'}`}>
                          <div className="flex flex-col items-center">
                            <p className={`text-xs font-black tracking-tighter ${hasCredits ? 'text-[#0a4179]' : 'text-white/20'}`}>
                              {availableCredits}
                            </p>
                            <p className={`text-[8px] font-black uppercase tracking-widest -mt-0.5 ${hasCredits ? 'text-[#0a4179]/60' : 'text-white/10'}`}>
                              Units
                            </p>
                          </div>
                       </div>
                     )}

                     <div className="flex items-center gap-2 pt-1">
                        <div className={`w-7 h-7 rounded-lg ${prod.bgColor} ${prod.color} flex items-center justify-center shadow-md`}>
                           <prod.icon size={14} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-tight leading-tight flex-1 truncate pr-10">{prod.name}</h4>
                     </div>

                     <p className="text-xs text-white/40 font-medium leading-snug line-clamp-2">{prod.desc}</p>

                     {/* Features List - Tiny Density */}
                     <div className="space-y-1 py-1">
                        {prod.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-white/60">
                             <CheckCircle2 size={10} className={prod.color} />
                             <span className="truncate">{feature}</span>
                          </div>
                        ))}
                     </div>

                     <div className="pt-2.5 border-t border-white/5 space-y-3 mt-auto">
                        <div className="flex justify-between items-center px-0.5">
                           <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Rate</span>
                           <span className="text-xs font-black text-white/80">{prod.price}</span>
                        </div>
                        <button 
                          onClick={() => onUpgradeRequest(isEmployer ? 'employer' : 'seeker', prod.id)}
                          className={`w-full py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-[#F0C927] hover:text-[#0a4179] hover:border-[#F0C927] shadow-md`}
                        >
                           <Plus size={12} /> Provision
                        </button>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>

        {/* Updated Replenishment Protocol - Showing Actual Balances */}
        {isEmployer && (
          <div className="glass rounded-[24px] p-6 border-[#F0C927]/20 bg-[#F0C927]/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-1 shadow-2xl">
             <div className="flex items-center gap-5 flex-1 w-full">
                <div className="w-12 h-12 rounded-2xl bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] border border-[#F0C927]/20 shadow-lg">
                   <AlertCircle size={24} />
                </div>
                <div className="space-y-3 flex-1">
                   <div>
                      <h3 className="text-sm font-black uppercase tracking-widest leading-none">Replenishment Protocol</h3>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1.5">Live Vault Balance Monitoring</p>
                   </div>
                   
                   {/* Detailed Balance Grid */}
                   <div className="grid grid-cols-3 gap-4 max-w-md pt-1">
                      <div className="space-y-1">
                         <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Standard</p>
                         <div className="flex items-baseline gap-1.5">
                            <span className={`text-lg font-black leading-none ${credits.standard > 0 ? 'text-[#41d599]' : 'text-red-400'}`}>{credits.standard}</span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">UNITS</span>
                         </div>
                      </div>
                      <div className="space-y-1 border-l border-white/5 pl-4">
                         <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Gold Tier</p>
                         <div className="flex items-baseline gap-1.5">
                            <span className={`text-lg font-black leading-none ${credits.premium > 0 ? 'text-[#F0C927]' : 'text-red-400'}`}>{credits.premium}</span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">UNITS</span>
                         </div>
                      </div>
                      <div className="space-y-1 border-l border-white/5 pl-4">
                         <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Shortlist</p>
                         <div className="flex items-baseline gap-1.5">
                            <span className={`text-lg font-black leading-none ${credits.shortlist > 0 ? 'text-blue-400' : 'text-red-400'}`}>{credits.shortlist}</span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter">UNITS</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             <div className="shrink-0">
                <button 
                  onClick={() => onUpgradeRequest('employer', 'employer_standard')}
                  className="px-8 py-4 bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-xl shadow-[#F0C927]/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Replenish Vault
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Advisory Footer - Reduced scale by 50% */}
      <div className="glass rounded-[24px] p-6 border-white/10 bg-gradient-to-br from-[#0a4179] to-[#06213f] flex items-center justify-between gap-6 shadow-xl relative overflow-hidden group mt-4">
         <div className="absolute top-[-10px] left-[-10px] opacity-10 group-hover:rotate-6 transition-transform duration-1000">
            <Sparkles size={120} className="text-[#F0C927]" />
         </div>
         <div className="relative z-10 flex-1 space-y-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-400/10 border border-blue-400/20 text-[8px] font-black uppercase tracking-widest text-blue-400">
               <Target size={10} /> Strategic Advisory
            </div>
            <h3 className="text-sm md:text-lg font-black tracking-tight uppercase">
               Bespoke <span className="text-[#F0C927]">Talent Strategy?</span>
            </h3>
            <p className="text-xs text-white/40 leading-relaxed max-w-md font-medium">
               Custom hiring architecture for global firm partners. We specialize in high-stakes human capital deployment.
            </p>
         </div>
         <div className="relative z-10 shrink-0">
            <button className="group px-6 py-3.5 bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-[0.1em] text-xs rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <MessageSquare size={14} fill="currentColor" /> 
               Consultant
               <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProductsAndServices;