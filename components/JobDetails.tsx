// @ts-nocheck
import React, { useMemo, useState } from 'react';
import { Job, UserProfile, Application } from '../types';
import { 
  ArrowLeft, MapPin, Globe, DollarSign, Calendar, Briefcase, 
  ChevronRight, Crown, Check, Play, Send, ShieldCheck, Share2, Info, Users,
  Linkedin, Facebook, MessageCircle, Mail, Copy, Link as LinkIcon, AlertTriangle,
  CheckCircle2, ExternalLink, ClipboardList, FileStack, Lock, Heart, Wand2, FileCheck, Zap,
  Clock, Building, Shield, Gift, Coins
} from 'lucide-react';
import Toast from './Toast';
import Tooltip from './Tooltip';
import { isJobActuallyActive } from '../constants';

interface JobDetailsProps {
  job: Job;
  allJobs: Job[];
  user: UserProfile;
  applications: Application[];
  onBack: () => void;
  onApply: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  onInspectMatch: (job: Job) => void;
  onViewCompany: (companyName: string) => void;
  onLaunchCoach: () => void;
  onTakeTest: (job: Job) => void;
  onEdit?: (job: Job) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job, allJobs, user, applications, onBack, onApply, onSelectJob, onInspectMatch, onViewCompany, onLaunchCoach, onTakeTest, onEdit }) => {
  const application = applications.find(a => a.jobId === job.id);
  const isApplied = !!application;
  const isActive = isJobActuallyActive(job);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20 text-white animate-in fade-in duration-500 px-4 md:px-0">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between px-1">
        <button onClick={onBack} className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
        </button>
        <div className="px-3 py-1 rounded-xl bg-[#41d599]/10 text-[#41d599] border border-[#41d599]/20 flex items-center gap-1.5">
           <ShieldCheck size={14} />
           <span className="text-[8px] font-black uppercase tracking-widest">Verified Role</span>
        </div>
      </div>

      <div className="glass rounded-[28px] p-6 md:p-8 relative overflow-hidden shadow-2xl border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
           <div onClick={() => onViewCompany(job.company)} className="w-16 h-16 md:w-24 md:h-24 rounded-[28px] bg-[#0a4179] flex items-center justify-center text-3xl font-black border border-white/20 shadow-xl cursor-pointer hover:bg-[#F0C927] hover:text-[#0a4179] transition-all overflow-hidden shrink-0">
             {job.logoUrl ? <img src={job.logoUrl} className="w-full h-full object-cover" /> : <span>{job.company[0]}</span>}
           </div>
           <div className="flex-1 space-y-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                 <span onClick={() => onViewCompany(job.company)} className="text-sm font-bold text-[#F0C927] cursor-pointer hover:underline">{job.company}</span>
                 {job.isPremium && <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#F0C927]/10 text-[#F0C927] border border-[#F0C927]/20 text-[7px] font-black uppercase tracking-widest"><Crown size={8} /> Premium</span>}
                 <span className="text-[8px] font-black uppercase text-white/30 tracking-[0.2em] flex items-center gap-1.5"><MapPin size={10} className="text-[#F0C927]" /> {job.city}, {job.country}</span>
              </div>
           </div>
           <div className="flex gap-2 shrink-0">
              {isApplied ? (
                <div className="px-6 py-3 rounded-xl bg-[#41d599]/10 text-[#41d599] font-black uppercase tracking-widest text-[9px] border border-[#41d599]/20 flex items-center gap-2"><Check size={14} /> Applied</div>
              ) : (
                <button onClick={() => onApply(job)} className="px-10 py-3.5 rounded-xl bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-[9px] shadow-xl hover:scale-105 transition-all">Initialize Deployment</button>
              )}
              <button onClick={() => onInspectMatch(job)} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[#F0C927] hover:bg-white/10 transition-all"><Play size={18} fill="currentColor" /></button>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-white/5">
           <div className="space-y-0.5"><p className="text-[7px] font-black uppercase text-white/20 tracking-widest">Remuneration</p><p className="text-xs font-black text-[#41d599]">{job.salary}</p></div>
           <div className="space-y-0.5"><p className="text-[7px] font-black uppercase text-white/20 tracking-widest">Protocol</p><p className="text-xs font-black uppercase">{job.employmentType || 'Full-time'}</p></div>
           <div className="space-y-0.5"><p className="text-[7px] font-black uppercase text-white/20 tracking-widest">Operational Rank</p><p className="text-xs font-black uppercase">{job.jobRank || 'Mid-Level'}</p></div>
           <div className="space-y-0.5"><p className="text-[7px] font-black uppercase text-white/20 tracking-widest">Modality</p><p className="text-xs font-black uppercase">{job.location}</p></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <section className="glass rounded-[24px] p-6 md:p-8 border-white/5 space-y-4 shadow-xl">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[#F0C927]"><ClipboardList size={16} /> Roles & Responsibilities</h2>
              <div className="text-xs text-white/70 leading-relaxed font-medium whitespace-pre-wrap">{job.responsibilities || job.description}</div>
           </section>

           <section className="glass rounded-[24px] p-6 md:p-8 border-white/5 space-y-4 shadow-xl">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[#41d599]"><FileStack size={16} /> Candidate Requirements</h2>
              <div className="text-xs text-white/70 leading-relaxed font-medium whitespace-pre-wrap">{job.requirements}</div>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={onLaunchCoach} className="p-6 rounded-[24px] bg-[#F0C927]/5 border border-[#F0C927]/20 flex flex-col items-center text-center gap-3 group hover:bg-[#F0C927]/10 transition-all shadow-lg">
                 <div className="w-10 h-10 rounded-xl bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] group-hover:scale-110 transition-transform"><Zap size={20} /></div>
                 <div><p className="text-[10px] font-black uppercase tracking-widest">Consult AI Coach</p><p className="text-[8px] text-white/30 font-bold uppercase mt-0.5">Optimize pitch for this role</p></div>
              </button>
              <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20"><Share2 size={18} /></div>
                 <div><p className="text-[10px] font-black uppercase tracking-widest text-white/40">Spread Manifest</p><p className="text-[8px] text-white/20 font-bold uppercase mt-0.5">Refer to external identity</p></div>
              </div>
           </div>
        </div>

        <aside className="space-y-6">
           <section className="glass rounded-[24px] p-6 border-white/5 space-y-4 shadow-xl">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Hiring Context</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center"><span className="text-[8px] font-black uppercase text-white/20">Release Date</span><span className="text-[10px] font-bold">{new Date(job.postedAt).toLocaleDateString()}</span></div>
                 <div className="flex justify-between items-center"><span className="text-[8px] font-black uppercase text-white/20">Org Class</span><span className="text-[10px] font-bold uppercase">{job.organizationType || 'Private'}</span></div>
                 <div className="flex justify-between items-center"><span className="text-[8px] font-black uppercase text-white/20">App Method</span><span className="text-[10px] font-bold uppercase">{job.applicationType}</span></div>
              </div>
           </section>

           <section className="space-y-3">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 px-1">Market Relatives</h3>
              {allJobs.filter(j => j.id !== job.id && j.status === 'active').slice(0, 3).map(sj => (
                <div key={sj.id} onClick={() => onSelectJob(sj)} className="glass rounded-2xl p-3 border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer flex items-center justify-between group shadow-lg">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#0a4179] flex items-center justify-center text-[10px] font-black text-[#F0C927] border border-white/10 shrink-0">{sj.company[0]}</div>
                      <div className="min-w-0"><p className="text-[10px] font-black truncate leading-tight group-hover:text-[#F0C927]">{sj.title}</p><p className="text-[7px] text-white/30 uppercase font-black">{sj.company}</p></div>
                   </div>
                   <ChevronRight size={12} className="text-white/10 group-hover:text-white" />
                </div>
              ))}
           </section>
        </aside>
      </div>
    </div>
  );
};

export default JobDetails;