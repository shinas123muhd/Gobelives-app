import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get all users with filtering, sorting, and pagination
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    role,
    isActive,
    tier,
    search,
  } = req.query;

  // Build filter object
  const filter = {};

  // Only add filters if they have actual values (not empty strings)
  if (role && role.trim() !== "") {
    filter.role = role;
  } else {
    // Exclude admin and super_admin from default list
    filter.role = { $nin: ["admin", "super_admin"] };
  }

  if (isActive && isActive.trim() !== "") filter.isActive = isActive === "true";
  if (tier && tier.trim() !== "") filter["rewards.tier"] = tier;

  // Search by name or email
  if (search && search.trim() !== "") {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // Set up sorting
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Get users with filtering, sorting, and pagination
  const users = await User.find(filter)
    .select("-password -emailVerificationToken -passwordResetToken")
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await User.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Users retrieved successfully"
    )
  );
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password -emailVerificationToken -passwordResetToken")
    .populate("bookings", "bookingReference checkIn checkOut status pricing")
    .populate("favoriteProperties", "name location price images")
    .populate("referredBy", "firstName lastName email");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});

// @desc    Get current user profile
// @route   GET /api/users/profile/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -emailVerificationToken -passwordResetToken")
    .populate("bookings", "bookingReference checkIn checkOut status pricing")
    .populate("favoriteProperties", "name location price images");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile retrieved successfully"));
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private/Admin or Own Profile
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if user is authorized (admin or own profile)
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to update this user");
  }

  // Fields that can be updated
  const allowedUpdates = [
    "firstName",
    "lastName",
    "phone",
    "avatar",
    "preferences",
    "addresses",
  ];

  // Admin can update role and isActive
  if (req.user.role === "admin" || req.user.role === "super_admin") {
    allowedUpdates.push("role", "isActive", "isEmailVerified");
  }

  // Update only allowed fields
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  await user.save();

  // Remove sensitive data
  user.password = undefined;
  user.emailVerificationToken = undefined;
  user.passwordResetToken = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deletion of super admin
  if (user.role === "super_admin") {
    throw new ApiError(400, "Cannot delete super admin account");
  }

  await User.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $facet: {
        totalUsers: [{ $count: "count" }],
        activeUsers: [{ $match: { isActive: true } }, { $count: "count" }],
        inactiveUsers: [{ $match: { isActive: false } }, { $count: "count" }],
        usersByRole: [
          { $group: { _id: "$role", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        usersByTier: [
          { $group: { _id: "$rewards.tier", count: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ],
        verifiedUsers: [
          { $match: { isEmailVerified: true } },
          { $count: "count" },
        ],
        unverifiedUsers: [
          { $match: { isEmailVerified: false } },
          { $count: "count" },
        ],
        recentUsers: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              email: 1,
              createdAt: 1,
              role: 1,
            },
          },
        ],
        topSpenders: [
          { $sort: { totalSpent: -1 } },
          { $limit: 10 },
          {
            $project: {
              firstName: 1,
              lastName: 1,
              email: 1,
              totalSpent: 1,
              totalBookings: 1,
            },
          },
        ],
      },
    },
  ]);

  const formattedStats = {
    totalUsers: stats[0].totalUsers[0]?.count || 0,
    activeUsers: stats[0].activeUsers[0]?.count || 0,
    inactiveUsers: stats[0].inactiveUsers[0]?.count || 0,
    verifiedUsers: stats[0].verifiedUsers[0]?.count || 0,
    unverifiedUsers: stats[0].unverifiedUsers[0]?.count || 0,
    usersByRole: stats[0].usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    usersByTier: stats[0].usersByTier.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentUsers: stats[0].recentUsers,
    topSpenders: stats[0].topSpenders,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formattedStats,
        "User statistics retrieved successfully"
      )
    );
});

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin", "super_admin"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Only super_admin can create other super_admins
  if (role === "super_admin" && req.user.role !== "super_admin") {
    throw new ApiError(403, "Only super admin can assign super admin role");
  }

  user.role = role;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

// @desc    Toggle user active status
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Prevent deactivating super admin
  if (user.role === "super_admin") {
    throw new ApiError(400, "Cannot deactivate super admin account");
  }

  user.isActive = !user.isActive;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        `User ${user.isActive ? "activated" : "deactivated"} successfully`
      )
    );
});

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private/Admin or Own Profile
const getUserBookings = asyncHandler(async (req, res) => {
  // Check if user is authorized
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to view this user's bookings");
  }

  const { page = 1, limit = 10, status } = req.query;

  const filter = { user: req.params.id };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(filter)
    .populate("hotel", "name location phone")
    .populate("package", "title location price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Booking.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "User bookings retrieved successfully"
    )
  );
});

// @desc    Get user rewards history
// @route   GET /api/users/:id/rewards
// @access  Private/Admin or Own Profile
const getUserRewards = asyncHandler(async (req, res) => {
  // Check if user is authorized
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to view this user's rewards");
  }

  const user = await User.findById(req.params.id)
    .select("rewards firstName lastName email")
    .populate(
      "rewards.pointsHistory.bookingRef",
      "bookingReference checkIn checkOut"
    );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.rewards, "User rewards retrieved successfully")
    );
});

// @desc    Add points to user (Admin only)
// @route   POST /api/users/:id/points
// @access  Private/Admin
const addPointsToUser = asyncHandler(async (req, res) => {
  const { points, reason } = req.body;

  if (!points || points <= 0) {
    throw new ApiError(400, "Points must be a positive number");
  }

  if (!reason) {
    throw new ApiError(400, "Reason is required");
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.addPoints(points, reason);

  return res
    .status(200)
    .json(new ApiResponse(200, user.rewards, "Points added successfully"));
});

// @desc    Bulk update users
// @route   PATCH /api/users/bulk-update
// @access  Private/Admin
const bulkUpdateUsers = asyncHandler(async (req, res) => {
  const { userIds, updates } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new ApiError(400, "User IDs array is required");
  }

  if (!updates || typeof updates !== "object") {
    throw new ApiError(400, "Updates object is required");
  }

  // Only allow specific fields to be bulk updated
  const allowedFields = ["isActive", "role"];
  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  if (Object.keys(filteredUpdates).length === 0) {
    throw new ApiError(400, "No valid update fields provided");
  }

  const result = await User.updateMany(
    { _id: { $in: userIds } },
    { $set: filteredUpdates }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        `${result.modifiedCount} users updated successfully`
      )
    );
});

// @desc    Search users by referral code
// @route   GET /api/users/referral/:code
// @access  Public
const getUserByReferralCode = asyncHandler(async (req, res) => {
  const user = await User.findByReferralCode(req.params.code).select(
    "firstName lastName referralCode rewards.tier"
  );

  if (!user) {
    throw new ApiError(404, "Invalid referral code");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found with referral code"));
});

// @desc    Get user's referrals
// @route   GET /api/users/:id/referrals
// @access  Private/Admin or Own Profile
const getUserReferrals = asyncHandler(async (req, res) => {
  // Check if user is authorized
  if (
    req.user._id.toString() !== req.params.id &&
    req.user.role !== "admin" &&
    req.user.role !== "super_admin"
  ) {
    throw new ApiError(403, "Not authorized to view this user's referrals");
  }

  const referrals = await User.find({ referredBy: req.params.id })
    .select(
      "firstName lastName email membershipSince totalBookings rewards.tier"
    )
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, referrals, "User referrals retrieved successfully")
    );
});

export {
  getUsers,
  getUser,
  getMyProfile,
  updateUser,
  deleteUser,
  getUserStats,
  updateUserRole,
  toggleUserStatus,
  getUserBookings,
  getUserRewards,
  addPointsToUser,
  bulkUpdateUsers,
  getUserByReferralCode,
  getUserReferrals,
};
