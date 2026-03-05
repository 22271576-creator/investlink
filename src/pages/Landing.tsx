import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { ShieldCheck, Target, FileText, Play, Mic2 } from "lucide-react";
import { motion } from "motion/react";

export default function Landing() {
  const { language } = useStore();
  const t = useTranslation(language);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 mb-6 font-sans">
        InvestLink <span className="text-emerald-600">Learning Lab</span>
      </h1>
      <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-2xl">
        {t.heroDesc}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link
          to="/auth"
          className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg hover:bg-emerald-700 transition shadow-md"
        >
          {t.login}
        </Link>
        <Link
          to="/demo"
          className="px-8 py-4 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-semibold text-lg hover:bg-neutral-50 transition shadow-sm"
        >
          {t.viewDemo}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full mb-16">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t.feat1}</h3>
          <p className="text-neutral-500">{t.feat1Desc}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t.feat2}</h3>
          <p className="text-neutral-500">{t.feat2Desc}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t.feat3}</h3>
          <p className="text-neutral-500">{t.feat3Desc}</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-emerald-500 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            NEW
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Mic2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{t.feat4}</h3>
          <p className="text-neutral-500">{t.feat4Desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
