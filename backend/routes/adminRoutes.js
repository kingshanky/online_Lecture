const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getInstructors, addCourse, scheduleLecture } = require("../controllers/adminController");

const router = express.Router();

router.get("/instructors", protect("admin"), getInstructors);
router.post("/courses", protect("admin"), addCourse);
router.post("/schedule-lecture", protect("admin"), scheduleLecture);

module.exports = router;
