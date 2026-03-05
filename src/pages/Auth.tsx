import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { motion } from "motion/react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { login, language } = useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate("/role");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg border border-neutral-100"
    >
      <h2 className="text-3xl font-bold text-center mb-8 font-sans">
        {isLogin ? t.login : t.signup}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="Jane Doe"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition shadow-sm"
        >
          {isLogin ? t.login : t.signup}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </div>
    </motion.div>
  );
}
