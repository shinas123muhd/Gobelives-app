import express from "express";
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  permanentDeleteBlog,
  toggleFeatured,
  getFeaturedBlogs,
  getPopularBlogs,
  getRecentBlogs,
  getRelatedBlogs,
  getBlogStats,
  searchBlogs,
} from "../controllers/blogs.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/search", searchBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/popular", getPopularBlogs);
router.get("/recent", getRecentBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id", getBlogById);
router.get("/", getAllBlogs);

// Protected admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createBlog
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateBlog
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBlog);
router.delete(
  "/:id/permanent",
  authMiddleware,
  adminMiddleware,
  permanentDeleteBlog
);
router.patch("/:id/featured", authMiddleware, adminMiddleware, toggleFeatured);
router.get("/admin/stats", authMiddleware, adminMiddleware, getBlogStats);

export default router;
