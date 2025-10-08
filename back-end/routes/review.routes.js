import express from "express";
import {
  checkReviewEligibility,
  createReview,
  getPropertyReviews,
  getPackageReviews,
  getReview,
  updateReview,
  deleteReview,
  markReviewAsHelpful,
  unmarkReviewAsHelpful,
  addAdminResponse,
  getAllReviews,
  updateReviewStatus,
  getMyReviews,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/property/:propertyId", getPropertyReviews);
router.get("/package/:packageId", getPackageReviews);
router.get("/:id", getReview);

// Protected routes (requires authentication)
router.get("/can-review/:bookingId", authMiddleware, checkReviewEligibility);
router.post("/", authMiddleware, upload.array("images", 5), createReview);
router.get("/user/my-reviews", authMiddleware, getMyReviews);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
router.post("/:id/helpful", authMiddleware, markReviewAsHelpful);
router.delete("/:id/helpful", authMiddleware, unmarkReviewAsHelpful);

// Admin routes (requires authentication + admin role)
router.post("/:id/response", authMiddleware, adminMiddleware, addAdminResponse);

router.get("/admin/all", authMiddleware, adminMiddleware, getAllReviews);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateReviewStatus
);

export default router;
