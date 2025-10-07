import React from "react";
import Image from "next/image";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoCarOutline,
  IoPeopleOutline,
  IoStarOutline,
  IoStar,
} from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdLockOpen, MdLock } from "react-icons/md";

const PackageCard = ({
  package: packageData,
  onEdit,
  onDelete,
  onToggleFeatured,
  isDeleting = false,
  isToggling = false,
}) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-2 h-full hover:shadow-lg transition-shadow cursor-pointer">
      {/* Package Image */}
      <div className="relative overflow-hidden rounded-t-xl min-h-48">
        <Image
          src={
            packageData.coverImage ||
            packageData.images?.[0]?.url ||
            "/placeholder-package.jpg"
          }
          alt={packageData.title}
          fill
          className="object-cover"
        />
        {/* Featured Badge */}
        {packageData.featured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        {/* Location Tag */}
        <div className="absolute top-3 right-3 bg-gray-600 bg-opacity-80 rounded-full px-3 py-1 flex items-center gap-1">
          <IoLocationOutline className="text-white text-sm" />
          <span className="text-white text-xs font-medium">
            {packageData.location?.city ||
              packageData.location?.country ||
              "Unknown"}
          </span>
        </div>
      </div>

      {/* Package Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-gray-700 text-[17px] font-semibold mb-3">
          {packageData.title}
        </h3>

        {/* Package Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-[13px]">
            <IoTimeOutline className="text-base" />
            <span>
              {packageData.duration?.value} {packageData.duration?.unit}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[13px]">
            <IoPeopleOutline className="text-base" />
            <span>Max {packageData.capacity?.maxGuests} guests</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[13px]">
            <IoLocationOutline className="text-base" />
            <span>{packageData.category?.name || "Package"}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dotted border-gray-300 my-4"></div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-1">
              {renderStars(packageData.ratings?.average || 0)}
            </div>
            <p className="text-gray-500 text-xs">
              {packageData.ratings?.count || 0} reviews
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-gray-800 text-xl font-bold">
              {packageData.price?.currency}
              {packageData.price?.basePrice || 0}
            </p>
            <p className="text-gray-600 text-xs">per person</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(packageData)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit package"
          >
            <FiEdit className="text-lg" />
          </button>
          <button
            onClick={() => onToggleFeatured(packageData)}
            disabled={isToggling}
            className={`p-2 rounded-lg transition-colors ${
              packageData.featured
                ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-100"
                : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-100"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              packageData.featured ? "Remove from featured" : "Add to featured"
            }
          >
            {packageData.featured ? (
              <IoStar className="text-lg" />
            ) : (
              <IoStarOutline className="text-lg" />
            )}
          </button>
          <button
            onClick={() => onDelete(packageData)}
            disabled={isDeleting}
            className={`p-2 text-gray-400 hover:text-red-400 hover:bg-red-100 rounded-lg transition-colors ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Delete package"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
