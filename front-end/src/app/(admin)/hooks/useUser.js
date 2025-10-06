import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../../services/userApi";

// Query keys for user-related queries
export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
  profile: () => [...userKeys.all, "profile"],
  stats: () => [...userKeys.all, "stats"],
  bookings: (id) => [...userKeys.all, "bookings", id],
  rewards: (id) => [...userKeys.all, "rewards", id],
  referrals: (id) => [...userKeys.all, "referrals", id],
  referralCode: (code) => [...userKeys.all, "referralCode", code],
};

// ==================== Query Hooks ====================

/**
 * Hook to get all users with filtering, sorting, and pagination
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * Hook to get a single user by ID
 * @param {string} id - User ID
 * @returns {Object} React Query result
 */
export const useUser = (id) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get current user's profile
 * @returns {Object} React Query result
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userApi.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get user statistics
 * @returns {Object} React Query result
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userApi.getUserStats(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to get user bookings
 * @param {string} id - User ID
 * @param {Object} params - Query parameters
 * @returns {Object} React Query result
 */
export const useUserBookings = (id, params = {}) => {
  return useQuery({
    queryKey: [...userKeys.bookings(id), params],
    queryFn: () => userApi.getUserBookings(id, params),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
};

/**
 * Hook to get user rewards
 * @param {string} id - User ID
 * @returns {Object} React Query result
 */
export const useUserRewards = (id) => {
  return useQuery({
    queryKey: userKeys.rewards(id),
    queryFn: () => userApi.getUserRewards(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to get user by referral code
 * @param {string} code - Referral code
 * @returns {Object} React Query result
 */
export const useUserByReferralCode = (code) => {
  return useQuery({
    queryKey: userKeys.referralCode(code),
    queryFn: () => userApi.getUserByReferralCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to get user's referrals
 * @param {string} id - User ID
 * @returns {Object} React Query result
 */
export const useUserReferrals = (id) => {
  return useQuery({
    queryKey: userKeys.referrals(id),
    queryFn: () => userApi.getUserReferrals(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ==================== Mutation Hooks ====================

/**
 * Hook to update user
 * @returns {Object} React Query mutation result
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }) => userApi.updateUser(id, userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/**
 * Hook to delete user
 * @returns {Object} React Query mutation result
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch user lists and stats
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/**
 * Hook to update user role
 * @returns {Object} React Query mutation result
 */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => userApi.updateUserRole(id, role),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/**
 * Hook to toggle user status
 * @returns {Object} React Query mutation result
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => userApi.toggleUserStatus(id),
    onSuccess: (data, id) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/**
 * Hook to add points to user
 * @returns {Object} React Query mutation result
 */
export const useAddPointsToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, points, reason }) =>
      userApi.addPointsToUser(id, points, reason),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.rewards(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/**
 * Hook to bulk update users
 * @returns {Object} React Query mutation result
 */
export const useBulkUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, updates }) =>
      userApi.bulkUpdateUsers(userIds, updates),
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.details() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

