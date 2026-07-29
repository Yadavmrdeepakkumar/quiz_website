/**
 * api.js — Axios Instance & Interceptors
 * ─────────────────────────────────────────────
 * Central Axios instance configured with:
 *   • Base URL from environment variable
 *   • Request interceptor  — attaches JWT token
 *   • Response interceptor — global error handling
 *
 * Usage:
 *   import api from "@/services/api";
 *   const { data } = await api.get("/quizzes");
 */

import axios from "axios";

/* ── Create instance with env-based base URL ── */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ═══════════════════════════════════════════
   REQUEST INTERCEPTOR
   – Attaches the auth token (if present) to
     every outgoing request.
   ═══════════════════════════════════════════ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ═══════════════════════════════════════════
   RESPONSE INTERCEPTOR
   – Handles common HTTP errors globally.
   – 401 → clear token and redirect to /login.
   ═══════════════════════════════════════════ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Don't redirect for auth endpoints (login/register 401 = wrong creds)
      const isAuthEndpoint = error.config?.url?.includes("/auth/");
      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
