import React, { useState } from "react";
import Select from "@/components/ui/Select";
import CreateUserDrawer from "./CreateUserDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const UserFilter = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Users" },
    { value: "active", label: "Active Users" },
    { value: "inactive", label: "Inactive Users" },
    { value: "verified", label: "Verified Users" },
    { value: "unverified", label: "Unverified Users" },
  ];

  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg overflow-hidden">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search..."
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
          className="w-48"
        />
      </div>

      <div className="flex items-center gap-4">
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

      {/* Create User Drawer */}
      <CreateUserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default UserFilter;
