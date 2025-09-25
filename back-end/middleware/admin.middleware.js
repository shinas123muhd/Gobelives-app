// Check if user is admin middleware
export const adminMiddleware = (req, res, next) => {
  try {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route - User not authenticated",
      });
    }

 

    // Check if user has admin role
    if (!req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message:
          "Not authorized to access this route - Admin privileges required",
      });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in admin authorization",
    });
  }
};
