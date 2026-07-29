/**
 * QuizzesPage.jsx — Quiz Listing Page
 * ─────────────────────────────────────────────
 * Displays 12 sample quizzes in a filterable, searchable
 * card grid with category pills, difficulty badges,
 * and AnimatePresence transitions. Dark-mode aware.
 */

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  HelpCircle,
  ArrowRight,
  SlidersHorizontal,
  Cpu,
  Globe,
  Trophy,
  Landmark,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { getQuizzes } from "../services/quizService";

/* ── Category config ── */
const categories = [
  { key: "All", icon: Sparkles, color: "text-indigo-600 bg-indigo-50 ring-indigo-200" },
  { key: "Tech", icon: Cpu, color: "text-blue-600 bg-blue-50 ring-blue-200" },
  { key: "GK", icon: Globe, color: "text-emerald-600 bg-emerald-50 ring-emerald-200" },
  { key: "Sports", icon: Trophy, color: "text-amber-600 bg-amber-50 ring-amber-200" },
  { key: "History", icon: Landmark, color: "text-purple-600 bg-purple-50 ring-purple-200" },
];

const categoryColors = {
  Tech: "bg-blue-100 text-blue-700",
  GK: "bg-emerald-100 text-emerald-700",
  Sports: "bg-amber-100 text-amber-700",
  History: "bg-purple-100 text-purple-700",
};

const difficultyColors = {
  Easy: "bg-green-100 text-green-700 ring-green-300",
  Medium: "bg-yellow-100 text-yellow-700 ring-yellow-300",
  Hard: "bg-red-100 text-red-700 ring-red-300",
};

/* ── Animation variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  /* ── Fetch quizzes from backend ── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getQuizzes();
        setQuizzes(Array.isArray(data) ? data : data.quizzes || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quizzes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const matchCat =
        activeCategory === "All" || q.category === activeCategory;
      const matchSearch =
        (q.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (q.description || "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory, quizzes]);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            Explore <span className="text-indigo-600 dark:text-indigo-400">Quizzes</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Pick a category, search by name, and start challenging yourself.
          </p>
        </motion.div>

        {/* ── Search + Filters bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quizzes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-800"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="mr-1 h-4 w-4 text-gray-400" />
            {categories.map(({ key, icon: Icon, color }) => {
              const active = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold ring-1 transition-all duration-200 ${
                    active
                      ? `${color} shadow-sm`
                      : "bg-white text-gray-500 ring-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {key}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        <p className="mb-6 text-sm text-gray-400 dark:text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span>{" "}
          quiz{filtered.length !== 1 && "zes"}
        </p>

        {/* ── Loading state ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading quizzes…</p>
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertTriangle className="mb-4 h-12 w-12 text-red-400" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Oops!</h3>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{error}</p>
          </div>
        )}

        {/* ── Cards grid ── */}
        {!loading && !error && (
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((quiz, i) => (
                <motion.div
                  key={quiz._id || quiz.id}
                  layout
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800 dark:ring-gray-700"
                >
                  {/* Top color accent */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${
                      quiz.difficulty === "Easy"
                        ? "from-green-400 to-emerald-400"
                        : quiz.difficulty === "Medium"
                        ? "from-yellow-400 to-amber-400"
                        : "from-red-400 to-rose-400"
                    }`}
                  />

                  <div className="flex flex-1 flex-col p-6">
                    {/* Badges row */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                          categoryColors[quiz.category]
                        }`}
                      >
                        {quiz.category}
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${
                          difficultyColors[quiz.difficulty]
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                      {quiz.description}
                    </p>

                    {/* Meta */}
                    <div className="mt-5 flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {Array.isArray(quiz.questions) ? quiz.questions.length : quiz.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {quiz.duration}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/quiz/${quiz._id || quiz.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow transition-all duration-300 hover:bg-indigo-700 hover:shadow-md group-hover:translate-x-0.5"
                    >
                      Start Quiz
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Search className="mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                No quizzes found
              </h3>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </section>
  );
}
