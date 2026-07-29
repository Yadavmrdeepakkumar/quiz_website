/**
 * AuthContext.jsx — Authentication State Management
 * ─────────────────────────────────────────────
 * Provides auth state (user, token) and actions
 * (login, register, logout) via React context.
 * JWT token is persisted in localStorage.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, register as registerAPI } from "../services/authService";

const AuthContext = createContext(null);

/* ── Helper: decode JWT payload (no library needed) ── */
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    return t ? decodeToken(t) : null;
  });

  /* Keep user in sync when token changes */
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(decodeToken(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  /* ── Actions ── */
  const login = async (credentials) => {
    const { data } = await loginAPI(credentials);
    setToken(data.token);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerAPI(userData);
    return data;
  };

  const logout = () => {
    setToken(null);
  };

  /* ── Derived ── */
  const isAuthenticated = !!token;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
