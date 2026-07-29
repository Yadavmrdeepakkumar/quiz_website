/**
 * dashboardService.js — Dashboard / Analytics API Endpoints
 * ─────────────────────────────────────────────
 * Service layer for student dashboard & admin analytics.
 */

import api from "./api";

/* ── Student dashboard ── */
export const getStudentHistory = () => api.get("/student/history");

/* ── Admin dashboard ── */
export const getAdminStats = () => api.get("/admin/stats");
