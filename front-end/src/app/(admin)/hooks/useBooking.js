import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "../../../services/bookingApi";

// Query keys for React Query
export const bookingKeys = {
  all: ["bookings"],
  lists: () => [...bookingKeys.all, "list"],
  list: (filters) => [...bookingKeys.lists(), { filters }],
  details: () => [...bookingKeys.all, "detail"],
  detail: (id) => [...bookingKeys.details(), id],
  user: () => [...bookingKeys.all, "user"],
  userBookings: (type) => [...bookingKeys.user(), type],
  stats: () => [...bookingKeys.all, "stats"],
  reference: (reference) => [...bookingKeys.all, "reference", reference],
};

// Hook to get all bookings with filtering, sorting, and pagination
export const useBookings = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
    bookingType,
    startDate,
    endDate,
    userId,
    search,
  } = params;

  return useQuery({
    queryKey: bookingKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      bookingType,
      startDate,
      endDate,
      userId,
      search,
    }),
    queryFn: () =>
      bookingApi.getBookings({
        page,
        limit,
        sortBy,
        sortOrder,
        status,
        bookingType,
        startDate,
        endDate,
        userId,
        search,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for real-time updates)
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single booking by ID
export const useBooking = (id) => {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => bookingApi.getBooking(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get booking by reference number
export const useBookingByReference = (reference, email) => {
  return useQuery({
    queryKey: bookingKeys.reference(reference),
    queryFn: () => bookingApi.getBookingByReference(reference, email),
    enabled: !!reference && !!email, // Only run if both are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get user's bookings (my bookings)
export const useMyBookings = (type) => {
  return useQuery({
    queryKey: bookingKeys.userBookings(type),
    queryFn: () => bookingApi.getMyBookings(type),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get upcoming bookings
export const useUpcomingBookings = () => {
  return useQuery({
    queryKey: bookingKeys.userBookings("upcoming"),
    queryFn: () => bookingApi.getMyBookings("upcoming"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get past bookings
export const usePastBookings = () => {
  return useQuery({
    queryKey: bookingKeys.userBookings("past"),
    queryFn: () => bookingApi.getMyBookings("past"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get current bookings
export const useCurrentBookings = () => {
  return useQuery({
    queryKey: bookingKeys.userBookings("current"),
    queryFn: () => bookingApi.getMyBookings("current"),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get booking statistics
export const useBookingStats = () => {
  return useQuery({
    queryKey: bookingKeys.stats(),
    queryFn: bookingApi.getBookingStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (data) => {
      // Invalidate and refetch bookings list
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since booking creates an event
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
    },
  });
};

// Hook for updating a booking
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => bookingApi.updateBooking(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since booking updates affect events
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error updating booking:", error);
    },
  });
};

// Hook for cancelling a booking
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => bookingApi.cancelBooking(id, reason),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since cancelled bookings affect events
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error cancelling booking:", error);
    },
  });
};

// Hook for confirming a booking
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingApi.confirmBooking,
    onSuccess: (data, id) => {
      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since confirmed bookings affect events
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error confirming booking:", error);
    },
  });
};

// Hook for updating booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, reason }) =>
      bookingApi.updateBookingStatus(id, status, reason),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since status updates affect events
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error updating booking status:", error);
    },
  });
};

// Hook for updating payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      paymentStatus,
      transactionId,
      paidAmount,
      paymentMethod,
    }) =>
      bookingApi.updatePaymentStatus(
        id,
        paymentStatus,
        transactionId,
        paidAmount,
        paymentMethod
      ),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific booking in cache
      queryClient.setQueryData(bookingKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });
    },
    onError: (error) => {
      console.error("Error updating payment status:", error);
    },
  });
};

// Hook for deleting a booking (admin only)
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingApi.deleteBooking,
    onSuccess: (data, id) => {
      // Remove the booking from cache
      queryClient.removeQueries({ queryKey: bookingKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.user() });

      // Invalidate events calendar queries since deleted bookings affect events
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error deleting booking:", error);
    },
  });
};

// Hook for bulk booking operations
export const useBulkBookingOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ operation, bookingIds, data }) =>
      bookingApi.bulkBookingOperations(operation, bookingIds, data),
    onSuccess: () => {
      // Invalidate all booking queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
    onError: (error) => {
      console.error("Error performing bulk booking operations:", error);
    },
  });
};
