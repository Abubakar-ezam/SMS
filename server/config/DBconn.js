const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Abubakar315:ux19vqehIAnvXwZ7@cluster0.aaantbv.mongodb.net/StudentManagementSystem"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
