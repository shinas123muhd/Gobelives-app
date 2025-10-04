import api from "../lib/axios";

// Gallery API service functions
export const galleryApi = {
  // Get all images with filters
  getImages: async (params = {}) => {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      featured,
      tag,
      category,
      visibility,
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
    if (featured !== undefined && featured !== "" && featured !== null)
      queryParams.append("featured", featured.toString());
    if (tag) queryParams.append("tag", tag);
    if (category) queryParams.append("category", category);
    if (visibility) queryParams.append("visibility", visibility);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const response = await api.get(`/api/gallery?${queryParams.toString()}`);
    return response.data;
  },

  // Get single image by ID
  getImage: async (id) => {
    const response = await api.get(`/api/gallery/${id}`);
    return response.data;
  },

  // Get image by slug
  getImageBySlug: async (slug) => {
    const response = await api.get(`/api/gallery/slug/${slug}`);
    return response.data;
  },

  // Get featured images
  getFeaturedImages: async (limit = 10) => {
    const response = await api.get(`/api/gallery/featured?limit=${limit}`);
    return response.data;
  },

  // Get popular images
  getPopularImages: async (limit = 10, days = 30) => {
    const response = await api.get(
      `/api/gallery/popular?limit=${limit}&days=${days}`
    );
    return response.data;
  },

  // Get recent images
  getRecentImages: async (limit = 10) => {
    const response = await api.get(`/api/gallery/recent?limit=${limit}`);
    return response.data;
  },

  // Search images
  searchImages: async (query, page = 1, limit = 20) => {
    const response = await api.get(
      `/api/gallery/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get gallery statistics (admin only)
  getGalleryStats: async () => {
    const response = await api.get("/api/gallery/admin/stats");
    return response.data;
  },

  // Upload new image (admin only)
  uploadImage: async (formData) => {
    // FormData is already created in the component, just send it
    const response = await api.post("/api/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update image (admin only)
  updateImage: async (id, formData) => {
    const response = await api.put(`/api/gallery/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete image - soft delete (admin only)
  deleteImage: async (id) => {
    const response = await api.delete(`/api/gallery/${id}`);
    return response.data;
  },

  // Permanently delete image (admin only)
  permanentDeleteImage: async (id) => {
    const response = await api.delete(`/api/gallery/${id}/permanent`);
    return response.data;
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id) => {
    const response = await api.patch(`/api/gallery/${id}/featured`);
    return response.data;
  },

  // Track download
  trackDownload: async (id) => {
    const response = await api.post(`/api/gallery/${id}/download`);
    return response.data;
  },

  // Bulk delete images (admin only)
  bulkDeleteImages: async (imageIds, permanent = false) => {
    const response = await api.post("/api/gallery/bulk-delete", {
      imageIds,
      permanent,
    });
    return response.data;
  },

  // Bulk toggle featured (admin only)
  bulkToggleFeatured: async (imageIds, featured) => {
    const response = await api.post("/api/gallery/bulk-featured", {
      imageIds,
      featured,
    });
    return response.data;
  },

  // Get images by tag
  getImagesByTag: async (tag, page = 1, limit = 20) => {
    const response = await api.get(
      `/api/gallery?tag=${tag}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get images by category
  getImagesByCategory: async (category, page = 1, limit = 20) => {
    const response = await api.get(
      `/api/gallery?category=${category}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get images by visibility
  getImagesByVisibility: async (visibility, page = 1, limit = 20) => {
    const response = await api.get(
      `/api/gallery?visibility=${visibility}&page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

export default galleryApi;
