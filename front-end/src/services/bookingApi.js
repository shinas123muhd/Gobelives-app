import api from "../lib/axios";

// Booking API service functions
export const bookingApi = {
  // Get all bookings with filtering, sorting, and pagination
  getBookings: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      bookingType,
      startDate,
      endDate,
      userId,
      search,
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    // Add optional parameters
    if (status) queryParams.append("status", status);
    if (bookingType) queryParams.append("bookingType", bookingType);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (userId) queryParams.append("userId", userId);
    if (search) queryParams.append("search", search);

    const response = await api.get(`/api/bookings?${queryParams.toString()}`);
    return response.data;
  },

  // Get single booking by ID
  getBooking: async (id) => {
    const response = await api.get(`/api/bookings/${id}`);
    return response.data;
  },

  // Get booking by reference number
  getBookingByReference: async (reference, email) => {
    const response = await api.get(
      `/api/bookings/reference/${reference}?email=${email}`
    );
    return response.data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post("/api/bookings", bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/api/bookings/${id}`, bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await api.post(`/api/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  // Confirm booking (admin only)
  confirmBooking: async (id) => {
    const response = await api.post(`/api/bookings/${id}/confirm`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id, status, reason) => {
    const response = await api.patch(`/api/bookings/${id}/status`, {
      status,
      reason,
    });
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (
    id,
    paymentStatus,
    transactionId,
    paidAmount,
    paymentMethod
  ) => {
    const response = await api.patch(`/api/bookings/${id}/payment`, {
      paymentStatus,
      transactionId,
      paidAmount,
      paymentMethod,
    });
    return response.data;
  },

  // Get user's bookings (my bookings)
  getMyBookings: async (type) => {
    const queryParams = type ? `?type=${type}` : "";
    const response = await api.get(
      `/api/bookings/user/my-bookings${queryParams}`
    );
    return response.data;
  },

  // Get booking statistics
  getBookingStats: async () => {
    const response = await api.get("/api/bookings/stats");
    return response.data;
  },

  // Delete booking (admin only)
  deleteBooking: async (id) => {
    const response = await api.delete(`/api/bookings/${id}`);
    return response.data;
  },

  // Bulk booking operations (admin only)
  bulkBookingOperations: async (operation, bookingIds, data) => {
    const response = await api.post("/api/bookings/bulk", {
      operation,
      bookingIds,
      data,
    });
    return response.data;
  },
};
