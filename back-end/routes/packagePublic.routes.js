import express from "express";
import {
  getFeaturedPackages,
  getPackagesByCategory,
  searchPackages,
  getPackagesByLocation,
  getPackage, // Public access to get single package
} from "../controllers/package.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages (Public)
 *   description: Public package endpoints for frontend consumption
 */

/**
 * @swagger
 * /packages/featured:
 *   get:
 *     summary: Get featured packages (Public)
 *     tags: [Packages (Public)]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Maximum number of packages to return
 *     responses:
 *       200:
 *         description: Featured packages retrieved successfully
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
 *                         $ref: '#/components/schemas/Package'
 */
router.route("/featured").get(getFeaturedPackages);

/**
 * @swagger
 * /packages/category/{category}:
 *   get:
 *     summary: Get packages by category (Public)
 *     tags: [Packages (Public)]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [tour, activity, experience, attraction, accommodation]
 *         description: Package category
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of packages per page
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, popularity, newest]
 *           default: popularity
 *         description: Sort packages by
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.route("/category/:category").get(getPackagesByCategory);

/**
 * @swagger
 * /packages/search:
 *   get:
 *     summary: Search packages (Public)
 *     tags: [Packages (Public)]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of packages per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [tour, activity, experience, attraction, accommodation]
 *         description: Filter by category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, popularity, newest]
 *           default: popularity
 *         description: Sort packages by
 *     responses:
 *       200:
 *         description: Packages found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Search term required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/search").get(searchPackages);

/**
 * @swagger
 * /packages/location:
 *   get:
 *     summary: Get packages by location (Public)
 *     tags: [Packages (Public)]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country name
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Number of packages per page
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.route("/location").get(getPackagesByLocation);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get package by ID (Public)
 *     tags: [Packages (Public)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Package'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id").get(getPackage);

export default router;
