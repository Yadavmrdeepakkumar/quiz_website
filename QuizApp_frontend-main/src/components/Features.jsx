/**
 * Features.jsx — "Why Choose Us" Feature Cards
 * ─────────────────────────────────────────────
 * Three animated cards with a more premium layout and stronger visual depth.
 */

import { motion } from "framer-motion";
import { Gamepad2, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Play Quiz",
    description:
      "Choose from dozens of categories and difficulty levels with a fast, engaging experience.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description:
      "Visualise your scores, streaks, and weak areas through polished insights and dashboards.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: ShieldCheck,
    title: "Admin Panel",
    description:
      "Create, edit, and manage quizzes effortlessly with smart, intuitive admin controls.",
    color: "from-amber-500 to-orange-500",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Features() {
  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-[900px] -translate-x-1/2 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-900/30"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-2 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            Why Choose Us
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
            Everything you need to <span className="text-indigo-600 dark:text-indigo-400">excel</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            A refined platform designed to make learning feel focused, motivating, and effortless.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative overflow-hidden rounded-[28px] border border-gray-100 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:border-gray-800 dark:bg-gray-800/90"
            >
              <span
                className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${color} transition-transform duration-300 group-hover:scale-x-100`}
              />

              <div
                className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
              >
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-3 leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
