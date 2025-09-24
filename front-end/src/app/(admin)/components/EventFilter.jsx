import React, { useState } from "react";
import Select from "@/components/ui/Select";
import CreateEventDrawer from "./CreateEventDrawer";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";

const EventFilter = () => {
  const [dateFilter, setDateFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dateOptions = [
    { value: "all", label: "Filter by date range" },
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "3months", label: "Last 3 months" },
    { value: "upcoming", label: "Upcoming events" },
    { value: "past", label: "Past events" },
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
        {/* Create Event Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-white group cursor-pointer
          text-sm text-[#1D332C] px-4 py-2 rounded-lg hover:bg-[#1D332C] hover:text-white transition-colors"
        >
          <IoAddCircleOutline className="text-lg text-[#1D332C] group-hover:text-white" />
          Create New Event
        </button>
      </div>

      {/* Create Event Drawer */}
      <CreateEventDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default EventFilter;
