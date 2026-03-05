import { useState } from "react";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { motion } from "motion/react";
import { format } from "date-fns";
import { MessageSquare, Check, X, Send, Clock } from "lucide-react";

export default function Requests() {
  const {
    currentUser,
    currentRole,
    requests,
    startups,
    users,
    updateRequestStatus,
    addThreadMessage,
    language,
  } = useStore();
  const t = useTranslation(language);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");

  const myProfile = startups.find((s) => s.ownerUserId === currentUser?.id);

  const relevantRequests = requests
    .filter((r) => {
      if (currentRole === "startup") return r.startupId === myProfile?.id;
      if (currentRole === "investor")
        return r.investorUserId === currentUser?.id;
      return false;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);
  const relatedStartup = startups.find(
    (s) => s.id === selectedRequest?.startupId,
  );
  const relatedInvestor = users.find(
    (u) => u.id === selectedRequest?.investorUserId,
  );

  const handleReply = () => {
    if (replyText.trim() && selectedRequestId) {
      addThreadMessage(selectedRequestId, replyText);
      setReplyText("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]"
    >
      <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 font-sans">
            Requests
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {relevantRequests.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No requests found.
            </div>
          ) : (
            relevantRequests.map((req) => {
              const startup = startups.find((s) => s.id === req.startupId);
              const investor = users.find((u) => u.id === req.investorUserId);
              const otherParty =
                currentRole === "startup" ? investor?.name : startup?.name;

              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`w-full text-left p-4 transition hover:bg-neutral-50 ${selectedRequestId === req.id ? "bg-emerald-50 border-l-4 border-emerald-500" : "border-l-4 border-transparent"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-neutral-900 truncate">
                      {otherParty}
                    </span>
                    <span className="text-xs text-neutral-500 whitespace-nowrap">
                      {format(new Date(req.updatedAt), "MMM d")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600 truncate max-w-[150px]">
                      {req.purpose}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : req.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-200 flex flex-col overflow-hidden">
        {selectedRequest ? (
          <>
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {currentRole === "startup"
                    ? relatedInvestor?.name
                    : relatedStartup?.name}
                </h3>
                <p className="text-sm text-neutral-500">
                  Purpose: {selectedRequest.purpose}
                </p>
              </div>

              {currentRole === "startup" &&
                selectedRequest.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "accepted")
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-sm font-medium transition"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                    <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "rejected")
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
              {selectedRequest.threadMessages.map((msg, idx) => {
                const isMe = msg.fromRole === currentRole;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        isMe
                          ? "bg-emerald-600 text-white rounded-br-sm"
                          : "bg-neutral-100 text-neutral-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-xs text-neutral-400 mt-1">
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </span>
                  </div>
                );
              })}
            </div>

            {selectedRequest.status === "accepted" ? (
              <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReply()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : selectedRequest.status === "rejected" ? (
              <div className="p-4 border-t border-neutral-200 bg-red-50 text-center text-sm text-red-600 font-medium">
                This request was rejected.
              </div>
            ) : (
              <div className="p-4 border-t border-neutral-200 bg-amber-50 text-center text-sm text-amber-700 font-medium flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> Waiting for startup to accept the
                request.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p>Select a request to view details</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
