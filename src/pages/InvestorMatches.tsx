import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { calculateMatch } from "../utils/matching";
import { motion } from "motion/react";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Target,
  AlertTriangle,
} from "lucide-react";

export default function InvestorMatches() {
  const { currentUser, investors, startups, language } = useStore();
  const t = useTranslation(language);

  const profile = investors.find((i) => i.ownerUserId === currentUser?.id);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [riskOverride, setRiskOverride] = useState<
    "Low" | "Medium" | "High" | undefined
  >(undefined);

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Complete your preferences first
        </h2>
        <Link
          to="/investor/preferences"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Set Preferences
        </Link>
      </div>
    );
  }

  const matches = startups
    .filter((s) => s.published)
    .filter((s) => !verifiedOnly || s.verificationStatus === "verified")
    .map((startup) => {
      const match = calculateMatch(profile, startup, riskOverride);
      return { startup, match };
    })
    .sort((a, b) => b.match.totalScore - a.match.totalScore)
    .slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          {t.topMatches}
        </h1>

        <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-neutral-200">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 cursor-pointer px-3 py-1">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            {t.verifiedOnly}
          </label>
          <div className="h-6 w-px bg-neutral-200"></div>
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="text-sm font-medium text-neutral-700">
              Simulate Risk:
            </span>
            <select
              value={riskOverride || ""}
              onChange={(e) =>
                setRiskOverride(
                  e.target.value ? (e.target.value as any) : undefined,
                )
              }
              className="text-sm border-none bg-transparent focus:ring-0 text-indigo-600 font-semibold cursor-pointer"
            >
              <option value="">Default ({profile.riskTolerance})</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {matches.map(({ startup, match }, idx) => (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-6 md:w-1/3 bg-neutral-50 border-r border-neutral-200 flex flex-col justify-center items-center text-center">
                <div className="relative mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-neutral-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={56 * 2 * Math.PI}
                      strokeDashoffset={
                        56 * 2 * Math.PI -
                        (match.totalScore / 100) * 56 * 2 * Math.PI
                      }
                      className="text-indigo-500 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-neutral-900">
                      {match.totalScore}
                    </span>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">
                      Score
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Industry (30)</span>
                    <span className="font-semibold text-neutral-900">
                      {match.industryScore}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.industryScore / 30) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Stage (20)</span>
                    <span className="font-semibold text-neutral-900">
                      {match.stageScore}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.stageScore / 20) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Ticket (20)</span>
                    <span className="font-semibold text-neutral-900">
                      {match.ticketScore}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.ticketScore / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:w-2/3 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                      {startup.name}
                      {startup.verificationStatus === "verified" && (
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      )}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" /> {startup.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> {startup.stage}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {startup.country}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">
                      €{startup.fundingNeeded.toLocaleString()}
                    </p>
                    <p className="text-xs text-neutral-500 uppercase">
                      {startup.ticketType}
                    </p>
                  </div>
                </div>

                <p className="text-neutral-700 mb-6 line-clamp-2">
                  {startup.shortPitch}
                </p>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6 flex-1">
                  <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4" /> {t.whyMatch}
                  </h4>
                  <ul className="space-y-1">
                    {match.explanations.map((exp, i) => (
                      <li
                        key={i}
                        className="text-sm text-indigo-800 flex items-start gap-2"
                      >
                        <span className="text-indigo-400 mt-0.5">•</span> {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-3 mt-auto">
                  <Link
                    to={`/investor/startup/${startup.id}`}
                    className="px-6 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition"
                  >
                    {t.view} Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />{" "}
              {t.weightsPanel}
            </h3>
            <p className="text-sm text-neutral-600 mb-6">
              Our algorithm scores startups based on your preferences to save
              you time. Here is how the 100 points are distributed:
            </p>

            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm">
                <span className="font-medium text-neutral-700">Industry</span>
                <span className="font-bold text-indigo-600">30%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="font-medium text-neutral-700">Stage</span>
                <span className="font-bold text-indigo-600">20%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="font-medium text-neutral-700">Ticket Fit</span>
                <span className="font-bold text-indigo-600">20%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="font-medium text-neutral-700">Region</span>
                <span className="font-bold text-indigo-600">15%</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="font-medium text-neutral-700">Risk Fit</span>
                <span className="font-bold text-indigo-600">15%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
