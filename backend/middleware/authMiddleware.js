
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Instructor = require("../models/Instructor");

const protect = (...roles) => async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);  

     
      if (decoded.role === "admin") {
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
          return next();
        }
      }

      if (decoded.role === "instructor") {
        const instructor = await Instructor.findById(decoded.id);
        if (instructor) {
          req.user = instructor;
          return next();
        }
      }

      return res.status(403).json({ message: "Access Denied" });
    } catch (error) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  }

  res.status(401).json({ message: "Not Authorized, No Token" });
};

module.exports = { protect };








