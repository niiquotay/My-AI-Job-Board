import React, { useState, useRef } from 'react';
import { 
  Building, Globe, Users, FileText, ArrowLeft, ArrowRight, 
  Loader2, CheckCircle, ShieldCheck, Zap, Sparkles, Building2,
  Image as ImageIcon, Upload, Rocket, Linkedin, Twitter, Facebook,
  ShieldAlert, Clock, Save, Briefcase, MapPin, Plus, Trash2, 
  ExternalLink, Edit3, Camera, X, Layout, Info, Link as LinkIcon,
  Calendar, Layers, Share2, History, CreditCard, Box,
  TrendingUp, Mail, PhoneOutgoing, User as UserIcon
} from 'lucide-react';
import { UserProfile, Subsidiary, LeadershipMember } from '../types';
import Tooltip from './Tooltip';
import Toast from './Toast';

interface EmployerProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onComplete: () => void;
  onBack: () => void;
  onViewCompany: (name: string) => void;
  onAddSubsidiary: (subsidiary: Partial<Subsidiary>) => void;
}

const EmployerProfile: React.FC<EmployerProfileProps> = ({ user, setUser, onComplete, onBack, onViewCompany, onAddSubsidiary }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof UserProfile, value: any) => { setUser(prev => ({ ...prev, [field]: value })); };
  const handleSave = () => { setIsSaving(true); setTimeout(() => { setIsSaving(false); setIsEditing(false); setToast({ message: "Organization manifest synchronized.", type: 'success' }); }, 1200); };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { updateField('enhancedAvatar', reader.result as string); }; reader.readAsDataURL(file); } };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20 animate-in fade-in duration-500 text-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex items-center justify-between gap-4 px-2">
        <button onClick={onBack} className="flex items-center gap-1 text-white/40 hover:text-white transition-colors group">
          <ArrowLeft size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Return to Dashboard</span>
        </button>
        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg ${isEditing ? 'bg-[#41d599] text-[#0a4179]' : 'bg-[#F0C927] text-[#0a4179]'}`}>
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Edit3 size={12} />}
          {isEditing ? 'Commit Changes' : 'Manage Profile'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-4">
        {/* Profile Card Header */}
        <section className="lg:col-span-12 glass rounded-[28px] p-6 border-white/5 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-[#06213f] flex items-center justify-center text-5xl font-black border border-white/10 text-[#F0C927] overflow-hidden">
                {user.enhancedAvatar ? <img src={user.enhancedAvatar} className="w-full h-full object-cover" /> : <span>{user.companyName?.[0]}</span>}
              </div>
              {isEditing && <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[#F0C927] text-[#0a4179] flex items-center justify-center shadow-xl border-2 border-[#0a4179]"><Camera size={14} /><input ref={logoInputRef} type="file" className="hidden" onChange={handleLogoUpload} /></button>}
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
               {isEditing ? <input value={user.companyName} onChange={e => updateField('companyName', e.target.value)} className="text-3xl font-black tracking-tight bg-white/5 border border-white/10 rounded-xl px-3 py-1 w-full" /> : <h1 className="text-3xl font-black tracking-tighter uppercase">{user.companyName || user.name}</h1>}
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[8px] font-black uppercase tracking-widest text-white/30">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#F0C927]" /> {user.city}, {user.country}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-[#F0C927]" /> {user.industry || 'Technology'}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#41d599]" /> Verified Enterprise</span>
               </div>
            </div>
          </div>
        </section>

        {/* Details Grid */}
        <div className="lg:col-span-8 space-y-4">
           <section className="glass rounded-[28px] p-6 border-white/5 space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Sparkles className="text-[#F0C927]" size={16} /> Mission Statement</h2>
              {isEditing ? <textarea value={user.companyBio} onChange={e => updateField('companyBio', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs min-h-[120px]" /> : <p className="text-xs text-white/60 leading-relaxed font-medium">{user.companyBio}</p>}
           </section>
           
           <section className="glass rounded-[28px] p-6 border-white/5 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="text-[#41d599]" size={16} /> Executive Leadership</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                 {(user.leadership || []).map(leader => (
                   <div key={leader.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden">{leader.imageUrl ? <img src={leader.imageUrl} className="w-full h-full object-cover" /> : <UserIcon className="m-auto opacity-10" size={20} />}</div>
                      <div className="min-w-0">
                         <p className="text-[10px] font-black truncate uppercase">{leader.name}</p>
                         <p className="text-[7px] text-white/30 font-black uppercase">{leader.position}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <aside className="lg:col-span-4 space-y-4">
           <section className="glass rounded-[28px] p-6 border-white/5 space-y-4 bg-gradient-to-br from-[#06213f] to-transparent">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-[#F0C927] border-b border-white/5 pb-2">Global Presence</h3>
              <div className="grid gap-2">
                 <div className="p-3 bg-white/5 rounded-xl"><p className="text-[6px] font-black uppercase text-white/20">Monthly Reach</p><p className="text-lg font-black text-[#41d599]">14.2k</p></div>
                 <div className="p-3 bg-white/5 rounded-xl"><p className="text-[6px] font-black uppercase text-white/20">Hiring Velocity</p><p className="text-lg font-black text-white">High</p></div>
              </div>
           </section>
           <section className="glass rounded-[28px] p-6 border-white/5 space-y-4">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Connect</h3>
              <div className="space-y-3">
                 <div className="flex items-center gap-2 text-[9px] text-white/60 font-bold truncate"><Mail size={12} className="text-[#41d599]" /> {user.email}</div>
                 <div className="flex items-center gap-2 text-[9px] text-white/60 font-bold truncate"><Globe size={12} className="text-[#41d599]" /> Official Portal</div>
              </div>
           </section>
        </aside>
      </div>
    </div>
  );
};

export default EmployerProfile;