import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Visitor from "../models/Visitor.model.js";
import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import Package from "../models/Package.model.js";
import mongoose from "mongoose";

// Get overview statistics
const getOverviewStats = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  // Calculate date range based on period
  let startDate = new Date();
  switch (period) {
    case "1d":
      startDate.setDate(startDate.getDate() - 1);
      break;
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    default:
      startDate.setDate(startDate.getDate() - 7);
  }

  // Get visitor statistics
  const visitorStats = await Visitor.getDailyVisitors(
    period === "1d" ? 1 : period === "7d" ? 7 : 30
  );

  // Get booking statistics
  const bookingStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        bookings: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  // Calculate totals
  const totalVisitors = visitorStats.reduce(
    (sum, stat) => sum + stat.visits,
    0
  );
  const totalBookings = bookingStats.reduce(
    (sum, stat) => sum + stat.bookings,
    0
  );
  const totalRevenue = bookingStats.reduce(
    (sum, stat) => sum + stat.revenue,
    0
  );

  // Get previous period for comparison
  const previousStartDate = new Date(startDate);
  const previousEndDate = new Date(startDate);
  previousStartDate.setDate(
    previousStartDate.getDate() -
      (period === "1d" ? 1 : period === "7d" ? 7 : 30)
  );

  const previousVisitorStats = await Visitor.getDailyVisitors(
    period === "1d" ? 1 : period === "7d" ? 7 : 30
  );
  const previousTotalVisitors = previousVisitorStats.reduce(
    (sum, stat) => sum + stat.visits,
    0
  );

  const previousBookingStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: previousStartDate, $lt: startDate },
      },
    },
    {
      $group: {
        _id: null,
        bookings: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const previousTotalBookings = previousBookingStats[0]?.bookings || 0;
  const previousTotalRevenue = previousBookingStats[0]?.revenue || 0;

  // Calculate percentage changes
  const visitorChange =
    previousTotalVisitors > 0
      ? (
          ((totalVisitors - previousTotalVisitors) / previousTotalVisitors) *
          100
        ).toFixed(2)
      : 0;

  const bookingChange =
    previousTotalBookings > 0
      ? (
          ((totalBookings - previousTotalBookings) / previousTotalBookings) *
          100
        ).toFixed(2)
      : 0;

  // Format data for charts
  const chartData = [];
  const maxDays = Math.max(visitorStats.length, bookingStats.length);

  for (let i = 0; i < maxDays; i++) {
    const visitorData = visitorStats[i];
    const bookingData = bookingStats[i];

    const dayName = new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();

    chartData.push({
      day: dayName,
      visits: visitorData?.visits || 0,
      bookings: bookingData?.bookings || 0,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        overview: {
          totalRevenue: totalRevenue,
          totalVisitors: totalVisitors,
          totalBookings: totalBookings,
          visitorChange: parseFloat(visitorChange),
          bookingChange: parseFloat(bookingChange),
        },
        chartData: chartData,
      },
      "Overview statistics retrieved successfully"
    )
  );
});

// Get site visits statistics
const getSiteVisits = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  let days = 7;
  if (period === "1d") days = 1;
  if (period === "30d") days = 30;

  const visitorStats = await Visitor.getDailyVisitors(days);
  const totalVisits = visitorStats.reduce((sum, stat) => sum + stat.visits, 0);

  // Get previous period for comparison
  const previousStats = await Visitor.getDailyVisitors(days);
  const previousTotalVisits = previousStats.reduce(
    (sum, stat) => sum + stat.visits,
    0
  );

  const change =
    previousTotalVisits > 0
      ? (
          ((totalVisits - previousTotalVisits) / previousTotalVisits) *
          100
        ).toFixed(2)
      : 0;

  // Format chart data
  const chartData = visitorStats.map((stat) => ({
    day: new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    visits: stat.visits,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVisits: totalVisits,
        change: parseFloat(change),
        chartData: chartData,
      },
      "Site visits statistics retrieved successfully"
    )
  );
});

// Get total bookings statistics
const getTotalBookings = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  let startDate = new Date();
  if (period === "1d") startDate.setDate(startDate.getDate() - 1);
  else if (period === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (period === "30d") startDate.setDate(startDate.getDate() - 30);

  const bookingStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  const totalBookings = bookingStats.reduce(
    (sum, stat) => sum + stat.bookings,
    0
  );

  // Get pending bookings
  const pendingBookings = await Booking.countDocuments({
    status: "pending",
    createdAt: { $gte: startDate },
  });

  // Get previous period for comparison
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(
    previousStartDate.getDate() -
      (period === "1d" ? 1 : period === "7d" ? 7 : 30)
  );

  const previousStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: previousStartDate, $lt: startDate },
      },
    },
    {
      $group: {
        _id: null,
        bookings: { $sum: 1 },
      },
    },
  ]);

  const previousTotalBookings = previousStats[0]?.bookings || 0;
  const change =
    previousTotalBookings > 0
      ? (
          ((totalBookings - previousTotalBookings) / previousTotalBookings) *
          100
        ).toFixed(2)
      : 0;

  // Format chart data
  const chartData = bookingStats.map((stat) => ({
    day: new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    bookings: stat.bookings,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalBookings: totalBookings,
        pendingBookings: pendingBookings,
        change: parseFloat(change),
        chartData: chartData,
      },
      "Total bookings statistics retrieved successfully"
    )
  );
});

// Get total profit statistics
const getTotalProfit = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  let startDate = new Date();
  if (period === "1d") startDate.setDate(startDate.getDate() - 1);
  else if (period === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (period === "30d") startDate.setDate(startDate.getDate() - 30);

  const profitStats = await Booking.aggregate([
    {
      $match: {
        status: "confirmed",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        profit: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  const totalProfit = profitStats.reduce((sum, stat) => sum + stat.profit, 0);

  // Get previous period for comparison
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(
    previousStartDate.getDate() -
      (period === "1d" ? 1 : period === "7d" ? 7 : 30)
  );

  const previousStats = await Booking.aggregate([
    {
      $match: {
        status: "confirmed",
        createdAt: { $gte: previousStartDate, $lt: startDate },
      },
    },
    {
      $group: {
        _id: null,
        profit: { $sum: "$totalAmount" },
      },
    },
  ]);

  const previousTotalProfit = previousStats[0]?.profit || 0;
  const change =
    previousTotalProfit > 0
      ? (
          ((totalProfit - previousTotalProfit) / previousTotalProfit) *
          100
        ).toFixed(2)
      : 0;

  // Format chart data
  const chartData = profitStats.map((stat) => ({
    day: new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    profit: stat.profit,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalProfit: totalProfit,
        change: parseFloat(change),
        chartData: chartData,
      },
      "Total profit statistics retrieved successfully"
    )
  );
});

// Get cancelled bookings statistics
const getCancelledBookings = asyncHandler(async (req, res) => {
  const { period = "7d" } = req.query;

  let startDate = new Date();
  if (period === "1d") startDate.setDate(startDate.getDate() - 1);
  else if (period === "7d") startDate.setDate(startDate.getDate() - 7);
  else if (period === "30d") startDate.setDate(startDate.getDate() - 30);

  const cancelledStats = await Booking.aggregate([
    {
      $match: {
        status: "cancelled",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        cancelled: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  const totalCancelled = cancelledStats.reduce(
    (sum, stat) => sum + stat.cancelled,
    0
  );

  // Get previous period for comparison
  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(
    previousStartDate.getDate() -
      (period === "1d" ? 1 : period === "7d" ? 7 : 30)
  );

  const previousStats = await Booking.aggregate([
    {
      $match: {
        status: "cancelled",
        createdAt: { $gte: previousStartDate, $lt: startDate },
      },
    },
    {
      $group: {
        _id: null,
        cancelled: { $sum: 1 },
      },
    },
  ]);

  const previousTotalCancelled = previousStats[0]?.cancelled || 0;
  const change =
    previousTotalCancelled > 0
      ? (
          ((totalCancelled - previousTotalCancelled) / previousTotalCancelled) *
          100
        ).toFixed(2)
      : 0;

  // Format chart data
  const chartData = cancelledStats.map((stat) => ({
    day: new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    cancelled: stat.cancelled,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCancelled: totalCancelled,
        change: parseFloat(change),
        chartData: chartData,
      },
      "Cancelled bookings statistics retrieved successfully"
    )
  );
});

// Get today's bookings with hourly breakdown
const getTodayBookings = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get today's total bookings
  const todayBookings = await Booking.countDocuments({
    createdAt: { $gte: today, $lt: tomorrow },
  });

  // Get yesterday's bookings for comparison
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayBookings = await Booking.countDocuments({
    createdAt: { $gte: yesterday, $lt: today },
  });

  const change =
    yesterdayBookings > 0
      ? (
          ((todayBookings - yesterdayBookings) / yesterdayBookings) *
          100
        ).toFixed(2)
      : 0;

  // Get hourly breakdown
  const hourlyStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: today, $lt: tomorrow },
      },
    },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        bookings: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Format hourly data
  const hourlyData = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourStat = hourlyStats.find((stat) => stat._id === hour);
    const timeLabel =
      hour === 0
        ? "12am"
        : hour < 12
        ? `${hour}am`
        : hour === 12
        ? "12pm"
        : `${hour - 12}pm`;

    hourlyData.push({
      time: timeLabel,
      bookings: hourStat?.bookings || 0,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalBookings: todayBookings,
        change: parseFloat(change),
        hourlyData: hourlyData,
      },
      "Today's bookings retrieved successfully"
    )
  );
});

// Get recent bookings
const getRecentBookings = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recentBookings = await Booking.find()
    .populate("user", "firstName lastName email")
    .populate("package", "title")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  const formattedBookings = recentBookings.map((booking) => ({
    id: `# ${booking.bookingNumber}`,
    user: `${booking.user?.firstName || ""} ${booking.user?.lastName || ""}`,
    status: booking.status,
    total: `$ ${(booking.totalAmount || 0).toFixed(2)}`,
    package: booking.package?.title || "Unknown Package",
    createdAt: booking.createdAt,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings: formattedBookings,
        total: recentBookings.length,
      },
      "Recent bookings retrieved successfully"
    )
  );
});

// Get trending packages
const getTrendingPackages = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trendingPackages = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $in: ["confirmed", "completed"] },
      },
    },
    {
      $group: {
        _id: "$package",
        bookingCount: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    {
      $lookup: {
        from: "packages",
        localField: "_id",
        foreignField: "_id",
        as: "package",
      },
    },
    {
      $unwind: "$package",
    },
    {
      $sort: { bookingCount: -1 },
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  const formattedPackages = trendingPackages.map((item) => ({
    name: item.package.title,
    packId:
      item.package.packageCode ||
      `PKG-${item.package._id.toString().slice(-4)}`,
    price: `$ ${(
      item.package.price.sellingPrice || item.package.price.basePrice
    ).toFixed(2)}`,
    bookingCount: item.bookingCount,
    totalRevenue: item.totalRevenue,
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        packages: formattedPackages,
        totalVisitors: "10.4k", // This could be calculated from visitor data
      },
      "Trending packages retrieved successfully"
    )
  );
});

// Get users in last day
const getUsersInLastDay = asyncHandler(async (req, res) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique visitors in last 24 hours
  const visitorStats = await Visitor.getHourlyVisitors();
  const totalVisitors = visitorStats.reduce(
    (sum, stat) => sum + stat.visits,
    0
  );

  // Get previous day for comparison
  const dayBeforeYesterday = new Date(yesterday);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

  const previousDayStats = await Visitor.aggregate([
    {
      $match: {
        visitDate: {
          $gte: dayBeforeYesterday,
          $lt: yesterday,
        },
      },
    },
    {
      $group: {
        _id: { $hour: "$visitDate" },
        visits: { $sum: 1 },
      },
    },
  ]);

  const previousTotalVisitors = previousDayStats.reduce(
    (sum, stat) => sum + stat.visits,
    0
  );
  const change =
    previousTotalVisitors > 0
      ? (
          ((totalVisitors - previousTotalVisitors) / previousTotalVisitors) *
          100
        ).toFixed(2)
      : 0;

  // Format hourly data
  const hourlyData = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourStat = visitorStats.find((stat) => stat._id === hour);
    const timeLabel =
      hour === 0
        ? "12am"
        : hour < 12
        ? `${hour}am`
        : hour === 12
        ? "12pm"
        : `${hour - 12}pm`;

    hourlyData.push({
      time: timeLabel,
      users: hourStat?.visits || 0,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers: totalVisitors,
        change: parseFloat(change),
        hourlyData: hourlyData,
      },
      "Users in last day retrieved successfully"
    )
  );
});

export {
  getOverviewStats,
  getSiteVisits,
  getTotalBookings,
  getTotalProfit,
  getCancelledBookings,
  getTodayBookings,
  getRecentBookings,
  getTrendingPackages,
  getUsersInLastDay,
};
