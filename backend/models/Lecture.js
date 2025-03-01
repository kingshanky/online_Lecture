const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor", required: true },
  date: { type: String, required: true }, // Store as YYYY-MM-DD to prevent time issues
  details: { type: String },
});

module.exports = mongoose.model("Lecture", LectureSchema);