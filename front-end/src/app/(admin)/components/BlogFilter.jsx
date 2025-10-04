import React, { useState } from "react";
import Select from "@/components/ui/Select";
import AddBlogDrawer from "./AddBlogDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const BlogFilter = ({ filters, onFilterChange, onBlogAdded }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Status: All" },
    { value: "published", label: "Published" },
    { value: "unpublished", label: "Unpublished" },
    { value: "draft", label: "Draft" },
  ];

  const visibilityOptions = [
    { value: "", label: "Visibility: All" },
    { value: "public", label: "Public" },
    { value: "users_only", label: "Users Only" },
    { value: "private", label: "Private" },
  ];

  const dateOptions = [
    { value: "", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (value) => {
    onFilterChange({ status: value });
  };

  const handleVisibilityChange = (value) => {
    onFilterChange({ visibility: value });
  };

  const handleDateChange = (value) => {
    let dateFrom = "";
    let dateTo = "";

    if (value === "7days") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      dateFrom = date.toISOString().split("T")[0];
    } else if (value === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      dateFrom = date.toISOString().split("T")[0];
    } else if (value === "3months") {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      dateFrom = date.toISOString().split("T")[0];
    }

    onFilterChange({ dateFrom, dateTo });
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative bg-white w-fit rounded-lg">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={handleStatusChange}
          placeholder="Status: All"
          className="w-40"
        />

        {/* Visibility Filter */}
        <Select
          options={visibilityOptions}
          value={filters.visibility}
          onChange={handleVisibilityChange}
          placeholder="Visibility: All"
          className="w-40"
        />

        {/* Date Filter */}
        <Select
          options={dateOptions}
          value=""
          onChange={handleDateChange}
          placeholder="Filter by date range"
          className="w-48"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Add Blog Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Create New Blog
        </button>
      </div>

      {/* Add Blog Drawer */}
      <AddBlogDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => {
          setIsDrawerOpen(false);
          onBlogAdded?.();
        }}
      />
    </div>
  );
};

export default BlogFilter;
