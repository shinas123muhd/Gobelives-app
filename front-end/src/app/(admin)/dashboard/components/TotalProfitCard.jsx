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

const TotalProfitCard = ({ data }) => {
  // Use real data if available, otherwise fallback to sample data
  const chartData = data?.chartData || [
    { day: "MON", profit: 2500 },
    { day: "TUE", profit: 3200 },
    { day: "WED", profit: 2800 },
    { day: "THU", profit: 3500 },
    { day: "FRI", profit: 4200 },
    { day: "SAT", profit: 3800 },
    { day: "SUN", profit: 4500 },
  ];

  const totalProfit = data?.totalProfit || 20000;
  const change = data?.change || 12;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 
    duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Total Profit</h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {(totalProfit / 1000).toFixed(0)}k
          </div>
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
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="profit"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TotalProfitCard;
