import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { deleteCourseService } from "@/services";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  // ✅ ADD DELETE COURSE FUNCTION
  const deleteCourse = async (courseId) => {
    try {
      const response = await deleteCourseService(courseId);
      return response;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        deleteCourse, // ✅ Add this to context value
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}