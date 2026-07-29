/**
 * Hero.jsx — Landing Page Hero Section
 * ─────────────────────────────────────────────
 * Full-viewport hero with animated gradient background,
 * decorative blobs, headline with gold accent,
 * three CTA buttons, and a scroll-cue animation.
 * (Already uses white-on-gradient text — no dark: overrides needed.)
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, LogIn, UserPlus } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* ── Animated gradient background ── */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-gradient bg-[length:300%_300%] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"
      />

      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-pink-400/20 blur-3xl"
      />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur"
        >
          🚀 The smartest way to learn
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Test Your Knowledge with{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Smart Quiz Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-indigo-100 sm:text-xl"
        >
          Challenge yourself across dozens of categories, track your progress in
          real-time, and climb the leaderboard — all in one beautiful platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/quizzes"
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-indigo-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <Play className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            Start Quiz
          </Link>

          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <LogIn className="h-5 w-5" />
            Login
          </Link>

          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <UserPlus className="h-5 w-5" />
            Register
          </Link>
        </motion.div>

        {/* Scroll cue */}
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
