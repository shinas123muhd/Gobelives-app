import React, { useState } from "react";
import Select from "@/components/ui/Select";
import AddImageDrawer from "./AddImageDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const GalleryFilter = ({ filters, onFilterChange }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const featuredOptions = [
    { value: "", label: "Featured: All" },
    { value: "true", label: "Featured" },
    { value: "false", label: "Not Featured" },
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

  const handleFeaturedChange = (value) => {
    // Convert empty string to undefined to not filter by featured
    onFilterChange({ featured: value === "" ? undefined : value });
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
            placeholder="Search images..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
          />
        </div>

        {/* Featured Filter */}
        <Select
          options={featuredOptions}
          value={filters.featured}
          onChange={handleFeaturedChange}
          placeholder="Featured: All"
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
        {/* Add Image Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Add New Image
        </button>
      </div>

      {/* Add Image Drawer */}
      <AddImageDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => {
          setIsDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default GalleryFilter;
