import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  toggleCategoryStatus,
  toggleFeaturedCategory,
  getActiveCategories,
  getFeaturedCategories,
  getCategoryHierarchy,
  searchCategories,
  getCategoryStats,
  updateCategoryPackageCount,
  bulkUpdateCategoryStatus,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes are protected and require admin role
router.use(authMiddleware, adminMiddleware);

// Configure multer for single image upload
const multerUpload = upload.single("image");

router.route("/").post(multerUpload, createCategory).get(getCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(multerUpload, updateCategory)
  .delete(deleteCategory);

router.route("/:id/status").patch(updateCategoryStatus);

router.route("/:id/featured").patch(toggleFeaturedCategory);

// Additional category-specific routes
router.route("/:id/toggle-status").patch(toggleCategoryStatus);
router.route("/stats").get(getCategoryStats);
router.route("/:id/update-package-count").patch(updateCategoryPackageCount);
router.route("/bulk-status").patch(bulkUpdateCategoryStatus);

export default router;
