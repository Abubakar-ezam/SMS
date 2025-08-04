const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs"); // Add bcryptjs import
const jwt = require("jsonwebtoken"); // Add jwt import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(
    "mongodb+srv://Abubakar315:ux19vqehIAnvXwZ7@cluster0.aaantbv.mongodb.net/STDMIS"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/classes", require("./routes/classRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// User Schema (Model)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "user"] },
});

const User = mongoose.model("users", userSchema);

// Middleware to authenticate JWT Token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Controller (Login Logic)
const loginController = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      if(role === "admin" && password !== password) {
      return res.status(400).json({ message: "User not found" });
    }
  }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return user data along with token
    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Use POST method for login route
app.post("/api/login", loginController);

// Protected Routes (Admin and User pages)
app.get("/api/dashboard", authenticate, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  res.json({ message: "Welcome to the Admin Dashboard" });
});

app.get("/api/profile", authenticate, (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  res.json({ message: "Welcome to your Profile" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
