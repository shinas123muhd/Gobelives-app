"use client";
import React, { useState } from "react";
import UserFilter from "@/app/(admin)/components/UserFilter";
import UserTable from "@/app/(admin)/components/UserTable";
import UserPagination from "@/app/(admin)/components/UserPagination";

const Users = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    isActive: "",
    search: "",
    role: "",
    tier: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <UserFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Table Section */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <UserTable filters={filters} />
        <UserPagination
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>
    </section>
  );
};

export default Users;
