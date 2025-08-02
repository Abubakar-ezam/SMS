const express = require("express");
const router = express.Router();
const {
  enrollStudent,
  getEnrollments,
  unenrollStudent,
  getEnrollmentsByClass,
} = require("../controllers/enrollmentController");

router.post("/", enrollStudent);
router.get("/", getEnrollments);
router.get("/:classId", getEnrollmentsByClass);
router.delete("/:studentId/:classId", unenrollStudent);

module.exports = router;
