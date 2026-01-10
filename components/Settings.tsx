import React, { useState } from 'react';
import { 
  Lock, ShieldCheck, Eye, EyeOff, Loader2, Save, 
  Trash2, Bell, Shield, Key, AlertTriangle, Fingerprint,
  Smartphone, Mail, CheckCircle2, Crown, Star, ArrowRight,
  CreditCard, Zap, Settings as SettingsIcon, Activity, Globe,
  RefreshCw, Database, Terminal, Calendar, Receipt, ExternalLink,
  User
} from 'lucide-react';
import { UserProfile } from '../types';
import Toast from './Toast';

interface SettingsProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onUpgradeRequest: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser, onUpgradeRequest }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: "New passwords do not match", type: 'error' });
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      setUser(prev => ({ ...prev, password: newPassword }));
      setToast({ message: "Security credentials updated successfully", type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdating(false);
    }, 1500);
  };

  const isStaff = !!user.opRole;
  
  const nextBillingDate = new Date();
  nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  const formattedNextCycle = nextBillingDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="max-w-[1440px] mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white pb-32">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">System <span className="gradient-text">Config</span></h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Account Governance & Security Management</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-6 py-3 shadow-xl">
           <div className={`w-2 h-2 rounded-full animate-pulse ${isStaff ? 'bg-blue-400' : 'bg-[#41d599]'}`}></div>
           <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isStaff ? 'text-blue-400' : 'text-[#41d599]'}`}>
              {isStaff ? 'Staff Cluster Active' : 'User Session Secure'}
           </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            {/* Account Info Section */}
            <section className="glass rounded-[40px] p-10 space-y-8 border-white/5 shadow-2xl relative overflow-hidden">
               <h3 className="text-xl font-bold flex items-center gap-3 border-b border-white/5 pb-6">
                  <User className="text-[#F0C927]" size={22} /> Account Identity
               </h3>
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Registered Identity</label>
                     <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-bold">
                        {user.name}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Primary Auth Email</label>
                     <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white font-medium">
                        {user.email}
                     </div>
                  </div>
               </div>
            </section>

            {/* Security Section */}
            <section className="glass rounded-[40px] p-10 space-y-8 border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03]"><Key size={140} /></div>
               <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                     <Lock className="text-[#F0C927]" size={22} /> Security Credentials
                  </h3>
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                     {showPasswords ? <EyeOff size={14} className="inline mr-2" /> : <Eye size={14} className="inline mr-2" />} 
                     {showPasswords ? 'Hide Inputs' : 'Show Inputs'}
                  </button>
               </div>

               <form onSubmit={handlePasswordUpdate} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Current Password Verification</label>
                     <input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all" placeholder="Enter current hash" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">New Security Credential</label>
                        <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all" placeholder="New string" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-1">Verify New Credential</label>
                        <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all" placeholder="Confirm string" />
                     </div>
                  </div>
                  <button disabled={isUpdating || !newPassword} className="w-full py-5 rounded-[22px] bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                     {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />} Commit Security Change
                  </button>
               </form>
            </section>
         </div>

         <div className="space-y-8">
            {/* Subscription Logic Card */}
            {!isStaff && (
               <section className="glass rounded-[40px] p-8 space-y-6 border-white/5 bg-gradient-to-br from-[#0a4179] to-[#06213f] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-[-10px] right-[-10px] opacity-10 rotate-12"><Crown size={120} /></div>
                  <div className="relative z-10 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#F0C927]">Active Tier Status</p>
                     <h3 className="text-3xl font-black capitalize">{user.subscriptionTier || 'Standard'}</h3>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
                        <Calendar size={12} /> Renewal: {formattedNextCycle}
                     </div>
                     <div className="pt-4">
                        <button onClick={onUpgradeRequest} className="w-full py-4 rounded-2xl bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
                           {user.isSubscribed ? 'Adjust License' : 'Upgrade to Premium'}
                        </button>
                     </div>
                  </div>
               </section>
            )}

            {/* Payment Information Card */}
            {!isStaff && (
               <section className="glass rounded-[40px] p-8 space-y-6 border-white/5 shadow-2xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-4 flex items-center gap-2">
                     <CreditCard size={14} /> Settlement Method
                  </h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-6 rounded bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center font-bold italic text-[8px] tracking-tighter">
                        VISA
                      </div>
                      <div>
                        <p className="font-bold text-xs">•••• 4242</p>
                        <p className="text-[8px] text-white/30 uppercase">Exp 12/28</p>
                      </div>
                    </div>
                    <ExternalLink size={12} className="text-white/20" />
                  </div>
                  <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                    Link New Gateway
                  </button>
               </section>
            )}

            {/* System Info */}
            <section className="glass rounded-[40px] p-8 space-y-6 border-white/5 shadow-2xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/40 border-b border-white/5 pb-4 flex items-center gap-2">
                  <Activity size={14} /> Global Telemetry
               </h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                     <span className="text-white/20">Sync Latency</span>
                     <span className="text-[#41d599]">18ms</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                     <span className="text-white/20">Identity Check</span>
                     <span className="text-[#41d599]">Verified</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                     <span className="text-white/20">AI Neural Link</span>
                     <span className="text-blue-400">Stable</span>
                  </div>
               </div>
               <div className="pt-4 border-t border-white/5">
                  <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">Environment: Stable-v4.2.1</p>
               </div>
            </section>

            <button onClick={() => window.location.reload()} className="w-full py-5 rounded-[22px] bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all">
               Close Active Session
            </button>
         </div>
      </div>
    </div>
  );
};

export default Settings;