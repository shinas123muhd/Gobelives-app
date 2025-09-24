import React, { useState } from "react";
import Select from "@/components/ui/Select";
import { IoSearchOutline } from "react-icons/io5";

const PaymentFilter = () => {
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
    { id: "accepted", label: "Accepted", count: 2 },
    { id: "cancelled", label: "Cancelled", count: 8 },
  ];

  return (
    <div className="flex items-center justify-between mt-3 mb-3">
      <div className="flex flex-col  gap-4 w-full">
        {/* Tab Selection Filter */}
        <div className="flex items-center gap-8">
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
        <div className="flex items-center justify-between w-full">
          {/* Search Bar */}
          <div className="relative bg-white rounded-lg overflow-hidden">
            <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
            <input
              type="text"
              placeholder="Search by Booking id"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-4 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 
               placeholder:text-[#8B909A] w-64"
            />
          </div>

          {/* Date Filter */}
          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Filter by date range"
            className="w-48"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentFilter;
