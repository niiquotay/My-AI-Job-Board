import React, { useState } from 'react';
import { 
  Users, Building2, UserPlus, ShieldCheck, Mail, Clock, 
  Trash2, Plus, Globe, Briefcase, ChevronRight, X, 
  CheckCircle2, AlertCircle, ShieldAlert, Zap, Layers,
  ExternalLink, BarChart3, Fingerprint, Crown, Lock
} from 'lucide-react';
import { UserProfile, SubUser, Subsidiary } from '../types';
import Tooltip from './Tooltip';
import Toast from './Toast';

interface OrganizationManagementProps {
  user: UserProfile;
  onAddSubUser: (subUser: Partial<SubUser>) => void;
  onRemoveSubUser: (id: string) => void;
  onAddSubsidiary: (subsidiary: Partial<Subsidiary>) => void;
  onViewCompany: (companyName: string) => void;
}

const OrganizationManagement: React.FC<OrganizationManagementProps> = ({ 
  user, 
  onAddSubUser, 
  onRemoveSubUser,
  onAddSubsidiary,
  onViewCompany
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'subsidiaries'>('team');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddSubsidiary, setShowAddSubsidiary] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'recruiter' as const });
  const [newSubs, setNewSubs] = useState({ name: '', industry: '', location: '' });

  const isSuperUser = !!user?.isSuperUser;
  const userName = user?.name || 'Authorized User';
  const userEmail = user?.email || 'N/A';
  const userSubUsers = user?.subUsers || [];
  const userSubsidiaries = user?.subsidiaries || [];

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) { setToast({ message: "Member identity and email required.", type: 'error' }); return; }
    onAddSubUser({ name: newMember.name, email: newMember.email, role: newMember.role, isSuperUser: false, joinedDate: new Date().toISOString(), lastLogin: 'Never' });
    setNewMember({ name: '', email: '', role: 'recruiter' }); setShowAddMember(false); setToast({ message: "Member invitation dispatched.", type: 'success' });
  };

  const handleAddSubsidiary = () => {
    if (!newSubs.name || !newSubs.industry) { setToast({ message: "Subsidiary name and industry required.", type: 'error' }); return; }
    onAddSubsidiary({ name: newSubs.name, industry: newSubs.industry, location: newSubs.location, activeJobs: 0, joinedDate: new Date().toISOString() });
    setNewSubs({ name: '', industry: '', location: '' }); setShowAddSubsidiary(false); setToast({ message: "Subsidiary manifest created.", type: 'success' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500 text-white pb-32 px-4 md:px-0">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">Organization <span className="gradient-text">Governance</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">Team & Subsidiary Lifecycle Control</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-[#06213f]/40 rounded-xl border border-white/5">
           <button onClick={() => setActiveTab('team')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/30 hover:bg-white/5'}`}>Team</button>
           <button onClick={() => setActiveTab('subsidiaries')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'subsidiaries' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/30 hover:bg-white/5'}`}>Units</button>
        </div>
      </div>

      {activeTab === 'team' ? (
        <div className="space-y-3">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-tight text-white/40">Authorized Manifest</h3>
              {isSuperUser && <button onClick={() => setShowAddMember(true)} className="px-4 py-2 bg-[#41d599] text-[#0a4179] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg">+ Provision</button>}
           </div>
           <div className="glass rounded-[24px] border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    <tr>
                       <th className="px-5 py-4">Identity</th>
                       <th className="px-5 py-4">Operational Role</th>
                       <th className="px-5 py-4">Access Level</th>
                       <th className="px-5 py-4 text-right">Control</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <tr className="bg-[#41d599]/5">
                       <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-[#F0C927] flex items-center justify-center font-black text-[#0a4179] text-xs">{userName[0]}</div>
                             <div><p className="text-xs font-black">{userName}</p><p className="text-[10px] text-white/30 font-mono">{userEmail}</p></div>
                          </div>
                       </td>
                       <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-lg bg-[#F0C927]/10 text-[#F0C927] text-[10px] font-black uppercase tracking-widest">Super User</span></td>
                       <td className="px-5 py-3 text-[10px] font-black uppercase text-[#41d599]">Full Oversight</td>
                       <td className="px-5 py-3 text-right"><Lock size={12} className="ml-auto opacity-20" /></td>
                    </tr>
                    {userSubUsers.map(sub => (
                       <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 py-3">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-black text-white/20 text-xs">{sub.name[0]}</div>
                                <div><p className="text-xs font-bold text-white/80">{sub.name}</p><p className="text-[10px] text-white/20 font-mono">{sub.email}</p></div>
                             </div>
                          </td>
                          <td className="px-5 py-3"><span className="text-[10px] font-black uppercase text-white/40">{sub.role}</span></td>
                          <td className="px-5 py-3 text-[10px] font-black uppercase text-white/20">Operational</td>
                          <td className="px-5 py-3 text-right">{isSuperUser && <button onClick={() => onRemoveSubUser(sub.id)} className="p-1.5 text-white/20 hover:text-red-500 transition-all"><Trash2 size={12} /></button>}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : (
        <div className="space-y-3 animate-in slide-in-from-right-2 duration-300">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-black uppercase tracking-tight text-white/40">Subsidiary Units</h3>
              {isSuperUser && <button onClick={() => setShowAddSubsidiary(true)} className="px-4 py-2 bg-[#F0C927] text-[#0a4179] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">+ Add Branch</button>}
           </div>
           <div className="grid md:grid-cols-3 gap-3">
              {userSubsidiaries.map(sub => (
                <div key={sub.id} className="glass group rounded-[20px] p-4 border-white/5 space-y-4 hover:bg-white/[0.04] transition-all relative overflow-hidden shadow-lg">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0a4179] flex items-center justify-center text-xs font-black text-[#F0C927]">{sub.name[0]}</div>
                      <div className="min-w-0 flex-1">
                         <h4 onClick={() => onViewCompany(sub.name)} className="text-xs font-black truncate hover:text-[#F0C927] cursor-pointer">{sub.name}</h4>
                         <p className="text-[10px] text-[#41d599] font-black uppercase tracking-widest">{sub.industry}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-white/5 text-center"><p className="text-[10px] font-black uppercase text-white/20">Jobs</p><p className="text-xs font-black">{sub.activeJobs}</p></div>
                      <div className="p-2.5 rounded-xl bg-white/5 text-center"><p className="text-[10px] font-black uppercase text-white/20">Locale</p><p className="text-xs font-bold truncate">{sub.location.split(',')[0]}</p></div>
                   </div>
                   <button onClick={() => onViewCompany(sub.name)} className="w-full py-2 rounded-lg bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-[#F0C927] hover:text-[#0a4179] transition-all flex items-center justify-center gap-1">Manage Unit <ChevronRight size={10} /></button>
                </div>
              ))}
           </div>
        </div>
      )}
      {/* MODAL REDUCTION */}
      {showAddMember && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="glass w-full max-w-sm rounded-[24px] p-6 border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowAddMember(false)} className="absolute top-6 right-6 text-white/20 hover:text-white"><X size={18} /></button>
              <h2 className="text-lg font-black uppercase mb-6">Provision Member</h2>
              <div className="space-y-3">
                 <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-white/40">Identity</label><input type="text" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" placeholder="Full Name" /></div>
                 <div className="space-y-1"><label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email</label><input type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs" placeholder="john@company.ai" /></div>
              </div>
              <button onClick={handleAddMember} className="w-full py-3 bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-[10px] mt-6 rounded-xl active:scale-95 shadow-lg">Send Invitation</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;