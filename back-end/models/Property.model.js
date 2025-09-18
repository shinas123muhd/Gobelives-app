import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxLength: [250, "Short description cannot exceed 250 characters"],
    },

    // Location Information
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    meetingPoint: {
      address: String,
      instructions: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Pricing and Availability
    price: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
      priceIncludes: [
        {
          type: String,
        },
      ],
      priceExcludes: [
        {
          type: String,
        },
      ],
    },
    capacity: {
      maxGuests: {
        type: Number,
        required: [true, "Maximum guest capacity is required"],
        min: [1, "Capacity must be at least 1"],
      },
      minGuests: {
        type: Number,
        default: 1,
        min: [1, "Minimum guests must be at least 1"],
      },
    },

    // Tour/Activity Details
    duration: {
      value: {
        type: Number,
        required: [true, "Duration value is required"],
      },
      unit: {
        type: String,
        enum: ["hours", "days", "weeks"],
        default: "hours",
      },
    },
    activities: [
      {
        name: String,
        description: String,
        duration: Number, // in minutes
        included: {
          type: Boolean,
          default: true,
        },
      },
    ],
    languages: [
      {
        type: String,
        enum: ["English", "Hindi", "Spanish", "French", "German", "Japanese"],
      },
    ],

    // Scheduling
    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    startTimes: [String], // Array of available start times
    instantConfirmation: {
      type: Boolean,
      default: false,
    },

    // Media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    coverImage: {
      type: String,
      required: true,
    },

    // Policies
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict", "non_refundable"],
      default: "moderate",
    },
    cancellationDetails: {
      freeCancellationBefore: {
        type: Number, // hours before booking
        default: 24,
      },
      refundPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
      },
    },
    healthSafetyMeasures: [
      {
        type: String,
      },
    ],

    // Ratings and Reviews
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      breakdown: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
    },

    // Relationships
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["tour", "activity", "experience", "attraction", "accommodation"],
      default: "tour",
    },
    tags: [String],

    // Status and Metadata
    status: {
      type: String,
      enum: ["active", "inactive", "draft", "suspended"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews (linked to Review model)
propertySchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "property",
});

// Virtual for bookings (linked to Booking model)
propertySchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "property",
});

// Indexes for better query performance
propertySchema.index({ title: "text", description: "text" });
propertySchema.index({ "location.city": 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ "ratings.average": -1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ "location.coordinates": "2dsphere" }); // For geospatial queries

// Pre-save middleware to update timestamps
propertySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check availability for specific dates
propertySchema.methods.checkAvailability = async function (
  startDate,
  endDate,
  guests
) {
  const Booking = mongoose.model("Booking");

  // Check if guests exceed capacity
  if (guests > this.capacity.maxGuests) {
    return { available: false, reason: "Exceeds maximum guest capacity" };
  }

  // Check for conflicting bookings
  const conflictingBookings = await Booking.find({
    property: this._id,
    status: { $in: ["confirmed", "pending"] },
    $or: [
      {
        checkIn: { $lte: endDate },
        checkOut: { $gte: startDate },
      },
    ],
  });

  return {
    available: conflictingBookings.length === 0,
    conflictingBookings: conflictingBookings.length,
  };
};

// Static method to find featured properties
propertySchema.statics.findFeatured = function () {
  return this.find({
    featured: true,
    status: "active",
  })
    .sort({ popularity: -1 })
    .limit(10);
};

// Method to update ratings when a new review is added
propertySchema.methods.updateRatings = function (newRating) {
  this.ratings.count += 1;
  this.ratings.breakdown[newRating] += 1;

  // Calculate new average
  const total = Object.entries(this.ratings.breakdown).reduce(
    (sum, [rating, count]) => sum + parseInt(rating) * count,
    0
  );

  this.ratings.average = total / this.ratings.count;
  return this.save();
};

const Property = mongoose.model("Property", propertySchema);

export default Property;
