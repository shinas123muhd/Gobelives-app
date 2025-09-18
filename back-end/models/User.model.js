import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxLength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxLength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please provide a valid phone number"],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,

    // Booking History
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],

    // Rewards System
    rewards: {
      points: {
        type: Number,
        default: 0,
        min: 0,
      },
      tier: {
        type: String,
        enum: ["bronze", "silver", "gold", "platinum"],
        default: "bronze",
      },
      pointsHistory: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          points: {
            type: Number,
            required: true,
          },
          reason: {
            type: String,
            required: true,
            enum: ["booking", "referral", "review", "promotion", "redemption"],
          },
          bookingRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
          },
        },
      ],
      redemptionHistory: [
        {
          date: {
            type: Date,
            default: Date.now,
          },
          pointsUsed: {
            type: Number,
            required: true,
          },
          reward: {
            type: String,
            required: true,
          },
          value: {
            type: Number,
            required: true,
          },
          status: {
            type: String,
            enum: ["pending", "processed", "cancelled"],
            default: "pending",
          },
        },
      ],
    },

    // Preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "es", "fr", "de", "it", "hi"],
      },
    },

    // Additional fields for enhanced functionality
    membershipSince: {
      type: Date,
      default: Date.now,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    favoriteProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
    recentlyViewed: [
      {
        property: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    referralCode: {
      type: String,
      unique: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addresses: [
      {
        name: String,
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["credit_card", "debit_card", "paypal", "wallet"],
        },
        lastFour: String,
        expiryDate: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
        // For security, you might want to store payment tokens
        // instead of actual details and use a payment processor
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for next reward tier
userSchema.virtual("nextTier").get(function () {
  const tierRequirements = {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 3000,
  };

  const currentTierIndex = Object.keys(tierRequirements).indexOf(
    this.rewards.tier
  );
  if (currentTierIndex < Object.keys(tierRequirements).length - 1) {
    return Object.keys(tierRequirements)[currentTierIndex + 1];
  }
  return null;
});

// Virtual for points needed for next tier
userSchema.virtual("pointsToNextTier").get(function () {
  const tierRequirements = {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 3000,
  };

  const nextTier = this.nextTier;
  if (nextTier) {
    return tierRequirements[nextTier] - this.rewards.points;
  }
  return 0;
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "rewards.tier": 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ "rewards.points": -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code before saving if new user
userSchema.pre("save", function (next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = this.generateReferralCode();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user is admin
userSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "super_admin";
};

// Generate referral code
userSchema.methods.generateReferralCode = function () {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Add points to user account
userSchema.methods.addPoints = function (points, reason, bookingRef = null) {
  this.rewards.points += points;

  // Add to points history
  this.rewards.pointsHistory.push({
    points,
    reason,
    bookingRef,
  });

  // Update tier if needed
  this.updateTier();

  return this.save();
};

// Redeem points
userSchema.methods.redeemPoints = function (points, reward, value) {
  if (this.rewards.points < points) {
    throw new Error("Insufficient points for redemption");
  }

  this.rewards.points -= points;

  // Add to redemption history
  this.rewards.redemptionHistory.push({
    pointsUsed: points,
    reward,
    value,
  });

  return this.save();
};

// Update user tier based on points
userSchema.methods.updateTier = function () {
  const tierRequirements = {
    bronze: 0,
    silver: 500,
    gold: 1500,
    platinum: 3000,
  };

  let newTier = "bronze";

  if (this.rewards.points >= tierRequirements.platinum) {
    newTier = "platinum";
  } else if (this.rewards.points >= tierRequirements.gold) {
    newTier = "gold";
  } else if (this.rewards.points >= tierRequirements.silver) {
    newTier = "silver";
  }

  if (newTier !== this.rewards.tier) {
    this.rewards.tier = newTier;
  }
};

// Add property to favorites
userSchema.methods.addToFavorites = function (propertyId) {
  if (!this.favoriteProperties.includes(propertyId)) {
    this.favoriteProperties.push(propertyId);
  }
  return this.save();
};

// Remove property from favorites
userSchema.methods.removeFromFavorites = function (propertyId) {
  this.favoriteProperties = this.favoriteProperties.filter(
    (id) => id.toString() !== propertyId.toString()
  );
  return this.save();
};

// Add to recently viewed
userSchema.methods.addToRecentlyViewed = function (propertyId) {
  // Remove if already exists
  this.recentlyViewed = this.recentlyViewed.filter(
    (item) => item.property.toString() !== propertyId.toString()
  );

  // Add to beginning of array
  this.recentlyViewed.unshift({
    property: propertyId,
    viewedAt: new Date(),
  });

  // Keep only the last 10 viewed items
  if (this.recentlyViewed.length > 10) {
    this.recentlyViewed = this.recentlyViewed.slice(0, 10);
  }

  return this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find user by referral code
userSchema.statics.findByReferralCode = function (referralCode) {
  return this.findOne({ referralCode });
};

const User = mongoose.model("User", userSchema);

export default User;
