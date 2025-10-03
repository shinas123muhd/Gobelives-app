import React, { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const HotelFilter = ({ filters, onFilterChange, onCreateHotel }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [dateFilter, setDateFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Status: All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ];

  const dateOptions = [
    { value: "", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({ search: searchQuery });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onFilterChange]);

  // Handle status filter change
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    onFilterChange({ status: value });
  };

  // Handle date filter change
  const handleDateChange = (value) => {
    setDateFilter(value);

    let dateFrom = "";
    let dateTo = "";

    if (value === "7days") {
      dateFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (value === "30days") {
      dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (value === "3months") {
      dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    }

    onFilterChange({ dateFrom, dateTo });
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg ">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search..."
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
          onChange={handleStatusChange}
          placeholder="Status: All"
          className="w-40"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Add Hotel Button */}
        <button
          onClick={onCreateHotel}
          className="flex items-center gap-2 whitespace-nowrap bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Add Hotel
        </button>

        {/* Date Filter */}
        <Select
          options={dateOptions}
          value={dateFilter}
          onChange={handleDateChange}
          placeholder="Filter by date range"
          className="w-48"
        />
      </div>
    </div>
  );
};

export default HotelFilter;
