import React, { useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

const ReviewTable = () => {
  const [toggleStates, setToggleStates] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  // Sample rating data matching the image
  const ratingData = [
    {
      rating: 1.0,
      reviewSnippet:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      reviewCount: 24,
    },
    {
      rating: 2.0,
      reviewSnippet:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      reviewCount: 32,
    },
    {
      rating: 3.0,
      reviewSnippet:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      reviewCount: 40,
    },
    {
      rating: 4.0,
      reviewSnippet:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      reviewCount: 66,
    },
    {
      rating: 5.0,
      reviewSnippet:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      reviewCount: 88,
    },
  ];

  const handleToggle = (rating) => {
    setToggleStates((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < 4 ? "text-yellow-400" : "text-yellow-400"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-600">
          <div>RATING</div>
          <div className="text-center">REVIEWS</div>
          <div className="text-right">ACTION</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {ratingData.map((item) => (
          <div
            key={item.rating}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Rating Column */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  {item.rating}
                </span>
                <div className="flex items-center gap-1">
                  {renderStars(item.rating)}
                </div>
              </div>

              {/* Reviews Column */}
              <div className="text-center">
                <div className="text-sm text-gray-700 mb-1">
                  {item.reviewSnippet}
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {item.reviewCount} Reviews
                </div>
              </div>

              {/* Action Column - Toggle Switch */}
              <div className="flex justify-end">
                <button
                  onClick={() => handleToggle(item.rating)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    toggleStates[item.rating] ? "bg-[#1D332C]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      toggleStates[item.rating]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  >
                    {toggleStates[item.rating] && (
                      <IoCheckmarkOutline className="h-3 w-3 text-[#1D332C] m-0.5" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTable;
