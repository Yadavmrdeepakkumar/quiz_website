/**
 * RegisterPage.jsx — User Registration
 * ─────────────────────────────────────────────
 * Glassmorphism register card with name, email,
 * password + confirm fields, reusable InputField,
 * validation, and toast feedback.
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
  User,
  Loader2,
} from "lucide-react";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── helpers ── */
  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const touch = (field) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Must be at least 6 characters";
    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors before submitting", "error");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
      });
      toast("Account created successfully! You can now login.", "success");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  const fieldErr = (f) => touched[f] && errors[f];

  /* ── Reusable input renderer (plain function, not a component) ── */
  function renderField({ label, field, type = "text", placeholder, icon: Icon, isPassword, showToggle, onToggle }) {
    return (
      <div key={field}>
        <label className="mb-1.5 block text-sm font-medium text-white/90">
          {label}
        </label>
        <div className="relative">
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <input
            type={isPassword ? (showToggle ? "text" : "password") : type}
            placeholder={placeholder}
            value={form[field]}
            onChange={set(field)}
            onBlur={touch(field)}
            className={`w-full rounded-xl border bg-white/10 py-3 pl-10 ${
              isPassword ? "pr-11" : "pr-4"
            } text-sm text-white placeholder-white/40 outline-none backdrop-blur transition-all duration-200 focus:ring-2 ${
              fieldErr(field)
                ? "border-red-400 focus:ring-red-400/40"
                : "border-white/20 focus:border-white/40 focus:ring-white/20"
            }`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
            >
              {showToggle ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {fieldErr(field) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs font-medium text-red-300"
          >
            {errors[field]}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 px-4 py-12">
      {/* ── Animated gradient bg ── */}
      <div
        aria-hidden
        className="absolute inset-0 animate-gradient bg-[length:300%_300%] bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/4 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-3xl"
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
            Create Account
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Join QuizMaster and start learning
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {renderField({
            label: "Full Name",
            field: "name",
            placeholder: "John Doe",
            icon: User,
          })}

          {renderField({
            label: "Email",
            field: "email",
            type: "email",
            placeholder: "you@example.com",
            icon: Mail,
          })}

          {renderField({
            label: "Password",
            field: "password",
            placeholder: "••••••••",
            icon: Lock,
            isPassword: true,
            showToggle: showPwd,
            onToggle: () => setShowPwd((v) => !v),
          })}

          {renderField({
            label: "Confirm Password",
            field: "confirmPassword",
            placeholder: "••••••••",
            icon: Lock,
            isPassword: true,
            showToggle: showConfirm,
            onToggle: () => setShowConfirm((v) => !v),
          })}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-white underline underline-offset-2 transition-colors hover:text-yellow-300"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
