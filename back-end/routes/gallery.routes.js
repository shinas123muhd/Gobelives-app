import express from "express";
import {
  getAllImages,
  getImageById,
  getImageBySlug,
  uploadImage,
  updateImage,
  deleteImage,
  permanentDeleteImage,
  toggleFeatured,
  getFeaturedImages,
  getPopularImages,
  getRecentImages,
  getGalleryStats,
  searchImages,
  trackDownload,
  bulkDeleteImages,
  bulkToggleFeatured,
} from "../controllers/gallery.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes (specific routes before dynamic params)
router.get("/search", searchImages);
router.get("/featured", getFeaturedImages);
router.get("/popular", getPopularImages);
router.get("/recent", getRecentImages);

// Protected admin routes (specific routes before dynamic params)
router.get("/admin/stats", authMiddleware, adminMiddleware, getGalleryStats);
router.post("/bulk-delete", authMiddleware, adminMiddleware, bulkDeleteImages);
router.post(
  "/bulk-featured",
  authMiddleware,
  adminMiddleware,
  bulkToggleFeatured
);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadImage
);

// Dynamic routes (must come after specific routes)
router.get("/slug/:slug", getImageBySlug);
router.get("/:id", getImageById);
router.post("/:id/download", trackDownload);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateImage
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteImage);
router.delete(
  "/:id/permanent",
  authMiddleware,
  adminMiddleware,
  permanentDeleteImage
);
router.patch("/:id/featured", authMiddleware, adminMiddleware, toggleFeatured);

// General route (must be last)
router.get("/", getAllImages);

export default router;
