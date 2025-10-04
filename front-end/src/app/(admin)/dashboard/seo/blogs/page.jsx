"use client";
import React, { useState } from "react";
import BlogFilter from "@/app/(admin)/components/BlogFilter";
import BlogGrid from "@/app/(admin)/components/BlogGrid";

const Blogs = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    visibility: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleBlogAdded = () => {
    // Refresh the blogs data when a new blog is added
    // This will be implemented when we add the API integration
    console.log("Blog added, refreshing blogs...");
  };

  return (
    <section className="w-full h-full px-6 pb-6">
      {/* Filter Section */}
      <BlogFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onBlogAdded={handleBlogAdded}
      />

      {/* Blog Grid */}
      <BlogGrid filters={filters} />
    </section>
  );
};

export default Blogs;
