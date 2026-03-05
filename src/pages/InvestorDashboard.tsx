import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import {
  Settings,
  Search,
  Star,
  Bookmark,
  Inbox,
  CheckCircle,
} from "lucide-react";
import { motion } from "motion/react";

export default function InvestorDashboard() {
  const { currentUser, investors, saved, requests, language } = useStore();
  const t = useTranslation(language);

  const profile = investors.find((i) => i.ownerUserId === currentUser?.id);
  const completeness = profile?.preferencesCompleteness || 0;
  const mySaved = saved.filter((s) => s.investorUserId === currentUser?.id);
  const myRequests = requests.filter(
    (r) => r.investorUserId === currentUser?.id,
  );
  const pendingRequests = myRequests.filter((r) => r.status === "pending");
  const acceptedRequests = myRequests.filter((r) => r.status === "accepted");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          Investor Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.preferencesCompleteness}
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-light text-neutral-900">
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.yourPipeline}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 flex flex-col items-center justify-center">
              <Bookmark className="w-5 h-5 text-indigo-500 mb-2" />
              <span className="text-2xl font-bold text-neutral-900">
                {mySaved.length}
              </span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">
                {t.savedCount}
              </span>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col items-center justify-center">
              <Inbox className="w-5 h-5 text-amber-500 mb-2" />
              <span className="text-2xl font-bold text-amber-900">
                {pendingRequests.length}
              </span>
              <span className="text-xs text-amber-700 uppercase tracking-wider">
                Pending
              </span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col items-center justify-center col-span-2">
              <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
              <span className="text-2xl font-bold text-emerald-900">
                {acceptedRequests.length}
              </span>
              <span className="text-xs text-emerald-700 uppercase tracking-wider">
                Accepted
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.quickActions}
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/investor/preferences"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
            >
              <Settings className="w-4 h-4" /> {t.editPreferences}
            </Link>
            <Link
              to="/investor/browse"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
            >
              <Search className="w-4 h-4" /> {t.browseStartups}
            </Link>
            <Link
              to="/investor/matches"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
            >
              <Star className="w-4 h-4" /> {t.viewMatches}
            </Link>
            <Link
              to="/investor/saved"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-indigo-600 transition p-2 rounded-lg hover:bg-indigo-50"
            >
              <Bookmark className="w-4 h-4" /> {t.savedStartups}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
