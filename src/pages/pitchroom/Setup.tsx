import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { motion } from "motion/react";
import { Mic2, Settings, Users } from "lucide-react";
import { PersonaInvestor } from "../../types";

export default function PitchRoomSetup() {
  const { startups, startPitchRoomSession } = useStore();
  const navigate = useNavigate();

  const [inputType, setInputType] = useState<"startup" | "custom">("startup");
  const [selectedStartupId, setSelectedStartupId] = useState(
    startups[0]?.id || "",
  );
  const [customPitchText, setCustomPitchText] = useState("");
  const [persona, setPersona] = useState<PersonaInvestor>("Skeptical VC");
  const [rounds, setRounds] = useState(5);

  const handleStart = () => {
    startPitchRoomSession(
      inputType === "startup" ? selectedStartupId : undefined,
      inputType === "custom" ? customPitchText : undefined,
      persona,
      rounds,
    );
    navigate("/pitchroom/session");
  };

  const isReady =
    inputType === "startup"
      ? !!selectedStartupId
      : customPitchText.trim().length > 50;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4 border-b border-neutral-200 pb-6">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
          <Mic2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-sans">
            Pitch Room Setup
          </h1>
          <p className="text-neutral-500">
            Configure your AI investor simulation.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-neutral-400" /> 1. What are you
            pitching?
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setInputType("startup")}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition ${inputType === "startup" ? "border-amber-500 bg-amber-50" : "border-neutral-200 hover:border-neutral-300"}`}
            >
              <h3 className="font-bold text-neutral-900">
                Existing Startup Profile
              </h3>
              <p className="text-sm text-neutral-500">
                Use data from a platform startup.
              </p>
            </button>
            <button
              onClick={() => setInputType("custom")}
              className={`flex-1 p-4 rounded-xl border-2 text-left transition ${inputType === "custom" ? "border-amber-500 bg-amber-50" : "border-neutral-200 hover:border-neutral-300"}`}
            >
              <h3 className="font-bold text-neutral-900">Custom Pitch Text</h3>
              <p className="text-sm text-neutral-500">
                Paste your raw pitch script.
              </p>
            </button>
          </div>

          {inputType === "startup" ? (
            <select
              value={selectedStartupId}
              onChange={(e) => setSelectedStartupId(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {startups.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.industry})
                </option>
              ))}
            </select>
          ) : (
            <textarea
              value={customPitchText}
              onChange={(e) => setCustomPitchText(e.target.value)}
              placeholder="Paste your pitch here (min 50 characters)..."
              rows={6}
              className="w-full p-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-neutral-400" /> 2. Choose Investor
            Persona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                "Skeptical VC",
                "Friendly Angel",
                "Corporate VC",
              ] as PersonaInvestor[]
            ).map((p) => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={`p-4 rounded-xl border-2 text-center transition ${persona === p ? "border-amber-500 bg-amber-50" : "border-neutral-200 hover:border-neutral-300"}`}
              >
                <div className="font-bold text-neutral-900">{p}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {p === "Skeptical VC" &&
                    "Hard questions, focuses on risks & metrics."}
                  {p === "Friendly Angel" &&
                    "Coaching tone, focuses on team & vision."}
                  {p === "Corporate VC" &&
                    "Strategic fit, focuses on market & tech."}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-neutral-400" /> 3. Session Length
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setRounds(5)}
              className={`flex-1 py-3 rounded-xl border-2 text-center font-bold transition ${rounds === 5 ? "border-amber-500 bg-amber-50 text-amber-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}
            >
              5 Questions (Standard)
            </button>
            <button
              onClick={() => setRounds(7)}
              className={`flex-1 py-3 rounded-xl border-2 text-center font-bold transition ${rounds === 7 ? "border-amber-500 bg-amber-50 text-amber-700" : "border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}
            >
              7 Questions (Deep Dive)
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200 flex justify-end">
          <button
            onClick={handleStart}
            disabled={!isReady}
            className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            Start Pitch Session
          </button>
        </div>
      </div>
    </motion.div>
  );
}
