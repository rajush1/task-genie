export type EmploymentType = "Full-time" | "Part-time" | "Contract";
export interface Job {
  id: string;
  title: string;
  company: string;
  initials: string;
  salary: string;
  employmentType: EmploymentType;
  weeklyHours: string;
  timezone: string;
  posted: string;
  skills: string[];
  verified: boolean;
  summary: string;
  description: string[];
  responseRate: string;
  category: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  salaryUsd?: number;
  location?: string;
}
export interface Candidate {
  id: string;
  name: string;
  role: string;
  location: string;
  country: string;
  availability: string;
  desiredPay: string;
  lastActive: string;
  verified: boolean;
  english: string;
  responseTime: string;
  skills: string[];
  bio: string;
  match: number;
  avatarTone: string;
  experience?: string;
  education?: string;
  portfolio?: string[];
}
export type PipelineStage = "New" | "Shortlisted" | "Interview" | "Offer";
export interface Application {
  id: string;
  candidateId: string;
  jobTitle: string;
  stage: PipelineStage;
  applyPoints: number;
  jobId?: string;
}
export interface ApplyPointsTransaction {
  id: string;
  kind: "daily" | "application";
  amount: number;
  date: string;
  description: string;
  jobId?: string;
}
export interface ApplyPointsWallet {
  balance: number;
  lastEarnedDate: string | null;
  history: ApplyPointsTransaction[];
}
export interface JobApplication {
  jobId: string;
  pointsUsed: number;
  submittedAt: string;
  subject: string;
  message: string;
}
export interface MarketplaceState {
  savedJobIds: string[];
  appliedJobIds: string[];
  shortlistedCandidateIds: string[];
  applications: Application[];
  applyPoints: ApplyPointsWallet;
  jobApplications: JobApplication[];
  profile: {
    headline: string;
    bio: string;
    skills: string[];
    portfolio: string;
    resume: boolean;
    verified: boolean;
  };
}

export interface Conversation {
  id: string;
  name: string;
  company: string;
  role: string;
  unread: number;
  time: string;
  messages: { sender: string; text: string; time: string }[];
}
