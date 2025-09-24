import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const PackageFilter = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const router = useRouter();

  const statusOptions = [
    { value: "all", label: "Status: All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const dateOptions = [
    { value: "all", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "beach", label: "Beach" },
    { value: "mountain", label: "Mountain" },
    { value: "city", label: "City" },
  ];

  const handleCreatePackage = () => {
    router.push("/dashboard/destinations/packages/create");
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-6">
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg overflow-hidden">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search packages..."
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
          />
        </div>

        {/* Category Filter */}
        <Select
          options={categoryOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
          placeholder="All Categories"
          className="w-40"
        />

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status: All"
          className="w-40"
        />

        {/* Date Filter */}
        <Select
          options={dateOptions}
          value={dateFilter}
          onChange={setDateFilter}
          placeholder="Filter by date range"
          className="w-48"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Create Package Button */}
        <button
          onClick={handleCreatePackage}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Add Package
        </button>
      </div>
    </div>
  );
};

export default PackageFilter;
