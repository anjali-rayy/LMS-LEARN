const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Get all student view courses
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    // Build filters
    const filters = {};
    if (category) filters.category = { $in: category.split(",") };
    if (level) filters.level = { $in: level.split(",") };
    if (primaryLanguage) filters.primaryLanguage = { $in: primaryLanguage.split(",") };

    // Build sort parameters
    const sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    res.status(200).json({ success: true, data: coursesList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// Get details of a single course
const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({ success: true, data: courseDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// Check if student has purchased a course
const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    // Safely handle null or empty courses
    if (!studentCourses || !studentCourses.courses) {
      return res.status(200).json({ success: true, data: false });
    }

    const hasBoughtCourse = studentCourses.courses.some(
      (item) => item.courseId.toString() === id
    );

    res.status(200).json({ success: true, data: hasBoughtCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
};