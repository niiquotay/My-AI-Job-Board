// @ts-nocheck
import React, { useState, useRef } from 'react';
import { 
  User, FileText, Upload, Loader2, ArrowLeft, Trash2, Crown, Cpu, Wand2, Plus, X, GraduationCap, History, Award, Heart, Rocket, Check, Lock, ArrowRight, ShieldCheck, EyeOff, Eye, Info, AlertTriangle, MapPin, Fingerprint, Linkedin, Zap, Star, Download, Save, Briefcase, BookOpen, Layers, ImageIcon, Mail, Smartphone, MessageCircle, ExternalLink, Sparkles, RefreshCw,
  FileStack, ShieldAlert, Award as AwardIcon, Lightbulb, Globe, Link as LinkIcon, Target, Camera, Scissors, Palette, Monitor, Users
} from 'lucide-react';
import { UserProfile, WorkExperience, Education, Project, Job } from '../types';
import { parseResume, enhanceProfileSection, editProfileImage, generateTailoredResume } from '../services/geminiService';
import Tooltip from './Tooltip';
import Toast from './Toast';
import { 
  ALL_COUNTRIES, REGIONS_BY_COUNTRY, COMMON_TITLES, GENDER_OPTIONS, 
  RACE_OPTIONS, MOCK_USER, AGE_RANGES, DISABILITY_OPTIONS, 
  RELIGION_OPTIONS, MARITAL_STATUS_OPTIONS, VETERAN_STATUS_OPTIONS 
} from '../constants';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onBack: () => void;
  isSignUp?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activeRewriteId, setActiveRewriteId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [showCVModal, setShowCVModal] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const cvUploadRef = useRef<HTMLInputElement>(null);

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsing(true);
    try {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const parsedData = await parseResume({ base64, mimeType: file.type });
            setUser(prev => ({ ...prev, ...parsedData, profileCompleted: true }));
            setToast({ message: "Neural sync complete. Manifest populated.", type: 'success' });
        };
        reader.readAsDataURL(file);
    } catch (err) { setToast({ message: "Parsing fault detected.", type: 'error' }); } 
    finally { setIsParsing(false); }
  };

  const updateField = (field: keyof UserProfile, value: any) => setUser(prev => ({ ...prev, [field]: value }));
  const handleSave = () => { setIsSaving(true); setTimeout(() => { setIsSaving(false); setToast({ message: "Identity manifest synced.", type: 'success' }); onBack(); }, 1000); };

  return (
    <div className="max-w-5xl mx-auto py-4 px-4 space-y-4 text-white pb-32 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* IDENTITY CARD - COMPACT HEADER */}
      <section className="glass rounded-[24px] p-6 border-white/5 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-6">
         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Fingerprint size={100} /></div>
         <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-[32px] bg-[#06213f] border-4 border-white/5 overflow-hidden shadow-xl">
               <img src={user.profileImages[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover" />
            </div>
            <button onClick={() => setEditingImageIndex(0)} className="absolute -bottom-1 -right-1 p-2 rounded-lg bg-[#F0C927] text-[#0a4179] shadow-lg"><Camera size={14} /></button>
         </div>
         <div className="flex-1 text-center md:text-left space-y-2">
            <div>
               <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
               <p className="text-xs font-black uppercase tracking-widest text-[#F0C927]">{user.role}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-white/30">
               <span className="flex items-center gap-1.5"><MapPin size={12} /> {user.city}, {user.country}</span>
               <span className="flex items-center gap-1.5 text-[#41d599]"><ShieldCheck size={12} /> Verified Talent</span>
            </div>
         </div>
         <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setShowCVModal(true)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Download CV</button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-[#41d599] text-[#0a4179] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg">{isSaving ? <Loader2 size={12} className="animate-spin" /> : 'Commit Changes'}</button>
         </div>
      </section>

      {/* CORE MANIFEST GRID */}
      <div className="grid lg:grid-cols-3 gap-4">
         <div className="lg:col-span-2 space-y-4">
            <section className="glass rounded-[24px] p-5 border-white/5 space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white/40"><Cpu size={14} className="text-[#F0C927]" /> Personal Identifiers</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-white/20 ml-1">Identity</label><input type="text" value={user.name} onChange={e => updateField('name', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-white/20 ml-1">Target Title</label><input type="text" value={user.role} onChange={e => updateField('role', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-white/20 ml-1">Primary Email</label><input type="email" value={user.email} onChange={e => updateField('email', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-white/20 ml-1">Region/State</label><input type="text" value={user.city} onChange={e => updateField('city', e.target.value)} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" /></div>
               </div>
            </section>

            <section className="glass rounded-[24px] p-5 border-white/5 space-y-4">
               <div className="flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white/40"><History size={14} className="text-blue-400" /> Career Trajectory</h3><button onClick={() => setUser(p => ({...p, workHistory: [{}, ...p.workHistory]}))} className="p-1.5 rounded-lg bg-white/5 text-blue-400"><Plus size={14} /></button></div>
               <div className="space-y-6">
                  {user.workHistory.map((work, i) => (
                    <div key={i} className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 relative group">
                       <button onClick={() => setUser(p => ({...p, workHistory: p.workHistory.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all text-white/20 hover:text-red-400"><Trash2 size={12} /></button>
                       <div className="grid md:grid-cols-2 gap-3">
                          <input placeholder="Organization" value={work.company} onChange={e => { const u = [...user.workHistory]; u[i].company = e.target.value; updateField('workHistory', u); }} className="bg-transparent border-b border-white/10 text-xs font-black py-1 focus:border-blue-400 outline-none" />
                          <input placeholder="Service Period" value={work.period} onChange={e => { const u = [...user.workHistory]; u[i].period = e.target.value; updateField('workHistory', u); }} className="bg-transparent border-b border-white/10 text-xs py-1 focus:border-blue-400 outline-none" />
                       </div>
                       <textarea placeholder="Functions & Objectives" value={work.description} onChange={e => { const u = [...user.workHistory]; u[i].description = e.target.value; updateField('workHistory', u); }} className="w-full bg-white/5 border border-white/5 rounded-lg p-2 text-xs min-h-[60px] outline-none" />
                    </div>
                  ))}
               </div>
            </section>
         </div>

         <aside className="space-y-4">
            <section className="glass rounded-[24px] p-5 border-white/5 space-y-4 bg-gradient-to-br from-[#06213f] to-transparent shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-[#F0C927]">Fast Trajectory Setup</h3>
               <div onClick={() => cvUploadRef.current?.click()} className="p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#F0C927]/40 cursor-pointer text-center space-y-3 transition-all">
                  <Upload size={24} className="mx-auto text-white/20" />
                  <div><p className="text-[10px] font-black uppercase">Deep Scan CV</p><p className="text-[8px] text-white/30 font-bold uppercase mt-1">Populate profile instantly</p></div>
                  <input ref={cvUploadRef} type="file" className="hidden" onChange={handleCVUpload} />
               </div>
            </section>

            <section className="glass rounded-[24px] p-5 border-white/5 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Core Competencies</h3>
               <div className="flex flex-wrap gap-1.5">
                  {user.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-tighter text-white/50">{s}</span>
                  ))}
                  <button className="px-2.5 py-1 rounded-lg border border-dashed border-white/10 text-[10px] font-black uppercase text-white/20">+</button>
               </div>
            </section>

            <section className="glass rounded-[24px] p-5 border-white/5 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-[#41d599]">Deployment Settings</h3>
               <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="space-y-0.5"><p className="text-[10px] font-black uppercase">Private Identity</p><p className="text-[8px] text-white/20">Stealth Protocol</p></div>
                  <button onClick={() => updateField('stealthMode', !user.stealthMode)} className={`w-8 h-4 rounded-full relative transition-all ${user.stealthMode ? 'bg-[#41d599]' : 'bg-white/10'}`}><div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${user.stealthMode ? 'left-4.5' : 'left-0.5'}`}></div></button>
               </div>
            </section>
         </aside>
      </div>
    </div>
  );
};

export default Profile;