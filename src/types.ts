export type Role = "startup" | "investor" | "admin" | "pitchroom";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Country =
  | "Spain"
  | "Panama"
  | "UK"
  | "Germany"
  | "France"
  | "Mexico"
  | "USA"
  | "Colombia"
  | "Brazil"
  | "Other";
export type Industry =
  | "FinTech"
  | "HealthTech"
  | "EdTech"
  | "ClimateTech"
  | "SaaS"
  | "Marketplace"
  | "AI"
  | "Logistics"
  | "Food & Beverage"
  | "Other";
export type Stage = "Idea" | "MVP" | "Traction" | "Scaling";
export type TicketType =
  | "Equity"
  | "SAFE"
  | "Convertible Note"
  | "Grant/Non-dilutive";
export type BusinessModel =
  | "Subscription"
  | "Commission"
  | "Transaction fee"
  | "Advertising"
  | "Enterprise licensing"
  | "Other";
export type FounderExperience =
  | "First-time"
  | "Some experience"
  | "Serial entrepreneur";
export type RiskTag =
  | "Regulatory"
  | "Competition"
  | "Cybersecurity"
  | "Market adoption"
  | "Team execution"
  | "Funding"
  | "Technology"
  | "Operations";
export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";
export type Region = "Europe" | "LATAM" | "North America" | "Global";
export type RiskTolerance = "Low" | "Medium" | "High";
export type ImpactFocus =
  | "None"
  | "Sustainability"
  | "Inclusion"
  | "Education"
  | "Health";
export type InvestorType = "Angel" | "VC" | "Corporate" | "Family office";
export type RequestStatus = "pending" | "accepted" | "rejected";

export interface StartupProfile {
  id: string;
  ownerUserId: string;
  name: string;
  country: Country;
  industry: Industry;
  stage: Stage;
  fundingNeeded: number;
  ticketType: TicketType;
  shortPitch: string;
  problem: string;
  solution: string;
  businessModel: BusinessModel;
  traction: {
    mau?: number;
    revenue?: number;
    momGrowth?: number;
  };
  teamSize: number;
  founderExperience: FounderExperience;
  riskTags: RiskTag[];
  documents: {
    pitchDeckUploaded: boolean;
    financialsUploaded: boolean;
  };
  profileCompleteness: number;
  published: boolean;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorProfile {
  id: string;
  ownerUserId: string;
  preferredIndustries: Industry[];
  preferredRegions: Region[];
  countriesFocus: Country[];
  stagePreference: Stage[];
  ticketMin: number;
  ticketMax: number;
  riskTolerance: RiskTolerance;
  impactFocus: ImpactFocus;
  investorType: InvestorType;
  preferencesCompleteness: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadMessage {
  fromRole: Role;
  text: string;
  timestamp: string;
}

export interface Request {
  id: string;
  startupId: string;
  investorUserId: string;
  message: string;
  purpose: string;
  status: RequestStatus;
  threadMessages: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Saved {
  investorUserId: string;
  startupId: string;
  savedAt: string;
}

export interface AdminLog {
  id: string;
  adminUserId: string;
  actionType: string;
  startupId: string;
  note: string;
  timestamp: string;
}

export type PersonaInvestor =
  | "Skeptical VC"
  | "Friendly Angel"
  | "Corporate VC";

export interface QALog {
  question: string;
  answer: string;
  evaluation: string[];
  suggestion: string;
  score: number;
}

export interface PitchRoomSession {
  id: string;
  startupId?: string;
  customPitchText?: string;
  personaInvestor: PersonaInvestor;
  questionRounds: number;
  currentRound: number;
  qaLog: QALog[];
  finalScore: number;
  feedbackSections?: {
    strengths: string[];
    gaps: string[];
    nextSteps: string[];
  };
  generatedPitchSummary?: string;
  isComplete: boolean;
}
