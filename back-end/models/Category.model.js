import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxLength: [50, "Category name cannot exceed 50 characters"],
      minLength: [2, "Category name must be at least 2 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
      minLength: [10, "Description must be at least 10 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Media
    image: {
      url: {
        type: String,
        required: [true, "Category image is required"],
      },
      altText: {
        type: String,
        default: "",
      },
      publicId: {
        type: String, // For Cloudinary public ID
      },
    },

    // Status and Visibility
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Statistics
    packageCount: {
      type: Number,
      default: 0,
      min: [0, "Package count cannot be negative"],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: [0, "View count cannot be negative"],
    },

    // SEO and Metadata
    metaTitle: {
      type: String,
      maxLength: [60, "Meta title cannot exceed 60 characters"],
    },
    metaDescription: {
      type: String,
      maxLength: [160, "Meta description cannot exceed 160 characters"],
    },
    keywords: [String],

    // Display Order
    sortOrder: {
      type: Number,
      default: 0,
    },

    // Relationships
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for packages (linked to Property model)
categorySchema.virtual("packages", {
  ref: "Property",
  localField: "_id",
  foreignField: "category",
});

// Virtual for total packages including subcategories
categorySchema.virtual("totalPackages").get(function () {
  return this.packageCount + (this.subCategories?.length || 0);
});

// Virtual for isParentCategory
categorySchema.virtual("isParentCategory").get(function () {
  return this.subCategories && this.subCategories.length > 0;
});

// Virtual for isSubCategory
categorySchema.virtual("isSubCategory").get(function () {
  return this.parentCategory !== null;
});

// Indexes for better query performance
categorySchema.index({ name: "text", description: "text" });
categorySchema.index({ slug: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ featured: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ createdBy: 1 });

// Pre-save middleware to generate slug and update timestamps
categorySchema.pre("save", function (next) {
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Update timestamp
  this.updatedAt = Date.now();

  next();
});

// Pre-save middleware to update package count
categorySchema.pre("save", async function (next) {
  if (this.isModified("status") || this.isNew) {
    // Update package count based on active properties in this category
    const Property = mongoose.model("Property");
    this.packageCount = await Property.countDocuments({
      category: this._id,
      status: "active",
    });
  }
  next();
});

// Instance method to check if category can be deleted
categorySchema.methods.canBeDeleted = async function () {
  const Property = mongoose.model("Property");

  // Check if category has any active properties
  const activeProperties = await Property.countDocuments({
    category: this._id,
    status: "active",
  });

  // Check if category has subcategories
  const hasSubCategories = this.subCategories && this.subCategories.length > 0;

  return {
    canDelete: activeProperties === 0 && !hasSubCategories,
    reason:
      activeProperties > 0
        ? `Cannot delete category with ${activeProperties} active properties`
        : hasSubCategories
        ? "Cannot delete category with subcategories"
        : null,
  };
};

// Instance method to toggle status
categorySchema.methods.toggleStatus = function () {
  this.isActive = !this.isActive;
  this.status = this.isActive ? "active" : "inactive";
  return this.save();
};

// Instance method to update package count
categorySchema.methods.updatePackageCount = async function () {
  const Property = mongoose.model("Property");
  this.packageCount = await Property.countDocuments({
    category: this._id,
    status: "active",
  });
  return this.save();
};

// Instance method to add subcategory
categorySchema.methods.addSubCategory = function (subCategoryId) {
  if (!this.subCategories.includes(subCategoryId)) {
    this.subCategories.push(subCategoryId);
  }
  return this.save();
};

// Instance method to remove subcategory
categorySchema.methods.removeSubCategory = function (subCategoryId) {
  this.subCategories = this.subCategories.filter(
    (id) => id.toString() !== subCategoryId.toString()
  );
  return this.save();
};

// Static method to find active categories
categorySchema.statics.findActive = function () {
  return this.find({
    isActive: true,
    status: "active",
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find featured categories
categorySchema.statics.findFeatured = function () {
  return this.find({
    featured: true,
    isActive: true,
    status: "active",
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find parent categories
categorySchema.statics.findParentCategories = function () {
  return this.find({
    parentCategory: null,
    isActive: true,
    status: "active",
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to find subcategories
categorySchema.statics.findSubCategories = function (parentId) {
  return this.find({
    parentCategory: parentId,
    isActive: true,
    status: "active",
  }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get category hierarchy
categorySchema.statics.getCategoryHierarchy = async function () {
  const categories = await this.find({
    isActive: true,
    status: "active",
  })
    .populate("subCategories", "name slug packageCount")
    .sort({ sortOrder: 1, name: 1 });

  return categories.filter((category) => !category.parentCategory);
};

// Static method to search categories
categorySchema.statics.searchCategories = function (searchTerm, options = {}) {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { keywords: { $in: [new RegExp(searchTerm, "i")] } },
    ],
  };

  // Add additional filters
  if (options.status) {
    query.status = options.status;
  }
  if (options.isActive !== undefined) {
    query.isActive = options.isActive;
  }
  if (options.featured !== undefined) {
    query.featured = options.featured;
  }

  return this.find(query).sort({ sortOrder: 1, name: 1 });
};

// Static method to get category statistics
categorySchema.statics.getCategoryStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        activeCategories: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        inactiveCategories: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
        featuredCategories: {
          $sum: { $cond: [{ $eq: ["$featured", true] }, 1, 0] },
        },
        totalPackages: { $sum: "$packageCount" },
        totalViews: { $sum: "$viewCount" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalCategories: 0,
      activeCategories: 0,
      inactiveCategories: 0,
      featuredCategories: 0,
      totalPackages: 0,
      totalViews: 0,
    }
  );
};

const Category = mongoose.model("Category", categorySchema);

export default Category;
