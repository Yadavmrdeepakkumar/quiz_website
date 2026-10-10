/**
 * App.jsx — Root Application Component
 * ─────────────────────────────────────────────
 * Defines the route map and wraps everything in
 * the global ToastProvider and dark-mode aware shell.
 */

import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { ToastProvider } from "./components/Toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPlayPage from "./pages/QuizPlayPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";

export default function App() {
  const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith("/admin");

  return (
    <ToastProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_30%),radial-gradient(circle_at_100%_0%,_rgba(236,72,153,0.14),_transparent_28%)] font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),radial-gradient(circle_at_100%_0%,_rgba(236,72,153,0.16),_transparent_28%)] dark:text-gray-100">
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quizzes" element={<PrivateRoute><QuizzesPage /></PrivateRoute>} />
          <Route path="/quiz/:id" element={<PrivateRoute><QuizPlayPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </ToastProvider>
  );
}
