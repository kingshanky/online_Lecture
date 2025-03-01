const express = require("express");
const { registerInstructor,loginInstructor, getAssignedLectures } = require("../controllers/instructorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", registerInstructor);


router.post("/login", loginInstructor);

router.get("/lectures", protect("instructor"), getAssignedLectures);

module.exports = router;
