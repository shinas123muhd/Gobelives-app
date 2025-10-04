import api from "../lib/axios";

// Blog API service functions
export const blogApi = {
  // Get all blogs with filters
  getBlogs: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      status,
      visibility,
      featured,
      tag,
      category,
      author,
      dateFrom,
      dateTo,
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
    if (visibility) queryParams.append("visibility", visibility);
    if (featured !== undefined)
      queryParams.append("featured", featured.toString());
    if (tag) queryParams.append("tag", tag);
    if (category) queryParams.append("category", category);
    if (author) queryParams.append("author", author);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const response = await api.get(`/api/blogs?${queryParams.toString()}`);
    return response.data;
  },

  // Get single blog by ID
  getBlog: async (id) => {
    const response = await api.get(`/api/blogs/${id}`);
    return response.data;
  },

  // Get blog by slug
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/api/blogs/slug/${slug}`);
    return response.data;
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 5) => {
    const response = await api.get(`/api/blogs/featured?limit=${limit}`);
    return response.data;
  },

  // Get popular blogs
  getPopularBlogs: async (limit = 10, days = 30) => {
    const response = await api.get(
      `/api/blogs/popular?limit=${limit}&days=${days}`
    );
    return response.data;
  },

  // Get recent blogs
  getRecentBlogs: async (limit = 10) => {
    const response = await api.get(`/api/blogs/recent?limit=${limit}`);
    return response.data;
  },

  // Get related blogs
  getRelatedBlogs: async (id, limit = 5) => {
    const response = await api.get(`/api/blogs/${id}/related?limit=${limit}`);
    return response.data;
  },

  // Search blogs
  searchBlogs: async (query, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get blog statistics (admin only)
  getBlogStats: async () => {
    const response = await api.get("/api/blogs/admin/stats");
    return response.data;
  },

  // Create new blog (admin only)
  createBlog: async (formData) => {
    // FormData is already created in the component, just send it
    const response = await api.post("/api/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update blog (admin only)
  updateBlog: async (id, formData) => {
    const response = await api.put(`/api/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }, // FormData is already created in the component, just send it

  // Delete blog - soft delete (admin only)
  deleteBlog: async (id) => {
    const response = await api.delete(`/api/blogs/${id}`);
    return response.data;
  },

  // Permanently delete blog (admin only)
  permanentDeleteBlog: async (id) => {
    const response = await api.delete(`/api/blogs/${id}/permanent`);
    return response.data;
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id) => {
    const response = await api.patch(`/api/blogs/${id}/featured`);
    return response.data;
  },

  // Bulk operations (for future use)
  bulkDeleteBlogs: async (blogIds) => {
    const promises = blogIds.map((id) => api.delete(`/api/blogs/${id}`));
    const results = await Promise.all(promises);
    return results.map((result) => result.data);
  },

  // Get blogs by tag
  getBlogsByTag: async (tag, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs?tag=${tag}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get blogs by category
  getBlogsByCategory: async (category, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs?category=${category}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get blogs by author
  getBlogsByAuthor: async (authorId, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs?author=${authorId}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get blogs by visibility
  getBlogsByVisibility: async (visibility, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs?visibility=${visibility}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get blogs by status
  getBlogsByStatus: async (status, page = 1, limit = 10) => {
    const response = await api.get(
      `/api/blogs?status=${status}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default blogApi;
