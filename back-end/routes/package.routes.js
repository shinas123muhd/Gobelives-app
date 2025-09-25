import express from "express";
import {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
  updatePackageStatus,
  toggleFeaturedPackage,
  getFeaturedPackages,
  getPackagesByCategory,
  searchPackages,
  getPackageStats,
  getPackagesByLocation,
  deletePackageImage,
} from "../controllers/package.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All admin routes are protected and require admin role
router.use(authMiddleware, adminMiddleware);

// Configure multer for file uploads
const multerUpload = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Admin CRUD routes
router.route("/").post(multerUpload, createPackage).get(getPackages);

router
  .route("/:id")
  .get(getPackage)
  .put(multerUpload, updatePackage)
  .delete(deletePackage);

router.route("/:id/status").patch(updatePackageStatus);

router.route("/:id/featured").patch(toggleFeaturedPackage);

// Delete specific image from package
router.route("/:id/images/:imageId").delete(deletePackageImage);

// Admin statistics route
router.route("/stats").get(getPackageStats);

export default router;
