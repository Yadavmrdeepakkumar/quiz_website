/**
 * Testimonials.jsx — User Testimonials Section
 * ─────────────────────────────────────────────
 * Displays user reviews in a responsive grid
 * with staggered scroll-in animations, star ratings,
 * and dark-mode support.
 */

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

/* ── Testimonial data ── */
const testimonials = [
  {
    name: "Priya Sharma",
    role: "Engineering Student",
    avatar: "PS",
    color: "bg-pink-500",
    stars: 5,
    text: "QuizMaster completely changed how I prepare for exams. The instant feedback and progress tracking are game-changers!",
  },
  {
    name: "Rahul Verma",
    role: "Competitive Exam Aspirant",
    avatar: "RV",
    color: "bg-indigo-500",
    stars: 5,
    text: "The variety of quizzes is amazing. I've improved my general knowledge score by 40 % in just two months.",
  },
  {
    name: "Ananya Gupta",
    role: "School Teacher",
    avatar: "AG",
    color: "bg-emerald-500",
    stars: 4,
    text: "I use the admin panel to create quizzes for my students — it's intuitive and saves me hours every week.",
  },
  {
    name: "Amit Patel",
    role: "Software Developer",
    avatar: "AP",
    color: "bg-amber-500",
    stars: 5,
    text: "Love the programming quizzes! Clean UI, smooth experience, and the leaderboard keeps me motivated.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900">
      {/* bg accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-900/30"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-2 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            What Our <span className="text-indigo-600 dark:text-indigo-400">Users</span> Say
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Join thousands of happy learners who trust QuizMaster.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map(({ name, role, avatar, color, stars, text }, i) => (
            <motion.div
              key={name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800 dark:ring-gray-700"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-indigo-100 transition-colors duration-300 group-hover:text-indigo-200 dark:text-indigo-900 dark:group-hover:text-indigo-800" />

              {/* stars */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s < stars
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>

              <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                "{text}"
              </p>

              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
                >
                  {avatar}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
