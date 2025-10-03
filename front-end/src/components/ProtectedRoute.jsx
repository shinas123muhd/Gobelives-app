"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  redirectTo = "/admin/login",
}) => {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If specific roles are required, check if user has any of them
      if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
        // Redirect to unauthorized page or dashboard
        router.push("/dashboard");
        return;
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    requiredRoles,
    hasAnyRole,
    router,
    redirectTo,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F6F5]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If roles are required and user doesn't have them, don't render children
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return null;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
