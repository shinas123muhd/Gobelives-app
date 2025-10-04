import express from "express";
import {
  createBooking,
  getBookings,
  getBooking,
  getBookingByReference,
  updateBooking,
  cancelBooking,
  confirmBooking,
  updateBookingStatus,
  updatePaymentStatus,
  getMyBookings,
  getBookingStats,
  deleteBooking,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management for hotels, packages, and properties
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingType
 *               - checkIn
 *               - checkOut
 *               - guests
 *               - guestDetails
 *               - pricing
 *             properties:
 *               bookingType:
 *                 type: string
 *                 enum: [hotel, package, property]
 *               hotelId:
 *                 type: string
 *               packageId:
 *                 type: string
 *               propertyId:
 *                 type: string
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *               guests:
 *                 type: object
 *                 properties:
 *                   adults:
 *                     type: number
 *                   children:
 *                     type: number
 *                   infants:
 *                     type: number
 *               guestDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: object
 *               pricing:
 *                 type: object
 *                 properties:
 *                   basePrice:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *                   currency:
 *                     type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error or availability issue
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hotel/Package not found
 */
router.post("/", authMiddleware, createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings with filtering
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, checked_in, checked_out, cancelled, completed, no_show]
 *       - in: query
 *         name: bookingType
 *         schema:
 *           type: string
 *           enum: [hotel, package, property]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by booking reference or guest name
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getBookings);

/**
 * @swagger
 * /bookings/user/my-bookings:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [upcoming, past, current]
 *         description: Filter by booking time
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/user/my-bookings", authMiddleware, getMyBookings);

/**
 * @swagger
 * /bookings/stats:
 *   get:
 *     summary: Get booking statistics (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get("/stats", authMiddleware, adminMiddleware, getBookingStats);

/**
 * @swagger
 * /bookings/reference/{reference}:
 *   get:
 *     summary: Get booking by reference number
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking reference number
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Guest email for verification
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: Booking not found or email doesn't match
 */
router.get("/reference/:reference", getBookingByReference);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.get("/:id", authMiddleware, getBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkIn:
 *                 type: string
 *                 format: date-time
 *               checkOut:
 *                 type: string
 *                 format: date-time
 *               guests:
 *                 type: object
 *               guestDetails:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.put("/:id", authMiddleware, updateBooking);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Cannot cancel this booking
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.post("/:id/cancel", authMiddleware, cancelBooking);

/**
 * @swagger
 * /bookings/{id}/confirm:
 *   post:
 *     summary: Confirm booking (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Booking not found
 */
router.post("/:id/confirm", authMiddleware, adminMiddleware, confirmBooking);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *                 enum: [pending, confirmed, checked_in, checked_out, cancelled, completed, no_show]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

/**
 * @swagger
 * /bookings/{id}/payment:
 *   patch:
 *     summary: Update payment status (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, processing, completed, failed, refunded, partially_refunded]
 *               transactionId:
 *                 type: string
 *               paidAmount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id/payment",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete booking (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Booking not found
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteBooking);

export default router;
