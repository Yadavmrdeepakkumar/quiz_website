const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");

/**
 * GET /api/quiz
 * List all active quizzes (questions stripped — only count sent).
 */
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ status: "Active" }).sort({ createdAt: -1 });

    const result = quizzes.map((q) => {
      const obj = q.toObject();
      return {
        _id: obj._id,
        title: obj.title,
        category: obj.category,
        difficulty: obj.difficulty,
        description: obj.description,
        duration: obj.duration,
        questions: obj.questions.length, // send count, not questions
        status: obj.status,
        createdAt: obj.createdAt,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * GET /api/quiz/:id
 * Get a single quiz with full questions (for playing).
 */
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * POST /api/quiz/submit
 * Submit quiz answers, calculate score, save attempt.
 */
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    const total = quiz.questions.length;

    quiz.questions.forEach((question, index) => {
      if (answers && answers[index] === question.answer) {
        score++;
      }
    });

    const percentage = Math.round((score / total) * 100);
    const status = percentage >= 50 ? "pass" : "fail";

    // Save attempt
    const attempt = await Attempt.create({
      user: req.user._id,
      quiz: quiz._id,
      quizTitle: quiz.title,
      category: quiz.category,
      answers: answers || [],
      score,
      total,
      percentage,
      status,
    });

    res.json({
      score,
      total,
      percentage,
      status,
      attemptId: attempt._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * GET /api/student/history
 * Return the authenticated student's quiz attempt history.
 */
exports.getStudentHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("quiz", "title category");

    const history = attempts.map((a) => ({
      _id: a._id,
      title: a.quizTitle || a.quiz?.title || "Quiz",
      category: a.category || a.quiz?.category || "General",
      score: a.percentage || Math.round((a.score / a.total) * 100),
      total: 100,
      date: a.createdAt,
      status: a.status,
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
