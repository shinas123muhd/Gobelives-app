import axios from "../lib/axios";

const hotelApi = {
  // Get all hotels with filtering and pagination
  getHotels: async (params = {}) => {
    const response = await axios.get("/api/hotels", { params });
    return response.data;
  },

  // Get single hotel by ID
  getHotel: async (id) => {
    const response = await axios.get(`/api/hotels/${id}`);
    return response.data;
  },

  // Create new hotel
  createHotel: async (formData) => {
    const response = await axios.post("/api/hotels", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds timeout for file uploads
    });
    return response.data;
  },

  // Update hotel
  updateHotel: async (id, formData) => {
    const response = await axios.put(`/api/hotels/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds timeout for file uploads
    });
    return response.data;
  },

  // Delete hotel
  deleteHotel: async (id) => {
    const response = await axios.delete(`/api/hotels/${id}`);
    return response.data;
  },

  // Update hotel status
  updateHotelStatus: async (id, status) => {
    const response = await axios.patch(`/api/hotels/${id}/status`, { status });
    return response.data;
  },

  // Toggle hotel active status
  toggleHotelActive: async (id) => {
    const response = await axios.patch(`/api/hotels/${id}/active`);
    return response.data;
  },

  // Toggle hotel featured status
  toggleHotelFeatured: async (id) => {
    const response = await axios.patch(`/api/hotels/${id}/featured`);
    return response.data;
  },

  // Toggle hotel verified status
  toggleHotelVerified: async (id) => {
    const response = await axios.patch(`/api/hotels/${id}/verify`);
    return response.data;
  },

  // Get active hotels (public)
  getActiveHotels: async (params = {}) => {
    const response = await axios.get("/api/hotels/active", { params });
    return response.data;
  },

  // Get featured hotels (public)
  getFeaturedHotels: async () => {
    const response = await axios.get("/api/hotels/featured");
    return response.data;
  },

  // Search hotels (public)
  searchHotels: async (searchTerm, options = {}) => {
    const response = await axios.get("/api/hotels/search", {
      params: { q: searchTerm, ...options },
    });
    return response.data;
  },

  // Get hotels by location (public)
  getHotelsByLocation: async (location, options = {}) => {
    const response = await axios.get(`/api/hotels/location/${location}`, {
      params: options,
    });
    return response.data;
  },

  // Get nearby hotels (public)
  getNearbyHotels: async (params) => {
    const response = await axios.get("/api/hotels/nearby", { params });
    return response.data;
  },

  // Get hotel statistics
  getHotelStats: async () => {
    const response = await axios.get("/api/hotels/stats");
    return response.data;
  },

  // Add hotel review
  addHotelReview: async (id, data) => {
    const response = await axios.post(`/api/hotels/${id}/reviews`, data);
    return response.data;
  },

  // Update hotel review
  updateHotelReview: async (id, data) => {
    const response = await axios.put(`/api/hotels/${id}/reviews`, data);
    return response.data;
  },

  // Remove hotel review
  removeHotelReview: async (id) => {
    const response = await axios.delete(`/api/hotels/${id}/reviews`);
    return response.data;
  },

  // Increment hotel views
  incrementHotelViews: async (id) => {
    const response = await axios.post(`/api/hotels/${id}/view`);
    return response.data;
  },

  // Update hotel rooms
  updateHotelRooms: async (id, data) => {
    const response = await axios.patch(`/api/hotels/${id}/rooms`, data);
    return response.data;
  },

  // Delete hotel image
  deleteHotelImage: async (id, imageId) => {
    const response = await axios.delete(`/api/hotels/${id}/images/${imageId}`);
    return response.data;
  },
};

export { hotelApi };
