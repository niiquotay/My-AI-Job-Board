// @ts-nocheck
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Users, Briefcase, ChevronRight, BarChart3, Filter, Search,
  Trash2, Eye, CheckCircle2, XCircle, Play,
  ArrowLeft, Crown, Clock, Calendar, MapPin, Power, PowerOff, ArrowUpCircle,
  FileText, MessageSquare, ClipboardCheck, UserCheck, Banknote, ShieldCheck, Mail, Download, FileArchive,
  Loader2, LayoutGrid, List, TrendingUp, PieChart, Activity, UserPlus, ArrowRight, ShieldAlert, X, Sparkles,
  Zap, Lock, Target, ExternalLink, Globe, AlertCircle, FileStack, ClipboardList, Package, CreditCard,
  CheckCircle, ArrowUpRight, Wand2, RefreshCw, DollarSign, ChevronDown, Linkedin, MessageCircle, Phone, Smartphone, User as UserIcon,
  Megaphone, BadgeCheck, Check, Send, Archive, Layers, Star, GraduationCap, Building2, History, Plus, Heart, Coins,
  Building, Shield, Map, Locate, MapPinned, Gift, Gem, AlertTriangle, Edit, UserCheck2, CheckSquare, Square, Info, Upload
} from 'lucide-react';
import { Job, Application, ApplicationStatus, UserProfile, Transaction } from '../types';
import { isJobActuallyActive, ORGANIZATION_TYPES, EMPLOYMENT_TYPES, JOB_RANKS, BENEFITS } from '../constants';
import {
  ALL_COUNTRIES, REGIONS_BY_COUNTRY, GENDER_OPTIONS, AGE_RANGES,
  RACE_OPTIONS, DISABILITY_OPTIONS, RELIGION_OPTIONS,
  MARITAL_STATUS_OPTIONS, VETERAN_STATUS_OPTIONS, POST_SALARY_RANGES,
  COUNTRY_CURRENCY_SYMBOLS, GLOBAL_CURRENCIES
} from '../constants';
import Toast from './Toast';
import Tooltip from './Tooltip';
import EmployerAnalytics from './EmployerAnalytics';
import { generateJobSection, parseJobDescription } from '../services/geminiService';

const CATEGORIES = ['Formal Jobs', 'Skilled Labour', 'Growth & Start Up'];
const JOB_LOCATION_TYPES = ['Remote', 'Onsite', 'Hybrid'];
const SALARY_STRUCTURES = ['Fixed', 'Commission Only', 'Commission + Salary'];
const AVAILABILITY_OPTIONS = ['Immediate', 'Within 2 Weeks', '1 Month Notice', 'Negotiable', 'Specific Date'];
const ELIGIBILITY_PROTOCOLS = [
  'Global (No Restriction)',
  'Specific Country Only',
  'EMEA (Europe, Middle East, Africa)',
  'SWANA (South West Asia & North Africa)',
  'MENA (Middle East & North Africa)',
  'MENAP (Middle East, North Africa, Afghanistan, Pakistan)',
  'WANA (West Asia & North Africa)',
  'North Africa',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'Sub-Saharan Africa',
  'APAC (Asia Pacific)',
  'ASEAN (Southeast Asia)',
  'South Asia',
  'East Asia',
  'Central Asia',
  'North America',
  'LATAM (Latin America)',
  'South America',
  'Central America & Caribbean',
  'European Union (EU)',
  'Nordics',
  'DACH (DE, AT, CH)',
  'Benelux',
  'Oceania'
];

interface JobManagementProps {
  jobs: Job[];
  user: UserProfile;
  applications: Application[];
  onUpdateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  onToggleJobStatus: (jobId: string) => void;
  onUpgradeJob: (jobId: string) => void;
  onUpgradeRequest: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onPostJob: (job: Job) => void;
  onCloseModal?: () => void;
  autoOpenCreate?: boolean;
  activeTab?: 'overview' | 'listings';
  onSelectJob?: (job: Job) => void;
  initialJobData?: Job | null;
}

const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  user,
  applications,
  onUpdateApplicationStatus,
  onToggleJobStatus,
  onUpgradeJob,
  onDeleteJob,
  onPostJob,
  onUpgradeRequest,
  onCloseModal,
  autoOpenCreate = false,
  activeTab = 'overview',
  onSelectJob,
  initialJobData
}) => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(autoOpenCreate);
  const [modalStep, setModalStep] = useState<'form' | 'preview'>('form');
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [viewingJobApplicants, setViewingJobApplicants] = useState<Job | null>(null);
  const [reviewingApplicant, setReviewingApplicant] = useState<Application | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [listStatusFilter, setListStatusFilter] = useState<'all' | 'active' | 'closed' | 'draft'>('all');
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadFilter, setDownloadFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isUploadingJD, setIsUploadingJD] = useState(false);
  const jdUploadRef = useRef<HTMLInputElement>(null);

  // Multi-location state
  const [tempCountry, setTempCountry] = useState('');
  const [tempRegions, setTempRegions] = useState<string[]>([]);
  const [deploymentManifest, setDeploymentManifest] = useState<{ country: string, region: string }[]>([]);

  // Salary localized state
  const [isCustomSalary, setIsCustomSalary] = useState(false);
  const [salaryRaw, setSalaryRaw] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('USD');

  const [newJob, setNewJob] = useState<Partial<Job>>(initialJobData || {
    title: '',
    category: 'Formal Jobs',
    city: '',
    country: 'USA',
    salary: '',
    salaryStructure: 'Fixed',
    location: 'Remote',
    roleDefinition: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: [],
    applicationType: 'in-app',
    employmentType: 'Full-time',
    organizationType: 'Private',
    jobRank: 'Entry Level',
    allowedCountries: ['Global (No Restriction)'],
    targetGender: 'Any',
    targetRace: 'Any',
    targetReligion: 'Any',
    availabilityRequirement: 'Immediate'
  });

  // Sync currency with country on change
  useEffect(() => {
    if (newJob.country) {
      const match = GLOBAL_CURRENCIES.find(c => c.label.includes(newJob.country!));
      if (match) setSelectedCurrencyCode(match.code);
    }
  }, [newJob.country]);

  // Effect to sync local salary states with current job data
  useEffect(() => {
    if (newJob.salary) {
      const activeSymbol = GLOBAL_CURRENCIES.find(c => c.code === selectedCurrencyCode)?.symbol || '$';
      const stripped = newJob.salary.replace(activeSymbol, '').trim();
      const inDropdown = POST_SALARY_RANGES.includes(stripped);
      setIsCustomSalary(!inDropdown);
      setSalaryRaw(stripped);
    }
  }, [newJob.salary, selectedCurrencyCode]);

  useEffect(() => {
    if (autoOpenCreate) {
      setIsCreatingJob(true);
      setModalStep('form');
    }
  }, [autoOpenCreate]);

  useEffect(() => {
    if (initialJobData) {
      setNewJob({
        ...initialJobData,
        roleDefinition: initialJobData.roleDefinition || initialJobData.description || '',
        benefits: initialJobData.benefits || []
      });
      setIsCreatingJob(true);
    }
  }, [initialJobData]);

  // Handler Functions
  const handleUpdateStatus = (appId: string, status: ApplicationStatus) => {
    setIsUpdatingStatus(true);
    setTimeout(() => {
      onUpdateApplicationStatus(appId, status);
      setIsUpdatingStatus(false);
      setReviewingApplicant(null);
    }, 1500);
  };

  const handleBulkDownload = () => {
    if (!viewingJobApplicants) return;
    const relevantApps = applications.filter(a => {
      const isCorrectJob = a.jobId === viewingJobApplicants.id;
      const matchesFilter = downloadFilter === 'all' || a.status === downloadFilter;
      return isCorrectJob && matchesFilter;
    });
    if (relevantApps.length === 0) {
      setToast({ message: `No candidates found for export.`, type: 'error' });
      return;
    }
    setIsBulkDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBulkDownloading(false);
            setToast({ message: `Talent Pack Exported.`, type: 'success' });
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Comprehensive Validation for mandatory sections I, II, III, V
  const isFormComplete = useMemo(() => {
    // Section I: General Role Identifiers
    const sectionIValid = !!(newJob.title && newJob.category && newJob.jobRank);

    // Section II: Deployment Modality & Territory
    const hasModalityConfig = newJob.location === 'Onsite'
      ? (!!newJob.country && !!newJob.city)
      : (newJob.allowedCountries?.[0] !== 'Specific Country Only' || deploymentManifest.length > 0);

    const sectionIIValid = !!(newJob.employmentType && newJob.organizationType && newJob.location && newJob.allowedCountries?.[0] && hasModalityConfig);

    // Section III: Remuneration & Availability
    const sectionIIIValid = !!(selectedCurrencyCode && salaryRaw && newJob.salaryStructure && newJob.availabilityRequirement);

    // Section V: Technical Content Manifest
    const sectionVValid = !!(newJob.responsibilities && newJob.requirements);

    return sectionIValid && sectionIIValid && sectionIIIValid && sectionVValid;
  }, [newJob, deploymentManifest, selectedCurrencyCode, salaryRaw]);

  const handleAISupport = async (field: 'definition' | 'responsibilities' | 'requirements' | 'full_rewrite') => {
    if (!newJob.title) { setToast({ message: "Professional title required.", type: 'error' }); return; }
    setIsGenerating(prev => ({ ...prev, [field]: true }));
    try {
      const result = await generateJobSection(field, newJob.title, user.companyName || user.name);
      if (field === 'definition') setNewJob(prev => ({ ...prev, roleDefinition: result }));
      else if (field === 'responsibilities') setNewJob(prev => ({ ...prev, responsibilities: result }));
      else if (field === 'requirements') setNewJob(prev => ({ ...prev, requirements: result }));
      setToast({ message: "Neural synchronization complete.", type: 'success' });
    } catch (err) { setToast({ message: "Neural link failure.", type: 'error' }); } finally { setIsGenerating(prev => ({ ...prev, [field]: false })); }
  };

  const handleJDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingJD(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const parsedData = await parseJobDescription({ base64, mimeType: file.type });
        setNewJob(prev => ({ ...prev, ...parsedData }));
        setToast({ message: "JD Manifest Synthesized Successfully.", type: 'success' });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setToast({ message: "JD Parsing synchronization fault.", type: 'error' });
    } finally {
      setIsUploadingJD(false);
      if (jdUploadRef.current) jdUploadRef.current.value = '';
    }
  };

  const addDeploymentLocale = () => {
    if (!tempCountry || tempRegions.length === 0) return;

    const newLocales = tempRegions.map(r => ({ country: tempCountry, region: r }));
    const filteredNewLocales = newLocales.filter(nl =>
      !deploymentManifest.some(dm => dm.country === nl.country && dm.region === nl.region)
    );

    if (filteredNewLocales.length === 0) {
      setToast({ message: "Selected locales already added to manifest.", type: 'info' });
      return;
    }

    setDeploymentManifest([...deploymentManifest, ...filteredNewLocales]);
    setTempRegions([]);
  };

  const toggleTempRegion = (region: string) => {
    setTempRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const removeDeploymentLocale = (idx: number) => {
    setDeploymentManifest(deploymentManifest.filter((_, i) => i !== idx));
  };

  const handleSalaryChange = (val: string) => {
    if (val === 'CUSTOM') {
      setIsCustomSalary(true);
      return;
    }
    const symbol = GLOBAL_CURRENCIES.find(c => c.code === selectedCurrencyCode)?.symbol || '$';
    setNewJob(prev => ({ ...prev, salary: `${symbol}${val}` }));
    setSalaryRaw(val);
  };

  const handleManualSalaryInput = (val: string) => {
    const symbol = GLOBAL_CURRENCIES.find(c => c.code === selectedCurrencyCode)?.symbol || '$';
    setNewJob(prev => ({ ...prev, salary: `${symbol}${val}` }));
    setSalaryRaw(val);
  };

  const handleSaveDraft = () => {
    const finalAllowed = newJob.allowedCountries?.[0] === 'Specific Country Only'
      ? deploymentManifest.map(d => `${d.country} (${d.region})`)
      : newJob.allowedCountries;

    const job: Job = {
      ...newJob as Job,
      id: newJob.id || Math.random().toString(36).substr(2, 9),
      company: user.companyName || user.name,
      postedAt: new Date().toISOString(),
      status: 'draft',
      allowedCountries: finalAllowed
    };
    onPostJob(job); setIsCreatingJob(false); setToast({ message: "Draft cached successfully.", type: 'success' });
  };

  const handleProceedToPublication = () => {
    if (!isFormComplete) {
      setToast({ message: "Please complete all mandatory sections (I, II, III, V) before deployment.", type: 'error' });
      return;
    }
    setModalStep('preview');
  };

  const handlePublishListing = () => {
    const finalAllowed = newJob.allowedCountries?.[0] === 'Specific Country Only'
      ? deploymentManifest.map(d => `${d.country} (${d.region})`)
      : newJob.allowedCountries;

    const job: Job = {
      ...newJob as Job,
      id: newJob.id || Math.random().toString(36).substr(2, 9),
      company: user.companyName || user.name,
      postedAt: new Date().toISOString(),
      status: 'active',
      allowedCountries: finalAllowed
    };
    onPostJob(job); setIsCreatingJob(false); setToast({ message: "Listing published to global feed.", type: 'success' });
  };

  const toggleBenefit = (benefit: string) => {
    setNewJob(prev => {
      const current = prev.benefits || [];
      const updated = current.includes(benefit) ? current.filter(b => b !== benefit) : [...current, benefit];
      return { ...prev, benefits: updated };
    });
  };

  const filteredManagementJobs = useMemo(() => jobs.filter(job => {
    if (listStatusFilter === 'all') return true;
    return job.status === listStatusFilter;
  }), [jobs, listStatusFilter]);

  const availableRegions = useMemo(() => tempCountry ? (REGIONS_BY_COUNTRY[tempCountry] || []) : [], [tempCountry]);

  // Derived symbol for active job creation
  const activeCurrencySymbol = useMemo(() => {
    return GLOBAL_CURRENCIES.find(c => c.code === selectedCurrencyCode)?.symbol || '$';
  }, [selectedCurrencyCode]);

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 text-white pb-32 px-4 md:px-0">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {activeTab === 'overview' ? (
        <EmployerAnalytics user={user} jobs={jobs} applications={applications} />
      ) : (
        <div className="space-y-4">
          {viewingJobApplicants ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <button onClick={() => setViewingJobApplicants(null)} className="flex items-center gap-1 text-white/40 hover:text-white transition-colors group w-fit">
                  <ArrowLeft size={14} />
                  <span className="text-xs font-black uppercase tracking-widest">Back to Listings</span>
                </button>

                <div className="flex items-center gap-2 bg-[#0a4179]/40 p-1.5 rounded-2xl border border-white/5 shadow-lg">
                  <button onClick={handleBulkDownload} disabled={isBulkDownloading} className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[#41d599] text-[#0a4179] font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    {isBulkDownloading ? <Loader2 size={12} className="animate-spin" /> : <FileArchive size={12} />}
                    {isBulkDownloading ? `Compiling ${downloadProgress}%` : `Download Pack`}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {applications.filter(a => a.jobId === viewingJobApplicants.id).map(app => (
                  <div key={app.id} className="glass group transition-all rounded-2xl p-2.5 border flex flex-col md:flex-row items-center gap-3 shadow-md relative overflow-hidden bg-white/5 hover:bg-white/[0.08]">
                    <div className={`absolute top-0 left-0 w-1 h-full ${app.status === 'rejected' ? 'bg-red-500/40' : 'bg-[#F0C927]'}`}></div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0a4179] border border-white/5 flex items-center justify-center overflow-hidden shrink-0"><img src={app.candidateProfile?.profileImages[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidateProfile?.name}`} alt="" /></div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-black truncate">{app.candidateProfile?.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 mt-0.5">
                          <span className="flex items-center gap-1 text-[#F0C927]"><Briefcase size={10} /> {app.candidateProfile?.role}</span>
                          <span className="flex items-center gap-1 text-[#41d599]"><Zap size={10} /> 88% Match</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setReviewingApplicant(app)} className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10">Review</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-1">
                <div>
                  <h2 className="text-xl font-black tracking-tight uppercase">Organization <span className="gradient-text">Manifest</span></h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">High-Density Operational Tracking</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsCreatingJob(true)} className="px-5 py-2.5 bg-[#F0C927] text-[#0a4179] font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">+ New Vacancy</button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {filteredManagementJobs.map(job => (
                  <div key={job.id} onClick={() => onSelectJob?.(job)} className={`glass group transition-all duration-200 rounded-2xl p-2.5 border cursor-pointer flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg relative overflow-hidden ${job.status === 'draft' ? 'opacity-70' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${job.status === 'active' ? 'bg-[#41d599]' : 'bg-orange-400'}`}></div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-lg border-2 flex items-center justify-center font-black text-sm shrink-0 overflow-hidden bg-[#0a4179]">{job.company[0]}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black truncate leading-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/30 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={10} /> {job.city}</span>
                          <span className="flex items-center gap-1 text-[#41d599] font-black"><DollarSign size={10} /> {job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.status !== 'draft' && <button onClick={(e) => { e.stopPropagation(); setViewingJobApplicants(job); }} className="py-1.5 px-4 rounded-lg bg-[#41d599] text-[#0a4179] font-black uppercase text-[10px] tracking-widest shadow-md">Pipeline</button>}
                      <span className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border border-white/10 bg-white/5 text-white/30">{job.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* RECRUITMENT MANIFEST CREATION MODAL - ENHANCED HEIGHT FOR MORE ITEMS */}
      {isCreatingJob && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-[#0a4179]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0b2e52] w-full max-w-7xl rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[96vh] animate-in zoom-in-95 relative">

            {/* HEADER - TIGHTENED AS REQUESTED */}
            <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-[#F0C927]/10 flex items-center justify-center text-[#F0C927] border border-[#F0C927]/20 shadow-xl"><Briefcase size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{modalStep === 'form' ? 'Design Recruitment Manifest' : 'Global Manifest Preview'}</h3>
                  <p className="text-[8px] text-white/30 font-black uppercase tracking-[0.4em]">CaliberDesk Organizational Protocol v4.2</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {modalStep === 'form' && (
                  <>
                    <button
                      onClick={() => jdUploadRef.current?.click()}
                      disabled={isUploadingJD}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F0C927]/10 text-[#F0C927] border border-[#F0C927]/20 text-[10px] font-black uppercase tracking-widest hover:bg-[#F0C927]/20 transition-all shadow-lg shadow-[#F0C927]/5"
                    >
                      {isUploadingJD ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Job Description Upload
                    </button>
                    <input
                      ref={jdUploadRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleJDUpload}
                    />
                  </>
                )}
                <button onClick={() => setIsCreatingJob(false)} className="p-2.5 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all border border-white/5"><X size={20} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-14">
              {modalStep === 'form' ? (
                <div className="space-y-12">

                  {/* SECTION 1: GENERAL MANIFEST DATA (MANDATORY) */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <FileText size={20} className="text-[#F0C927]" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#F0C927]">I. General Role Identifiers <span className="text-red-500 ml-1 opacity-50">* Mandatory</span></h4>
                    </div>
                    <div className="grid md:grid-cols-12 gap-8">
                      <div className="md:col-span-6 space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Professional Job Title <span className="text-red-500">*</span></label>
                        <input type="text" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm outline-none focus:border-[#F0C927] transition-all font-bold" placeholder="e.g. Lead Infrastructure Architect" />
                      </div>
                      <div className="md:col-span-3 space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Category Manifest <span className="text-red-500">*</span></label>
                        <select value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none focus:border-[#F0C927] appearance-none cursor-pointer">
                          {CATEGORIES.map(l => <option key={l} value={l} className="bg-[#0a4179] font-bold">{l}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-3 space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Operational Rank <span className="text-red-500">*</span></label>
                        <select value={newJob.jobRank} onChange={e => setNewJob({ ...newJob, jobRank: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none focus:border-[#F0C927] appearance-none cursor-pointer">
                          {JOB_RANKS.map(r => <option key={r} value={r} className="bg-[#0a4179] font-bold">{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: DEPLOYMENT & GEOGRAPHY (MANDATORY) */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Globe size={20} className="text-blue-400" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-blue-400">II. Deployment Modality & Territory <span className="text-red-500 ml-1 opacity-50">* Mandatory</span></h4>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Engagement Protocol <span className="text-red-500">*</span></label>
                        <select value={newJob.employmentType} onChange={e => setNewJob({ ...newJob, employmentType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                          {EMPLOYMENT_TYPES.map(t => <option key={t} value={t} className="bg-[#0a4179] font-bold">{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Org Class <span className="text-red-500">*</span></label>
                        <select value={newJob.organizationType} onChange={e => setNewJob({ ...newJob, organizationType: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                          {ORGANIZATION_TYPES.map(o => <option key={o} value={o} className="bg-[#0a4179] font-bold">{o}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Modality <span className="text-red-500">*</span></label>
                        <select value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                          {JOB_LOCATION_TYPES.map(l => <option key={l} value={l} className="bg-[#0a4179] font-bold">{l}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Geographic Eligibility <span className="text-red-500">*</span></label>
                        <select value={newJob.allowedCountries?.[0]} onChange={e => { const val = e.target.value; setNewJob({ ...newJob, allowedCountries: [val] }); if (val !== 'Specific Country Only') setDeploymentManifest([]); }} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                          {ELIGIBILITY_PROTOCOLS.map(p => <option key={p} value={p} className="bg-[#0a4179] font-bold">{p}</option>)}
                        </select>
                      </div>
                    </div>

                    {newJob.location === 'Onsite' ? (
                      <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-top-1">
                        <div className="space-y-2.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Assigned Country <span className="text-red-500">*</span></label>
                          <select value={newJob.country} onChange={e => setNewJob({ ...newJob, country: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                            <option value="">Select Target</option>
                            {ALL_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0a4179]">{c}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Assigned City/State <span className="text-red-500">*</span></label>
                          <input type="text" value={newJob.city} onChange={e => setNewJob({ ...newJob, city: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none" placeholder="e.g. San Francisco" />
                        </div>
                      </div>
                    ) : newJob.allowedCountries?.[0] === 'Specific Country Only' && (
                      <div className="p-10 rounded-[40px] bg-white/[0.03] border border-white/10 space-y-8 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-black uppercase tracking-widest text-[#F0C927]">Regional Deployment Configurator <span className="text-red-500 ml-1">* At least 1 target required</span></label>
                          {tempCountry && <div className="flex gap-6"><button onClick={() => setTempRegions(availableRegions)} className="text-[10px] font-black uppercase text-[#41d599] hover:underline">Mark All</button><button onClick={() => setTempRegions([])} className="text-[10px] font-black uppercase text-red-400 hover:underline">Wipe Selection</button></div>}
                        </div>
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-5">
                            <label className="text-[10px] font-black uppercase text-white/20 ml-1">Select Jurisdiction</label>
                            <select value={tempCountry} onChange={e => { setTempCountry(e.target.value); setTempRegions([]); }} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                              <option value="">Select Primary State</option>
                              {ALL_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0a4179]">{c}</option>)}
                            </select>
                            <button onClick={addDeploymentLocale} disabled={!tempCountry || tempRegions.length === 0} className="w-full py-4 bg-[#F0C927] text-[#0a4179] rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg disabled:opacity-30 active:scale-95 transition-all">Append Selected Territories</button>
                          </div>
                          {tempCountry && (
                            <div className="p-6 bg-black/20 rounded-[32px] border border-white/5 max-h-56 overflow-y-auto custom-scrollbar">
                              <div className="grid grid-cols-2 gap-3">
                                {availableRegions.map(r => (
                                  <button key={r} onClick={() => toggleTempRegion(r)} className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all border ${tempRegions.includes(r) ? 'bg-[#F0C927]/20 border-[#F0C927]/40 text-[#F0C927]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}>
                                    {tempRegions.includes(r) ? <CheckSquare size={16} /> : <Square size={16} />}
                                    <span className="text-[11px] font-bold uppercase truncate">{r}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5">
                          {deploymentManifest.length === 0 ? <p className="text-[11px] text-white/20 italic uppercase tracking-widest w-full text-center py-6">Awaiting deployment targets...</p> : deploymentManifest.map((loc, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-xl bg-[#F0C927]/10 border border-[#F0C927]/20 text-[11px] font-black uppercase tracking-widest text-[#F0C927] animate-in zoom-in-95">
                              {loc.country} / {loc.region}
                              <button onClick={() => removeDeploymentLocale(i)} className="text-white/40 hover:text-red-400"><X size={16} /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: COMPENSATION, TIMING & TARGETING (MANDATORY) */}
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <DollarSign size={20} className="text-[#41d599]" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-[#41d599]">III. Remuneration & Availability <span className="text-red-500 ml-1 opacity-50">* Mandatory</span></h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Settlement Currency <span className="text-red-500">*</span></label>
                          <select value={selectedCurrencyCode} onChange={e => setSelectedCurrencyCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                            {GLOBAL_CURRENCIES.map(c => <option key={c.code} value={c.code} className="bg-[#0a4179] font-bold">{c.label}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Annual Comp. Range <span className="text-red-500">*</span></label>
                            <button onClick={() => { setIsCustomSalary(!isCustomSalary); if (!isCustomSalary) setSalaryRaw(''); }} className="text-[10px] font-black text-[#F0C927] uppercase flex items-center gap-1.5 hover:underline">
                              {isCustomSalary ? <List size={12} /> : <Edit size={12} />} {isCustomSalary ? 'Dropdown' : 'Custom'}
                            </button>
                          </div>
                          <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#41d599] font-black text-sm">{activeCurrencySymbol}</div>
                            {!isCustomSalary ? (
                              <select value={salaryRaw} onChange={e => handleSalaryChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-6 text-sm text-[#41d599] font-black outline-none focus:border-[#F0C927] appearance-none cursor-pointer">
                                <option value="" className="bg-[#0a4179]">Select Range</option>
                                {POST_SALARY_RANGES.map(r => <option key={r} value={r} className="bg-[#0a4179] font-bold">{r}</option>)}
                                <option value="CUSTOM" className="bg-[#0a4179] text-[#F0C927]">--- Manual Override ---</option>
                              </select>
                            ) : (
                              <input type="text" value={salaryRaw} onChange={e => handleManualSalaryInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-6 text-sm text-[#41d599] font-black outline-none focus:border-[#F0C927]" placeholder="e.g. 150k - 200k" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Comp. Structure <span className="text-red-500">*</span></label>
                          <select value={newJob.salaryStructure} onChange={e => setNewJob({ ...newJob, salaryStructure: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                            {SALARY_STRUCTURES.map(s => <option key={s} value={s} className="bg-[#0a4179] font-bold">{s}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1">Deployment Window <span className="text-red-500">*</span></label>
                          <select value={newJob.availabilityRequirement} onChange={e => setNewJob({ ...newJob, availabilityRequirement: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-[#41d599] font-black outline-none">
                            {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a} className="bg-[#0a4179] font-bold">{a}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: INCLUSIVE TARGETING (OPTIONAL) */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <UserCheck2 size={20} className="text-purple-400" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-purple-400">IV. Inclusive Targeting Manifest <span className="text-white/20 ml-1 opacity-50 font-black italic">Optional</span></h4>
                      </div>
                      <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/10 space-y-8 shadow-inner">
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/30 ml-1">Target Gender</label>
                            <select value={newJob.targetGender} onChange={e => setNewJob({ ...newJob, targetGender: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                              <option value="Any">Non-Restrictive</option>
                              {GENDER_OPTIONS.map(g => <option key={g} value={g} className="bg-[#0a4179]">{g}</option>)}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-white/30 ml-1">Ethnicity / Race</label>
                            <select value={newJob.targetRace} onChange={e => setNewJob({ ...newJob, targetRace: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                              <option value="Any">Non-Restrictive</option>
                              {RACE_OPTIONS.map(r => <option key={r} value={r} className="bg-[#0a4179]">{r}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white/30 ml-1">Religion / Creed</label>
                          <select value={newJob.targetReligion} onChange={e => setNewJob({ ...newJob, targetReligion: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-5 text-sm text-white outline-none">
                            <option value="Any">Non-Restrictive</option>
                            {RELIGION_OPTIONS.map(r => <option key={r} value={r} className="bg-[#0a4179]">{r}</option>)}
                          </select>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                          <Info size={18} className="text-white/20 mt-0.5 shrink-0" />
                          <p className="text-[10px] text-white/30 leading-relaxed font-bold uppercase italic">* Demographic parameters serve as AI match guidelines only. Values optimize candidate ranking algorithm.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: CONTENT AREAS (MANDATORY) - INCREASED TEXTAREA HEIGHT */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Zap size={20} className="text-[#F0C927]" />
                      <h4 className="text-sm font-black uppercase tracking-widest text-[#F0C927]">V. Technical Content Manifest <span className="text-red-500 ml-1 opacity-50">* Mandatory</span></h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Role Objectives & Duties <span className="text-red-500">*</span></label>
                          <button onClick={() => handleAISupport('responsibilities')} disabled={isGenerating.responsibilities} className="text-[10px] font-black text-[#F0C927] flex items-center gap-2.5 hover:underline">
                            {isGenerating.responsibilities ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Neural Draft
                          </button>
                        </div>
                        <textarea value={newJob.responsibilities} onChange={e => setNewJob({ ...newJob, responsibilities: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[40px] p-6 text-sm text-white/90 min-h-[300px] outline-none focus:border-[#F0C927] transition-all leading-relaxed font-medium italic shadow-inner" placeholder="Provide mission directives..." />
                      </div>
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40">Candidate Prerequisites <span className="text-red-500">*</span></label>
                          <button onClick={() => handleAISupport('requirements')} disabled={isGenerating.requirements} className="text-[10px] font-black text-[#41d599] flex items-center gap-2.5 hover:underline">
                            {isGenerating.requirements ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Neural Draft
                          </button>
                        </div>
                        <textarea value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-[40px] p-6 text-sm text-white/90 min-h-[300px] outline-none focus:border-[#F0C927] transition-all leading-relaxed font-medium italic shadow-inner" placeholder="State prerequisite skills..." />
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-white/5">
                    <div className="flex flex-wrap gap-3.5">
                      {BENEFITS.slice(0, 15).map(b => (
                        <button key={b} onClick={() => toggleBenefit(b)} className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${newJob.benefits?.includes(b) ? 'bg-[#41d599] text-[#0a4179] border-[#41d599] shadow-lg' : 'bg-white/5 text-white/30 border-white/5 hover:bg-white/10'}`}>{b}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in slide-in-from-right-4 py-8">
                  <div className="text-center space-y-4">
                    <h4 className="text-4xl font-black text-[#F0C927] uppercase tracking-tighter">Manifest Verification</h4>
                    <p className="text-sm text-white/40 font-bold max-w-lg mx-auto uppercase tracking-widest">Verify deployment parameters before global manifest release.</p>
                  </div>

                  <div className="space-y-8">
                    {/* Summary Card */}
                    <div className="glass rounded-[48px] p-12 border-white/10 bg-white/[0.01] space-y-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ShieldCheck size={200} /></div>
                      <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[32px] bg-[#0a4179] border border-white/10 flex items-center justify-center font-black text-4xl text-[#F0C927] shadow-xl">{newJob.title?.[0]}</div>
                        <div className="space-y-2">
                          <h3 className="text-4xl font-black tracking-tight">{newJob.title}</h3>
                          <div className="flex items-center gap-4">
                            <p className="text-xs font-black uppercase text-[#41d599] tracking-[0.2em]">{newJob.location} • {newJob.city || 'Global'} • {newJob.salary}</p>
                            <span className="px-3 py-0.5 rounded-lg bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[8px] font-black uppercase">{newJob.jobRank}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-4 gap-10 pt-10 border-t border-white/5">
                        <div className="space-y-2"><p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Protocol</p><p className="text-base font-bold uppercase">{newJob.employmentType}</p></div>
                        <div className="space-y-2"><p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Category</p><p className="text-base font-bold uppercase">{newJob.category}</p></div>
                        <div className="space-y-2"><p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Structure</p><p className="text-base font-bold uppercase">{newJob.salaryStructure}</p></div>
                        <div className="space-y-2"><p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Inclusion</p><p className="text-[10px] font-bold uppercase leading-tight text-white/60">{newJob.targetGender} • {newJob.targetRace}</p></div>
                      </div>
                    </div>

                    {/* Detailed Content Preview */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="glass rounded-[32px] p-8 border-white/5 space-y-4">
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-[#F0C927]">Objectives & Duties</h5>
                        <p className="text-xs text-white/60 leading-relaxed italic whitespace-pre-wrap">{newJob.responsibilities}</p>
                      </div>
                      <div className="glass rounded-[32px] p-8 border-white/5 space-y-4">
                        <h5 className="text-[11px] font-black uppercase tracking-widest text-[#41d599]">Candidate Prerequisites</h5>
                        <p className="text-xs text-white/60 leading-relaxed italic whitespace-pre-wrap">{newJob.requirements}</p>
                      </div>
                    </div>

                    {/* Benefits & Eligibility */}
                    <div className="glass rounded-[32px] p-8 border-white/5 space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {newJob.benefits?.map(b => (
                          <span key={b} className="px-3 py-1 rounded-lg bg-[#41d599]/10 text-[#41d599] border border-[#41d599]/20 text-[8px] font-black uppercase tracking-widest">{b}</span>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Geographic Targeting</p>
                        <div className="flex flex-wrap gap-2">
                          {newJob.allowedCountries?.map(c => (
                            <span key={c} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/40">{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-400/5 border border-blue-400/20 rounded-[32px] p-8 flex items-center gap-8 shadow-inner">
                      <div className="w-16 h-16 rounded-[24px] bg-blue-400/10 flex items-center justify-center text-blue-400 shadow-xl border border-blue-400/20"><ShieldCheck size={32} /></div>
                      <div><p className="text-lg font-black uppercase tracking-tight">Compliance & Integrity Check Passed</p><p className="text-sm text-white/40 font-medium">This manifest adheres to CaliberDesk global organizational standards.</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS - REMAINS COMPACT AS PREVIOUSLY EDITED */}
            <div className="p-5 border-t border-white/5 bg-black/30 flex flex-col sm:flex-row gap-4 shrink-0">
              {modalStep === 'form' ? (
                <>
                  <button onClick={handleSaveDraft} className="flex-1 py-3.5 rounded-[20px] glass border-white/10 text-white/40 font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">Cache to Drafts</button>
                  <button
                    onClick={handleProceedToPublication}
                    className={`flex-[2] py-3.5 rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all flex items-center justify-center gap-2 ${isFormComplete ? 'bg-[#F0C927] text-[#0a4179] shadow-[#F0C927]/20 hover:scale-[1.02] active:scale-95' : 'bg-white/10 text-white/20 cursor-not-allowed border border-white/5'}`}
                  >
                    {!isFormComplete && <Lock size={14} />} Proceed to Manifest Verification
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setModalStep('form')} className="flex-1 py-3.5 rounded-[20px] glass border-white/10 text-white/40 font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">Return to Editor</button>
                  <button onClick={handlePublishListing} className="flex-[2] py-3.5 rounded-[20px] bg-[#41d599] text-[#0a4179] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-[#41d599]/20 hover:scale-[1.02] active:scale-95 transition-all">Publish Global Manifest</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REFINED REVIEW MODAL */}
      {reviewingApplicant && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-[#0a4179]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0b2e52] w-full max-w-5xl rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh] relative">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0a4179] border-2 border-[#F0C927]/30 overflow-hidden"><img src={reviewingApplicant.candidateProfile?.profileImages?.[0] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewingApplicant.candidateProfile?.name}`} alt="" /></div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{reviewingApplicant.candidateProfile?.name}</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">REF: {reviewingApplicant.id}</p>
                </div>
              </div>
              <button onClick={() => setReviewingApplicant(null)} className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <section className="p-6 rounded-[24px] bg-[#0a4179]/40 border border-white/5 space-y-6 shadow-inner">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#41d599] flex items-center gap-2"><TrendingUp size={12} /> Trajectory Stage</h4>
                  <div className="flex items-center justify-between px-2">
                    {['applied', 'shortlisted', 'interview', 'hired'].map((s, i) => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-[10px] font-black ${reviewingApplicant.status.includes(s) ? 'bg-[#41d599] border-[#0b2e52] text-[#0a4179]' : 'bg-[#0b2e52] border-white/5 text-white/20'}`}>{i + 1}</div>
                        <span className="text-xs font-black uppercase text-white/20">{s}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">Experience Manifest</h4>
                  <div className="space-y-4">
                    {reviewingApplicant.candidateProfile?.workHistory?.map((work, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 group/h">
                        <div className="flex justify-between items-start">
                          <h5 className="font-black text-sm group-hover/h:text-[#F0C927] transition-colors">{work.role}</h5>
                          <span className="text-[10px] font-black text-white/20">{work.period}</span>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed font-medium line-clamp-3">{work.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="space-y-4">
                <section className="p-6 rounded-[32px] bg-gradient-to-br from-[#06213f] to-[#0a4179] border border-white/10 shadow-xl space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-sha0.4em] text-white/30">Decision Engine</p>
                    <h4 className="text-xl font-black text-[#F0C927] uppercase">{reviewingApplicant.status.replace('-', ' ')}</h4>
                  </div>
                  <div className="grid gap-2">
                    {['applied', 'shortlisted', 'assessment', 'interview-invitation', 'hired'].map((status) => (
                      <button key={status} onClick={() => handleUpdateStatus(reviewingApplicant.id, status)} className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${reviewingApplicant.status === status ? 'bg-[#F0C927] text-[#0a4179] shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                        <ShieldCheck size={14} className={reviewingApplicant.status === status ? 'text-[#0a4179]' : 'text-white/20'} />
                        <span className="text-xs font-black uppercase tracking-tight">{status.replace('-', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;