
// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Users, Briefcase, DollarSign, 
  TrendingUp, Search, ShieldCheck, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Globe, Activity,
  Clock, CheckCircle2, MoreHorizontal, Filter,
  Eye, Download, RefreshCw, Layers, Zap, Crown, Calendar,
  FileText, PieChart, Shield, Lock, AlertTriangle, ChevronRight,
  UserCheck, UserX, FileSearch, ArrowRight, Check,
  ArrowLeft, Target, ClipboardCheck, MessageSquare, Mail,
  Ticket, Wallet, TrendingDown, Package, BadgeCheck, PhoneOutgoing,
  UserPlus, UserCog, Building2
} from 'lucide-react';
import { Job, UserProfile, Transaction, Application, ApplicationStatus, OperationalRole } from '../types';
import { MOCK_LEADS } from '../constants';
import Tooltip from './Tooltip';

interface AdminDashboardProps {
  user: UserProfile;
  jobs: Job[];
  applications: Application[];
  transactions: Transaction[];
  onBack: () => void;
  pendingVerifications: UserProfile[];
  onVerifyEmployer: (userId: string) => void;
  onApproveJob: (jobId: string) => void;
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
}

const STAGES: { value: ApplicationStatus; label: string; icon: any; color: string; bgColor: string }[] = [
  { value: 'applied', label: 'Applied', icon: ClipboardCheck, color: 'text-white/40', bgColor: 'bg-white/5' },
  { value: 'shortlisted', label: 'Shortlisted', icon: CheckCircle2, color: 'text-[#41d599]', bgColor: 'bg-[#41d599]/10' },
  { value: 'assessment', label: 'Assessment', icon: FileText, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  { value: 'interview-invitation', label: 'Interview', icon: MessageSquare, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  { value: 'final-interview', label: 'Final Interview', icon: Target, color: 'text-[#F0C927]', bgColor: 'bg-[#F0C927]/10' },
  { value: 'offer-letter', label: 'Offer', icon: Mail, color: 'text-[#f1ca27]', bgColor: 'bg-[#f1ca27]/10' },
  { value: 'hired', label: 'Hired', icon: UserCheck, color: 'text-[#41d599]', bgColor: 'bg-[#41d599]/20' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user,
  jobs, 
  applications,
  transactions, 
  onBack,
  pendingVerifications,
  onVerifyEmployer,
  onApproveJob,
  onUpdateApplicationStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const opRole = user.opRole || 'super_admin';
  const [viewTab, setViewTab] = useState<string>('overview');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'sales_exec' });

  // Stats logic
  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const pendingApprovals = jobs.filter(j => j.status === 'pending_approval');
    const shortlistJobs = jobs.filter(j => j.isShortlistService);
    
    return { 
      totalRevenue, 
      activeJobs, 
      pendingApprovals: pendingApprovals.length,
      shortlistCount: shortlistJobs.length,
      profHiring: pendingApprovals.filter(j => j.isProfessionalHiring).length,
      unverifiedPending: pendingApprovals.filter(j => !j.isProfessionalHiring).length,
      totalSeekers: 12450, 
      totalEmployers: 840,
      leadVolume: MOCK_LEADS.length,
      avgTicketTime: '1.4h',
      csat: '4.8/5'
    };
  }, [jobs, transactions]);

  const shortlistServiceApplications = useMemo(() => {
    return applications.filter(app => {
      const job = jobs.find(j => j.id === app.jobId);
      return job?.isShortlistService || job?.isProfessionalHiring;
    });
  }, [applications, jobs]);

  // Dynamic Navigation based on role
  const navItems = useMemo(() => {
    const base = [{ id: 'overview', label: 'Performance', icon: Layers }];
    
    // Only Head roles and Super Admin can manage staff
    if (['super_admin', 'recruiter_head', 'cs_head', 'finance_head', 'sales_manager'].includes(opRole)) {
      base.push({ id: 'staff', label: 'Staff Hub', icon: UserCog });
    }

    if (opRole.includes('sales')) {
      base.push({ id: 'crm', label: 'Pipeline CRM', icon: Target });
    }
    if (opRole.includes('recruiter') || opRole === 'super_admin') {
      base.push({ id: 'shortlist', label: 'Shortlist Desk', icon: Target });
      base.push({ id: 'oversight', label: 'Hiring Oversight', icon: FileSearch });
    }
    if (opRole.includes('cs') || opRole === 'super_admin') {
      base.push({ id: 'verifications', label: 'Verifications', icon: ShieldCheck });
      base.push({ id: 'tickets', label: 'Service Desk', icon: Ticket });
    }
    if (opRole.includes('finance') || opRole === 'super_admin') {
      base.push({ id: 'ledger', label: 'Financial Ledger', icon: Wallet });
    }
    base.push({ id: 'users', label: 'User Directory', icon: Users });
    return base;
  }, [opRole]);

  // Initial tab correction
  React.useEffect(() => {
    if (!navItems.find(n => n.id === viewTab)) {
      setViewTab(navItems[0].id);
    }
  }, [navItems, viewTab]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 text-white pb-32 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-black tracking-tight">Operation <span className="gradient-text">Center</span></h1>
            <span className="px-2 py-0.5 rounded-md bg-[#F0C927]/10 text-[#F0C927] border border-[#F0C927]/20 text-[10px] font-black uppercase tracking-widest">
              {opRole.replace('_', ' ')}
            </span>
          </div>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Platform Intelligence • {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-2xl border-white/5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#41d599] animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-[#41d599]">System Healthy</span>
          </div>
          <button onClick={onBack} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>

      {/* Dynamic KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {opRole.includes('sales') ? (
          <>
            <KPICard label="Pipeline Value" value={`$${(stats.leadVolume * 1200).toLocaleString()}`} icon={TrendingUp} color="text-emerald-400" />
            <KPICard label="Active Leads" value={stats.leadVolume} icon={Target} color="text-emerald-400" />
            <KPICard label="Goal Achievement" value="92%" icon={Crown} color="text-emerald-400" />
            <KPICard label="Conversion" value="14.2%" icon={Zap} color="text-emerald-400" />
          </>
        ) : opRole.includes('finance') ? (
          <>
            <KPICard label="Annual Recurring" value="$4.2M" icon={DollarSign} color="text-indigo-400" />
            <KPICard label="Pending Invoices" value="18" icon={FileText} color="text-indigo-400" />
            <KPICard label="Burn Rate" value="-$12k/mo" icon={TrendingDown} color="text-red-400" />
            <KPICard label="Tax Liability" value="$84k" icon={Shield} color="text-indigo-400" />
          </>
        ) : opRole.includes('cs') ? (
          <>
            <KPICard label="CSAT Score" value={stats.csat} icon={BadgeCheck} color="text-teal-400" />
            <KPICard label="Avg Response" value={stats.avgTicketTime} icon={Clock} color="text-teal-400" />
            <KPICard label="Verification Queue" value={pendingVerifications.length} icon={ShieldAlert} color="text-teal-400" />
            <KPICard label="Active Chats" value="4" icon={MessageSquare} color="text-teal-400" />
          </>
        ) : (
          <>
            <KPICard label="Global Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-[#41d599]" />
            <KPICard label="Shortlist Tasks" value={stats.shortlistCount} icon={Zap} color="text-purple-400" />
            <KPICard label="Verified Talent" value={stats.totalSeekers.toLocaleString()} icon={Users} color="text-[#F0C927]" />
            <KPICard label="System Load" value="14%" icon={Activity} color="text-blue-400" />
          </>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#06213f] rounded-3xl w-fit border border-white/5">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setViewTab(item.id)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewTab === item.id ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <item.icon size={14} /> {item.label}
          </button>
        ))}
      </div>

      {/* VIEW: STAFF MANAGEMENT */}
      {viewTab === 'staff' && (
        <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
           <div className="p-8 border-b border-white/5 bg-[#F0C927]/5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-[#F0C927]">Staff Administration Hub</h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Provision access for regional and departmental operators</p>
            </div>
            <button 
              onClick={() => setShowAddStaff(true)}
              className="px-6 py-2.5 bg-[#F0C927] text-[#0a4179] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <UserPlus size={16} /> Create Staff Account
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <tr>
                  <th className="px-8 py-5">Full Name</th>
                  <th className="px-8 py-5">Operational Role</th>
                  <th className="px-8 py-5">Security Level</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: 'Sarah Sales', email: 'sarah@jobconnect.ai', role: 'sales_exec' },
                  { name: 'Mark Manager', email: 'mark@jobconnect.ai', role: 'sales_manager' },
                  { name: 'Rachel Head-Rec', email: 'rachel@jobconnect.ai', role: 'recruiter_head' },
                  { name: 'Fiona Head-Finance', email: 'fiona@jobconnect.ai', role: 'finance_head' },
                ].map((s, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[#F0C927] text-xs">
                          {s.name[0]}
                        </div>
                        <div>
                           <p className="text-sm font-bold">{s.name}</p>
                           <p className="text-[10px] text-white/20 font-mono">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-[#F0C927]/10 text-[#F0C927] text-[9px] font-black uppercase tracking-widest border border-[#F0C927]/20">
                        {s.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/40">
                         <Shield size={14} className={s.role.includes('head') || s.role.includes('manager') ? 'text-[#41d599]' : 'text-blue-400'} />
                         {s.role.includes('head') || s.role.includes('manager') ? 'Executive Oversight' : 'Standard Operator'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-[#F0C927] transition-all"><MoreHorizontal size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: CRM PIPELINE */}
      {viewTab === 'crm' && (
        <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
           <div className="p-8 border-b border-white/5 bg-emerald-500/5 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-emerald-400">Sales Pipeline (Kanban)</h3>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Active deals for Premium and Shortlist services</p>
            </div>
            <button className="px-6 py-2.5 bg-emerald-500 text-[#0a4179] rounded-xl text-[10px] font-black uppercase tracking-widest">+ New Deal</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <tr>
                  <th className="px-8 py-5">Company Account</th>
                  <th className="px-8 py-5">Deal Stage</th>
                  <th className="px-8 py-5">Est. Value</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_LEADS.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-emerald-400 text-xs border border-emerald-400/20">{lead.company[0]}</div>
                        <p className="text-sm font-bold">{lead.company}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">{lead.stage}</span>
                    </td>
                    <td className="px-8 py-6 font-black">${lead.value}</td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2.5 rounded-xl bg-white/5 text-emerald-400 hover:bg-emerald-400 hover:text-white transition-all"><PhoneOutgoing size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: FINANCE LEDGER */}
      {viewTab === 'ledger' && (
        <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-white/5 bg-indigo-500/5 space-y-2">
            <h3 className="text-xl font-black text-indigo-400">Financial Transaction Ledger</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Global P&L Monitoring and Reconciliation</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <tr>
                  <th className="px-8 py-5">Transaction Account</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02]">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold">{tx.userName}</p>
                      <p className="text-[10px] text-white/20">{tx.item}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-indigo-400">${tx.amount}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-300">
                        <Check size={14} /> Completed
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2.5 rounded-xl bg-white/5 text-indigo-400 hover:bg-white/10"><FileSearch size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: OVERVIEW */}
      {viewTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 glass rounded-[40px] p-8 border-white/5 space-y-6">
            <div>
              <h3 className="text-xl font-bold">Aggregate Performance</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Global Operation Telemetry</p>
            </div>
            <div className="h-48 w-full flex items-end gap-2 px-2 mt-4">
              {[45, 60, 40, 80, 55, 90, 70, 85, 100, 75, 95, 80].map((h, i) => (
                <div key={i} className="flex-1 bg-[#1F8E85]/20 hover:bg-[#F0C927]/60 transition-all rounded-t-lg"></div>
              ))}
            </div>
          </div>
          <div className="glass rounded-[40px] p-8 border-white/5 flex flex-col justify-center text-center">
            <PieChart size={120} className="mx-auto text-[#F0C927] opacity-20" />
            <h3 className="text-xl font-bold mt-6">Dept. Efficiency</h3>
            <p className="text-xs text-white/40 mt-2">All sectors operating within nominal parameters.</p>
          </div>
        </div>
      )}

      {/* Legacy Views Correctly Filtered (Shortlist, Oversights, etc) */}
      {viewTab === 'shortlist' && (
        <ShortlistTable applications={shortlistServiceApplications} jobs={jobs} onUpdate={onUpdateApplicationStatus} />
      )}
      
      {viewTab === 'verifications' && (
        <VerificationTable accounts={pendingVerifications} onVerify={onVerifyEmployer} />
      )}

      {viewTab === 'oversight' && (
        <OversightTable jobs={jobs.filter(j => j.status === 'pending_approval')} onApprove={onApproveJob} />
      )}

      {viewTab === 'users' && (
        <UserDirectoryTable />
      )}

      {/* MODAL: ADD STAFF */}
      {showAddStaff && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="glass w-full max-w-lg rounded-[40px] p-10 border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowAddStaff(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><XCircle size={24} /></button>
              
              <div className="mb-8">
                 <h2 className="text-2xl font-black">Provision <span className="gradient-text">Staff Access</span></h2>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Authorized creation of departmental operators</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                    <input 
                      type="text" 
                      value={newStaff.name}
                      onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                      placeholder="e.g. John Operator" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Corporate Email</label>
                    <input 
                      type="email" 
                      value={newStaff.email}
                      onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                      placeholder="john@jobconnect.ai" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all"
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Operational Role</label>
                    <select 
                      value={newStaff.role}
                      onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-[#F0C927] transition-all text-white"
                    >
                      <option value="sales_exec" className="bg-[#0a4179]">Sales Executive</option>
                      <option value="sales_manager" className="bg-[#0a4179]">National Sales Manager</option>
                      <option value="cs_operator" className="bg-[#0a4179]">CS Operator</option>
                      <option value="cs_head" className="bg-[#0a4179]">Head of CS</option>
                      <option value="recruiter" className="bg-[#0a4179]">Recruiter</option>
                      <option value="recruiter_head" className="bg-[#0a4179]">Head of Recruitment</option>
                      <option value="finance_manager" className="bg-[#0a4179]">Finance Manager</option>
                      <option value="finance_head" className="bg-[#0a4179]">Head of Finance</option>
                    </select>
                 </div>
              </div>

              <div className="mt-10">
                 <button 
                   onClick={() => { setShowAddStaff(false); }}
                   className="w-full py-5 rounded-[22px] bg-[#F0C927] text-[#0a4179] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                 >
                   Deploy User Credentials
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Sub-components for cleaner structure
const KPICard = ({ label, value, icon: Icon, color }: any) => (
  <div className="glass rounded-[32px] p-6 border-white/5 space-y-4 hover:-translate-y-1 transition-transform">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl bg-white/5 ${color}`}>
        <Icon size={20} />
      </div>
      <span className={`text-[10px] font-black text-white/20`}>Live</span>
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  </div>
);

const ShortlistTable = ({ applications, jobs, onUpdate }: any) => (
  <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 border-b border-white/5 bg-purple-500/5 space-y-2">
      <h3 className="text-xl font-black text-purple-400">Shortlist Service Pipeline</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Move candidates to "Final Interview" to reveal them to employers.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <tr>
            <th className="px-8 py-5">Candidate</th>
            <th className="px-8 py-5">Role / Company</th>
            <th className="px-8 py-5">Stage</th>
            <th className="px-8 py-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {applications.map(app => (
            <tr key={app.id} className="hover:bg-white/[0.02]">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidateProfile?.name}`} alt="" />
                  </div>
                  <p className="text-sm font-bold">{app.candidateProfile?.name}</p>
                </div>
              </td>
              <td className="px-8 py-6">
                <p className="text-xs font-bold">{jobs.find(j => j.id === app.jobId)?.title}</p>
                <p className="text-[10px] text-white/20 uppercase font-black">{jobs.find(j => j.id === app.jobId)?.company}</p>
              </td>
              <td className="px-8 py-6">
                <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[9px] font-black uppercase">{app.status}</span>
              </td>
              <td className="px-8 py-6 text-right">
                 <select 
                    value={app.status}
                    onChange={(e) => onUpdate(app.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-white outline-none focus:border-purple-400"
                 >
                   {STAGES.map(s => <option key={s.value} value={s.value} className="bg-[#0a4179]">{s.label}</option>)}
                 </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const VerificationTable = ({ accounts, onVerify }: any) => (
  <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 border-b border-white/5 bg-teal-500/5 space-y-2">
      <h3 className="text-xl font-black text-teal-400">Employer Identity Queue</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Verify corporate credentials before publishing listings.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <tr>
            <th className="px-8 py-5">Company / Contact</th>
            <th className="px-8 py-5">Industry</th>
            <th className="px-8 py-5 text-right">Decision</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {accounts.map(emp => (
            <tr key={emp.id} className="hover:bg-white/[0.02]">
              <td className="px-8 py-6">
                <p className="text-sm font-bold">{emp.companyName}</p>
                <p className="text-[10px] text-white/20">{emp.email}</p>
              </td>
              <td className="px-8 py-6 text-xs text-white/40">{emp.industry || 'Global Tech'}</td>
              <td className="px-8 py-6 text-right">
                <button onClick={() => onVerify(emp.id)} className="px-5 py-2.5 rounded-xl bg-teal-500 text-[#0a4179] text-[10px] font-black uppercase shadow-lg">Verify Account</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const OversightTable = ({ jobs, onApprove }: any) => (
  <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 border-b border-white/5 bg-orange-500/5 space-y-2">
      <h3 className="text-xl font-black text-orange-400">Job Oversight Desk</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Professional and Pending listings audit.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          <tr>
            <th className="px-8 py-5">Role / Company</th>
            <th className="px-8 py-5">Tier</th>
            <th className="px-8 py-5 text-right">Release</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {jobs.map(job => (
            <tr key={job.id} className="hover:bg-white/[0.02]">
              <td className="px-8 py-6">
                <p className="text-sm font-bold">{job.title}</p>
                <p className="text-[10px] text-white/20">{job.company}</p>
              </td>
              <td className="px-8 py-6">
                <span className="text-[10px] font-black text-orange-400 uppercase">{job.isProfessionalHiring ? 'Professional' : 'Standard'}</span>
              </td>
              <td className="px-8 py-6 text-right">
                <button onClick={() => onApprove(job.id)} className="px-5 py-2.5 rounded-xl bg-orange-400 text-white text-[10px] font-black uppercase shadow-lg">Approve JD</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const UserDirectoryTable = () => (
  <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
    <div className="p-8 border-b border-white/5 space-y-2">
      <h3 className="text-xl font-black">User Identity Management</h3>
      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Search global directory of talent and employers.</p>
    </div>
    <div className="p-20 text-center opacity-20">
       <Search size={48} className="mx-auto" />
       <p className="mt-4 text-sm font-black uppercase">Database Connected</p>
    </div>
  </div>
);

export default AdminDashboard;
