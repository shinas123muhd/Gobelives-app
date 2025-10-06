import Package from "../models/Package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    location,
    meetingPoint,
    price,
    capacity,
    duration,
    featureHighlights,
    activities,
    whatsInside,
    languages,
    tags,
    category,
    transportation,
    healthSafetyMeasures,
    cancellationPolicy,
    cancellationDetails,
    availableDates,
    schedule,
    visibility,
    status,
    featured,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;

  // Validation
  if (!title || !description || !location || !price || !capacity || !duration) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Check if package already exists with the same title
  const existingPackage = await Package.findOne({ title });
  if (existingPackage) {
    throw new ApiError(400, "A package with this title already exists");
  }

  // Handle image uploads
  let images = [];
  if (req.files && req.files.images) {
    const uploadPromises = req.files.images.map((file) =>
      uploadOnCloudinary(file, "packages")
    );
    const uploadResults = await Promise.all(uploadPromises);
    images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      altText: result.original_filename || title,
      isPrimary: index === 0,
      order: index,
    }));
  }

  // Handle cover image
  let coverImage = "";
  if (req.files && req.files.coverImage) {
    const coverImageResult = await uploadOnCloudinary(
      req.files.coverImage[0],
      "packages/cover"
    );
    coverImage = coverImageResult.secure_url;
  } else if (images.length > 0) {
    // Use first image as cover if no cover image provided
    coverImage = images[0].url;
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

  // Create package
  const packageData = await Package.create({
    title,
    description,
    shortDescription,
    location: parseField(location),
    meetingPoint: parseField(meetingPoint),
    price: parseField(price),
    capacity: parseField(capacity),
    duration: parseField(duration),
    featureHighlights: parseField(featureHighlights) || [],
    activities: parseField(activities) || [],
    whatsInside: parseField(whatsInside) || [],
    languages: parseField(languages) || [],
    tags: parseField(tags) || [],
    category,
    transportation: parseField(transportation) || { included: false },
    healthSafetyMeasures: parseField(healthSafetyMeasures) || [],
    cancellationPolicy: cancellationPolicy || "moderate",
    cancellationDetails: parseField(cancellationDetails) || {},
    availableDates: parseField(availableDates) || {},
    schedule: parseField(schedule) || {},
    images,
    coverImage,
    visibility: visibility || "public",
    status: status || "draft",
    featured: featured === "true" || false,
    metaTitle,
    metaDescription,
    keywords: parseField(keywords) || [],
    owner: req.user._id,
  });

  // Populate owner details
  await packageData.populate("owner", "firstName lastName email");

  return res
    .status(201)
    .json(new ApiResponse(201, packageData, "Package created successfully"));
});

// @desc    Get all packages with filtering, sorting, and pagination
// @route   GET /api/packages
// @access  Private/Admin
const getPackages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    category,
    featured,
    visibility,
    city,
    country,
    minPrice,
    maxPrice,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === "true";
  if (visibility) filter.visibility = visibility;
  if (city) filter["location.city"] = new RegExp(city, "i");
  if (country) filter["location.country"] = new RegExp(country, "i");

  // Price range filter
  if (minPrice || maxPrice) {
    filter["price.sellingPrice"] = {};
    if (minPrice) filter["price.sellingPrice"].$gte = parseFloat(minPrice);
    if (maxPrice) filter["price.sellingPrice"].$lte = parseFloat(maxPrice);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get packages with filtering, sorting, and pagination
  const packages = await Package.find(filter)
    .populate("owner", "firstName lastName email")
    .populate("categoryRef", "name slug")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Package.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        packages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Packages retrieved successfully"
    )
  );
});

// @desc    Get single package by ID
// @route   GET /api/packages/:id
// @access  Private/Admin
const getPackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id)
    .populate("owner", "firstName lastName email")
    .populate("categoryRef", "name slug")
    .populate("reviews")
    .populate("bookings");

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Increment view count
  await packageData.incrementViewCount();

  return res
    .status(200)
    .json(new ApiResponse(200, packageData, "Package retrieved successfully"));
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Check if user is the owner or admin
  if (
    packageData.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this package");
  }

  const {
    title,
    description,
    shortDescription,
    location,
    meetingPoint,
    price,
    capacity,
    duration,
    featureHighlights,
    activities,
    whatsInside,
    languages,
    tags,
    category,
    transportation,
    healthSafetyMeasures,
    cancellationPolicy,
    cancellationDetails,
    availableDates,
    schedule,
    visibility,
    status,
    featured,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;

  // Handle image uploads if new images are provided
  if (req.files && req.files.images) {
    // Delete old images from Cloudinary
    if (packageData.images && packageData.images.length > 0) {
      const deletePromises = packageData.images.map((image) =>
        deleteFromCloudinary(image.publicId)
      );
      await Promise.all(deletePromises);
    }

    // Upload new images
    const uploadPromises = req.files.images.map((file) =>
      uploadOnCloudinary(file, "packages")
    );
    const uploadResults = await Promise.all(uploadPromises);
    packageData.images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      publicId: result.public_id,
      altText: result.original_filename || title,
      isPrimary: index === 0,
      order: index,
    }));
  }

  // Handle cover image if a new one is provided
  if (req.files && req.files.coverImage) {
    // Upload new cover image
    const coverImageResult = await uploadOnCloudinary(
      req.files.coverImage[0],
      "packages/cover"
    );
    packageData.coverImage = coverImageResult.secure_url;
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
  if (title) packageData.title = title;
  if (description) packageData.description = description;
  if (shortDescription) packageData.shortDescription = shortDescription;
  if (location) packageData.location = parseField(location);
  if (meetingPoint) packageData.meetingPoint = parseField(meetingPoint);
  if (price) packageData.price = parseField(price);
  if (capacity) packageData.capacity = parseField(capacity);
  if (duration) packageData.duration = parseField(duration);
  if (featureHighlights)
    packageData.featureHighlights = parseField(featureHighlights);
  if (activities) packageData.activities = parseField(activities);
  if (whatsInside) packageData.whatsInside = parseField(whatsInside);
  if (languages) packageData.languages = parseField(languages);
  if (tags) packageData.tags = parseField(tags);
  if (category) packageData.category = category;
  if (transportation) packageData.transportation = parseField(transportation);
  if (healthSafetyMeasures)
    packageData.healthSafetyMeasures = parseField(healthSafetyMeasures);
  if (cancellationPolicy) packageData.cancellationPolicy = cancellationPolicy;
  if (cancellationDetails)
    packageData.cancellationDetails = parseField(cancellationDetails);
  if (availableDates) packageData.availableDates = parseField(availableDates);
  if (schedule) packageData.schedule = parseField(schedule);
  if (visibility) packageData.visibility = visibility;
  if (status) packageData.status = status;
  if (featured !== undefined) packageData.featured = featured === "true";
  if (metaTitle) packageData.metaTitle = metaTitle;
  if (metaDescription) packageData.metaDescription = metaDescription;
  if (keywords) packageData.keywords = parseField(keywords);

  // Update timestamps
  packageData.updatedAt = Date.now();

  await packageData.save();
  await packageData.populate("owner", "firstName lastName email");
  await packageData.populate("categoryRef", "name slug");

  return res
    .status(200)
    .json(new ApiResponse(200, packageData, "Package updated successfully"));
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Check if user is the owner or admin
  if (
    packageData.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this package");
  }

  // Delete images from Cloudinary
  if (packageData.images && packageData.images.length > 0) {
    const deletePromises = packageData.images.map((image) =>
      deleteFromCloudinary(image.publicId)
    );
    await Promise.all(deletePromises);
  }

  // Delete package from database
  await Package.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Package deleted successfully"));
});

// @desc    Update package status
// @route   PATCH /api/packages/:id/status
// @access  Private/Admin
const updatePackageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive", "draft", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const packageData = await Package.findByIdAndUpdate(
    req.params.id,
    { status, updatedAt: Date.now() },
    { new: true, runValidators: true }
  )
    .populate("owner", "firstName lastName email")
    .populate("categoryRef", "name slug");

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, packageData, "Package status updated successfully")
    );
});

// @desc    Toggle package featured status
// @route   PATCH /api/packages/:id/featured
// @access  Private/Admin
const toggleFeaturedPackage = asyncHandler(async (req, res) => {
  const packageData = await Package.findById(req.params.id);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  packageData.featured = !packageData.featured;
  packageData.updatedAt = Date.now();
  await packageData.save();

  await packageData.populate("owner", "firstName lastName email");
  await packageData.populate("categoryRef", "name slug");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        packageData,
        `Package ${packageData.featured ? "added to" : "removed from"} featured`
      )
    );
});

// @desc    Get featured packages (for public use)
// @route   GET /api/packages/featured
// @access  Public
const getFeaturedPackages = asyncHandler(async (req, res) => {
  const packages = await Package.findFeatured()
    .populate("owner", "firstName lastName")
    .populate("categoryRef", "name slug");

  return res
    .status(200)
    .json(
      new ApiResponse(200, packages, "Featured packages retrieved successfully")
    );
});

// @desc    Get packages by category (for public use)
// @route   GET /api/packages/category/:category
// @access  Public
const getPackagesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const packages = await Package.findByCategory(category)
    .populate("owner", "firstName lastName")
    .populate("categoryRef", "name slug")
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Package.countDocuments({
    category: category,
    status: "active",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        packages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Packages by category retrieved successfully"
    )
  );
});

// @desc    Search packages (for public use)
// @route   GET /api/packages/search
// @access  Public
const searchPackages = asyncHandler(async (req, res) => {
  const { q: searchTerm, ...filters } = req.query;

  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }

  const packages = await Package.searchPackages(searchTerm, filters)
    .populate("owner", "firstName lastName")
    .populate("categoryRef", "name slug");

  return res
    .status(200)
    .json(
      new ApiResponse(200, packages, "Package search completed successfully")
    );
});

// @desc    Get package statistics
// @route   GET /api/packages/stats
// @access  Private/Admin
const getPackageStats = asyncHandler(async (req, res) => {
  const stats = await Package.getPackageStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || {},
        "Package statistics retrieved successfully"
      )
    );
});

// @desc    Get packages by location (for public use)
// @route   GET /api/packages/location
// @access  Public
const getPackagesByLocation = asyncHandler(async (req, res) => {
  const { city, country, page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const packages = await Package.findByLocation(city, country)
    .populate("owner", "firstName lastName")
    .populate("categoryRef", "name slug")
    .skip(skip)
    .limit(parseInt(limit));

  const query = { status: "active" };
  if (city) query["location.city"] = new RegExp(city, "i");
  if (country) query["location.country"] = new RegExp(country, "i");

  const total = await Package.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        packages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Packages by location retrieved successfully"
    )
  );
});

// @desc    Delete image from package
// @route   DELETE /api/packages/:id/images/:imageId
// @access  Private/Admin
const deletePackageImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const packageData = await Package.findById(id);
  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Check if user is the owner or admin
  if (
    packageData.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(
      403,
      "Not authorized to delete images from this package"
    );
  }

  // Find the image to delete
  const imageToDelete = packageData.images.find(
    (img) => img._id.toString() === imageId
  );

  if (!imageToDelete) {
    throw new ApiError(404, "Image not found");
  }

  // Delete from Cloudinary
  if (imageToDelete.publicId) {
    await deleteFromCloudinary(imageToDelete.publicId);
  }

  // Remove from package images array
  packageData.images = packageData.images.filter(
    (img) => img._id.toString() !== imageId
  );

  // If the deleted image was the cover image, update cover image
  if (packageData.coverImage === imageToDelete.url) {
    packageData.coverImage =
      packageData.images.length > 0 ? packageData.images[0].url : "";
  }

  await packageData.save();

  return res
    .status(200)
    .json(new ApiResponse(200, packageData, "Image deleted successfully"));
});

// @desc    Add review to package
// @route   POST /api/packages/:id/reviews
// @access  Private
const addPackageReview = asyncHandler(async (req, res) => {
  const { rating, comment, bookingId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const packageData = await Package.findById(req.params.id);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Import Review model
  const Review = (await import("../models/Review.model.js")).default;

  // Check if user can review this booking
  const eligibility = await Review.canUserReview(req.user._id, bookingId);

  if (!eligibility.canReview) {
    throw new ApiError(403, eligibility.reason);
  }

  // Verify booking is for this package
  if (eligibility.booking.package.toString() !== req.params.id) {
    throw new ApiError(400, "Booking is not for this package");
  }

  // Add review using the model method
  await packageData.updateRatings(rating);

  // Populate the updated package
  await packageData.populate("reviews");

  return res
    .status(200)
    .json(new ApiResponse(200, packageData, "Review added successfully"));
});

// @desc    Get package reviews
// @route   GET /api/packages/:id/reviews
// @access  Public
const getPackageReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const packageData = await Package.findById(req.params.id);

  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Import Review model
  const Review = (await import("../models/Review.model.js")).default;

  // Build filter
  const filter = {
    package: req.params.id,
    status: "active",
  };

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get reviews
  const reviews = await Review.find(filter)
    .populate("author", "firstName lastName avatar")
    .populate("response.respondedBy", "firstName lastName")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Review.countDocuments(filter);

  // Get rating statistics
  const ratingStats = await Review.getAverageRatingForPackage(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
        ratingStats,
      },
      "Package reviews retrieved successfully"
    )
  );
});

export {
  createPackage,
  getPackages,
  getPackage,
  updatePackage,
  deletePackage,
  updatePackageStatus,
  toggleFeaturedPackage,
  getFeaturedPackages,
  getPackagesByCategory,
  searchPackages,
  getPackageStats,
  getPackagesByLocation,
  deletePackageImage,
  addPackageReview,
  getPackageReviews,
};
