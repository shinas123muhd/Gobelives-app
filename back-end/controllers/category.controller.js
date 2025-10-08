import Category from "../models/Category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, status, featured, sortOrder, keywords } = req.body;

  // Validation
  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  // Check if category already exists with the same name
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw new ApiError(400, "A category with this name already exists");
  }

  // Handle image upload
  let imageData = {};
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file, "categories");
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload image");
    }

    imageData = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      altText: name,
    };
  } else {
    throw new ApiError(400, "Category image is required");
  }

  // Create category
  const category = await Category.create({
    name,
    description,
    image: imageData,
    status: status || "active",
    isActive: status === "active",
    featured: featured === "true" || false,
    sortOrder: sortOrder ? parseInt(sortOrder) : 0,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : [],
    createdBy: req.user._id,
  });

  // Populate creator details
  await category.populate("createdBy", "firstName lastName email");

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// @desc    Get all categories with filtering, sorting, and pagination
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    featured,
    isActive,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { keywords: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get categories with filtering, sorting, and pagination
  const categories = await Category.find(filter)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Category.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Categories retrieved successfully"
    )
  );
});

// @desc    Get single category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .populate("parentCategory", "name slug")
    .populate("subCategories", "name slug packageCount");

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category retrieved successfully"));
});

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const {
    name,
    description,
    status,
    featured,
    sortOrder,
    keywords,
    metaTitle,
    metaDescription,
  } = req.body;

  // Check if name is being changed and if it already exists
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new ApiError(400, "A category with this name already exists");
    }
  }

  // Handle image upload if new image is provided
  if (req.file) {
    // Delete old image from Cloudinary
    if (category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    // Upload new image
    const uploadResult = await uploadOnCloudinary(req.file, "categories");
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload image");
    }

    category.image = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      altText: name || category.name,
    };
  }

  // Update fields
  if (name) category.name = name;
  if (description) category.description = description;
  if (status) {
    category.status = status;
    category.isActive = status === "active";
  }
  if (featured !== undefined) category.featured = featured === "true";
  if (sortOrder !== undefined) category.sortOrder = parseInt(sortOrder);
  if (keywords) category.keywords = keywords.split(",").map((k) => k.trim());
  if (metaTitle) category.metaTitle = metaTitle;
  if (metaDescription) category.metaDescription = metaDescription;

  // Update audit fields
  category.updatedBy = req.user._id;
  category.updatedAt = Date.now();

  await category.save();
  await category.populate("createdBy", "firstName lastName email");
  await category.populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if category can be deleted
  const canDelete = await category.canBeDeleted();
  if (!canDelete.canDelete) {
    throw new ApiError(400, canDelete.reason);
  }

  // Delete image from Cloudinary
  if (category.image.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  // Delete category from database
  await Category.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category deleted successfully"));
});

// @desc    Update category status
// @route   PATCH /api/admin/categories/:id/status
// @access  Private/Admin
const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(
      400,
      "Invalid status value. Must be 'active' or 'inactive'"
    );
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      status,
      isActive: status === "active",
      updatedBy: req.user._id,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  ).populate("createdBy", "firstName lastName email");

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category status updated successfully")
    );
});

// @desc    Toggle category status
// @route   PATCH /api/admin/categories/:id/toggle-status
// @access  Private/Admin
const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.toggleStatus();
  category.updatedBy = req.user._id;
  await category.save();

  await category.populate("createdBy", "firstName lastName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        `Category ${
          category.isActive ? "activated" : "deactivated"
        } successfully`
      )
    );
});

// @desc    Toggle category featured status
// @route   PATCH /api/admin/categories/:id/featured
// @access  Private/Admin
const toggleFeaturedCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.featured = !category.featured;
  category.updatedBy = req.user._id;
  category.updatedAt = Date.now();
  await category.save();

  await category.populate("createdBy", "firstName lastName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        `Category ${category.featured ? "added to" : "removed from"} featured`
      )
    );
});

// @desc    Get active categories (for public use)
// @route   GET /api/categories/active
// @access  Public
const getActiveCategories = asyncHandler(async (req, res) => {
  console.log("categ");
  const categories = await Category.findActive().populate(
    "subCategories",
    "name slug packageCount"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Active categories retrieved successfully"
      )
    );
});

// @desc    Get featured categories (for public use)
// @route   GET /api/categories/featured
// @access  Public
const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findFeatured();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Featured categories retrieved successfully"
      )
    );
});

// @desc    Get category hierarchy
// @route   GET /api/categories/hierarchy
// @access  Public
const getCategoryHierarchy = asyncHandler(async (req, res) => {
  const categories = await Category.getCategoryHierarchy();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Category hierarchy retrieved successfully"
      )
    );
});

// @desc    Search categories
// @route   GET /api/categories/search
// @access  Public
const searchCategories = asyncHandler(async (req, res) => {
  const { q: searchTerm, status, featured } = req.query;

  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }

  const options = {};
  if (status) options.status = status;
  if (featured !== undefined) options.featured = featured === "true";

  const categories = await Category.searchCategories(searchTerm, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Categories search completed successfully"
      )
    );
});

// @desc    Get category statistics
// @route   GET /api/admin/categories/stats
// @access  Private/Admin
const getCategoryStats = asyncHandler(async (req, res) => {
  const stats = await Category.getCategoryStats();

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Category statistics retrieved successfully")
    );
});

// @desc    Update category package count
// @route   PATCH /api/admin/categories/:id/update-package-count
// @access  Private/Admin
const updateCategoryPackageCount = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.updatePackageCount();
  category.updatedBy = req.user._id;
  await category.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        "Category package count updated successfully"
      )
    );
});

// @desc    Bulk update category status
// @route   PATCH /api/admin/categories/bulk-status
// @access  Private/Admin
const bulkUpdateCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryIds, status } = req.body;

  if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new ApiError(400, "Category IDs array is required");
  }

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(
      400,
      "Invalid status value. Must be 'active' or 'inactive'"
    );
  }

  const result = await Category.updateMany(
    { _id: { $in: categoryIds } },
    {
      status,
      isActive: status === "active",
      updatedBy: req.user._id,
      updatedAt: Date.now(),
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { modifiedCount: result.modifiedCount },
        `${result.modifiedCount} categories updated successfully`
      )
    );
});

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  toggleCategoryStatus,
  toggleFeaturedCategory,
  getActiveCategories,
  getFeaturedCategories,
  getCategoryHierarchy,
  searchCategories,
  getCategoryStats,
  updateCategoryPackageCount,
  bulkUpdateCategoryStatus,
};
