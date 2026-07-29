/**
 * AdminLoginPage.jsx — Separate Admin Login
 * ─────────────────────────────────────────────
 * A dedicated admin login page with a professional
 * dark design, separate from the student login flow.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const touch = (field) => () => setTouched((p) => ({ ...p, [field]: true }));

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Must be at least 6 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ email: true, password: true });
    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      if (data.user?.role !== "admin") {
        toast("Access denied. Admin credentials required.", "error");
        return;
      }
      toast(`Welcome, ${data.user?.name || "Admin"}!`, "success");
      navigate("/admin");
    } catch (err) {
      toast(err.response?.data?.message || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  const fieldErr = (f) => touched[f] && errors[f];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950 px-4 py-12">
      {/* Background effects */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-3xl" />
      
      {/* Grid pattern */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 ring-1 ring-indigo-500/20">
              <ShieldCheck className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Portal</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Secure login for administrators only
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  placeholder="admin@quizmaster.com"
                  value={form.email}
                  onChange={set("email")}
                  onBlur={touch("email")}
                  className={`w-full rounded-xl border bg-gray-800/50 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-2 ${
                    fieldErr("email")
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
              </div>
              {fieldErr("email") && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-400">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  onBlur={touch("password")}
                  className={`w-full rounded-xl border bg-gray-800/50 py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-2 ${
                    fieldErr("password")
                      ? "border-red-500/50 focus:ring-red-500/20"
                      : "border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-gray-400"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErr("password") && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Sign In as Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-gray-800 pt-5 text-center">
            <p className="text-xs text-gray-600">
              Student?{" "}
              <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
