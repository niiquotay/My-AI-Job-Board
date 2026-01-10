import React, { useState, useRef } from 'react';
import { 
  Send, Mail, MessageCircle, Linkedin, Phone, 
  Clipboard, Copy, Check, Sparkles, Loader2, 
  ArrowLeft, Lock, Crown, Zap, FileText, 
  UserMinus, MessageSquare, AlertCircle, RefreshCw, Layers, Smartphone,
  Briefcase, ChevronRight, X
} from 'lucide-react';
import { UserProfile, Job } from '../types';
import { generateProfessionalDraft } from '../services/geminiService';
import Tooltip from './Tooltip';
import Toast from './Toast';

interface ProfessionalAIAssistantProps {
  user: UserProfile;
  jobs: Job[];
  onBack: () => void;
  onUpgrade: () => void;
}

const TEMPLATES = [
  { id: 'app-email', name: 'Job Application', icon: Mail, platforms: ['Email', 'LinkedIn', 'WhatsApp'], description: 'High-conversion reach-out.' },
  { id: 'rejection-reconsider', name: 'Reconsideration', icon: MessageSquare, platforms: ['Email', 'LinkedIn', 'WhatsApp'], description: 'Request profile review.' },
  { id: 'offer-negotiate', name: 'Negotiation', icon: Zap, platforms: ['Email', 'LinkedIn', 'Phone Call'], description: 'Negotiate pay & terms.' },
  { id: 'accept-offer', name: 'Accept Offer', icon: Check, platforms: ['Email', 'Formal Letter'], description: 'Formal acceptance.' },
  { id: 'resign', name: 'Resignation', icon: UserMinus, platforms: ['Email', 'Formal Letter'], description: 'Exit gracefully.' },
  { id: 'social-post', name: 'Networking Post', icon: Linkedin, platforms: ['LinkedIn', 'Twitter'], description: 'Viral search updates.' },
  { id: 'whatsapp-ping', name: 'Quick Ping', icon: MessageCircle, platforms: ['WhatsApp', 'Telegram', 'SMS'], description: 'Casual follow-up.' },
  { id: 'general-other', name: 'Custom Message', icon: Layers, platforms: ['Email', 'LinkedIn', 'WhatsApp'], description: 'Bespoke professional comms.' },
];

const ProfessionalAIAssistant: React.FC<ProfessionalAIAssistantProps> = ({ user, jobs, onBack, onUpgrade }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [platform, setPlatform] = useState(TEMPLATES[0].platforms[0]);
  const [context, setContext] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const isPremium = user.isSubscribed;
  const isGeneralTrack = selectedTemplate.id === 'general-other';

  const handleGenerate = async () => {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    if (!context.trim()) {
      setToast({ message: "Context required for neural synthesis.", type: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const job = !isGeneralTrack ? jobs.find(j => j.id === selectedJobId) : undefined;
      const result = await generateProfessionalDraft(
        selectedTemplate.name,
        platform,
        context,
        user,
        job
      );
      setDraft(result);
      setToast({ message: "Intelligence manifest synthesized.", type: 'success' });
    } catch (err) {
      setToast({ message: "Synthesis synchronization failed.", type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (draft) {
      navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setToast({ message: "Draft cached to clipboard", type: 'success' });
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto min-h-[calc(100vh-140px)] flex flex-col gap-6 text-white animate-in fade-in duration-500 relative pb-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header - Enhanced Width */}
      <div className="flex items-center justify-between shrink-0 px-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">AI Comm <span className="gradient-text">Studio</span></h1>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.25em] mt-1">Strategic Multi-Channel Drafting Environment • Enterprise v4.2</p>
        </div>
        <div className="flex items-center gap-4">
           {!isPremium && (
             <button onClick={onUpgrade} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F0C927]/10 text-[#F0C927] border border-[#F0C927]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#F0C927] hover:text-[#0a4179] transition-all shadow-xl shadow-[#F0C927]/5">
                <Crown size={14} /> Unlock Premium
             </button>
           )}
           <button onClick={onBack} className="p-3.5 rounded-2xl bg-white/5 text-white/30 hover:text-white transition-all border border-white/5 shadow-md">
             <ArrowLeft size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-8 overflow-hidden px-2">
        
        {/* Left Column: Mission Tracks - Show All Items Better */}
        <aside className="w-full xl:w-[380px] shrink-0 flex flex-col gap-4">
           <div className="px-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#F0C927]/60">Communication Jobs</h3>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-3">
             {TEMPLATES.map((t) => (
               <button 
                 key={t.id}
                 onClick={() => { setSelectedTemplate(t); setPlatform(t.platforms[0]); setDraft(null); }}
                 className={`w-full group p-2.5 rounded-[20px] border transition-all duration-300 text-left flex items-center gap-3 ${
                   selectedTemplate.id === t.id 
                    ? 'bg-[#F0C927]/10 border-[#F0C927]/40 shadow-[0_0_30px_rgba(240,201,39,0.08)] scale-[1.02]' 
                    : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                 }`}
               >
                 <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
                   selectedTemplate.id === t.id ? 'bg-[#F0C927] text-[#0a4179] rotate-[360deg]' : 'bg-white/5 text-white/30 group-hover:text-white'
                 }`}>
                   <t.icon size={16} />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className={`text-[12px] font-black uppercase tracking-tight mb-0.5 ${selectedTemplate.id === t.id ? 'text-[#F0C927]' : 'text-white'}`}>{t.name}</h4>
                   <p className="text-[9px] text-white/40 leading-tight truncate font-medium">{t.description}</p>
                 </div>
                 {selectedTemplate.id === t.id && <ChevronRight size={14} className="ml-auto text-[#F0C927]" />}
               </button>
             ))}
           </div>
        </aside>

        {/* Right Column: Mission Control Workspace - Expand for Visibility */}
        <main className="flex-1 glass rounded-[48px] border-white/5 shadow-2xl overflow-hidden flex flex-col relative min-h-[600px] border border-white/10">
           {!isPremium && (
             <div className="absolute inset-0 z-50 bg-[#0a4179]/70 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 rounded-[30px] bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] border border-[#F0C927]/20 mb-8 shadow-2xl animate-pulse"><Lock size={40} /></div>
               <h2 className="text-3xl font-black mb-4">Protocol Restricted</h2>
               <p className="text-base text-white/40 max-w-md mb-10 leading-relaxed font-medium">AI Comm Studio requires a Seeker Premium license to synchronize with neural strategic drafting protocols.</p>
               <button onClick={onUpgrade} className="px-12 py-5 rounded-[22px] bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#F0C927]/20 hover:scale-105 transition-all">Upgrade Profile Access</button>
             </div>
           )}

           {/* Configuration Bar */}
           <div className="p-6 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center gap-8">
              <div className="space-y-2">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F0C927]/50 ml-1">Deploy Platform</p>
                 <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                   {selectedTemplate.platforms.map(p => (
                     <button 
                       key={p}
                       onClick={() => setPlatform(p)}
                       className={`px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${platform === p ? 'bg-[#F0C927] text-[#0a4179] shadow-lg scale-105' : 'text-white/40 hover:text-white'}`}
                     >
                       {p}
                     </button>
                   ))}
                 </div>
              </div>
              {!isGeneralTrack && (
                <div className="flex-1 space-y-2 min-w-[280px]">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#F0C927]/50 ml-1">Target Professional Job</p>
                   <div className="relative">
                     <select 
                       value={selectedJobId}
                       onChange={(e) => setSelectedJobId(e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-sm text-white outline-none focus:border-[#F0C927] transition-all cursor-pointer appearance-none shadow-inner font-bold"
                     >
                       <option value="" className="bg-[#0a4179]">General Market Identity Outreach</option>
                       {jobs.map(j => <option key={j.id} value={j.id} className="bg-[#0a4179]">{j.title} @ {j.company}</option>)}
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                       <ChevronDown size={16} />
                     </div>
                   </div>
                </div>
              )}
           </div>

           {/* Input/Directive Workspace - Massive Space */}
           <div className="flex-1 flex flex-col p-10 space-y-8 relative overflow-hidden bg-gradient-to-b from-transparent to-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#41d599]/10 flex items-center justify-center text-[#41d599] border border-[#41d599]/10"><MessageSquare size={22} /></div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest">Synthesis Directives</h3>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Provide specific context for the AI Agent</p>
                  </div>
                </div>
                <Tooltip text="Specify the goal: Are you highlighting a specific technical skill, requesting a time for an interview, or responding to a query? Detail makes the AI more precise.">
                  <div className="p-3 rounded-full bg-white/5 text-white/20 hover:text-[#F0C927] transition-all cursor-help">
                    <AlertCircle size={20} />
                  </div>
                </Tooltip>
              </div>

              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#F0C927]/20 to-transparent rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
                <textarea 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={`Describe your strategic intent... (e.g. "Draft a message to the Hiring Lead at Nexa. I want to emphasize my 5 years of React experience and mention I'm available for a call this Thursday between 2-4 PM.")`}
                  className="relative z-10 w-full h-full bg-white/[0.03] border border-white/5 rounded-[32px] p-10 text-xl text-white/90 placeholder:text-white/10 outline-none resize-none leading-relaxed font-semibold transition-all focus:border-[#F0C927]/40 shadow-inner"
                />
              </div>
              
              <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-10">
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-white/20">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#41d599] animate-pulse"></div>
                   Neural Sync Protocol Active
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !isPremium}
                  className="px-14 py-6 rounded-[28px] bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-[#F0C927]/20 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-4 disabled:opacity-20"
                >
                  {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {isGenerating ? 'Synthesizing...' : 'Generate Manifest'}
                </button>
              </div>
           </div>

           {/* Results Overlay Panel */}
           {draft && (
             <div className="absolute inset-0 z-[60] bg-[#0a4179] animate-in slide-in-from-right-full duration-700 flex flex-col">
                <div className="p-10 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                   <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-[#41d599]/10 flex items-center justify-center text-[#41d599] border border-[#41d599]/20 shadow-xl"><FileText size={28} /></div>
                     <div>
                       <h3 className="text-2xl font-black uppercase tracking-tight text-[#41d599]">Generated Manifest</h3>
                       <p className="text-xs text-white/30 uppercase font-black tracking-[0.3em] mt-1">Ready for deployment via {platform}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-3 px-10 py-4 rounded-[22px] bg-[#41d599] text-[#0a4179] text-xs font-black uppercase tracking-widest shadow-2xl shadow-[#41d599]/20 hover:brightness-110 transition-all active:scale-95"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? 'Cached' : 'Copy Draft'}
                      </button>
                      <button 
                        onClick={() => setDraft(null)}
                        className="p-4 rounded-2xl bg-white/5 text-white/30 hover:text-white transition-all border border-white/5"
                      >
                        <X size={28} />
                      </button>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-white shadow-inner flex justify-center">
                   <div className="max-w-4xl w-full">
                      <div className="prose prose-slate max-w-none text-slate-800 font-sans whitespace-pre-wrap leading-relaxed text-xl md:text-2xl font-medium">
                        {draft}
                      </div>
                   </div>
                </div>
                <div className="p-8 border-t border-white/10 bg-[#06213f] text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Strategic Identity Protocol • AI-JobConnect G-Studio v4.2</p>
                </div>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

const ChevronDown = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default ProfessionalAIAssistant;