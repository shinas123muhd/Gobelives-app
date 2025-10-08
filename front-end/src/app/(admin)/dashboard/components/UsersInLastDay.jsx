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

const UsersInLastDay = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const hourlyData = data?.hourlyData || [
    { time: "12am", users: 45 },
    { time: "4am", users: 32 },
    { time: "8am", users: 78 },
    { time: "12pm", users: 95 },
    { time: "4pm", users: 120 },
    { time: "8pm", users: 88 },
    { time: "11pm", users: 65 },
  ];

  const totalUsers = data?.totalUsers || 523;
  const change = data?.change || 12;

  return (
    <div className="bg-white rounded-xl h-full flex flex-col overflow-hidden border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Users in Last Day
          </h3>
          <p className="text-sm text-gray-500">24 hours activity</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mb-4">
        <div className="flex items-center text-sm">
          <span
            className={`font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs
            yesterday
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={hourlyData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#usersGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersInLastDay;
