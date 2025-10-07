import express from "express";
import {
  getOverviewStats,
  getSiteVisits,
  getTotalBookings,
  getTotalProfit,
  getCancelledBookings,
  getTodayBookings,
  getRecentBookings,
  getTrendingPackages,
  getUsersInLastDay,
} from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

// Apply authentication and admin middleware to all dashboard routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Overview statistics
router.get("/overview", getOverviewStats);

// Individual metric endpoints
router.get("/site-visits", getSiteVisits);
router.get("/total-bookings", getTotalBookings);
router.get("/total-profit", getTotalProfit);
router.get("/cancelled-bookings", getCancelledBookings);

// Today's data
router.get("/today-bookings", getTodayBookings);
router.get("/users-last-day", getUsersInLastDay);

// Recent data
router.get("/recent-bookings", getRecentBookings);
router.get("/trending-packages", getTrendingPackages);

export default router;
