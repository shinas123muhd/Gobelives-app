import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryApi } from "../../../services/galleryApi";

// Query keys for React Query
export const galleryKeys = {
  all: ["gallery"],
  lists: () => [...galleryKeys.all, "list"],
  list: (filters) => [...galleryKeys.lists(), { filters }],
  details: () => [...galleryKeys.all, "detail"],
  detail: (id) => [...galleryKeys.details(), id],
  featured: () => [...galleryKeys.all, "featured"],
  popular: () => [...galleryKeys.all, "popular"],
  recent: () => [...galleryKeys.all, "recent"],
  stats: () => [...galleryKeys.all, "stats"],
  search: (query) => [...galleryKeys.all, "search", query],
};

// Hook to get all images with filtering and pagination
export const useGallery = (params = {}) => {
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

  return useQuery({
    queryKey: galleryKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      featured,
      tag,
      category,
      visibility,
      dateFrom,
      dateTo,
    }),
    queryFn: () =>
      galleryApi.getImages({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        featured,
        tag,
        category,
        visibility,
        dateFrom,
        dateTo,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single image by ID
export const useImage = (id) => {
  return useQuery({
    queryKey: galleryKeys.detail(id),
    queryFn: () => galleryApi.getImage(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get image by slug
export const useImageBySlug = (slug) => {
  return useQuery({
    queryKey: [...galleryKeys.all, "slug", slug],
    queryFn: () => galleryApi.getImageBySlug(slug),
    enabled: !!slug, // Only run if slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get featured images
export const useFeaturedImages = (limit = 10) => {
  return useQuery({
    queryKey: [...galleryKeys.featured(), { limit }],
    queryFn: () => galleryApi.getFeaturedImages(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get popular images
export const usePopularImages = (limit = 10, days = 30) => {
  return useQuery({
    queryKey: [...galleryKeys.popular(), { limit, days }],
    queryFn: () => galleryApi.getPopularImages(limit, days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get recent images
export const useRecentImages = (limit = 10) => {
  return useQuery({
    queryKey: [...galleryKeys.recent(), { limit }],
    queryFn: () => galleryApi.getRecentImages(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search images
export const useSearchImages = (searchTerm, options = {}) => {
  const { page = 1, limit = 20 } = options;

  return useQuery({
    queryKey: [...galleryKeys.search(searchTerm), { page, limit }],
    queryFn: () => galleryApi.searchImages(searchTerm, page, limit),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get gallery statistics
export const useGalleryStats = () => {
  return useQuery({
    queryKey: galleryKeys.stats(),
    queryFn: galleryApi.getGalleryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for uploading a new image
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.uploadImage,
    onSuccess: (data) => {
      // Invalidate and refetch images list
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.recent() });

      // If featured, invalidate featured images
      if (data.data?.featured) {
        queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      }
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
    },
  });
};

// Hook for updating an image
export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => galleryApi.updateImage(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific image in cache
      queryClient.setQueryData(galleryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.recent() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.popular() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating image:", error);
    },
  });
};

// Hook for deleting an image (soft delete)
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.deleteImage,
    onSuccess: (data, id) => {
      // Remove the image from cache
      queryClient.removeQueries({ queryKey: galleryKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.recent() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.popular() });
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
    },
  });
};

// Hook for permanently deleting an image
export const usePermanentDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.permanentDeleteImage,
    onSuccess: (data, id) => {
      // Remove the image from cache
      queryClient.removeQueries({ queryKey: galleryKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.recent() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.popular() });
    },
    onError: (error) => {
      console.error("Error permanently deleting image:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleFeaturedImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.toggleFeatured,
    onSuccess: (data, id) => {
      // Update the specific image in cache
      queryClient.setQueryData(galleryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for tracking downloads
export const useTrackDownload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.trackDownload,
    onSuccess: (data, id) => {
      // Update the specific image in cache
      queryClient.setQueryData(galleryKeys.detail(id), data);

      // Invalidate popular images as download count changed
      queryClient.invalidateQueries({ queryKey: galleryKeys.popular() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error tracking download:", error);
    },
  });
};

// Hook for bulk delete images
export const useBulkDeleteImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageIds, permanent = false }) =>
      galleryApi.bulkDeleteImages(imageIds, permanent),
    onSuccess: () => {
      // Invalidate all gallery queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
    onError: (error) => {
      console.error("Error bulk deleting images:", error);
    },
  });
};

// Hook for bulk toggle featured
export const useBulkToggleFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageIds, featured }) =>
      galleryApi.bulkToggleFeatured(imageIds, featured),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error bulk toggling featured:", error);
    },
  });
};

// Hook for incrementing view count (client-side tracking)
export const useIncrementImageView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryApi.getImage, // The API already increments view count
    onSuccess: (data, id) => {
      // Update the specific image in cache
      queryClient.setQueryData(galleryKeys.detail(id), data);

      // Invalidate popular images as views changed
      queryClient.invalidateQueries({ queryKey: galleryKeys.popular() });
      queryClient.invalidateQueries({ queryKey: galleryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error incrementing view count:", error);
    },
  });
};

// Hook for prefetching image details (optimization)
export const usePrefetchImage = () => {
  const queryClient = useQueryClient();

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: galleryKeys.detail(id),
      queryFn: () => galleryApi.getImage(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Hook for optimistic updates
export const useOptimisticImageUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateImageOptimistically: (id, updates) => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: galleryKeys.detail(id) });

      // Snapshot the previous value
      const previousImage = queryClient.getQueryData(galleryKeys.detail(id));

      // Optimistically update to the new value
      if (previousImage) {
        queryClient.setQueryData(galleryKeys.detail(id), {
          ...previousImage,
          ...updates,
        });
      }

      // Return a context object with the snapshotted value
      return { previousImage };
    },
    rollbackImageUpdate: (id, context) => {
      if (context?.previousImage) {
        queryClient.setQueryData(galleryKeys.detail(id), context.previousImage);
      }
    },
  };
};
