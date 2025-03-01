const Lecture = require("../models/Lecture");
const Course = require("../models/Course");
const Instructor = require("../models/Instructor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerInstructor = async (req, res) => {
  console.log("📌 Register Instructor API called");

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  try {
    let instructor = await Instructor.findOne({ email });

    if (instructor) {
      console.log("⚠️ Instructor Already Exists");
      return res.status(400).json({ message: "Instructor already exists" });
    }

    //  Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    instructor = new Instructor({
      name,
      email,
      password: hashedPassword,
    });

    await instructor.save();
    console.log("✅ Instructor Registered Successfully:", instructor);

    res.status(201).json({ message: "Instructor registered successfully", instructor });
  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Instructor Login
const loginInstructor = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "❌ Email and password are required" });
  }

  try {
    //  Check if the instructor exists
    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "❌ Server error: Missing JWT_SECRET" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: instructor._id, role: "instructor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "✅ Instructor logged in successfully",
      token,
      instructor: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
      },
    });
  } catch (error) {
    console.error("🔥 Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Assigned Lectures for Logged-in Instructor
const getAssignedLectures = async (req, res) => {
  try {
    const instructorId = req.user.id;
    console.log("📌 Fetching lectures for instructor:", instructorId);

    const lectures = await Lecture.find({ instructorId })
      .populate("courseId", "name description") // Fetch course details
      .sort({ date: 1 }); // Sort by date

    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lectures" });
  }
};

// Export Controllers
module.exports = { registerInstructor, loginInstructor, getAssignedLectures };



