import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  console.log("AdminRoute - Current user:", user);
  console.log("AdminRoute - Token:", token);
  console.log("AdminRoute - isAdmin status:", user?.isAdmin);
  console.log("AdminRoute - User object type:", typeof user);
  console.log("AdminRoute - isAdmin type:", typeof user?.isAdmin);
  console.log("AdminRoute - Full user object:", JSON.stringify(user, null, 2));

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!user || !token) {
    console.log("AdminRoute - No user or token found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Convert isAdmin to boolean explicitly
  const isAdmin = Boolean(user.isAdmin);
  console.log("AdminRoute - Converted isAdmin status:", isAdmin);

  if (!isAdmin) {
    console.log("AdminRoute - User is not admin, showing access denied");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Admin privileges required to access this page.
          </p>
        </div>
      </div>
    );
  }

  console.log("AdminRoute - Access granted to admin");
  return <>{children}</>;
};

export default AdminRoute;
