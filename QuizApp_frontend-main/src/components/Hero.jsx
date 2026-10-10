/**
 * Hero.jsx — Landing Page Hero Section
 * ─────────────────────────────────────────────
 * Full-viewport hero with an elevated gradient treatment,
 * polished CTA buttons, and modern stats cards.
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, LogIn, UserPlus, Sparkles, Trophy, Zap } from "lucide-react";

const highlights = [
  { value: "10k+", label: "Quizzes played" },
  { value: "4.9/5", label: "Average rating" },
  { value: "24/7", label: "Learning flow" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-10 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-gradient bg-[length:300%_300%] bg-gradient-to-br from-indigo-700 via-violet-700 to-pink-600"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[420px] w-[420px] translate-x-1/3 translate-y-1/3 rounded-full bg-pink-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_35%)]"
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20 backdrop-blur"
        >
          <Sparkles className="h-4 w-4" />
          2026-ready learning experience
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Challenge your mind with a
          <span className="mt-2 block bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
            polished quiz journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-indigo-100 sm:text-xl"
        >
          Discover engaging quizzes, track your growth in real time, and enjoy a
          premium experience built to make learning feel exciting every day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/quizzes"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-[0_18px_45px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.3)]"
          >
            <Play className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            Start Quiz
          </Link>

          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
          >
            <LogIn className="h-5 w-5" />
            Login
          </Link>

          <Link
            to="/register"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
          >
            <UserPlus className="h-5 w-5" />
            Register
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 grid w-full max-w-4xl gap-4 rounded-[32px] border border-white/25 bg-white/10 p-4 shadow-2xl shadow-indigo-950/20 backdrop-blur-xl sm:grid-cols-3"
        >
          {highlights.map(({ value, label }) => (
            <div key={label} className="rounded-2xl bg-white/10 px-4 py-5 text-center">
              <div className="mb-1 flex items-center justify-center text-indigo-100">
                {label === "Learning flow" ? (
                  <Zap className="h-4 w-4" />
                ) : (
                  <Trophy className="h-4 w-4" />
                )}
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-sm text-indigo-100">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <span className="inline-block h-10 w-6 rounded-full border-2 border-white/40 p-1">
            <motion.span
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="block h-2 w-2 rounded-full bg-white"
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
