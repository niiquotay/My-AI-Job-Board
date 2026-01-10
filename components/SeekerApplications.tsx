import React from 'react';
import { Send, Clock, CheckCircle2, XCircle, Search, Filter, Briefcase, Calendar, ChevronRight, MapPin, DollarSign, Building2, Crown } from 'lucide-react';
import { Application, Job } from '../types';
import Tooltip from './Tooltip';

interface SeekerApplicationsProps {
  applications: Application[];
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onViewCompany: (companyName: string) => void;
}

const SeekerApplications: React.FC<SeekerApplicationsProps> = ({ applications, jobs, onSelectJob, onViewCompany }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in duration-500 text-white pb-32 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 px-1">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">Deployment <span className="gradient-text">Manifest</span></h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">Pipeline tracking environment</p>
        </div>
        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-black uppercase text-[#41d599] tracking-widest">
          Active: {applications.length}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="glass rounded-[32px] p-16 text-center border-dashed border-white/5 mt-8 opacity-40">
          <Briefcase size={32} className="mx-auto text-white/10 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest">No Applications Dispatched</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {applications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (!job) return null;
            const isRejected = app.status === 'rejected';
            const isHired = app.status === 'hired';

            return (
              <div key={app.id} onClick={() => onSelectJob(job)} className="glass group transition-all rounded-2xl p-2.5 border border-white/5 flex flex-col md:flex-row items-center gap-3 shadow-lg cursor-pointer relative overflow-hidden hover:bg-white/[0.05]">
                <div className={`absolute top-0 left-0 w-1 h-full opacity-60 ${isRejected ? 'bg-red-500' : isHired ? 'bg-[#41d599]' : 'bg-[#F0C927]'}`}></div>
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl bg-[#0a4179] border border-white/10 flex items-center justify-center font-black text-[#F0C927] text-sm shrink-0 overflow-hidden`}>
                  {job.logoUrl ? <img src={job.logoUrl} className="w-full h-full object-cover" /> : job.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black truncate">{job.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 mt-0.5">
                    <span className="truncate">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {job.city}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 pr-2">
                   <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isRejected ? 'text-red-400' : isHired ? 'text-[#41d599]' : 'text-[#F0C927]'}`}>{app.status.replace('-', ' ')}</p>
                      <p className="text-[8px] text-white/20 font-bold uppercase mt-0.5">Deployed: {new Date(app.appliedDate).toLocaleDateString()}</p>
                   </div>
                   <div className="w-7 h-7 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:text-white transition-all"><ChevronRight size={14} /></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeekerApplications;