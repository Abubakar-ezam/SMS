const Student = require("../model/Students");

// Create Student
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get paginated + searched students
const getAllStudents = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const students = await Student.find({
      name: { $regex: search, $options: "i" },
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Student.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.json({
      students,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getAllStudents, // ✅ This now has pagination+search
  getStudentById,
  updateStudent,
  deleteStudent,
};
