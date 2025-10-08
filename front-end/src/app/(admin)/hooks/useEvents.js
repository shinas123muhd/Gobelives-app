import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "../../../services/eventApi";

// Query keys for React Query
export const eventKeys = {
  all: ["events"],
  lists: () => [...eventKeys.all, "list"],
  list: (filters) => [...eventKeys.lists(), { filters }],
  details: () => [...eventKeys.all, "detail"],
  detail: (id) => [...eventKeys.details(), id],
  calendar: (year, month) => [...eventKeys.all, "calendar", year, month],
  dateRange: (startDate, endDate) => [
    ...eventKeys.all,
    "dateRange",
    startDate,
    endDate,
  ],
  upcoming: () => [...eventKeys.all, "upcoming"],
  past: () => [...eventKeys.all, "past"],
  current: () => [...eventKeys.all, "current"],
  stats: () => [...eventKeys.all, "stats"],
};

// Hook to get all events with filtering and pagination
export const useEvents = (params = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "startDate",
    sortOrder = "asc",
    status,
    eventType,
    bookingType,
    startDate,
    endDate,
    search,
    dateFilter,
  } = params;

  return useQuery({
    queryKey: eventKeys.list({
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      eventType,
      bookingType,
      startDate,
      endDate,
      search,
      dateFilter,
    }),
    queryFn: () =>
      eventApi.getEvents({
        page,
        limit,
        sortBy,
        sortOrder,
        status,
        eventType,
        bookingType,
        startDate,
        endDate,
        search,
        dateFilter,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for real-time calendar updates)
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Hook to get single event by ID
export const useEvent = (id) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventApi.getEvent(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get calendar events for specific month/year
export const useCalendarEvents = (year, month) => {
  return useQuery({
    queryKey: eventKeys.calendar(year, month),
    queryFn: () => eventApi.getCalendarEvents(year, month),
    enabled: !!year && !!month, // Only run if year and month are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get events by date range
export const useEventsByDateRange = (startDate, endDate) => {
  return useQuery({
    queryKey: eventKeys.dateRange(startDate, endDate),
    queryFn: () => eventApi.getEventsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate, // Only run if both dates are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get upcoming events
export const useUpcomingEvents = (limit = 10) => {
  return useQuery({
    queryKey: [...eventKeys.upcoming(), limit],
    queryFn: () => eventApi.getUpcomingEvents(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get past events
export const usePastEvents = (limit = 10) => {
  return useQuery({
    queryKey: [...eventKeys.past(), limit],
    queryFn: () => eventApi.getPastEvents(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get current/ongoing events
export const useCurrentEvents = () => {
  return useQuery({
    queryKey: eventKeys.current(),
    queryFn: eventApi.getCurrentEvents,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get event statistics
export const useEventStats = () => {
  return useQuery({
    queryKey: eventKeys.stats(),
    queryFn: eventApi.getEventStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new event (standalone)
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: (data) => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });
};

// Hook for updating an event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => eventApi.updateEvent(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.past() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error updating event:", error);
    },
  });
};

// Hook for deleting an event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventApi.deleteEvent,
    onSuccess: (data, id) => {
      // Remove the event from cache
      queryClient.removeQueries({ queryKey: eventKeys.detail(id) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.past() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
    },
  });
};

// Hook for cancelling an event
export const useCancelEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => eventApi.cancelEvent(id, reason),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error cancelling event:", error);
    },
  });
};

// Hook for completing an event
export const useCompleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventApi.completeEvent,
    onSuccess: (data, id) => {
      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });
      queryClient.invalidateQueries({ queryKey: eventKeys.past() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error completing event:", error);
    },
  });
};

// Hook for updating event status
export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => eventApi.updateEventStatus(id, status),
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Update the specific event in cache
      queryClient.setQueryData(eventKeys.detail(id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.stats() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcoming() });
      queryClient.invalidateQueries({ queryKey: eventKeys.past() });
      queryClient.invalidateQueries({ queryKey: eventKeys.current() });

      // Invalidate all calendar queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "events" && query.queryKey[1] === "calendar",
      });
    },
    onError: (error) => {
      console.error("Error updating event status:", error);
    },
  });
};
