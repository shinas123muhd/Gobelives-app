import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hotelApi } from "../../../services/hotelApi";

// Query keys for React Query
export const hotelKeys = {
  all: ["hotels"],
  lists: () => [...hotelKeys.all, "list"],
  list: (filters) => [...hotelKeys.lists(), { filters }],
  details: () => [...hotelKeys.all, "detail"],
  detail: (id) => [...hotelKeys.details(), id],
  active: () => [...hotelKeys.all, "active"],
  featured: () => [...hotelKeys.all, "featured"],
  stats: () => [...hotelKeys.all, "stats"],
  search: (term, options) => [...hotelKeys.all, "search", term, options],
  byLocation: (location) => [...hotelKeys.all, "location", location],
  nearby: (lat, lng, radius) => [...hotelKeys.all, "nearby", lat, lng, radius],
  reviews: (id) => [...hotelKeys.detail(id), "reviews"],
};

// Hook to get all hotels with filtering and pagination
export const useHotels = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    status,
    isActive,
    isVerified,
    isFeatured,
    starRating,
    category,
    location,
    createdBy,
    dateFrom,
    dateTo,
  } = params;

  return useQuery({
    queryKey: hotelKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      search,
      status,
      isActive,
      isVerified,
      isFeatured,
      starRating,
      category,
      location,
      createdBy,
      dateFrom,
      dateTo,
    }),
    queryFn: () =>
      hotelApi.getHotels({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        isActive,
        isVerified,
        isFeatured,
        starRating,
        category,
        location,
        createdBy,
        dateFrom,
        dateTo,
      }),
    select: (response) => {
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single hotel by ID
export const useHotel = (id) => {
  return useQuery({
    queryKey: hotelKeys.detail(id),
    queryFn: () => hotelApi.getHotel(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get active hotels (for public use)
export const useActiveHotels = (params = {}) => {
  const { location, category, starRating, minRating, featured } = params;

  return useQuery({
    queryKey: [
      ...hotelKeys.active(),
      { location, category, starRating, minRating, featured },
    ],
    queryFn: () =>
      hotelApi.getActiveHotels({
        location,
        category,
        starRating,
        minRating,
        featured,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get featured hotels
export const useFeaturedHotels = () => {
  return useQuery({
    queryKey: hotelKeys.featured(),
    queryFn: hotelApi.getFeaturedHotels,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to search hotels
export const useSearchHotels = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: hotelKeys.search(searchTerm, options),
    queryFn: () => hotelApi.searchHotels(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length > 2, // Only search if term is longer than 2 chars
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get hotels by location
export const useHotelsByLocation = (location, options = {}) => {
  const { category, starRating, minRating } = options;

  return useQuery({
    queryKey: [
      ...hotelKeys.byLocation(location),
      { category, starRating, minRating },
    ],
    queryFn: () =>
      hotelApi.getHotelsByLocation(location, {
        category,
        starRating,
        minRating,
      }),
    enabled: !!location, // Only run if location is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get nearby hotels
export const useNearbyHotels = (latitude, longitude, radius = 10) => {
  return useQuery({
    queryKey: hotelKeys.nearby(latitude, longitude, radius),
    queryFn: () => hotelApi.getNearbyHotels({ latitude, longitude, radius }),
    enabled: !!latitude && !!longitude, // Only run if coordinates are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get hotel statistics
export const useHotelStats = () => {
  return useQuery({
    queryKey: hotelKeys.stats(),
    queryFn: hotelApi.getHotelStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new hotel
export const useCreateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.createHotel,
    onSuccess: (data) => {
      // Invalidate and refetch hotels list
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error creating hotel:", error);
    },
  });
};

// Hook for updating a hotel
export const useUpdateHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => hotelApi.updateHotel(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error updating hotel:", error);
    },
  });
};

// Hook for deleting a hotel
export const useDeleteHotel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.deleteHotel,
    onSuccess: (data, id) => {
      // Remove the hotel from cache
      queryClient.removeQueries({ queryKey: hotelKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error deleting hotel:", error);
    },
  });
};

// Hook for updating hotel status
export const useUpdateHotelStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => hotelApi.updateHotelStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating hotel status:", error);
    },
  });
};

// Hook for toggling hotel active status
export const useToggleHotelActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.toggleHotelActive,
    onSuccess: (data, id) => {
      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling hotel active status:", error);
    },
  });
};

// Hook for toggling featured status
export const useToggleHotelFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.toggleHotelFeatured,
    onSuccess: (data, id) => {
      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling featured status:", error);
    },
  });
};

// Hook for toggling verified status
export const useToggleHotelVerified = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.toggleHotelVerified,
    onSuccess: (data, id) => {
      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error toggling verified status:", error);
    },
  });
};

// Hook for adding hotel review
export const useAddHotelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating, comment }) =>
      hotelApi.addHotelReview(id, { rating, comment }),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error adding hotel review:", error);
    },
  });
};

// Hook for updating hotel review
export const useUpdateHotelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating, comment }) =>
      hotelApi.updateHotelReview(id, { rating, comment }),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error updating hotel review:", error);
    },
  });
};

// Hook for removing hotel review
export const useRemoveHotelReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.removeHotelReview,
    onSuccess: (data, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error removing hotel review:", error);
    },
  });
};

// Hook for incrementing hotel views
export const useIncrementHotelViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hotelApi.incrementHotelViews,
    onSuccess: (data, id) => {
      // Invalidate related queries to refresh view counts
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error incrementing hotel views:", error);
    },
  });
};

// Hook for updating hotel rooms
export const useUpdateHotelRooms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => hotelApi.updateHotelRooms(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.stats() });
    },
    onError: (error) => {
      console.error("Error updating hotel rooms:", error);
    },
  });
};

// Hook for deleting hotel image
export const useDeleteHotelImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hotelId, imageId }) =>
      hotelApi.deleteHotelImage(hotelId, imageId),
    onSuccess: (data, variables) => {
      const { hotelId } = variables;

      // Update the specific hotel in cache
      queryClient.setQueryData(hotelKeys.detail(hotelId), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: hotelKeys.detail(hotelId) });
      queryClient.invalidateQueries({ queryKey: hotelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.active() });
      queryClient.invalidateQueries({ queryKey: hotelKeys.featured() });
    },
    onError: (error) => {
      console.error("Error deleting hotel image:", error);
    },
  });
};
