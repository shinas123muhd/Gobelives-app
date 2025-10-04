import React from "react";

const DashboardLoading = ({
  message = "Loading...",
  showSkeleton = false,
  fullScreen = true,
}) => {
  if (fullScreen) {
    return (
      <main className="w-full h-screen overflow-hidden bg-white flex text-black">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-[#2B4B40] border-r border-gray-200">
          <div className="animate-pulse p-6 space-y-6">
            {/* Logo */}
            <div className="h-8 bg-white/20 rounded w-32"></div>

            {/* Navigation Items */}
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/20 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col h-full bg-gray-50 overflow-hidden">
          {/* Header Skeleton */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {showSkeleton ? (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl border border-gray-100 p-8">
                  <div className="animate-pulse space-y-8">
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-64"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Table-like content */}
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-32"></div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">{message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // Simple centered loading for non-fullscreen use
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
