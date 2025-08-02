const Enrollment = require("../model/enrollment");

const enrollStudent = async (req, res) => {
  try {
    const existingEnrollment = await Enrollment.findOne({
      student: req.body.student,
      class: req.body.class,
    });
    if (existingEnrollment)
      return res.status(400).json({ message: "Student already enrolled" });

    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("student class");
    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unenrollStudent = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.params.studentId,
      class: req.params.classId,
    });
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });
    res.json({ message: "Student unenrolled" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEnrollmentsByClass = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      class: req.params.classId,
    }).populate("student");
    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  enrollStudent,
  getEnrollments,
  unenrollStudent,
  getEnrollmentsByClass,
};
