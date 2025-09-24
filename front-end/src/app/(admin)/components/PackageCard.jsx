import React from "react";
import Image from "next/image";
import {
  IoLocationOutline,
  IoTimeOutline,
  IoCarOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdLockOpen, MdLock } from "react-icons/md";

const PackageCard = ({
  package: packageData,
  onEdit,
  onDelete,
  onToggleStatus,
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
          src={packageData.image}
          alt={packageData.title}
          fill
          className="object-cover"
        />
        {/* Location Tag */}
        <div className="absolute top-3 right-3 bg-gray-600 bg-opacity-80 rounded-full px-3 py-1 flex items-center gap-1">
          <IoLocationOutline className="text-white text-sm" />
          <span className="text-white text-xs font-medium">
            {packageData.location}
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
            <span>{packageData.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[13px]">
            <IoCarOutline className="text-base" />
            <span>{packageData.transport}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[13px]">
            <IoPeopleOutline className="text-base" />
            <span>{packageData.plan}</span>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-dotted border-gray-300 my-4"></div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-1">
              {renderStars(packageData.rating)}
            </div>
            <p className="text-gray-500 text-xs">
              {packageData.reviews} reviews
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-gray-800 text-xl font-bold">
              ${packageData.price}
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
            onClick={() => onToggleStatus(packageData)}
            className={`p-2 rounded-lg transition-colors ${
              packageData.active
                ? "text-green-400 hover:text-green-300 hover:bg-green-100"
                : "text-red-400 hover:text-red-300 hover:bg-red-100"
            }`}
            title={packageData.active ? "Deactivate" : "Activate"}
          >
            {packageData.active ? (
              <MdLockOpen className="text-lg" />
            ) : (
              <MdLock className="text-lg" />
            )}
          </button>
          <button
            onClick={() => onDelete(packageData)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-100 rounded-lg transition-colors"
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
