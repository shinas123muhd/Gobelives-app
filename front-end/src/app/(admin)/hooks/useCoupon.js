import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { couponApi } from "../../../services/couponApi";

// Query keys for React Query
export const couponKeys = {
  all: ["coupons"],
  lists: () => [...couponKeys.all, "list"],
  list: (filters) => [...couponKeys.lists(), { filters }],
  details: () => [...couponKeys.all, "detail"],
  detail: (id) => [...couponKeys.details(), id],
  active: () => [...couponKeys.all, "active"],
  featured: () => [...couponKeys.all, "featured"],
  stats: () => [...couponKeys.all, "stats"],
  expiring: () => [...couponKeys.all, "expiring"],
  search: (term, options) => [...couponKeys.all, "search", term, options],
  byCode: (code) => [...couponKeys.all, "code", code],
  forPackage: (packageId) => [...couponKeys.all, "package", packageId],
};

// Hook to get all coupons with filtering and pagination
export const useCoupons = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    eligibility,
    isActive,
    isFeatured,
    createdBy,
    expiryDateFrom,
    expiryDateTo,
  } = params;

  return useQuery({
    queryKey: couponKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      eligibility,
      isActive,
      isFeatured,
      createdBy,
      expiryDateFrom,
      expiryDateTo,
    }),
    queryFn: () =>
      couponApi.getCoupons({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        eligibility,
        isActive,
        isFeatured,
        createdBy,
        expiryDateFrom,
        expiryDateTo,
      }),
    select: (response) => {
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single coupon by ID
export const useCoupon = (id) => {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponApi.getCoupon(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get active coupons (for public use)
export const useActiveCoupons = (params = {}) => {
  const { eligibility, packageId } = params;

  return useQuery({
    queryKey: [...couponKeys.active(), { eligibility, packageId }],
    queryFn: () => couponApi.getActiveCoupons({ eligibility, packageId }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get featured coupons
export const useFeaturedCoupons = () => {
  return useQuery({
    queryKey: couponKeys.featured(),
    queryFn: couponApi.getFeaturedCoupons,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get coupon by code
export const useCouponByCode = (code, params = {}) => {
  const { packageId, userId, orderAmount } = params;

  return useQuery({
    queryKey: [...couponKeys.byCode(code), { packageId, userId, orderAmount }],
    queryFn: () =>
      couponApi.getCouponByCode(code, { packageId, userId, orderAmount }),
    enabled: !!code, // Only run if code is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get coupons for a specific package
export const useCouponsForPackage = (packageId, params = {}) => {
  const { userId, orderAmount } = params;

  return useQuery({
    queryKey: [...couponKeys.forPackage(packageId), { userId, orderAmount }],
    queryFn: () =>
      couponApi.getCouponsForPackage(packageId, { userId, orderAmount }),
    enabled: !!packageId, // Only run if packageId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search coupons
export const useSearchCoupons = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: couponKeys.search(searchTerm, options),
    queryFn: () => couponApi.searchCoupons(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get coupon statistics
export const useCouponStats = () => {
  return useQuery({
    queryKey: couponKeys.stats(),
    queryFn: couponApi.getCouponStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get expiring coupons
export const useExpiringCoupons = (days = 7) => {
  return useQuery({
    queryKey: [...couponKeys.expiring(), { days }],
    queryFn: () => couponApi.getExpiringCoupons(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new coupon
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.createCoupon,
    onSuccess: (data) => {
      // Invalidate and refetch coupons list
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });
      queryClient.invalidateQueries({ queryKey: couponKeys.featured() });
    },
    onError: (error) => {
      console.error("Error creating coupon:", error);
    },
  });
};

// Hook for updating a coupon
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => couponApi.updateCoupon(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });
      queryClient.invalidateQueries({ queryKey: couponKeys.featured() });
    },
    onError: (error) => {
      console.error("Error updating coupon:", error);
    },
  });
};

// Hook for deleting a coupon
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.deleteCoupon,
    onSuccess: (data, id) => {
      // Remove the coupon from cache
      queryClient.removeQueries({ queryKey: couponKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });
      queryClient.invalidateQueries({ queryKey: couponKeys.featured() });
    },
    onError: (error) => {
      console.error("Error deleting coupon:", error);
    },
  });
};

// Hook for updating coupon status
export const useUpdateCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => couponApi.updateCouponStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating coupon status:", error);
    },
  });
};

// Hook for toggling coupon active status
export const useToggleCouponActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.toggleCouponActive,
    onSuccess: (data, id) => {
      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.active() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling coupon active status:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleCouponFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.toggleCouponFeatured,
    onSuccess: (data, id) => {
      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.featured() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for using a coupon
export const useUseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, packageId, orderAmount }) =>
      couponApi.useCoupon(id, { packageId, orderAmount }),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific coupon in cache
      queryClient.setQueryData(couponKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
      queryClient.invalidateQueries({ queryKey: couponKeys.stats() });
    },
    onError: (error) => {
      console.error("Error using coupon:", error);
    },
  });
};

// Hook for validating a coupon
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ id, packageId, orderAmount }) =>
      couponApi.validateCoupon(id, { packageId, orderAmount }),
    onError: (error) => {
      console.error("Error validating coupon:", error);
    },
  });
};
