
// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Profile from './components/Profile';
import Settings from './components/Settings';
import EmployerProfile from './components/EmployerProfile';
import VideoRecorder from './components/VideoRecorder';
import CareerCoach from './components/CareerCoach';
import MatchDetails from './components/MatchDetails';
import JobDetails from './components/JobDetails';
import JobManagement from './components/JobManagement';
import SeekerFeed from './components/SeekerFeed';
import SubscriptionModal from './components/SubscriptionModal';
import JobAlertsModal from './components/JobAlertsModal';
import InterviewPrep from './components/InterviewPrep';
import CVPrep from './components/CVPrep';
import Billing from './components/Billing';
import Toast from './components/Toast';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CompanyProfileView from './components/CompanyProfileView';
import AdminDashboard from './components/AdminDashboard';
import SeekerAnalytics from './components/SeekerAnalytics';
import SeekerApplications from './components/SeekerApplications';
import ProfessionalAIAssistant from './components/ProfessionalAIAssistant';
import EmployerCommAssistant from './components/EmployerCommAssistant';
import AptitudeTestManager from './components/AptitudeTestManager';
import AptitudeTestPlayer from './components/AptitudeTestPlayer';
import OrganizationManagement from './components/OrganizationManagement';
import ProductsAndServices from './components/ProductsAndServices';
import ComingSoonLanding from './components/ComingSoonLanding';
import CareerInsights from './components/CareerInsights';
import AuthGate from './components/AuthGate';
import Tooltip from './components/Tooltip';
import Background3D from './components/Background3D';
import { analyzeMatch } from './services/geminiService';
import { Job, ViewType, UserProfile, Application, Transaction, JobAlert, ApplicationStatus, AptitudeTest, SubUser, Subsidiary } from './types';
import {
  MOCK_JOBS, ALL_COUNTRIES, MOCK_USER, GLOBAL_TRANSACTIONS,
  INDUSTRIES, SENIORITY_LEVELS, SALARY_RANGES, JOB_TYPES,
  DATE_POSTED_OPTIONS, JOB_FUNCTIONS, BENEFITS, AGE_RANGES, REGIONS_BY_COUNTRY,
  MOCK_APTITUDE_TESTS, isJobActuallyActive, MOCK_APPLICATIONS, MOCK_EMPLOYER
} from './constants';
import {
  Sparkles, MapPin, DollarSign, Plus, ShieldCheck,
  Loader2, Search, Zap, Crown, Globe, ChevronRight,
  TrendingUp, Rocket, Check, Cpu, EyeOff, Shield, Bell, Hammer, Briefcase as BriefcaseIcon,
  ToggleLeft, ToggleRight, Info, CheckCircle2, Mail, Smartphone, LayoutDashboard, BarChart3,
  SlidersHorizontal, X, Target, Calendar, Award, User, UsersPlus, Lock, Truck, Layout as LayoutIcon,
  MessageCircle
} from 'lucide-react';

const INITIAL_GUEST: UserProfile = {
  name: 'Guest Explorer',
  email: '',
  password: '',
  role: '',
  city: '',
  country: 'Global',
  skills: [],
  digitalSkills: [],
  certifications: [],
  hobbies: [],
  projects: [],
  experienceSummary: '',
  stealthMode: false,
  profileCompleted: false,
  linkedInConnected: false,
  isSubscribed: false,
  subscriptionTier: 'free',
  productCredits: { standard: 0, premium: 0, shortlist: 0 },
  purchaseHistory: [],
  adOptIn: false,
  alerts: [],
  savedJobIds: [],
  autoApplyEnabled: false,
  workHistory: [],
  education: [],
  profileImages: [],
  isSuperUser: false,
  subUsers: [],
  subsidiaries: [],
  demographicVisibility: {
    gender: true, ageRange: true, race: true, disabilityStatus: true,
    religion: true, maritalStatus: true, veteranStatus: true
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('home'); // Home loads first
  const [jobs, setJobs] = useState<Job[]>([]);
  const [user, setUser] = useState<UserProfile>(INITIAL_GUEST);
  const [applications, setApplications] = useState<Application[]>([]);
  const [aptitudeTests, setAptitudeTests] = useState<AptitudeTest[]>([]);
  const [detailedJob, setDetailedJob] = useState<Job | null>(null);
  const [inspectJob, setInspectJob] = useState<Job | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [upgradingJobId, setUpgradingJobId] = useState<string | null>(null);
  const [showJobAlerts, setShowJobJobAlerts] = useState(false);
  const [alertDefaults, setAlertDefaults] = useState({ keywords: '', location: '', minSalary: 0 });
  const [showCoach, setShowCoach] = useState(false);
  const [activeTestJob, setActiveTestJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [activeCompanyProfile, setActiveCompanyProfile] = useState<string | null>(null);
  const [autoOpenJobCreate, setAutoOpenJobCreate] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [authGateRole, setAuthGateRole] = useState<'seeker' | 'employer'>('seeker');

  // Supabase Auth Listener
  useEffect(() => {
    // Dynamically import to ensure no load-time crashes if keys are bad
    import('./lib/supabaseClient').then(({ supabase }) => {
      // Integrated Identity Synchronization Function
      const syncUserProfile = (session: any) => {
        if (!session) return;

        const baseUser = {
          ...INITIAL_GUEST,
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || 'Supabase User',
          role: session.user.user_metadata.role || 'seeker',
          isEmployer: session.user.user_metadata.role === 'employer',
          profileCompleted: true,
          isSubscribed: false
        } as UserProfile;

        setUser(baseUser);

        // Fetch deep profile properties from persistence layer
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser(prev => ({
                ...prev,
                ...profile,
                name: profile.full_name || prev.name,
                role: profile.role || prev.role,
                isEmployer: profile.role === 'employer'
              }));
            }
          });
      };

      // Check active checkpoint
      supabase.auth.getSession().then(({ data: { session } }: any) => {
        if (session) syncUserProfile(session);
      });

      // Monitor identity state transitions
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
        if (session) {
          syncUserProfile(session);
        } else {
          setUser(INITIAL_GUEST);
          setView('home');
        }
      });

      // Cleanup
      // Note: In strict mode double-invoke, subscription might be tricky, so we guard
      return () => {
        subscription?.unsubscribe();
      };
    });
  }, []);

  // Fetch Jobs from Supabase
  useEffect(() => {
    import('./lib/supabaseClient').then(({ supabase }) => {
      supabase.from('jobs').select('*').eq('status', 'active')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mappedJobs = data.map(j => ({
              ...j,
              salary: j.salary_range,
              postedAt: j.created_at,
              isPremium: j.is_premium
            }));
            setJobs(mappedJobs as unknown as Job[]);
          }
        });
    });
  }, []);

  // Fetch Applications from Supabase
  useEffect(() => {
    if (!user.id) return;
    import('./lib/supabaseClient').then(({ supabase }) => {
      // If employer, fetch apps for their jobs. If seeker, fetch their apps.
      const query = user.isEmployer
        ? supabase.from('applications').select('*, profiles(*)').in('job_id', employerJobs.map(j => j.id))
        : supabase.from('applications').select('*, profiles(*)').eq('candidate_id', user.id);

      query.then(({ data, error }) => {
        if (!error && data) {
          setApplications(data.map(app => ({
            ...app,
            jobId: app.job_id,
            appliedDate: app.created_at,
            videoUrl: app.video_pitch_url,
            candidateProfile: {
              ...app.profiles,
              name: app.profiles?.full_name || 'Candidate'
            }
          })) as unknown as Application[]);
        }
      });
    });
  }, [user.id, user.isEmployer, employerJobs.length]);

  const isAuthenticated = !!user?.email;

  // Scroll to top when critical views change
  useEffect(() => {
    const scrollableElement = document.querySelector('main');
    if (scrollableElement) {
      scrollableElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [view, detailedJob, activeCompanyProfile]);

  const handleSignIn = (signedInUser: UserProfile, customMessage?: string) => {
    setUser(signedInUser);
    setShowAuthGate(false);
    setToast({ message: customMessage || `Authorized. Accessing as ${signedInUser.name.split(' ')[0]}`, type: 'success' });
    if (signedInUser.isAdmin || signedInUser.opRole) setView('admin');
    else if (signedInUser.isEmployer) setView('employer');
    else setView('seeker');
  };

  const requireAuth = useCallback((actionName: string, preferredRole: 'seeker' | 'employer' = 'seeker') => {
    if (!user.email) {
      setAuthGateRole(preferredRole);
      setShowAuthGate(true);
      setToast({ message: `Identity Required: Please sign up to ${actionName}.`, type: 'info' });
      return false;
    }
    return true;
  }, [user.email]);

  const handleApplyRequest = async (job: Job) => {
    if (!requireAuth("apply for this position", 'seeker')) return;

    if (job.applicationType === 'external') {
      window.open(job.externalApplyUrl || 'https://google.com', '_blank');
      return;
    }

    if (applications.some(a => a.jobId === job.id && (a.candidate_id === user.id || a.candidateProfile?.email === user.email))) {
      setToast({ message: "Profile already deployed to this job", type: 'info' });
      return;
    }

    if (!job.aptitudeTestId) {
      const newApp: Partial<Application> = {
        job_id: job.id,
        candidate_id: user.id,
        status: 'applied',
      };

      const { supabase } = await import('./lib/supabaseClient');
      const { data, error } = await supabase.from('applications').insert(newApp).select().single();

      if (!error) {
        setApplications(prev => [...prev, { ...data, candidateProfile: user } as unknown as Application]);
        setToast({ message: "Profile Deployed Successfully", type: 'success' });
      } else {
        setToast({ message: "Cloud sync failed. Application not saved.", type: 'error' });
      }
      return;
    }

    setApplyingJob(job);
  };

  const handleVideoComplete = async (videoUrl: string) => {
    if (!applyingJob || !user.id) return;

    const { supabase } = await import('./lib/supabaseClient');
    const newApp = {
      job_id: applyingJob.id,
      candidate_id: user.id,
      status: 'applied',
      video_pitch_url: videoUrl
    };

    const { data, error } = await supabase.from('applications').insert(newApp).select().single();

    if (!error) {
      setApplications(prev => [...prev, { ...data, candidateProfile: user } as unknown as Application]);
      setToast({ message: "Video Pitch & Profile Deployed Successfully", type: 'success' });
    } else {
      setToast({ message: "Application persistence failure.", type: 'error' });
    }

    setApplyingJob(null);
  };

  const handleInspectMatch = async (job: Job) => {
    if (!requireAuth("analyze match compatibility", 'seeker')) return;

    if (!user.isSubscribed) {
      setShowSubscription(true);
      return;
    }
    setIsMatching(true);
    try {
      const result = await analyzeMatch(user, job);
      const updatedJob = { ...job, matchScore: result.score, matchReason: result.reason, matchDetails: result.details };
      setJobs(prev => prev.map(j => j.id === job.id ? updatedJob : j));
      setInspectJob(updatedJob);
    } catch (err) {
      setToast({ message: "Neural match sync failed. Retrying...", type: 'error' });
    } finally {
      setIsMatching(false);
    }
  };

  const handlePostJob = async (job: Job) => {
    // Optimistic UI update
    setJobs(prev => {
      const existing = prev.find(j => j.id === job.id);
      if (existing) return prev.map(j => j.id === job.id ? job : j);
      return [job, ...prev];
    });

    // Persistent synchronization
    if (user.email) {
      const { supabase } = await import('./lib/supabaseClient');
      const jobToPersist = {
        ...job,
        employer_id: user.id, // Maps to profiles.id
        salary_range: job.salary,
        is_premium: job.isPremium,
        job_type: job.employmentType,
        created_at: job.postedAt || new Date().toISOString()
      };

      const { error } = await supabase.from('jobs').upsert(jobToPersist);
      if (error) {
        console.error('Job persistence failure:', error.message);
        setToast({ message: "Cloud sync failed. Job saved locally only.", type: 'error' });
      } else {
        setToast({ message: "Job Manifest Synchronized with Global Feed", type: 'success' });
      }
    }

    setEditingJob(null);
  };

  const handleToggleJobStatus = (jobId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const newStatus = j.status === 'active' ? 'closed' : 'active';
        return { ...j, status: newStatus };
      }
      return j;
    }));
    setToast({ message: "Job status updated successfully.", type: 'success' });
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setToast({ message: "Job permanently removed.", type: 'success' });
  };

  const handleUpgradeJob = (jobId: string) => {
    if (!requireAuth("upgrade job listings", 'employer')) return;
    setUpgradingJobId(jobId);
    setShowSubscription(true);
  };

  const handleSubscriptionSuccess = (amount: number, item: string, tierId?: string, quantity: number = 1) => {
    if (upgradingJobId) {
      setJobs(prev => prev.map(j => {
        if (j.id === upgradingJobId) {
          const isUpgradedToPremium = tierId === 'employer_premium' || tierId === 'employer_shortlist' || tierId === 'employer_professional';
          return {
            ...j,
            isPremium: isUpgradedToPremium ? true : j.isPremium,
            isShortlistService: tierId === 'employer_shortlist' || j.isShortlistService,
            isProfessionalHiring: tierId === 'employer_professional' || j.isProfessionalHiring,
            postedAt: new Date().toISOString(),
            status: 'active'
          };
        }
        return j;
      }));
      setToast({ message: `Job Upgraded: ${item}. Reposted with new 45-day timeline.`, type: 'success' });
      setUpgradingJobId(null);
      setShowSubscription(false);
      return;
    }

    if (tierId?.startsWith('employer_')) {
      const type = tierId.replace('employer_', '');
      setUser(prev => {
        const currentCredits = prev.productCredits || { standard: 0, premium: 0, shortlist: 0 };
        return {
          ...prev,
          productCredits: {
            ...currentCredits,
            [type]: (currentCredits[type] || 0) + quantity
          },
          purchaseHistory: [
            {
              id: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
              date: new Date().toISOString(),
              amount: amount,
              item: quantity > 1 ? `${quantity}x ${item}` : item,
              status: 'completed',
              paymentMethod: 'Credit Card'
            },
            ...prev.purchaseHistory
          ]
        };
      });
    } else {
      setUser(prev => ({
        ...prev,
        isSubscribed: true,
        subscriptionTier: 'premium',
        purchaseHistory: [
          {
            id: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
            amount: amount,
            item: item,
            status: 'completed',
            paymentMethod: 'Credit Card'
          },
          ...prev.purchaseHistory
        ]
      }));
    }
    setToast({ message: quantity > 1 ? `${quantity} Units of ${item} Activated` : `${item} Activated`, type: 'success' });
    setShowSubscription(false);
  };

  const handleTestComplete = (score: number, proctorFlags: number) => {
    if (!activeTestJob) return;
    setApplications(prev => prev.map(app => {
      if (app.jobId === activeTestJob.id && app.candidateProfile?.email === user.email) {
        return { ...app, testScore: score, proctorFlags };
      }
      return app;
    }));
    setToast({ message: `Assessment Processed: ${score}% Score.`, type: 'success' });
    setActiveTestJob(null);
  };

  const handleLaunchAssessment = (job: Job) => {
    if (!requireAuth("take assessments", 'seeker')) return;
    const test = aptitudeTests.find(t => t.id === job.aptitudeTestId);
    if (!test) {
      setToast({ message: "Neural Link Error: Assessment manifest not found.", type: 'error' });
      return;
    }
    setActiveTestJob(job);
  };

  const handleNavClick = (targetView: ViewType) => {
    setDetailedJob(null);
    setActiveCompanyProfile(null);
    setEditingJob(null);
    setShowAuthGate(false);

    // PUBLIC ROUTES
    const publicViews = ['home', 'seeker', 'signin', 'hrm-landing', 'payroll-landing', 'vendor-landing', 'career-insights'];

    if (targetView === 'employer-post-job') {
      if (!requireAuth("post job vacancies", 'employer')) return;
      setView('employer-management');
      setAutoOpenJobCreate(true);
      setTimeout(() => setAutoOpenJobCreate(false), 500);
      return;
    }

    if (!user.email && !publicViews.includes(targetView)) {
      setAuthGateRole('seeker');
      setShowAuthGate(true);
      return;
    }

    if (targetView === 'home' && user.email) {
      import('./lib/supabaseClient').then(({ supabase }) => {
        supabase.auth.signOut();
      });
      setUser(INITIAL_GUEST);
      setToast({ message: "Session Terminated.", type: 'info' });
    }

    setView(targetView);
  };

  const handleEditJob = (job: Job) => {
    if (!requireAuth("modify recruitment manifests", 'employer')) return;
    setEditingJob(job);
    setDetailedJob(null);
    setAutoOpenJobCreate(true);
    if (view !== 'employer-management') {
      setView('employer-management');
    }
  };

  const handleSelectDetailedJob = (job: Job) => {
    setEditingJob(null);
    setDetailedJob(job);
  };

  const handleAddSubUser = (sub: Partial<SubUser>) => {
    const newSub: SubUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: sub.name || '',
      email: sub.email || '',
      role: sub.role || 'recruiter',
      isSuperUser: false,
      joinedDate: new Date().toISOString(),
      lastLogin: 'Never'
    };
    setUser(prev => ({
      ...prev,
      subUsers: [...(prev.subUsers || []), newSub]
    }));
  };

  const handleRemoveSubUser = (id: string) => {
    setUser(prev => ({
      ...prev,
      subUsers: (prev.subUsers || []).filter(s => s.id !== id)
    }));
    setToast({ message: "Member access revoked.", type: 'info' });
  };

  const handleAddSubsidiary = (subs: Partial<Subsidiary>) => {
    const newSubs: Subsidiary = {
      id: Math.random().toString(36).substr(2, 9),
      name: subs.name || '',
      industry: subs.industry || '',
      location: subs.location || '',
      activeJobs: 0,
      joinedDate: new Date().toISOString()
    };
    setUser(prev => ({
      ...prev,
      subsidiaries: [...(prev.subsidiaries || []), newSubs]
    }));
  };

  const handleSaveAlert = (alertData: Omit<JobAlert, 'id' | 'isActive'>) => {
    if (!requireAuth("save job alerts", 'seeker')) return;
    const newAlert: JobAlert = {
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
      ...alertData
    };
    setUser(prev => ({
      ...prev,
      alerts: [...(prev.alerts || []), newAlert]
    }));
    setToast({ message: "Job Alert Manifest Synchronized", type: 'success' });
  };

  const handleDeleteAlert = (id: string) => {
    setUser(prev => ({
      ...prev,
      alerts: (prev.alerts || []).filter(a => a.id !== id)
    }));
    setToast({ message: "Alert Criterion Purged", type: 'info' });
  };

  const handleUpdateApplicationStatus = useCallback(async (appId: string, status: ApplicationStatus) => {
    // Optimistic UI update
    setApplications(prev => prev.map(app => (app.id === appId || app.job_id === appId) ? { ...app, status } : app));

    // Persistent update
    const { supabase } = await import('./lib/supabaseClient');
    const { error } = await supabase.from('applications').update({ status }).match({ id: appId });

    if (!error) {
      setToast({ message: `Status updated to ${status.replace('-', ' ')}. Notifications transmitted.`, type: 'success' });
    } else {
      setToast({ message: "Cloud synchronization failed.", type: 'error' });
    }
  }, []);

  const employerJobs = useMemo(() =>
    jobs.filter(j => j.company === (user.companyName || user.name)),
    [jobs, user]);

  const employerTests = useMemo(() =>
    aptitudeTests.filter(t => employerJobs.some(j => j.id === t.jobId)),
    [aptitudeTests, employerJobs]);

  const isDetailActive = !!(detailedJob || activeCompanyProfile);

  return (
    <div className="relative min-h-screen bg-[#0a4179]">
      <Background3D />

      {showAuthGate && !isAuthenticated ? (
        <AuthGate
          initialRole={authGateRole}
          onSelectSeeker={(email) => {
            setUser(prev => ({ ...prev, email, name: email.split('@')[0], isEmployer: false }));
            setView('profile');
            setShowAuthGate(false);
          }}
          onSelectEmployer={(email) => {
            setUser(prev => ({ ...prev, email, name: email.split('@')[0], isEmployer: true, companyName: email.split('@')[1]?.split('.')[0] }));
            setView('employer-profile');
            setShowAuthGate(false);
          }}
          onSignIn={() => {
            setView('signin');
            setShowAuthGate(false);
          }}
          onSignUp={() => {
            setView('signup');
            setShowAuthGate(false);
          }}
          onBack={() => setShowAuthGate(false)}
        />
      ) : null}

      <Layout view={view} setView={handleNavClick} user={user}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {isMatching && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-6">
            <div className="relative">
              <Loader2 size={64} className="text-[#F0C927] animate-spin" />
              <Sparkles size={24} className="absolute inset-0 m-auto text-[#41d599] animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-widest">Neural Calibration</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Gemini is analyzing market fit for {user.name}...</p>
            </div>
          </div>
        )}

        {view === 'home' && (
          <Home
            onSeekerSignUp={() => { setAuthGateRole('seeker'); setShowAuthGate(true); }}
            onEmployerSignUp={() => { setAuthGateRole('employer'); setShowAuthGate(true); }}
            onSignInClick={() => setView('signin')}
            onViewCompany={(name) => setActiveCompanyProfile(name)}
            onNavigateToModule={(v) => handleNavClick(v)}
            onSelectJob={handleSelectDetailedJob}
            premiumJobs={jobs.filter(j => j.isPremium)}
          />
        )}

        {view === 'seeker' && !isDetailActive && (
          <div className="space-y-6">
            <SeekerFeed
              jobs={jobs}
              user={user}
              applications={applications}
              onSelectJob={handleSelectDetailedJob}
              onInspectMatch={handleInspectMatch}
              onApply={handleApplyRequest}
              onViewCompany={setActiveCompanyProfile}
              onOpenAlerts={(k, l, s) => {
                if (requireAuth("create job alerts", 'seeker')) {
                  setAlertDefaults({ keywords: k, location: l, minSalary: s });
                  setShowJobJobAlerts(true);
                }
              }}
            />
          </div>
        )}

        {view === 'seeker-insights' && !isDetailActive && (
          <SeekerAnalytics
            user={user}
            applications={applications}
            onViewOverseas={() => {
              setView('seeker');
              setToast({ message: "Showing Global Market Opportunities", type: 'info' });
            }}
          />
        )}

        {(detailedJob && !activeCompanyProfile) && (
          <JobDetails
            job={detailedJob}
            allJobs={jobs}
            user={user}
            applications={applications}
            onBack={() => { setDetailedJob(null); setEditingJob(null); }}
            onApply={handleApplyRequest}
            onSelectJob={handleSelectDetailedJob}
            onInspectMatch={handleInspectMatch}
            onViewCompany={setActiveCompanyProfile}
            onLaunchCoach={() => {
              if (requireAuth("access the AI Career Coach", 'seeker')) {
                setShowCoach(true);
              }
            }}
            onTakeTest={handleLaunchAssessment}
            onEdit={handleEditJob}
          />
        )}

        {activeCompanyProfile && (
          <CompanyProfileView companyName={activeCompanyProfile} allJobs={jobs} onBack={() => setActiveCompanyProfile(null)} onSelectJob={(j) => { handleSelectDetailedJob(j); setActiveCompanyProfile(null); }} />
        )}

        {view === 'seeker-applications' && !isDetailActive && <SeekerApplications applications={applications} jobs={jobs} onSelectJob={handleSelectDetailedJob} onViewCompany={setActiveCompanyProfile} />}
        {view === 'comm-assistant' && !isDetailActive && <ProfessionalAIAssistant user={user} jobs={jobs} onBack={() => setView('seeker')} onUpgrade={() => setShowSubscription(true)} />}
        {view === 'cv-prep' && !isDetailActive && <CVPrep user={user} setUser={setUser} jobs={jobs} onBack={() => setView('seeker')} />}
        {view === 'interview-prep' && !isDetailActive && <InterviewPrep user={user} jobs={jobs} onBack={() => setView('seeker')} />}

        {view === 'employer' && !isDetailActive && <JobManagement activeTab="overview" jobs={employerJobs} user={user} applications={applications} onUpdateApplicationStatus={handleUpdateApplicationStatus} onToggleJobStatus={handleToggleJobStatus} onUpgradeJob={handleUpgradeJob} onDeleteJob={handleDeleteJob} onPostJob={handlePostJob} onUpgradeRequest={handleUpgradeJob} autoOpenCreate={autoOpenJobCreate} onSelectJob={handleSelectDetailedJob} initialJobData={editingJob} onCloseModal={() => { setEditingJob(null); setUpgradingJobId(null); }} />}
        {view === 'employer-management' && !isDetailActive && <JobManagement activeTab="listings" jobs={employerJobs} user={user} applications={applications} onUpdateApplicationStatus={handleUpdateApplicationStatus} onToggleJobStatus={handleToggleJobStatus} onUpgradeJob={handleUpgradeJob} onDeleteJob={handleDeleteJob} onPostJob={handlePostJob} onUpgradeRequest={handleUpgradeJob} autoOpenCreate={autoOpenJobCreate} onSelectJob={handleSelectDetailedJob} initialJobData={editingJob} onCloseModal={() => { setEditingJob(null); setUpgradingJobId(null); }} />}
        {view === 'employer-aptitude' && !isDetailActive && <AptitudeTestManager user={user} jobs={employerJobs} tests={employerTests} applications={applications} onSaveTest={(test) => setAptitudeTests(prev => [...prev, test])} onDeployTest={(jobId, testId) => setJobs(prev => prev.map(j => j.id === jobId ? { ...j, aptitudeTestId: testId } : j))} />}
        {view === 'employer-comm-assistant' && !isDetailActive && <EmployerCommAssistant user={user} jobs={jobs} onBack={() => setView('employer')} onUpgrade={() => setShowSubscription(true)} />}
        {view === 'employer-org' && !isDetailActive && <OrganizationManagement user={user} onAddSubUser={handleAddSubUser} onRemoveSubUser={handleRemoveSubUser} onAddSubsidiary={handleAddSubsidiary} onViewCompany={setActiveCompanyProfile} />}
        {view === 'services' && !isDetailActive && <ProductsAndServices user={user} onUpgradeRequest={(type) => { setShowSubscription(true); }} />}

        {view === 'hrm-landing' && <ComingSoonLanding module="hrm" onBack={() => setView('home')} />}
        {view === 'payroll-landing' && <ComingSoonLanding module="payroll" onBack={() => setView('home')} />}
        {view === 'vendor-landing' && <ComingSoonLanding module="vendor" onBack={() => setView('home')} />}

        {view === 'admin' && !isDetailActive && <AdminDashboard user={user} jobs={jobs} applications={applications} transactions={GLOBAL_TRANSACTIONS} onBack={() => setView('home')} pendingVerifications={[]} onVerifyEmployer={() => { }} onApproveJob={() => { }} onUpdateApplicationStatus={handleUpdateApplicationStatus} />}
        {view === 'career-insights' && <CareerInsights onBack={() => setView('home')} user={user} />}
        {view === 'profile' && !isDetailActive && <Profile user={user} setUser={setUser} onBack={() => setView('seeker')} />}
        {view === 'settings' && !isDetailActive && <Settings user={user} setUser={setUser} onUpgradeRequest={() => setShowSubscription(true)} />}
        {view === 'billing' && !isDetailActive && <Billing user={user} onUpgrade={() => setShowSubscription(true)} />}
        {view === 'signin' && <SignIn onSignIn={handleSignIn} onBack={() => setView('home')} onSignUpClick={() => setView('signup')} />}
        {view === 'signup' && <SignUp onSignUp={(u) => handleSignIn(u)} onBack={() => setView('home')} onSignInClick={() => setView('signin')} />}
        {view === 'employer-profile' && !isDetailActive && <EmployerProfile user={user} setUser={setUser} onViewCompany={(name) => setActiveCompanyProfile(name)} onAddSubsidiary={handleAddSubsidiary} onComplete={() => setView('employer')} onBack={() => setView('employer')} />}

        {showSubscription && (
          <SubscriptionModal
            type={user.isEmployer ? 'employer' : 'seeker'}
            upgradeFrom={upgradingJobId ? (jobs.find(j => j.id === upgradingJobId)?.isPremium ? 'premium' : 'regular') : undefined}
            onSuccess={handleSubscriptionSuccess}
            onClose={() => { setShowSubscription(false); setUpgradingJobId(null); }}
          />
        )}
        {showJobAlerts && (
          <JobAlertsModal
            alerts={user.alerts || []}
            onSave={handleSaveAlert}
            onDelete={handleDeleteAlert}
            onClose={() => setShowJobJobAlerts(false)}
            initialKeywords={alertDefaults.keywords}
            initialLocation={alertDefaults.location}
          />
        )}
        {inspectJob && <MatchDetails job={inspectJob} onClose={() => setInspectJob(null)} />}

        {applyingJob && (
          <VideoRecorder
            onComplete={handleVideoComplete}
            onCancel={() => setApplyingJob(null)}
          />
        )}

        {activeTestJob && (
          <AptitudeTestPlayer
            test={aptitudeTests.find(t => t.id === activeTestJob.aptitudeTestId)}
            onComplete={handleTestComplete}
            onCancel={() => setActiveTestJob(null)}
          />
        )}

        <CareerCoach user={user} isSubscribed={user.isSubscribed} onUpgrade={() => setShowSubscription(true)} currentJob={detailedJob} isOpen={showCoach} setIsOpen={setShowCoach} />
      </Layout>
    </div>
  );
};

export default App;
