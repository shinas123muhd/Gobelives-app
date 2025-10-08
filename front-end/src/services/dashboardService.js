import axios from "../lib/axios";

const dashboardService = {
  // Get overview statistics
  getOverviewStats: async (period = "7d") => {
    try {
      const response = await axios.get(
        `/api/dashboard/overview?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      throw error;
    }
  },

  // Get site visits
  getSiteVisits: async (period = "7d") => {
    try {
      const response = await axios.get(
        `/api/dashboard/site-visits?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching site visits:", error);
      throw error;
    }
  },

  // Get total bookings
  getTotalBookings: async (period = "7d") => {
    try {
      const response = await axios.get(
        `/api/dashboard/total-bookings?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total bookings:", error);
      throw error;
    }
  },

  // Get total profit
  getTotalProfit: async (period = "7d") => {
    try {
      const response = await axios.get(
        `/api/dashboard/total-profit?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching total profit:", error);
      throw error;
    }
  },

  // Get cancelled bookings
  getCancelledBookings: async (period = "7d") => {
    try {
      const response = await axios.get(
        `/api/dashboard/cancelled-bookings?period=${period}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cancelled bookings:", error);
      throw error;
    }
  },

  // Get today's bookings
  getTodayBookings: async () => {
    try {
      const response = await axios.get("/api/dashboard/today-bookings");
      return response.data;
    } catch (error) {
      console.error("Error fetching today bookings:", error);
      throw error;
    }
  },

  // Get users in last day
  getUsersInLastDay: async () => {
    try {
      const response = await axios.get("/api/dashboard/users-last-day");
      return response.data;
    } catch (error) {
      console.error("Error fetching users in last day:", error);
      throw error;
    }
  },

  // Get recent bookings
  getRecentBookings: async (limit = 10) => {
    try {
      const response = await axios.get(
        `/api/dashboard/recent-bookings?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      throw error;
    }
  },

  // Get trending packages
  getTrendingPackages: async (limit = 6) => {
    try {
      const response = await axios.get(
        `/api/dashboard/trending-packages?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching trending packages:", error);
      throw error;
    }
  },
};

export default dashboardService;
