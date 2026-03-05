import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { motion } from "motion/react";
import {
  FileText,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Award,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";

export default function PitchRoomReport() {
  const { pitchRoomSession, updatePitchRoomSession, startups } = useStore();
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!pitchRoomSession) {
      navigate("/pitchroom/setup");
      return;
    }

    if (
      pitchRoomSession.isComplete &&
      !pitchRoomSession.feedbackSections &&
      !isGenerating
    ) {
      generateReport();
    }
  }, [pitchRoomSession, isGenerating, navigate]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const context =
        pitchRoomSession?.customPitchText ||
        startups.find((s) => s.id === pitchRoomSession?.startupId)
          ?.shortPitch ||
        "";
      const qaLogText =
        pitchRoomSession?.qaLog
          .map(
            (log) =>
              `Q: ${log.question}\nA: ${log.answer}\nScore: ${log.score}`,
          )
          .join("\n\n") || "";

      const prompt = `You are an expert startup coach. Review this pitch session.
Context: ${context}
Q&A Log:
${qaLogText}

Generate a final report matching this JSON schema:
1. finalScore: 0-100 based on overall performance.
2. strengths: 3-5 bullet points.
3. gaps: 3-5 bullet points (weaknesses).
4. nextSteps: 3-5 bullet points (improvements).
5. pitchSummary: A one-page copy-ready text summarizing their pitch (One-liner, Problem/Solution, Market, Business Model, Traction, Ask, Risks).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              finalScore: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              pitchSummary: { type: Type.STRING },
            },
            required: [
              "finalScore",
              "strengths",
              "gaps",
              "nextSteps",
              "pitchSummary",
            ],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");

      updatePitchRoomSession({
        finalScore: result.finalScore || 75,
        feedbackSections: {
          strengths: result.strengths || [
            "Good energy",
            "Clear problem statement",
          ],
          gaps: result.gaps || [
            "Lacked specific metrics",
            "Vague go-to-market",
          ],
          nextSteps: result.nextSteps || [
            "Define CAC/LTV",
            "Clarify target audience",
          ],
        },
        generatedPitchSummary: result.pitchSummary || "Here is your summary...",
      });
    } catch (err) {
      console.error("Error generating report:", err);
      // Fallback
      const avgScore =
        pitchRoomSession?.qaLog.reduce((acc, curr) => acc + curr.score, 0) || 0;
      const finalScore = Math.round(
        (avgScore / (pitchRoomSession?.qaLog.length || 1)) * 10,
      );

      updatePitchRoomSession({
        finalScore,
        feedbackSections: {
          strengths: [
            "Clear communication",
            "Good understanding of the problem space",
          ],
          gaps: [
            "Needs more concrete data points",
            "Competitive differentiation is weak",
          ],
          nextSteps: [
            "Quantify your traction",
            "Develop a clearer go-to-market strategy",
          ],
        },
        generatedPitchSummary:
          "One-liner: We solve X for Y.\n\nProblem: ...\n\nSolution: ...\n\nAsk: €500k for 18 months runway.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (pitchRoomSession?.generatedPitchSummary) {
      navigator.clipboard.writeText(pitchRoomSession.generatedPitchSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!pitchRoomSession || isGenerating || !pitchRoomSession.feedbackSections) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <h2 className="text-2xl font-bold text-neutral-900">
          Generating Your Report...
        </h2>
        <p className="text-neutral-500">
          Analyzing your answers and crafting feedback.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 text-amber-600 rounded-full mb-4">
          <Award className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-neutral-900 font-sans">
          Pitch Session Complete
        </h1>
        <p className="text-xl text-neutral-600">
          Here is your performance breakdown and feedback.
        </p>
        <div className="text-6xl font-black text-amber-500 mt-4">
          {pitchRoomSession.finalScore}
          <span className="text-2xl text-neutral-400">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Strengths
          </h3>
          <ul className="space-y-2">
            {pitchRoomSession.feedbackSections.strengths.map((s, i) => (
              <li
                key={i}
                className="text-sm text-emerald-800 flex items-start gap-2"
              >
                <span className="text-emerald-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" /> Gaps
          </h3>
          <ul className="space-y-2">
            {pitchRoomSession.feedbackSections.gaps.map((s, i) => (
              <li
                key={i}
                className="text-sm text-red-800 flex items-start gap-2"
              >
                <span className="text-red-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-indigo-600" /> Next Steps
          </h3>
          <ul className="space-y-2">
            {pitchRoomSession.feedbackSections.nextSteps.map((s, i) => (
              <li
                key={i}
                className="text-sm text-indigo-800 flex items-start gap-2"
              >
                <span className="text-indigo-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 mt-8">
        <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
          <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" /> Pitch Summary
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Copy Text"}
          </button>
        </div>
        <div className="prose prose-neutral max-w-none whitespace-pre-wrap text-neutral-700 leading-relaxed">
          {pitchRoomSession.generatedPitchSummary}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => navigate("/pitchroom/setup")}
          className="px-8 py-4 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 transition shadow-md"
        >
          Start New Session
        </button>
      </div>
    </motion.div>
  );
}
