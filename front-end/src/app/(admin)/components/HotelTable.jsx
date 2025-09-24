import React, { useState } from "react";
import { IoCreateOutline, IoEyeOutline, IoTrashOutline } from "react-icons/io5";

const HotelTable = () => {
  const [selectedHotels, setSelectedHotels] = useState([]);

  // Sample hotel data matching the image
  const hotels = [
    {
      id: 1,
      name: "Royal Stay",
      location: "NEW YORK",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 2,
      name: "Royal Stay",
      location: "INDIA",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 3,
      name: "Royal Stay",
      location: "UAE",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 4,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 5,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 6,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 7,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 8,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 9,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
    {
      id: 10,
      name: "Royal Stay",
      location: "New York",
      hotelId: "128162",
      rating: "4.3",
    },
  ];

  const handleEdit = (hotelId) => {
    console.log("Edit hotel:", hotelId);
    // Add your edit logic here
  };

  const handleView = (hotelId) => {
    console.log("View hotel:", hotelId);
    // Add your view logic here
  };

  const handleDelete = (hotelId) => {
    console.log("Delete hotel:", hotelId);
    // Add your delete logic here
  };

  return (
    <div className="bg-white h-full overflow-y-auto flex flex-col rounded-lg">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
          <div>HOTEL NAME</div>
          <div>LOCATION</div>
          <div>HOTEL ID</div>
          <div>RATING</div>
          <div>ACTION</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* Hotel Name */}
              <div className="text-sm font-medium text-gray-900">
                {hotel.name}
              </div>

              {/* Location */}
              <div className="text-sm text-gray-900">{hotel.location}</div>

              {/* Hotel ID */}
              <div className="text-sm text-gray-900">{hotel.hotelId}</div>

              {/* Rating */}
              <div className="text-sm font-medium text-gray-900">
                {hotel.rating}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(hotel.id)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit hotel"
                >
                  <IoCreateOutline className="text-lg" />
                </button>
                <button
                  onClick={() => handleView(hotel.id)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="View hotel details"
                >
                  <IoEyeOutline className="text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(hotel.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete hotel"
                >
                  <IoTrashOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelTable;
