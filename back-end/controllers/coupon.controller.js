import Coupon from "../models/Coupon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    name,
    description,
    discount,
    discountType,
    currency,
    eligibility,
    selectedPackages,
    specificPackage,
    usageLimit,
    minimumAmount,
    maximumDiscount,
    expiryDate,
    startDate,
    userRestrictions,
    tags,
    isFeatured,
    priority,
    status,
  } = req.body;

  // Validation
  if (!code || !name || !discount || !discountType || !expiryDate) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    throw new ApiError(400, "A coupon with this code already exists");
  }

  // Validate eligibility-specific fields
  if (
    eligibility === "selected" &&
    (!selectedPackages || selectedPackages.length === 0)
  ) {
    throw new ApiError(
      400,
      "Selected packages are required when eligibility is 'selected'"
    );
  }

  if (eligibility === "specific" && !specificPackage) {
    throw new ApiError(
      400,
      "Specific package is required when eligibility is 'specific'"
    );
  }

  // Parse JSON fields if they are strings
  const parseField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  // Set status and isActive based on the provided status
  const finalStatus = status || "active";
  const isActive = finalStatus === "active";

  // Create coupon
  const couponData = await Coupon.create({
    code: code.toUpperCase(),
    name,
    description,
    discount: parseFloat(discount),
    discountType,
    currency: currency || "USD",
    eligibility,
    selectedPackages: parseField(selectedPackages) || [],
    specificPackage: specificPackage || null,
    usageLimit: usageLimit ? parseInt(usageLimit) : null,
    minimumAmount: minimumAmount ? parseFloat(minimumAmount) : null,
    maximumDiscount: maximumDiscount ? parseFloat(maximumDiscount) : null,
    expiryDate: new Date(expiryDate),
    startDate: startDate ? new Date(startDate) : new Date(),
    userRestrictions: parseField(userRestrictions) || {},
    tags: parseField(tags) || [],
    isFeatured: isFeatured === "true" || false,
    priority: priority ? parseInt(priority) : 0,
    status: finalStatus,
    isActive: isActive,
    createdBy: req.user._id,
  });

  // Populate related fields
  await couponData.populate("createdBy", "firstName lastName email");
  if (couponData.specificPackage) {
    await couponData.populate("specificPackage", "title");
  }
  if (couponData.selectedPackages.length > 0) {
    await couponData.populate("selectedPackages", "title");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, couponData, "Coupon created successfully"));
});

// @desc    Get all coupons with filtering, sorting, and pagination
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    eligibility,
    isActive,
    isFeatured,
    createdBy,
    expiryDateFrom,
    expiryDateTo,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (eligibility) filter.eligibility = eligibility;
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
  if (createdBy) filter.createdBy = createdBy;

  // Date range filter
  if (expiryDateFrom || expiryDateTo) {
    filter.expiryDate = {};
    if (expiryDateFrom) filter.expiryDate.$gte = new Date(expiryDateFrom);
    if (expiryDateTo) filter.expiryDate.$lte = new Date(expiryDateTo);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get coupons with filtering, sorting, and pagination
  const coupons = await Coupon.find(filter)
    .populate("createdBy", "firstName lastName email")
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Coupon.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Coupons retrieved successfully"
    )
  );
});

// @desc    Get single coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate("createdBy", "firstName lastName email")
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title")
    .populate("lastUsedBy", "firstName lastName email");

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon retrieved successfully"));
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Check if user is the creator or admin
  if (
    coupon.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this coupon");
  }

  const {
    code,
    name,
    description,
    discount,
    discountType,
    currency,
    eligibility,
    selectedPackages,
    specificPackage,
    usageLimit,
    minimumAmount,
    maximumDiscount,
    expiryDate,
    startDate,
    userRestrictions,
    tags,
    isFeatured,
    priority,
    status,
  } = req.body;

  // Check if new code conflicts with existing coupon
  if (code && code.toUpperCase() !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      throw new ApiError(400, "A coupon with this code already exists");
    }
  }

  // Validate eligibility-specific fields
  if (
    eligibility === "selected" &&
    (!selectedPackages || selectedPackages.length === 0)
  ) {
    throw new ApiError(
      400,
      "Selected packages are required when eligibility is 'selected'"
    );
  }

  if (eligibility === "specific" && !specificPackage) {
    throw new ApiError(
      400,
      "Specific package is required when eligibility is 'specific'"
    );
  }

  // Parse JSON fields if they are strings
  const parseField = (field) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    return field;
  };

  // Update fields
  if (code) coupon.code = code.toUpperCase();
  if (name) coupon.name = name;
  if (description !== undefined) coupon.description = description;
  if (discount !== undefined) coupon.discount = parseFloat(discount);
  if (discountType) coupon.discountType = discountType;
  if (currency) coupon.currency = currency;
  if (eligibility) coupon.eligibility = eligibility;
  if (selectedPackages !== undefined)
    coupon.selectedPackages = parseField(selectedPackages) || [];
  if (specificPackage !== undefined)
    coupon.specificPackage = specificPackage || null;
  if (usageLimit !== undefined)
    coupon.usageLimit = usageLimit ? parseInt(usageLimit) : null;
  if (minimumAmount !== undefined)
    coupon.minimumAmount = minimumAmount ? parseFloat(minimumAmount) : null;
  if (maximumDiscount !== undefined)
    coupon.maximumDiscount = maximumDiscount
      ? parseFloat(maximumDiscount)
      : null;
  if (expiryDate) coupon.expiryDate = new Date(expiryDate);
  if (startDate) coupon.startDate = new Date(startDate);
  if (userRestrictions !== undefined)
    coupon.userRestrictions = parseField(userRestrictions) || {};
  if (tags !== undefined) coupon.tags = parseField(tags) || [];
  if (isFeatured !== undefined) coupon.isFeatured = isFeatured === "true";
  if (priority !== undefined)
    coupon.priority = priority ? parseInt(priority) : 0;

  // Handle status and isActive fields
  if (status !== undefined) {
    coupon.status = status;
    coupon.isActive = status === "active";
  }

  // Update timestamp
  coupon.updatedAt = Date.now();

  await coupon.save();
  await coupon.populate("createdBy", "firstName lastName email");
  if (coupon.specificPackage) {
    await coupon.populate("specificPackage", "title");
  }
  if (coupon.selectedPackages.length > 0) {
    await coupon.populate("selectedPackages", "title");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"));
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Check if user is the creator or admin
  if (
    coupon.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this coupon");
  }

  // Check if coupon has been used
  if (coupon.usedCount > 0) {
    throw new ApiError(400, "Cannot delete coupon that has been used");
  }

  // Delete coupon from database
  await Coupon.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Coupon deleted successfully"));
});

// @desc    Update coupon status
// @route   PATCH /api/coupons/:id/status
// @access  Private/Admin
const updateCouponStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive", "expired", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  // Update both status and isActive fields
  const updateData = {
    status,
    updatedAt: Date.now(),
  };

  // Set isActive based on status
  if (status === "active") {
    updateData.isActive = true;
  } else if (status === "inactive") {
    updateData.isActive = false;
  }
  // For "expired" and "suspended", keep isActive as is

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "firstName lastName email")
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title");

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon status updated successfully"));
});

// @desc    Toggle coupon active status
// @route   PATCH /api/coupons/:id/active
// @access  Private/Admin
const toggleCouponActive = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Toggle isActive field
  coupon.isActive = !coupon.isActive;

  // Update status field based on isActive
  if (coupon.isActive) {
    coupon.status = "active";
  } else {
    coupon.status = "inactive";
  }

  coupon.updatedAt = Date.now();
  await coupon.save();

  await coupon.populate("createdBy", "firstName lastName email");
  if (coupon.specificPackage) {
    await coupon.populate("specificPackage", "title");
  }
  if (coupon.selectedPackages.length > 0) {
    await coupon.populate("selectedPackages", "title");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coupon,
        `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`
      )
    );
});

// @desc    Toggle coupon featured status
// @route   PATCH /api/coupons/:id/featured
// @access  Private/Admin
const toggleCouponFeatured = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  coupon.isFeatured = !coupon.isFeatured;
  coupon.updatedAt = Date.now();
  await coupon.save();

  await coupon.populate("createdBy", "firstName lastName email");
  if (coupon.specificPackage) {
    await coupon.populate("specificPackage", "title");
  }
  if (coupon.selectedPackages.length > 0) {
    await coupon.populate("selectedPackages", "title");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coupon,
        `Coupon ${coupon.isFeatured ? "added to" : "removed from"} featured`
      )
    );
});

// @desc    Get active coupons (for public use)
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = asyncHandler(async (req, res) => {
  const { eligibility, packageId } = req.query;

  let filter = {
    status: "active",
    isActive: true,
    expiryDate: { $gt: new Date() },
  };

  // Filter by eligibility and package
  if (eligibility) {
    filter.eligibility = eligibility;
  }

  if (packageId) {
    filter.$or = [
      { eligibility: "all" },
      { specificPackage: packageId },
      { selectedPackages: packageId },
    ];
  }

  const coupons = await Coupon.find(filter)
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title")
    .sort({ priority: -1, createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, coupons, "Active coupons retrieved successfully")
    );
});

// @desc    Get coupons by code (for public use)
// @route   GET /api/coupons/code/:code
// @access  Public
const getCouponByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { packageId, userId, orderAmount } = req.query;

  const coupon = await Coupon.findByCode(code)
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title");

  if (!coupon) {
    throw new ApiError(404, "Coupon not found or expired");
  }

  // If packageId, userId, and orderAmount are provided, validate the coupon
  if (packageId && userId && orderAmount) {
    const validation = coupon.validateCoupon(
      packageId,
      userId,
      parseFloat(orderAmount)
    );
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          coupon,
          validation,
        },
        "Coupon validation completed"
      )
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon retrieved successfully"));
});

// @desc    Get coupons applicable to a package
// @route   GET /api/coupons/package/:packageId
// @access  Public
const getCouponsForPackage = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const { userId, orderAmount } = req.query;

  const coupons = await Coupon.findApplicableToPackage(packageId)
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title")
    .sort({ priority: -1, createdAt: -1 });

  // If userId and orderAmount are provided, validate all coupons
  if (userId && orderAmount) {
    const validatedCoupons = coupons
      .map((coupon) => {
        const validation = coupon.validateCoupon(
          packageId,
          userId,
          parseFloat(orderAmount)
        );
        return {
          coupon,
          validation,
        };
      })
      .filter((item) => item.validation.isValid);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          validatedCoupons,
          "Valid coupons for package retrieved successfully"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coupons,
        "Coupons for package retrieved successfully"
      )
    );
});

// @desc    Search coupons (for public use)
// @route   GET /api/coupons/search
// @access  Public
const searchCoupons = asyncHandler(async (req, res) => {
  const { q: searchTerm, ...filters } = req.query;

  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }

  const coupons = await Coupon.searchCoupons(searchTerm, filters)
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(200, coupons, "Coupon search completed successfully")
    );
});

// @desc    Get coupon statistics
// @route   GET /api/coupons/stats
// @access  Private/Admin
const getCouponStats = asyncHandler(async (req, res) => {
  const stats = await Coupon.getCouponStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || {},
        "Coupon statistics retrieved successfully"
      )
    );
});

// @desc    Get expiring coupons
// @route   GET /api/coupons/expiring
// @access  Private/Admin
const getExpiringCoupons = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  const coupons = await Coupon.findExpiringSoon(parseInt(days))
    .populate("createdBy", "firstName lastName email")
    .populate("specificPackage", "title")
    .populate("selectedPackages", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(200, coupons, "Expiring coupons retrieved successfully")
    );
});

// @desc    Use coupon
// @route   POST /api/coupons/:id/use
// @access  Private
const useCoupon = asyncHandler(async (req, res) => {
  const { packageId, orderAmount } = req.body;

  if (!packageId || !orderAmount) {
    throw new ApiError(400, "Package ID and order amount are required");
  }

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Validate coupon before use
  const validation = coupon.validateCoupon(
    packageId,
    req.user._id,
    parseFloat(orderAmount)
  );

  if (!validation.isValid) {
    throw new ApiError(
      400,
      `Coupon validation failed: ${validation.errors.join(", ")}`
    );
  }

  // Use the coupon
  await coupon.useCoupon(req.user._id, parseFloat(orderAmount));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        coupon,
        discountAmount: validation.discountAmount,
      },
      "Coupon used successfully"
    )
  );
});

// @desc    Validate coupon
// @route   POST /api/coupons/:id/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { packageId, orderAmount } = req.body;

  if (!packageId || !orderAmount) {
    throw new ApiError(400, "Package ID and order amount are required");
  }

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  const validation = coupon.validateCoupon(
    packageId,
    req.user._id,
    parseFloat(orderAmount)
  );

  return res
    .status(200)
    .json(new ApiResponse(200, validation, "Coupon validation completed"));
});

export {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  toggleCouponActive,
  toggleCouponFeatured,
  getActiveCoupons,
  getCouponByCode,
  getCouponsForPackage,
  searchCoupons,
  getCouponStats,
  getExpiringCoupons,
  useCoupon,
  validateCoupon,
};
