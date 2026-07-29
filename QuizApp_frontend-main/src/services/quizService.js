/**
 * quizService.js — Quiz API Endpoints
 * ─────────────────────────────────────────────
 * Service layer for all quiz-related API calls.
 * Each function returns an Axios promise.
 *
 * Usage:
 *   import { getQuizzes } from "@/services/quizService";
 *   const { data } = await getQuizzes();
 */

import api from "./api";

/* ── Quiz CRUD ── */
export const getQuizzes      = (params) => api.get("/quiz", { params });
export const getQuizById     = (id)     => api.get(`/quiz/${id}`);

/* ── Quiz attempt ── */
export const submitQuiz      = (answers) => api.post("/quiz/submit", answers);

/* ── Admin quiz management ── */
export const createQuiz      = (data)   => api.post("/admin/create-quiz", data);
export const deleteQuiz      = (id)     => api.delete(`/admin/delete-quiz/${id}`);
