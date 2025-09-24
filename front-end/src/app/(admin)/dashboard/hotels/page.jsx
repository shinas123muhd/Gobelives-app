"use client";
import React from "react";
import HotelFilter from "@/app/(admin)/components/HotelFilter";
import HotelTable from "@/app/(admin)/components/HotelTable";
import HotelPagination from "@/app/(admin)/components/HotelPagination";

const Hotels = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <HotelFilter />

      {/* Hotel Table Section */}
      <HotelTable />

      {/* Pagination Section */}
      <HotelPagination />
    </section>
  );
};

export default Hotels;
