import { Outlet, Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTranslation } from "../i18n";
import { LogOut, User as UserIcon, Globe } from "lucide-react";

export default function Layout() {
  const { currentUser, currentRole, language, setLanguage, logout, setRole } =
    useStore();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "ES" ? "EN" : "ES");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-2xl font-bold tracking-tight text-emerald-600"
              >
                InvestLink
              </Link>

              {currentRole && (
                <nav className="hidden md:flex gap-6">
                  {currentRole === "startup" && (
                    <>
                      <Link
                        to="/startup/dashboard"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/startup/profile"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/startup/requests"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Requests
                      </Link>
                    </>
                  )}
                  {currentRole === "investor" && (
                    <>
                      <Link
                        to="/investor/dashboard"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/investor/browse"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Browse
                      </Link>
                      <Link
                        to="/investor/matches"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Matches
                      </Link>
                      <Link
                        to="/investor/saved"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Saved
                      </Link>
                      <Link
                        to="/investor/requests"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Requests
                      </Link>
                    </>
                  )}
                  {currentRole === "admin" && (
                    <>
                      <Link
                        to="/admin/panel"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Admin Panel
                      </Link>
                    </>
                  )}
                  {currentRole === "pitchroom" && (
                    <>
                      <Link
                        to="/pitchroom/setup"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Setup
                      </Link>
                      <Link
                        to="/pitchroom/session"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Session
                      </Link>
                      <Link
                        to="/pitchroom/report"
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                      >
                        Report
                      </Link>
                    </>
                  )}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">
                  {t.demoMode}
                </div>
              )}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                <Globe className="w-4 h-4" />
                {language}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-neutral-500 capitalize">
                      {currentRole}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-neutral-400 hover:text-neutral-600"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/auth"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 px-3 py-2"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/auth"
                    className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    {t.signup}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
