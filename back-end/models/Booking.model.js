import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Reference to booked item
    bookingType: {
      type: String,
      enum: ["hotel", "package", "property"],
      required: [true, "Booking type is required"],
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: false,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: false,
    },

    // User Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    // Booking Details
    bookingReference: {
      type: String,
      unique: true,
    },
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },
    duration: {
      type: Number, // in days or hours depending on type
    },

    // Guest Information
    guests: {
      adults: {
        type: Number,
        required: [true, "Number of adults is required"],
        min: [1, "At least 1 adult is required"],
      },
      children: {
        type: Number,
        default: 0,
        min: [0, "Children count cannot be negative"],
      },
      infants: {
        type: Number,
        default: 0,
        min: [0, "Infants count cannot be negative"],
      },
      total: {
        type: Number,
      },
    },

    // Guest Details (for contact and identification)
    guestDetails: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please provide a valid email",
        ],
      },
      phone: {
        code: {
          type: String,
          required: [true, "Phone code is required"],
        },
        number: {
          type: String,
          required: [true, "Phone number is required"],
        },
      },
      country: String,
      specialRequests: String,
    },

    // Hotel-specific fields
    roomDetails: {
      roomType: String,
      roomNumber: String,
      numberOfRooms: {
        type: Number,
        default: 1,
        min: 1,
      },
      bedType: String,
      view: String,
    },

    // Package-specific fields
    packageDetails: {
      startTime: String,
      pickupLocation: String,
      dropoffLocation: String,
      selectedActivities: [String],
      language: String,
    },

    // Pricing Information
    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      taxes: {
        type: Number,
        default: 0,
        min: 0,
      },
      serviceFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
      paidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      remainingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Coupon/Discount
    appliedCoupon: {
      code: String,
      discountAmount: Number,
      discountPercentage: Number,
    },

    // Payment Information
    payment: {
      method: {
        type: String,
        enum: [
          "credit_card",
          "debit_card",
          "paypal",
          "bank_transfer",
          "cash",
          "wallet",
        ],
      },
      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "completed",
          "failed",
          "refunded",
          "partially_refunded",
        ],
        default: "pending",
      },
      transactionId: String,
      paymentIntentId: String,
      paidAt: Date,
      refundedAt: Date,
      refundAmount: Number,
      refundReason: String,
    },

    // Booking Status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "completed",
        "no_show",
      ],
      default: "pending",
    },

    // Status History
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "checked_in",
            "checked_out",
            "cancelled",
            "completed",
            "no_show",
          ],
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
      },
    ],

    // Cancellation Information
    cancellation: {
      isCancelled: {
        type: Boolean,
        default: false,
      },
      cancelledAt: Date,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      cancellationReason: String,
      cancellationPolicy: String,
      refundEligible: {
        type: Boolean,
        default: false,
      },
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "processed"],
      },
    },

    // Confirmation
    confirmation: {
      isConfirmed: {
        type: Boolean,
        default: false,
      },
      confirmedAt: Date,
      confirmationCode: String,
      confirmationSent: {
        type: Boolean,
        default: false,
      },
    },

    // Review and Rating
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    hasReview: {
      type: Boolean,
      default: false,
    },

    // Event Link (for calendar view)
    linkedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    // Additional Information
    notes: String,
    internalNotes: String, // For admin use only

    // Metadata
    source: {
      type: String,
      enum: ["website", "mobile_app", "admin_panel", "api"],
      default: "website",
    },
    ipAddress: String,
    userAgent: String,

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ hotel: 1, checkIn: 1, checkOut: 1 }, { sparse: true });
bookingSchema.index({ package: 1, checkIn: 1 }, { sparse: true });
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 }, { sparse: true });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ "payment.status": 1 });
bookingSchema.index({ checkIn: 1 });
bookingSchema.index({ checkOut: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for number of nights
bookingSchema.virtual("numberOfNights").get(function () {
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Virtual for is past booking
bookingSchema.virtual("isPast").get(function () {
  return this.checkOut < new Date();
});

// Virtual for is upcoming
bookingSchema.virtual("isUpcoming").get(function () {
  return this.checkIn > new Date();
});

// Virtual for is current
bookingSchema.virtual("isCurrent").get(function () {
  const now = new Date();
  return this.checkIn <= now && this.checkOut >= now;
});

// Virtual for booking reference type
bookingSchema.virtual("bookingRef").get(function () {
  if (this.hotel) return { type: "Hotel", id: this.hotel };
  if (this.package) return { type: "Package", id: this.package };
  if (this.property) return { type: "Property", id: this.property };
  return null;
});

// Pre-save middleware
bookingSchema.pre("save", function (next) {
  // Update timestamp
  this.updatedAt = Date.now();

  // Calculate duration
  if (this.checkIn && this.checkOut) {
    const diffTime = Math.abs(this.checkOut - this.checkIn);
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calculate total guests
  if (this.guests) {
    this.guests.total =
      (this.guests.adults || 0) +
      (this.guests.children || 0) +
      (this.guests.infants || 0);
  }

  // Calculate remaining amount
  if (this.pricing) {
    this.pricing.remainingAmount =
      this.pricing.totalPrice - (this.pricing.paidAmount || 0);
  }

  // Generate booking reference if not exists
  if (!this.bookingReference) {
    const prefix =
      this.bookingType === "hotel"
        ? "HTL"
        : this.bookingType === "package"
        ? "PKG"
        : "PROP";
    this.bookingReference = `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;
  }

  next();
});

// Validation to ensure booking type matches the reference
bookingSchema.pre("validate", function (next) {
  const refs = [this.hotel, this.package, this.property].filter(Boolean);

  if (refs.length === 0) {
    return next(
      new Error(
        "At least one booking reference (hotel, package, or property) must be specified"
      )
    );
  }

  if (refs.length > 1) {
    return next(new Error("Cannot specify multiple booking references"));
  }

  // Validate bookingType matches the reference
  if (this.hotel && this.bookingType !== "hotel") {
    return next(
      new Error("Booking type must be 'hotel' when hotel is specified")
    );
  }
  if (this.package && this.bookingType !== "package") {
    return next(
      new Error("Booking type must be 'package' when package is specified")
    );
  }
  if (this.property && this.bookingType !== "property") {
    return next(
      new Error("Booking type must be 'property' when property is specified")
    );
  }

  // Validate check-out is after check-in
  if (this.checkOut <= this.checkIn) {
    return next(new Error("Check-out date must be after check-in date"));
  }

  next();
});

// Instance method to cancel booking
bookingSchema.methods.cancelBooking = function (cancelledBy, reason) {
  this.status = "cancelled";
  this.cancellation.isCancelled = true;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.cancelledBy = cancelledBy;
  this.cancellation.cancellationReason = reason;

  // Add to status history
  this.statusHistory.push({
    status: "cancelled",
    changedBy: cancelledBy,
    reason: reason,
  });

  return this.save();
};

// Instance method to confirm booking
bookingSchema.methods.confirmBooking = function (confirmationCode) {
  this.status = "confirmed";
  this.confirmation.isConfirmed = true;
  this.confirmation.confirmedAt = new Date();
  this.confirmation.confirmationCode =
    confirmationCode || this.bookingReference;

  // Add to status history
  this.statusHistory.push({
    status: "confirmed",
  });

  return this.save();
};

// Instance method to update status
bookingSchema.methods.updateStatus = function (newStatus, changedBy, reason) {
  this.status = newStatus;

  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    changedBy,
    reason,
  });

  return this.save();
};

// Static method to find upcoming bookings
bookingSchema.statics.findUpcoming = function (userId) {
  return this.find({
    user: userId,
    checkIn: { $gt: new Date() },
    status: { $in: ["confirmed", "pending"] },
  }).sort({ checkIn: 1 });
};

// Static method to find past bookings
bookingSchema.statics.findPast = function (userId) {
  return this.find({
    user: userId,
    checkOut: { $lt: new Date() },
  }).sort({ checkOut: -1 });
};

// Static method to find current bookings
bookingSchema.statics.findCurrent = function (userId) {
  const now = new Date();
  return this.find({
    user: userId,
    checkIn: { $lte: now },
    checkOut: { $gte: now },
    status: { $in: ["confirmed", "checked_in"] },
  });
};

// Static method to get booking statistics
bookingSchema.statics.getBookingStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
        },
        completedBookings: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        totalRevenue: { $sum: "$pricing.totalPrice" },
        averageBookingValue: { $avg: "$pricing.totalPrice" },
      },
    },
  ]);
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
