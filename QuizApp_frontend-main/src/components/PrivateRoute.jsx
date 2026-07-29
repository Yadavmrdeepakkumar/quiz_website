/**
 * PrivateRoute.jsx — Route Guard
 * ─────────────────────────────────────────────
 * Protects routes that require authentication.
 * Optionally restricts to admin role.
 * Redirects unauthenticated users to /login.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
