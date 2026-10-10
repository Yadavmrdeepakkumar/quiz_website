const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initDatabase } = require("./seed");

/* ── Load environment variables ── */
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET is not defined. Falling back to a default development secret.");
  process.env.JWT_SECRET = "quizmaster_dev_secret";
}

if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI is not defined. Falling back to local MongoDB: mongodb://127.0.0.1:27017/quizapp");
  process.env.MONGO_URI = "mongodb://127.0.0.1:27017/quizapp";
}

const app = express();

/* ═══════════════════════════════════════════
   MIDDLEWARE
   ═══════════════════════════════════════════ */
app.use(cors());
app.use(express.json());

/* ── Startup helper ── */
async function startServer() {
  await connectDB();
  await initDatabase();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Startup failed:", err.message);
  process.exit(1);
});

/* ═══════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ── Root route ── */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "QuizMaster API is running 🚀" });
});

/* ── Health check ── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "QuizMaster API is running 🚀" });
});

/* ── 404 handler ── */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ── Global error handler ── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

