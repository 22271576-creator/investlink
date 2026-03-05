import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { Rocket, Briefcase, Shield } from "lucide-react";
import { motion } from "motion/react";
import { Role } from "../types";

export default function RoleSelection() {
  const { setRole, language } = useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const handleSelectRole = (role: Role) => {
    setRole(role);
    if (role === "startup") navigate("/startup/dashboard");
    if (role === "investor") navigate("/investor/dashboard");
    if (role === "admin") navigate("/admin/panel");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-16"
    >
      <h2 className="text-4xl font-extrabold text-center mb-12 text-neutral-900 font-sans">
        {t.chooseRole}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <button
          onClick={() => handleSelectRole("startup")}
          className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Rocket className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-neutral-900">
            {t.roleStartup}
          </h3>
          <p className="text-neutral-500">
            Create a profile, get verified, and connect with top investors.
          </p>
        </button>

        <button
          onClick={() => handleSelectRole("investor")}
          className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-indigo-500 hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-neutral-900">
            {t.roleInvestor}
          </h3>
          <p className="text-neutral-500">
            Set preferences, browse verified startups, and find your next deal.
          </p>
        </button>

        <button
          onClick={() => handleSelectRole("admin")}
          className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 hover:border-amber-500 hover:shadow-md transition flex flex-col items-center text-center group"
        >
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Shield className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-neutral-900">
            {t.roleAdmin}
          </h3>
          <p className="text-neutral-500">
            Verify startups, moderate content, and manage the platform.
          </p>
        </button>
      </div>
    </motion.div>
  );
}
