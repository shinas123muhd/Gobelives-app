import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getCalendarEvents,
  getEventsByDateRange,
  getUpcomingEvents,
  getPastEvents,
  getCurrentEvents,
  updateEventStatus,
  getEventStats,
  completeEvent,
  cancelEvent,
} from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management for calendar and booking visibility
 */

// Stats route (must be before /:id)
router.get("/stats", authMiddleware, adminMiddleware, getEventStats);

// Upcoming, past, current events
router.get("/upcoming", authMiddleware, adminMiddleware, getUpcomingEvents);
router.get("/past", authMiddleware, adminMiddleware, getPastEvents);
router.get("/current", authMiddleware, adminMiddleware, getCurrentEvents);

// Calendar and date range routes
router.get(
  "/calendar/:year/:month",
  authMiddleware,
  adminMiddleware,
  getCalendarEvents
);
router.get("/range", authMiddleware, adminMiddleware, getEventsByDateRange);

// Main CRUD routes
router.post("/", authMiddleware, adminMiddleware, createEvent);
router.get("/", authMiddleware, adminMiddleware, getEvents);
router.get("/:id", authMiddleware, adminMiddleware, getEvent);
router.put("/:id", authMiddleware, adminMiddleware, updateEvent);
router.delete("/:id", authMiddleware, adminMiddleware, deleteEvent);

// Event actions
router.patch("/:id/status", authMiddleware, adminMiddleware, updateEventStatus);
router.post("/:id/complete", authMiddleware, adminMiddleware, completeEvent);
router.post("/:id/cancel", authMiddleware, adminMiddleware, cancelEvent);

export default router;
