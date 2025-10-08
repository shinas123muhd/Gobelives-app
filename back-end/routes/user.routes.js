import express from "express";
import {
  getUsers,
  getUser,
  getMyProfile,
  updateUser,
  deleteUser,
  getUserStats,
  updateUserRole,
  toggleUserStatus,
  getUserBookings,
  getUserRewards,
  addPointsToUser,
  bulkUpdateUsers,
  getUserByReferralCode,
  getUserReferrals,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public routes
router.get("/referral/:code", getUserByReferralCode);

// Protected routes (require authentication)
router.use(authMiddleware);

// User profile routes (must be before /:id routes)
router.get("/profile/me", getMyProfile);

// Admin routes (must be before /:id routes to avoid conflict)
router.get("/stats", authMiddleware, adminMiddleware, getUserStats);

// User-specific routes (user can access their own data)
router.get("/:id/bookings", getUserBookings);
router.get("/:id/rewards", getUserRewards);
router.get("/:id/referrals", getUserReferrals);

// Admin routes
router.use(adminMiddleware);

// User management
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// User role and status management
router.patch("/:id/role", updateUserRole);
router.patch("/:id/toggle-status", toggleUserStatus);

// Points management
router.post("/:id/points", addPointsToUser);

// Bulk operations
router.patch("/bulk-update", bulkUpdateUsers);

export default router;
