import React from "react";

const GallerySkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-4 gap-8 py-4">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="h-[320px] w-full rounded-2xl overflow-hidden relative bg-[#1e2a26]"
        >
          {/* Shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e2a26] via-[#2e3d37] to-[#1e2a26] animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;