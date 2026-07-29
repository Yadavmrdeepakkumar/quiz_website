/**
 * Skeleton.jsx
 * ─────────────────────────────────────────────
 * Reusable skeleton / shimmer placeholder components.
 * Use while data is loading to improve perceived performance.
 *
 * Exports:
 *   <Skeleton />          — generic rectangle
 *   <SkeletonCard />      — quiz card placeholder
 *   <SkeletonTable />     — table rows placeholder
 *   <SkeletonProfile />   — profile card placeholder
 */

import { motion } from "framer-motion";

/* ── Base shimmer rectangle ── */
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  );
}

/* ── Quiz card skeleton ── */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
      {/* accent bar */}
      <Skeleton className="mb-4 h-1.5 w-full rounded-full" />
      {/* badges */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-5 w-16" />
      </div>
      {/* title */}
      <Skeleton className="mb-3 h-5 w-3/4" />
      {/* description */}
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-5/6" />
      <Skeleton className="mb-5 h-3 w-2/3" />
      {/* meta */}
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* button */}
      <Skeleton className="mt-5 h-9 w-28 rounded-lg" />
    </div>
  );
}

/* ── Table rows skeleton ── */
export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={`h-4 ${c === 0 ? "w-8" : "flex-1"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Profile card skeleton ── */
export function SkeletonProfile() {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700">
      {/* avatar */}
      <Skeleton className="h-20 w-20 rounded-full" />
      {/* name */}
      <Skeleton className="mt-4 h-5 w-32" />
      {/* email */}
      <Skeleton className="mt-2 h-3 w-40" />
      {/* stats */}
      <div className="mt-6 w-full space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
