import { create } from "zustand";
import {
  User,
  StartupProfile,
  InvestorProfile,
  Request,
  Saved,
  AdminLog,
  Role,
  PitchRoomSession,
  PersonaInvestor,
} from "../types";

interface AppState {
  users: User[];
  startups: StartupProfile[];
  investors: InvestorProfile[];
  requests: Request[];
  saved: Saved[];
  adminLogs: AdminLog[];
  currentUser: User | null;
  currentRole: Role | null;
  language: "ES" | "EN";
  pitchRoomSession: PitchRoomSession | null;

  // Actions
  login: (email: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  setLanguage: (lang: "ES" | "EN") => void;

  updateStartupProfile: (profile: Partial<StartupProfile>) => void;
  submitForVerification: (startupId: string) => void;

  updateInvestorPreferences: (prefs: Partial<InvestorProfile>) => void;

  saveStartup: (startupId: string) => void;
  unsaveStartup: (startupId: string) => void;

  createRequest: (startupId: string, message: string, purpose: string) => void;
  updateRequestStatus: (
    requestId: string,
    status: "accepted" | "rejected",
  ) => void;
  addThreadMessage: (requestId: string, text: string) => void;

  adminVerifyStartup: (startupId: string, note: string) => void;
  adminRejectStartup: (startupId: string, note: string) => void;
  adminHideStartup: (startupId: string) => void;

  startPitchRoomSession: (
    startupId: string | undefined,
    customPitchText: string | undefined,
    personaInvestor: PersonaInvestor,
    questionRounds: number,
  ) => void;
  updatePitchRoomSession: (updates: Partial<PitchRoomSession>) => void;
  endPitchRoomSession: () => void;
}

const seedUsers: User[] = [
  {
    id: "u1",
    name: "Startup Founder 1",
    email: "startup@test.com",
    role: "startup",
  },
  {
    id: "u2",
    name: "Investor 1",
    email: "investor@test.com",
    role: "investor",
  },
  { id: "u3", name: "Admin User", email: "admin@test.com", role: "admin" },
  { id: "u4", name: "Investor 2", email: "inv2@test.com", role: "investor" },
  { id: "u5", name: "Investor 3", email: "inv3@test.com", role: "investor" },
  { id: "u6", name: "Investor 4", email: "inv4@test.com", role: "investor" },
  { id: "u7", name: "Investor 5", email: "inv5@test.com", role: "investor" },
];

const seedStartups: StartupProfile[] = [
  {
    id: "s1",
    ownerUserId: "u1",
    name: "FinPay",
    country: "Spain",
    industry: "FinTech",
    stage: "Traction",
    fundingNeeded: 500000,
    ticketType: "Equity",
    shortPitch: "Democratizing cross-border payments for SMEs.",
    problem: "SMEs pay up to 5% in hidden fees for cross-border transactions.",
    solution: "A blockchain-based payment rail that reduces fees to 0.5%.",
    businessModel: "Transaction fee",
    traction: { mau: 5000, revenue: 25000, momGrowth: 15 },
    teamSize: 12,
    founderExperience: "Serial entrepreneur",
    riskTags: ["Regulatory", "Competition"],
    documents: { pitchDeckUploaded: true, financialsUploaded: true },
    profileCompleteness: 85,
    published: true,
    verificationStatus: "unverified",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s2",
    ownerUserId: "u_s2",
    name: "HealthSync",
    country: "Germany",
    industry: "HealthTech",
    stage: "MVP",
    fundingNeeded: 250000,
    ticketType: "Convertible Note",
    shortPitch: "AI-driven patient data synchronization.",
    problem: "Hospitals use fragmented systems leading to data silos.",
    solution: "Unified API for health records.",
    businessModel: "Enterprise licensing",
    traction: { mau: 0, revenue: 0, momGrowth: 0 },
    teamSize: 4,
    founderExperience: "Some experience",
    riskTags: ["Regulatory", "Cybersecurity"],
    documents: { pitchDeckUploaded: true, financialsUploaded: false },
    profileCompleteness: 85,
    published: true,
    verificationStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s3",
    ownerUserId: "u_s3",
    name: "EduLearn",
    country: "Panama",
    industry: "EdTech",
    stage: "Idea",
    fundingNeeded: 50000,
    ticketType: "SAFE",
    shortPitch: "Gamified learning for K-12.",
    problem: "Low engagement in remote learning.",
    solution: "Interactive gamified modules.",
    businessModel: "Subscription",
    traction: { mau: 0, revenue: 0, momGrowth: 0 },
    teamSize: 2,
    founderExperience: "First-time",
    riskTags: ["Market adoption"],
    documents: { pitchDeckUploaded: true, financialsUploaded: false },
    profileCompleteness: 70,
    published: true,
    verificationStatus: "unverified",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s4",
    ownerUserId: "u_s4",
    name: "GreenCarbon",
    country: "France",
    industry: "ClimateTech",
    stage: "Scaling",
    fundingNeeded: 2000000,
    ticketType: "Equity",
    shortPitch: "Carbon offset marketplace for enterprises.",
    problem: "Hard to verify carbon credits.",
    solution: "Verified marketplace with satellite tracking.",
    businessModel: "Commission",
    traction: { mau: 200, revenue: 150000, momGrowth: 20 },
    teamSize: 25,
    founderExperience: "Serial entrepreneur",
    riskTags: ["Regulatory"],
    documents: { pitchDeckUploaded: true, financialsUploaded: true },
    profileCompleteness: 100,
    published: true,
    verificationStatus: "verified",
    verificationNote: "Verified by external auditor.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s5",
    ownerUserId: "u_s5",
    name: "SaaSify",
    country: "UK",
    industry: "SaaS",
    stage: "Traction",
    fundingNeeded: 800000,
    ticketType: "Equity",
    shortPitch: "No-code internal tools builder.",
    problem: "Devs spend too much time on internal dashboards.",
    solution: "Drag and drop builder connecting to any DB.",
    businessModel: "Subscription",
    traction: { mau: 10000, revenue: 50000, momGrowth: 10 },
    teamSize: 15,
    founderExperience: "Some experience",
    riskTags: ["Competition"],
    documents: { pitchDeckUploaded: true, financialsUploaded: true },
    profileCompleteness: 95,
    published: true,
    verificationStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s6",
    ownerUserId: "u_s6",
    name: "MarketMex",
    country: "Mexico",
    industry: "Marketplace",
    stage: "MVP",
    fundingNeeded: 300000,
    ticketType: "SAFE",
    shortPitch: "B2B marketplace for local artisans.",
    problem: "Artisans lack access to global buyers.",
    solution: "Curated marketplace with integrated logistics.",
    businessModel: "Commission",
    traction: { mau: 500, revenue: 5000, momGrowth: 25 },
    teamSize: 6,
    founderExperience: "First-time",
    riskTags: ["Operations", "Funding"],
    documents: { pitchDeckUploaded: true, financialsUploaded: false },
    profileCompleteness: 80,
    published: true,
    verificationStatus: "rejected",
    verificationNote: "Missing legal entity documents.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s7",
    ownerUserId: "u_s7",
    name: "AutoAI",
    country: "USA",
    industry: "AI",
    stage: "Scaling",
    fundingNeeded: 5000000,
    ticketType: "Equity",
    shortPitch: "Autonomous agents for customer support.",
    problem: "Customer support is expensive and slow.",
    solution: "LLM-powered agents that resolve 80% of tickets.",
    businessModel: "Subscription",
    traction: { mau: 50, revenue: 300000, momGrowth: 30 },
    teamSize: 40,
    founderExperience: "Serial entrepreneur",
    riskTags: ["Technology", "Competition"],
    documents: { pitchDeckUploaded: true, financialsUploaded: true },
    profileCompleteness: 100,
    published: true,
    verificationStatus: "verified",
    verificationNote: "Passed technical due diligence.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "s8",
    ownerUserId: "u_s8",
    name: "LogiFast",
    country: "Colombia",
    industry: "Logistics",
    stage: "MVP",
    fundingNeeded: 150000,
    ticketType: "Convertible Note",
    shortPitch: "Last-mile delivery optimization.",
    problem: "Inefficient routing causes delays and high costs.",
    solution: "AI routing algorithm for local fleets.",
    businessModel: "Transaction fee",
    traction: { mau: 20, revenue: 2000, momGrowth: 5 },
    teamSize: 5,
    founderExperience: "Some experience",
    riskTags: ["Operations", "Market adoption"],
    documents: { pitchDeckUploaded: true, financialsUploaded: false },
    profileCompleteness: 82,
    published: true,
    verificationStatus: "unverified",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedInvestors: InvestorProfile[] = [
  {
    id: "i1",
    ownerUserId: "u2",
    preferredIndustries: ["FinTech", "SaaS", "AI"],
    preferredRegions: ["Europe", "North America"],
    countriesFocus: ["Spain", "UK", "USA"],
    stagePreference: ["Traction", "Scaling"],
    ticketMin: 100000,
    ticketMax: 1000000,
    riskTolerance: "Medium",
    impactFocus: "None",
    investorType: "VC",
    preferencesCompleteness: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "i2",
    ownerUserId: "u4",
    preferredIndustries: ["HealthTech", "ClimateTech"],
    preferredRegions: ["Europe", "Global"],
    countriesFocus: ["Germany", "France"],
    stagePreference: ["MVP", "Traction"],
    ticketMin: 50000,
    ticketMax: 500000,
    riskTolerance: "High",
    impactFocus: "Health",
    investorType: "Angel",
    preferencesCompleteness: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "i3",
    ownerUserId: "u5",
    preferredIndustries: ["EdTech", "Marketplace", "Logistics"],
    preferredRegions: ["LATAM"],
    countriesFocus: ["Panama", "Mexico", "Colombia"],
    stagePreference: ["Idea", "MVP"],
    ticketMin: 10000,
    ticketMax: 100000,
    riskTolerance: "High",
    impactFocus: "Education",
    investorType: "Angel",
    preferencesCompleteness: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "i4",
    ownerUserId: "u6",
    preferredIndustries: ["AI", "ClimateTech"],
    preferredRegions: ["North America", "Europe"],
    countriesFocus: ["USA", "UK"],
    stagePreference: ["Scaling"],
    ticketMin: 1000000,
    ticketMax: 10000000,
    riskTolerance: "Low",
    impactFocus: "Sustainability",
    investorType: "Corporate",
    preferencesCompleteness: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "i5",
    ownerUserId: "u7",
    preferredIndustries: ["FinTech", "Marketplace"],
    preferredRegions: ["Global"],
    countriesFocus: [],
    stagePreference: ["Traction"],
    ticketMin: 200000,
    ticketMax: 2000000,
    riskTolerance: "Medium",
    impactFocus: "None",
    investorType: "Family office",
    preferencesCompleteness: 95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedRequests: Request[] = [
  {
    id: "r1",
    startupId: "s1",
    investorUserId: "u4",
    message: "Hi FinPay team, I love your traction numbers. Would love to discuss a potential investment.",
    purpose: "Investment Discussion",
    status: "pending",
    threadMessages: [
      {
        fromRole: "investor",
        text: "Hi FinPay team, I love your traction numbers. Would love to discuss a potential investment.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "r2",
    startupId: "s2",
    investorUserId: "u2",
    message: "HealthSync looks promising. Can we schedule a call to go over your API documentation?",
    purpose: "Technical Due Diligence",
    status: "accepted",
    threadMessages: [
      {
        fromRole: "investor",
        text: "HealthSync looks promising. Can we schedule a call to go over your API documentation?",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        fromRole: "startup",
        text: "Absolutely! I've accepted your request. I'll send over a Calendly link shortly.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

const seedAdminLogs: AdminLog[] = [
  {
    id: "al1",
    adminUserId: "u3",
    actionType: "verify",
    startupId: "s4",
    note: "Verified by external auditor.",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "al2",
    adminUserId: "u3",
    actionType: "reject",
    startupId: "s6",
    note: "Missing legal entity documents.",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "al3",
    adminUserId: "u3",
    actionType: "verify",
    startupId: "s7",
    note: "Passed technical due diligence.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const useStore = create<AppState>((set, get) => ({
  users: seedUsers,
  startups: seedStartups,
  investors: seedInvestors,
  requests: seedRequests,
  saved: [],
  adminLogs: seedAdminLogs,
  currentUser: null,
  currentRole: null,
  language: "ES",
  pitchRoomSession: null,

  login: (email) => {
    const user = get().users.find((u) => u.email === email);
    if (user) {
      set({ currentUser: user, currentRole: user.role });
    } else {
      // Mock signup
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role: "startup", // default
      };
      set((state) => ({
        users: [...state.users, newUser],
        currentUser: newUser,
        currentRole: "startup",
      }));
    }
  },
  logout: () => set({ currentUser: null, currentRole: null }),
  setRole: (role) => set({ currentRole: role }),
  setLanguage: (lang) => set({ language: lang }),

  updateStartupProfile: (profileUpdates) => {
    const { currentUser, startups } = get();
    if (!currentUser) return;

    const existingIndex = startups.findIndex(
      (s) => s.ownerUserId === currentUser.id,
    );
    if (existingIndex >= 0) {
      const updatedStartups = [...startups];
      updatedStartups[existingIndex] = {
        ...updatedStartups[existingIndex],
        ...profileUpdates,
        updatedAt: new Date().toISOString(),
      };
      set({ startups: updatedStartups });
    } else {
      const newStartup: StartupProfile = {
        id: `s_${Date.now()}`,
        ownerUserId: currentUser.id,
        name: "",
        country: "Other",
        industry: "Other",
        stage: "Idea",
        fundingNeeded: 0,
        ticketType: "Equity",
        shortPitch: "",
        problem: "",
        solution: "",
        businessModel: "Other",
        traction: {},
        teamSize: 1,
        founderExperience: "First-time",
        riskTags: [],
        documents: { pitchDeckUploaded: false, financialsUploaded: false },
        profileCompleteness: 0,
        published: false,
        verificationStatus: "unverified",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...profileUpdates,
      };
      set({ startups: [...startups, newStartup] });
    }
  },
  submitForVerification: (startupId) => {
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId ? { ...s, verificationStatus: "pending" } : s,
      ),
    }));
  },

  updateInvestorPreferences: (prefs) => {
    const { currentUser, investors } = get();
    if (!currentUser) return;

    const existingIndex = investors.findIndex(
      (i) => i.ownerUserId === currentUser.id,
    );
    if (existingIndex >= 0) {
      const updatedInvestors = [...investors];
      updatedInvestors[existingIndex] = {
        ...updatedInvestors[existingIndex],
        ...prefs,
        updatedAt: new Date().toISOString(),
      };
      set({ investors: updatedInvestors });
    } else {
      const newInvestor: InvestorProfile = {
        id: `i_${Date.now()}`,
        ownerUserId: currentUser.id,
        preferredIndustries: [],
        preferredRegions: [],
        countriesFocus: [],
        stagePreference: [],
        ticketMin: 0,
        ticketMax: 0,
        riskTolerance: "Medium",
        impactFocus: "None",
        investorType: "Angel",
        preferencesCompleteness: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...prefs,
      };
      set({ investors: [...investors, newInvestor] });
    }
  },

  saveStartup: (startupId) => {
    const { currentUser, saved } = get();
    if (!currentUser) return;
    if (
      !saved.find(
        (s) => s.startupId === startupId && s.investorUserId === currentUser.id,
      )
    ) {
      set({
        saved: [
          ...saved,
          {
            investorUserId: currentUser.id,
            startupId,
            savedAt: new Date().toISOString(),
          },
        ],
      });
    }
  },
  unsaveStartup: (startupId) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((state) => ({
      saved: state.saved.filter(
        (s) =>
          !(s.startupId === startupId && s.investorUserId === currentUser.id),
      ),
    }));
  },

  createRequest: (startupId, message, purpose) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const newReq: Request = {
      id: `r_${Date.now()}`,
      startupId,
      investorUserId: currentUser.id,
      message,
      purpose,
      status: "pending",
      threadMessages: [
        {
          fromRole: "investor",
          text: message,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ requests: [...state.requests, newReq] }));
  },
  updateRequestStatus: (requestId, status) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r,
      ),
    }));
  },
  addThreadMessage: (requestId, text) => {
    const { currentRole } = get();
    if (!currentRole) return;
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              threadMessages: [
                ...r.threadMessages,
                {
                  fromRole: currentRole,
                  text,
                  timestamp: new Date().toISOString(),
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    }));
  },

  adminVerifyStartup: (startupId, note) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId
          ? { ...s, verificationStatus: "verified", verificationNote: note }
          : s,
      ),
      adminLogs: [
        {
          id: `al_${Date.now()}`,
          adminUserId: currentUser.id,
          actionType: "verify",
          startupId,
          note,
          timestamp: new Date().toISOString(),
        },
        ...state.adminLogs,
      ],
    }));
  },
  adminRejectStartup: (startupId, note) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId
          ? { ...s, verificationStatus: "rejected", verificationNote: note }
          : s,
      ),
      adminLogs: [
        {
          id: `al_${Date.now()}`,
          adminUserId: currentUser.id,
          actionType: "reject",
          startupId,
          note,
          timestamp: new Date().toISOString(),
        },
        ...state.adminLogs,
      ],
    }));
  },
  adminHideStartup: (startupId) => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId ? { ...s, published: false } : s,
      ),
      adminLogs: [
        {
          id: `al_${Date.now()}`,
          adminUserId: currentUser.id,
          actionType: "hide",
          startupId,
          note: "Hidden from public browse",
          timestamp: new Date().toISOString(),
        },
        ...state.adminLogs,
      ],
    }));
  },

  startPitchRoomSession: (
    startupId,
    customPitchText,
    personaInvestor,
    questionRounds,
  ) => {
    set({
      pitchRoomSession: {
        id: `prs_${Date.now()}`,
        startupId,
        customPitchText,
        personaInvestor,
        questionRounds,
        currentRound: 1,
        qaLog: [],
        finalScore: 0,
        isComplete: false,
      },
    });
  },
  updatePitchRoomSession: (updates) => {
    set((state) => ({
      pitchRoomSession: state.pitchRoomSession
        ? { ...state.pitchRoomSession, ...updates }
        : null,
    }));
  },
  endPitchRoomSession: () => {
    set({ pitchRoomSession: null });
  },
}));
