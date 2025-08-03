import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-500">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 text-center"
      >
        <motion.h1
          animate={isAnimating ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          onAnimationComplete={() => setIsAnimating(false)}
          className="text-4xl font-bold text-gray-800 mb-6"
        >
          WELCOME to SMS
        </motion.h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Student Management System helps you efficiently manage student
          records, class enrollments, and academic information in one
          centralized platform.
        </p>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
          onClick={() => navigate("/dashboard")}
        >
          GET STARTED
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
