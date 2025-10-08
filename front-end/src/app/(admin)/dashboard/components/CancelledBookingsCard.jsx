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

const CancelledBookingsCard = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const chartData = data?.chartData || [
    { day: "MON", cancelled: 800 },
    { day: "TUE", cancelled: 600 },
    { day: "WED", cancelled: 900 },
    { day: "THU", cancelled: 700 },
    { day: "FRI", cancelled: 500 },
    { day: "SAT", cancelled: 750 },
    { day: "SUN", cancelled: 650 },
  ];

  const totalCancelled = data?.totalCancelled || 5000;
  const change = data?.change || 2;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 
    "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cancelled Booking
          </h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {(totalCancelled / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-4">
        <div className="flex items-center text-sm">
          <span
            className={`font-medium ${
              change >= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs last 7
            days
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
              <linearGradient
                id="cancelledGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
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
              dataKey="cancelled"
              stroke="#EF4444"
              strokeWidth={2}
              fill="url(#cancelledGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CancelledBookingsCard;
