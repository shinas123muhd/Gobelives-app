import React from "react";

// Base shimmer component
const Shimmer = ({ className = "", children }) => (
  <div className={`animate-pulse ${className}`}>{children}</div>
);

// Shimmer box component
const ShimmerBox = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div className={`bg-gray-200 rounded ${width} ${height} ${className}`}></div>
);

// Review Table Shimmer
export const ReviewTableShimmer = () => {
  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header Shimmer */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <ShimmerBox key={index} height="h-4" width="w-20" />
          ))}
        </div>
      </div>

      {/* Table Body Shimmer */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-6 gap-4 items-center">
              {/* Review Content Column */}
              <div className="min-w-0 space-y-2">
                <ShimmerBox width="w-32" height="h-4" />
                <ShimmerBox width="w-48" height="h-3" />
                <ShimmerBox width="w-24" height="h-3" />
              </div>

              {/* Rating Column */}
              <div className="flex items-center gap-2">
                <ShimmerBox width="w-6" height="h-4" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <ShimmerBox key={starIndex} width="w-3" height="h-3" />
                  ))}
                </div>
              </div>

              {/* Status Column */}
              <div>
                <ShimmerBox
                  width="w-16"
                  height="h-6"
                  className="rounded-full"
                />
              </div>

              {/* Author Column */}
              <div className="min-w-0 space-y-1">
                <ShimmerBox width="w-24" height="h-4" />
                <ShimmerBox width="w-32" height="h-3" />
              </div>

              {/* Date Column */}
              <div>
                <ShimmerBox width="w-20" height="h-4" />
              </div>

              {/* Actions Column */}
              <div className="flex justify-end gap-2">
                <ShimmerBox
                  width="w-11"
                  height="h-6"
                  className="rounded-full"
                />
                <ShimmerBox width="w-6" height="h-6" className="rounded" />
                <ShimmerBox width="w-6" height="h-6" className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Review Filter Shimmer
export const ReviewFilterShimmer = () => {
  return (
    <div className="flex items-center justify-between mt-6 mb-3">
      <div className="flex items-center gap-2">
        {/* Search Bar Shimmer */}
        <div className="relative bg-white rounded-lg">
          <ShimmerBox width="w-64" height="h-10" className="rounded-lg" />
        </div>

        {/* Filter Selects Shimmer */}
        <ShimmerBox width="w-48" height="h-10" className="rounded-lg" />
        <ShimmerBox width="w-40" height="h-10" className="rounded-lg" />
        <ShimmerBox width="w-48" height="h-10" className="rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        {/* Clear Filters Button Shimmer */}
        <ShimmerBox width="w-24" height="h-10" className="rounded-lg" />

        {/* Export Button Shimmer */}
        <ShimmerBox width="w-32" height="h-10" className="rounded-lg" />
      </div>
    </div>
  );
};

// Review Pagination Shimmer
export const ReviewPaginationShimmer = () => {
  return (
    <div className="flex items-center justify-between mt-2 px-6 py-4 bg-white rounded-lg">
      {/* Items per page selector shimmer */}
      <div className="flex items-center gap-2">
        <ShimmerBox width="w-12" height="h-4" />
        <ShimmerBox width="w-16" height="h-10" className="rounded" />
        <ShimmerBox width="w-20" height="h-4" />
      </div>

      {/* Pagination controls shimmer */}
      <div className="flex items-center gap-2">
        {/* Previous button shimmer */}
        <ShimmerBox width="w-8" height="w-8" className="rounded" />

        {/* Page numbers shimmer */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShimmerBox
              key={index}
              width="w-8"
              height="h-8"
              className="rounded-md"
            />
          ))}
        </div>

        {/* Next button shimmer */}
        <ShimmerBox width="w-8" height="w-8" className="rounded" />
      </div>
    </div>
  );
};

// Complete Review Page Shimmer
export const ReviewPageShimmer = () => {
  return (
    <section className="w-full flex flex-col overflow-y-auto h-full px-6 pb-6">
      {/* Filter Section Shimmer */}
      <ReviewFilterShimmer />

      {/* Table Section Shimmer */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <ReviewTableShimmer />
        <ReviewPaginationShimmer />
      </div>
    </section>
  );
};

export default {
  ReviewTableShimmer,
  ReviewFilterShimmer,
  ReviewPaginationShimmer,
  ReviewPageShimmer,
};
