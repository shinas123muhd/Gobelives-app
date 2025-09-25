import api from "../lib/axios";

export const packageApi = {
  // Get all packages with filtering and pagination
  getPackages: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      status,
      category,
      featured,
      visibility,
      city,
      country,
      minPrice,
      maxPrice,
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortOrder", sortOrder);

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);
    if (category) queryParams.append("category", category);
    if (featured !== undefined) queryParams.append("featured", featured);
    if (visibility) queryParams.append("visibility", visibility);
    if (city) queryParams.append("city", city);
    if (country) queryParams.append("country", country);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);

    const response = await api.get(`/api/packages?${queryParams.toString()}`);
    return response.data;
  },

  // Get single package by ID
  getPackage: async (id) => {
    const response = await api.get(`/api/packages/${id}`);
    return response.data;
  },

  // Create new package
  createPackage: async (formData) => {
    const response = await api.post("/api/packages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update package
  updatePackage: async (id, formData) => {
    const response = await api.put(`/api/packages/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete package
  deletePackage: async (id) => {
    const response = await api.delete(`/api/packages/${id}`);
    return response.data;
  },

  // Delete specific image from package
  deletePackageImage: async (packageId, imageId) => {
    const response = await api.delete(
      `/api/packages/${packageId}/images/${imageId}`
    );
    return response.data;
  },

  // Update package status
  updatePackageStatus: async (id, status) => {
    const response = await api.patch(`/api/packages/${id}/status`, { status });
    return response.data;
  },

  // Toggle featured status
  toggleFeaturedPackage: async (id) => {
    const response = await api.patch(`/api/packages/${id}/featured`);
    return response.data;
  },

  // Get featured packages (public)
  getFeaturedPackages: async () => {
    const response = await api.get("/api/packages/featured");
    return response.data;
  },

  // Get packages by category (public)
  getPackagesByCategory: async (category, params = {}) => {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    const response = await api.get(
      `/api/packages/category/${category}?${queryParams.toString()}`
    );
    return response.data;
  },

  // Search packages (public)
  searchPackages: async (searchTerm, options = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append("q", searchTerm);

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const response = await api.get(
      `/api/packages/search?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get packages by location (public)
  getPackagesByLocation: async (params = {}) => {
    const { city, country, page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    if (city) queryParams.append("city", city);
    if (country) queryParams.append("country", country);

    const response = await api.get(
      `/api/packages/location?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get package statistics
  getPackageStats: async () => {
    const response = await api.get("/api/packages/stats");
    return response.data;
  },
};
