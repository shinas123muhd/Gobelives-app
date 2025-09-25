import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../../services/categoryApi";

// Query keys for React Query
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
  active: () => [...categoryKeys.all, "active"],
  featured: () => [...categoryKeys.all, "featured"],
  hierarchy: () => [...categoryKeys.all, "hierarchy"],
  stats: () => [...categoryKeys.all, "stats"],
};

// Hook to get all categories with filtering and pagination
export const useCategories = (params = {}) => {
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

  return useQuery({
    queryKey: categoryKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      featured,
      isActive,
    }),
    queryFn: () =>
      categoryApi.getCategories({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        featured,
        isActive,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single category by ID
export const useCategory = (id) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get active categories (for public use)
export const useActiveCategories = () => {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: categoryApi.getActiveCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get featured categories
export const useFeaturedCategories = () => {
  return useQuery({
    queryKey: categoryKeys.featured(),
    queryFn: categoryApi.getFeaturedCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get category hierarchy
export const useCategoryHierarchy = () => {
  return useQuery({
    queryKey: categoryKeys.hierarchy(),
    queryFn: categoryApi.getCategoryHierarchy,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search categories
export const useSearchCategories = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: [...categoryKeys.all, "search", searchTerm, options],
    queryFn: () => categoryApi.searchCategories(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get category statistics
export const useCategoryStats = () => {
  return useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: categoryApi.getCategoryStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: (data) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.hierarchy() });
    },
    onError: (error) => {
      console.error("Error creating category:", error);
    },
  });
};

// Hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.hierarchy() });
    },
    onError: (error) => {
      console.error("Error updating category:", error);
    },
  });
};

// Hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: (data, id) => {
      // Remove the category from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.hierarchy() });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
    },
  });
};

// Hook for updating category status
export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) =>
      categoryApi.updateCategoryStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating category status:", error);
    },
  });
};

// Hook for toggling category status
export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.toggleCategoryStatus,
    onSuccess: (data, id) => {
      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.active() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling category status:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleFeaturedCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.toggleFeaturedCategory,
    onSuccess: (data, id) => {
      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.featured() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for bulk status update
export const useBulkUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryIds, status }) =>
      categoryApi.bulkUpdateCategoryStatus(categoryIds, status),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Error bulk updating category status:", error);
    },
  });
};

// Hook for updating package count
export const useUpdateCategoryPackageCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.updateCategoryPackageCount,
    onSuccess: (data, id) => {
      // Update the specific category in cache
      queryClient.setQueryData(categoryKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating package count:", error);
    },
  });
};
