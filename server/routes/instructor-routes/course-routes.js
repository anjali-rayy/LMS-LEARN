const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  deleteCourseByID, // ✅ Add this import
} = require("../../controllers/instructor-controller/course-controller");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.put("/update/:id", updateCourseByID);
router.delete("/delete/:id", deleteCourseByID); // ✅ Add this delete route

module.exports = router;