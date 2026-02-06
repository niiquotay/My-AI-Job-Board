
export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  year?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface JobAlert {
  id: string;
  keywords: string;
  location: string;
  minSalary: number;
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
}

export interface InterviewFeedback {
  id: string;
  jobTitle: string;
  date: string;
  confidenceScore: number;
  contentScore: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export type ApplicationStatus =
  | 'applied'
  | 'shortlisted'
  | 'rejected'
  | 'assessment'
  | 'interview-invitation'
  | 'selected'
  | 'final-interview'
  | 'offer-letter'
  | 'salary-negotiating'
  | 'approval'
  | 'hired';

export interface Application {
  id: string;
  jobId: string;
  status: ApplicationStatus;
  appliedDate: string;
  candidateProfile?: UserProfile;
  videoUrl?: string;
  testScore?: number;
  proctorFlags?: number; // Number of integrity breaches (tab switches)
}

export interface AptitudeQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
}

export interface AptitudeTest {
  id: string;
  jobId: string;
  title: string;
  questions: AptitudeQuestion[];
  createdAt: string;
  timeLimit: number; // in minutes
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logoUrl?: string;
  location: string; // Used for Onsite/Remote/Hybrid
  city: string;
  country: string;
  category?: string;
  allowedCountries: string[];
  salary: string;
  salaryStructure?: 'Fixed' | 'Commission Only' | 'Commission + Salary';
  roleDefinition?: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  tags: string[];
  benefits?: string[];
  postedAt: string;
  isPremium?: boolean;
  isQuickHire?: boolean;
  isShortlistService?: boolean;
  isProfessionalHiring?: boolean;
  status?: 'active' | 'closed' | 'draft' | 'pending_approval';
  matchScore?: number;
  matchReason?: string;
  matchDetails?: {
    technical: number;
    culture: number;
    experience: number;
  };
  applicationType: 'in-app' | 'external';
  externalApplyUrl?: string;
  aptitudeTestId?: string;
  // New fields for organizational context
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Volunteering';
  contractTerm?: string;
  organizationType?: 'NGO' | 'Government' | 'Private';
  jobRank?: 'Senior Management' | 'Middle Level' | 'Entry Level' | 'Intern' | 'Executive';
  targetGender?: string;
  targetAgeRange?: string;
  targetRace?: string;
  targetDisabilityStatus?: string;
  targetReligion?: string;
  targetMaritalStatus?: string;
  targetVeteranStatus?: string;
  availabilityRequirement?: string;
}

export interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  date: string;
  item: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

export type OperationalRole =
  | 'sales_exec'
  | 'sales_manager'
  | 'cs_operator'
  | 'cs_head'
  | 'recruiter'
  | 'recruiter_head'
  | 'finance_manager'
  | 'finance_head'
  | 'super_admin';

export interface SubUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'viewer';
  isSuperUser: boolean;
  joinedDate: string;
  lastLogin: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  position: string;
  imageUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export interface Subsidiary {
  id: string;
  name: string;
  industry: string;
  activeJobs: number;
  location: string;
  joinedDate: string;
  leadership?: LeadershipMember[];
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  whatsapp?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  role: string;
  city: string;
  country: string;
  skills: string[];
  digitalSkills: string[];
  certifications: string[];
  hobbies: string[];
  projects: Project[];
  experienceSummary: string;
  bio?: string;
  stealthMode: boolean;
  profileCompleted: boolean;
  linkedInConnected: boolean;
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'premium';
  productCredits?: {
    standard: number;
    premium: number;
    shortlist: number;
  };
  purchaseHistory: Transaction[];
  adOptIn: boolean;
  alerts: JobAlert[];
  savedJobIds: string[];
  autoApplyEnabled: boolean;
  enhancedAvatar?: string;
  profileImages: string[];
  workHistory: WorkExperience[];
  education: Education[];
  isEmployer?: boolean;
  isVerified?: boolean;
  isAdmin?: boolean;
  isSuperUser?: boolean;
  subUsers?: SubUser[];
  subsidiaries?: Subsidiary[];
  leadership?: LeadershipMember[];
  opRole?: OperationalRole;
  companyName?: string;
  companyBio?: string;
  cvName?: string;
  cvUrl?: string;
  industry?: string;
  companySize?: string;
  companyWebsite?: string;
  companyLinkedin?: string;
  companyTwitter?: string;
  companyFacebook?: string;
  foundingYear?: string;
  velocity?: string;
  companyType?: string;
  ownershipStructure?: string;
  personalTitle?: string;
  gender?: string;
  ageRange?: string;
  race?: string;
  disabilityStatus?: string;
  religion?: string;
  maritalStatus?: string;
  veteranStatus?: string;
  demographicVisibility?: {
    gender: boolean;
    ageRange: boolean;
    race: boolean;
    disabilityStatus: boolean;
    religion: boolean;
    maritalStatus: boolean;
    veteranStatus: boolean;
  };
  joinedDate?: string;
}

export type ViewType =
  | 'seeker'
  | 'seeker-insights'
  | 'seeker-applications'
  | 'employer'
  | 'employer-management'
  | 'employer-profile'
  | 'home'
  | 'profile'
  | 'job-details'
  | 'billing'
  | 'interview-prep'
  | 'cv-prep'
  | 'settings'
  | 'signin'
  | 'signup'
  | 'employer-public-profile'
  | 'admin'
  | 'comm-assistant'
  | 'employer-comm-assistant'
  | 'employer-aptitude'
  | 'employer-org'
  | 'services'
  | 'hrm-landing'
  | 'payroll-landing'
  | 'vendor-landing'
  | 'career-insights';
