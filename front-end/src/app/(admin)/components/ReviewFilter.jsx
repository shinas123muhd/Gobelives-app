import React, { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { ReviewFilterShimmer } from "./ReviewShimmer";

const ReviewFilter = ({
  filters = {},
  onFiltersChange = () => {},
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const statusOptions = [
    { value: "all", label: "All Reviews" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Newest First" },
    { value: "-createdAt", label: "Oldest First" },
    { value: "rating", label: "Rating: Low to High" },
    { value: "-rating", label: "Rating: High to Low" },
    { value: "status", label: "Status" },
  ];

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFiltersChange({ search: searchTerm });
    }, 800); // Increased debounce time to reduce API calls

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onFiltersChange]);

  const handleStatusChange = (value) => {
    onFiltersChange({ status: value });
  };

  const handleRatingChange = (value) => {
    onFiltersChange({ rating: value });
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.startsWith("-")
      ? [value.substring(1), "desc"]
      : [value, "asc"];
    onFiltersChange({ sortBy, sortOrder });
  };

  if (loading) {
    return <ReviewFilterShimmer />;
  }

  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg ">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters.status || "all"}
          onChange={handleStatusChange}
          placeholder="Filter by status"
          className="w-48"
          disabled={loading}
        />

        {/* Rating Filter */}
        <Select
          options={ratingOptions}
          value={filters.rating || "all"}
          onChange={handleRatingChange}
          placeholder="Filter by rating"
          className="w-40"
          disabled={loading}
        />

        {/* Sort Filter */}
        <Select
          options={sortOptions}
          value={`${filters.sortOrder === "desc" ? "-" : ""}${
            filters.sortBy || "createdAt"
          }`}
          onChange={handleSortChange}
          placeholder="Sort by"
          className="w-48"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setSearchTerm("");
            onFiltersChange({
              search: "",
              status: "all",
              rating: "all",
              sortBy: "createdAt",
              sortOrder: "desc",
            });
          }}
          disabled={loading}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear Filters
        </button>

        {/* Export Reviews Button */}
        <button
          disabled={loading}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Export Reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewFilter;
