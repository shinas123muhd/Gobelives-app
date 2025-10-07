import express from "express";
import {
  getActiveCategories,
  getFeaturedCategories,
  getCategoryHierarchy,
  searchCategories,
  getCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// Test endpoint to check if the route is working
router.get("/test", (req, res) => {
  res.json({
    message: "Category public routes are working",
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to check categories in database
router.get("/debug", async (req, res) => {
  try {
    const Category = (await import("../models/Category.model.js")).default;
    const allCategories = await Category.find({});
    const activeCategories = await Category.find({
      isActive: true,
      status: "active",
    });

    res.json({
      message: "Debug info",
      totalCategories: allCategories.length,
      activeCategories: activeCategories.length,
      allCategories: allCategories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        status: cat.status,
        isActive: cat.isActive,
      })),
      activeCategoriesList: activeCategories.map((cat) => ({
        id: cat._id,
        name: cat.name,
        status: cat.status,
        isActive: cat.isActive,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * tags:
 *   name: Categories (Public)
 *   description: Public category endpoints for frontend consumption
 */

/**
 * @swagger
 * /categories/active:
 *   get:
 *     summary: Get all active categories (Public)
 *     tags: [Categories (Public)]
 *     responses:
 *       200:
 *         description: Active categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */
router.route("/active").get(getActiveCategories);

/**
 * @swagger
 * /categories/featured:
 *   get:
 *     summary: Get featured categories (Public)
 *     tags: [Categories (Public)]
 *     responses:
 *       200:
 *         description: Featured categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */
router.route("/featured").get(getFeaturedCategories);

/**
 * @swagger
 * /categories/hierarchy:
 *   get:
 *     summary: Get category hierarchy for navigation (Public)
 *     tags: [Categories (Public)]
 *     responses:
 *       200:
 *         description: Category hierarchy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Category'
 *                           - type: object
 *                             properties:
 *                               subCategories:
 *                                 type: array
 *                                 items:
 *                                   $ref: '#/components/schemas/Category'
 */
router.route("/hierarchy").get(getCategoryHierarchy);

/**
 * @swagger
 * /categories/search:
 *   get:
 *     summary: Search categories (Public)
 *     tags: [Categories (Public)]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Categories found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *       400:
 *         description: Search term required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/search").get(searchCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID (Public)
 *     tags: [Categories (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id").get(getCategory);

export default router;
