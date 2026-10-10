const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Attempt = require("../models/Attempt");

/**
 * POST /api/admin/create-quiz
 * Create a new quiz (admin only).
 */
exports.createQuiz = async (req, res) => {
  try {
    const { title, category, difficulty, description, duration, timePerQuestion, questions } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    const quiz = await Quiz.create({
      title,
      category: category || "General",
      difficulty: difficulty || "Easy",
      description: description || "",
      duration: duration || `${Math.ceil((questions.length * (timePerQuestion || 30)) / 60)} min`,
      timePerQuestion: timePerQuestion || 30,
      questions,
      status: "Active",
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * DELETE /api/admin/delete-quiz/:id
 * Delete a quiz and all its attempts (admin only).
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    await Attempt.deleteMany({ quiz: req.params.id });

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * GET /api/admin/stats
 * Return comprehensive admin dashboard analytics.
 */
exports.getStats = async (req, res) => {
  try {
    // Counts
    const totalQuizzes = await Quiz.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAttempts = await Attempt.countDocuments();

    // Average score
    const avgResult = await Attempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$percentage" } } },
    ]);
    const avgScore = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    // Total questions across all quizzes
    const quizzes = await Quiz.find().select("questions title category");
    const totalQuestions = quizzes.reduce((acc, q) => acc + q.questions.length, 0);

    // Recent attempts with student names (student results table)
    const recentAttempts = await Attempt.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name")
      .populate("quiz", "title");

    const studentResults = recentAttempts.map((a) => ({
      id: a._id,
      name: a.user?.name || "Student",
      quiz: a.quizTitle || a.quiz?.title || "Quiz",
      score: a.score,
      total: a.total,
      date: a.createdAt,
      percentage: a.percentage,
    }));

    // Category distribution (pie chart)
    const categoryDist = {};
    quizzes.forEach((q) => {
      const cat = q.category || "Other";
      categoryDist[cat] = (categoryDist[cat] || 0) + 1;
    });
    const pieData = Object.entries(categoryDist).map(([name, value]) => ({ name, value }));

    // Quiz-wise student count (bar chart)
    const quizAttemptCounts = await Attempt.aggregate([
      { $group: { _id: "$quiz", count: { $sum: 1 } } },
      { $lookup: { from: "quizzes", localField: "_id", foreignField: "_id", as: "quiz" } },
      { $unwind: { path: "$quiz", preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ["$quiz.title", "Unknown"] }, students: "$count" } },
      { $sort: { students: -1 } },
      { $limit: 5 },
    ]);
    const barData = quizAttemptCounts.map((q) => ({
      name: q.name.length > 12 ? q.name.substring(0, 12) + "…" : q.name,
      students: q.students,
    }));

    // Monthly attempts — last 6 months (line chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAttempts = await Attempt.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          attempts: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lineData = monthlyAttempts.map((m) => ({
      month: monthNames[parseInt(m._id.split("-")[1]) - 1],
      attempts: m.attempts,
    }));

    res.json({
      totalQuizzes,
      totalStudents,
      totalAttempts,
      totalQuestions,
      avgScore: `${avgScore}%`,
      studentResults,
      pieData,
      barData,
      lineData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
