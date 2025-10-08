"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const OverviewCard = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const chartData = data?.chartData || [
    { day: "MON", visits: 2400, bookings: 1200 },
    { day: "TUE", visits: 2800, bookings: 1400 },
    { day: "WED", visits: 3200, bookings: 1600 },
    { day: "THU", visits: 3000, bookings: 1500 },
    { day: "FRI", visits: 3600, bookings: 1800 },
    { day: "SAT", visits: 2800, bookings: 1400 },
    { day: "SUN", visits: 3200, bookings: 1600 },
  ];

  const overview = data?.overview || {
    totalRevenue: 350000,
    totalVisitors: 235000,
    visitorChange: 8.56,
    bookingChange: 12.5,
  };

  return (
    <div
      className="bg-white rounded-xl  border border-gray-200
     p-6 "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            $ {(overview.totalRevenue / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-blue-600 font-medium">
            {(overview.totalVisitors / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-4">
        <div className="flex items-center text-sm">
          <span
            className={`font-medium ${
              overview.visitorChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {overview.visitorChange >= 0 ? "↑" : "↓"}{" "}
            {Math.abs(overview.visitorChange).toFixed(2)}% vs last 7 days
          </span>
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
              <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FCD34D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
              dataKey="visits"
              stroke="#FCD34D"
              strokeWidth={2}
              fill="url(#visitsGradient)"
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#bookingsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center mt-2 space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span className="text-xs text-gray-600">Visit</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
