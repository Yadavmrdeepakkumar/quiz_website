const express = require("express");
const router = express.Router();
const { getQuizzes, getQuizById, submitQuiz } = require("../controllers/quizController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getQuizzes);
router.post("/submit", protect, submitQuiz);
router.get("/:id", protect, getQuizById);

module.exports = router;
