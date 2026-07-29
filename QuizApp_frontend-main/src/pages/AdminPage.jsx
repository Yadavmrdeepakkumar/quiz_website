/**
 * AdminPage.jsx — Professional Admin Dashboard with Sidebar
 * ─────────────────────────────────────────────
 * Features:
 *   • Collapsible sidebar navigation
 *   • Dashboard stats, charts, quiz management
 *   • Student results, create quiz modal
 *   • Fully responsive & dark themed
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import {
  Plus, Trash2, Pencil, Save, X, Users, BookOpen, TrendingUp,
  FileQuestion, GripVertical, Search, CheckCircle2, XCircle,
  LayoutDashboard, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight,
  Award, Database, BarChart3, Menu, Brain, Download, Mail, Shield,
  BookMarked, MessageCircle, ExternalLink, FileText, Clock, Globe,
  Bell, Palette, Lock, ChevronDown, ChevronUp,
} from "lucide-react";
import { useToast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";
import { getQuizzes, createQuiz as createQuizAPI, deleteQuiz as deleteQuizAPI } from "../services/quizService";
import { getAdminStats } from "../services/dashboardService";
import { generateCertificate, getCertificateBlobUrl } from "../utils/generateCertificate";

/* ── Sidebar nav items ── */
const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "quizzes", label: "All Quizzes", icon: BookOpen },
  { id: "questions", label: "Questions", icon: FileQuestion },
  { id: "students", label: "Students", icon: Users },
  { id: "results", label: "Results", icon: Database },
  { id: "statistics", label: "Statistics", icon: BarChart3 },
  { id: "certificates", label: "Certificates", icon: Award },
];

const sidebarBottom = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

/* ── Animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

/* ══════════════════════════════════════
   Component
   ══════════════════════════════════════ */
export default function AdminPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  /* quiz CRUD state */
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

  const barData = stats?.barData || [];
  const pieData = stats?.pieData || [];
  const lineData = stats?.lineData || [];
  const studentResults = stats?.studentResults || [];

  useEffect(() => { fetchQuizzes(); fetchStats(); }, []);

  async function fetchStats() {
    try {
      const { data } = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    }
  }

  async function fetchQuizzes() {
    try {
      setLoading(true);
      const { data } = await getQuizzes();
      const list = Array.isArray(data) ? data : data.quizzes || [];
      setQuizzes(list.map((q) => ({
        ...q, id: q._id || q.id,
        questions: Array.isArray(q.questions) ? q.questions.length : q.questions || 0,
        status: q.status || "Active",
      })));
    } catch (err) {
      toast(err.response?.data?.message || "Failed to load quizzes", "error");
    } finally { setLoading(false); }
  }

  /* form state */
  const emptyForm = { title: "", category: "Tech", difficulty: "Easy", questions: [{ q: "", options: ["", "", "", ""], answer: 0 }] };
  const [form, setForm] = useState(emptyForm);

  const updateQ = (qi, field, value) => setForm((f) => { const qs = [...f.questions]; qs[qi] = { ...qs[qi], [field]: value }; return { ...f, questions: qs }; });
  const updateOption = (qi, oi, value) => setForm((f) => { const qs = [...f.questions]; const opts = [...qs[qi].options]; opts[oi] = value; qs[qi] = { ...qs[qi], options: opts }; return { ...f, questions: qs }; });
  const addQuestion = () => setForm((f) => ({ ...f, questions: [...f.questions, { q: "", options: ["", "", "", ""], answer: 0 }] }));
  const removeQuestion = (qi) => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (quiz) => { setEditing(quiz); setForm({ title: quiz.title, category: quiz.category, difficulty: quiz.difficulty, questions: [{ q: "", options: ["", "", "", ""], answer: 0 }] }); setShowForm(true); };

  const saveQuiz = async () => {
    if (!form.title.trim()) { toast("Please enter a quiz title", "error"); return; }
    try {
      if (editing) {
        setQuizzes((prev) => prev.map((q) => q.id === editing.id ? { ...q, title: form.title, category: form.category, difficulty: form.difficulty, questions: form.questions.length } : q));
        toast("Quiz updated!", "success");
      } else {
        await createQuizAPI({ title: form.title, category: form.category, difficulty: form.difficulty, questions: form.questions });
        toast("Quiz created successfully!", "success");
        fetchQuizzes();
      }
    } catch (err) { toast(err.response?.data?.message || "Failed to save quiz", "error"); }
    setShowForm(false);
  };

  const deleteQuiz = async (id) => {
    try { await deleteQuizAPI(id); setQuizzes((prev) => prev.filter((q) => q.id !== id)); toast("Quiz deleted", "info"); }
    catch (err) { toast(err.response?.data?.message || "Failed to delete quiz", "error"); }
  };

  const filtered = quizzes.filter((q) => q.title.toLowerCase().includes(search.toLowerCase()));

  const handleLogout = () => { logout(); navigate("/"); };

  const adminName = authUser?.name || "Admin";
  const adminEmail = authUser?.email || "";
  const initials = adminName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* ═══════ SIDEBAR ═══════ */}
      <aside className={`hidden lg:flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        {/* Logo */}
        <div className={`flex h-16 items-center border-b border-gray-800 px-4 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Brain className="h-7 w-7 text-indigo-400" />
              <span className="text-lg font-extrabold text-white">Quiz<span className="text-indigo-400">Master</span></span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-gray-300">
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 ${!sidebarOpen && "text-center"}`}>
            {sidebarOpen ? "Main" : "•"}
          </p>
          {sidebarItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setMobileMenu(false); }}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              } ${!sidebarOpen && "justify-center"}`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}

          <div className="my-4 border-t border-gray-800" />
          <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 ${!sidebarOpen && "text-center"}`}>
            {sidebarOpen ? "System" : "•"}
          </p>
          {sidebarBottom.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === id ? "bg-indigo-600/10 text-indigo-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              } ${!sidebarOpen && "justify-center"}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className={`border-t border-gray-800 p-3 ${!sidebarOpen && "flex justify-center"}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 rounded-xl bg-gray-800/50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{initials}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{adminName}</p>
                <p className="truncate text-xs text-gray-500">{adminEmail}</p>
              </div>
              <button onClick={handleLogout} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-700 hover:text-red-400" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-red-400" title="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>

      {/* ═══════ MOBILE HEADER ═══════ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900 px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-white">QuizMaster</span>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-800">
            {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile slide menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-800 bg-gray-900 p-4 lg:hidden">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-7 w-7 text-indigo-400" />
                <span className="text-lg font-extrabold text-white">Quiz<span className="text-indigo-400">Master</span></span>
              </div>
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setActiveTab(id); setMobileMenu(false); }}
                  className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${activeTab === id ? "bg-indigo-600/10 text-indigo-400" : "text-gray-400"}`}>
                  <Icon className="h-5 w-5" />{label}
                </button>
              ))}
              <div className="my-3 border-t border-gray-800" />
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-gray-800">
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ MAIN CONTENT ═══════ */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 sm:p-6 lg:p-8">
          {/* Top bar */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "quizzes" && "All Quizzes"}
                {activeTab === "questions" && "Questions Bank"}
                {activeTab === "students" && "Students"}
                {activeTab === "results" && "Results Database"}
                {activeTab === "statistics" && "Statistics"}
                {activeTab === "certificates" && "Certificates"}
                {activeTab === "settings" && "Settings"}
                {activeTab === "help" && "Help Center"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, <span className="text-indigo-400 font-medium">{adminName}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{initials}</div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{adminName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>

          {/* ═══════ DASHBOARD TAB ═══════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: BookOpen, label: "Total Quizzes", value: stats?.totalQuizzes ?? quizzes.length, color: "#6366f1", bg: "bg-indigo-500/10" },
                  { icon: Users, label: "Total Students", value: stats?.totalStudents ?? 0, color: "#10b981", bg: "bg-emerald-500/10" },
                  { icon: FileQuestion, label: "Total Questions", value: stats?.totalQuestions ?? 0, color: "#f59e0b", bg: "bg-amber-500/10" },
                  { icon: TrendingUp, label: "Avg Score", value: stats?.avgScore ?? "0%", color: "#ec4899", bg: "bg-pink-500/10" },
                ].map(({ icon: Icon, label, value, color, bg }, i) => (
                  <motion.div key={label} variants={fadeUp} initial="hidden" animate="visible" custom={i}
                    className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                        <Icon className="h-6 w-6" style={{ color }} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-2xl font-extrabold text-white">{value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-300">Students per Quiz</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12 }} />
                      <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 self-start text-sm font-bold text-gray-300">Category Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((_, idx) => (<Cell key={idx} fill={PIE_COLORS[idx]} />))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-sm font-bold text-gray-300">Monthly Quiz Attempts</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12 }} />
                      <Legend />
                      <Line type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Results */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
                  <Users className="h-5 w-5 text-indigo-400" /> Recent Student Results
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                        <th className="pb-3 pr-4 font-semibold">#</th>
                        <th className="pb-3 pr-4 font-semibold">Student</th>
                        <th className="pb-3 pr-4 font-semibold">Quiz</th>
                        <th className="pb-3 pr-4 font-semibold">Score</th>
                        <th className="pb-3 pr-4 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResults.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-gray-600">No results yet</td></tr>
                      )}
                      {studentResults.map((r, i) => (
                        <tr key={r.id || i} className="border-b border-gray-800/50 last:border-none">
                          <td className="py-3.5 pr-4 text-gray-500">{i + 1}</td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
                                {(r.name || "S")[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-200">{r.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 text-gray-400">{r.quiz}</td>
                          <td className="py-3.5 pr-4 font-bold text-white">{r.score}/{r.total}</td>
                          <td className="py-3.5 pr-4 text-gray-500">{r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                          <td className="py-3.5">
                            {(r.percentage ?? 0) >= 50 ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                                <XCircle className="h-3.5 w-3.5" /> Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ QUIZZES TAB ═══════ */}
          {(activeTab === "quizzes" || activeTab === "questions") && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                  <input type="text" placeholder="Search quizzes…" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-64 rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <button onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500">
                  <Plus className="h-4 w-4" /> Create Quiz
                </button>
              </div>

              {/* Quiz table */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-5 py-4 font-semibold">#</th>
                        <th className="px-5 py-4 font-semibold">Name</th>
                        <th className="px-5 py-4 font-semibold">Category</th>
                        <th className="px-5 py-4 font-semibold">Level</th>
                        <th className="px-5 py-4 font-semibold">Questions</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Created</th>
                        <th className="px-5 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((q, i) => (
                        <tr key={q.id} className="border-b border-gray-800/50 transition hover:bg-gray-800/30">
                          <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 text-sm font-bold text-indigo-400">
                                {q.title?.[0]?.toUpperCase() || "Q"}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{q.title}</p>
                                <p className="text-xs text-gray-500">{q.description?.slice(0, 40) || "No description"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                              q.category === "Tech" ? "bg-blue-500/10 text-blue-400" :
                              q.category === "GK" ? "bg-emerald-500/10 text-emerald-400" :
                              q.category === "Sports" ? "bg-amber-500/10 text-amber-400" :
                              "bg-purple-500/10 text-purple-400"
                            }`}>{q.category}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                              q.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                              q.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400" :
                              "bg-red-500/10 text-red-400"
                            }`}>{q.difficulty}</span>
                          </td>
                          <td className="px-5 py-4 font-medium text-gray-300">{q.questions}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                              q.status === "Active" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-gray-700 text-gray-400"
                            }`}>{q.status}</span>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500">
                            {q.createdAt ? new Date(q.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1.5">
                              <button onClick={() => openEdit(q)} className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-500/10 hover:text-indigo-400" title="Edit">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteQuiz(q.id)} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={8} className="py-12 text-center text-gray-600">No quizzes found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-800 px-5 py-3">
                  <p className="text-xs text-gray-500">Showing {filtered.length} of {quizzes.length} quizzes</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ STUDENTS TAB ═══════ */}
          {activeTab === "students" && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-5 text-lg font-bold text-white">Registered Students</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-3 pr-4 font-semibold">#</th>
                      <th className="pb-3 pr-4 font-semibold">Student</th>
                      <th className="pb-3 pr-4 font-semibold">Quiz</th>
                      <th className="pb-3 pr-4 font-semibold">Score</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentResults.length === 0 && (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-600">No student data yet</td></tr>
                    )}
                    {studentResults.map((r, i) => (
                      <tr key={r.id || i} className="border-b border-gray-800/50 last:border-none">
                        <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">{(r.name || "S")[0].toUpperCase()}</div>
                            <span className="font-medium text-gray-200">{r.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{r.quiz}</td>
                        <td className="py-3 pr-4 font-bold text-white">{r.score}/{r.total}</td>
                        <td className="py-3">{(r.percentage ?? 0) >= 50
                          ? <span className="text-xs font-semibold text-emerald-400">Pass</span>
                          : <span className="text-xs font-semibold text-red-400">Fail</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ RESULTS TAB ═══════ */}
          {activeTab === "results" && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-5 text-lg font-bold text-white">All Quiz Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-3 pr-4 font-semibold">#</th><th className="pb-3 pr-4 font-semibold">Student</th>
                      <th className="pb-3 pr-4 font-semibold">Quiz</th><th className="pb-3 pr-4 font-semibold">Score</th>
                      <th className="pb-3 pr-4 font-semibold">%</th><th className="pb-3 pr-4 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentResults.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-gray-600">No results yet</td></tr>}
                    {studentResults.map((r, i) => (
                      <tr key={r.id || i} className="border-b border-gray-800/50">
                        <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 pr-4 font-medium text-gray-200">{r.name}</td>
                        <td className="py-3 pr-4 text-gray-400">{r.quiz}</td>
                        <td className="py-3 pr-4 font-bold text-white">{r.score}/{r.total}</td>
                        <td className="py-3 pr-4 text-gray-300">{r.percentage}%</td>
                        <td className="py-3 pr-4 text-gray-500">{r.date ? new Date(r.date).toLocaleDateString("en-IN") : "—"}</td>
                        <td className="py-3">{(r.percentage ?? 0) >= 50
                          ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">Pass</span>
                          : <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">Fail</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ STATISTICS TAB ═══════ */}
          {activeTab === "statistics" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-sm font-bold text-gray-300">Quiz Participation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12 }} />
                    <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-sm font-bold text-gray-300">Monthly Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="attempts" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ═══════ CERTIFICATES TAB ═══════ */}
          {activeTab === "certificates" && (
            <CertificatesSection studentResults={studentResults} />
          )}

          {/* ═══════ SETTINGS TAB ═══════ */}
          {activeTab === "settings" && (
            <SettingsSection adminName={adminName} adminEmail={adminEmail} toast={toast} />
          )}

          {/* ═══════ HELP TAB ═══════ */}
          {activeTab === "help" && (
            <HelpSection />
          )}
        </main>
      </div>

      {/* ═══════ CREATE/EDIT MODAL ═══════ */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div key="form" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[94%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">{editing ? "Edit Quiz" : "Create New Quiz"}</h2>
                <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800"><X className="h-5 w-5" /></button>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="mb-1 block text-sm font-medium text-gray-400">Quiz Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. JavaScript Basics"
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">Category</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none">
                    {["Tech", "GK", "Sports", "History"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-400">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                    className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none">
                    {["Easy", "Medium", "Hard"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-300">Questions ({form.questions.length})</h3>
                <button onClick={addQuestion} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-600/20">
                  <Plus className="h-3.5 w-3.5" /> Add Question
                </button>
              </div>

              <div className="space-y-4">
                {form.questions.map((qItem, qi) => (
                  <div key={qi} className="rounded-xl border border-gray-700 bg-gray-800/50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <GripVertical className="h-4 w-4 text-gray-600" /> Q{qi + 1}
                      </span>
                      {form.questions.length > 1 && (
                        <button onClick={() => removeQuestion(qi)} className="rounded p-1 text-gray-600 transition hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input type="text" placeholder="Enter question…" value={qItem.q} onChange={(e) => updateQ(qi, "q", e.target.value)}
                      className="mb-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition focus:border-indigo-500" />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {qItem.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button type="button" onClick={() => updateQ(qi, "answer", oi)}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition ${
                              qItem.answer === oi ? "bg-emerald-500 text-white shadow" : "bg-gray-700 text-gray-400 hover:bg-emerald-500/20"
                            }`}>{String.fromCharCode(65 + oi)}</button>
                          <input type="text" placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)}
                            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowForm(false)} className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-gray-700">Cancel</button>
                <button onClick={saveQuiz} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-500">
                  <Save className="h-4 w-4" /> {editing ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   CERTIFICATES SECTION
   ══════════════════════════════════════════════════════════════ */
function CertificatesSection({ studentResults }) {
  const [certSearch, setCertSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Students who passed (>=50%) are eligible for certificate
  const eligible = studentResults.filter((r) => (r.percentage ?? 0) >= 50);
  const filtered = eligible.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(certSearch.toLowerCase()) ||
      (r.quiz || "").toLowerCase().includes(certSearch.toLowerCase())
  );

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (pct >= 80) return { grade: "A", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (pct >= 70) return { grade: "B", color: "text-blue-400", bg: "bg-blue-500/10" };
    if (pct >= 60) return { grade: "C", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    return { grade: "D", color: "text-orange-400", bg: "bg-orange-500/10" };
  };

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Certificates", value: eligible.length, icon: Award, color: "#6366f1", bg: "bg-indigo-500/10" },
          { label: "This Month", value: eligible.filter((r) => { const d = new Date(r.date); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length, icon: Clock, color: "#10b981", bg: "bg-emerald-500/10" },
          { label: "Avg Score", value: eligible.length > 0 ? Math.round(eligible.reduce((s, r) => s + (r.percentage || 0), 0) / eligible.length) + "%" : "0%", icon: TrendingUp, color: "#f59e0b", bg: "bg-amber-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-extrabold text-white">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
        <input type="text" placeholder="Search by student or quiz name…" value={certSearch} onChange={(e) => setCertSearch(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
      </div>

      {/* Certificates table */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Quiz</th>
                <th className="px-5 py-4 font-semibold">Score</th>
                <th className="px-5 py-4 font-semibold">Grade</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Certificate</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-600">
                  <Award className="mx-auto mb-3 h-10 w-10 text-gray-700" />
                  <p className="font-medium">No certificates issued yet</p>
                  <p className="mt-1 text-xs">Students who pass quizzes (≥50%) will appear here</p>
                </td></tr>
              )}
              {filtered.map((r, i) => {
                const { grade, color, bg } = getGrade(r.percentage || 0);
                return (
                  <tr key={r.id || i} className="border-b border-gray-800/50 transition hover:bg-gray-800/30">
                    <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
                          {(r.name || "S")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-200">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{r.quiz}</td>
                    <td className="px-5 py-4 font-bold text-white">{r.score}/{r.total} <span className="text-xs text-gray-500">({r.percentage}%)</span></td>
                    <td className="px-5 py-4">
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${bg} ${color}`}>{grade}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500">
                      {r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Issued
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          const url = getCertificateBlobUrl({
                            studentName: r.name || "Student",
                            quizTitle: r.quiz || "Quiz",
                            score: `${r.percentage || 0}%`,
                            grade,
                            date: r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : undefined,
                            certificateId: `QM-${(r.id || i).toString().slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
                          });
                          setPreviewUrl(url);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-600/20 hover:text-indigo-300"
                        title="View Certificate"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-800 px-5 py-3">
            <p className="text-xs text-gray-500">Showing {filtered.length} of {eligible.length} certificates</p>
          </div>
        )}
      </div>

      {/* ═══════ Certificate Preview Modal ═══════ */}
      <AnimatePresence>
        {previewUrl && (
          <>
            <motion.div key="cert-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewUrl(null)} />
            <motion.div key="cert-modal" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-4 z-50 flex flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl sm:inset-8 lg:inset-16">
              <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3">
                <h3 className="text-sm font-bold text-white">Certificate Preview</h3>
                <button onClick={() => setPreviewUrl(null)}
                  className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-800 hover:text-gray-300">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-2">
                <iframe src={previewUrl} className="h-full w-full rounded-lg" title="Certificate Preview" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   SETTINGS SECTION
   ══════════════════════════════════════════════════════════════ */
function SettingsSection({ adminName, adminEmail, toast }) {
  const [settings, setSettings] = useState({
    siteName: "QuizMaster",
    siteDescription: "Interactive Quiz Platform for Students",
    passPercentage: 50,
    certificateThreshold: 80,
    maxAttempts: 3,
    timePerQuestion: 30,
    enableRegistration: true,
    enableCertificates: true,
    enableLeaderboard: true,
    emailNotifications: true,
    resultNotifications: true,
    maintenanceMode: false,
  });

  const update = (key, value) => setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    toast("Settings saved successfully!", "success");
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
            <Globe className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">General Settings</h3>
            <p className="text-xs text-gray-500">Configure your platform basics</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Site Name</label>
            <input type="text" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Site Description</label>
            <input type="text" value={settings.siteDescription} onChange={(e) => update("siteDescription", e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>
      </motion.div>

      {/* Quiz Settings */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Quiz Configuration</h3>
            <p className="text-xs text-gray-500">Set quiz rules and thresholds</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Pass Percentage (%)</label>
            <input type="number" value={settings.passPercentage} onChange={(e) => update("passPercentage", +e.target.value)} min={0} max={100}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Certificate Threshold (%)</label>
            <input type="number" value={settings.certificateThreshold} onChange={(e) => update("certificateThreshold", +e.target.value)} min={0} max={100}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Time per Question (sec)</label>
            <input type="number" value={settings.timePerQuestion} onChange={(e) => update("timePerQuestion", +e.target.value)} min={5} max={300}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Max Attempts per Quiz</label>
            <input type="number" value={settings.maxAttempts} onChange={(e) => update("maxAttempts", +e.target.value)} min={1} max={10}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
          </div>
        </div>
      </motion.div>

      {/* Feature Toggles */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Palette className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Feature Toggles</h3>
            <p className="text-xs text-gray-500">Enable or disable platform features</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: "enableRegistration", label: "Student Registration", desc: "Allow new students to register", icon: Users },
            { key: "enableCertificates", label: "Certificates", desc: "Issue certificates for passed quizzes", icon: Award },
            { key: "enableLeaderboard", label: "Leaderboard", desc: "Show public leaderboard rankings", icon: TrendingUp },
          ].map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/30 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-200">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
              <button onClick={() => update(key, !settings[key])}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${settings[key] ? "bg-indigo-600" : "bg-gray-700"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${settings[key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Bell className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Notifications</h3>
            <p className="text-xs text-gray-500">Manage notification preferences</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Send emails for new registrations" },
            { key: "resultNotifications", label: "Result Alerts", desc: "Notify when students complete quizzes" },
            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable platform access" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/30 px-4 py-3.5">
              <div>
                <p className="text-sm font-medium text-gray-200">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button onClick={() => update(key, !settings[key])}
                className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${settings[key] ? (key === "maintenanceMode" ? "bg-red-600" : "bg-indigo-600") : "bg-gray-700"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${settings[key] ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Admin Profile */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
            <Shield className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Admin Profile</h3>
            <p className="text-xs text-gray-500">Your account details</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Admin Name</label>
            <input type="text" value={adminName} readOnly
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-gray-400 outline-none cursor-not-allowed" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-400">Admin Email</label>
            <input type="text" value={adminEmail} readOnly
              className="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-4 py-2.5 text-sm text-gray-400 outline-none cursor-not-allowed" />
          </div>
        </div>
      </motion.div>

      {/* Save button */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:scale-[1.02]">
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   HELP SECTION
   ══════════════════════════════════════════════════════════════ */
function HelpSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "How do I create a new quiz?", a: "Go to 'All Quizzes' from the sidebar, then click the 'Create Quiz' button. Fill in the title, category, difficulty, and add your questions with 4 options each. Mark the correct answer and save." },
    { q: "How do students take quizzes?", a: "Students log in through the student portal, browse available quizzes on the Quizzes page, and click 'Start Quiz'. They answer questions within the time limit and get instant results upon submission." },
    { q: "How is the grading system calculated?", a: "Scores are calculated as (correct answers / total questions) × 100. Pass threshold is 50%. Certificates are issued for scores ≥80%. Grades: A+ (90%+), A (80%+), B (70%+), C (60%+), D (50%+)." },
    { q: "Can students retake quizzes?", a: "Yes, students can attempt quizzes multiple times. Each attempt is recorded separately in the results, and the dashboard shows their complete history with scores." },
    { q: "How do certificates work?", a: "When students score 80% or above on a quiz, they earn a certificate. They can download a professional PDF certificate from their dashboard. Admin can view all issued certificates in the Certificates section." },
    { q: "How do I manage students?", a: "Navigate to the 'Students' section from the sidebar to view all registered students, their quiz attempts, scores, and pass/fail status." },
    { q: "Can I edit or delete quizzes?", a: "Yes! In the 'All Quizzes' section, each quiz has Edit (pencil) and Delete (trash) buttons. Deleting a quiz also removes all associated student attempts." },
    { q: "How do I access statistics?", a: "The 'Statistics' section provides detailed charts including quiz participation rates and monthly attempt trends. The Dashboard also shows a quick overview with pie charts and bar graphs." },
  ];

  const guides = [
    { title: "Getting Started Guide", desc: "Learn the basics of setting up your QuizMaster platform", icon: BookMarked, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: "Quiz Creation Tutorial", desc: "Step-by-step guide to creating engaging quizzes", icon: FileQuestion, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Understanding Analytics", desc: "How to read and use dashboard statistics", icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Certificate Management", desc: "Configure and manage student certificates", icon: Award, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Start */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Welcome to QuizMaster Help Center</h3>
            <p className="mt-1 text-sm text-gray-400">Find answers, guides, and resources to manage your platform effectively.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-400">
              <FileText className="h-3.5 w-3.5" /> v2.0
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Guides */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Quick Guides</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map(({ title, desc, icon: Icon, color, bg }, i) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" animate="visible" custom={i}
              className="group cursor-pointer rounded-2xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700 hover:bg-gray-800/50">
              <div className="flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h4>
                  <p className="mt-1 text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.5}
              className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-800/50">
                <span className="text-sm font-semibold text-gray-200">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="h-4 w-4 shrink-0 text-indigo-400" />
                  : <ChevronDown className="h-4 w-4 shrink-0 text-gray-600" />
                }
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <div className="border-t border-gray-800 px-5 py-4">
                      <p className="text-sm leading-relaxed text-gray-400">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact / Support */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
        className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Need More Help?</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 px-4 py-3.5">
            <Mail className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-gray-200">Email Support</p>
              <p className="text-xs text-gray-500">support@quizmaster.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 px-4 py-3.5">
            <MessageCircle className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-gray-200">Live Chat</p>
              <p className="text-xs text-gray-500">Mon–Fri, 9AM–6PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 px-4 py-3.5">
            <FileText className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-gray-200">Documentation</p>
              <p className="text-xs text-gray-500">docs.quizmaster.com</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* App Info */}
      <div className="text-center text-xs text-gray-600">
        <p>QuizMaster Admin Panel v2.0 • Built with React & Node.js</p>
        <p className="mt-1">© 2026 QuizMaster. All rights reserved.</p>
      </div>
    </div>
  );
}
