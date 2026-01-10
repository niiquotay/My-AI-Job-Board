// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { 
  FileStack, Sparkles, Wand2, FileText, ArrowLeft, 
  Loader2, CheckCircle2, Copy, Download, Zap, 
  Target, Briefcase, RefreshCw, Plus, Trash2, 
  BookOpen, Rocket, Check, X, Info,
  ShieldCheck, User, Mail, Smartphone, MapPin, Globe, Linkedin, Link as LinkIcon,
  Palette, Eye, LayoutGrid, ChevronDown
} from 'lucide-react';
import { UserProfile, Job, WorkExperience, Education, Project } from '../types';
import { ALL_COUNTRIES, REGIONS_BY_COUNTRY } from '../constants';
import { generateTailoredResume } from '../services/geminiService';
import Toast from './Toast';
import Tooltip from './Tooltip';

interface CVPrepProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  jobs: Job[];
  onBack: () => void;
}

const CVPrep: React.FC<CVPrepProps> = ({ user, setUser, jobs, onBack }) => {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

  const handleGenerate = async () => {
    if (!selectedJobId) {
      setToast({ message: "Please select a target job track.", type: 'error' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateTailoredResume(user, selectedJob);
      setTailoredResume(result);
      setToast({ message: "Resume manifest tailored to job requirements.", type: 'success' });
    } catch (err) {
      setToast({ message: "AI synthesis failed.", type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateIdentity = (field: keyof UserProfile, value: any) => {
    setUser(prev => {
        const next = { ...prev, [field]: value };
        if (field === 'country') {
            next.city = ''; // Reset region/state when country changes
        }
        return next;
    });
  };

  const copyToClipboard = () => {
    if (tailoredResume) {
      navigator.clipboard.writeText(tailoredResume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setToast({ message: "Tailored CV cached to clipboard.", type: 'success' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 text-white animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black">AI CV <span className="gradient-text">Studio</span></h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Tailor your professional trajectory manifest</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 px-2">
        <div className="lg:col-span-1 space-y-6">
           <section className="glass rounded-[40px] p-8 border-white/5 space-y-6 shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#F0C927] border-b border-white/5 pb-4 flex items-center gap-2">
                <Target size={16} /> Strategy Config
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Target Job Track</label>
                  <select 
                    value={selectedJobId} 
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a4179]">Select Job</option>
                    {jobs.map(j => <option key={j.id} value={j.id} className="bg-[#0a4179]">{j.title} @ {j.company}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1 flex items-center gap-2">
                    <Globe size={10} /> Country
                  </label>
                  <select 
                    value={user.country} 
                    onChange={e => updateIdentity('country', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a4179]">Select Country</option>
                    {ALL_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0a4179]">{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1 flex items-center gap-2">
                    <MapPin size={10} /> Region/State
                  </label>
                  <select 
                    value={user.city} 
                    onChange={e => updateIdentity('city', e.target.value)}
                    disabled={!user.country}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-[#0a4179]">Select Region/State</option>
                    {(REGIONS_BY_COUNTRY[user.country] || []).map(c => <option key={c} value={c} className="bg-[#0a4179]">{c}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !selectedJobId}
                className="w-full py-4 rounded-2xl bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                Run AI Tailoring
              </button>
           </section>

           <div className="glass rounded-[32px] p-6 border-white/5 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-blue-400/10 text-blue-400 border border-blue-400/20">
                <Info size={16} />
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-tight">
                Gemini 3 Pro will analyze the target Job Description and adjust your profile's focus to maximize ATS compatibility.
              </p>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <section className="glass rounded-[40px] border-white/5 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Tailored Resume Manifest</h3>
                 {tailoredResume && (
                   <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all border border-white/10"
                   >
                     {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Cached' : 'Copy'}
                   </button>
                 )}
              </div>
              
              <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white shadow-inner">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 text-slate-400 opacity-60">
                    <Loader2 size={48} className="animate-spin" />
                    <p className="text-sm font-black uppercase tracking-[0.3em]">Synthesizing Manifest...</p>
                  </div>
                ) : tailoredResume ? (
                  <div className="prose prose-slate max-w-none text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                    {tailoredResume}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-300">
                    <FileText size={64} className="opacity-10" />
                    <p className="text-sm font-bold opacity-30 uppercase tracking-widest">Awaiting Strategy Config</p>
                  </div>
                )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default CVPrep;