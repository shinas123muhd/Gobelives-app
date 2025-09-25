"use client";
import React, { useState, useCallback } from "react";
import PackageFilter from "@/app/(admin)/components/PackageFilter";
import PackageList from "@/app/(admin)/components/PackageList";

const Packages = () => {
  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "",
    categoryFilter: "",
    featuredFilter: "",
    cityFilter: "",
    countryFilter: "",
    minPrice: "",
    maxPrice: "",
  });

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <PackageFilter filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Packages Grid */}
      <PackageList filters={filters} />
    </section>
  );
};

export default Packages;
