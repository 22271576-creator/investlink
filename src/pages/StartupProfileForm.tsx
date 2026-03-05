import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import {
  StartupProfile,
  Country,
  Industry,
  Stage,
  TicketType,
  BusinessModel,
  FounderExperience,
  RiskTag,
} from "../types";
import { motion } from "motion/react";
import { Save, Send, Upload, CheckCircle } from "lucide-react";

const COUNTRIES: Country[] = [
  "Spain",
  "Panama",
  "UK",
  "Germany",
  "France",
  "Mexico",
  "USA",
  "Colombia",
  "Brazil",
  "Other",
];
const INDUSTRIES: Industry[] = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "ClimateTech",
  "SaaS",
  "Marketplace",
  "AI",
  "Logistics",
  "Food & Beverage",
  "Other",
];
const STAGES: Stage[] = ["Idea", "MVP", "Traction", "Scaling"];
const TICKET_TYPES: TicketType[] = [
  "Equity",
  "SAFE",
  "Convertible Note",
  "Grant/Non-dilutive",
];
const BUSINESS_MODELS: BusinessModel[] = [
  "Subscription",
  "Commission",
  "Transaction fee",
  "Advertising",
  "Enterprise licensing",
  "Other",
];
const FOUNDER_EXP: FounderExperience[] = [
  "First-time",
  "Some experience",
  "Serial entrepreneur",
];
const RISK_TAGS: RiskTag[] = [
  "Regulatory",
  "Competition",
  "Cybersecurity",
  "Market adoption",
  "Team execution",
  "Funding",
  "Technology",
  "Operations",
];

export default function StartupProfileForm() {
  const {
    currentUser,
    startups,
    updateStartupProfile,
    submitForVerification,
    language,
  } = useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const existingProfile = startups.find(
    (s) => s.ownerUserId === currentUser?.id,
  );

  const [formData, setFormData] = useState<Partial<StartupProfile>>({
    name: "",
    country: "Spain",
    industry: "FinTech",
    stage: "Idea",
    fundingNeeded: 100000,
    ticketType: "Equity",
    shortPitch: "",
    problem: "",
    solution: "",
    businessModel: "Subscription",
    traction: { mau: 0, revenue: 0, momGrowth: 0 },
    teamSize: 1,
    founderExperience: "First-time",
    riskTags: [],
    documents: { pitchDeckUploaded: false, financialsUploaded: false },
    published: false,
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    }
  }, [existingProfile]);

  const calculateCompleteness = (data: Partial<StartupProfile>) => {
    let score = 0;
    const requiredFields = [
      "name",
      "country",
      "industry",
      "stage",
      "fundingNeeded",
      "ticketType",
      "shortPitch",
      "problem",
      "solution",
      "businessModel",
      "teamSize",
      "founderExperience",
    ];
    requiredFields.forEach((field) => {
      if (data[field as keyof StartupProfile]) score += 1;
    });
    if (data.riskTags && data.riskTags.length > 0) score += 1;
    if (data.documents?.pitchDeckUploaded) score += 1;

    return Math.round((score / (requiredFields.length + 2)) * 100);
  };

  const handleSaveDraft = () => {
    const completeness = calculateCompleteness(formData);
    updateStartupProfile({ ...formData, profileCompleteness: completeness });
    navigate("/startup/dashboard");
  };

  const handlePublish = () => {
    const completeness = calculateCompleteness(formData);
    updateStartupProfile({
      ...formData,
      published: true,
      profileCompleteness: completeness,
    });
    navigate("/startup/dashboard");
  };

  const handleSubmitVerification = () => {
    if (existingProfile) {
      submitForVerification(existingProfile.id);
      navigate("/startup/dashboard");
    }
  };

  const completeness = calculateCompleteness(formData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            {t.startupProfile}
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Startup Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Country *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value as Country,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Industry *
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      industry: e.target.value as Industry,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Stage *
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) =>
                    setFormData({ ...formData, stage: e.target.value as Stage })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Funding Needed (€) *
                </label>
                <input
                  type="number"
                  value={formData.fundingNeeded}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fundingNeeded: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Ticket Type *
                </label>
                <select
                  value={formData.ticketType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ticketType: e.target.value as TicketType,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {TICKET_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Short Pitch *
              </label>
              <textarea
                value={formData.shortPitch}
                onChange={(e) =>
                  setFormData({ ...formData, shortPitch: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Problem *
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Solution *
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) =>
                  setFormData({ ...formData, solution: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Business Model *
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessModel: e.target.value as BusinessModel,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {BUSINESS_MODELS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Founder Experience *
                </label>
                <select
                  value={formData.founderExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      founderExperience: e.target.value as FounderExperience,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {FOUNDER_EXP.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Risk Tags (Select up to 5) *
              </label>
              <div className="flex flex-wrap gap-2">
                {RISK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const tags = formData.riskTags || [];
                      if (tags.includes(tag)) {
                        setFormData({
                          ...formData,
                          riskTags: tags.filter((t) => t !== tag),
                        });
                      } else if (tags.length < 5) {
                        setFormData({ ...formData, riskTags: [...tags, tag] });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      formData.riskTags?.includes(tag)
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Documents
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        pitchDeckUploaded: true,
                      } as any,
                    })
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    formData.documents?.pitchDeckUploaded
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {formData.documents?.pitchDeckUploaded ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Pitch Deck
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      documents: {
                        ...formData.documents,
                        financialsUploaded: true,
                      } as any,
                    })
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
                    formData.documents?.financialsUploaded
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {formData.documents?.financialsUploaded ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Financials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            Preview & Actions
          </h3>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">Completeness</span>
              <span className="font-bold text-emerald-600">
                {completeness}%
              </span>
            </div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 mb-6">
            <h4 className="font-bold text-lg text-neutral-900 truncate">
              {formData.name || "Startup Name"}
            </h4>
            <p className="text-sm text-neutral-500 mb-2">
              {formData.industry} • {formData.stage} • {formData.country}
            </p>
            <p className="text-sm font-medium text-emerald-700 mb-3">
              €{formData.fundingNeeded?.toLocaleString() || 0} (
              {formData.ticketType})
            </p>
            <p className="text-sm text-neutral-600 line-clamp-3">
              {formData.shortPitch || "Short pitch preview..."}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition"
            >
              <Save className="w-4 h-4" /> {t.saveDraft}
            </button>
            <button
              onClick={handlePublish}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              <Send className="w-4 h-4" /> {t.publishProfile}
            </button>
            {existingProfile?.published &&
              completeness >= 80 &&
              existingProfile.verificationStatus !== "pending" &&
              existingProfile.verificationStatus !== "verified" && (
                <button
                  onClick={handleSubmitVerification}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  <CheckCircle className="w-4 h-4" /> {t.submitVerification}
                </button>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
