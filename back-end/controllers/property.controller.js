import Property from "../models/Property.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // You'll need to create this
import { asyncHandler } from "../utils/asyncHandler.js"; // You'll need to create this
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js"; // You'll need to create this

// @desc    Create a new property
// @route   POST /api/admin/properties
// @access  Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    shortDescription,
    location,
    meetingPoint,
    price,
    capacity,
    duration,
    activities,
    languages,
    availableDays,
    startTimes,
    instantConfirmation,
    cancellationPolicy,
    cancellationDetails,
    healthSafetyMeasures,
    category,
    tags,
  } = req.body;

  // Validation
  if (!title || !description || !location || !price || !capacity) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Check if property already exists with the same title
  const existingProperty = await Property.findOne({ title });
  if (existingProperty) {
    throw new ApiError(400, "A property with this title already exists");
  }

  // Handle image uploads
  let images = [];
  if (req.files && req.files.images) {
    const uploadPromises = req.files.images.map((file) =>
      uploadOnCloudinary(file.path, "properties")
    );
    const uploadResults = await Promise.all(uploadPromises);
    images = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      altText: result.original_filename,
    }));
  }

  // Handle cover image
  let coverImage = {};
  if (req.files && req.files.coverImage) {
    const coverImageResult = await uploadOnCloudinary(
      req.files.coverImage[0].path,
      "properties/cover"
    );
    coverImage = {
      url: coverImageResult.secure_url,
      public_id: coverImageResult.public_id,
    };
  }

  // Create property
  const property = await Property.create({
    title,
    description,
    shortDescription,
    location: JSON.parse(location),
    meetingPoint: meetingPoint ? JSON.parse(meetingPoint) : undefined,
    price: JSON.parse(price),
    capacity: JSON.parse(capacity),
    duration: JSON.parse(duration),
    activities: activities ? JSON.parse(activities) : [],
    languages: languages ? JSON.parse(languages) : [],
    availableDays: availableDays ? JSON.parse(availableDays) : [],
    startTimes: startTimes ? JSON.parse(startTimes) : [],
    instantConfirmation: instantConfirmation === "true",
    images,
    coverImage: coverImage.url || "",
    cancellationPolicy,
    cancellationDetails: cancellationDetails
      ? JSON.parse(cancellationDetails)
      : {},
    healthSafetyMeasures: healthSafetyMeasures
      ? JSON.parse(healthSafetyMeasures)
      : [],
    owner: req.user._id,
    category,
    tags: tags ? JSON.parse(tags) : [],
    status: "active",
  });

  // Populate owner details
  await property.populate("owner", "name email");

  return res
    .status(201)
    .json(new ApiResponse(201, property, "Property created successfully"));
});

// @desc    Get all properties with filtering, sorting, and pagination
// @route   GET /api/admin/properties
// @access  Private/Admin
const getProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    category,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { "location.city": { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get properties with filtering, sorting, and pagination
  const properties = await Property.find(filter)
    .populate("owner", "name email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Property.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Properties retrieved successfully"
    )
  );
});

// @desc    Get single property by ID
// @route   GET /api/admin/properties/:id
// @access  Private/Admin
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("owner", "name email")
    .populate("reviews")
    .populate("bookings");

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property retrieved successfully"));
});

// @desc    Update property
// @route   PUT /api/admin/properties/:id
// @access  Private/Admin
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Check if user is the owner or admin
  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this property");
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
    activities,
    languages,
    availableDays,
    startTimes,
    instantConfirmation,
    cancellationPolicy,
    cancellationDetails,
    healthSafetyMeasures,
    category,
    tags,
    status,
  } = req.body;

  // Handle image uploads if new images are provided
  if (req.files && req.files.images) {
    // Delete old images from Cloudinary
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map((image) =>
        deleteFromCloudinary(image.public_id)
      );
      await Promise.all(deletePromises);
    }

    // Upload new images
    const uploadPromises = req.files.images.map((file) =>
      uploadOnCloudinary(file.path, "properties")
    );
    const uploadResults = await Promise.all(uploadPromises);
    property.images = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      altText: result.original_filename,
    }));
  }

  // Handle cover image if a new one is provided
  if (req.files && req.files.coverImage) {
    // Delete old cover image from Cloudinary
    if (property.coverImagePublicId) {
      await deleteFromCloudinary(property.coverImagePublicId);
    }

    // Upload new cover image
    const coverImageResult = await uploadOnCloudinary(
      req.files.coverImage[0].path,
      "properties/cover"
    );
    property.coverImage = coverImageResult.secure_url;
    property.coverImagePublicId = coverImageResult.public_id;
  }

  // Update fields
  if (title) property.title = title;
  if (description) property.description = description;
  if (shortDescription) property.shortDescription = shortDescription;
  if (location) property.location = JSON.parse(location);
  if (meetingPoint) property.meetingPoint = JSON.parse(meetingPoint);
  if (price) property.price = JSON.parse(price);
  if (capacity) property.capacity = JSON.parse(capacity);
  if (duration) property.duration = JSON.parse(duration);
  if (activities) property.activities = JSON.parse(activities);
  if (languages) property.languages = JSON.parse(languages);
  if (availableDays) property.availableDays = JSON.parse(availableDays);
  if (startTimes) property.startTimes = JSON.parse(startTimes);
  if (instantConfirmation !== undefined)
    property.instantConfirmation = instantConfirmation === "true";
  if (cancellationPolicy) property.cancellationPolicy = cancellationPolicy;
  if (cancellationDetails)
    property.cancellationDetails = JSON.parse(cancellationDetails);
  if (healthSafetyMeasures)
    property.healthSafetyMeasures = JSON.parse(healthSafetyMeasures);
  if (category) property.category = category;
  if (tags) property.tags = JSON.parse(tags);
  if (status) property.status = status;

  // Update timestamps
  property.updatedAt = Date.now();

  await property.save();
  await property.populate("owner", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Property updated successfully"));
});

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Check if user is the owner or admin
  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this property");
  }

  // Delete images from Cloudinary
  if (property.images && property.images.length > 0) {
    const deletePromises = property.images.map((image) =>
      deleteFromCloudinary(image.public_id)
    );
    await Promise.all(deletePromises);
  }

  // Delete cover image from Cloudinary
  if (property.coverImagePublicId) {
    await deleteFromCloudinary(property.coverImagePublicId);
  }

  // Delete property from database
  await Property.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Property deleted successfully"));
});

// @desc    Update property status
// @route   PATCH /api/admin/properties/:id/status
// @access  Private/Admin
const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive", "draft", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate("owner", "name email");

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, property, "Property status updated successfully")
    );
});

// @desc    Toggle property featured status
// @route   PATCH /api/admin/properties/:id/featured
// @access  Private/Admin
const toggleFeaturedProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  property.featured = !property.featured;
  await property.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        property,
        `Property ${property.featured ? "added to" : "removed from"} featured`
      )
    );
});

// @desc    Add review to property
// @route   POST /api/properties/:id/reviews
// @access  Private
const addPropertyReview = asyncHandler(async (req, res) => {
  const { rating, comment, bookingId } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Import Review model
  const Review = (await import("../models/Review.model.js")).default;

  // Check if user can review this booking
  const eligibility = await Review.canUserReview(req.user._id, bookingId);

  if (!eligibility.canReview) {
    throw new ApiError(403, eligibility.reason);
  }

  // Verify booking is for this property
  if (eligibility.booking.property.toString() !== req.params.id) {
    throw new ApiError(400, "Booking is not for this property");
  }

  // Add review using the model method
  await property.updateRatings(rating);

  // Populate the updated property
  await property.populate("reviews");

  return res
    .status(200)
    .json(new ApiResponse(200, property, "Review added successfully"));
});

// @desc    Get property reviews
// @route   GET /api/properties/:id/reviews
// @access  Public
const getPropertyReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Import Review model
  const Review = (await import("../models/Review.model.js")).default;

  // Build filter
  const filter = {
    property: req.params.id,
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
  const ratingStats = await Review.getAverageRatingForProperty(req.params.id);

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
      "Property reviews retrieved successfully"
    )
  );
});

export {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  toggleFeaturedProperty,
  addPropertyReview,
  getPropertyReviews,
};
