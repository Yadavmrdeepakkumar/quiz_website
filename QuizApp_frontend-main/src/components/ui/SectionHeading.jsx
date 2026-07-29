/**
 * SectionHeading.jsx
 * ─────────────────────────────────────────────
 * Reusable animated section heading with badge, title & subtitle.
 * Common pattern used across Features, BannerSlider, Testimonials, etc.
 */

import { motion } from "framer-motion";

export default function SectionHeading({ badge, title, highlight, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
          {badge}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        {title}{" "}
        {highlight && (
          <span className="text-indigo-600 dark:text-indigo-400">
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
