import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardService";

export const useDashboard = (period = "7d") => {
  // Overview stats
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview", period],
    queryFn: () => dashboardService.getOverviewStats(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Site visits
  const siteVisitsQuery = useQuery({
    queryKey: ["dashboard", "site-visits", period],
    queryFn: () => dashboardService.getSiteVisits(period),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Total bookings
  const totalBookingsQuery = useQuery({
    queryKey: ["dashboard", "total-bookings", period],
    queryFn: () => dashboardService.getTotalBookings(period),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Total profit
  const totalProfitQuery = useQuery({
    queryKey: ["dashboard", "total-profit", period],
    queryFn: () => dashboardService.getTotalProfit(period),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Cancelled bookings
  const cancelledBookingsQuery = useQuery({
    queryKey: ["dashboard", "cancelled-bookings", period],
    queryFn: () => dashboardService.getCancelledBookings(period),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  // Today's bookings
  const todayBookingsQuery = useQuery({
    queryKey: ["dashboard", "today-bookings"],
    queryFn: () => dashboardService.getTodayBookings(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Users in last day
  const usersInLastDayQuery = useQuery({
    queryKey: ["dashboard", "users-last-day"],
    queryFn: () => dashboardService.getUsersInLastDay(),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Recent bookings
  const recentBookingsQuery = useQuery({
    queryKey: ["dashboard", "recent-bookings"],
    queryFn: () => dashboardService.getRecentBookings(10),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Trending packages
  const trendingPackagesQuery = useQuery({
    queryKey: ["dashboard", "trending-packages"],
    queryFn: () => dashboardService.getTrendingPackages(6),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });

  return {
    // Data
    overview: overviewQuery.data?.data,
    siteVisits: siteVisitsQuery.data?.data,
    totalBookings: totalBookingsQuery.data?.data,
    totalProfit: totalProfitQuery.data?.data,
    cancelledBookings: cancelledBookingsQuery.data?.data,
    todayBookings: todayBookingsQuery.data?.data,
    usersInLastDay: usersInLastDayQuery.data?.data,
    recentBookings: recentBookingsQuery.data?.data,
    trendingPackages: trendingPackagesQuery.data?.data,

    // Loading states
    isLoading:
      overviewQuery.isLoading ||
      siteVisitsQuery.isLoading ||
      totalBookingsQuery.isLoading ||
      totalProfitQuery.isLoading ||
      cancelledBookingsQuery.isLoading ||
      todayBookingsQuery.isLoading ||
      usersInLastDayQuery.isLoading ||
      recentBookingsQuery.isLoading ||
      trendingPackagesQuery.isLoading,

    // Error states
    hasError:
      overviewQuery.isError ||
      siteVisitsQuery.isError ||
      totalBookingsQuery.isError ||
      totalProfitQuery.isError ||
      cancelledBookingsQuery.isError ||
      todayBookingsQuery.isError ||
      usersInLastDayQuery.isError ||
      recentBookingsQuery.isError ||
      trendingPackagesQuery.isError,

    // Refetch functions
    refetchAll: () => {
      overviewQuery.refetch();
      siteVisitsQuery.refetch();
      totalBookingsQuery.refetch();
      totalProfitQuery.refetch();
      cancelledBookingsQuery.refetch();
      todayBookingsQuery.refetch();
      usersInLastDayQuery.refetch();
      recentBookingsQuery.refetch();
      trendingPackagesQuery.refetch();
    },
  };
};
