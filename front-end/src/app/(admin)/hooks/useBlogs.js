import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "../../../services/blogApi";

// Query keys for React Query
export const blogKeys = {
  all: ["blogs"],
  lists: () => [...blogKeys.all, "list"],
  list: (filters) => [...blogKeys.lists(), { filters }],
  details: () => [...blogKeys.all, "detail"],
  detail: (id) => [...blogKeys.details(), id],
  featured: () => [...blogKeys.all, "featured"],
  popular: () => [...blogKeys.all, "popular"],
  recent: () => [...blogKeys.all, "recent"],
  related: (id) => [...blogKeys.all, "related", id],
  stats: () => [...blogKeys.all, "stats"],
  search: (query) => [...blogKeys.all, "search", query],
};

// Hook to get all blogs with filtering and pagination
export const useBlogs = (params = {}) => {
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

  return useQuery({
    queryKey: blogKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      visibility,
      featured,
      tag,
      category,
      author,
      dateFrom,
      dateTo,
    }),
    queryFn: () =>
      blogApi.getBlogs({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        visibility,
        featured,
        tag,
        category,
        author,
        dateFrom,
        dateTo,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single blog by ID
export const useBlog = (id) => {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogApi.getBlog(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get blog by slug
export const useBlogBySlug = (slug) => {
  return useQuery({
    queryKey: [...blogKeys.all, "slug", slug],
    queryFn: () => blogApi.getBlogBySlug(slug),
    enabled: !!slug, // Only run if slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get featured blogs
export const useFeaturedBlogs = (limit = 5) => {
  return useQuery({
    queryKey: [...blogKeys.featured(), { limit }],
    queryFn: () => blogApi.getFeaturedBlogs(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get popular blogs
export const usePopularBlogs = (limit = 10, days = 30) => {
  return useQuery({
    queryKey: [...blogKeys.popular(), { limit, days }],
    queryFn: () => blogApi.getPopularBlogs(limit, days),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get recent blogs
export const useRecentBlogs = (limit = 10) => {
  return useQuery({
    queryKey: [...blogKeys.recent(), { limit }],
    queryFn: () => blogApi.getRecentBlogs(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get related blogs
export const useRelatedBlogs = (id, limit = 5) => {
  return useQuery({
    queryKey: [...blogKeys.related(id), { limit }],
    queryFn: () => blogApi.getRelatedBlogs(id, limit),
    enabled: !!id, // Only run if id is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search blogs
export const useSearchBlogs = (searchTerm, options = {}) => {
  const { page = 1, limit = 10 } = options;

  return useQuery({
    queryKey: [...blogKeys.search(searchTerm), { page, limit }],
    queryFn: () => blogApi.searchBlogs(searchTerm, page, limit),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get blog statistics
export const useBlogStats = () => {
  return useQuery({
    queryKey: blogKeys.stats(),
    queryFn: blogApi.getBlogStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: (data) => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
      queryClient.invalidateQueries({ queryKey: blogKeys.recent() });

      // If featured, invalidate featured blogs
      if (data.data?.featured) {
        queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      }
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
    },
  });
};

// Hook for updating a blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => blogApi.updateBlog(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific blog in cache
      queryClient.setQueryData(blogKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      queryClient.invalidateQueries({ queryKey: blogKeys.recent() });
      queryClient.invalidateQueries({ queryKey: blogKeys.popular() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });

      // Invalidate related blogs for this blog
      queryClient.invalidateQueries({ queryKey: blogKeys.related(id) });
    },
    onError: (error) => {
      console.error("Error updating blog:", error);
    },
  });
};

// Hook for deleting a blog (soft delete)
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: (data, id) => {
      // Remove the blog from cache
      queryClient.removeQueries({ queryKey: blogKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      queryClient.invalidateQueries({ queryKey: blogKeys.recent() });
      queryClient.invalidateQueries({ queryKey: blogKeys.popular() });
    },
    onError: (error) => {
      console.error("Error deleting blog:", error);
    },
  });
};

// Hook for permanently deleting a blog
export const usePermanentDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.permanentDeleteBlog,
    onSuccess: (data, id) => {
      // Remove the blog from cache
      queryClient.removeQueries({ queryKey: blogKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      queryClient.invalidateQueries({ queryKey: blogKeys.recent() });
      queryClient.invalidateQueries({ queryKey: blogKeys.popular() });
    },
    onError: (error) => {
      console.error("Error permanently deleting blog:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleFeaturedBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.toggleFeatured,
    onSuccess: (data, id) => {
      // Update the specific blog in cache
      queryClient.setQueryData(blogKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogKeys.featured() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for incrementing view count (client-side tracking)
export const useIncrementBlogView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.getBlog, // The API already increments view count
    onSuccess: (data, id) => {
      // Update the specific blog in cache
      queryClient.setQueryData(blogKeys.detail(id), data);

      // Invalidate popular blogs as views changed
      queryClient.invalidateQueries({ queryKey: blogKeys.popular() });
      queryClient.invalidateQueries({ queryKey: blogKeys.stats() });
    },
    onError: (error) => {
      console.error("Error incrementing view count:", error);
    },
  });
};

// Hook for bulk operations (if needed in the future)
export const useBulkDeleteBlogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogIds) => {
      // Delete multiple blogs
      const promises = blogIds.map((id) => blogApi.deleteBlog(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      // Invalidate all blog queries
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
    onError: (error) => {
      console.error("Error bulk deleting blogs:", error);
    },
  });
};

// Hook for prefetching blog details (optimization)
export const usePrefetchBlog = () => {
  const queryClient = useQueryClient();

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: blogKeys.detail(id),
      queryFn: () => blogApi.getBlog(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Hook for optimistic updates
export const useOptimisticBlogUpdate = () => {
  const queryClient = useQueryClient();

  return {
    updateBlogOptimistically: (id, updates) => {
      // Cancel any outgoing refetches
      queryClient.cancelQueries({ queryKey: blogKeys.detail(id) });

      // Snapshot the previous value
      const previousBlog = queryClient.getQueryData(blogKeys.detail(id));

      // Optimistically update to the new value
      if (previousBlog) {
        queryClient.setQueryData(blogKeys.detail(id), {
          ...previousBlog,
          ...updates,
        });
      }

      // Return a context object with the snapshotted value
      return { previousBlog };
    },
    rollbackBlogUpdate: (id, context) => {
      if (context?.previousBlog) {
        queryClient.setQueryData(blogKeys.detail(id), context.previousBlog);
      }
    },
  };
};
