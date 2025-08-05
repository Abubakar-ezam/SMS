import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import StudentForm from "./StudentForm";

// Fetch students data
const fetchStudents = async (page = 1, search = "") => {
  const response = await fetch(
    `http://localhost:5000/api/students?page=${page}&limit=10&search=${search}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

// Delete student
const deleteStudent = async (id) => {
  const response = await fetch(`http://localhost:5000/api/students/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
};

const StudentsList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const queryClient = useQueryClient();


  const { data, isLoading, error } = useQuery({
    queryKey: ["students", currentPage, searchTerm],
    queryFn: () => fetchStudents(currentPage, searchTerm),
    keepPreviousData: true,
  });

 
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      toast.success("Student deleted successfully");
      queryClient.invalidateQueries(["students"]);
    },
    onError: () => {
      toast.error("Error deleting student");
    },
  });

 
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Student Information
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search students..."
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
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
          >
            Add Student
          </button>
        </div>
      </div>

      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries(["students"]);
            setIsFormOpen(false);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-500">
            Error fetching students. Please try again later.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.students?.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingStudent(student);
                              setIsFormOpen(true);
                            }}
                            className="bg-indigo-200 p-2 rounded text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-200 p-2 rounded text-red-600 hover:text-red-900"
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
            {data?.students?.length === 0 && !isLoading && (
              <div className="p-8 text-center text-gray-500">
                No students found. Add a new student to get started.
              </div>
            )}
          </>
        )}
      </div>
{/* pagination  */}
      {data?.totalPages > 1 && (
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
            Page {currentPage} of {data?.totalPages}
          </span>
          <button
            disabled={currentPage === data?.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === data?.totalPages
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

export default StudentsList;
