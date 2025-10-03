import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // Basic Information
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minLength: [3, "Coupon code must be at least 3 characters"],
      maxLength: [20, "Coupon code cannot exceed 20 characters"],
    },
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      maxLength: [100, "Coupon name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },

    // Discount Information
    discount: {
      type: Number,
      required: [true, "Discount amount is required"],
      min: [0, "Discount cannot be negative"],
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
      default: "percentage",
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "INR"],
    },

    // Eligibility and Usage
    eligibility: {
      type: String,
      enum: ["all", "selected", "specific"],
      required: [true, "Eligibility is required"],
      default: "all",
    },
    selectedPackages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    specificPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
    },

    // Usage Limits
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },
    minimumAmount: {
      type: Number,
      min: [0, "Minimum amount cannot be negative"],
    },
    maximumDiscount: {
      type: Number,
      min: [0, "Maximum discount cannot be negative"],
    },

    // Validity
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // User Restrictions
    userRestrictions: {
      newUsersOnly: {
        type: Boolean,
        default: false,
      },
      existingUsersOnly: {
        type: Boolean,
        default: false,
      },
      minimumOrders: {
        type: Number,
        min: [0, "Minimum orders cannot be negative"],
      },
      maximumUsesPerUser: {
        type: Number,
        min: [1, "Maximum uses per user must be at least 1"],
      },
    },

    // Status and Metadata
    status: {
      type: String,
      enum: ["active", "inactive", "expired", "suspended"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUsedAt: Date,
    lastUsedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Analytics
    analytics: {
      totalUses: {
        type: Number,
        default: 0,
      },
      totalDiscountGiven: {
        type: Number,
        default: 0,
      },
      averageOrderValue: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    // SEO and Marketing
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
      min: [0, "Priority cannot be negative"],
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

// Virtual for remaining uses
couponSchema.virtual("remainingUses").get(function () {
  if (!this.usageLimit) return null;
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Virtual for is expired
couponSchema.virtual("isExpired").get(function () {
  return new Date() > this.expiryDate;
});

// Virtual for is valid (not expired and has remaining uses)
couponSchema.virtual("isValid").get(function () {
  return (
    this.isActive &&
    !this.isExpired &&
    (this.usageLimit ? this.remainingUses > 0 : true)
  );
});

// Virtual for discount amount in currency
couponSchema.virtual("discountAmount").get(function () {
  if (this.discountType === "percentage") {
    return `${this.discount}%`;
  }
  return `${this.currency} ${this.discount}`;
});

// Indexes for better query performance
couponSchema.index({ code: 1 });
couponSchema.index({ status: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ createdBy: 1 });
couponSchema.index({ eligibility: 1 });
couponSchema.index({ selectedPackages: 1 });
couponSchema.index({ specificPackage: 1 });
couponSchema.index({ tags: 1 });
couponSchema.index({ createdAt: -1 });
couponSchema.index({ updatedAt: -1 });
couponSchema.index({ "analytics.totalUses": -1 });

// Text search index
couponSchema.index({
  name: "text",
  description: "text",
  code: "text",
});

// Pre-save middleware
couponSchema.pre("save", function (next) {
  // Update timestamp
  this.updatedAt = Date.now();

  // Auto-expire if past expiry date
  if (new Date() > this.expiryDate) {
    this.status = "expired";
  }

  // Validate usage limit
  if (this.usageLimit && this.usedCount > this.usageLimit) {
    return next(new Error("Used count cannot exceed usage limit"));
  }

  next();
});

// Method to check if coupon is applicable to a package
couponSchema.methods.isApplicableToPackage = function (packageId) {
  if (this.eligibility === "all") return true;
  if (this.eligibility === "specific")
    return this.specificPackage.toString() === packageId.toString();
  if (this.eligibility === "selected")
    return this.selectedPackages.some(
      (pkg) => pkg.toString() === packageId.toString()
    );
  return false;
};

// Method to check if coupon is applicable to a user
couponSchema.methods.isApplicableToUser = function (userId, userStats = {}) {
  // Check if user is new/existing based on restrictions
  if (this.userRestrictions.newUsersOnly && userStats.orderCount > 0) {
    return false;
  }
  if (this.userRestrictions.existingUsersOnly && userStats.orderCount === 0) {
    return false;
  }

  // Check minimum orders requirement
  if (
    this.userRestrictions.minimumOrders &&
    userStats.orderCount < this.userRestrictions.minimumOrders
  ) {
    return false;
  }

  return true;
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid) return 0;

  let discountAmount = 0;

  if (this.discountType === "percentage") {
    discountAmount = (orderAmount * this.discount) / 100;
  } else {
    discountAmount = this.discount;
  }

  // Apply maximum discount limit if set
  if (this.maximumDiscount && discountAmount > this.maximumDiscount) {
    discountAmount = this.maximumDiscount;
  }

  // Ensure discount doesn't exceed order amount
  return Math.min(discountAmount, orderAmount);
};

// Method to use coupon
couponSchema.methods.useCoupon = function (userId, orderAmount) {
  if (!this.isValid) {
    throw new Error("Coupon is not valid");
  }

  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    throw new Error("Coupon usage limit exceeded");
  }

  // Increment usage counters
  this.usedCount += 1;
  this.analytics.totalUses += 1;
  this.analytics.totalDiscountGiven += this.calculateDiscount(orderAmount);
  this.lastUsedAt = new Date();
  this.lastUsedBy = userId;

  return this.save();
};

// Method to validate coupon
couponSchema.methods.validateCoupon = function (
  packageId,
  userId,
  orderAmount,
  userStats = {}
) {
  const errors = [];

  // Check basic validity
  if (!this.isValid) {
    errors.push("Coupon is not valid");
  }

  // Check package eligibility
  if (!this.isApplicableToPackage(packageId)) {
    errors.push("Coupon is not applicable to this package");
  }

  // Check user eligibility
  if (!this.isApplicableToUser(userId, userStats)) {
    errors.push("Coupon is not applicable to this user");
  }

  // Check minimum amount
  if (this.minimumAmount && orderAmount < this.minimumAmount) {
    errors.push(`Minimum order amount of ${this.minimumAmount} required`);
  }

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    errors.push("Coupon usage limit exceeded");
  }

  return {
    isValid: errors.length === 0,
    errors,
    discountAmount: this.calculateDiscount(orderAmount),
  };
};

// Static method to find active coupons
couponSchema.statics.findActive = function () {
  return this.find({
    status: "active",
    isActive: true,
    expiryDate: { $gt: new Date() },
  });
};

// Static method to find coupons by code
couponSchema.statics.findByCode = function (code) {
  return this.findOne({
    code: code.toUpperCase(),
    status: "active",
    isActive: true,
    expiryDate: { $gt: new Date() },
  });
};

// Static method to find coupons applicable to a package
couponSchema.statics.findApplicableToPackage = function (packageId) {
  return this.find({
    status: "active",
    isActive: true,
    expiryDate: { $gt: new Date() },
    $or: [
      { eligibility: "all" },
      { specificPackage: packageId },
      { selectedPackages: packageId },
    ],
  });
};

// Static method to get coupon statistics
couponSchema.statics.getCouponStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalCoupons: { $sum: 1 },
        activeCoupons: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        expiredCoupons: {
          $sum: { $cond: [{ $eq: ["$status", "expired"] }, 1, 0] },
        },
        totalUses: { $sum: "$analytics.totalUses" },
        totalDiscountGiven: { $sum: "$analytics.totalDiscountGiven" },
        averageUsage: { $avg: "$analytics.totalUses" },
      },
    },
  ]);
};

// Static method to find expiring coupons
couponSchema.statics.findExpiringSoon = function (days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return this.find({
    status: "active",
    isActive: true,
    expiryDate: { $lte: futureDate, $gt: new Date() },
  });
};

// Static method to search coupons
couponSchema.statics.searchCoupons = function (searchTerm, filters = {}) {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { code: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ],
  };

  // Apply additional filters
  if (filters.status) query.status = filters.status;
  if (filters.eligibility) query.eligibility = filters.eligibility;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.createdBy) query.createdBy = filters.createdBy;

  return this.find(query).sort({ createdAt: -1 });
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
