"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const Admin = ({ children }) => {
  return (
    <ProtectedRoute requiredRoles={["admin", "super_admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

export default Admin;
