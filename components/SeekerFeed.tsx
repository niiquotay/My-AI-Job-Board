
// @ts-nocheck
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, MapPin, DollarSign, Calendar, Crown, Play, 
  ChevronRight, Sparkles, Send, Check, X, SlidersHorizontal, 
  Briefcase, Globe, Clock, Target, Trash2, LayoutGrid, Building2, Hammer, Rocket,
  Award, Users, ChevronDown, FileCheck, Bell, CheckCircle2, Building, Shield, Coins, Gift
} from 'lucide-react';
import { Job, UserProfile, Application } from '../types';
import { 
  ALL_COUNTRIES, REGIONS_BY_COUNTRY, JOB_TYPES, 
  SALARY_RANGES, SENIORITY_LEVELS, EMPLOYMENT_TYPES, 
  ORGANIZATION_TYPES, JOB_RANKS, DATE_POSTED_OPTIONS, BENEFITS
} from '../constants';
import Tooltip from './Tooltip';

interface SeekerFeedProps {
  jobs: Job[];
  user: UserProfile;
  applications: Application[];
  onSelectJob: (job: Job) => void;
  onInspectMatch: (job: Job) => void;
  onApply: (job: Job) => void;
  onViewCompany: (companyName: string) => void;
  onOpenAlerts: (keywords: string, location: string, minSalary: number) => void;
}

const CATEGORY_TABS = [
  { id: 'All Jobs', icon: LayoutGrid },
  { id: 'Formal Jobs', icon: Building2 },
  { id: 'Skilled Labour', icon: Hammer },
  { id: 'Growth & Start Up', icon: Rocket }
];

const COMPENSATION_STRUCTURES = ['Fixed', 'Commission Only', 'Commission + Salary'];

const SeekerFeed: React.FC<SeekerFeedProps> = ({ jobs, user, applications, onSelectJob, onInspectMatch, onApply, onViewCompany, onOpenAlerts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const dropdownRefs = {
    country: useRef<HTMLDivElement>(null),
    city: useRef<HTMLDivElement>(null),
    modality: useRef<HTMLDivElement>(null),
    employment: useRef<HTMLDivElement>(null),
    entity: useRef<HTMLDivElement>(null),
    rank: useRef<HTMLDivElement>(null),
    salary: useRef<HTMLDivElement>(null),
    recency: useRef<HTMLDivElement>(null),
    structure: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
  };

  const [filters, setFilters] = useState({
    country: '',
    city: '',
    jobTypes: [] as string[],
    employmentType: '',
    organizationType: '',
    jobRank: '',
    minSalary: 0,
    salaryStructure: '',
    benefits: [] as string[],
    isPremium: false,
    datePosted: '' 
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = Object.values(dropdownRefs).every(ref => ref.current && !ref.current.contains(target));
      if (isOutside) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableRegions = useMemo(() => filters.country ? (REGIONS_BY_COUNTRY[filters.country] || []) : [], [filters.country]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(job => {
        if (job.status !== 'active') return false;
        const matchesTab = activeTab === 'All Jobs' || job.category === activeTab;
        if (!matchesTab) return false;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        const matchesCountry = !filters.country || job.country === filters.country;
        const matchesCity = !filters.city || job.city === filters.city;
        if (!matchesCountry || !matchesCity) return false;
        const matchesJobType = filters.jobTypes.length === 0 || filters.jobTypes.includes(job.location);
        if (!matchesJobType) return false;
        const matchesEmployment = !filters.employmentType || job.employmentType === filters.employmentType;
        if (!matchesEmployment) return false;
        const matchesOrg = !filters.organizationType || job.organizationType === filters.organizationType;
        if (!matchesOrg) return false;
        const matchesRank = !filters.jobRank || job.jobRank === filters.jobRank;
        if (!matchesRank) return false;
        const matchesStructure = !filters.salaryStructure || job.salaryStructure === filters.salaryStructure;
        if (!matchesStructure) return false;
        const matchesBenefits = filters.benefits.length === 0 || filters.benefits.some(b => job.benefits?.includes(b));
        if (!matchesBenefits) return false;
        const matchesPremium = !filters.isPremium || job.isPremium;
        if (!matchesPremium) return false;
        const matchesDate = !filters.datePosted || filters.datePosted === 'all' || (() => {
          const postedTime = new Date(job.postedAt).getTime();
          const now = new Date().getTime();
          return (now - postedTime) / (1000 * 60 * 60) <= parseInt(filters.datePosted);
        })();
        if (!matchesDate) return false;
        const parseSalary = (s: string) => {
          const match = s.match(/(\d+)/);
          if (!match) return 0;
          let val = parseInt(match[1]);
          if (s.toLowerCase().includes('k')) val *= 1000;
          return val;
        };
        const matchesSalary = !filters.minSalary || parseSalary(job.salary) >= filters.minSalary;
        if (!matchesSalary) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
  }, [jobs, searchQuery, filters, activeTab]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.jobTypes.length > 0) count++;
    if (filters.employmentType) count++;
    if (filters.organizationType) count++;
    if (filters.jobRank) count++;
    if (filters.minSalary > 0) count++;
    if (filters.salaryStructure) count++;
    if (filters.benefits.length > 0) count++;
    if (filters.datePosted && filters.datePosted !== 'all') count++;
    return count;
  }, [filters]);

  const resetFilters = () => setFilters({ country: '', city: '', jobTypes: [], employmentType: '', organizationType: '', jobRank: '', minSalary: 0, salaryStructure: '', benefits: [], isPremium: false, datePosted: '' });

  const Dropdown = ({ id, label, value, options, onSelect, displayValue, refObj, isMulti = false, onToggleMulti, disabled = false }: any) => {
    const isOpen = openDropdown === id;
    return (
      <div className={`space-y-1 ${disabled ? 'opacity-30' : ''}`} ref={refObj}>
        <label className="text-[10px] font-black uppercase text-white/30 ml-1 tracking-widest">{label}</label>
        <div className="relative">
          <div onClick={() => !disabled && setOpenDropdown(isOpen ? null : id)} className={`w-full bg-white/5 border rounded-lg py-1.5 px-2.5 text-xs text-white flex items-center justify-between transition-all h-8 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-white/20'} ${isOpen ? 'border-[#F0C927]/50' : 'border-white/10'}`}>
            <span className="truncate pr-1 font-bold uppercase tracking-tighter">{displayValue || value || "Any"}</span>
            <ChevronDown size={10} className={`text-white/20 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-[100] bg-[#06213f] rounded-lg border border-white/10 shadow-2xl p-1 max-h-48 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-1">
              {options.map((opt: any) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                const isSelected = isMulti ? value.includes(optValue) : value === optValue;
                return (
                  <div key={optValue} onClick={() => { if (isMulti) onToggleMulti(optValue); else { onSelect(optValue); setOpenDropdown(null); } }} className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer mb-0.5 last:mb-0 ${isSelected ? 'bg-[#F0C927] text-[#0a4179]' : 'text-white/60 hover:bg-white/5'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{optLabel}</span>
                    {isSelected && <Check size={10} strokeWidth={4} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-2 items-center px-1">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search roles or companies..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-[#F0C927] outline-none shadow-md" />
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => onOpenAlerts(searchQuery, filters.country, filters.minSalary)} className="p-2.5 rounded-xl bg-white/5 text-[#F0C927] border border-white/10 hover:bg-white/10 transition-all shadow-md active:scale-95"><Bell size={18} /></button>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${showFilters || activeFilterCount > 0 ? 'bg-[#F0C927] text-[#0a4179] border-[#F0C927]' : 'bg-white/5 text-white/40 border-white/10'}`}>
            <SlidersHorizontal size={12} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#06213f]/40 rounded-xl border border-white/5 mx-1 overflow-x-auto no-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all group ${activeTab === tab.id ? 'bg-[#F0C927] text-[#0a4179]' : 'text-white/40 hover:bg-white/5'}`}>
            <tab.icon size={12} />
            <span className="text-xs font-black uppercase tracking-widest">{tab.id}</span>
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="glass rounded-[20px] p-4 border-white/10 animate-in slide-in-from-top-2 space-y-4 mx-1 z-30 relative">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Dropdown id="country" label="Geography" value={filters.country} options={ALL_COUNTRIES} displayValue={filters.country || "Global"} onSelect={(val) => setFilters({...filters, country: val, city: ''})} refObj={dropdownRefs.country} />
            <Dropdown id="city" label="Region" value={filters.city} options={availableRegions} displayValue={!filters.country ? "Select Country" : filters.city || "All Regions"} onSelect={(val) => setFilters({...filters, city: val})} refObj={dropdownRefs.city} disabled={!filters.country} />
            <Dropdown id="employment" label="Engagement" value={filters.employmentType} options={EMPLOYMENT_TYPES} onSelect={(val) => setFilters({...filters, employmentType: val})} refObj={dropdownRefs.employment} />
            <Dropdown id="rank" label="Operational Rank" value={filters.jobRank} options={JOB_RANKS} onSelect={(val) => setFilters({...filters, jobRank: val})} refObj={dropdownRefs.rank} />
            <Dropdown id="salary" label="Min. Salary" value={filters.minSalary} options={SALARY_RANGES.map(s => ({ label: s.label, value: s.min }))} displayValue={SALARY_RANGES.find(s => s.min === filters.minSalary)?.label} onSelect={(val) => setFilters({...filters, minSalary: val})} refObj={dropdownRefs.salary} />
          </div>
          <button onClick={resetFilters} className="w-full py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10">Clear Search Parameters</button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-1.5 mx-1">
        {filteredJobs.map(job => {
          const isApplied = applications.some(a => a.jobId === job.id && a.candidateProfile?.email === user.email);
          return (
            <div key={job.id} onClick={() => onSelectJob(job)} className={`glass group transition-all rounded-[16px] p-2.5 border cursor-pointer flex items-center justify-between gap-3 shadow-md relative overflow-hidden ${isApplied ? 'opacity-60 grayscale-[0.3]' : job.isPremium ? 'bg-[#F0C927]/5 border-[#F0C927]/20 hover:bg-[#F0C927]/10' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${isApplied ? 'bg-[#41d599]' : job.isPremium ? 'bg-[#F0C927]' : 'bg-transparent'}`}></div>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center font-black text-sm shrink-0 overflow-hidden ${job.isPremium ? 'border-[#F0C927]/40' : 'border-white/5 bg-[#0a4179]'}`}>{job.logoUrl ? <img src={job.logoUrl} className="w-full h-full object-cover" /> : job.company[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-black truncate leading-tight ${job.isPremium ? 'text-[#F0C927]' : 'text-white'}`}>{job.title}</h3>
                    {job.isPremium && <span className="px-1 py-0.5 rounded bg-[#F0C927] text-[#0a4179] text-[6px] font-black uppercase tracking-widest">GOLD</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 mt-0.5">
                    <span className="flex items-center gap-1"><Building2 size={10} /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {job.city}</span>
                    <span className="text-[#41d599] font-black">{job.salary}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isApplied ? (
                  <span className="px-3 py-1 rounded-lg bg-[#41d599]/10 text-[#41d599] text-[10px] font-black uppercase tracking-widest border border-[#41d599]/20">Applied</span>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); onApply(job); }} className="py-1 px-4 rounded-lg bg-[#F0C927] text-[#0a4179] font-black uppercase text-[10px] tracking-widest shadow-md">Apply</button>
                )}
                <div className="w-7 h-7 rounded-full border border-white/5 flex items-center justify-center text-white/10 group-hover:text-[#F0C927] transition-all"><ChevronRight size={14} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeekerFeed;
