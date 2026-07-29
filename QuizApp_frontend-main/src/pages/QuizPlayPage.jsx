/**
 * QuizPlayPage.jsx — Quiz Play Interface
 * ─────────────────────────────────────────────
 * Interactive quiz-taking page with timer countdown,
 * animated question cards, progress navigation,
 * confirm-submit modal, and result modal with SVG score ring.
 * Fully dark-mode aware.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getQuizById, submitQuiz } from "../services/quizService";

/* letter badges */
const optionLetters = ["A", "B", "C", "D"];

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */
export default function QuizPlayPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ── API loading state ── */
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getQuizById(id);
        // Normalize: backend may return data directly or wrapped
        const q = data.quiz || data;
        setQuiz({
          title: q.title,
          timePerQuestion: q.timePerQuestion || 30,
          questions: q.questions || [],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* Show loading / error before quiz is ready */
  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading quiz…</p>
        </div>
      </section>
    );
  }

  if (error || !quiz || quiz.questions.length === 0) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Oops!</h3>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{error || "No questions found."}</p>
          <button onClick={() => navigate("/quizzes")} className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Back to Quizzes
          </button>
        </div>
      </section>
    );
  }

  return <QuizPlayer quiz={quiz} navigate={navigate} quizId={id} />;
}

/* ── Separate component so hooks run only when quiz is loaded ── */
function QuizPlayer({ quiz, navigate, quizId }) {
  const { title, questions, timePerQuestion } = quiz;
  const totalTime = questions.length * timePerQuestion;

  /* ── state ── */
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [finished, setFinished] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef(null);

  /* ── timer ── */
  useEffect(() => {
    if (finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [finished]);

  const endQuiz = useCallback(async () => {
    clearInterval(timerRef.current);
    setFinished(true);
    setShowConfirm(false);
    // Submit to backend (fire-and-forget, local score still shown)
    try {
      await submitQuiz({ quizId, answers: selected });
    } catch {
      // Silently fail — local score is still shown
    }
  }, [quizId, selected]);

  /* ── helpers ── */
  const pick = (idx) => {
    if (finished) return;
    setSelected((prev) => {
      const copy = [...prev];
      copy[current] = idx;
      return copy;
    });
  };

  const score = selected.reduce(
    (acc, sel, i) => acc + (sel === questions[i].answer ? 1 : 0),
    0
  );

  const answered = selected.filter((s) => s !== null).length;
  const progressPct = ((current + 1) / questions.length) * 100;
  const timePct = (timeLeft / totalTime) * 100;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const goNext = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* ── Header bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
              Question {current + 1} of {questions.length}
            </p>
          </div>

          {/* Timer chip */}
          <div
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm ring-1 ${
              timeLeft <= 30
                ? "animate-pulse bg-red-50 text-red-600 ring-red-200"
                : "bg-white text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700"
            }`}
          >
            <Clock className="h-4 w-4" />
            {minutes}:{seconds}
          </div>
        </motion.div>

        {/* ── Progress bar ── */}
        <div className="mb-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            />
          </div>
          {/* question dots */}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                  i === current
                    ? "bg-indigo-600 text-white shadow-md"
                    : selected[i] !== null
                    ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 dark:bg-indigo-900 dark:text-indigo-400 dark:ring-indigo-700"
                    : "bg-white text-gray-400 ring-1 ring-gray-200 hover:ring-indigo-300 dark:bg-gray-800 dark:text-gray-500 dark:ring-gray-600 dark:hover:ring-indigo-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── Timer progress bar (thin) ── */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <motion.div
            className={`h-full rounded-full ${
              timeLeft <= 30 ? "bg-red-500" : "bg-emerald-500"
            }`}
            initial={false}
            animate={{ width: `${timePct}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>

        {/* ── Question card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 sm:p-8 dark:bg-gray-800 dark:ring-gray-700"
          >
            <h2 className="mb-6 text-lg font-bold leading-relaxed text-gray-900 dark:text-white sm:text-xl">
              {questions[current].q}
            </h2>

            {/* options */}
            <div className="flex flex-col gap-3">
              {questions[current].options.map((opt, idx) => {
                const isSelected = selected[current] === idx;
                const isCorrect = finished && idx === questions[current].answer;
                const isWrong =
                  finished && isSelected && idx !== questions[current].answer;

                let cls =
                  "border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-900";
                if (finished) {
                  if (isCorrect)
                    cls =
                      "border-emerald-400 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300";
                  else if (isWrong)
                    cls =
                      "border-red-400 bg-red-50 text-red-800 ring-1 ring-red-300";
                  else cls = "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500";
                } else if (isSelected) {
                  cls =
                    "border-indigo-500 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-300 shadow-sm";
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={!finished ? { scale: 0.98 } : {}}
                    onClick={() => pick(idx)}
                    disabled={finished}
                    className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 ${cls} ${
                      finished ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    {/* letter badge */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        finished && isCorrect
                          ? "bg-emerald-500 text-white"
                          : finished && isWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {optionLetters[idx]}
                    </span>

                    <span className="flex-1">{opt}</span>

                    {/* icons for result state */}
                    {finished && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    )}
                    {finished && isWrong && (
                      <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                    )}

                    {/* selection dot */}
                    {!finished && isSelected && (
                      <motion.span
                        layoutId="option-dot"
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation buttons ── */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-indigo-700"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : !finished ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all duration-200 hover:bg-emerald-700"
            >
              Submit Quiz <CheckCircle2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* ═══════════════════════════════════════
           Confirm submit modal
           ═══════════════════════════════════════ */}
        <AnimatePresence>
          {showConfirm && (
            <>
              <motion.div
                key="confirm-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowConfirm(false)}
              />
              <motion.div
                key="confirm-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-800"
              >
                <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Submit Quiz?</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You've answered{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{answered}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {questions.length}
                  </span>{" "}
                  questions. Unanswered ones will count as wrong.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300 transition hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={endQuiz}
                    className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════
           Result modal
           ═══════════════════════════════════════ */}
        <AnimatePresence>
          {finished && (
            <>
              <motion.div
                key="result-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                key="result-card"
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800"
              >
                {/* Trophy */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 shadow-lg">
                  <Trophy className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-center text-2xl font-extrabold text-gray-900 dark:text-white">
                  Quiz Complete!
                </h3>

                {/* Score ring */}
                <div className="relative mx-auto my-6 h-36 w-36">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke={
                        score / questions.length >= 0.7
                          ? "#10b981"
                          : score / questions.length >= 0.4
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 52}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 52 * (1 - score / questions.length),
                      }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {score}/{questions.length}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">correct</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-lg font-bold text-emerald-700">{score}</p>
                    <p className="text-[11px] text-emerald-600">Correct</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-lg font-bold text-red-700">
                      {questions.length - score}
                    </p>
                    <p className="text-[11px] text-red-600">Wrong</p>
                  </div>
                  <div className="rounded-xl bg-indigo-50 p-3">
                    <p className="text-lg font-bold text-indigo-700">
                      {Math.round((score / questions.length) * 100)}%
                    </p>
                    <p className="text-[11px] text-indigo-600">Score</p>
                  </div>
                </div>

                {/* Per-question breakdown */}
                <div className="mb-6 max-h-44 space-y-2 overflow-y-auto pr-1">
                  {questions.map((qItem, i) => {
                    const correct = selected[i] === qItem.answer;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${
                          correct
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {correct ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0" />
                        )}
                        <span className="flex-1 truncate font-medium">
                          Q{i + 1}: {qItem.q}
                        </span>
                        {!correct && (
                          <span className="shrink-0 text-[10px] font-bold">
                            Ans: {optionLetters[qItem.answer]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/quizzes")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300 transition hover:bg-gray-200"
                  >
                    <Home className="h-4 w-4" /> All Quizzes
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4" /> Retry
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
