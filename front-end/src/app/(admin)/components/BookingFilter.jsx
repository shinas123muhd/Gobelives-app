import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline } from "react-icons/io5";

const BookingFilter = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const dateOptions = [
    { value: "all", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  const tabs = [
    { id: "pending", label: "Pending", count: 120 },
    { id: "confirmed", label: "Confirmed", count: 82 },
    { id: "completed", label: "Completed", count: 76 },
    { id: "cancelled", label: "Cancelled", count: 8 },
  ];

  return (
    <div className=" rounded-lg py-4 ">
      {/* Tab Selection Filter */}
      <div className="flex items-center gap-8 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-[#1D332C] border-b-2 border-[#1D332C]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                tab.id === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search by Booking id"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border border-gray-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#1D332C] focus:border-transparent
              placeholder:text-[#8B909A]"
          />
        </div>

        {/* Date Range Filter */}
        <div className="w-48">
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Filter by date range"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingFilter;
