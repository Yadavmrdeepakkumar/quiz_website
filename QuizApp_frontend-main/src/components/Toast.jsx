/**
 * Toast.jsx — Toast Notification System
 * ─────────────────────────────────────────────
 * Provides a context-based toast queue with 4 types:
 *   success · error · info · warning
 * Features AnimatePresence slide-in/out, auto-dismiss,
 * and dark-mode support.
 *
 * Usage:
 *   const toast = useToast();
 *   toast("Saved!", "success");
 */

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

/* ── Icon map ── */
const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

/* ── Light / Dark colour map ── */
const colors = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700",
  error: "bg-red-50 text-red-800 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700",
  info: "bg-blue-50 text-blue-800 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700",
  warning: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-amber-500",
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      {/* toast container */}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex flex-col gap-3 sm:right-6">
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const Icon = icons[type];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl p-4 shadow-lg ring-1 ${colors[type]}`}
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[type]}`} />
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                  onClick={() => removeToast(id)}
                  className="shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
