/**
 * LoginPage.jsx — User Login
 * ─────────────────────────────────────────────
 * Glassmorphism login card with Student / Admin role
 * toggle, email + password validation, eye-toggle,
 * loading spinner, and toast feedback.
 * (Uses white-on-gradient — no dark: overrides needed.)
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── helpers ── */
  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const touch = (field) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Must be at least 6 characters";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ email: true, password: true });

    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors before submitting", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      toast(
        `Welcome back, ${data.user?.name || "User"}!`,
        "success"
      );
      navigate("/quizzes");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  const fieldErr = (f) => touched[f] && errors[f];

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-12">
      {/* ── Animated gradient bg ── */}
      <div
        aria-hidden
        className="absolute inset-0 animate-gradient bg-[length:300%_300%] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-400/20 blur-3xl"
      />

      {/* ── Glass card ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-white/15 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        {/* brand */}
        <div className="mb-6 flex flex-col items-center">
          <Brain className="h-10 w-10 text-white" />
          <h1 className="mt-2 text-2xl font-extrabold text-white">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Sign in to your QuizMaster account
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/90">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                onBlur={touch("email")}
                className={`w-full rounded-xl border bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none backdrop-blur transition-all duration-200 focus:ring-2 ${
                  fieldErr("email")
                    ? "border-red-400 focus:ring-red-400/40"
                    : "border-white/20 focus:border-white/40 focus:ring-white/20"
                }`}
              />
            </div>
            {fieldErr("email") && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs font-medium text-red-300"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/90">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={set("password")}
                onBlur={touch("password")}
                className={`w-full rounded-xl border bg-white/10 py-3 pl-10 pr-11 text-sm text-white placeholder-white/40 outline-none backdrop-blur transition-all duration-200 focus:ring-2 ${
                  fieldErr("password")
                    ? "border-red-400 focus:ring-red-400/40"
                    : "border-white/20 focus:border-white/40 focus:ring-white/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErr("password") && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs font-medium text-red-300"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a
              href="#"
              className="text-xs font-medium text-white/70 transition-colors hover:text-white"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Link to register */}
        <p className="mt-6 text-center text-sm text-white/70">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-yellow-300"
          >
            Register
          </Link>
        </p>

        {/* Admin login link */}
        <div className="mt-4 text-center">
          <Link
            to="/admin-login"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
