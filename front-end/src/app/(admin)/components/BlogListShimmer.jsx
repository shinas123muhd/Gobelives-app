import React from "react";

const BlogListShimmer = ({ count = 6 }) => {
  return (
    <div className="bg-white rounded-xl border h-full flex flex-col border-gray-100 overflow-hidden">
      {/* Header Shimmer */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Grid Shimmer */}
      <div className="p-6 h-full overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(count)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Image Shimmer */}
              <div className="relative aspect-video bg-gray-200 animate-pulse" />

              {/* Content Shimmer */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />

                {/* Content Lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogListShimmer;
