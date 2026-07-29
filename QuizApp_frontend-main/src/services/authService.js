/**
 * authService.js — Authentication API Endpoints
 * ─────────────────────────────────────────────
 * Service layer for login, register, and profile.
 *
 * Usage:
 *   import { login } from "@/services/authService";
 *   const { data } = await login({ email, password });
 */

import api from "./api";

export const login      = (credentials) => api.post("/auth/login", credentials);
export const register   = (userData)    => api.post("/auth/register", userData);
export const getProfile = ()            => api.get("/auth/profile");
