import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Students from "./Component/Students";
import Classes from "./Component/Classes";
import Enrollments from "./Component/Enrollments";

const API = "http://localhost:5000/api";

export default function App() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get(`${API}/students`);
    setStudents(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get(`${API}/classes`);
    setClasses(res.data);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management System</h1>
      </div>

      <Students API={API}  />
      <Classes API={API} />
      <Enrollments API={API} students={students} classes={classes} />
    </div>
  );
}
