import React, { useState } from "react";
import Select from "@/components/ui/Select";
import CreateCouponDrawer from "./CreateCouponDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const CouponFilter = ({ filters, onFilterChange, onCouponCreated }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Status: All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "expired", label: "Expired" },
    { value: "suspended", label: "Suspended" },
  ];

  const eligibilityOptions = [
    { value: "", label: "Eligibility: All" },
    { value: "all", label: "All Packages" },
    { value: "selected", label: "Selected Packages" },
    { value: "specific", label: "Specific Package" },
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

  const handleEligibilityChange = (value) => {
    onFilterChange({ eligibility: value });
  };

  const handleDateChange = (value) => {
    let expiryDateFrom = "";
    let expiryDateTo = "";

    if (value === "7days") {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      expiryDateFrom = date.toISOString().split("T")[0];
    } else if (value === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      expiryDateFrom = date.toISOString().split("T")[0];
    } else if (value === "3months") {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      expiryDateFrom = date.toISOString().split("T")[0];
    }

    onFilterChange({ expiryDateFrom, expiryDateTo });
  };

  return (
    <div className="flex items-center justify-between mt-6 mb-6">
      <div className="flex items-center gap-2">
        {/* Search Bar */}
        <div className="relative bg-white rounded-lg overflow-hidden">
          <IoSearchOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B909A] text-lg" />
          <input
            type="text"
            placeholder="Search coupons..."
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

        {/* Eligibility Filter */}
        <Select
          options={eligibilityOptions}
          value={filters.eligibility}
          onChange={handleEligibilityChange}
          placeholder="Eligibility: All"
          className="w-48"
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
        {/* Create Coupon Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Create New Coupon
        </button>
      </div>

      {/* Create Coupon Drawer */}
      <CreateCouponDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={() => {
          setIsDrawerOpen(false);
          onCouponCreated?.();
        }}
      />
    </div>
  );
};

export default CouponFilter;
