import { useState } from "react";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { motion } from "motion/react";
import {
  ShieldCheck,
  XCircle,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export default function AdminPanel() {
  const {
    startups,
    adminLogs,
    users,
    adminVerifyStartup,
    adminRejectStartup,
    adminHideStartup,
    language,
  } = useStore();
  const t = useTranslation(language);

  const pendingStartups = startups.filter(
    (s) => s.verificationStatus === "pending",
  );
  const allStartups = [...startups].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [actionType, setActionType] = useState<"verify" | "reject" | null>(
    null,
  );

  const handleAction = () => {
    if (selectedStartupId && actionType && note) {
      if (actionType === "verify") adminVerifyStartup(selectedStartupId, note);
      if (actionType === "reject") adminRejectStartup(selectedStartupId, note);
      setSelectedStartupId(null);
      setNote("");
      setActionType(null);
    }
  };

  const StatusIcon = {
    unverified: AlertCircle,
    pending: Clock,
    verified: CheckCircle,
    rejected: XCircle,
  };

  const statusColors = {
    unverified: "text-amber-600 bg-amber-50 border-amber-200",
    pending: "text-blue-600 bg-blue-50 border-blue-200",
    verified: "text-emerald-600 bg-emerald-50 border-emerald-200",
    rejected: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-neutral-900 font-sans">
          {t.adminPanel}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> {t.pendingReview} (
              {pendingStartups.length})
            </h2>
            <div className="divide-y divide-neutral-100">
              {pendingStartups.map((startup) => (
                <div
                  key={startup.id}
                  className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      {startup.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {startup.industry} • {startup.country} • {startup.stage}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Submitted:{" "}
                      {format(new Date(startup.updatedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStartupId(startup.id);
                        setActionType("verify");
                      }}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-medium transition flex items-center gap-1"
                    >
                      <ShieldCheck className="w-4 h-4" /> {t.verify}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStartupId(startup.id);
                        setActionType("reject");
                      }}
                      className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> {t.reject}
                    </button>
                  </div>
                </div>
              ))}
              {pendingStartups.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  No startups pending review.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              All Startups
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-lg">
                      Name
                    </th>
                    <th className="px-4 py-3 font-medium">Industry</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Published</th>
                    <th className="px-4 py-3 font-medium rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {allStartups.map((startup) => {
                    const Icon = StatusIcon[startup.verificationStatus];
                    return (
                      <tr
                        key={startup.id}
                        className="hover:bg-neutral-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-neutral-900">
                          {startup.name}
                        </td>
                        <td className="px-4 py-3">{startup.industry}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusColors[startup.verificationStatus]}`}
                          >
                            <Icon className="w-3 h-3" />{" "}
                            <span className="capitalize">
                              {startup.verificationStatus}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {startup.published ? (
                            <span className="text-emerald-600">Yes</span>
                          ) : (
                            <span className="text-neutral-400">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => adminHideStartup(startup.id)}
                            disabled={!startup.published}
                            className="text-neutral-500 hover:text-amber-600 transition disabled:opacity-50"
                            title="Hide from public browse"
                          >
                            <EyeOff className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {t.moderationLog}
            </h2>
            <div className="space-y-4">
              {adminLogs.slice(0, 10).map((log) => {
                const admin = users.find((u) => u.id === log.adminUserId);
                const startup = startups.find((s) => s.id === log.startupId);
                return (
                  <div
                    key={log.id}
                    className="text-sm border-l-2 pl-3 py-1 border-neutral-200"
                  >
                    <p className="font-medium text-neutral-900 capitalize">
                      {log.actionType}{" "}
                      <span className="font-normal text-neutral-500">by</span>{" "}
                      {admin?.name}
                    </p>
                    <p className="text-neutral-600 mt-0.5">
                      Target: {startup?.name}
                    </p>
                    <p className="text-neutral-500 italic mt-0.5">
                      "{log.note}"
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {format(new Date(log.timestamp), "MMM d, HH:mm")}
                    </p>
                  </div>
                );
              })}
              {adminLogs.length === 0 && (
                <div className="text-center py-4 text-neutral-500 text-sm">
                  No actions logged yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedStartupId && actionType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 capitalize">
              {actionType} Startup
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Reason / Note *
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder={
                    actionType === "verify"
                      ? "e.g., Business registration confirmed."
                      : "e.g., Missing legal documents."
                  }
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedStartupId(null);
                    setActionType(null);
                    setNote("");
                  }}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={!note.trim()}
                  className={`px-4 py-2 text-white rounded-lg font-medium transition disabled:opacity-50 ${actionType === "verify" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
