import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

const BookingTable = () => {
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Sample booking data matching the image
  const bookings = [
    {
      id: "6549",
      created: "5 min ago",
      guestName: "Emily Carter",
      price: "$2900",
      status: "pending",
    },
    {
      id: "6550",
      created: "10 min ago",
      guestName: "James Lee",
      price: "$4500",
      status: "pending",
    },
    {
      id: "6551",
      created: "15 min ago",
      guestName: "Sofia Martinez",
      price: "$3200",
      status: "accepted",
    },
    {
      id: "6552",
      created: "20 min ago",
      guestName: "Liam Johnson",
      price: "$1500",
      status: "accepted",
    },
    {
      id: "6553",
      created: "25 min ago",
      guestName: "Olivia Brown",
      price: "$3700",
      status: "accepted",
    },
    {
      id: "6554",
      created: "30 min ago",
      guestName: "Ava Wilson",
      price: "$2800",
      status: "rejected",
    },
    {
      id: "6555",
      created: "35 min ago",
      guestName: "Noah Davis",
      price: "$3900",
      status: "accepted",
    },
  ];

  const handleAccept = (bookingId) => {
    console.log("Accept booking:", bookingId);
    // Add your accept logic here
  };

  const handleReject = (bookingId) => {
    console.log("Reject booking:", bookingId);
    // Add your reject logic here
  };

  const getStatusButton = (booking) => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleReject(booking.id)}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleAccept(booking.id)}
              className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
            >
              Accept
            </button>
          </div>
        );
      case "accepted":
        return (
          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
            Accepted
          </button>
        );
      case "rejected":
        return (
          <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md">
            Rejected
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white  h-full overflow-y-auto flex flex-col rounded-lg ">
      {/* Table Header */}
      <div className="bg-white sticky top-0 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600">
          <div>Booking id</div>
          <div>Created</div>
          <div>Guest Name</div>
          <div>Price</div>
          <div>Status</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* Booking ID */}
              <div className="text-sm font-medium text-gray-900">
                #{booking.id}
              </div>

              {/* Created */}
              <div className="text-sm text-gray-600">{booking.created}</div>

              {/* Guest Name */}
              <div className="text-sm text-gray-900">{booking.guestName}</div>

              {/* Price */}
              <div className="text-sm font-medium text-gray-900">
                {booking.price}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                {getStatusButton(booking)}
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <IoChevronDownOutline className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
