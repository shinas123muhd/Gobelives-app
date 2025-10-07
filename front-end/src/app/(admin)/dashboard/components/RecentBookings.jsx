"use client";
import React from "react";
import { MoreVertical } from "lucide-react";

const RecentBookings = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const bookings = data?.bookings || [
    { id: "# 6548", user: "Ertgurul", status: "Confirmed", total: "$ 999.29" },
    { id: "# 6548", user: "Halime", status: "Confirmed", total: "$ 72.40" },
    { id: "# 6548", user: "Bamsi", status: "Confirmed", total: "$ 99.90" },
    { id: "# 6548", user: "Hamsa", status: "Confirmed", total: "$ 249.99" },
    { id: "# 6548", user: "Turgut", status: "Completed", total: "$ 79.40" },
  ];

  const totalBookings = data?.total || bookings.length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-yellow-600 bg-yellow-100";
      case "Completed":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div
      className="bg-white h-full flex flex-col overflow-hidden
     rounded-xl border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h3>
          <span className="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded-full">
            {totalBookings}
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Table */}
      <div className=" h-full  overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {booking.id}
                </td>
                <td className="py-3 px-2 text-sm text-gray-900 font-medium">
                  {booking.user}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {booking.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
