const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("role", "Role must be admin or instructor").isIn(["admin", "instructor"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);





router.post(
  "/login",
  [
    body("email", "Include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);









// @desc   Get User Profile
// @route  GET /api/auth/me
router.get("/me", protect("admin", "instructor"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
