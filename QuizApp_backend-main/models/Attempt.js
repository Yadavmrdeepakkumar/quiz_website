const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    quizTitle: { type: String },
    category: { type: String },
    answers: { type: [Number], default: [] },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number },
    status: { type: String, enum: ["pass", "fail"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);
