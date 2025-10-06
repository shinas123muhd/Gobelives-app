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
  addPackageReview,
  getPackageReviews,
} from "../controllers/package.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management for admin users
 */

/**
 * @swagger
 * /packages:
 *   post:
 *     summary: Create a new package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete City Experience"
 *               description:
 *                 type: string
 *                 example: "A comprehensive city tour package"
 *               shortDescription:
 *                 type: string
 *                 example: "City tour package"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "123 Main Street"
 *                   city:
 *                     type: string
 *                     example: "Paris"
 *                   state:
 *                     type: string
 *                     example: "Île-de-France"
 *                   country:
 *                     type: string
 *                     example: "France"
 *               price:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                     example: 299
 *                   sellingPrice:
 *                     type: number
 *                     example: 249
 *                   currency:
 *                     type: string
 *                     enum: [USD, EUR, GBP, INR]
 *                     example: EUR
 *                   discount:
 *                     type: number
 *                     example: 15
 *               capacity:
 *                 type: object
 *                 properties:
 *                   maxGuests:
 *                     type: number
 *                     example: 25
 *                   minGuests:
 *                     type: number
 *                     example: 2
 *                   allowKids:
 *                     type: boolean
 *                     example: true
 *               duration:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                     example: 3
 *                   unit:
 *                     type: string
 *                     enum: [hours, days, weeks]
 *                     example: days
 *               category:
 *                 type: string
 *                 enum: [tour, activity, experience, attraction, accommodation]
 *                 example: tour
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["City tour", "Museum visit", "Local cuisine"]
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [English, Hindi, Spanish, French, German, Japanese]
 *                 example: ["English", "French"]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["city", "culture", "food"]
 *     responses:
 *       201:
 *         description: Package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Package'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Get all packages (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, draft, suspended]
 *         description: Filter by status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [tour, activity, experience, attraction, accommodation]
 *         description: Filter by category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router
  .route("/")
  .post(
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    createPackage
  )
  .get(getPackages);

/**
 * @swagger
 * /packages/{id}:
 *   get:
 *     summary: Get package by ID (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete City Experience"
 *               description:
 *                 type: string
 *                 example: "A comprehensive city tour package"
 *               shortDescription:
 *                 type: string
 *                 example: "City tour package"
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft, suspended]
 *                 example: active
 *               featured:
 *                 type: boolean
 *                 example: true
 *               price:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                     example: 299
 *                   sellingPrice:
 *                     type: number
 *                     example: 249
 *                   discount:
 *                     type: number
 *                     example: 15
 *     responses:
 *       200:
 *         description: Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Package'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Package not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router
  .route("/:id")
  .get(getPackage)
  .put(
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    updatePackage
  )
  .delete(deletePackage);

/**
 * @swagger
 * /packages/{id}/status:
 *   patch:
 *     summary: Update package status (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, draft, suspended]
 *                 example: active
 *     responses:
 *       200:
 *         description: Package status updated successfully
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id/status").patch(updatePackageStatus);

/**
 * @swagger
 * /packages/{id}/featured:
 *   patch:
 *     summary: Toggle package featured status (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package featured status updated successfully
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id/featured").patch(toggleFeaturedPackage);

/**
 * @swagger
 * /packages/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete specific image from package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Package or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/:id/images/:imageId").delete(deletePackageImage);

/**
 * @swagger
 * /packages/stats:
 *   get:
 *     summary: Get package statistics (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Package statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalPackages:
 *                           type: number
 *                           example: 150
 *                         activePackages:
 *                           type: number
 *                           example: 120
 *                         draftPackages:
 *                           type: number
 *                           example: 20
 *                         featuredPackages:
 *                           type: number
 *                           example: 15
 *                         averageRating:
 *                           type: number
 *                           example: 4.2
 *                         totalBookings:
 *                           type: number
 *                           example: 500
 *                         totalViews:
 *                           type: number
 *                           example: 2500
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/stats").get(getPackageStats);

// Review routes
router
  .route("/:id/reviews")
  .get(getPackageReviews)
  .post(authMiddleware, addPackageReview);

export default router;
