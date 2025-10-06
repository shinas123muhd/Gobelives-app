"use client";
import React, { useState } from "react";
import BookingFilter from "@/app/(admin)/components/BookingFilter";
import BookingTable from "@/app/(admin)/components/BookingTable";
import BookingPagination from "@/app/(admin)/components/BookingPagination";

const Bookings = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "",
    search: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return (
    <section className="w-full h-full flex flex-col overflow-y-auto px-6 pb-6">
      {/* Filter Section */}
      <BookingFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Booking Table Section */}
      <BookingTable filters={filters} />

      {/* Pagination Section */}
      <BookingPagination
        filters={filters}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </section>
  );
};

export default Bookings;
