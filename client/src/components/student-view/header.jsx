import { TvMinimalPlay, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { auth, resetCredentials } = useContext(AuthContext);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Get student information
  const studentName = auth?.user?.userName || auth?.user?.userEmail || "Student";
  const studentEmail = auth?.user?.userEmail || "";
  
  // Get first name for welcome message
  const firstName = studentName.includes('@') 
    ? studentName.split('@')[0] 
    : studentName.split(' ')[0];

  // Get initials for avatar
  const getInitials = (name) => {
    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  // Close dropdown when clicking outside
  const handleDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/home" className="flex items-center hover:text-blue-600 transition-colors">
              <img 
                src="/logo.png" 
                alt="LMS Logo" 
                className="w-14 h-14 mr-3 object-contain"
              />
              <span className="font-bold text-2xl text-gray-900">
                LMS LEARN
              </span>
            </Link>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => {
                  !location.pathname.includes("/courses") && navigate("/courses");
                }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Explore Courses
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/student-courses")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-2"
              >
                <TvMinimalPlay className="w-4 h-4" />
                My Courses
              </Button>
            </div>
          </div>

          {/* Welcome Section and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message - Desktop */}
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-sm font-medium text-gray-900">
                Welcome back, {firstName}!
              </p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getInitials(studentName)}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {firstName}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-32">
                    Student
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {studentName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {studentEmail}
                    </p>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <div className="md:hidden py-2 border-b border-gray-100">
                    <button 
                      onClick={() => {
                        !location.pathname.includes("/courses") && navigate("/courses");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Explore Courses
                    </button>
                    <button 
                      onClick={() => {
                        navigate("/student-courses");
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <TvMinimalPlay className="w-4 h-4 mr-3" />
                      My Courses
                    </button>
                  </div>

                  <div className="py-2">
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;