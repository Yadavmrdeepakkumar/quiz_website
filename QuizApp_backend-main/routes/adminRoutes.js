const express = require("express");
const router = express.Router();
const { createQuiz, deleteQuiz, getStats } = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

router.post("/create-quiz", protect, adminOnly, createQuiz);
router.delete("/delete-quiz/:id", protect, adminOnly, deleteQuiz);
router.get("/stats", protect, adminOnly, getStats);

module.exports = router;
