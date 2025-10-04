"use client";
import React, { useState } from "react";
import GalleryFilter from "@/app/(admin)/components/GalleryFilter";
import GalleryGrid from "@/app/(admin)/components/GalleryGrid";

const Gallery = () => {
  const [filters, setFilters] = useState({
    search: "",
    featured: undefined,
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <section className="w-full h-full overflow-hidden flex flex-col px-6 pb-6">
      {/* Filter Section */}
      <GalleryFilter filters={filters} onFilterChange={handleFilterChange} />

      {/* Gallery Grid */}
      <GalleryGrid filters={filters} />
    </section>
  );
};

export default Gallery;
