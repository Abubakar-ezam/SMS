import React, { useState, useEffect } from "react";
import axios from "axios";
import EnrollmentForm from "./EnrollmentForm";
import { toast } from "react-toastify";

const EnrollmentsList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchEnrollments = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/enrollments?page=${page}&limit=10&search=${search}`
      );
      setEnrollments(response.data.enrollments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error fetching enrollments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data.students);
    } catch (error) {
      toast.error("Error fetching students");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/classes");
      setClasses(response.data.classes);
    } catch (error) {
      toast.error("Error fetching classes");
    }
  };

  useEffect(() => {
    fetchEnrollments(currentPage, searchTerm);
    fetchStudents();
    fetchClasses();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/enrollments/${id}`);
        toast.success("Enrollment deleted successfully");
        fetchEnrollments(currentPage, searchTerm);
      } catch (error) {
        toast.error("Error deleting enrollment");
      }
    }
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Enrollment Information
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search enrollments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => {
              setEditingEnrollment(null);
              setIsFormOpen(true);
            }}
          >
            Add Enrollment
          </button>
        </div>
      </div>

      {isFormOpen && (
        <EnrollmentForm
          enrollment={editingEnrollment}
          students={students}
          classes={classes}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            fetchEnrollments(currentPage, searchTerm);
            setIsFormOpen(false);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enrollments...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enrollment.studentId?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.classId?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingEnrollment(enrollment);
                              setIsFormOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(enrollment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {enrollments.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500">
                No enrollments found. Add a new enrollment to get started.
              </div>
            )}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsList;
