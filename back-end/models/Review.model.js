// server/models/Review.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Review Content
    title: {
      type: String,
      maxLength: [100, "Review title cannot exceed 100 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Review content is required"],
      maxLength: [1000, "Review content cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    // Author Information
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },

    // Reference to Booking (Required for verification)
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
    },

    // Property or Package Reference
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

    // Review Status
    isVerified: {
      type: Boolean,
      default: true, // Automatically verified if booking is completed
    },
    status: {
      type: String,
      enum: ["active", "pending", "flagged", "removed"],
      default: "active",
    },

    // Helpful Tracking
    helpful: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    // Review Images (Optional)
    images: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
        altText: {
          type: String,
        },
      },
    ],

    // Admin Response
    response: {
      content: {
        type: String,
        maxLength: [500, "Response cannot exceed 500 characters"],
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: {
        type: Date,
      },
    },

    // Additional Metadata
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
reviewSchema.index({ author: 1, property: 1 }, { unique: true, sparse: true });
reviewSchema.index({ author: 1, package: 1 }, { unique: true, sparse: true });
reviewSchema.index({ property: 1, status: 1 });
reviewSchema.index({ package: 1, status: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ booking: 1 }, { unique: true }); // One review per booking

// Virtual for time since review
reviewSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

// Validation to ensure either property or package is provided
reviewSchema.pre("validate", function (next) {
  if (!this.property && !this.package) {
    return next(new Error("Either property or package must be specified"));
  }
  if (this.property && this.package) {
    return next(new Error("Cannot specify both property and package"));
  }
  next();
});

// Instance method to mark review as helpful by a user
reviewSchema.methods.markAsHelpful = function (userId) {
  // Check if user already marked as helpful
  if (this.helpful.users.includes(userId)) {
    return this;
  }

  this.helpful.users.push(userId);
  this.helpful.count = this.helpful.users.length;
  return this.save();
};

// Instance method to remove helpful mark by a user
reviewSchema.methods.unmarkAsHelpful = function (userId) {
  this.helpful.users = this.helpful.users.filter(
    (id) => id.toString() !== userId.toString()
  );
  this.helpful.count = this.helpful.users.length;
  return this.save();
};

// Instance method to add admin response
reviewSchema.methods.addResponse = function (content, adminId) {
  this.response = {
    content,
    respondedBy: adminId,
    respondedAt: new Date(),
  };
  return this.save();
};

// Static method to get reviews by property
reviewSchema.statics.getByProperty = function (propertyId, options = {}) {
  const query = {
    property: propertyId,
    status: options.status || "active",
  };

  return this.find(query)
    .populate("author", "firstName lastName avatar")
    .sort({ createdAt: options.sort || -1 })
    .limit(options.limit || 10);
};

// Static method to get reviews by package
reviewSchema.statics.getByPackage = function (packageId, options = {}) {
  const query = {
    package: packageId,
    status: options.status || "active",
  };

  return this.find(query)
    .populate("author", "firstName lastName avatar")
    .sort({ createdAt: options.sort || -1 })
    .limit(options.limit || 10);
};

// Static method to check if user can review a booking
reviewSchema.statics.canUserReview = async function (userId, bookingId) {
  const Booking = mongoose.model("Booking");

  // Get the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return { canReview: false, reason: "Booking not found" };
  }

  // Check if user owns the booking
  if (booking.user.toString() !== userId.toString()) {
    return { canReview: false, reason: "Not your booking" };
  }

  // Check if booking is completed or checked out
  if (!["completed", "checked_out"].includes(booking.status)) {
    return {
      canReview: false,
      reason: "Booking must be completed to leave a review",
    };
  }

  // Check if booking has already been reviewed
  if (booking.hasReview) {
    return {
      canReview: false,
      reason: "You have already reviewed this booking",
    };
  }

  // Check if review already exists for this booking
  const existingReview = await this.findOne({ booking: bookingId });
  if (existingReview) {
    return {
      canReview: false,
      reason: "Review already exists for this booking",
    };
  }

  return { canReview: true, booking };
};

// Static method to get average rating for property
reviewSchema.statics.getAverageRatingForProperty = async function (propertyId) {
  const result = await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        status: "active",
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, breakdown: {} };
  }

  // Calculate breakdown
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result[0].ratingBreakdown.forEach((rating) => {
    breakdown[rating] = (breakdown[rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
    breakdown,
  };
};

// Static method to get average rating for package
reviewSchema.statics.getAverageRatingForPackage = async function (packageId) {
  const result = await this.aggregate([
    {
      $match: { package: mongoose.Types.ObjectId(packageId), status: "active" },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, breakdown: {} };
  }

  // Calculate breakdown
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result[0].ratingBreakdown.forEach((rating) => {
    breakdown[rating] = (breakdown[rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
    breakdown,
  };
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
