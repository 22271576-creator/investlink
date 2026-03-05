import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic2,
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";

export default function PitchRoomSession() {
  const { pitchRoomSession, updatePitchRoomSession, startups } = useStore();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pitchRoomSession) {
      navigate("/pitchroom/setup");
      return;
    }
    if (
      pitchRoomSession.qaLog.length === 0 &&
      !currentQuestion &&
      !isGeneratingQuestion
    ) {
      generateQuestion();
    }
  }, [pitchRoomSession, currentQuestion, isGeneratingQuestion, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [
    pitchRoomSession?.qaLog,
    currentQuestion,
    isGeneratingQuestion,
    isEvaluating,
  ]);

  const getContext = () => {
    if (!pitchRoomSession) return "";
    if (pitchRoomSession.customPitchText)
      return `Pitch text: ${pitchRoomSession.customPitchText}`;
    const startup = startups.find((s) => s.id === pitchRoomSession.startupId);
    if (!startup) return "";
    return `Startup Name: ${startup.name}\nIndustry: ${startup.industry}\nStage: ${startup.stage}\nPitch: ${startup.shortPitch}\nProblem: ${startup.problem}\nSolution: ${startup.solution}\nBusiness Model: ${startup.businessModel}`;
  };

  const generateQuestion = async () => {
    setIsGeneratingQuestion(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const context = getContext();
      const persona = pitchRoomSession?.personaInvestor;
      const round = pitchRoomSession?.currentRound || 1;
      const previousQA =
        pitchRoomSession?.qaLog
          .map((log) => `Q: ${log.question}\nA: ${log.answer}`)
          .join("\n\n") || "None";

      const prompt = `You are a ${persona} investor listening to a startup pitch.
Context about the startup:
${context}

Previous Q&A in this session:
${previousQA}

This is question round ${round} of ${pitchRoomSession?.questionRounds}.
Ask a single, focused, challenging question based on the context and previous answers.
Do not repeat previous questions.
Keep it under 3 sentences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setCurrentQuestion(
        response.text || "Could you elaborate more on your business model?",
      );
    } catch (err) {
      console.error("Error generating question:", err);
      // Fallback
      const fallbacks = [
        "What is your primary customer acquisition strategy?",
        "How do you differentiate from existing competitors?",
        "Can you walk me through your unit economics?",
        "What are the biggest risks you face in the next 12 months?",
        "Why is your team the right one to solve this problem?",
      ];
      setCurrentQuestion(
        fallbacks[(pitchRoomSession?.currentRound || 1) % fallbacks.length],
      );
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim() || !pitchRoomSession) return;

    const submittedAnswer = answer;
    setAnswer("");
    setIsEvaluating(true);
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const context = getContext();
      const persona = pitchRoomSession.personaInvestor;

      const prompt = `You are a ${persona} investor evaluating a startup founder's answer.
Context: ${context}
Question asked: ${currentQuestion}
Founder's Answer: ${submittedAnswer}

Evaluate the answer. Provide:
1. A score from 0 to 10.
2. 2-3 bullet points of evaluation (what was good, what was missing).
3. A better, more structured way to answer this question (1 paragraph).

Return JSON matching this schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              evaluation: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestion: { type: Type.STRING },
            },
            required: ["score", "evaluation", "suggestion"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");

      const newLog = {
        question: currentQuestion,
        answer: submittedAnswer,
        evaluation: result.evaluation || [
          "Good attempt.",
          "Lacked specific metrics.",
        ],
        suggestion:
          result.suggestion || "Try to be more specific and data-driven.",
        score: result.score || 7,
      };

      const newQaLog = [...pitchRoomSession.qaLog, newLog];
      const isComplete =
        pitchRoomSession.currentRound >= pitchRoomSession.questionRounds;

      updatePitchRoomSession({
        qaLog: newQaLog,
        currentRound: pitchRoomSession.currentRound + 1,
        isComplete,
      });

      if (isComplete) {
        navigate("/pitchroom/report");
      } else {
        setCurrentQuestion("");
        generateQuestion();
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
      // Fallback
      const newLog = {
        question: currentQuestion,
        answer: submittedAnswer,
        evaluation: ["Clear response.", "Could use more specific data points."],
        suggestion:
          "Always tie your answers back to core metrics or specific customer examples.",
        score: 7,
      };

      const newQaLog = [...pitchRoomSession.qaLog, newLog];
      const isComplete =
        pitchRoomSession.currentRound >= pitchRoomSession.questionRounds;

      updatePitchRoomSession({
        qaLog: newQaLog,
        currentRound: pitchRoomSession.currentRound + 1,
        isComplete,
      });

      if (isComplete) {
        navigate("/pitchroom/report");
      } else {
        setCurrentQuestion("");
        generateQuestion();
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!pitchRoomSession) return null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[85vh]">
      <div className="flex items-center justify-between bg-white p-4 rounded-t-2xl border border-neutral-200 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-neutral-900">Pitch Room Simulator</h1>
            <p className="text-xs text-neutral-500">
              Persona: {pitchRoomSession.personaInvestor}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-600">Round</span>
          <span className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full font-bold text-sm">
            {Math.min(
              pitchRoomSession.currentRound,
              pitchRoomSession.questionRounds,
            )}{" "}
            / {pitchRoomSession.questionRounds}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 border-x border-neutral-200 p-6 space-y-8">
        {pitchRoomSession.qaLog.map((log, index) => (
          <div key={index} className="space-y-6">
            {/* Investor Question */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-neutral-200 max-w-[80%]">
                <p className="text-neutral-900 font-medium">{log.question}</p>
              </div>
            </div>

            {/* Founder Answer */}
            <div className="flex gap-4 justify-end">
              <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[80%]">
                <p>{log.answer}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                <UserIcon className="w-5 h-5" />
              </div>
            </div>

            {/* AI Evaluation */}
            <div className="flex justify-center">
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl max-w-2xl w-full shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-600" /> Feedback
                  </h4>
                  <span className="px-3 py-1 bg-white text-amber-700 font-bold rounded-full border border-amber-200 text-sm">
                    Score: {log.score}/10
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {log.evaluation.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-amber-800"
                    >
                      <span className="text-amber-500 mt-0.5">•</span> {point}
                    </li>
                  ))}
                </ul>
                <div className="bg-white p-4 rounded-xl border border-amber-100">
                  <h5 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Better Answer
                  </h5>
                  <p className="text-sm text-neutral-700 italic">
                    "{log.suggestion}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Current Question Loading */}
        {isGeneratingQuestion && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-neutral-200 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span className="text-neutral-500 text-sm italic">
                Investor is thinking...
              </span>
            </div>
          </div>
        )}

        {/* Current Question */}
        {!isGeneratingQuestion && currentQuestion && !isEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-neutral-200 max-w-[80%]">
              <p className="text-neutral-900 font-medium">{currentQuestion}</p>
            </div>
          </motion.div>
        )}

        {/* Evaluating State */}
        {isEvaluating && (
          <div className="flex justify-center">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <span className="text-amber-800 text-sm font-medium">
                Analyzing your answer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 rounded-b-2xl border border-neutral-200 shadow-sm z-10">
        <div className="flex gap-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isGeneratingQuestion || isEvaluating || !currentQuestion}
            placeholder="Type your answer here..."
            rows={3}
            className="flex-1 p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none disabled:bg-neutral-50 disabled:cursor-not-allowed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAnswerSubmit();
              }
            }}
          />
          <button
            onClick={handleAnswerSubmit}
            disabled={
              !answer.trim() ||
              isGeneratingQuestion ||
              isEvaluating ||
              !currentQuestion
            }
            className="px-6 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-neutral-400 text-center mt-2">
          Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
