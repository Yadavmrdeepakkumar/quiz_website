/**
 * Card.jsx
 * ─────────────────────────────────────────────
 * Reusable card wrapper with dark-mode support.
 *
 * Usage:
 *   <Card className="p-6">content</Card>
 */

export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-md ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
