import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { calculateMatch } from "../utils/matching";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Send,
  AlertCircle,
  TrendingUp,
  Users,
  MapPin,
  Target,
  FileText,
  Activity,
} from "lucide-react";

export default function StartupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentUser,
    startups,
    investors,
    saved,
    saveStartup,
    unsaveStartup,
    createRequest,
    language,
  } = useStore();
  const t = useTranslation(language);

  const startup = startups.find((s) => s.id === id);
  const profile = investors.find((i) => i.ownerUserId === currentUser?.id);
  const mySaved = saved.filter((s) => s.investorUserId === currentUser?.id);
  const isSaved = mySaved.find((s) => s.startupId === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("Intro call");

  if (!startup) {
    return (
      <div className="text-center py-20 text-neutral-500">
        Startup not found.
      </div>
    );
  }

  const match = profile ? calculateMatch(profile, startup) : null;

  const handleSaveToggle = () => {
    if (isSaved) unsaveStartup(startup.id);
    else saveStartup(startup.id);
  };

  const handleRequest = () => {
    if (requestMessage) {
      createRequest(startup.id, requestMessage, requestPurpose);
      setIsModalOpen(false);
      navigate("/investor/requests");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 font-sans flex items-center gap-3">
            {startup.name}
            {startup.verificationStatus === "verified" && (
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-4 h-4" /> Verified
              </span>
            )}
          </h1>
          <p className="text-lg text-neutral-600 mt-2">{startup.shortPitch}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition ${isSaved ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"}`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
            {isSaved ? t.unsave : t.save}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Send className="w-5 h-5" /> Request Contact
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Target className="w-4 h-4" /> Industry
                </p>
                <p className="font-semibold text-neutral-900">
                  {startup.industry}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Stage
                </p>
                <p className="font-semibold text-neutral-900">
                  {startup.stage}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Location
                </p>
                <p className="font-semibold text-neutral-900">
                  {startup.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-4 h-4" /> Team
                </p>
                <p className="font-semibold text-neutral-900">
                  {startup.teamSize} ({startup.founderExperience})
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  The Problem
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  {startup.problem}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  The Solution
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  {startup.solution}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  Business Model
                </h3>
                <p className="text-neutral-700 leading-relaxed">
                  {startup.businessModel}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-500" /> Traction &
              Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 text-center">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  €{startup.traction.revenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 text-center">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  {startup.traction.mau?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 text-center">
                <p className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                  MoM Growth
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  +{startup.traction.momGrowth || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" /> Risk Profile
            </h2>
            <div className="flex flex-wrap gap-2">
              {startup.riskTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
              {startup.riskTags.length === 0 && (
                <span className="text-neutral-500">
                  No specific risks identified.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 sticky top-24">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
              Investment Ask
            </h3>
            <div className="mb-6">
              <p className="text-4xl font-bold text-emerald-600 mb-1">
                €{startup.fundingNeeded.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-neutral-600 uppercase tracking-wider">
                {startup.ticketType}
              </p>
            </div>

            {match && (
              <div className="pt-6 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                  Match Score
                  <span className="text-2xl font-bold text-indigo-600">
                    {match.totalScore}
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Industry</span>
                    <span className="font-semibold text-neutral-900">
                      {match.industryScore}/30
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.industryScore / 30) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Stage</span>
                    <span className="font-semibold text-neutral-900">
                      {match.stageScore}/20
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.stageScore / 20) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Ticket</span>
                    <span className="font-semibold text-neutral-900">
                      {match.ticketScore}/20
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.ticketScore / 20) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Region</span>
                    <span className="font-semibold text-neutral-900">
                      {match.regionScore}/15
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.regionScore / 15) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-600">Risk</span>
                    <span className="font-semibold text-neutral-900">
                      {match.riskScore}/15
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(match.riskScore / 15) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 mt-6 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                Documents
              </h3>
              <div className="space-y-3">
                <button
                  disabled={!startup.documents.pitchDeckUploaded}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <FileText className="w-4 h-4 text-emerald-500" /> Pitch Deck
                  </span>
                  <span className="text-xs text-neutral-400">
                    {startup.documents.pitchDeckUploaded
                      ? "Available"
                      : "Missing"}
                  </span>
                </button>
                <button
                  disabled={!startup.documents.financialsUploaded}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <FileText className="w-4 h-4 text-emerald-500" /> Financials
                  </span>
                  <span className="text-xs text-neutral-400">
                    {startup.documents.financialsUploaded
                      ? "Available"
                      : "Missing"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Request Contact
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Purpose
                </label>
                <select
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Intro call">Intro call</option>
                  <option value="Due diligence">Due diligence</option>
                  <option value="Investment discussion">
                    Investment discussion
                  </option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={4}
                  placeholder="Hi, I'm interested in learning more about your traction..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequest}
                  disabled={!requestMessage.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Send Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
