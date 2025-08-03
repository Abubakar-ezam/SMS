const Enrollment = require("../model/Enrollment");
const Student = require("../model/Students");
const Class = require("../model/Class");

exports.getAllEnrollments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    let query = {};
    if (search) {
      query = {
        $or: [
          { "studentId.name": { $regex: search, $options: "i" } },
          { "classId.name": { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalEnrollments = await Enrollment.countDocuments(query);
    const enrollments = await Enrollment.find(query)
      .populate("studentId")
      .populate("classId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      enrollments,
      currentPage: page,
      totalPages: Math.ceil(totalEnrollments / limit),
      totalEnrollments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate("studentId")
      .populate("classId");

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Student is already enrolled in this class" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("studentId")
      .populate("classId");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Student is already enrolled in this class" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
