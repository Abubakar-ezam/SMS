import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      navigate("/dashboard"); // Redirect to dashboard if not a user
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <p className="mt-4">This is your profile page.</p>
      </div>
    </div>
  );
};

export default Profile;
