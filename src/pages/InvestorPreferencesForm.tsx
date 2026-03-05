import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import {
  InvestorProfile,
  Industry,
  Region,
  Country,
  Stage,
  RiskTolerance,
  ImpactFocus,
  InvestorType,
} from "../types";
import { motion } from "motion/react";
import { Save } from "lucide-react";

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
const REGIONS: Region[] = ["Europe", "LATAM", "North America", "Global"];
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
const STAGES: Stage[] = ["Idea", "MVP", "Traction", "Scaling"];
const RISK_TOLERANCE: RiskTolerance[] = ["Low", "Medium", "High"];
const IMPACT_FOCUS: ImpactFocus[] = [
  "None",
  "Sustainability",
  "Inclusion",
  "Education",
  "Health",
];
const INVESTOR_TYPES: InvestorType[] = [
  "Angel",
  "VC",
  "Corporate",
  "Family office",
];

export default function InvestorPreferencesForm() {
  const { currentUser, investors, updateInvestorPreferences, language } =
    useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const existingProfile = investors.find(
    (i) => i.ownerUserId === currentUser?.id,
  );

  const [formData, setFormData] = useState<Partial<InvestorProfile>>({
    preferredIndustries: [],
    preferredRegions: [],
    countriesFocus: [],
    stagePreference: [],
    ticketMin: 50000,
    ticketMax: 500000,
    riskTolerance: "Medium",
    impactFocus: "None",
    investorType: "Angel",
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    }
  }, [existingProfile]);

  const calculateCompleteness = (data: Partial<InvestorProfile>) => {
    let score = 0;
    const requiredFields = [
      "ticketMin",
      "ticketMax",
      "riskTolerance",
      "investorType",
    ];
    requiredFields.forEach((field) => {
      if (data[field as keyof InvestorProfile]) score += 1;
    });
    if (data.preferredIndustries && data.preferredIndustries.length > 0)
      score += 1;
    if (data.preferredRegions && data.preferredRegions.length > 0) score += 1;
    if (data.stagePreference && data.stagePreference.length > 0) score += 1;

    return Math.round((score / (requiredFields.length + 3)) * 100);
  };

  const handleSave = () => {
    const completeness = calculateCompleteness(formData);
    updateInvestorPreferences({
      ...formData,
      preferencesCompleteness: completeness,
    });
    navigate("/investor/matches");
  };

  const toggleArrayItem = (array: any[] = [], item: any) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    } else {
      return [...array, item];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          {t.editPreferences}
        </h2>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Preferred Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferredIndustries: toggleArrayItem(
                        formData.preferredIndustries,
                        ind,
                      ),
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    formData.preferredIndustries?.includes(ind)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                      : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Preferred Regions
            </label>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      preferredRegions: toggleArrayItem(
                        formData.preferredRegions,
                        reg,
                      ),
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    formData.preferredRegions?.includes(reg)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                      : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Stage Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      stagePreference: toggleArrayItem(
                        formData.stagePreference,
                        stage,
                      ),
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    formData.stagePreference?.includes(stage)
                      ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                      : "bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Ticket Size Min (€)
              </label>
              <input
                type="number"
                value={formData.ticketMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticketMin: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Ticket Size Max (€)
              </label>
              <input
                type="number"
                value={formData.ticketMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ticketMax: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Risk Tolerance
              </label>
              <select
                value={formData.riskTolerance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    riskTolerance: e.target.value as RiskTolerance,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {RISK_TOLERANCE.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Impact Focus
              </label>
              <select
                value={formData.impactFocus}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    impactFocus: e.target.value as ImpactFocus,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {IMPACT_FOCUS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Investor Type
              </label>
              <select
                value={formData.investorType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    investorType: e.target.value as InvestorType,
                  })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {INVESTOR_TYPES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
            >
              <Save className="w-5 h-5" /> Save Preferences
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
