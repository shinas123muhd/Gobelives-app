import api from "../lib/axios";

// Event API service functions
export const eventApi = {
  // Get all events with filtering and pagination
  getEvents: async (params = {}) => {
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

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    // Add optional parameters
    if (status) queryParams.append("status", status);
    if (eventType) queryParams.append("eventType", eventType);
    if (bookingType) queryParams.append("bookingType", bookingType);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (search) queryParams.append("search", search);
    if (dateFilter) queryParams.append("dateFilter", dateFilter);

    const response = await api.get(`/api/events?${queryParams.toString()}`);
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },

  // Create new event (standalone)
  createEvent: async (eventData) => {
    const response = await api.post("/api/events", eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },

  // Cancel event
  cancelEvent: async (id, reason) => {
    const response = await api.post(`/api/events/${id}/cancel`, { reason });
    return response.data;
  },

  // Complete event
  completeEvent: async (id) => {
    const response = await api.post(`/api/events/${id}/complete`);
    return response.data;
  },

  // Update event status
  updateEventStatus: async (id, status) => {
    const response = await api.patch(`/api/events/${id}/status`, { status });
    return response.data;
  },

  // Get calendar events for specific month/year
  getCalendarEvents: async (year, month) => {
    const response = await api.get(`/api/events/calendar/${year}/${month}`);
    return response.data;
  },

  // Get events by date range
  getEventsByDateRange: async (startDate, endDate) => {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await api.get(
      `/api/events/range?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10) => {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(
      `/api/events/upcoming?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get past events
  getPastEvents: async (limit = 10) => {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await api.get(
      `/api/events/past?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get current/ongoing events
  getCurrentEvents: async () => {
    const response = await api.get("/api/events/current");
    return response.data;
  },

  // Get event statistics
  getEventStats: async () => {
    const response = await api.get("/api/events/stats");
    return response.data;
  },
};
