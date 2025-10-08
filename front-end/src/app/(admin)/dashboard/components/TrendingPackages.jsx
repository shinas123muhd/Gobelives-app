"use client";
import React from "react";
import { MoreVertical } from "lucide-react";

const TrendingPackages = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const packages = data?.packages || [
    { name: "Tajmahal Agra", packId: "FXZ-4567", price: "$ 199.29" },
    { name: "Kerala Backwater Tour", packId: "FXZ-3456", price: "$ 72.40" },
    { name: "Himachal Hill Station", packId: "FXZ-9485", price: "$ 99.90" },
    { name: "Goa Beach Tour", packId: "FXZ-2345", price: "$ 249.99" },
    { name: "Kerala Backwater Tour", packId: "FXZ-8959", price: "$ 79.40" },
    { name: "Tajmahal Agra", packId: "FXZ-7892", price: "$ 429.48" },
  ];

  const totalVisitors = data?.totalVisitors || "10.4k";

  return (
    <div className="bg-white h-full flex flex-col  rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Trending Packages
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Total {totalVisitors} Visitors
          </p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Packages List */}
      <div className="space-y-4 h-full overflow-y-auto">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {pkg.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Pack: #{pkg.packId}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-900">
                {pkg.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPackages;
