import api from "../lib/axios";

// Category API service functions
export const categoryApi = {
  // Get all categories with filtering and pagination
  getCategories: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      status,
      featured,
      isActive,
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
    if (featured !== undefined)
      queryParams.append("featured", featured.toString());
    if (isActive !== undefined)
      queryParams.append("isActive", isActive.toString());

    const response = await api.get(`/api/categories?${queryParams.toString()}`);
    return response.data;
  },

  // Get single category by ID
  getCategory: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (formData) => {
    const response = await api.post("/api/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update category
  updateCategory: async (id, formData) => {
    const response = await api.put(`/api/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // Update category status
  updateCategoryStatus: async (id, status) => {
    const response = await api.patch(`/api/categories/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Toggle category status
  toggleCategoryStatus: async (id) => {
    const response = await api.patch(`/api/categories/${id}/toggle-status`);
    return response.data;
  },

  // Toggle featured status
  toggleFeaturedCategory: async (id) => {
    const response = await api.patch(`/api/categories/${id}/featured`);
    return response.data;
  },

  // Get active categories (public)
  getActiveCategories: async () => {
    const response = await api.get("/api/categories/active");
    return response.data;
  },

  // Get featured categories (public)
  getFeaturedCategories: async () => {
    const response = await api.get("/api/categories/featured");
    return response.data;
  },

  // Get category hierarchy (public)
  getCategoryHierarchy: async () => {
    const response = await api.get("/api/categories/hierarchy");
    return response.data;
  },

  // Search categories (public)
  searchCategories: async (searchTerm, options = {}) => {
    const queryParams = new URLSearchParams({
      q: searchTerm,
    });

    // Add optional parameters
    if (options.status) queryParams.append("status", options.status);
    if (options.featured !== undefined)
      queryParams.append("featured", options.featured.toString());

    const response = await api.get(
      `/api/categories/search?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async () => {
    const response = await api.get("/api/categories/stats");
    return response.data;
  },

  // Update category package count
  updateCategoryPackageCount: async (id) => {
    const response = await api.patch(
      `/api/categories/${id}/update-package-count`
    );
    return response.data;
  },

  // Bulk update category status
  bulkUpdateCategoryStatus: async (categoryIds, status) => {
    const response = await api.patch("/api/categories/bulk-status", {
      categoryIds,
      status,
    });
    return response.data;
  },
};
