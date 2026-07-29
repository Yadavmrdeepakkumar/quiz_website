/**
 * main.jsx — Application Entry Point
 * ─────────────────────────────────────────────
 * Wraps the app with:
 *   • React.StrictMode  — dev warnings
 *   • BrowserRouter     — client-side routing
 *   • ThemeProvider      — dark / light mode
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
