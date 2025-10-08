import axios from "../lib/axios";

const reviewApi = {
  // Check if user can review a booking
  checkEligibility: async (bookingId) => {
    const response = await axios.get(`/api/reviews/can-review/${bookingId}`);
    return response.data;
  },

  // Create a new review
  createReview: async (data) => {
    const formData = new FormData();
    formData.append("bookingId", data.bookingId);
    formData.append("title", data.title || "");
    formData.append("content", data.content);
    formData.append("rating", data.rating);

    // Add images if provided
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.post("/api/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get property reviews
  getPropertyReviews: async (propertyId, params = {}) => {
    const response = await axios.get(`/api/reviews/property/${propertyId}`, {
      params,
    });
    return response.data;
  },

  // Get package reviews
  getPackageReviews: async (packageId, params = {}) => {
    const response = await axios.get(`/api/reviews/package/${packageId}`, {
      params,
    });
    return response.data;
  },

  // Get single review
  getReview: async (reviewId) => {
    const response = await axios.get(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Get user's own reviews
  getMyReviews: async (params = {}) => {
    const response = await axios.get("/api/reviews/user/my-reviews", {
      params,
    });
    return response.data;
  },

  // Update review
  updateReview: async (reviewId, data) => {
    const response = await axios.put(`/api/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Mark review as helpful
  markAsHelpful: async (reviewId) => {
    const response = await axios.post(`/api/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Unmark review as helpful
  unmarkAsHelpful: async (reviewId) => {
    const response = await axios.delete(`/api/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Admin: Get all reviews
  getAllReviews: async (params = {}) => {
    const response = await axios.get("/api/reviews/admin/all", { params });
    return response.data;
  },

  // Admin: Add response to review
  addAdminResponse: async (reviewId, content) => {
    const response = await axios.post(`/api/reviews/${reviewId}/response`, {
      content,
    });
    return response.data;
  },

  // Admin: Update review status
  updateReviewStatus: async (reviewId, status) => {
    const response = await axios.patch(`/api/reviews/${reviewId}/status`, {
      status,
    });
    return response.data;
  },
};

export { reviewApi };
