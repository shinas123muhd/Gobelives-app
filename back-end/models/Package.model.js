import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Package description is required"],
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
      link: {
        type: String,
        validate: {
          validator: function (v) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: "Location link must be a valid URL",
        },
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Meeting Point Information
    meetingPoint: {
      address: String,
      instructions: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Pricing Information
    price: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      sellingPrice: {
        type: Number,
        min: [0, "Selling price cannot be negative"],
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
      discount: {
        type: Number,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
        default: 0,
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

    // Capacity and Duration
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
      allowKids: {
        type: Boolean,
        default: true,
      },
    },

    // Duration Information
    duration: {
      value: {
        type: Number,
        required: [true, "Duration value is required"],
        min: [1, "Duration must be at least 1"],
      },
      unit: {
        type: String,
        enum: ["hours", "days", "weeks"],
        default: "days",
      },
    },

    // Feature Highlights
    featureHighlights: [
      {
        icon: {
          type: String,
          enum: ["star", "heart", "shield", "checkmark"],
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],

    // Activities
    activities: [String],

    // What's Inside the Package
    whatsInside: [String],

    // Languages
    languages: [
      {
        type: String,
        enum: ["English", "Hindi", "Spanish", "French", "German", "Japanese"],
      },
    ],

    // Tags
    tags: [String],

    // Category
    category: {
      type: String,
      enum: ["tour", "activity", "experience", "attraction", "accommodation"],
      default: "tour",
    },

    // Transportation
    transportation: {
      included: {
        type: Boolean,
        default: false,
      },
      details: String,
    },

    // Health and Safety
    healthSafetyMeasures: [String],

    // Cancellation Policy
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

    // Media
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: String,
        altText: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },

    // Availability
    availableDates: {
      startDate: Date,
      endDate: Date,
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
    },

    // Scheduling
    schedule: {
      publishDate: Date,
      instantConfirmation: {
        type: Boolean,
        default: false,
      },
    },

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
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

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
    visibility: {
      type: String,
      enum: ["public", "users_only", "private"],
      default: "public",
    },
    popularity: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },

    // SEO
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String],

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
packageSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "package",
});

// Virtual for bookings (linked to Booking model)
packageSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "package",
});

// Virtual for total duration in hours
packageSchema.virtual("totalDurationHours").get(function () {
  if (this.duration.unit === "hours") {
    return this.duration.value;
  } else if (this.duration.unit === "days") {
    return this.duration.value * 24;
  } else if (this.duration.unit === "weeks") {
    return this.duration.value * 24 * 7;
  }
  return 0;
});

// Virtual for final price after discount
packageSchema.virtual("finalPrice").get(function () {
  const sellingPrice = this.price.sellingPrice || this.price.basePrice;
  const discount = this.price.discount || 0;
  return sellingPrice * (1 - discount / 100);
});

// Indexes for better query performance
packageSchema.index({
  title: "text",
  description: "text",
  shortDescription: "text",
});
packageSchema.index({ "location.city": 1 });
packageSchema.index({ "location.country": 1 });
packageSchema.index({ "price.basePrice": 1 });
packageSchema.index({ "price.sellingPrice": 1 });
packageSchema.index({ "ratings.average": -1 });
packageSchema.index({ owner: 1 });
packageSchema.index({ status: 1 });
packageSchema.index({ featured: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ tags: 1 });
packageSchema.index({ slug: 1 });
packageSchema.index({ "location.coordinates": "2dsphere" }); // For geospatial queries
packageSchema.index({ createdAt: -1 });
packageSchema.index({ updatedAt: -1 });

// Pre-save middleware to generate slug and update timestamps
packageSchema.pre("save", function (next) {
  // Generate slug from title
  if (this.isModified("title") && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }

  // Update timestamp
  this.updatedAt = Date.now();

  // Set selling price if not provided
  if (!this.price.sellingPrice && this.price.basePrice) {
    this.price.sellingPrice = this.price.basePrice;
  }

  next();
});

// Method to check availability for specific dates
packageSchema.methods.checkAvailability = async function (
  startDate,
  endDate,
  guests
) {
  const Booking = mongoose.model("Booking");

  // Check if guests exceed capacity
  if (guests > this.capacity.maxGuests) {
    return { available: false, reason: "Exceeds maximum guest capacity" };
  }

  // Check if guests are below minimum
  if (guests < this.capacity.minGuests) {
    return { available: false, reason: "Below minimum guest requirement" };
  }

  // Check for conflicting bookings
  const conflictingBookings = await Booking.find({
    package: this._id,
    status: { $in: ["confirmed", "pending"] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  return {
    available: conflictingBookings.length === 0,
    conflictingBookings: conflictingBookings.length,
  };
};

// Method to update ratings when a new review is added
packageSchema.methods.updateRatings = function (newRating) {
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

// Method to increment view count
packageSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment booking count
packageSchema.methods.incrementBookingCount = function () {
  this.bookingCount += 1;
  return this.save();
};

// Static method to find featured packages
packageSchema.statics.findFeatured = function () {
  return this.find({
    featured: true,
    status: "active",
  })
    .sort({ popularity: -1 })
    .limit(10);
};

// Static method to find packages by category
packageSchema.statics.findByCategory = function (category) {
  return this.find({
    category: category,
    status: "active",
  }).sort({ popularity: -1 });
};

// Static method to find packages by location
packageSchema.statics.findByLocation = function (city, country) {
  const query = { status: "active" };
  if (city) query["location.city"] = new RegExp(city, "i");
  if (country) query["location.country"] = new RegExp(country, "i");

  return this.find(query).sort({ popularity: -1 });
};

// Static method to search packages
packageSchema.statics.searchPackages = function (searchTerm, filters = {}) {
  const query = {
    status: "active",
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { shortDescription: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
    ],
  };

  // Apply additional filters
  if (filters.category) query.category = filters.category;
  if (filters.minPrice)
    query["price.sellingPrice"] = { $gte: filters.minPrice };
  if (filters.maxPrice) {
    query["price.sellingPrice"] = {
      ...query["price.sellingPrice"],
      $lte: filters.maxPrice,
    };
  }
  if (filters.city) query["location.city"] = new RegExp(filters.city, "i");
  if (filters.country)
    query["location.country"] = new RegExp(filters.country, "i");

  return this.find(query).sort({ popularity: -1 });
};

// Static method to get package statistics
packageSchema.statics.getPackageStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalPackages: { $sum: 1 },
        activePackages: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        draftPackages: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
        },
        featuredPackages: {
          $sum: { $cond: ["$featured", 1, 0] },
        },
        averageRating: { $avg: "$ratings.average" },
        totalBookings: { $sum: "$bookingCount" },
        totalViews: { $sum: "$viewCount" },
      },
    },
  ]);
};

const Package = mongoose.model("Package", packageSchema);

export default Package;
