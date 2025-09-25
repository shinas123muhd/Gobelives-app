import express from "express";
import {
  getFeaturedPackages,
  getPackagesByCategory,
  searchPackages,
  getPackagesByLocation,
  getPackage, // Public access to get single package
} from "../controllers/package.controller.js";

const router = express.Router();

// Public routes for frontend consumption (no authentication required)
router.route("/featured").get(getFeaturedPackages);
router.route("/category/:category").get(getPackagesByCategory);
router.route("/search").get(searchPackages);
router.route("/location").get(getPackagesByLocation);
router.route("/:id").get(getPackage); // Public access to get single package

export default router;
