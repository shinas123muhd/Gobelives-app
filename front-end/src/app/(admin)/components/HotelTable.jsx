import React from "react";
import { useRouter } from "next/navigation";
import { IoCreateOutline, IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import {
  useDeleteHotel,
  useToggleHotelActive,
  useToggleHotelFeatured,
} from "@/app/(admin)/hooks/useHotels";

const HotelTable = ({ hotels = [], isLoading, error, onRefresh }) => {
  const router = useRouter();

  const deleteHotel = useDeleteHotel();
  const toggleActive = useToggleHotelActive();
  const toggleFeatured = useToggleHotelFeatured();

  const handleEdit = (hotelId) => {
    // Navigate to edit page instead of opening drawer
    router.push(`/dashboard/hotels/edit/${hotelId}`);
  };

  const handleView = (hotelId) => {
    console.log("View hotel:", hotelId);
    // Add your view logic here
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteHotel.mutateAsync(hotelId);
        onRefresh(); // Refresh the data
      } catch (error) {
        console.error("Error deleting hotel:", error);
      }
    }
  };

  const handleToggleActive = async (hotelId) => {
    try {
      await toggleActive.mutateAsync(hotelId);
      onRefresh(); // Refresh the data
    } catch (error) {
      console.error("Error toggling hotel active status:", error);
    }
  };

  const handleToggleFeatured = async (hotelId) => {
    try {
      await toggleFeatured.mutateAsync(hotelId);
      onRefresh(); // Refresh the data
    } catch (error) {
      console.error("Error toggling hotel featured status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading hotels...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading hotels: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
          <div>HOTEL NAME</div>
          <div>LOCATION</div>
          <div>STATUS</div>
          <div>RATING</div>
          <div>ACTION</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {hotels.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">No hotels found</div>
          </div>
        ) : (
          hotels.map((hotel) => (
            <div
              key={hotel._id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Hotel Name */}
                <div className="text-sm font-medium text-gray-600">
                  {hotel.name}
                </div>

                {/* Location */}
                <div className="text-sm text-gray-900">{hotel.location}</div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      hotel.status === "active"
                        ? "bg-green-100 text-green-800"
                        : hotel.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : hotel.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {hotel.status}
                  </span>
                  {hotel.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="text-sm font-medium text-gray-900">
                  {hotel.analytics?.averageRating || "N/A"}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(hotel._id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit hotel"
                  >
                    <IoCreateOutline className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleView(hotel._id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="View hotel details"
                  >
                    <IoEyeOutline className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete hotel"
                    disabled={deleteHotel.isPending}
                  >
                    <IoTrashOutline className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelTable;
