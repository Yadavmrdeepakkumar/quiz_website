const express = require("express");
const router = express.Router();
const { getStudentHistory } = require("../controllers/quizController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/history", protect, getStudentHistory);

module.exports = router;
