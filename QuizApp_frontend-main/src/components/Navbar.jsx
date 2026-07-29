/**
 * Navbar.jsx — Main Navigation Bar
 * ─────────────────────────────────────────────
 * Features:
 *   • Sticky glassmorphism bar with scroll shadow
 *   • Desktop + mobile responsive navigation
 *   • Dark / Light mode toggle (Sun / Moon)
 *   • Animated underline on active link (layoutId)
 *   • Body-scroll lock when mobile menu is open
 */

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Home,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

/* ── Navigation link config ── */
const allLinks = [
  { name: "Home", path: "/", icon: Home, auth: "any" },
  { name: "Quizzes", path: "/quizzes", icon: BookOpen, auth: "loggedIn" },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, auth: "loggedIn" },
  { name: "Login", path: "/login", icon: LogIn, auth: "loggedOut" },
  { name: "Register", path: "/register", icon: UserPlus, auth: "loggedOut" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { dark, toggleDark } = useTheme();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  /* ── Build visible links based on auth state ── */
  const navLinks = useMemo(() => {
    return allLinks.filter(({ auth }) => {
      if (auth === "any") return true;
      if (auth === "loggedIn") return isAuthenticated;
      if (auth === "admin") return isAuthenticated && isAdmin;
      if (auth === "loggedOut") return !isAuthenticated;
      return true;
    });
  }, [isAuthenticated, isAdmin]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ───── close mobile menu on route change ───── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* ───── shadow on scroll ───── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ───── lock body scroll when menu open ───── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 shadow-lg backdrop-blur-md dark:bg-gray-900/80"
          : "bg-white/70 backdrop-blur-sm dark:bg-gray-900/70"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 group">
          <Brain className="h-8 w-8 text-indigo-600 transition-transform duration-300 group-hover:rotate-12 dark:text-indigo-400" />
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Quiz<span className="text-indigo-600 dark:text-indigo-400">Master</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ name, path, icon: Icon }) => {
            const active = pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-950"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {name}

                  {/* active underline indicator */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
          {isAuthenticated && (
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-950 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* ── Right side: theme toggle + hamburger ── */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              {dark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* ── Hamburger button ── */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* slide-down panel */}
            <motion.ul
              key="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute left-0 right-0 top-16 z-50 flex flex-col gap-1 rounded-b-2xl bg-white p-4 shadow-xl md:hidden dark:bg-gray-900"
            >
              {navLinks.map(({ name, path, icon: Icon }, i) => {
                const active = pathname === path;
                return (
                  <motion.li
                    key={path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={path}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        active
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-indigo-950 dark:hover:text-indigo-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {name}
                    </Link>
                  </motion.li>
                );
              })}
              {isAuthenticated && (
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </motion.li>
              )}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
