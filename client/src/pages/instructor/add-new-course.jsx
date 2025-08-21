import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  // --- Safe param handling ---
  useEffect(() => {
    if (params?.courseId) {
      setCurrentEditedCourseId(params.courseId);
    }
  }, [params?.courseId]);

  // --- Fetch course details if editing ---
  useEffect(() => {
    async function fetchCourse() {
      if (!currentEditedCourseId) return;

      const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
      if (response?.success) {
        const filledLandingData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
          acc[key] = response.data[key] ?? courseLandingInitialFormData[key];
          return acc;
        }, {});
        setCourseLandingFormData(filledLandingData);
        setCourseCurriculumFormData(response.data?.curriculum || []);
      }
    }

    fetchCourse();
  }, [currentEditedCourseId]);

  // --- Form validation ---
  const isEmpty = (value) => value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0);

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) return false;
      if (item.freePreview) hasFreePreview = true;
    }

    return hasFreePreview;
  };

  // --- Create or update course ---
  const handleCreateCourse = async () => {
    const courseData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    const response = currentEditedCourseId
      ? await updateCourseByIdService(currentEditedCourseId, courseData)
      : await addNewCourseService(courseData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCurrentEditedCourseId(null);
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-extrabold">Create a New Course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>

      <Card>
        <CardContent>
          <Tabs defaultValue="curriculum" className="space-y-4">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <CourseCurriculum />
            </TabsContent>
            <TabsContent value="course-landing-page">
              <CourseLanding />
            </TabsContent>
            <TabsContent value="settings">
              <CourseSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
