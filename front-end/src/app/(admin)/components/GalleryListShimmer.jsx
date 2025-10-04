import React from "react";

const GalleryListShimmer = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header Shimmer */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Grid Shimmer */}
      <div className="p-6 h-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Image Shimmer */}
              <div className="relative aspect-square bg-gray-200 animate-pulse" />

              {/* Info Shimmer */}
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="flex items-center justify-between mt-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryListShimmer;
