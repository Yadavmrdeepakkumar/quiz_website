/**
 * DashboardPage.jsx — Student Dashboard
 * ─────────────────────────────────────────────
 * Displays student profile, quiz statistics, score
 * analytics with animated progress bars, quiz history
 * table, and certificates section. Dark-mode aware.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  Download,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3,
  Target,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStudentHistory } from "../services/dashboardService";
import { generateCertificate } from "../utils/generateCertificate";

/* ── Animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/* ══════════════════════════════════════
   Component
   ══════════════════════════════════════ */
export default function DashboardPage() {
  const { user: authUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getStudentHistory();
        const history = Array.isArray(data) ? data : data.history || [];
        setQuizHistory(history);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Derived stats from quiz history ── */
  const user = {
    name: authUser?.name || "Student",
    email: authUser?.email || "",
    avatar: (authUser?.name || "S").split(" ").map(n => n[0]).join("").toUpperCase(),
    joined: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    quizzesTaken: quizHistory.length,
    avgScore: quizHistory.length ? Math.round(quizHistory.reduce((a, q) => a + (q.score || 0), 0) / quizHistory.length) : 0,
    bestScore: quizHistory.length ? Math.max(...quizHistory.map((q) => q.score || 0)) : 0,
    streak: 0,
  };

  const certificates = quizHistory.filter((q) => (q.score || 0) >= 80).map((q, i) => ({
    id: q._id || i,
    title: q.title || q.quizTitle || "Quiz",
    date: q.date || new Date(q.createdAt || q.completedAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    grade: (q.score || 0) >= 90 ? "A+" : "A",
    score: q.score || 0,
  }));

  const [downloading, setDownloading] = useState(null);

  const handleDownloadCertificate = async (cert) => {
    try {
      setDownloading(cert.id);
      await generateCertificate({
        studentName: user.name,
        quizTitle: cert.title,
        score: `${cert.score}%`,
        grade: cert.grade,
        date: cert.date,
        certificateId: `QM-${String(cert.id).slice(-8).toUpperCase()}`,
      });
    } catch (err) {
      console.error("Certificate generation failed:", err);
    } finally {
      setDownloading(null);
    }
  };

  const categoryColors = {
    Tech: "from-blue-500 to-blue-400",
    GK: "from-emerald-500 to-emerald-400",
    Sports: "from-amber-500 to-amber-400",
    History: "from-purple-500 to-purple-400",
  };

  /* Build category scores from history */
  const catMap = {};
  quizHistory.forEach((q) => {
    const cat = q.category || "General";
    if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
    catMap[cat].total += q.score || 0;
    catMap[cat].count += 1;
  });
  const categoryScores = Object.entries(catMap).map(([label, { total, count }]) => ({
    label,
    score: Math.round(total / count),
    color: categoryColors[label] || "from-gray-500 to-gray-400",
  }));

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading dashboard…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Oops!</h3>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Page heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Student <span className="text-indigo-600">Dashboard</span>
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Welcome back, {user.name} 👋</p>
          <Link
            to="/quizzes"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:scale-[1.02]"
          >
            <BookOpen className="h-4 w-4" /> Browse & Start Quizzes
          </Link>
        </motion.div>

        {/* ═══════════════ TOP ROW ═══════════════ */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Profile card ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="row-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-100 dark:ring-gray-700"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-2xl font-extrabold text-white shadow-lg">
                {user.avatar}
              </div>
              <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <span className="mt-1 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </span>
              <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Joined {user.joined}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { icon: BookOpen, label: "Quizzes Taken", value: user.quizzesTaken },
                { icon: Target, label: "Avg Score", value: `${user.avgScore}%` },
                { icon: Trophy, label: "Best Score", value: `${user.bestScore}%` },
                { icon: TrendingUp, label: "Day Streak", value: `${user.streak} 🔥` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Icon className="h-4 w-4 text-indigo-400" /> {label}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Stat cards row ── */}
          {[
            { icon: BookOpen, label: "Total Quizzes", value: user.quizzesTaken, color: "from-indigo-500 to-blue-500" },
            { icon: Trophy, label: "Average Score", value: `${user.avgScore}%`, color: "from-amber-500 to-yellow-400" },
            { icon: TrendingUp, label: "Best Score", value: `${user.bestScore}%`, color: "from-emerald-500 to-teal-400" },
            { icon: Clock, label: "Day Streak", value: user.streak, color: "from-pink-500 to-rose-400" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i + 1}
              className="flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-md ring-1 ring-gray-100 dark:ring-gray-700"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════ SCORE ANALYTICS ═══════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="mt-10 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-100 dark:ring-gray-700"
        >
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Score Analytics by Category
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryScores.map(({ label, score, color }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{score}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══════════════ QUIZ HISTORY ═══════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="mt-10 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-100 dark:ring-gray-700"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-indigo-500" /> Quiz History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  <th className="pb-3 pr-4 font-semibold">#</th>
                  <th className="pb-3 pr-4 font-semibold">Quiz</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Score</th>
                  <th className="pb-3 pr-4 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((q, i) => (
                  <motion.tr
                    key={q._id || q.id || i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="border-b border-gray-50 dark:border-gray-800 last:border-none"
                  >
                    <td className="py-3.5 pr-4 font-medium text-gray-400 dark:text-gray-500">
                      {i + 1}
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-gray-800 dark:text-gray-200">
                      {q.title || q.quizTitle || "Quiz"}
                    </td>
                    <td className="py-3.5 pr-4 text-gray-500 dark:text-gray-400">{q.date || new Date(q.createdAt || q.completedAt || Date.now()).toLocaleDateString()}</td>
                    <td className="py-3.5 pr-4 font-bold text-gray-800 dark:text-gray-200">
                      {q.score}/{q.total}
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className={`h-full rounded-full ${
                            q.score >= 70
                              ? "bg-emerald-500"
                              : q.score >= 50
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${q.score}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5">
                      {(q.status === "pass" || (!q.status && (q.score || 0) >= 50)) ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5" /> Fail
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ═══════════════ CERTIFICATES ═══════════════ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          className="mt-10 mb-8 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-100 dark:ring-gray-700"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <Award className="h-5 w-5 text-indigo-500" /> Certificates
          </h2>

          {certificates.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No certificates earned yet. Pass a quiz with 80 %+ to earn one!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map(({ id, title, date, grade }, i) => (
                <motion.div
                  key={id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 p-5 transition-shadow duration-300 hover:shadow-lg"
                >
                  {/* decorative ribbon */}
                  <span className="absolute -right-6 -top-6 flex h-16 w-16 items-end justify-start rounded-full bg-indigo-600/10 pb-2 pl-3 text-xs font-extrabold text-indigo-600">
                    {grade}
                  </span>

                  <Award className="mb-3 h-8 w-8 text-indigo-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Earned on {date}</p>

                  <button
                    onClick={() => handleDownloadCertificate({ id, title, date, grade, score: quizHistory.find(q => (q._id || q.id) === id)?.score || 80 })}
                    disabled={downloading === id}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow transition-all duration-300 hover:bg-indigo-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === id ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                    ) : (
                      <><Download className="h-3.5 w-3.5" /> Download</>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
