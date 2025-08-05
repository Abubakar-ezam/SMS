import React, { useState, useEffect } from "react";
import Sidebar from "../Component/Layout/Sidebar";
import StudentsList from "../Component/Students/StudentsList";
import ClassesList from "../Component/Classes/ClassesList";
import EnrollmentsList from "../Component/Enrollments/EnrollmentsList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const navigate = useNavigate();

  // Redirect if user is not admin
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/dashboard"); // Redirect to profile page if not admin
    }
  }, [navigate]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "students":
        return <StudentsList />;
      case "classes":
        return <ClassesList />;
      case "enrollments":
        return <EnrollmentsList />;
      default:
        return <StudentsList />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">{renderActiveTab()}</div>
    </div>
  );
};

export default Dashboard;
