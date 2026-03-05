import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { motion } from "motion/react";
import { BookmarkMinus, ShieldCheck } from "lucide-react";

export default function InvestorSaved() {
  const { currentUser, startups, saved, unsaveStartup, language } = useStore();
  const t = useTranslation(language);

  const mySaved = saved.filter((s) => s.investorUserId === currentUser?.id);
  const savedStartups = mySaved
    .map((s) => startups.find((st) => st.id === s.startupId))
    .filter(Boolean) as typeof startups;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          {t.savedStartups}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedStartups.map((startup) => (
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
                <button
                  onClick={() => unsaveStartup(startup.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition"
                  title="Remove from saved"
                >
                  <BookmarkMinus className="w-5 h-5" />
                </button>
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
                <Link
                  to={`/investor/startup/${startup.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  {t.view}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
        {savedStartups.length === 0 && (
          <div className="col-span-full p-12 text-center text-neutral-500 bg-white rounded-2xl border border-neutral-200">
            You haven't saved any startups yet.
          </div>
        )}
      </div>
    </motion.div>
  );
}
