const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [(v) => v.length >= 2, "At least 2 options required"],
    },
    answer: { type: Number, required: true },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    category: { type: String, default: "General" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    description: { type: String, default: "" },
    duration: { type: String, default: "10 min" },
    timePerQuestion: { type: Number, default: 30 },
    questions: {
      type: [questionSchema],
      required: true,
      validate: [(v) => v.length >= 1, "At least 1 question required"],
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
