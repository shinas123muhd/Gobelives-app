"use client";
import React from "react";
import ReviewFilter from "@/app/(admin)/components/ReviewFilter";
import ReviewTable from "@/app/(admin)/components/ReviewTable";
import ReviewPagination from "@/app/(admin)/components/ReviewPagination";

const Reviews = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <ReviewFilter />

      {/* Table Section */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <ReviewTable />
        <ReviewPagination />
      </div>
    </section>
  );
};

export default Reviews;
