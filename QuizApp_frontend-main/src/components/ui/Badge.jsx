/**
 * Badge.jsx
 * ─────────────────────────────────────────────
 * Reusable pill badge with preset color schemes.
 *
 * Usage:
 *   <Badge color="green">Easy</Badge>
 */

const colors = {
  green:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  red:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  amber:  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  emerald:"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  gray:   "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
};

export default function Badge({ children, color = "gray", className = "" }) {
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
