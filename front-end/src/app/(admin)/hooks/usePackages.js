import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { packageApi } from "../../../services/packageApi";

// Query keys for React Query
export const packageKeys = {
  all: ["packages"],
  lists: () => [...packageKeys.all, "list"],
  list: (filters) => [...packageKeys.lists(), { filters }],
  details: () => [...packageKeys.all, "detail"],
  detail: (id) => [...packageKeys.details(), id],
  featured: () => [...packageKeys.all, "featured"],
  category: (category) => [...packageKeys.all, "category", category],
  search: (term, options) => [...packageKeys.all, "search", term, options],
  location: (params) => [...packageKeys.all, "location", params],
  stats: () => [...packageKeys.all, "stats"],
};

// Hook to get all packages with filtering and pagination
export const usePackages = (params = {}) => {
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

  return useQuery({
    queryKey: packageKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      category,
      featured,
      visibility,
      city,
      country,
      minPrice,
      maxPrice,
    }),
    queryFn: () =>
      packageApi.getPackages({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        category,
        featured,
        visibility,
        city,
        country,
        minPrice,
        maxPrice,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single package by ID
export const usePackage = (id) => {
  return useQuery({
    queryKey: packageKeys.detail(id),
    queryFn: () => packageApi.getPackage(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get featured packages (for public use)
export const useFeaturedPackages = () => {
  return useQuery({
    queryKey: packageKeys.featured(),
    queryFn: packageApi.getFeaturedPackages,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get packages by category
export const usePackagesByCategory = (category, params = {}) => {
  return useQuery({
    queryKey: packageKeys.category(category),
    queryFn: () => packageApi.getPackagesByCategory(category, params),
    enabled: !!category, // Only run if category is provided
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search packages
export const useSearchPackages = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: packageKeys.search(searchTerm, options),
    queryFn: () => packageApi.searchPackages(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get packages by location
export const usePackagesByLocation = (params = {}) => {
  return useQuery({
    queryKey: packageKeys.location(params),
    queryFn: () => packageApi.getPackagesByLocation(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get package statistics
export const usePackageStats = () => {
  return useQuery({
    queryKey: packageKeys.stats(),
    queryFn: packageApi.getPackageStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new package
export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageApi.createPackage,
    onSuccess: (data) => {
      // Invalidate and refetch packages list
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.stats() });
      queryClient.invalidateQueries({ queryKey: packageKeys.featured() });
    },
    onError: (error) => {
      console.error("Error creating package:", error);
    },
  });
};

// Hook for updating a package
export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => packageApi.updatePackage(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific package in cache
      queryClient.setQueryData(packageKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.featured() });
    },
    onError: (error) => {
      console.error("Error updating package:", error);
    },
  });
};

// Hook for deleting a package
export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageApi.deletePackage,
    onSuccess: (data, id) => {
      // Remove the package from cache
      queryClient.removeQueries({ queryKey: packageKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.stats() });
      queryClient.invalidateQueries({ queryKey: packageKeys.featured() });
    },
    onError: (error) => {
      console.error("Error deleting package:", error);
    },
  });
};

// Hook for updating package status
export const useUpdatePackageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => packageApi.updatePackageStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific package in cache
      queryClient.setQueryData(packageKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating package status:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleFeaturedPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packageApi.toggleFeaturedPackage,
    onSuccess: (data, id) => {
      // Update the specific package in cache
      queryClient.setQueryData(packageKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.featured() });
      queryClient.invalidateQueries({ queryKey: packageKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for deleting package image
export const useDeletePackageImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packageId, imageId }) =>
      packageApi.deletePackageImage(packageId, imageId),
    onSuccess: (data, variables) => {
      // Update the specific package in cache
      queryClient.setQueryData(packageKeys.detail(variables.packageId), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: packageKeys.stats() });
    },
    onError: (error) => {
      console.error("Error deleting package image:", error);
    },
  });
};
