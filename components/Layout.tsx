import React, { useState } from 'react';
import {
  User, Briefcase, LayoutDashboard, Bell, Search, Settings as SettingsIcon,
  LogOut, UserCircle, Megaphone, Zap, ClipboardList,
  Bookmark, Send, BarChart3, Users, Receipt, Video, PlusCircle, FileStack, ShieldCheck,
  MessageSquareCode, MessageSquareShare, Menu, X, BarChart, FileCheck, Lock, Building2, Building, Package
} from 'lucide-react';
import { ViewType, UserProfile } from '../types';
import Tooltip from './Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewType;
  setView: (view: any) => void; // Allow extended view types for internal signaling
  user: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, view, setView, user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isEmployer = user.isEmployer;
  const isAdmin = user.isAdmin;
  const isPremium = user.isSubscribed;

  const handleNavClick = (targetView: string) => {
    setView(targetView);
    setIsMobileMenuOpen(false);
  };

  // Extended check to hide sidebar on landing pages for other models
  const isPublicView = [
    'home',
    'signin',
    'hrm-landing',
    'payroll-landing',
    'vendor-landing'
  ].includes(view);

  if (isPublicView) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden">
        <main className="w-full h-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a4179]">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 glass border-b border-white/10 sticky top-0 z-[60]">
        <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F0C927]">
            CALIBERDESK
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/5 text-[#F0C927] border border-white/10 active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-[#06213f] border-r border-white/5 p-6 z-50 
        transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col overflow-y-auto custom-scrollbar text-white
      `}>
        <div className="flex items-center justify-between mb-10 md:mb-10 px-2">
          <div className="cursor-pointer group" onClick={() => handleNavClick('home')}>
            <div className="text-[12px] font-black uppercase tracking-[0.2em] mb-1 text-[#F0C927]">
              CALIBERDESK
            </div>
            <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${isAdmin ? 'text-[#41d599]' : (isEmployer ? 'text-[#F0C927]/60' : 'text-[#1F8E85]')}`}>
              {isAdmin ? 'Central Intelligence' : (isEmployer ? 'Enterprise Hub' : 'Talent Portal')}
            </div>
          </div>
          <button
            className="md:hidden p-1 text-white/20 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {isAdmin ? (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#41d599] mb-2 px-3">Master Console</p>
              <Tooltip text="Access global system metrics, user verification queues, and financial ledgers." position="right" className="w-full">
                <button onClick={() => handleNavClick('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'admin' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <BarChart3 size={18} /> <span className="text-sm">Global Dashboard</span>
                </button>
              </Tooltip>
            </>
          ) : isEmployer ? (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 px-3">Hiring Hub</p>
              <Tooltip text="View hiring overview, active candidate counts, and organizational health metrics." position="right" className="w-full">
                <button onClick={() => handleNavClick('employer')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <LayoutDashboard size={18} /> <span className="text-sm">Dashboard</span>
                </button>
              </Tooltip>
              <Tooltip text="Manage your live job posts, edit requirements, or close positions." position="right" className="w-full">
                <button onClick={() => handleNavClick('employer-management')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer-management' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <ClipboardList size={18} /> <span className="text-sm">Listings</span>
                </button>
              </Tooltip>
              <Tooltip text="Manage sub-users and company subsidiaries." position="right" className="w-full">
                <button onClick={() => handleNavClick('employer-org')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer-org' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <Building2 size={18} /> <span className="text-sm">Org & Team</span>
                </button>
              </Tooltip>
              <Tooltip text="Create and deploy scenario-based aptitude tests for your listings." position="right" className="w-full">
                <button onClick={() => handleNavClick('employer-aptitude')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer-aptitude' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <FileCheck size={18} /> <span className="text-sm">Aptitude Tests</span>
                </button>
              </Tooltip>
              <Tooltip text="AI-powered assistant for drafting high-conversion outreach and offer letters." position="right" className="w-full">
                <button onClick={() => handleNavClick('employer-comm-assistant')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer-comm-assistant' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <MessageSquareShare size={18} /> <span className="text-sm">Employer AI Comm</span>
                </button>
              </Tooltip>
              <Tooltip text="Explore premium recruitment packages, shortlist services, and job listing tiers." position="right" className="w-full">
                <button onClick={() => handleNavClick('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'services' ? 'bg-[#F0C927] text-[#0a4179] font-black shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <Package size={18} /> <span className="text-sm">Services</span>
                </button>
              </Tooltip>
              <div className="px-3 pt-4">
                <Tooltip text="Create and publish a new job vacancy to the global marketplace." position="right" className="w-full">
                  <button onClick={() => handleNavClick('employer-post-job')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F0C927] text-[#0a4179] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#F0C927]/10 hover:opacity-90 transition-all active:scale-95">
                    <PlusCircle size={16} /> Post a Job
                  </button>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 px-3">Career Menu</p>
              <Tooltip text="Browse thousands of verified job listings matched to your profile using AI." position="right" className="w-full">
                <button onClick={() => handleNavClick('seeker')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'seeker' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <Search size={18} /> <span className="text-sm font-bold">Discover Jobs</span>
                </button>
              </Tooltip>
              <Tooltip text="Explore premium career services, CV optimization, and profile matching packages." position="right" className="w-full">
                <button onClick={() => handleNavClick('services')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'services' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <Package size={18} /> <span className="text-sm font-bold">Services</span>
                </button>
              </Tooltip>
              <Tooltip text="Real-time career telemetry and global mobility index." position="right" className="w-full">
                <button onClick={() => handleNavClick('seeker-insights')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'seeker-insights' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <BarChart size={18} /> <span className="text-sm font-bold">Market Insights</span>
                </button>
              </Tooltip>
              <Tooltip text="Draft perfect professional messages, emails, and LinkedIn posts using Gemini 3 Pro." position="right" className="w-full">
                <button onClick={() => handleNavClick('comm-assistant')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'comm-assistant' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <MessageSquareCode size={18} /> <span className="text-sm font-bold">AI Comm Studio</span>
                </button>
              </Tooltip>
              <Tooltip text="Analyze your CV and optimize your professional narrative for ATS systems." position="right" className="w-full">
                <button onClick={() => handleNavClick('cv-prep')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'cv-prep' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <FileStack size={18} /> <span className="text-sm font-bold">AI CV Prep</span>
                </button>
              </Tooltip>
              <Tooltip text={isPremium ? "Simulate high-stakes interviews with real-time feedback on your confidence and content." : "Premium Subscription required for AI Interview Prep."} position="right" className="w-full">
                <button onClick={() => handleNavClick('interview-prep')} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${view === 'interview-prep' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <div className="flex items-center gap-3">
                    <Video size={18} /> <span className="text-sm font-bold">AI Interview Prep</span>
                  </div>
                  {!isPremium && <Lock size={12} className="text-white/20" />}
                </button>
              </Tooltip>
              <Tooltip text="Track the progress of your sent applications and monitor recruitment stages." position="right" className="w-full">
                <button onClick={() => handleNavClick('seeker-applications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'seeker-applications' ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  <Send size={18} /> <span className="text-sm font-bold">Applications</span>
                </button>
              </Tooltip>
            </>
          )}

          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 px-3 pt-4">Management Space</p>
          {isEmployer ? (
            <Tooltip text="Manage your public organization profile, company bio, and branding assets." position="right" className="w-full">
              <button onClick={() => handleNavClick('employer-profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'employer-profile' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                <Building size={18} /> <span className="text-sm font-bold">Company Profile</span>
              </button>
            </Tooltip>
          ) : (
            <Tooltip text="Update your work history, skills, certifications, and portfolio details." position="right" className="w-full">
              <button onClick={() => handleNavClick('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'profile' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                <UserCircle size={18} /> <span className="text-sm font-bold">Career Profile</span>
              </button>
            </Tooltip>
          )}
          {!isAdmin && (
            <Tooltip text="Manage your subscription tier, payment methods, and view transaction receipts." position="right" className="w-full">
              <button onClick={() => handleNavClick('billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'billing' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                <Receipt size={18} /> <span className="text-sm font-bold">Financial History</span>
              </button>
            </Tooltip>
          )}
          <Tooltip text="Configure privacy settings, update passwords, and manage system notifications." position="right" className="w-full">
            <button onClick={() => handleNavClick('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view === 'settings' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
              <SettingsIcon size={18} /> <span className="text-sm font-bold">System Config</span>
            </button>
          </Tooltip>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <Tooltip text="Securely sign out of your profile and terminate the active recruitment session." position="right" className="w-full">
            <button onClick={() => handleNavClick('home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all">
              <LogOut size={18} /> <span className="text-sm font-bold">Shutdown Session</span>
            </button>
          </Tooltip>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-0">
        <div className="sticky top-0 z-40 p-4 md:px-10 md:py-6 bg-[#0a4179]/90 backdrop-blur-md flex items-center justify-between border-b border-white/5 mb-4">
          {/* Top Bar for Authenticated Users */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-black uppercase tracking-widest text-white">CaliberDesk</span>
            <h1 className="text-xl font-black uppercase tracking-tight text-white">{
              view === 'seeker' ? 'Discover Jobs' :
                view === 'employer' ? 'Hiring HQ' :
                  view.replace('-', ' ')
            }</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400 hover:text-[#0a4179] transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <LogOut size={14} /> Shutdown
            </button>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              {user.profileImages?.[0] ? <img src={user.profileImages[0]} className="w-full h-full rounded-full object-cover" /> : <User size={20} className="text-white/40" />}
            </div>
          </div>
        </div>
        <div className="px-4 md:px-10 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;