/**
 * Button.jsx
 * ─────────────────────────────────────────────
 * Reusable button component with variants, sizes,
 * loading state, and dark-mode support.
 *
 * Usage:
 *   <Button variant="primary" size="md" loading={false}>
 *     Click Me
 *   </Button>
 */

import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-indigo-600 text-white shadow hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
  secondary:
    "bg-white text-gray-700 shadow ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-700",
  danger:
    "bg-red-600 text-white shadow hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
  ghost:
    "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-sm rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
