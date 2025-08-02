import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Enrollments = ({ API, students, classes }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(`${API}/enrollments`);
      setEnrollments(res.data);
    } catch (error) {
      toast.error("Failed to fetch enrollments");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedClass) {
      return toast.error("Please select both student and class");
    }
    try {
      await axios.post(`${API}/enrollments`, {
        student: selectedStudent,
        class: selectedClass,
      });
      toast.success("Student enrolled");
      fetchEnrollments();
      setSelectedStudent("");
      setSelectedClass("");
      setShowForm(false);
    } catch {
      toast.error("Already enrolled or error");
    }
  };

  const handleUnenroll = async (studentId, classId) => {
    try {
      await axios.delete(`${API}/enrollments/${studentId}/${classId}`);
      toast.success("Unenrolled");
      fetchEnrollments();
    } catch {
      toast.error("Error");
    }
  };

  const filteredEnrollments = enrollments.filter(
    (en) =>
      en.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      en.class.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Enrollments</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search enrollments..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showForm ? "Hide Form" : "Enroll Student"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleEnrollment}
          className="mb-6 grid grid-cols-2 gap-4"
        >
          <select
            onChange={(e) => setSelectedStudent(e.target.value)}
            value={selectedStudent}
            className="border p-2"
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setSelectedClass(e.target.value)}
            value={selectedClass}
            className="border p-2"
            required
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded col-span-2"
          >
            Enroll Student
          </button>
        </form>
      )}

      <table className="w-full border mb-4 text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEnrollments.map((en) => (
            <tr key={en._id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{en.student.name}</td>
              <td className="p-2 border">{en.class.name}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleUnenroll(en.student._id, en.class._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Unenroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredEnrollments.length > itemsPerPage && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
