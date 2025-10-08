import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { reviewApi } from "@/services/reviewApi";
import { toast } from "react-hot-toast";

const useReviews = () => {
  // State management
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if we're currently fetching to prevent multiple calls
  const fetchingRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    rating: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Memoize the API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      ...filters,
    };

    // Remove 'all' values from params
    Object.keys(params).forEach((key) => {
      if (params[key] === "all" || params[key] === "") {
        delete params[key];
      }
    });

    return params;
  }, [
    currentPage,
    itemsPerPage,
    filters.search,
    filters.status,
    filters.rating,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Fetch reviews with current filters and pagination
  const fetchReviews = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (fetchingRef.current) {
      console.log("🚫 API call blocked - already fetching");
      return;
    }

    console.log("🔄 Fetching reviews with params:", apiParams);
    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.getAllReviews(apiParams);

      setReviews(response.data.reviews || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 0);
      console.log(
        "✅ Reviews fetched successfully:",
        response.data.reviews?.length || 0,
        "reviews"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews");
      toast.error(err.response?.data?.message || "Failed to fetch reviews");
      console.error("❌ Error fetching reviews:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [apiParams]);

  // Fetch reviews on mount and when dependencies change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Update pagination
  const updatePagination = useCallback((page, limit) => {
    if (page !== undefined) setCurrentPage(page);
    if (limit !== undefined) {
      setItemsPerPage(limit);
      setCurrentPage(1); // Reset to first page when changing items per page
    }
  }, []);

  // Create a new review
  const createReview = useCallback(
    async (reviewData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await reviewApi.createReview(reviewData);
        toast.success("Review created successfully");

        // Refresh reviews list
        await fetchReviews();

        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create review";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchReviews]
  );

  // Update a review
  const updateReview = useCallback(async (reviewId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.updateReview(reviewId, updateData);
      toast.success("Review updated successfully");

      // Update the review in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, ...response.data.review }
            : review
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update review";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a review
  const deleteReview = useCallback(async (reviewId) => {
    setLoading(true);
    setError(null);

    try {
      await reviewApi.deleteReview(reviewId);
      toast.success("Review deleted successfully");

      // Remove the review from local state
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      setTotalItems((prev) => prev - 1);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete review";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update review status (admin only)
  const updateReviewStatus = useCallback(async (reviewId, status) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.updateReviewStatus(reviewId, status);
      toast.success(`Review ${status} successfully`);

      // Update the review in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? { ...review, status: status } : review
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update review status";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add admin response to review
  const addAdminResponse = useCallback(async (reviewId, content) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.addAdminResponse(reviewId, content);
      toast.success("Response added successfully");

      // Update the review in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, response: response.data.response }
            : review
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add response";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark review as helpful
  const markAsHelpful = useCallback(async (reviewId) => {
    try {
      const response = await reviewApi.markAsHelpful(reviewId);

      // Update the review in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpful: {
                  count: response.data.helpful.count,
                  users: response.data.helpful.users,
                },
              }
            : review
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to mark as helpful";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Unmark review as helpful
  const unmarkAsHelpful = useCallback(async (reviewId) => {
    try {
      const response = await reviewApi.unmarkAsHelpful(reviewId);

      // Update the review in the local state
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpful: {
                  count: response.data.helpful.count,
                  users: response.data.helpful.users,
                },
              }
            : review
        )
      );

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to unmark as helpful";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Get property reviews
  const getPropertyReviews = useCallback(async (propertyId, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.getPropertyReviews(propertyId, params);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch property reviews";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get package reviews
  const getPackageReviews = useCallback(async (packageId, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reviewApi.getPackageReviews(packageId, params);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch package reviews";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user can review a booking
  const checkReviewEligibility = useCallback(async (bookingId) => {
    try {
      const response = await reviewApi.checkEligibility(bookingId);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to check review eligibility";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Refresh reviews
  const refreshReviews = useCallback(() => {
    if (!fetchingRef.current) {
      fetchReviews();
    }
  }, [fetchReviews]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    reviews,
    loading,
    error,

    // Pagination
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,

    // Filters
    filters,

    // Actions
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    updateReviewStatus,
    addAdminResponse,
    markAsHelpful,
    unmarkAsHelpful,
    getPropertyReviews,
    getPackageReviews,
    checkReviewEligibility,
    refreshReviews,
    clearError,

    // State setters
    updateFilters,
    updatePagination,
  };
};

export default useReviews;
