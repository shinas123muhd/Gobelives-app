"use client";
import React from "react";
import ReviewFilter from "@/app/(admin)/components/ReviewFilter";
import ReviewTable from "@/app/(admin)/components/ReviewTable";
import ReviewPagination from "@/app/(admin)/components/ReviewPagination";
import { ReviewPageShimmer } from "@/app/(admin)/components/ReviewShimmer";
import useReviews from "@/app/(admin)/hooks/useReviews";

const Reviews = () => {
  const {
    reviews,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    updateFilters,
    updatePagination,
    updateReviewStatus,
    addAdminResponse,
    deleteReview,
    refreshReviews,
    clearError,
  } = useReviews();

  // Show complete page shimmer on initial load
  if (loading && reviews.length === 0) {
    return <ReviewPageShimmer />;
  }

  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section */}
      <ReviewFilter
        filters={filters}
        onFiltersChange={updateFilters}
        loading={loading}
      />

      {/* Table Section */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <ReviewTable
          reviews={reviews}
          loading={loading}
          error={error}
          onStatusUpdate={updateReviewStatus}
          onAddResponse={addAdminResponse}
          onDelete={deleteReview}
          onRefresh={refreshReviews}
          onClearError={clearError}
        />
        <ReviewPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={(page) => updatePagination(page)}
          onItemsPerPageChange={(limit) => updatePagination(undefined, limit)}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default Reviews;
