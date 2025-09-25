import express from "express";
import {
  getActiveCategories,
  getFeaturedCategories,
  getCategoryHierarchy,
  searchCategories,
  getCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// Public routes for frontend consumption (no authentication required)

// Get active categories for public use
router.route("/active").get(getActiveCategories);

// Get featured categories for public use
router.route("/featured").get(getFeaturedCategories);

// Get category hierarchy for navigation
router.route("/hierarchy").get(getCategoryHierarchy);

// Search categories
router.route("/search").get(searchCategories);

// Get single category by ID (public)
router.route("/:id").get(getCategory);

export default router;
