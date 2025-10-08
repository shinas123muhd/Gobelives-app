import Event from "../models/Event.model.js";
import Booking from "../models/Booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new event (standalone)
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    destination,
    startDate,
    endDate,
    duration,
    maxBookings,
    startLocation,
    endLocation,
    status,
    priority,
    notes,
    internalNotes,
  } = req.body;

  // Validation
  if (!title || !description || !destination || !startDate || !endDate) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!maxBookings || maxBookings < 1) {
    throw new ApiError(400, "Maximum bookings must be at least 1");
  }

  if (!startLocation || !endLocation) {
    throw new ApiError(400, "Start and end locations are required");
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    throw new ApiError(400, "End date must be after start date");
  }

  // Create standalone event
  const event = await Event.create({
    title,
    description,
    destination,
    startDate: start,
    endDate: end,
    duration,
    maxBookings,
    startLocation,
    endLocation,
    eventType: "standalone",
    status: status || "active",
    priority: priority || "medium",
    notes,
    internalNotes,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"));
});

// @desc    Get all events with filtering, sorting, and pagination
// @route   GET /api/events
// @access  Private/Admin
const getEvents = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "startDate",
    sortOrder = "asc",
    status,
    eventType,
    bookingType,
    startDate,
    endDate,
    search,
    dateFilter, // For predefined filters like "7days", "30days", "upcoming", "past"
  } = req.query;

  // Build filter object
  const filter = {};

  if (status) filter.status = status;
  if (eventType) filter.eventType = eventType;
  if (bookingType) filter.bookingType = bookingType;

  // Date range filter
  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }

  // Predefined date filters
  const now = new Date();
  if (dateFilter) {
    switch (dateFilter) {
      case "7days":
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filter.startDate = { $gte: last7Days };
        break;
      case "30days":
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filter.startDate = { $gte: last30Days };
        break;
      case "3months":
        const last3Months = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        filter.startDate = { $gte: last3Months };
        break;
      case "upcoming":
        filter.startDate = { $gt: now };
        break;
      case "past":
        filter.endDate = { $lt: now };
        break;
    }
  }

  // Search by title or destination
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { destination: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get events with filtering, sorting, and pagination
  const events = await Event.find(filter)
    .populate("linkedBooking", "bookingReference status guestDetails")
    .populate("user", "firstName lastName email")
    .populate("hotel", "name location images")
    .populate("package", "title images")
    .populate("property", "name location images")
    .populate("createdBy", "firstName lastName email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Event.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Events retrieved successfully"
    )
  );
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private/Admin
const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("linkedBooking")
    .populate("user", "firstName lastName email phone")
    .populate("hotel", "name location phone email images")
    .populate("package", "title location price duration images")
    .populate("property", "name location images")
    .populate("bookings")
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event retrieved successfully"));
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Prevent updating auto-generated booking-linked events
  if (event.autoGenerated && event.eventType === "booking-linked") {
    throw new ApiError(
      400,
      "Cannot manually update auto-generated booking events. Update the booking instead."
    );
  }

  const {
    title,
    description,
    destination,
    startDate,
    endDate,
    duration,
    maxBookings,
    startLocation,
    endLocation,
    status,
    priority,
    notes,
    internalNotes,
  } = req.body;

  // Update fields
  if (title) event.title = title;
  if (description) event.description = description;
  if (destination) event.destination = destination;
  if (startDate) event.startDate = new Date(startDate);
  if (endDate) event.endDate = new Date(endDate);
  if (duration) event.duration = duration;
  if (maxBookings) event.maxBookings = maxBookings;
  if (startLocation) event.startLocation = startLocation;
  if (endLocation) event.endLocation = endLocation;
  if (status) event.status = status;
  if (priority) event.priority = priority;
  if (notes !== undefined) event.notes = notes;
  if (internalNotes !== undefined) event.internalNotes = internalNotes;

  event.updatedBy = req.user._id;

  await event.save();

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event updated successfully"));
});

// @desc    Delete/Cancel event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const { reason } = req.body;

  // If it's a booking-linked event, also cancel the booking
  if (event.eventType === "booking-linked" && event.linkedBooking) {
    const booking = await Booking.findById(event.linkedBooking);
    if (booking && booking.status !== "cancelled") {
      await booking.cancelBooking(
        req.user._id,
        reason || "Event cancelled by admin"
      );
    }
  }

  // For standalone events with bookings, cancel all associated bookings
  if (event.eventType === "standalone" && event.bookings.length > 0) {
    for (const bookingId of event.bookings) {
      const booking = await Booking.findById(bookingId);
      if (booking && booking.status !== "cancelled") {
        await booking.cancelBooking(
          req.user._id,
          reason || "Event cancelled by admin"
        );
      }
    }
  }

  // Delete the event
  await Event.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Event deleted successfully"));
});

// @desc    Get calendar events for a specific month
// @route   GET /api/events/calendar/:year/:month
// @access  Private/Admin
const getCalendarEvents = asyncHandler(async (req, res) => {
  const { year, month } = req.params;

  if (!year || !month) {
    throw new ApiError(400, "Year and month are required");
  }

  const events = await Event.getCalendarEvents(parseInt(month), parseInt(year));

  return res
    .status(200)
    .json(
      new ApiResponse(200, events, "Calendar events retrieved successfully")
    );
});

// @desc    Get events by date range
// @route   GET /api/events/range
// @access  Private/Admin
const getEventsByDateRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, "Start date and end date are required");
  }

  const events = await Event.getByDateRange(
    new Date(startDate),
    new Date(endDate)
  )
    .populate("linkedBooking", "bookingReference status guestDetails")
    .populate("user", "firstName lastName email")
    .populate("hotel", "name location")
    .populate("package", "title")
    .populate("property", "name location");

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Events retrieved successfully"));
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private/Admin
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const events = await Event.findUpcoming()
    .limit(parseInt(limit))
    .populate("linkedBooking", "bookingReference status")
    .populate("user", "firstName lastName")
    .populate("hotel", "name")
    .populate("package", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(200, events, "Upcoming events retrieved successfully")
    );
});

// @desc    Get past events
// @route   GET /api/events/past
// @access  Private/Admin
const getPastEvents = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const events = await Event.findPast()
    .limit(parseInt(limit))
    .populate("linkedBooking", "bookingReference status")
    .populate("user", "firstName lastName")
    .populate("hotel", "name")
    .populate("package", "title");

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Past events retrieved successfully"));
});

// @desc    Get current/ongoing events
// @route   GET /api/events/current
// @access  Private/Admin
const getCurrentEvents = asyncHandler(async (req, res) => {
  const events = await Event.findCurrent()
    .populate("linkedBooking", "bookingReference status")
    .populate("user", "firstName lastName")
    .populate("hotel", "name")
    .populate("package", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(200, events, "Current events retrieved successfully")
    );
});

// @desc    Update event status
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (
    !["active", "inactive", "draft", "cancelled", "completed"].includes(status)
  ) {
    throw new ApiError(400, "Invalid status value");
  }

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  event.status = status;
  event.updatedBy = req.user._id;
  await event.save();

  // If status is cancelled or completed, update linked booking
  if (
    event.linkedBooking &&
    (status === "cancelled" || status === "completed")
  ) {
    const booking = await Booking.findById(event.linkedBooking);
    if (booking) {
      booking.status = status;
      await booking.save();
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event status updated successfully"));
});

// @desc    Get event statistics
// @route   GET /api/events/stats
// @access  Private/Admin
const getEventStats = asyncHandler(async (req, res) => {
  const stats = await Event.getEventStats();

  // Additional stats
  const now = new Date();
  const upcomingCount = await Event.countDocuments({
    startDate: { $gt: now },
    status: { $in: ["active", "confirmed"] },
  });

  const currentCount = await Event.countDocuments({
    startDate: { $lte: now },
    endDate: { $gte: now },
    status: { $in: ["active", "confirmed"] },
  });

  const pastCount = await Event.countDocuments({
    endDate: { $lt: now },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...(stats[0] || {}),
        upcomingEvents: upcomingCount,
        currentEvents: currentCount,
        pastEvents: pastCount,
      },
      "Event statistics retrieved successfully"
    )
  );
});

// @desc    Complete event
// @route   POST /api/events/:id/complete
// @access  Private/Admin
const completeEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.status === "completed") {
    throw new ApiError(400, "Event is already completed");
  }

  await event.completeEvent();

  return res
    .status(200)
    .json(
      new ApiResponse(200, event, "Event marked as completed successfully")
    );
});

// @desc    Cancel event
// @route   POST /api/events/:id/cancel
// @access  Private/Admin
const cancelEvent = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (event.status === "cancelled") {
    throw new ApiError(400, "Event is already cancelled");
  }

  await event.cancelEvent(req.user._id, reason);

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event cancelled successfully"));
});

export {
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
};
