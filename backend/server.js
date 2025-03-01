require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Connect to MongoDB
connectDB();

const app = express();

//  Middleware
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

//  Import Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const instructorRoutes = require("./routes/instructorRoutes");

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructor", instructorRoutes);

//  Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
