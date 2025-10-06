import api from "../lib/axios";

export const userApi = {
  // ==================== User Management ====================

  /**
   * Get all users with filtering, sorting, and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   * @param {string} params.role - Filter by role
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.tier - Filter by rewards tier
   * @param {string} params.search - Search query
   * @returns {Promise}
   */
  getUsers: async (params = {}) => {
    const response = await api.get("/api/users", { params });
    return response.data;
  },

  /**
   * Get single user by ID
   * @param {string} id - User ID
   * @returns {Promise}
   */
  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },

  /**
   * Get current user's profile
   * @returns {Promise}
   */
  getMyProfile: async () => {
    const response = await api.get("/api/users/profile/me");
    return response.data;
  },

  /**
   * Update user profile
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise}
   */
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise}
   */
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },

  // ==================== Statistics & Analytics ====================

  /**
   * Get user statistics
   * @returns {Promise}
   */
  getUserStats: async () => {
    const response = await api.get("/api/users/stats");
    return response.data;
  },

  // ==================== Role & Status Management ====================

  /**
   * Update user role
   * @param {string} id - User ID
   * @param {string} role - New role (user/admin/super_admin)
   * @returns {Promise}
   */
  updateUserRole: async (id, role) => {
    const response = await api.patch(`/api/users/${id}/role`, { role });
    return response.data;
  },

  /**
   * Toggle user active status
   * @param {string} id - User ID
   * @returns {Promise}
   */
  toggleUserStatus: async (id) => {
    const response = await api.patch(`/api/users/${id}/toggle-status`);
    return response.data;
  },

  // ==================== Bookings & Rewards ====================

  /**
   * Get user bookings
   * @param {string} id - User ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise}
   */
  getUserBookings: async (id, params = {}) => {
    const response = await api.get(`/api/users/${id}/bookings`, { params });
    return response.data;
  },

  /**
   * Get user rewards history
   * @param {string} id - User ID
   * @returns {Promise}
   */
  getUserRewards: async (id) => {
    const response = await api.get(`/api/users/${id}/rewards`);
    return response.data;
  },

  /**
   * Add points to user (Admin only)
   * @param {string} id - User ID
   * @param {number} points - Points to add
   * @param {string} reason - Reason for adding points
   * @returns {Promise}
   */
  addPointsToUser: async (id, points, reason) => {
    const response = await api.post(`/api/users/${id}/points`, {
      points,
      reason,
    });
    return response.data;
  },

  // ==================== Referral System ====================

  /**
   * Get user by referral code
   * @param {string} code - Referral code
   * @returns {Promise}
   */
  getUserByReferralCode: async (code) => {
    const response = await api.get(`/api/users/referral/${code}`);
    return response.data;
  },

  /**
   * Get user's referrals
   * @param {string} id - User ID
   * @returns {Promise}
   */
  getUserReferrals: async (id) => {
    const response = await api.get(`/api/users/${id}/referrals`);
    return response.data;
  },

  // ==================== Bulk Operations ====================

  /**
   * Bulk update users
   * @param {Array<string>} userIds - Array of user IDs
   * @param {Object} updates - Updates to apply
   * @returns {Promise}
   */
  bulkUpdateUsers: async (userIds, updates) => {
    const response = await api.patch("/api/users/bulk-update", {
      userIds,
      updates,
    });
    return response.data;
  },
};

export default userApi;
