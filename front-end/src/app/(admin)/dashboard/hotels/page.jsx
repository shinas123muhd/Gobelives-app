"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HotelFilter from "@/app/(admin)/components/HotelFilter";
import HotelTable from "@/app/(admin)/components/HotelTable";
import HotelPagination from "@/app/(admin)/components/HotelPagination";
import { useHotels } from "@/app/(admin)/hooks/useHotels";

const Hotels = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    isActive: "",
    isVerified: "",
    isFeatured: "",
    starRating: "",
    category: "",
    location: "",
    dateFrom: "",
    dateTo: "",
  });

  const { data: hotelsData, isLoading, error } = useHotels(filters);

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

  const handleItemsPerPageChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <HotelFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreateHotel={() => router.push("/dashboard/hotels/create")}
      />

      {/* Hotel Table Section */}
      <HotelTable
        hotels={hotelsData?.hotels || []}
        isLoading={isLoading}
        error={error}
        onRefresh={() => {
          // Trigger refetch by updating a dummy filter
          setFilters((prev) => ({ ...prev }));
        }}
      />

      {/* Pagination Section */}
      <HotelPagination
        currentPage={filters.page}
        itemsPerPage={filters.limit}
        totalItems={hotelsData?.pagination?.total || 0}
        totalPages={hotelsData?.pagination?.pages || 0}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </section>
  );
};

export default Hotels;
