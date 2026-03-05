import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store/useStore";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import RoleSelection from "./pages/RoleSelection";
import StartupDashboard from "./pages/StartupDashboard";
import StartupProfileForm from "./pages/StartupProfileForm";
import Requests from "./pages/Requests";
import InvestorDashboard from "./pages/InvestorDashboard";
import InvestorPreferencesForm from "./pages/InvestorPreferencesForm";
import InvestorBrowse from "./pages/InvestorBrowse";
import InvestorMatches from "./pages/InvestorMatches";
import InvestorSaved from "./pages/InvestorSaved";
import StartupDetail from "./pages/StartupDetail";
import AdminPanel from "./pages/AdminPanel";
import DemoLauncher from "./pages/DemoLauncher";
import PitchRoomSetup from "./pages/pitchroom/Setup";
import PitchRoomSession from "./pages/pitchroom/Session";
import PitchRoomReport from "./pages/pitchroom/Report";

function ProtectedRoute({
  children,
  allowedRole,
}: {
  children: React.ReactNode;
  allowedRole?: "startup" | "investor" | "admin" | "pitchroom";
}) {
  const { currentUser, currentRole } = useStore();

  if (!currentUser) return <Navigate to="/auth" replace />;
  if (allowedRole && currentRole !== allowedRole) {
    if (currentRole === "startup")
      return <Navigate to="/startup/dashboard" replace />;
    if (currentRole === "investor")
      return <Navigate to="/investor/dashboard" replace />;
    if (currentRole === "admin") return <Navigate to="/admin/panel" replace />;
    if (currentRole === "pitchroom")
      return <Navigate to="/pitchroom/setup" replace />;
    return <Navigate to="/role" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="demo" element={<DemoLauncher />} />
          <Route path="auth" element={<Auth />} />
          <Route
            path="role"
            element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="startup/dashboard"
            element={
              <ProtectedRoute allowedRole="startup">
                <StartupDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="startup/profile"
            element={
              <ProtectedRoute allowedRole="startup">
                <StartupProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="startup/requests"
            element={
              <ProtectedRoute allowedRole="startup">
                <Requests />
              </ProtectedRoute>
            }
          />

          <Route
            path="investor/dashboard"
            element={
              <ProtectedRoute allowedRole="investor">
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/preferences"
            element={
              <ProtectedRoute allowedRole="investor">
                <InvestorPreferencesForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/browse"
            element={
              <ProtectedRoute allowedRole="investor">
                <InvestorBrowse />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/matches"
            element={
              <ProtectedRoute allowedRole="investor">
                <InvestorMatches />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/saved"
            element={
              <ProtectedRoute allowedRole="investor">
                <InvestorSaved />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/requests"
            element={
              <ProtectedRoute allowedRole="investor">
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="investor/startup/:id"
            element={
              <ProtectedRoute allowedRole="investor">
                <StartupDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin/panel"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/startups/:id"
            element={
              <ProtectedRoute allowedRole="admin">
                <StartupDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="pitchroom/setup"
            element={
              <ProtectedRoute allowedRole="pitchroom">
                <PitchRoomSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="pitchroom/session"
            element={
              <ProtectedRoute allowedRole="pitchroom">
                <PitchRoomSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="pitchroom/report"
            element={
              <ProtectedRoute allowedRole="pitchroom">
                <PitchRoomReport />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
