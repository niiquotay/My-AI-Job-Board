import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Users, Target, Zap, 
  FileText, Download, Sparkles, Loader2, PieChart, 
  Activity, ArrowUpRight, ArrowDownRight, Briefcase,
  CheckCircle2, Clock, MapPin, Globe, ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Job, Application, UserProfile } from '../types';
import { getEmployerInsights } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Tooltip from './Tooltip';
import Toast from './Toast';

interface EmployerAnalyticsProps {
  user: UserProfile;
  jobs: Job[];
  applications: Application[];
}

const EmployerAnalytics: React.FC<EmployerAnalyticsProps> = ({ user, jobs, applications }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const stats = useMemo(() => {
    const totalViews = jobs.length * 142; // Simulated views
    const conversionRate = applications.length > 0 ? Math.round((applications.filter(a => a.status === 'hired').length / applications.length) * 100) : 0;
    const avgMatchScore = jobs.reduce((acc, curr) => acc + (curr.matchScore || 85), 0) / (jobs.length || 1);
    
    return {
      activeJobs: jobs.filter(j => j.status === 'active').length,
      totalApplicants: applications.length,
      avgMatchScore: Math.round(avgMatchScore),
      hiredCount: applications.filter(a => a.status === 'hired').length,
      conversionRate
    };
  }, [jobs, applications]);

  useEffect(() => {
    handleSyncInsights();
  }, []);

  const handleSyncInsights = async () => {
    setIsSyncing(true);
    try {
      const data = await getEmployerInsights(jobs, applications);
      setInsights(data);
      setToast({ message: "Neural Intelligence Synced", type: 'success' });
    } catch (err) {
      setToast({ message: "Insight sync failed", type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadPDF = (targetJob?: Job) => {
    try {
      const doc = new jsPDF();
      const primaryColor = [10, 65, 121]; // #0a4179
      const reportTitle = targetJob ? `Role Management Report: ${targetJob.title}` : "Global Recruitment Intelligence Manifest";
      
      doc.setFillColor(10, 65, 121);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("AI-JOBCONNECT", 15, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Company: ${user.companyName || user.name}`, 15, 28);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 33);
      
      doc.setTextColor(10, 65, 121);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(reportTitle, 15, 55);
      
      let currentY = 65;
      const drawKPI = (label: string, value: string, x: number) => {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(label.toUpperCase(), x, currentY);
        doc.setFontSize(14);
        doc.setTextColor(10, 65, 121);
        doc.text(value, x, currentY + 7);
      };

      if (targetJob) {
        const jobApps = applications.filter(a => a.jobId === targetJob.id);
        const hasAptitude = targetJob.tags.includes('Engineering') || targetJob.tags.includes('AI');
        const passRate = hasAptitude ? '78%' : 'N/A';
        
        drawKPI("Applicants", jobApps.length.toString(), 15);
        drawKPI("Match Score", `${targetJob.matchScore || 85}%`, 65);
        drawKPI("Aptitude Pass Rate", passRate, 115);
        drawKPI("Status", targetJob.status ? targetJob.status.toUpperCase() : 'ACTIVE', 165);
        
        currentY += 25;
        doc.setFillColor(245, 247, 250);
        doc.rect(15, currentY, 180, 25, 'F');
        doc.setTextColor(10, 65, 121);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("AI PERFORMANCE ASSESSMENT:", 20, currentY + 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const perfStatus = insights?.rolePerformance?.find((p: any) => p.jobTitle === targetJob.title)?.status || "Awaiting neural sync for real-time status tracking...";
        doc.text(perfStatus, 20, currentY + 17);
        
        currentY += 40;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Role Responsibilities & Mission", 15, currentY);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const splitDesc = doc.splitTextToSize(targetJob.description || "No specific details provided for this track.", 180);
        doc.text(splitDesc, 15, currentY + 7);
      } else {
        drawKPI("Active Jobs", stats.activeJobs.toString(), 15);
        drawKPI("Global Pipeline", stats.totalApplicants.toString(), 65);
        drawKPI("Conversion Rate", `${stats.conversionRate}%`, 115);
        drawKPI("Avg Quality Index", `${stats.avgMatchScore}%`, 165);
        
        currentY += 30;
        doc.setFillColor(245, 247, 250);
        doc.rect(15, currentY, 180, 48, 'F');
        doc.setTextColor(10, 65, 121);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("EXECUTIVE AI DIRECTIVES", 20, currentY + 10);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Market Position: ${insights?.marketPosition || 'Analyzing market gravity...' }`, 20, currentY + 18);
        doc.text(`Pipeline Quality: ${insights?.candidateQuality || 'Processing talent depth...' }`, 20, currentY + 26);
        
        doc.setFont('helvetica', 'bold');
        doc.text("Priority Recommendations:", 20, currentY + 34);
        doc.setFont('helvetica', 'normal');
        const actionItem = insights?.actionItems?.[0] || 'Sync required for detailed strategic mandates.';
        doc.text(`- ${actionItem}`, 20, currentY + 41);

        currentY += 60;
        const tableData = jobs.map(j => [
          j.title,
          applications.filter(a => a.jobId === j.id).length,
          `${j.matchScore || 85}%`,
          j.tags.includes('Engineering') || j.tags.includes('AI') ? '78%' : 'N/A',
          insights?.rolePerformance?.find((p: any) => p.jobTitle === j.title)?.status || 'Pending'
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Role Identity', 'Applicants', 'Quality', 'Aptitude Pass', 'AI Status']],
          body: tableData,
          headStyles: { fillColor: [10, 65, 121] },
          styles: { fontSize: 8, cellPadding: 4 },
          alternateRowStyles: { fillColor: [250, 250, 250] }
        });
      }
      
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("© AI-JobConnect Enterprise Protocol • CONFIDENTIAL", 105, 285, { align: 'center' });
      }

      doc.save(`${reportTitle.replace(/\s+/g, '_')}.pdf`);
      setToast({ message: "Professional Report Downloaded", type: 'success' });
    } catch (err) {
      console.error("PDF generation error:", err);
      setToast({ message: "Failed to generate PDF. Check browser console.", type: 'error' });
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase">Acquisition <span className="gradient-text">Intelligence</span></h2>
          <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-0.5">Advanced Recruitment Analytics & Reporting</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={handleSyncInsights}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-1.5"
           >
             {isSyncing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />} 
             Sync AI
           </button>
           <button 
            onClick={() => handleDownloadPDF()}
            className="px-4 py-2 rounded-xl bg-[#F0C927] text-[#0a4179] text-[8px] font-black uppercase tracking-widest shadow-xl shadow-[#F0C927]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
           >
             <Download size={10} /> PDF Report
           </button>
        </div>
      </div>

      {/* Main KPI Grid - 3x smaller padding/font */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Pipeline', value: stats.totalApplicants, sub: 'Global Applicants', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, sub: 'Neural Alignment', icon: Target, color: 'text-[#41d599]', bg: 'bg-[#41d599]/10' },
          { label: 'Success Rate', value: `${stats.conversionRate}%`, sub: 'Hire Conversion', icon: TrendingUp, color: 'text-[#F0C927]', bg: 'bg-[#F0C927]/10' },
          { label: 'Time to Hire', value: '18d', sub: 'Regional: 24d', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-[20px] p-3 border-white/5 space-y-2.5 shadow-lg group hover:-translate-y-0.5 transition-all">
             <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={16} />
             </div>
             <div>
                <p className="text-[7px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                <h3 className="text-xl font-black mt-0.5">{stat.value}</h3>
                <p className="text-[6px] font-bold text-white/20 uppercase mt-0.5">{stat.sub}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recruitment Funnel - Compact */}
        <div className="lg:col-span-2 glass rounded-[28px] p-4 md:p-5 border-white/5 space-y-5 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Activity size={100} /></div>
           <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Performance Trajectory</h3>
                <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mt-0.5">Pipeline Efficiency Index</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#41d599]"></div>
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Acquired</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40">Projected</span>
                 </div>
              </div>
           </div>

           <div className="h-24 flex items-end gap-1.5 px-1">
              {[45, 65, 35, 85, 55, 95, 75].map((h, i) => (
                <div key={i} className="flex-1 space-y-1 group">
                   <div className="w-full bg-[#41d599]/10 rounded-t-lg group-hover:bg-[#41d599]/30 transition-all cursor-help relative" style={{ height: `${h}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#06213f] text-[#41d599] text-[6px] font-black px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        W{i+1}: {h}% Yield
                      </div>
                   </div>
                   <p className="text-[6px] font-black text-center text-white/20 uppercase">W{i+1}</p>
                </div>
              ))}
           </div>

           <div className="pt-3 border-t border-white/5 flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                 <p className="text-[7px] font-black uppercase tracking-widest text-white/30">AI Insight</p>
                 <p className="text-[9px] text-white/60 leading-relaxed font-medium">
                   "Conversion increased by <span className="text-[#41d599] font-black">12%</span>. Correlates with 'Culture-Fit' refinement."
                 </p>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                 <div className="w-10 h-10 rounded-full border-2 border-[#41d599]/20 border-t-[#41d599] flex items-center justify-center animate-spin-slow">
                    <span className="text-[7px] font-black uppercase">AI</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Action Items Sidebar - Compact */}
        <div className="glass rounded-[28px] p-5 border-white/5 space-y-4 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0a4179] to-[#06213f]">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tight">Strategic <span className="text-[#F0C927]">Mandates</span></h3>
              <Sparkles size={14} className="text-[#F0C927] animate-pulse" />
           </div>

           <div className="space-y-3">
              {isSyncing ? (
                <div className="flex flex-col items-center py-6 gap-2 opacity-40">
                   <Loader2 size={20} className="animate-spin" />
                   <p className="text-[7px] font-black uppercase tracking-widest">Syncing Strategy...</p>
                </div>
              ) : (
                insights?.actionItems?.map((item: string, i: number) => (
                  <div key={i} className="flex gap-2.5 group cursor-help">
                    <div className="shrink-0 w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F0C927] text-[8px] font-black group-hover:bg-[#F0C927] group-hover:text-[#0a4179] transition-all">
                      {i + 1}
                    </div>
                    <p className="text-[9px] text-white/50 font-medium leading-snug group-hover:text-white transition-colors">
                      {item}
                    </p>
                  </div>
                ))
              )}
           </div>

           <div className="pt-3 border-t border-white/5 space-y-2">
              <h4 className="text-[7px] font-black uppercase tracking-widest text-white/30">Employer Brand Strength</h4>
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[6px] font-black uppercase tracking-widest text-white/40">
                    <span>Current Sentiment</span>
                    <span className="text-[#41d599]">Excellent (88)</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#41d599] w-[88%] shadow-[0_0_5px_#41d599]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Role Performance Deep Dive - Compact Table */}
      <div className="glass rounded-[28px] border-white/5 overflow-hidden shadow-2xl">
         <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight">Performance Directory</h3>
              <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mt-0.5">Role optimization support</p>
            </div>
            <div className="text-[7px] font-black uppercase tracking-[0.2em] text-[#F0C927]">Neural-Linked Oversight</div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
                  <tr>
                    <th className="px-5 py-3">Role Identity</th>
                    <th className="px-5 py-3 text-center">Applicants</th>
                    <th className="px-5 py-3">Aptitude</th>
                    <th className="px-5 py-3">AI Status</th>
                    <th className="px-5 py-3 text-right">Reporting</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-[10px] font-medium">
                  {jobs.map(job => {
                    const perfStatus = insights?.rolePerformance?.find((p: any) => p.jobTitle === job.title)?.status;
                    const hasAptitude = job.tags.includes('Engineering') || job.tags.includes('AI');
                    
                    return (
                      <tr key={job.id} className="hover:bg-white/[0.02] group transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-black text-[9px] text-[#F0C927] border border-white/10 group-hover:bg-[#F0C927] group-hover:text-[#0a4179] transition-all overflow-hidden">
                              {job.logoUrl ? <img src={job.logoUrl} className="w-full h-full object-cover" /> : job.company[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate max-w-[120px]">{job.title}</p>
                              <p className="text-[7px] text-white/20 uppercase font-black truncate">{job.city} • {job.salary}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="font-black text-xs">{applications.filter(a => a.jobId === job.id).length}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                             <div className="w-10 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${hasAptitude ? 'bg-[#41d599]' : 'bg-white/10'} w-[78%]`}></div>
                             </div>
                             <span className={`text-[7px] font-black ${hasAptitude ? 'text-[#41d599]' : 'text-white/10'}`}>
                                {hasAptitude ? '78%' : 'N/A'}
                             </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                           <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${
                             perfStatus ? 'bg-[#F0C927]/10 text-[#F0C927] border-[#F0C927]/20' : 'bg-white/5 text-white/20 border-white/10'
                           }`}>
                             {perfStatus || "Standby"}
                           </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                           <Tooltip text="Generate Management PDF">
                             <button 
                              onClick={() => handleDownloadPDF(job)}
                              className="p-1.5 rounded-lg bg-white/5 text-white/20 hover:text-[#41d599] hover:bg-[#41d599]/10 transition-all border border-transparent hover:border-[#41d599]/20"
                             >
                                <FileText size={12} />
                             </button>
                           </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default EmployerAnalytics;