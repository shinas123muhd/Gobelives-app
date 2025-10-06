import React, { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline } from "react-icons/io5";
import { useBookingStats } from "../hooks/useBooking";

const BookingFilter = ({ filters, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch booking stats for counts
  const { data: statsData } = useBookingStats();
  const stats = statsData?.data || {};

  const dateOptions = [
    { value: "all", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  const tabs = [
    { id: "", label: "All", count: stats.totalBookings || 0 },
    { id: "pending", label: "Pending", count: stats.pendingBookings || 0 },
    {
      id: "confirmed",
      label: "Confirmed",
      count: stats.confirmedBookings || 0,
    },
    {
      id: "completed",
      label: "Completed",
      count: stats.completedBookings || 0,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: stats.cancelledBookings || 0,
    },
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

  const handleDateFilterChange = (value) => {
    setDateFilter(value);

    const now = new Date();
    let startDate = null;

    switch (value) {
      case "7days":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "30days":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "3months":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      default:
        startDate = null;
    }

    onFilterChange({
      startDate: startDate ? startDate.toISOString() : null,
    });
  };

  return (
    <div className=" rounded-lg py-4 ">
      {/* Tab Selection Filter */}
      <div className="flex items-center gap-8 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange({ status: tab.id })}
            className={`relative pb-2 text-sm font-medium transition-colors ${
              filters.status === tab.id
                ? "text-[#1D332C] border-b-2 border-[#1D332C]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                tab.id === "cancelled"
                  ? "bg-red-100 text-red-600"
                  : filters.status === tab.id
                  ? "bg-[#1D332C] text-white"
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
            placeholder="Search by Booking ID, Guest Name, or Email"
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
            onChange={handleDateFilterChange}
            placeholder="Filter by date range"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingFilter;
