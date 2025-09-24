"use client";
import React from "react";
import BookingFilter from "@/app/(admin)/components/BookingFilter";
import BookingTable from "@/app/(admin)/components/BookingTable";
import BookingPagination from "@/app/(admin)/components/BookingPagination";

const Bookings = () => {
  return (
    <section className="w-full h-full flex flex-col overflow-y-auto px-6 pb-6">
      {/* Filter Section */}
      <BookingFilter />

      {/* Booking Table Section */}
      <BookingTable />

      {/* Pagination Section */}
      <BookingPagination />
    </section>
  );
};

export default Bookings;
