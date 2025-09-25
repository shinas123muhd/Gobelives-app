"use client";
import { useState, useCallback } from "react";
import CategoryFilter from "@/app/(admin)/components/CategoryFilter";
import CategoryList from "@/app/(admin)/components/CategoryList";

const Categories = () => {
  // State for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: "",
    status: "",
  });

  // Local state for filter inputs
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Handle filter changes with debouncing
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  return (
    <section className="w-full h-full px-6 pb-6">
      {/* Filter Section */}
      <CategoryFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onFiltersChange={handleFiltersChange}
      />

      {/* Categories Grid */}
      <CategoryList filters={filters} />
    </section>
  );
};

export default Categories;
