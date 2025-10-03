import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const ReviewFilter = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

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

        {/* Rating Filter */}
        <Select
          options={ratingOptions}
          value={ratingFilter}
          onChange={setRatingFilter}
          placeholder="Filter by rating"
          className="w-40"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Export Reviews Button */}
        <button
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Export Reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewFilter;
