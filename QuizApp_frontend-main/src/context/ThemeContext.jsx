/**
 * ThemeContext.jsx
 * ─────────────────────────────────────────────
 * Provides a global dark-mode toggle using React Context.
 * Persists the user's preference in localStorage and
 * respects the system preference on first visit.
 *
 * Usage:
 *   <ThemeProvider> wraps <App />
 *   const { dark, toggleDark } = useTheme();
 */

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  /* ── initialise from localStorage or system preference ── */
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  /* ── sync <html> class & localStorage on every change ── */
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleDark = () => setDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Custom hook to consume the theme context */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
