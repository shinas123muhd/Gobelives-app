import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};

// Send token response and set cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Set cookies
  res.cookie("token", token, options);
  res.cookie("refreshToken", refreshToken, {
    ...options,
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json(
    new ApiResponse(
      statusCode,
      {
        user,
        token,
        refreshToken,
      },
      "Authentication successful"
    )
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, agreeToTerms } =
    req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!agreeToTerms) {
    throw new ApiError(400, "You must agree to the Terms and Conditions");
  }

  if (password.length < 10) {
    throw new ApiError(400, "Password must be at least 10 characters long");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    phone,
    isEmailVerified: false, // Will be verified via email
  });

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = emailVerificationToken;
  await user.save();

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - My Dream Place",
      html: `
        <h2>Welcome to My Dream Place!</h2>
        <p>Please verify your email address to complete your registration.</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    // Don't throw error, just log it
  }

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Check for user
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if password matches
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, "Account has been deactivated");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide an email address");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not for security
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If the email exists, a reset link has been sent"
        )
      );
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (1 hour)
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;

  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request - My Dream Place",
      html: `
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because you requested a password reset for your My Dream Place account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This reset link will expire in 1 hour.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      `,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Password reset instructions sent to your email"
        )
      );
  } catch (error) {
    console.error("Email sending error:", error);

    // Reset the token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    throw new ApiError(500, "Email could not be sent");
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError(400, "Please provide reset token and new password");
  }

  if (password.length < 10) {
    throw new ApiError(400, "Password must be at least 10 characters long");
  }

  // Hash token to compare with stored token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Send confirmation email
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful - My Dream Place",
      html: `
        <h2>Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    // Don't throw error for failed notification email
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new ApiError(400, "Invalid verification token");
  }

  // Verify email
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  // Generate new verification token
  const emailVerificationToken = crypto.randomBytes(20).toString("hex");
  user.emailVerificationToken = emailVerificationToken;
  await user.save();

  // Send verification email
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email - My Dream Place",
      html: `
        <h2>Verify Your Email</h2>
        <p>Please verify your email address to complete your registration.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Verification email sent successfully"));
  } catch (error) {
    console.error("Email sending error:", error);
    throw new ApiError(500, "Email could not be sent");
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("bookings")
    .populate("favoriteProperties");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      phone,
      preferences: preferences ? JSON.parse(preferences) : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide current and new password");
  }

  if (newPassword.length < 10) {
    throw new ApiError(400, "New password must be at least 10 characters long");
  }

  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send notification email
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Changed - My Dream Place",
      html: `
        <h2>Password Changed Successfully</h2>
        <p>Your password has been updated successfully.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
      `,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    // Don't throw error for failed notification email
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Set cookies
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("token", newToken, options);
    res.cookie("refreshToken", newRefreshToken, {
      ...options,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          token: newToken,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      )
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

export {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
};
