import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    // Image Information
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Image public ID is required"],
      },
      altText: {
        type: String,
        default: "",
      },
      width: Number,
      height: Number,
      format: String,
      fileSize: Number,
    },

    // Basic Information
    title: {
      type: String,
      required: [true, "Image title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Tags and Categories
    tags: [
      {
        type: String,
        trim: true,
        maxLength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    categories: [
      {
        type: String,
        trim: true,
        maxLength: [100, "Category cannot exceed 100 characters"],
      },
    ],

    // Status
    featured: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Upload Information
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // SEO Fields
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    metaTitle: {
      type: String,
      maxLength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxLength: [160, "Meta description cannot exceed 160 characters"],
    },

    // Usage Tracking
    viewCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    usedIn: [
      {
        type: {
          type: String,
          enum: ["blog", "package", "property", "hotel", "other"],
        },
        refId: mongoose.Schema.Types.ObjectId,
      },
    ],

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

// Indexes for better query performance
gallerySchema.index({ title: "text", description: "text" });
gallerySchema.index({ uploadedBy: 1 });
gallerySchema.index({ featured: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ categories: 1 });
gallerySchema.index({ slug: 1 });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ updatedAt: -1 });
gallerySchema.index({ viewCount: -1 });

// Pre-save middleware to generate slug and update timestamps
gallerySchema.pre("save", function (next) {
  // Generate slug from title
  if (this.isModified("title") && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");

    // Add a unique identifier to prevent slug collisions
    this.slug = `${baseSlug}-${this._id.toString().slice(-6)}`;
  }

  // Generate meta title if not provided
  if (!this.metaTitle && this.title) {
    this.metaTitle = this.title.substring(0, 60);
  }

  // Generate meta description if not provided
  if (!this.metaDescription && this.description) {
    this.metaDescription = this.description.substring(0, 160);
  }

  // Update timestamp
  this.updatedAt = Date.now();

  next();
});

// Method to increment view count
gallerySchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment download count
gallerySchema.methods.incrementDownloadCount = function () {
  this.downloadCount += 1;
  return this.save();
};

// Method to track usage
gallerySchema.methods.addUsage = function (type, refId) {
  // Check if usage already exists
  const exists = this.usedIn.some(
    (usage) => usage.type === type && usage.refId.equals(refId)
  );

  if (!exists) {
    this.usedIn.push({ type, refId });
    return this.save();
  }

  return Promise.resolve(this);
};

// Method to remove usage
gallerySchema.methods.removeUsage = function (type, refId) {
  this.usedIn = this.usedIn.filter(
    (usage) => !(usage.type === type && usage.refId.equals(refId))
  );
  return this.save();
};

// Static method to find featured images
gallerySchema.statics.findFeatured = function () {
  return this.find({
    featured: true,
    isActive: true,
    visibility: "public",
  }).sort({ createdAt: -1 });
};

// Static method to find images by tag
gallerySchema.statics.findByTag = function (tag) {
  return this.find({
    tags: { $in: [tag] },
    isActive: true,
    visibility: "public",
  }).sort({ createdAt: -1 });
};

// Static method to find images by category
gallerySchema.statics.findByCategory = function (category) {
  return this.find({
    categories: { $in: [category] },
    isActive: true,
    visibility: "public",
  }).sort({ createdAt: -1 });
};

// Static method to get recent images
gallerySchema.statics.getRecentImages = function (limit = 10) {
  return this.find({
    isActive: true,
    visibility: "public",
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get popular images
gallerySchema.statics.getPopularImages = function (limit = 10, days = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return this.find({
    isActive: true,
    visibility: "public",
    createdAt: { $gte: dateFrom },
  })
    .sort({ viewCount: -1, downloadCount: -1 })
    .limit(limit);
};

// Static method to get gallery statistics
gallerySchema.statics.getGalleryStats = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        featuredImages: {
          $sum: { $cond: ["$featured", 1, 0] },
        },
        totalViews: { $sum: "$viewCount" },
        totalDownloads: { $sum: "$downloadCount" },
        totalSize: { $sum: "$image.fileSize" },
      },
    },
  ]);
};

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
