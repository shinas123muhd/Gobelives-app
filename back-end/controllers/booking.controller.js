import Booking from "../models/Booking.model.js";
import Hotel from "../models/Hotel.model.js";
import Package from "../models/Package.model.js";
import User from "../models/User.model.js";
import Event from "../models/Event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    bookingType,
    hotelId,
    packageId,
    propertyId,
    checkIn,
    checkOut,
    guests,
    guestDetails,
    roomDetails,
    packageDetails,
    pricing,
    appliedCoupon,
    payment,
    notes,
    source,
  } = req.body;

  // Validation
  if (
    !bookingType ||
    !checkIn ||
    !checkOut ||
    !guests ||
    !guestDetails ||
    !pricing
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Validate booking type and reference
  let bookingRef = null;
  if (bookingType === "hotel") {
    if (!hotelId)
      throw new ApiError(400, "Hotel ID is required for hotel bookings");
    bookingRef = await Hotel.findById(hotelId);
    if (!bookingRef) throw new ApiError(404, "Hotel not found");
  } else if (bookingType === "package") {
    if (!packageId)
      throw new ApiError(400, "Package ID is required for package bookings");
    bookingRef = await Package.findById(packageId);
    if (!bookingRef) throw new ApiError(404, "Package not found");
  } else if (bookingType === "property") {
    if (!propertyId)
      throw new ApiError(400, "Property ID is required for property bookings");
    // Add property validation if you have a Property model
  }

  // Check availability (simplified - you should implement detailed logic)
  if (bookingType === "hotel") {
    if (
      !bookingRef.rooms ||
      bookingRef.rooms.availableRooms < (roomDetails?.numberOfRooms || 1)
    ) {
      throw new ApiError(400, "Not enough rooms available for selected dates");
    }
  }

  // Parse JSON fields if they are strings
  const parseField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  // Create booking
  const booking = await Booking.create({
    bookingType,
    hotel: hotelId || undefined,
    package: packageId || undefined,
    property: propertyId || undefined,
    user: req.user._id,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    guests: parseField(guests),
    guestDetails: parseField(guestDetails),
    roomDetails: roomDetails ? parseField(roomDetails) : undefined,
    packageDetails: packageDetails ? parseField(packageDetails) : undefined,
    pricing: parseField(pricing),
    appliedCoupon: appliedCoupon ? parseField(appliedCoupon) : undefined,
    payment: payment ? parseField(payment) : { status: "pending" },
    notes,
    source: source || "website",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Update availability for hotel
  if (bookingType === "hotel" && roomDetails) {
    await bookingRef.updateRoomAvailability(roomDetails.numberOfRooms || 1);
  }

  // Update booking count for package
  if (bookingType === "package") {
    await bookingRef.incrementBookingCount();
  }

  // Update user's booking history
  const user = await User.findById(req.user._id);
  user.bookings.push(booking._id);
  user.totalBookings += 1;
  await user.save();

  // Auto-create event from booking for calendar view
  try {
    const event = await Event.createFromBooking(booking);
    booking.linkedEvent = event._id;
    await booking.save();
  } catch (error) {
    console.error("Error creating event from booking:", error);
    // Don't fail the booking if event creation fails
  }

  // Populate booking details
  await booking.populate("user", "firstName lastName email");
  if (hotelId) await booking.populate("hotel", "name location phone");
  if (packageId) await booking.populate("package", "title location price");

  // Send confirmation email (implement this based on your email service)
  try {
    await sendEmail({
      to: guestDetails.email,
      subject: "Booking Confirmation - My Dream Place",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${guestDetails.firstName},</p>
        <p>Your booking has been confirmed. Booking Reference: <strong>${
          booking.bookingReference
        }</strong></p>
        <p>Check-in: ${new Date(checkIn).toLocaleDateString()}</p>
        <p>Check-out: ${new Date(checkOut).toLocaleDateString()}</p>
        <p>Total Amount: ${pricing.currency} ${pricing.totalPrice}</p>
        <p>Thank you for choosing My Dream Place!</p>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    // Don't fail the booking if email fails
  }

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

// @desc    Get all bookings with filtering, sorting, and pagination
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
    bookingType,
    startDate,
    endDate,
    userId,
    search,
  } = req.query;

  // Build filter object
  const filter = {};

  // Admin can see all bookings, users only their own
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    filter.user = req.user._id;
  } else if (userId) {
    filter.user = userId;
  }

  if (status) filter.status = status;
  if (bookingType) filter.bookingType = bookingType;

  // Date range filter
  if (startDate || endDate) {
    filter.checkIn = {};
    if (startDate) filter.checkIn.$gte = new Date(startDate);
    if (endDate) filter.checkIn.$lte = new Date(endDate);
  }

  // Search by booking reference or guest name
  if (search) {
    filter.$or = [
      { bookingReference: { $regex: search, $options: "i" } },
      { "guestDetails.firstName": { $regex: search, $options: "i" } },
      { "guestDetails.lastName": { $regex: search, $options: "i" } },
      { "guestDetails.email": { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get bookings with filtering, sorting, and pagination
  const bookings = await Booking.find(filter)
    .populate("user", "firstName lastName email phone")
    .populate("hotel", "name location phone email")
    .populate("package", "title location price")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Booking.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Bookings retrieved successfully"
    )
  );
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "firstName lastName email phone avatar")
    .populate("hotel", "name location phone email address images")
    .populate("package", "title location price duration activities")
    .populate("review");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if user is authorized to view this booking
  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to view this booking");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking retrieved successfully"));
});

// @desc    Get booking by reference number
// @route   GET /api/bookings/reference/:reference
// @access  Public (with email verification)
const getBookingByReference = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  const { email } = req.query;

  if (!email) {
    throw new ApiError(400, "Email is required to retrieve booking");
  }

  const booking = await Booking.findOne({
    bookingReference: reference,
    "guestDetails.email": email.toLowerCase(),
  })
    .populate("hotel", "name location phone email address images")
    .populate("package", "title location price duration activities");

  if (!booking) {
    throw new ApiError(404, "Booking not found or email doesn't match");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking retrieved successfully"));
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if user is authorized
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to update this booking");
  }

  // Only allow updates for pending bookings
  if (booking.status !== "pending" && req.user.role !== "admin") {
    throw new ApiError(400, "Cannot update confirmed or completed bookings");
  }

  const {
    checkIn,
    checkOut,
    guests,
    guestDetails,
    roomDetails,
    packageDetails,
    notes,
  } = req.body;

  // Parse JSON fields if they are strings
  const parseField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  // Update fields
  if (checkIn) booking.checkIn = new Date(checkIn);
  if (checkOut) booking.checkOut = new Date(checkOut);
  if (guests) booking.guests = parseField(guests);
  if (guestDetails)
    booking.guestDetails = {
      ...booking.guestDetails,
      ...parseField(guestDetails),
    };
  if (roomDetails)
    booking.roomDetails = {
      ...booking.roomDetails,
      ...parseField(roomDetails),
    };
  if (packageDetails)
    booking.packageDetails = {
      ...booking.packageDetails,
      ...parseField(packageDetails),
    };
  if (notes) booking.notes = notes;

  await booking.save();

  await booking.populate("user", "firstName lastName email");
  await booking.populate("hotel", "name location phone");
  await booking.populate("package", "title location price");

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking updated successfully"));
});

// @desc    Cancel booking
// @route   POST /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Check if user is authorized
  if (
    booking.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to cancel this booking");
  }

  // Check if booking can be cancelled
  if (["cancelled", "completed", "checked_out"].includes(booking.status)) {
    throw new ApiError(400, `Cannot cancel a ${booking.status} booking`);
  }

  const { reason } = req.body;

  // Use the model method to cancel
  await booking.cancelBooking(req.user._id, reason);

  // Update linked event status if exists
  if (booking.linkedEvent) {
    try {
      const event = await Event.findById(booking.linkedEvent);
      if (event) {
        event.status = "cancelled";
        await event.save();
      }
    } catch (error) {
      console.error("Error updating linked event:", error);
    }
  }

  // Calculate refund based on cancellation policy (simplified)
  const now = new Date();
  const hoursUntilCheckIn = (booking.checkIn - now) / (1000 * 60 * 60);

  let refundPercentage = 0;
  if (hoursUntilCheckIn > 48) {
    refundPercentage = 100;
  } else if (hoursUntilCheckIn > 24) {
    refundPercentage = 50;
  } else {
    refundPercentage = 0;
  }

  booking.cancellation.refundEligible = refundPercentage > 0;
  booking.cancellation.refundAmount =
    (booking.pricing.totalPrice * refundPercentage) / 100;
  booking.cancellation.refundStatus =
    refundPercentage > 0 ? "pending" : "rejected";

  await booking.save();

  // Restore hotel room availability if applicable
  if (booking.bookingType === "hotel" && booking.roomDetails) {
    const hotel = await Hotel.findById(booking.hotel);
    if (hotel) {
      hotel.rooms.availableRooms += booking.roomDetails.numberOfRooms || 1;
      await hotel.save();
    }
  }

  // Send cancellation email
  try {
    await sendEmail({
      to: booking.guestDetails.email,
      subject: "Booking Cancellation - My Dream Place",
      html: `
        <h2>Booking Cancelled</h2>
        <p>Dear ${booking.guestDetails.firstName},</p>
        <p>Your booking has been cancelled. Booking Reference: <strong>${
          booking.bookingReference
        }</strong></p>
        ${
          booking.cancellation.refundEligible
            ? `<p>Refund Amount: ${booking.pricing.currency} ${booking.cancellation.refundAmount}</p><p>Your refund will be processed within 5-7 business days.</p>`
            : "<p>No refund applicable as per cancellation policy.</p>"
        }
        <p>We hope to serve you again in the future.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

// @desc    Confirm booking
// @route   POST /api/bookings/:id/confirm
// @access  Private/Admin
const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== "pending") {
    throw new ApiError(400, "Only pending bookings can be confirmed");
  }

  // Use the model method to confirm
  await booking.confirmBooking();

  // Send confirmation email
  try {
    await sendEmail({
      to: booking.guestDetails.email,
      subject: "Booking Confirmed - My Dream Place",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${booking.guestDetails.firstName},</p>
        <p>Your booking has been confirmed. Booking Reference: <strong>${
          booking.bookingReference
        }</strong></p>
        <p>Confirmation Code: <strong>${
          booking.confirmation.confirmationCode
        }</strong></p>
        <p>Check-in: ${booking.checkIn.toLocaleDateString()}</p>
        <p>Check-out: ${booking.checkOut.toLocaleDateString()}</p>
        <p>We look forward to welcoming you!</p>
      `,
    });

    booking.confirmation.confirmationSent = true;
    await booking.save();
  } catch (error) {
    console.error("Email sending error:", error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking confirmed successfully"));
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (
    ![
      "pending",
      "confirmed",
      "checked_in",
      "checked_out",
      "cancelled",
      "completed",
      "no_show",
    ].includes(status)
  ) {
    throw new ApiError(400, "Invalid status value");
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Use the model method to update status
  await booking.updateStatus(status, req.user._id, reason);

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking status updated successfully"));
});

// @desc    Update payment status
// @route   PATCH /api/bookings/:id/payment
// @access  Private/Admin
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, transactionId, paidAmount, paymentMethod } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Update payment information
  if (paymentStatus) booking.payment.status = paymentStatus;
  if (transactionId) booking.payment.transactionId = transactionId;
  if (paymentMethod) booking.payment.method = paymentMethod;

  if (paidAmount !== undefined) {
    booking.pricing.paidAmount = paidAmount;
    booking.pricing.remainingAmount = booking.pricing.totalPrice - paidAmount;
  }

  if (paymentStatus === "completed") {
    booking.payment.paidAt = new Date();
  }

  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Payment status updated successfully"));
});

// @desc    Get user's bookings
// @route   GET /api/bookings/user/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const { type } = req.query; // upcoming, past, current

  let bookings;

  if (type === "upcoming") {
    bookings = await Booking.findUpcoming(req.user._id);
  } else if (type === "past") {
    bookings = await Booking.findPast(req.user._id);
  } else if (type === "current") {
    bookings = await Booking.findCurrent(req.user._id);
  } else {
    bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
  }

  await Booking.populate(bookings, [
    { path: "hotel", select: "name location phone email images" },
    {
      path: "package",
      select: "title location price duration images coverImage",
    },
    { path: "review" },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, bookings, "User bookings retrieved successfully")
    );
});

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await Booking.getBookingStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || {},
        "Booking statistics retrieved successfully"
      )
    );
});

// @desc    Delete booking (admin only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Delete linked event if exists
  if (booking.linkedEvent) {
    try {
      await Event.findByIdAndDelete(booking.linkedEvent);
    } catch (error) {
      console.error("Error deleting linked event:", error);
    }
  }

  await Booking.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Booking deleted successfully"));
});

export {
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
};
