import React from "react";

const CategoryCardShimmer = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
      {/* Category Image Shimmer */}
      <div className="h-[148px] bg-gray-200"></div>

      {/* Category Content Shimmer */}
      <div className="p-3">
        {/* Title Shimmer */}
        <div className="h-5 bg-gray-200 rounded mb-1"></div>

        {/* Label Shimmer */}
        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>

        {/* Count Shimmer */}
        <div className="h-6 bg-gray-200 rounded w-8 mb-4"></div>

        {/* Action Icons Shimmer */}
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const CategoryListShimmer = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, index) => (
        <CategoryCardShimmer key={index} />
      ))}
    </div>
  );
};

export default CategoryListShimmer;
