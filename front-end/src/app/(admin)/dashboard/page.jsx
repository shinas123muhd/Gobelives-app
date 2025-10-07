"use client";
import React from "react";
import OverviewCard from "./components/OverviewCard";
import SiteVisitsCard from "./components/SiteVisitsCard";
import TotalBookingsCard from "./components/TotalBookingsCard";
import TotalProfitCard from "./components/TotalProfitCard";
import CancelledBookingsCard from "./components/CancelledBookingsCard";
import BookingCalendar from "./components/BookingCalendar";
import TodayBookings from "./components/TodayBookings";
import LastTransactions from "./components/LastTransactions";
import UsersInLastDay from "./components/UsersInLastDay";
import RecentBookings from "./components/RecentBookings";
import TrendingPackages from "./components/TrendingPackages";
import { useDashboard } from "../../../hooks/useDashboard";

const DashboardPage = () => {
  const {
    overview,
    siteVisits,
    totalBookings,
    totalProfit,
    cancelledBookings,
    todayBookings,
    usersInLastDay,
    recentBookings,
    trendingPackages,
    isLoading,
    hasError,
  } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600">
            Unable to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen flex flex-col overflow-y-auto bg-gray-50 p-6">
      <div className="w-full mx-auto h-full overflow-y-auto">
        {/* Page Header */}

        {/* Top Row - Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
          <div className="lg:col-span-2">
            <OverviewCard data={overview} />
          </div>
          <div className="">
            <SiteVisitsCard data={siteVisits} />
          </div>
        </div>

        {/* Middle Row - Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
          <div>
            <TotalBookingsCard data={totalBookings} />
          </div>
          <div>
            <TotalProfitCard data={totalProfit} />
          </div>
          <div>
            <CancelledBookingsCard data={cancelledBookings} />
          </div>
        </div>

        {/* Bottom Row 1 - Calendar and Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
          <div>
            <BookingCalendar />
          </div>
          <div>
            <UsersInLastDay data={usersInLastDay} />
          </div>
        </div>

        {/* Bottom Row 2 - Today Bookings and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
          <div>
            <TodayBookings data={todayBookings} />
          </div>
          <div>
            <LastTransactions />
          </div>
        </div>

        {/* Additional Row - Recent Bookings and Trending Packages */}
        <div className="grid grid-cols-1   lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2 h-[460px]">
            <RecentBookings data={recentBookings} />
          </div>
          <div className="h-[460px]">
            <TrendingPackages data={trendingPackages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
