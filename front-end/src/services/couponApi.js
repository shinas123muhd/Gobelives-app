import api from "../lib/axios";

// Coupon API service functions
export const couponApi = {
  // Get all coupons with filtering and pagination
  getCoupons: async (params = {}) => {
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
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    // Add optional parameters
    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (eligibility) queryParams.append("eligibility", eligibility);
    if (isActive !== undefined)
      queryParams.append("isActive", isActive.toString());
    if (isFeatured !== undefined)
      queryParams.append("isFeatured", isFeatured.toString());
    if (createdBy) queryParams.append("createdBy", createdBy);
    if (expiryDateFrom) queryParams.append("expiryDateFrom", expiryDateFrom);
    if (expiryDateTo) queryParams.append("expiryDateTo", expiryDateTo);

    const response = await api.get(`/api/coupons?${queryParams.toString()}`);
    return response.data;
  },

  // Get single coupon by ID
  getCoupon: async (id) => {
    const response = await api.get(`/api/coupons/${id}`);
    return response.data;
  },

  // Create new coupon
  createCoupon: async (couponData) => {
    const response = await api.post("/api/coupons", couponData);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/api/coupons/${id}`, couponData);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    const response = await api.delete(`/api/coupons/${id}`);
    return response.data;
  },

  // Update coupon status
  updateCouponStatus: async (id, status) => {
    const response = await api.patch(`/api/coupons/${id}/status`, { status });
    return response.data;
  },

  // Toggle coupon active status
  toggleCouponActive: async (id) => {
    const response = await api.patch(`/api/coupons/${id}/active`);
    return response.data;
  },

  // Toggle coupon featured status
  toggleCouponFeatured: async (id) => {
    const response = await api.patch(`/api/coupons/${id}/featured`);
    return response.data;
  },

  // Get active coupons (public)
  getActiveCoupons: async (params = {}) => {
    const { eligibility, packageId } = params;

    const queryParams = new URLSearchParams();
    if (eligibility) queryParams.append("eligibility", eligibility);
    if (packageId) queryParams.append("packageId", packageId);

    const response = await api.get(
      `/api/coupons/active?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get coupon by code (public)
  getCouponByCode: async (code, params = {}) => {
    const { packageId, userId, orderAmount } = params;

    const queryParams = new URLSearchParams();
    if (packageId) queryParams.append("packageId", packageId);
    if (userId) queryParams.append("userId", userId);
    if (orderAmount) queryParams.append("orderAmount", orderAmount);

    const response = await api.get(
      `/api/coupons/code/${code}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get coupons for package (public)
  getCouponsForPackage: async (packageId, params = {}) => {
    const { userId, orderAmount } = params;

    const queryParams = new URLSearchParams();
    if (userId) queryParams.append("userId", userId);
    if (orderAmount) queryParams.append("orderAmount", orderAmount);

    const response = await api.get(
      `/api/coupons/package/${packageId}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Search coupons (public)
  searchCoupons: async (searchTerm, options = {}) => {
    const queryParams = new URLSearchParams({ q: searchTerm });

    // Add optional filters
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await api.get(
      `/api/coupons/search?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get coupon statistics
  getCouponStats: async () => {
    const response = await api.get("/api/coupons/stats");
    return response.data;
  },

  // Get expiring coupons
  getExpiringCoupons: async (days = 7) => {
    const response = await api.get(`/api/coupons/expiring?days=${days}`);
    return response.data;
  },

  // Use coupon
  useCoupon: async (id, { packageId, orderAmount }) => {
    const response = await api.post(`/api/coupons/${id}/use`, {
      packageId,
      orderAmount,
    });
    return response.data;
  },

  // Validate coupon
  validateCoupon: async (id, { packageId, orderAmount }) => {
    const response = await api.post(`/api/coupons/${id}/validate`, {
      packageId,
      orderAmount,
    });
    return response.data;
  },
};
