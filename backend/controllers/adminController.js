const Instructor = require("../models/Instructor");
const Course = require("../models/Course");
const Lecture = require("../models/Lecture");

// View Instructors
const getInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a Course
const addCourse = async (req, res) => {
  const { name, level, description, image } = req.body;

  try {
    // Check if a course with the same name already exists (case-insensitive)
    const existingCourse = await Course.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } });

    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    // If no duplicate, create the course
    const newCourse = new Course({ name, level, description, image });
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Course creation failed" });
  }
};






// ✅ Schedule a Lecture (Ensures No Date Clashes)
const scheduleLecture = async (req, res) => {
  const { courseId, instructorId, date, details } = req.body;

  try {
    // ✅ Convert date to a standard format (Optional)
    const lectureDate = new Date(date).toISOString().split("T")[0]; // Store only YYYY-MM-DD

    // ✅ Check if the instructor already has a lecture on the same date
    const existingLecture = await Lecture.findOne({
      instructorId,
      date: lectureDate, // Match exact date
    });

    if (existingLecture) {
      return res.status(400).json({
        message: `⚠️ The instructor already has a lecture scheduled on ${lectureDate}.`,
      });
    }

    // ✅ Create a new lecture
    const newLecture = new Lecture({
      courseId,
      instructorId,
      date: lectureDate,
      details,
    });

    await newLecture.save();

    res.status(201).json({
      message: "✅ Lecture scheduled successfully",
      lecture: newLecture,
    });
  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({ message: "Lecture scheduling failed" });
  }
};

module.exports = { getInstructors, addCourse, scheduleLecture };
