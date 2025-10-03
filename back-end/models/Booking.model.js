// # If you have bookings
// server/models/Booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: false,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    // You can manage the booking flow with these statuses
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  // You can store payment information ID from your payment processor (e.g., Stripe) here
  paymentIntentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for quickly finding all bookings for a property and date range
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 }, { sparse: true });
// Index for quickly finding all bookings for a package and date range
bookingSchema.index({ package: 1, checkIn: 1, checkOut: 1 }, { sparse: true });

// Validation to ensure either property or package is provided
bookingSchema.pre("validate", function (next) {
  if (!this.property && !this.package) {
    return next(new Error("Either property or package must be specified"));
  }
  if (this.property && this.package) {
    return next(new Error("Cannot specify both property and package"));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
