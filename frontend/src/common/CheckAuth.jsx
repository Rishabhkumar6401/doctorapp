import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, loading, children }) {
  const location = useLocation();

  console.log("Current Path:", location.pathname);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Loading State:", loading);

  // Ensure authentication checks only occur after loading completes
  if (loading) {
    console.log("Auth status loading...");
    return <div className="mt-52">Loading...</div>;
  }

  // Redirect authenticated users trying to access the login page
  if (isAuthenticated && location.pathname === "/admin/login") {
    console.log("Redirecting to dashboard...");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Redirect unauthenticated users trying to access admin routes
  if (!isAuthenticated && location.pathname.includes("/admin") && location.pathname !== "/admin/login") {
    console.log("Redirecting to login...");
    return <Navigate to="/admin/login" replace />;
  }

  // Render children when auth is confirmed
  return children;
}

export default CheckAuth;
