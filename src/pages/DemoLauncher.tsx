import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { motion } from "motion/react";
import { Rocket, Briefcase, ShieldCheck, Mic2 } from "lucide-react";

export default function DemoLauncher() {
  const { login, setRole, language } = useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const handleDemo = (
    email: string,
    role: "startup" | "investor" | "admin" | "pitchroom",
    route: string,
  ) => {
    login(email);
    setRole(role);
    navigate(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
          Demo Launcher
        </h1>
        <p className="text-xl text-neutral-600">
          Choose a role to explore InvestLink Learning Lab.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() =>
            handleDemo("investor@demo.com", "investor", "/investor/matches")
          }
          className="flex flex-col items-center p-8 bg-white border-2 border-indigo-100 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition group"
        >
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Demo Investor
          </h2>
          <p className="text-neutral-500 text-center">
            Auto-loads preferences and shows the matching engine.
          </p>
        </button>

        <button
          onClick={() =>
            handleDemo("startup@demo.com", "startup", "/startup/dashboard")
          }
          className="flex flex-col items-center p-8 bg-white border-2 border-emerald-100 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition group"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Demo Startup
          </h2>
          <p className="text-neutral-500 text-center">
            Manage your profile, verification, and requests.
          </p>
        </button>

        <button
          onClick={() => handleDemo("admin@demo.com", "admin", "/admin/panel")}
          className="flex flex-col items-center p-8 bg-white border-2 border-neutral-200 rounded-2xl hover:border-neutral-500 hover:shadow-lg transition group"
        >
          <div className="w-16 h-16 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Demo Admin
          </h2>
          <p className="text-neutral-500 text-center">
            Verify startups and manage the platform.
          </p>
        </button>

        <button
          onClick={() =>
            handleDemo("startup@demo.com", "pitchroom", "/pitchroom/setup")
          }
          className="flex flex-col items-center p-8 bg-white border-2 border-amber-100 rounded-2xl hover:border-amber-500 hover:shadow-lg transition group"
        >
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Mic2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Demo Pitch Room
          </h2>
          <p className="text-neutral-500 text-center">
            Practice your pitch with AI investors and get feedback.
          </p>
        </button>
      </div>
    </motion.div>
  );
}
