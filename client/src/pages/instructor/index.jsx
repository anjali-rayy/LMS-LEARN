import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const { resetCredentials, auth } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  // Get instructor name from auth context
  const instructorName = auth?.user?.userName || auth?.user?.userEmail || "Instructor";
  const instructorEmail = auth?.user?.userEmail || "";
  
  // Get first name for welcome message
  const firstName = instructorName.includes('@') 
    ? instructorName.split('@')[0] 
    : instructorName.split(' ')[0];

  // Get initials for avatar
  const getInitials = (name) => {
    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Fetch courses from API
  async function fetchAllCourses() {
    try {
      const response = await fetchInstructorCourseListService();
      if (response?.success) setInstructorCoursesList(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setInstructorCoursesList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: (
        <InstructorDashboard
          listOfCourses={instructorCoursesList.length ? instructorCoursesList : []}
        />
      ),
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: (
        <InstructorCourses
          listOfCourses={instructorCoursesList.length ? instructorCoursesList : []}
        />
      ),
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          
          {/* Instructor Profile Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                {getInitials(instructorName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {instructorName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {instructorEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <User className="w-3 h-3 mr-1" />
              <span className="font-medium">Instructor</span>
            </div>
          </div>

          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {firstName}! 👋
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your courses today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logged in as</p>
                  <p className="font-semibold text-gray-900">{instructorName}</p>
                  <div className="flex items-center justify-end mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Profile Header */}
          <div className="md:hidden mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {getInitials(instructorName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {instructorName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {instructorEmail}
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your courses...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {menuItems.map((menuItem) => (
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {menuItem.component}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;