import Review from "../models/Review.model.js";
import Booking from "../models/Booking.model.js";
import Property from "../models/Property.model.js";
import Package from "../models/Package.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Check if user can review a booking
// @route   GET /api/reviews/can-review/:bookingId
// @access  Private
const checkReviewEligibility = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const eligibility = await Review.canUserReview(req.user._id, bookingId);

  if (!eligibility.canReview) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          canReview: false,
          reason: eligibility.reason,
        },
        "User cannot review this booking"
      )
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        canReview: true,
        booking: eligibility.booking,
      },
      "User can review this booking"
    )
  );
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { bookingId, title, content, rating, images } = req.body;

  // Validation
  if (!bookingId || !content || !rating) {
    throw new ApiError(400, "Please provide booking ID, content, and rating");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // Check if user can review this booking
  const eligibility = await Review.canUserReview(req.user._id, bookingId);

  if (!eligibility.canReview) {
    throw new ApiError(403, eligibility.reason);
  }

  const booking = eligibility.booking;

  // Handle image uploads if provided
  let reviewImages = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadOnCloudinary(file, "reviews")
    );
    const uploadResults = await Promise.all(uploadPromises);
    reviewImages = uploadResults.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      altText: result.original_filename || "Review image",
    }));
  }

  // Determine if it's a property or package review
  const reviewData = {
    author: req.user._id,
    booking: bookingId,
    title,
    content,
    rating: parseInt(rating),
    images: reviewImages,
    isVerified: true,
    status: "active",
  };

  if (booking.property) {
    reviewData.property = booking.property;
  } else if (booking.package) {
    reviewData.package = booking.package;
  }

  // Create the review
  const review = await Review.create(reviewData);

  // Update booking to mark it as reviewed
  booking.hasReview = true;
  booking.review = review._id;
  await booking.save();

  // Update property/package ratings
  if (booking.property) {
    const property = await Property.findById(booking.property);
    if (property) {
      await property.updateRatings(parseInt(rating));
    }
  } else if (booking.package) {
    const packageData = await Package.findById(booking.package);
    if (packageData) {
      await packageData.updateRatings(parseInt(rating));
    }
  }

  // Populate author details
  await review.populate("author", "firstName lastName avatar email");

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    rating,
  } = req.query;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Build filter
  const filter = {
    property: propertyId,
    status: "active",
  };

  if (rating) {
    filter.rating = parseInt(rating);
  }

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
  const ratingStats = await Review.getAverageRatingForProperty(propertyId);

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

// @desc    Get reviews for a package
// @route   GET /api/reviews/package/:packageId
// @access  Public
const getPackageReviews = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    rating,
  } = req.query;

  // Check if package exists
  const packageData = await Package.findById(packageId);
  if (!packageData) {
    throw new ApiError(404, "Package not found");
  }

  // Build filter
  const filter = {
    package: packageId,
    status: "active",
  };

  if (rating) {
    filter.rating = parseInt(rating);
  }

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
  const ratingStats = await Review.getAverageRatingForPackage(packageId);

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

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate("author", "firstName lastName avatar email")
    .populate("property", "title coverImage location")
    .populate("package", "title coverImage location")
    .populate("booking", "bookingReference status")
    .populate("response.respondedBy", "firstName lastName");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review retrieved successfully"));
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check if user is the author
  if (review.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this review");
  }

  const { title, content, rating } = req.body;

  // Update fields
  if (title !== undefined) review.title = title;
  if (content !== undefined) review.content = content;
  if (rating !== undefined) {
    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // Update property/package ratings if rating changed
    const oldRating = review.rating;
    if (oldRating !== rating) {
      if (review.property) {
        const property = await Property.findById(review.property);
        if (property) {
          // Adjust ratings
          property.ratings.count -= 1;
          property.ratings.breakdown[oldRating] -= 1;
          await property.updateRatings(rating);
        }
      } else if (review.package) {
        const packageData = await Package.findById(review.package);
        if (packageData) {
          // Adjust ratings
          packageData.ratings.count -= 1;
          packageData.ratings.breakdown[oldRating] -= 1;
          await packageData.updateRatings(rating);
        }
      }
    }

    review.rating = rating;
  }

  review.isEdited = true;
  review.editedAt = new Date();

  await review.save();
  await review.populate("author", "firstName lastName avatar email");

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check if user is the author or admin
  if (
    review.author.toString() !== req.user._id.toString() &&
    !["admin", "super_admin"].includes(req.user.role)
  ) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  // Update property/package ratings
  if (review.property) {
    const property = await Property.findById(review.property);
    if (property) {
      property.ratings.count -= 1;
      property.ratings.breakdown[review.rating] -= 1;

      // Recalculate average
      const total = Object.entries(property.ratings.breakdown).reduce(
        (sum, [rating, count]) => sum + parseInt(rating) * count,
        0
      );
      property.ratings.average =
        property.ratings.count > 0 ? total / property.ratings.count : 0;

      await property.save();
    }
  } else if (review.package) {
    const packageData = await Package.findById(review.package);
    if (packageData) {
      packageData.ratings.count -= 1;
      packageData.ratings.breakdown[review.rating] -= 1;

      // Recalculate average
      const total = Object.entries(packageData.ratings.breakdown).reduce(
        (sum, [rating, count]) => sum + parseInt(rating) * count,
        0
      );
      packageData.ratings.average =
        packageData.ratings.count > 0 ? total / packageData.ratings.count : 0;

      await packageData.save();
    }
  }

  // Update booking
  if (review.booking) {
    const booking = await Booking.findById(review.booking);
    if (booking) {
      booking.hasReview = false;
      booking.review = null;
      await booking.save();
    }
  }

  await Review.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markReviewAsHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await review.markAsHelpful(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review marked as helpful"));
});

// @desc    Unmark review as helpful
// @route   DELETE /api/reviews/:id/helpful
// @access  Private
const unmarkReviewAsHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await review.unmarkAsHelpful(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review unmarked as helpful"));
});

// @desc    Add admin response to review
// @route   POST /api/reviews/:id/response
// @access  Private/Admin
const addAdminResponse = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Response content is required");
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await review.addResponse(content, req.user._id);
  await review.populate("response.respondedBy", "firstName lastName");

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Admin response added successfully"));
});

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
    rating,
    search,
  } = req.query;

  // Build filter
  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (rating) {
    filter.rating = parseInt(rating);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get reviews
  const reviews = await Review.find(filter)
    .populate("author", "firstName lastName avatar email")
    .populate("property", "title coverImage")
    .populate("package", "title coverImage")
    .populate("booking", "bookingReference status")
    .populate("response.respondedBy", "firstName lastName")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Review.countDocuments(filter);

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
      },
      "Reviews retrieved successfully"
    )
  );
});

// @desc    Update review status (Admin)
// @route   PATCH /api/admin/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["active", "pending", "flagged", "removed"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate("author", "firstName lastName avatar email")
    .populate("property", "title coverImage")
    .populate("package", "title coverImage");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review status updated successfully"));
});

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get user's reviews
  const reviews = await Review.find({ author: req.user._id })
    .populate("property", "title coverImage location")
    .populate("package", "title coverImage location")
    .populate("booking", "bookingReference status checkIn checkOut")
    .populate("response.respondedBy", "firstName lastName")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Review.countDocuments({ author: req.user._id });

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
      },
      "Your reviews retrieved successfully"
    )
  );
});

export {
  checkReviewEligibility,
  createReview,
  getPropertyReviews,
  getPackageReviews,
  getReview,
  updateReview,
  deleteReview,
  markReviewAsHelpful,
  unmarkReviewAsHelpful,
  addAdminResponse,
  getAllReviews,
  updateReviewStatus,
  getMyReviews,
};
