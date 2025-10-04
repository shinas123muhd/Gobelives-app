"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLoading from "./ui/DashboardLoading";

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
      <DashboardLoading
        message="Authenticating..."
        showSkeleton={true}
        fullScreen={true}
      />
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
