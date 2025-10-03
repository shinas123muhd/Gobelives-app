import React from "react";

const PackageCardShimmer = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2 h-full animate-pulse">
      {/* Image Shimmer */}
      <div className="relative overflow-hidden rounded-t-xl min-h-48 bg-gray-200">
        {/* Featured Badge Shimmer */}
        <div className="absolute top-3 left-3 bg-gray-300 rounded-full h-6 w-16"></div>
        {/* Location Tag Shimmer */}
        <div className="absolute top-3 right-3 bg-gray-300 rounded-full h-6 w-20"></div>
      </div>

      {/* Content Shimmer */}
      <div className="p-4">
        {/* Title Shimmer */}
        <div className="h-5 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Features Shimmer */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dotted border-gray-300 my-4"></div>

        {/* Rating and Price Shimmer */}
        <div className="flex items-center justify-between">
          <div>
            {/* Rating Shimmer */}
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Price Shimmer */}
          <div className="text-right">
            <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Action Buttons Shimmer */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const PackageListShimmer = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto h-full lg:grid-cols-4 gap-3">
      {[...Array(count)].map((_, index) => (
        <PackageCardShimmer key={index} />
      ))}
    </div>
  );
};

export default PackageListShimmer;
