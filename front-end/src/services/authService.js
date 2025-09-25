import api from "../lib/axios";

// Auth API endpoints
export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get("/api/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to get profile" };
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await api.post("/api/auth/refresh");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Token refresh failed" };
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get("/api/auth/verify");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Token verification failed" };
    }
  },
};

export default authService;
