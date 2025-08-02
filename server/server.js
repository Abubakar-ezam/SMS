const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const DBconn = require("./config/DBconn");


const studentRoutes = require("./routes/student.routes");
const classRoutes = require("./routes/classs.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");

dotenv.config();
const app = express();

const cors = require("cors");
app.use(cors());
// Database connection
DBconn()
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
