"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MoreVertical } from "lucide-react";

const TodayBookings = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const hourlyData = data?.hourlyData || [
    { time: "12am", bookings: 2 },
    { time: "4am", bookings: 1 },
    { time: "8am", bookings: 8 },
    { time: "12pm", bookings: 5 },
    { time: "4pm", bookings: 9 },
    { time: "8pm", bookings: 6 },
    { time: "11pm", bookings: 3 },
  ];

  const totalBookings = data?.totalBookings || 10;
  const change = data?.change || 6;

  return (
    <div className="bg-white h-full  flex flex-col overflow-hidden rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today Bookings</h3>
        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Main Metric */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {totalBookings}
        </div>
        <div className="flex items-center text-sm">
          <span
            className={`font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs last day
          </span>
        </div>
      </div>

      {/* Chart Title */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700">
          Bookings Over Time
        </h4>
      </div>

      {/* Chart */}
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={hourlyData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis
              dataKey="time"
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
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TodayBookings;
