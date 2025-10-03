import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      maxLength: [100, "Hotel name cannot exceed 100 characters"],
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        "Please provide a valid website URL starting with http:// or https://",
      ],
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
    description: {
      type: String,
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxLength: [200, "Short description cannot exceed 200 characters"],
    },

    // Location Information
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxLength: [100, "Location cannot exceed 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxLength: [200, "Address cannot exceed 200 characters"],
    },
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, "Latitude must be between -90 and 90"],
        max: [90, "Latitude must be between -90 and 90"],
      },
      longitude: {
        type: Number,
        min: [-180, "Longitude must be between -180 and 180"],
        max: [180, "Longitude must be between -180 and 180"],
      },
      googleMapsLink: {
        type: String,
        trim: true,
        match: [
          /^https?:\/\/.+/,
          "Please provide a valid Google Maps URL starting with http:// or https://",
        ],
      },
    },

    // Contact Information
    phone: {
      code: {
        type: String,
        required: [true, "Phone code is required"],
        trim: true,
        match: [/^\+\d{1,4}$/, "Please provide a valid phone code"],
      },
      number: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\d{10,15}$/, "Please provide a valid phone number"],
      },
    },

    // Media
    images: [
      {
        url: {
          type: String,
          required: false,
        },
        publicId: {
          type: String,
          required: false,
        },
        alt: {
          type: String,
          default: "Hotel image",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Hotel Features and Amenities
    amenities: [
      {
        name: {
          type: String,
          required: true,
        },
        icon: String,
        category: {
          type: String,
          enum: [
            "general",
            "room",
            "dining",
            "recreation",
            "business",
            "accessibility",
            "safety",
            "transportation",
          ],
          default: "general",
        },
      },
    ],

    // Hotel Features
    features: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
        icon: String,
      },
    ],

    // What's Included/Excluded
    includedItems: [
      {
        type: String,
        trim: true,
      },
    ],
    excludedItems: [
      {
        type: String,
        trim: true,
      },
    ],

    // Hotel Classification
    starRating: {
      type: Number,
      min: [1, "Star rating must be at least 1"],
      max: [5, "Star rating cannot exceed 5"],
    },
    category: {
      type: String,
      enum: [
        "luxury",
        "business",
        "boutique",
        "resort",
        "budget",
        "family",
        "romantic",
        "adventure",
      ],
    },

    // Room Information
    rooms: {
      totalRooms: {
        type: Number,
        min: [1, "Total rooms must be at least 1"],
      },
      availableRooms: {
        type: Number,
        min: [0, "Available rooms cannot be negative"],
        default: 0,
      },
      roomTypes: [
        {
          name: {
            type: String,
            required: true,
          },
          description: String,
          capacity: {
            adults: {
              type: Number,
              min: 1,
            },
            children: {
              type: Number,
              min: 0,
            },
          },
          price: {
            base: {
              type: Number,
              min: 0,
            },
            currency: {
              type: String,
              default: "USD",
              enum: ["USD", "EUR", "GBP", "INR"],
            },
          },
          amenities: [String],
          images: [String],
        },
      ],
    },

    // Booking Information
    booking: {
      isBookable: {
        type: Boolean,
        default: true,
      },
      advanceBookingDays: {
        type: Number,
        min: 0,
        default: 0,
      },
      minimumStay: {
        type: Number,
        min: 1,
        default: 1,
      },
      maximumStay: {
        type: Number,
        min: 1,
        default: 30,
      },
      checkInTime: {
        type: String,
        default: "15:00",
      },
      checkOutTime: {
        type: String,
        default: "11:00",
      },
      flexibleCheckIn: {
        type: Boolean,
        default: false,
      },
      flexibleCheckOut: {
        type: Boolean,
        default: false,
      },
    },

    // Pricing and Rates
    rates: {
      baseRate: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
      seasonalRates: [
        {
          name: String,
          startDate: Date,
          endDate: Date,
          multiplier: {
            type: Number,
            min: 0.1,
            max: 5,
            default: 1,
          },
        },
      ],
      weekendRates: {
        enabled: {
          type: Boolean,
          default: false,
        },
        multiplier: {
          type: Number,
          min: 0.1,
          max: 5,
          default: 1.2,
        },
      },
      taxes: {
        included: {
          type: Boolean,
          default: false,
        },
        rate: {
          type: Number,
          min: 0,
          max: 100,
          default: 0,
        },
      },
      fees: [
        {
          name: String,
          type: {
            type: String,
            enum: ["fixed", "percentage"],
          },
          value: Number,
          mandatory: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },

    // Availability and Blackout Dates
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      blackoutDates: [Date],
      maintenanceDates: [
        {
          startDate: Date,
          endDate: Date,
          reason: String,
        },
      ],
      seasonalAvailability: [
        {
          name: String,
          startDate: Date,
          endDate: Date,
          isAvailable: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },

    // Guest Information
    guestInfo: {
      minimumAge: {
        type: Number,
        min: 0,
        default: 0,
      },
      maximumGuests: {
        type: Number,
        min: 1,
        default: 4,
      },
      childrenPolicy: {
        allowed: {
          type: Boolean,
          default: true,
        },
        ageLimit: {
          type: Number,
          min: 0,
          max: 18,
          default: 12,
        },
        charges: {
          type: String,
          enum: ["free", "discounted", "full_price"],
          default: "free",
        },
      },
      petPolicy: {
        allowed: {
          type: Boolean,
          default: false,
        },
        restrictions: String,
        additionalFee: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    },

    // Pricing and Policies
    pricing: {
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
      taxRate: {
        type: Number,
        min: [0, "Tax rate cannot be negative"],
        max: [100, "Tax rate cannot exceed 100%"],
        default: 0,
      },
      serviceCharge: {
        type: Number,
        min: [0, "Service charge cannot be negative"],
        default: 0,
      },
    },

    // Policies
    policies: {
      checkIn: {
        time: {
          type: String,
          default: "15:00",
        },
        policy: String,
      },
      checkOut: {
        time: {
          type: String,
          default: "11:00",
        },
        policy: String,
      },
      cancellation: {
        freeCancellation: {
          type: Boolean,
          default: false,
        },
        freeCancellationHours: {
          type: Number,
          min: 0,
        },
        policy: String,
      },
      petPolicy: {
        allowed: {
          type: Boolean,
          default: false,
        },
        fee: {
          type: Number,
          min: 0,
        },
        restrictions: String,
      },
    },

    // Status and Management
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Tags and SEO
    tags: [
      {
        type: String,
        trim: true,
        maxLength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        maxLength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        maxLength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [String],
      canonicalUrl: {
        type: String,
        trim: true,
        match: [
          /^https?:\/\/.+/,
          "Please provide a valid canonical URL starting with http:// or https://",
        ],
      },
      ogTitle: {
        type: String,
        maxLength: [60, "Open Graph title cannot exceed 60 characters"],
      },
      ogDescription: {
        type: String,
        maxLength: [160, "Open Graph description cannot exceed 160 characters"],
      },
      twitterTitle: {
        type: String,
        maxLength: [60, "Twitter card title cannot exceed 60 characters"],
      },
    },

    // Analytics and Performance
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      bookings: {
        type: Number,
        default: 0,
      },
      revenue: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      lastBookingDate: Date,
      lastReviewDate: Date,
    },

    // Reviews and Ratings
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: {
          type: String,
          maxLength: [500, "Review comment cannot exceed 500 characters"],
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        helpful: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Management
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,

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

// Virtual for full phone number
hotelSchema.virtual("fullPhoneNumber").get(function () {
  return `${this.phone.code}${this.phone.number}`;
});

// Virtual for primary image
hotelSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0];
});

// Virtual for average rating
hotelSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;
  const totalRating = this.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  return Math.round((totalRating / this.reviews.length) * 10) / 10;
});

// Virtual for occupancy rate
hotelSchema.virtual("occupancyRate").get(function () {
  if (!this.rooms.totalRooms || this.rooms.totalRooms === 0) return 0;
  const occupiedRooms = this.rooms.totalRooms - this.rooms.availableRooms;
  return Math.round((occupiedRooms / this.rooms.totalRooms) * 100);
});

// Virtual for is fully booked
hotelSchema.virtual("isFullyBooked").get(function () {
  return this.rooms.availableRooms === 0;
});

// Virtual for has availability
hotelSchema.virtual("hasAvailability").get(function () {
  return this.rooms.availableRooms > 0;
});

// Indexes for better query performance
hotelSchema.index({ name: 1 });
hotelSchema.index({ location: 1 });
hotelSchema.index({ status: 1 });
hotelSchema.index({ isActive: 1 });
hotelSchema.index({ isVerified: 1 });
hotelSchema.index({ isFeatured: 1 });
hotelSchema.index({ starRating: -1 });
hotelSchema.index({ "analytics.averageRating": -1 });
hotelSchema.index({ "analytics.views": -1 });
hotelSchema.index({ "analytics.bookings": -1 });
hotelSchema.index({ createdBy: 1 });
hotelSchema.index({ tags: 1 });
hotelSchema.index({ createdAt: -1 });
hotelSchema.index({ updatedAt: -1 });

// Text search index
hotelSchema.index({
  name: "text",
  description: "text",
  location: "text",
  address: "text",
  tags: "text",
});

// Geospatial index for location-based queries
hotelSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

// Pre-save middleware
hotelSchema.pre("save", function (next) {
  // Update timestamp
  this.updatedAt = Date.now();

  // Ensure only one primary image
  if (this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    } else if (primaryImages.length === 0) {
      // Set first image as primary if none is set
      this.images[0].isPrimary = true;
    }
  }

  // Update analytics
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.analytics.averageRating =
      Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.analytics.totalReviews = this.reviews.length;
  }

  next();
});

// Method to add review
hotelSchema.methods.addReview = function (userId, rating, comment = "") {
  // Check if user already reviewed
  const existingReview = this.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error("User has already reviewed this hotel");
  }

  this.reviews.push({
    user: userId,
    rating,
    comment,
  });

  return this.save();
};

// Method to update review
hotelSchema.methods.updateReview = function (userId, rating, comment = "") {
  const review = this.reviews.find(
    (review) => review.user.toString() === userId.toString()
  );

  if (!review) {
    throw new Error("Review not found");
  }

  review.rating = rating;
  review.comment = comment;
  review.createdAt = new Date();

  return this.save();
};

// Method to remove review
hotelSchema.methods.removeReview = function (userId) {
  this.reviews = this.reviews.filter(
    (review) => review.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to increment views
hotelSchema.methods.incrementViews = function () {
  this.analytics.views += 1;
  return this.save();
};

// Method to add booking
hotelSchema.methods.addBooking = function (amount) {
  this.analytics.bookings += 1;
  this.analytics.revenue += amount;
  this.analytics.lastBookingDate = new Date();
  return this.save();
};

// Method to update room availability
hotelSchema.methods.updateRoomAvailability = function (roomsBooked) {
  if (this.rooms.availableRooms < roomsBooked) {
    throw new Error("Not enough rooms available");
  }
  this.rooms.availableRooms -= roomsBooked;
  return this.save();
};

// Method to check if hotel is available for dates
hotelSchema.methods.isAvailableForDates = function (checkIn, checkOut) {
  // This would typically check against booking records
  // For now, just check if rooms are available
  return this.rooms.availableRooms > 0;
};

// Static method to find hotels by location
hotelSchema.statics.findByLocation = function (location) {
  return this.find({
    location: { $regex: location, $options: "i" },
    status: "active",
    isActive: true,
  });
};

// Static method to find hotels by rating
hotelSchema.statics.findByRating = function (minRating) {
  return this.find({
    "analytics.averageRating": { $gte: minRating },
    status: "active",
    isActive: true,
  });
};

// Static method to find featured hotels
hotelSchema.statics.findFeatured = function () {
  return this.find({
    isFeatured: true,
    status: "active",
    isActive: true,
  }).sort({ "analytics.averageRating": -1 });
};

// Static method to search hotels
hotelSchema.statics.searchHotels = function (searchTerm, filters = {}) {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
    ],
  };

  // Apply additional filters
  if (filters.status) query.status = filters.status;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
  if (filters.starRating) query.starRating = { $gte: filters.starRating };
  if (filters.minRating)
    query["analytics.averageRating"] = { $gte: filters.minRating };
  if (filters.amenities) query["amenities.name"] = { $in: filters.amenities };
  if (filters.category) query.category = filters.category;

  return this.find(query).sort({ "analytics.averageRating": -1 });
};

// Static method to find nearby hotels
hotelSchema.statics.findNearby = function (latitude, longitude, radiusKm = 10) {
  return this.find({
    "coordinates.latitude": {
      $gte: latitude - radiusKm / 111, // Rough conversion: 1 degree ≈ 111 km
      $lte: latitude + radiusKm / 111,
    },
    "coordinates.longitude": {
      $gte: longitude - radiusKm / (111 * Math.cos((latitude * Math.PI) / 180)),
      $lte: longitude + radiusKm / (111 * Math.cos((latitude * Math.PI) / 180)),
    },
    status: "active",
    isActive: true,
  });
};

// Static method to get hotel statistics
hotelSchema.statics.getHotelStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalHotels: { $sum: 1 },
        activeHotels: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        verifiedHotels: {
          $sum: { $cond: ["$isVerified", 1, 0] },
        },
        featuredHotels: {
          $sum: { $cond: ["$isFeatured", 1, 0] },
        },
        totalViews: { $sum: "$analytics.views" },
        totalBookings: { $sum: "$analytics.bookings" },
        totalRevenue: { $sum: "$analytics.revenue" },
        averageRating: { $avg: "$analytics.averageRating" },
      },
    },
  ]);
};

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
