import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const PackageFilter = ({ filters, onFiltersChange }) => {
  const router = useRouter();

  const statusOptions = [
    { value: "", label: "Status: All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "draft", label: "Draft" },
    { value: "suspended", label: "Suspended" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "tour", label: "Tour" },
    { value: "activity", label: "Activity" },
    { value: "experience", label: "Experience" },
    { value: "attraction", label: "Attraction" },
    { value: "accommodation", label: "Accommodation" },
  ];

  const featuredOptions = [
    { value: "", label: "All Packages" },
    { value: "true", label: "Featured Only" },
    { value: "false", label: "Non-Featured" },
  ];

  const handleCreatePackage = () => {
    router.push("/dashboard/destinations/packages/create");
  };

  const handleSearchChange = (e) => {
    onFiltersChange({ searchTerm: e.target.value });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ statusFilter: value });
  };

  const handleCategoryChange = (value) => {
    onFiltersChange({ categoryFilter: value });
  };

  const handleFeaturedChange = (value) => {
    onFiltersChange({ featuredFilter: value });
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-6">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg ">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search packages..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A]  min-w-64"
          />
        </div>

        {/* Category Filter */}
        <Select
          options={categoryOptions}
          value={filters.categoryFilter}
          onChange={handleCategoryChange}
          placeholder="All Categories"
          className="w-40"
        />

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters.statusFilter}
          onChange={handleStatusChange}
          placeholder="Status: All"
          className="w-40"
        />

        {/* Featured Filter */}
        <Select
          options={featuredOptions}
          value={filters.featuredFilter}
          onChange={handleFeaturedChange}
          placeholder="All Packages"
          className="w-40"
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
