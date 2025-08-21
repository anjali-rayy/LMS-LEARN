import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    deleteCourse,
    instructorCoursesList,
    setInstructorCoursesList,
  } = useContext(InstructorContext);

  const handleDeleteClick = (courseId) => {
    setCourseToDelete(courseId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      setIsDeleting(true);
      try {
        const response = await deleteCourse(courseToDelete);
        
        if (response.success) {
          // Update the courses list by filtering out the deleted course
          const updatedCourses = listOfCourses.filter(
            course => course._id !== courseToDelete
          );
          setInstructorCoursesList(updatedCourses);
          
          // Reset modal state
          setShowDeleteModal(false);
          setCourseToDelete(null);
          
          console.log("Course deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="p-6"
          >
            Create New Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses && listOfCourses.length > 0
                  ? listOfCourses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell className="font-medium">
                          {course?.title}
                        </TableCell>
                        <TableCell>{course?.students?.length}</TableCell>
                        <TableCell>
                          ${course?.students?.length * course?.pricing}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => {
                              navigate(`/instructor/edit-course/${course?._id}`);
                            }}
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-6 w-6" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteClick(course?._id)}
                            variant="ghost" 
                            size="sm"
                          >
                            <Delete className="h-6 w-6" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              localhost:5173 says
            </h3>
            <p className="mb-6">Are you sure you want to delete this course?</p>
            <div className="flex justify-end space-x-3">
              <Button 
                onClick={cancelDelete}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "OK"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InstructorCourses;