import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline, IoDownloadOutline } from "react-icons/io5";

const TransactionFilter = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const statusOptions = [
    { value: "all", label: "Status: All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const dateOptions = [
    { value: "all", label: "Filter by date range" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
  ];

  const typeOptions = [
    { value: "all", label: "Type: All" },
    { value: "booking", label: "Booking" },
    { value: "refund", label: "Refund" },
    { value: "commission", label: "Commission" },
  ];

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting transactions...");
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-6">
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg overflow-hidden">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Status: All"
          className="w-40"
        />

        {/* Type Filter */}
        <Select
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
          placeholder="Type: All"
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
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoDownloadOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Export
        </button>
      </div>
    </div>
  );
};

export default TransactionFilter;
