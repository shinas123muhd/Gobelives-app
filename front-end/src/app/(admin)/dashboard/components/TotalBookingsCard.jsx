"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TotalBookingsCard = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const chartData = data?.chartData || [
    { day: "MON", bookings: 15 },
    { day: "TUE", bookings: 18 },
    { day: "WED", bookings: 12 },
    { day: "THU", bookings: 20 },
    { day: "FRI", bookings: 16 },
    { day: "SAT", bookings: 22 },
    { day: "SUN", bookings: 17 },
  ];

  const totalBookings = data?.totalBookings || 120;
  const pendingBookings = data?.pendingBookings || 6;
  const change = data?.change || 6;

  return (
    <div
      className="bg-white rounded-xl  border border-gray-200
     p-6 "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Total Bookings
          </h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {totalBookings}
          </div>
        </div>
      </div>

      {/* Comparison and Pending */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs last 7
            days
          </span>
          <div className="text-sm text-gray-600">
            Pending Booking{" "}
            <span className="text-amber-500 font-semibold">
              {pendingBookings}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#bookingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalBookingsCard;
