# Event Hooks & API Documentation

## Overview

Complete React Query hooks and API service for managing events in the admin panel. Follows the same pattern as category management with optimized caching and automatic invalidation.

---

## Files Created

### 1. **Event API Service** (`src/services/eventApi.js`)

✅ Complete API client with methods:

- `getEvents(params)` - Get all events with filtering
- `getEvent(id)` - Get single event
- `createEvent(eventData)` - Create standalone event
- `updateEvent(id, eventData)` - Update event
- `deleteEvent(id)` - Delete event
- `cancelEvent(id, reason)` - Cancel event
- `completeEvent(id)` - Mark as completed
- `updateEventStatus(id, status)` - Update status
- `getCalendarEvents(year, month)` - Calendar view
- `getEventsByDateRange(startDate, endDate)` - Date range query
- `getUpcomingEvents(limit)` - Upcoming events
- `getPastEvents(limit)` - Past events
- `getCurrentEvents()` - Current/ongoing events
- `getEventStats()` - Statistics

### 2. **Event Hooks** (`src/app/(admin)/hooks/useEvents.js`)

✅ Complete React Query hooks following category pattern:

**Query Hooks:**

- `useEvents(params)` - List with filtering
- `useEvent(id)` - Single event
- `useCalendarEvents(year, month)` - Calendar
- `useEventsByDateRange(startDate, endDate)` - Date range
- `useUpcomingEvents(limit)` - Upcoming
- `usePastEvents(limit)` - Past
- `useCurrentEvents()` - Current
- `useEventStats()` - Statistics

**Mutation Hooks:**

- `useCreateEvent()` - Create
- `useUpdateEvent()` - Update
- `useDeleteEvent()` - Delete
- `useCancelEvent()` - Cancel
- `useCompleteEvent()` - Complete
- `useUpdateEventStatus()` - Update status

---

## Usage Examples

### 1. **List Events with Filtering** (EventFilter.jsx)

```javascript
import { useEvents } from "@/app/(admin)/hooks/useEvents";
import { useState } from "react";

const EventFilter = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    dateFilter: "all",
    status: "",
    eventType: "",
  });

  const { data, isLoading, error } = useEvents(filters);

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleDateFilter = (dateFilter) => {
    setFilters({ ...filters, dateFilter, page: 1 });
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search events..."
      />

      <select
        value={filters.dateFilter}
        onChange={(e) => handleDateFilter(e.target.value)}
      >
        <option value="all">All Events</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
      </select>

      <div>
        Total Events: {data?.data?.pagination?.total || 0}
        {data?.data?.events?.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};
```

### 2. **Create Event** (CreateEventDrawer.jsx)

```javascript
import { useCreateEvent } from "@/app/(admin)/hooks/useEvents";
import { useState } from "react";

const CreateEventDrawer = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
    maxBookings: "",
    startLocation: "",
    endLocation: "",
    status: "active",
  });

  const createEvent = useCreateEvent();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createEvent.mutateAsync(formData);

      console.log("Event created:", response);

      // Show success message
      alert("Event created successfully!");

      // Reset form and close drawer
      setFormData({
        title: "",
        description: "",
        destination: "",
        startDate: "",
        endDate: "",
        maxBookings: "",
        startLocation: "",
        endLocation: "",
        status: "active",
      });
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Input
          label="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        {/* ... other fields ... */}

        <Button type="submit" loading={createEvent.isPending}>
          {createEvent.isPending ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Drawer>
  );
};
```

### 3. **Calendar View** (EventCalendar.jsx)

```javascript
import { useCalendarEvents } from "@/app/(admin)/hooks/useEvents";
import { useState } from "react";

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isLoading, error } = useCalendarEvents(year, month);

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  if (isLoading) return <div>Loading calendar...</div>;
  if (error) return <div>Error loading calendar</div>;

  const events = data?.data || [];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPrevMonth}>Previous</button>
        <h2>
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={goToNextMonth}>Next</button>
      </div>

      <div className="calendar-grid">
        {events.map((event) => (
          <div
            key={event._id}
            className="event-item"
            style={{ borderLeft: `4px solid ${event.color}` }}
          >
            <div className="event-title">{event.title}</div>
            <div className="event-dates">
              {new Date(event.startDate).toLocaleDateString()} -{" "}
              {new Date(event.endDate).toLocaleDateString()}
            </div>
            <div className="event-type">
              {event.eventType === "booking-linked"
                ? `${event.bookingType} Booking`
                : "Standalone Event"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. **Delete Event with Confirmation**

```javascript
import { useDeleteEvent } from "@/app/(admin)/hooks/useEvents";

const EventActions = ({ eventId, onSuccess }) => {
  const deleteEvent = useDeleteEvent();

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will cancel linked bookings.")) {
      return;
    }

    try {
      await deleteEvent.mutateAsync(eventId);
      alert("Event deleted successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteEvent.isPending}>
      {deleteEvent.isPending ? "Deleting..." : "Delete Event"}
    </button>
  );
};
```

### 5. **Cancel Event**

```javascript
import { useCancelEvent } from "@/app/(admin)/hooks/useEvents";

const CancelEventModal = ({ eventId, onClose }) => {
  const [reason, setReason] = useState("");
  const cancelEvent = useCancelEvent();

  const handleCancel = async () => {
    try {
      await cancelEvent.mutateAsync({ id: eventId, reason });
      alert("Event cancelled successfully!");
      onClose();
    } catch (error) {
      console.error("Error cancelling event:", error);
      alert("Failed to cancel event");
    }
  };

  return (
    <Modal>
      <h2>Cancel Event</h2>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for cancellation..."
      />
      <button onClick={handleCancel} disabled={cancelEvent.isPending}>
        Confirm Cancellation
      </button>
    </Modal>
  );
};
```

### 6. **Update Event Status**

```javascript
import { useUpdateEventStatus } from "@/app/(admin)/hooks/useEvents";

const EventStatusToggle = ({ event }) => {
  const updateStatus = useUpdateEventStatus();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus.mutateAsync({
        id: event._id,
        status: newStatus,
      });
      alert("Status updated!");
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <select
      value={event.status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={updateStatus.isPending}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="draft">Draft</option>
      <option value="cancelled">Cancelled</option>
      <option value="completed">Completed</option>
    </select>
  );
};
```

### 7. **Event Statistics Dashboard**

```javascript
import { useEventStats } from "@/app/(admin)/hooks/useEvents";

const EventStatsDashboard = () => {
  const { data, isLoading } = useEventStats();

  if (isLoading) return <div>Loading stats...</div>;

  const stats = data?.data || {};

  return (
    <div className="stats-grid">
      <StatCard title="Total Events" value={stats.totalEvents || 0} icon="📅" />
      <StatCard
        title="Active Events"
        value={stats.activeEvents || 0}
        icon="✅"
      />
      <StatCard
        title="Upcoming Events"
        value={stats.upcomingEvents || 0}
        icon="🔜"
      />
      <StatCard
        title="Booking-Linked"
        value={stats.bookingLinkedEvents || 0}
        icon="🔗"
      />
      <StatCard
        title="Standalone"
        value={stats.standaloneEvents || 0}
        icon="⭐"
      />
      <StatCard
        title="Completed"
        value={stats.completedEvents || 0}
        icon="✔️"
      />
    </div>
  );
};
```

### 8. **Upcoming Events Widget**

```javascript
import { useUpcomingEvents } from "@/app/(admin)/hooks/useEvents";

const UpcomingEventsWidget = () => {
  const { data, isLoading } = useUpcomingEvents(5); // Get next 5 events

  if (isLoading) return <div>Loading...</div>;

  const events = data?.data || [];

  return (
    <div className="upcoming-events-widget">
      <h3>Upcoming Events</h3>
      {events.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        events.map((event) => (
          <div key={event._id} className="event-item">
            <div className="event-date">
              {new Date(event.startDate).toLocaleDateString()}
            </div>
            <div className="event-title">{event.title}</div>
            <div className="event-destination">{event.destination}</div>
          </div>
        ))
      )}
    </div>
  );
};
```

---

## Query Keys Structure

```javascript
eventKeys = {
  all: ["events"],
  lists: ["events", "list"],
  list: ["events", "list", { filters }],
  details: ["events", "detail"],
  detail: ["events", "detail", id],
  calendar: ["events", "calendar", year, month],
  dateRange: ["events", "dateRange", startDate, endDate],
  upcoming: ["events", "upcoming"],
  past: ["events", "past"],
  current: ["events", "current"],
  stats: ["events", "stats"],
};
```

---

## Cache Invalidation Strategy

### On Create Event:

- Invalidates: lists, stats, upcoming, current, all calendars

### On Update Event:

- Updates specific event in cache
- Invalidates: lists, upcoming, past, current, all calendars

### On Delete Event:

- Removes from cache
- Invalidates: lists, stats, upcoming, past, current, all calendars

### On Cancel/Complete Event:

- Updates specific event
- Invalidates: lists, stats, upcoming, current, past, all calendars

---

## Stale Time Configuration

```javascript
Lists: 2 minutes (frequent updates)
Single Event: 5 minutes
Calendar: 2 minutes (real-time updates)
Statistics: 5 minutes
Upcoming/Past/Current: 5 minutes
```

---

## Error Handling

All hooks include automatic error handling:

```javascript
const { data, isLoading, error } = useEvents();

if (error) {
  console.error("Event error:", error);
  // Show user-friendly error message
}
```

For mutations:

```javascript
const createEvent = useCreateEvent();

try {
  await createEvent.mutateAsync(data);
} catch (error) {
  console.error("Error:", error);
  alert(error.response?.data?.message || "Operation failed");
}
```

---

## Response Data Structure

### Event List Response:

```javascript
{
  success: true,
  data: {
    events: [...],
    pagination: {
      page: 1,
      limit: 10,
      total: 50,
      pages: 5
    }
  }
}
```

### Single Event Response:

```javascript
{
  success: true,
  data: {
    _id: "...",
    title: "Event Title",
    eventType: "standalone",
    status: "active",
    // ... other fields
  }
}
```

---

## Integration Checklist

- [x] Event API service created
- [x] React Query hooks created
- [ ] Connect CreateEventDrawer to useCreateEvent
- [ ] Implement EventCalendar with useCalendarEvents
- [ ] Add event filters with useEvents
- [ ] Create event details modal with useEvent
- [ ] Add delete/cancel confirmation modals
- [ ] Implement statistics dashboard
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success notifications

---

## Next Steps

1. **Update CreateEventDrawer.jsx**

   - Import `useCreateEvent`
   - Replace TODO with actual API call
   - Add loading/error states
   - Add success notification

2. **Create EventCalendar.jsx**

   - Use `useCalendarEvents` hook
   - Display events in calendar grid
   - Add month navigation
   - Color code events by type

3. **Update EventFilter.jsx**

   - Import `useEvents`
   - Connect search to query
   - Connect filters to query params
   - Add loading states

4. **Create Event Details Modal**
   - Show full event info
   - Add edit/delete actions
   - Show linked booking info

---

## Example: Complete Event List Component

```javascript
import { useEvents, useDeleteEvent } from "@/app/(admin)/hooks/useEvents";
import { useState } from "react";

const EventList = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFilter: "all",
  });

  const { data, isLoading, error } = useEvents({ ...filters, page, limit: 10 });
  const deleteEvent = useDeleteEvent();

  const handleDelete = async (eventId) => {
    if (!confirm("Delete this event?")) return;

    try {
      await deleteEvent.mutateAsync(eventId);
      alert("Event deleted!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const events = data?.data?.events || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div>
      {/* Filters */}
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Search..."
      />

      {/* Event List */}
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={() => handleDelete(event._id)}>Delete</button>
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
        <button
          disabled={page >= pagination.pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## Notes

- All hooks use React Query for caching and state management
- Automatic cache invalidation keeps data fresh
- Optimistic updates not implemented (can be added if needed)
- All mutations return promises for async/await usage
- Error handling follows React Query patterns
- Stale times tuned for calendar real-time updates

---

## References

- Backend API: `back-end/controllers/event.controller.js`
- Backend Routes: `back-end/routes/event.routes.js`
- Backend Model: `back-end/models/Event.model.js`
- Frontend API: `front-end/src/services/eventApi.js`
- Frontend Hooks: `front-end/src/app/(admin)/hooks/useEvents.js`
