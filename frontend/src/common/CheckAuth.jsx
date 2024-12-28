import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

function CheckAuth({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = async () => {
      try {
        console.log("Checking auth...");
        const response = await axios.get("http://localhost:5000/api/checkauth", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        console.log("Auth check success:", response.data);
        setIsAuthenticated(response.data.success);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location]);

  console.log("Current Path:", location.pathname);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Loading State:", loading);

  // Show a loading indicator while the auth check is in progress
  if (loading) {
    // console.log("Auth status loading...");
    return (
      <div className="flex justify-center items-center mt-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
