import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { calculateMatch } from "../utils/matching";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { Industry, Stage, Country } from "../types";

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

export default function InvestorBrowse() {
  const {
    currentUser,
    investors,
    startups,
    saved,
    saveStartup,
    unsaveStartup,
    language,
  } = useStore();
  const t = useTranslation(language);

  const profile = investors.find((i) => i.ownerUserId === currentUser?.id);
  const mySaved = saved.filter((s) => s.investorUserId === currentUser?.id);

  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<Industry | "">("");
  const [stageFilter, setStageFilter] = useState<Stage | "">("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    "score" | "fundingAsc" | "fundingDesc" | "newest"
  >("score");

  let results = startups.filter((s) => s.published);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.shortPitch.toLowerCase().includes(q),
    );
  }
  if (industryFilter) {
    results = results.filter((s) => s.industry === industryFilter);
  }
  if (stageFilter) {
    results = results.filter((s) => s.stage === stageFilter);
  }
  if (verifiedOnly) {
    results = results.filter((s) => s.verificationStatus === "verified");
  }

  const resultsWithScore = results.map((startup) => {
    const score = profile ? calculateMatch(profile, startup).totalScore : 0;
    return { startup, score };
  });

  resultsWithScore.sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "fundingAsc")
      return a.startup.fundingNeeded - b.startup.fundingNeeded;
    if (sortBy === "fundingDesc")
      return b.startup.fundingNeeded - a.startup.fundingNeeded;
    if (sortBy === "newest")
      return (
        new Date(b.startup.createdAt).getTime() -
        new Date(a.startup.createdAt).getTime()
      );
    return 0;
  });

  const handleSaveToggle = (startupId: string) => {
    if (mySaved.find((s) => s.startupId === startupId)) {
      unsaveStartup(startupId);
    } else {
      saveStartup(startupId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          {t.browseStartups}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.searchStartups}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-500" />
            <span className="text-sm font-medium text-neutral-700">
              {t.filters}:
            </span>
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value as Industry)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as Stage)}
            className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 cursor-pointer px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            {t.verifiedOnly}
          </label>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">
              {t.sortBy}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {profile && <option value="score">Match Score</option>}
              <option value="fundingAsc">Funding (Low to High)</option>
              <option value="fundingDesc">Funding (High to Low)</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resultsWithScore.map(({ startup, score }) => {
          const isSaved = mySaved.find((s) => s.startupId === startup.id);
          return (
            <motion.div
              key={startup.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      {startup.name}
                      {startup.verificationStatus === "verified" && (
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      )}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {startup.industry} • {startup.stage}
                    </p>
                  </div>
                  {profile && (
                    <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                      {score}
                    </div>
                  )}
                </div>

                <p className="text-neutral-700 mb-6 line-clamp-3 flex-1">
                  {startup.shortPitch}
                </p>

                <div className="flex justify-between items-end mt-auto pt-4 border-t border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                      Funding Needed
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      €{startup.fundingNeeded.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveToggle(startup.id)}
                      className={`p-2 rounded-lg border transition ${isSaved ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-neutral-300 text-neutral-400 hover:text-indigo-600"}`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                    <Link
                      to={`/investor/startup/${startup.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      {t.view}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        {resultsWithScore.length === 0 && (
          <div className="col-span-full p-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            No startups found matching your criteria.
          </div>
        )}
      </div>
    </motion.div>
  );
}
