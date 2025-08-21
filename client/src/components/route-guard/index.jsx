import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  console.log("RouteGuard - authenticated:", authenticated, "user:", user, "location:", location.pathname);

  // If not authenticated and not on /auth, redirect to login
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  // If authenticated and on auth page, redirect based on role
  if (authenticated && location.pathname.includes("/auth")) {
    if (user?.role === "instructor") {
      console.log("Redirecting instructor to /instructor");
      return <Navigate to="/instructor" />;
    } else {
      console.log("Redirecting student to /");
      return <Navigate to="/" />;
    }
  }

  // If authenticated but user exists and role is not instructor, restrict instructor routes
  if (
    authenticated &&
    user?.role !== "instructor" &&
    location.pathname.includes("/instructor")
  ) {
    console.log("Non-instructor trying to access instructor route, redirecting to /");
    return <Navigate to="/" />;
  }

  // Render the element safely
  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;