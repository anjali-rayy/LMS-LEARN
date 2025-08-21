import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  BookOpen, 
  Clock
} from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Get first name for welcome message
  const firstName = auth?.user?.userName?.includes('@') 
    ? auth?.user?.userName.split('@')[0] 
    : auth?.user?.userName?.split(' ')[0] || auth?.user?.userEmail?.split('@')[0] || "Student";

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content - starts directly after header */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-12 px-4 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <User className="w-4 h-4 mr-1" />
              Student Dashboard
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              Learning that gets you
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Skills for your present and your future, {firstName}. Get Started with US
            </p>
            
            {/* Quick Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                <span>{studentViewCoursesList?.length || 0} Courses Available</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-green-500" />
                <span>Learn at your pace</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-full">
          <img
            src="/banner-img.png"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
            alt="Learning Banner"
          />
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Categories</h2>
            <p className="text-sm text-gray-600">Choose your learning path, {firstName}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                className="justify-start h-12 text-left hover:scale-105 transition-transform duration-200"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-sm text-gray-600">Recommended for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <div
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 bg-white"
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className="w-full h-40 object-cover"
                    alt={courseItem?.title}
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2 text-gray-900 line-clamp-2">
                      {courseItem?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {courseItem?.instructorName}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg text-green-600">
                        ${courseItem?.pricing}
                      </p>
                      <div className="text-xs text-gray-500">
                        Click to view
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto mb-2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
                <p className="text-gray-600">Check back later for new courses!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;