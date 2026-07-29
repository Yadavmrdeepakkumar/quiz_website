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
      {/* Main shell — responds to .dark class on <html> */}
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
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
