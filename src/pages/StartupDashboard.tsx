import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Edit3,
  Send,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";

export default function StartupDashboard() {
  const {
    currentUser,
    startups,
    investors,
    requests,
    language,
    submitForVerification,
  } = useStore();
  const t = useTranslation(language);

  const profile = startups.find((s) => s.ownerUserId === currentUser?.id);
  const completeness = profile?.profileCompleteness || 0;
  const status = profile?.verificationStatus || "unverified";
  const myRequests = requests.filter((r) => r.startupId === profile?.id);

  const StatusIcon = {
    unverified: AlertCircle,
    pending: Clock,
    verified: CheckCircle,
    rejected: XCircle,
  }[status];

  const statusColors = {
    unverified: "text-amber-600 bg-amber-50 border-amber-200",
    pending: "text-blue-600 bg-blue-50 border-blue-200",
    verified: "text-emerald-600 bg-emerald-50 border-emerald-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
  };

  // Simple suggested investors logic
  const suggestedInvestors = investors
    .filter((inv) => {
      if (!profile) return false;
      const industryMatch =
        inv.preferredIndustries.includes(profile.industry) ||
        inv.preferredIndustries.includes("Other");
      const ticketMatch =
        profile.fundingNeeded >= inv.ticketMin &&
        profile.fundingNeeded <= inv.ticketMax;
      return industryMatch && ticketMatch;
    })
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.profileCompleteness}
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-light text-neutral-900">
              {completeness}%
            </span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.verificationStatus}
          </h3>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusColors[status]}`}
          >
            <StatusIcon className="w-5 h-5" />
            <span className="font-medium capitalize">{t[status]}</span>
          </div>
          {profile?.verificationNote && status === "rejected" && (
            <p className="mt-4 text-sm text-red-600">
              {profile.verificationNote}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
            {t.quickActions}
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/startup/profile"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-emerald-600 transition p-2 rounded-lg hover:bg-emerald-50"
            >
              <Edit3 className="w-4 h-4" /> {t.editProfile}
            </Link>
            <button
              onClick={() => profile && submitForVerification(profile.id)}
              disabled={
                completeness < 80 ||
                status === "pending" ||
                status === "verified"
              }
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-emerald-600 transition p-2 rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" /> {t.submitVerification}
            </button>
            <Link
              to="/startup/requests"
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-emerald-600 transition p-2 rounded-lg hover:bg-emerald-50"
            >
              <MessageSquare className="w-4 h-4" /> {t.viewRequests} (
              {myRequests.length})
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200">
          <h3 className="text-lg font-bold text-neutral-900">
            {t.suggestedInvestors}
          </h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {suggestedInvestors.length > 0 ? (
            suggestedInvestors.map((inv) => {
              const invUser = useStore
                .getState()
                .users.find((u) => u.id === inv.ownerUserId);
              return (
                <div
                  key={inv.id}
                  className="p-6 flex items-center justify-between hover:bg-neutral-50 transition"
                >
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      {invUser?.name || "Investor"}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      Ticket: €{inv.ticketMin.toLocaleString()} - €
                      {inv.ticketMax.toLocaleString()} • {inv.investorType}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {inv.preferredIndustries.slice(0, 3).map((ind) => (
                        <span
                          key={ind}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition">
                    {t.inviteToView}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-neutral-500">
              Complete your profile to see suggested investors.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
