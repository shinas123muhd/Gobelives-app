import React, { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import CreateUserDrawer from "./CreateUserDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { useUserStats } from "../hooks/useUser";

const UserFilter = ({ filters, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.isActive || "");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch user stats for counts
  const { data: statsData } = useUserStats();
  const stats = statsData?.data || {};

  const statusOptions = [
    { value: "", label: "All Users" },
    { value: "true", label: "Active Users" },
    { value: "false", label: "Inactive Users" },
  ];

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "user", label: "Users" },
    { value: "admin", label: "Admins" },
    { value: "super_admin", label: "Super Admins" },
  ];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filters.search) {
        onFilterChange({ search: searchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    onFilterChange({ isActive: value });
  };

  const handleRoleFilterChange = (value) => {
    onFilterChange({ role: value });
  };

  return (
    <div className="flex flex-col gap-4 mt-6 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative bg-white rounded-lg ">
            <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
                 placeholder:text-[#8B909A] w-64"
            />
          </div>

          {/* Status Filter */}
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilterChange}
            placeholder="Filter by status"
            className="w-48"
          />

          {/* Role Filter */}
          <Select
            options={roleOptions}
            value={filters.role || ""}
            onChange={handleRoleFilterChange}
            placeholder="Filter by role"
            className="w-48"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Stats Display */}
          {stats.totalUsers && (
            <div className="text-sm text-gray-600">
              Total Users:{" "}
              <span className="font-semibold">{stats.totalUsers}</span>
            </div>
          )}

          {/* Add User Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-white group cursor-pointer
            text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
          >
            <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
            Add New User
          </button>
        </div>
      </div>

      {/* Create User Drawer */}
      <CreateUserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default UserFilter;
