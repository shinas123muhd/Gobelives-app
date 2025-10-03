import Hotel from "../models/Hotel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = asyncHandler(async (req, res) => {
  const {
    name,
    website,
    email,
    location,
    address,
    coordinates,
    phone,
    description,
    shortDescription,
    images,
    amenities,
    starRating,
    category,
    rooms,
    booking,
    rates,
    availability,
    guestInfo,
    policies,
    tags,
    features,
    includedItems,
    excludedItems,
    seo,
    status,
    isActive,
    isFeatured,
    isVerified,
  } = req.body;

  console.log(req.files);

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

  // Parse phone object
  const parsedPhone = parseField(phone);

  // Validation
  if (!name || !email || !location || !address || !parsedPhone) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Validate phone object structure
  if (!parsedPhone.code) {
    throw new ApiError(400, "Phone code is required");
  }
  if (!parsedPhone.number) {
    throw new ApiError(400, "Phone number is required");
  }

  // Validate phone code format
  if (!/^\+\d{1,4}$/.test(parsedPhone.code)) {
    throw new ApiError(
      400,
      "Please provide a valid phone code (e.g., +1, +91)"
    );
  }

  // Validate phone number format
  if (!/^\d{10,15}$/.test(parsedPhone.number)) {
    throw new ApiError(
      400,
      "Please provide a valid phone number (10-15 digits)"
    );
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate website URL if provided
  if (website && !/^https?:\/\/.+/.test(website)) {
    throw new ApiError(
      400,
      "Please provide a valid website URL starting with http:// or https://"
    );
  }

  // Check if hotel with same name and location already exists
  const existingHotel = await Hotel.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
    location: { $regex: new RegExp(`^${location}$`, "i") },
  });
  if (existingHotel) {
    throw new ApiError(
      400,
      "A hotel with this name and location already exists"
    );
  }

  // Debug logging
  console.log("Received rates:", rates);
  console.log("Received guestInfo:", guestInfo);

  // Set status and isActive based on the provided status
  const finalStatus = status || "active";

  // Handle image uploads
  let uploadedImages = [];
  if (req.files && req.files.images && req.files.images.length > 0) {
    // Filter out empty files and ensure they are valid File objects
    const validFiles = req.files.images.filter(
      (file) =>
        file &&
        file.buffer &&
        file.originalname &&
        file.mimetype &&
        file.mimetype.startsWith("image/")
    );

    if (validFiles.length > 0) {
      const uploadPromises = validFiles.map((file) =>
        uploadOnCloudinary(file, "hotels")
      );
      const uploadResults = await Promise.all(uploadPromises);
      uploadedImages = uploadResults.map((result, index) => ({
        url: result.secure_url,
        publicId: result.public_id,
        altText: result.original_filename || name,
        isPrimary: index === 0,
        order: index,
      }));
    }
  }

  // Create hotel
  const hotelData = await Hotel.create({
    name,
    website: website || null,
    email,
    location,
    address,
    coordinates: parseField(coordinates) || {},
    phone: parsedPhone || {},
    description: description || null,
    shortDescription: shortDescription || null,
    images: uploadedImages,
    amenities: parseField(amenities) || [],
    starRating: starRating ? parseInt(starRating) : null,
    category: category || null,
    rooms: parseField(rooms) || {},
    booking: parseField(booking) || {},
    rates: parseField(rates) || {},
    availability: parseField(availability) || {},
    guestInfo: parseField(guestInfo) || {},
    policies: parseField(policies) || {},
    tags: parseField(tags) || [],
    features: parseField(features) || [],
    includedItems: parseField(includedItems) || [],
    excludedItems: parseField(excludedItems) || [],
    seo: parseField(seo) || {},
    status: finalStatus,
    isActive: isActive,
    isFeatured: isFeatured || false,
    isVerified: isVerified || false,
    createdBy: req.user._id,
  });

  // Populate related fields
  await hotelData.populate("createdBy", "firstName lastName email");

  return res
    .status(201)
    .json(new ApiResponse(201, hotelData, "Hotel created successfully"));
});

// @desc    Get all hotels with filtering, sorting, and pagination
// @route   GET /api/hotels
// @access  Private/Admin
const getHotels = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    isActive,
    isVerified,
    isFeatured,
    starRating,
    category,
    location,
    createdBy,
    dateFrom,
    dateTo,
  } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (isActive !== undefined && isActive !== "")
    filter.isActive = isActive === "true";
  if (isVerified !== undefined && isVerified !== "")
    filter.isVerified = isVerified === "true";
  if (isFeatured !== undefined && isFeatured !== "")
    filter.isFeatured = isFeatured === "true";
  if (starRating) filter.starRating = { $gte: parseInt(starRating) };
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (createdBy) filter.createdBy = createdBy;

  // Date range filter
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  if (search && search.trim() !== "") {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get hotels with filtering, sorting, and pagination
  const hotels = await Hotel.find(filter)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .populate("verifiedBy", "firstName lastName email")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Hotel.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hotels,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Hotels retrieved successfully"
    )
  );
});

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Private/Admin
const getHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id)
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email")
    .populate("verifiedBy", "firstName lastName email")
    .populate("reviews.user", "firstName lastName email");

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel retrieved successfully"));
});

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Check if user is the creator or admin
  if (
    hotel.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to update this hotel");
  }

  const {
    name,
    website,
    email,
    location,
    address,
    coordinates,
    phone,
    description,
    shortDescription,
    images,
    existingImages,
    amenities,
    starRating,
    category,
    rooms,
    booking,
    rates,
    availability,
    guestInfo,
    policies,
    tags,
    features,
    includedItems,
    excludedItems,
    seo,
    status,
    isActive,
    isFeatured,
    isVerified,
  } = req.body;

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

  // Check if new name and location conflict with existing hotel
  if (name && location) {
    const existingHotel = await Hotel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      location: { $regex: new RegExp(`^${location}$`, "i") },
      _id: { $ne: req.params.id },
    });
    if (existingHotel) {
      throw new ApiError(
        400,
        "A hotel with this name and location already exists"
      );
    }
  }

  // Validate phone if provided
  if (phone !== undefined) {
    const parsedPhone = parseField(phone);

    if (parsedPhone && (parsedPhone.code || parsedPhone.number)) {
      // Validate phone code format if provided
      if (parsedPhone.code && !/^\+\d{1,4}$/.test(parsedPhone.code)) {
        throw new ApiError(
          400,
          "Please provide a valid phone code (e.g., +1, +91)"
        );
      }

      // Validate phone number format if provided
      if (parsedPhone.number && !/^\d{10,15}$/.test(parsedPhone.number)) {
        throw new ApiError(
          400,
          "Please provide a valid phone number (10-15 digits)"
        );
      }
    }
  }

  // Handle image uploads and removals
  let uploadedImages = [];
  let imagesToDelete = [];

  // Handle new image uploads
  if (req.files && req.files.images && req.files.images.length > 0) {
    // Filter out empty files and ensure they are valid File objects
    const validFiles = req.files.images.filter(
      (file) =>
        file &&
        file.buffer &&
        file.originalname &&
        file.mimetype &&
        file.mimetype.startsWith("image/")
    );

    if (validFiles.length > 0) {
      const uploadPromises = validFiles.map((file) =>
        uploadOnCloudinary(file, "hotels")
      );
      const uploadResults = await Promise.all(uploadPromises);
      uploadedImages = uploadResults.map((result, index) => ({
        url: result.secure_url,
        publicId: result.public_id,
        altText: result.original_filename || hotel.name,
        isPrimary: false, // New images are not primary by default
        order: hotel.images.length + index, // Continue from existing images
      }));
    }
  }

  // Handle image removals - check if existingImages field is provided
  if (existingImages !== undefined) {
    const parsedExistingImages = parseField(existingImages) || [];
    const currentImageIds = hotel.images.map((img) => img._id.toString());
    const existingImageIds = parsedExistingImages.map((img) =>
      img._id ? img._id.toString() : img.id
    );

    // Find images that were removed
    imagesToDelete = hotel.images.filter(
      (img) => !existingImageIds.includes(img._id.toString())
    );
  }

  // Update fields
  if (name) hotel.name = name;
  if (website !== undefined) hotel.website = website;
  if (email) hotel.email = email;
  if (location) hotel.location = location;
  if (address) hotel.address = address;
  if (coordinates !== undefined)
    hotel.coordinates = parseField(coordinates) || {};
  if (phone !== undefined) {
    const parsedPhone = parseField(phone);
    hotel.phone = parsedPhone || {};
  }
  if (description !== undefined) hotel.description = description;
  if (shortDescription !== undefined) hotel.shortDescription = shortDescription;

  // Handle image deletions from Cloudinary
  if (imagesToDelete.length > 0) {
    const { deleteFromCloudinary } = await import("../utils/cloudinary.js");

    for (const imageToDelete of imagesToDelete) {
      if (imageToDelete.publicId) {
        try {
          await deleteFromCloudinary(imageToDelete.publicId);
          console.log(
            `Deleted image from Cloudinary: ${imageToDelete.publicId}`
          );
        } catch (error) {
          console.error("Error deleting from Cloudinary:", error);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      }
    }
  }

  // Handle images - add new uploads to existing images
  if (uploadedImages.length > 0) {
    // Add new images to existing ones
    hotel.images = [...hotel.images, ...uploadedImages];
  }

  // If existingImages is provided, update the images array to match
  if (existingImages !== undefined) {
    const parsedExistingImages = parseField(existingImages) || [];
    // Keep existing images that are still in the list, add new uploads
    const remainingExistingImages = hotel.images.filter((img) =>
      parsedExistingImages.some(
        (existing) => existing._id === img._id.toString()
      )
    );
    hotel.images = [...remainingExistingImages, ...uploadedImages];
  }
  if (amenities !== undefined) hotel.amenities = parseField(amenities) || [];
  if (starRating !== undefined)
    hotel.starRating = starRating ? parseInt(starRating) : null;
  if (category !== undefined) hotel.category = category;
  if (rooms !== undefined) hotel.rooms = parseField(rooms) || {};
  if (booking !== undefined) hotel.booking = parseField(booking) || {};
  if (rates !== undefined) hotel.rates = parseField(rates) || {};
  if (availability !== undefined)
    hotel.availability = parseField(availability) || {};
  if (guestInfo !== undefined) hotel.guestInfo = parseField(guestInfo) || {};
  if (policies !== undefined) hotel.policies = parseField(policies) || {};
  if (tags !== undefined) hotel.tags = parseField(tags) || [];
  if (features !== undefined) hotel.features = parseField(features) || [];
  if (includedItems !== undefined)
    hotel.includedItems = parseField(includedItems) || [];
  if (excludedItems !== undefined)
    hotel.excludedItems = parseField(excludedItems) || [];
  if (seo !== undefined) hotel.seo = parseField(seo) || {};

  // Handle status and boolean fields
  if (status !== undefined) {
    hotel.status = status;
    hotel.isActive = status === "active";
  }
  if (isActive !== undefined) hotel.isActive = isActive;
  if (isFeatured !== undefined) hotel.isFeatured = isFeatured;
  if (isVerified !== undefined) {
    hotel.isVerified = isVerified;
    if (isVerified) {
      hotel.verifiedBy = req.user._id;
      hotel.verifiedAt = new Date();
    } else {
      hotel.verifiedBy = null;
      hotel.verifiedAt = null;
    }
  }

  // Update updatedBy and timestamp
  hotel.updatedBy = req.user._id;
  hotel.updatedAt = Date.now();

  await hotel.save();
  await hotel.populate("createdBy", "firstName lastName email");
  await hotel.populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel updated successfully"));
});

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Check if user is the creator or admin
  if (
    hotel.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this hotel");
  }

  // Check if hotel has bookings
  if (hotel.analytics.bookings > 0) {
    throw new ApiError(400, "Cannot delete hotel that has bookings");
  }

  // Delete hotel from database
  await Hotel.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Hotel deleted successfully"));
});

// @desc    Update hotel status
// @route   PATCH /api/hotels/:id/status
// @access  Private/Admin
const updateHotelStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive", "pending", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  // Update both status and isActive fields
  const updateData = {
    status,
    updatedBy: req.user._id,
    updatedAt: Date.now(),
  };

  // Set isActive based on status
  if (status === "active") {
    updateData.isActive = true;
  } else if (status === "inactive") {
    updateData.isActive = false;
  }
  // For "pending" and "suspended", keep isActive as is

  const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email");

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel status updated successfully"));
});

// @desc    Toggle hotel active status
// @route   PATCH /api/hotels/:id/active
// @access  Private/Admin
const toggleHotelActive = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Toggle isActive field
  hotel.isActive = !hotel.isActive;

  // Update status field based on isActive
  if (hotel.isActive) {
    hotel.status = "active";
  } else {
    hotel.status = "inactive";
  }

  hotel.updatedBy = req.user._id;
  hotel.updatedAt = Date.now();
  await hotel.save();

  await hotel.populate("createdBy", "firstName lastName email");
  await hotel.populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hotel,
        `Hotel ${hotel.isActive ? "activated" : "deactivated"} successfully`
      )
    );
});

// @desc    Toggle hotel featured status
// @route   PATCH /api/hotels/:id/featured
// @access  Private/Admin
const toggleHotelFeatured = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  hotel.isFeatured = !hotel.isFeatured;
  hotel.updatedBy = req.user._id;
  hotel.updatedAt = Date.now();
  await hotel.save();

  await hotel.populate("createdBy", "firstName lastName email");
  await hotel.populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hotel,
        `Hotel ${hotel.isFeatured ? "added to" : "removed from"} featured`
      )
    );
});

// @desc    Toggle hotel verified status
// @route   PATCH /api/hotels/:id/verify
// @access  Private/Admin
const toggleHotelVerified = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  hotel.isVerified = !hotel.isVerified;
  hotel.verifiedBy = req.user._id;
  hotel.verifiedAt = hotel.isVerified ? new Date() : null;
  hotel.updatedBy = req.user._id;
  hotel.updatedAt = Date.now();
  await hotel.save();

  await hotel.populate("createdBy", "firstName lastName email");
  await hotel.populate("updatedBy", "firstName lastName email");
  await hotel.populate("verifiedBy", "firstName lastName email");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        hotel,
        `Hotel ${hotel.isVerified ? "verified" : "unverified"} successfully`
      )
    );
});

// @desc    Get active hotels (for public use)
// @route   GET /api/hotels/active
// @access  Public
const getActiveHotels = asyncHandler(async (req, res) => {
  const { location, category, starRating, minRating, featured } = req.query;

  let filter = {
    status: "active",
    isActive: true,
    isVerified: true,
  };

  // Apply filters
  if (location) filter.location = { $regex: location, $options: "i" };
  if (category) filter.category = category;
  if (starRating) filter.starRating = { $gte: parseInt(starRating) };
  if (minRating)
    filter["analytics.averageRating"] = { $gte: parseFloat(minRating) };
  if (featured === "true") filter.isFeatured = true;

  const hotels = await Hotel.find(filter)
    .populate("reviews.user", "firstName lastName")
    .sort({ "analytics.averageRating": -1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Active hotels retrieved successfully"));
});

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
const getFeaturedHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.findFeatured().populate(
    "reviews.user",
    "firstName lastName"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, hotels, "Featured hotels retrieved successfully")
    );
});

// @desc    Search hotels
// @route   GET /api/hotels/search
// @access  Public
const searchHotels = asyncHandler(async (req, res) => {
  const { q: searchTerm, ...filters } = req.query;

  if (!searchTerm) {
    throw new ApiError(400, "Search term is required");
  }

  const hotels = await Hotel.searchHotels(searchTerm, filters).populate(
    "reviews.user",
    "firstName lastName"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Hotel search completed successfully"));
});

// @desc    Get hotels by location
// @route   GET /api/hotels/location/:location
// @access  Public
const getHotelsByLocation = asyncHandler(async (req, res) => {
  const { location } = req.params;
  const { category, starRating, minRating } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (starRating) filters.starRating = { $gte: parseInt(starRating) };
  if (minRating)
    filters["analytics.averageRating"] = { $gte: parseFloat(minRating) };

  const hotels = await Hotel.findByLocation(location).populate(
    "reviews.user",
    "firstName lastName"
  );

  // Apply additional filters
  const filteredHotels = hotels.filter((hotel) => {
    if (filters.category && hotel.category !== filters.category) return false;
    if (filters.starRating && hotel.starRating < filters.starRating.$gte)
      return false;
    if (
      filters["analytics.averageRating"] &&
      hotel.analytics.averageRating < filters["analytics.averageRating"].$gte
    )
      return false;
    return true;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        filteredHotels,
        "Hotels by location retrieved successfully"
      )
    );
});

// @desc    Get nearby hotels
// @route   GET /api/hotels/nearby
// @access  Public
const getNearbyHotels = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 10 } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, "Latitude and longitude are required");
  }

  const hotels = await Hotel.findNearby(
    parseFloat(latitude),
    parseFloat(longitude),
    parseFloat(radius)
  ).populate("reviews.user", "firstName lastName");

  return res
    .status(200)
    .json(new ApiResponse(200, hotels, "Nearby hotels retrieved successfully"));
});

// @desc    Get hotel statistics
// @route   GET /api/hotels/stats
// @access  Private/Admin
const getHotelStats = asyncHandler(async (req, res) => {
  const stats = await Hotel.getHotelStats();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || {},
        "Hotel statistics retrieved successfully"
      )
    );
});

// @desc    Add review to hotel
// @route   POST /api/hotels/:id/reviews
// @access  Private
const addHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Add review using the model method
  await hotel.addReview(req.user._id, rating, comment || "");

  // Populate the updated hotel
  await hotel.populate("reviews.user", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Review added successfully"));
});

// @desc    Update hotel review
// @route   PUT /api/hotels/:id/reviews
// @access  Private
const updateHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Update review using the model method
  await hotel.updateReview(req.user._id, rating, comment || "");

  // Populate the updated hotel
  await hotel.populate("reviews.user", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Review updated successfully"));
});

// @desc    Remove hotel review
// @route   DELETE /api/hotels/:id/reviews
// @access  Private
const removeHotelReview = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Remove review using the model method
  await hotel.removeReview(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review removed successfully"));
});

// @desc    Increment hotel views
// @route   POST /api/hotels/:id/view
// @access  Public
const incrementHotelViews = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Increment views using the model method
  await hotel.incrementViews();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Views incremented successfully"));
});

// @desc    Update hotel room availability
// @route   PATCH /api/hotels/:id/rooms
// @access  Private/Admin
const updateHotelRooms = asyncHandler(async (req, res) => {
  const { totalRooms, availableRooms, roomTypes } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Update room information
  if (totalRooms !== undefined) hotel.rooms.totalRooms = parseInt(totalRooms);
  if (availableRooms !== undefined)
    hotel.rooms.availableRooms = parseInt(availableRooms);
  if (roomTypes !== undefined) {
    hotel.rooms.roomTypes = parseField(roomTypes) || [];
  }

  hotel.updatedBy = req.user._id;
  hotel.updatedAt = Date.now();
  await hotel.save();

  await hotel.populate("updatedBy", "firstName lastName email");

  return res
    .status(200)
    .json(new ApiResponse(200, hotel, "Hotel rooms updated successfully"));
});

// @desc    Delete hotel image
// @route   DELETE /api/hotels/:id/images/:imageId
// @access  Private/Admin
const deleteHotelImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const hotel = await Hotel.findById(id);
  if (!hotel) {
    throw new ApiError(404, "Hotel not found");
  }

  // Check if user is the creator or admin
  if (
    hotel.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "Not authorized to delete this hotel image");
  }

  // Find the image to delete
  const imageIndex = hotel.images.findIndex(
    (img) => img._id.toString() === imageId
  );

  if (imageIndex === -1) {
    throw new ApiError(404, "Image not found");
  }

  const imageToDelete = hotel.images[imageIndex];

  // Delete from Cloudinary if publicId exists
  if (imageToDelete.publicId) {
    try {
      const { deleteFromCloudinary } = await import("../utils/cloudinary.js");
      await deleteFromCloudinary(imageToDelete.publicId);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      // Continue with database deletion even if Cloudinary deletion fails
    }
  }

  // Remove image from hotel
  hotel.images.splice(imageIndex, 1);
  await hotel.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Image deleted successfully"));
});

export {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel,
  updateHotelStatus,
  toggleHotelActive,
  toggleHotelFeatured,
  toggleHotelVerified,
  getActiveHotels,
  getFeaturedHotels,
  searchHotels,
  getHotelsByLocation,
  getNearbyHotels,
  getHotelStats,
  addHotelReview,
  updateHotelReview,
  removeHotelReview,
  incrementHotelViews,
  updateHotelRooms,
  deleteHotelImage,
};
