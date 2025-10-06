"use client";
import React, { useState } from "react";
import { IoChevronDown, IoCalendarOutline, IoClose } from "react-icons/io5";
import { useCalendarEvents } from "../hooks/useEvents";

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("day");

  // Fetch events from API
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // API expects 1-12
  const { data, isLoading, error } = useCalendarEvents(year, month);

  // Transform API data to component format
  const events =
    data?.data?.map((event) => ({
      id: event._id,
      title: event.title,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      destination: event.destination,
      duration: `${event.duration} ${event.duration === 1 ? "Day" : "Days"}`,
      totalBookings:
        event.eventType === "standalone"
          ? event.currentBookings || 0
          : event.linkedBooking
          ? 1
          : 0,
      maxBookings: event.maxBookings,
      eventType: event.eventType,
      bookingType: event.bookingType,
      status: event.status,
      color: event.color,
      description: event.description,
      startLocation: event.startLocation,
      endLocation: event.endLocation,
      user: event.user,
      linkedBooking: event.linkedBooking,
      bookings: event.bookings || [],
      notes: event.notes,
    })) || [];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      days.push(new Date(year, month + 1, day));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return date >= eventStart && date <= eventEnd;
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate().toString().padStart(2, "0");
    const endDay = end.getDate().toString().padStart(2, "0");
    return `${startDay}-${endDay}`;
  };

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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get week days for week view
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // Start from Sunday

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(weekDay);
    }
    return weekDays;
  };

  // Navigation for week view
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Get week range text
  const getWeekRangeText = (date) => {
    const weekDays = getWeekDays(date);
    const start = weekDays[0];
    const end = weekDays[6];

    if (start.getMonth() === end.getMonth()) {
      return `${
        monthNames[start.getMonth()]
      } ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${monthNames[start.getMonth()]} ${start.getDate()} - ${
        monthNames[end.getMonth()]
      } ${end.getDate()}, ${start.getFullYear()}`;
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex gap-3 h-full overflow-hidden">
        {/* Calendar Section */}
        <div className="flex-1 bg-white h-full flex flex-col rounded-lg p-4">
          {/* Calendar Header Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Calendar Grid Skeleton */}
          <div className="grid grid-cols-7 h-full gap-1">
            {/* Day Headers Skeleton */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-8 h-4 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}

            {/* Calendar Days Skeleton */}
            {Array.from({ length: 42 }, (_, i) => (
              <div
                key={i}
                className="min-h-[120px] p-2 border border-gray-100 rounded-lg bg-white animate-pulse"
              >
                <div className="w-6 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-80 bg-white rounded-lg p-6">
          <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex gap-3 h-full overflow-hidden">
        {/* Calendar Section */}
        <div className="flex-1 bg-white h-full flex flex-col rounded-lg p-4">
          {/* Error Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="w-32 h-6 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-8 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>

          {/* Error Content */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1D332C] mb-2">
                Failed to load events
              </h3>
              <p className="text-sm text-[#8B909A] mb-4">
                Unable to fetch calendar events from the server
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#1D332C] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        {/* Empty Sidebar */}
        <div className="w-80 bg-white rounded-lg p-6">
          <div className="flex items-center justify-center h-full">
            <p className="text-[#8B909A] text-center">No event selected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 h-full overflow-hidden  ">
      {/* Calendar Section */}
      <div className="flex-1 bg-white h-full flex flex-col rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          {/* Navigation based on view mode */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={viewMode === "week" ? goToPrevWeek : goToPrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={viewMode === "week" ? "Previous week" : "Previous month"}
              >
                <IoChevronDown className="text-[#8B909A] text-lg rotate-90" />
              </button>
              <span className="text-lg font-semibold text-[#1D332C] min-w-[200px] text-center">
                {viewMode === "week"
                  ? getWeekRangeText(currentDate)
                  : `${monthNames[currentMonth]} ${currentYear}`}
              </span>
              <button
                onClick={viewMode === "week" ? goToNextWeek : goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={viewMode === "week" ? "Next week" : "Next month"}
              >
                <IoChevronDown className="text-[#8B909A] text-lg -rotate-90" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-[#1D332C] hover:bg-gray-100 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-white text-[#1D332C] shadow-sm"
                    : "text-[#8B909A] hover:text-[#1D332C]"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Views */}
        {viewMode === "day" && (
          <div className="grid grid-cols-7 h-full overflow-y-auto gap-1">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-[#8B909A] bg-gray-50 rounded-lg"
              >
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = day && day.getMonth() === currentMonth;
              const isNextMonth = day && day.getMonth() !== currentMonth;

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-100 rounded-lg ${
                    isNextMonth
                      ? "bg-gray-50 text-gray-400"
                      : "bg-white hover:bg-gray-50"
                  } ${dayEvents.length > 0 ? "bg-yellow-50" : ""}`}
                >
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-2">
                        {day.getDate()}
                      </div>
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          style={{
                            backgroundColor:
                              selectedEvent && selectedEvent.id === event.id
                                ? event.color + "40"
                                : event.color + "20",
                            borderLeft: `3px solid ${event.color}`,
                          }}
                          className={`mb-1 p-1 rounded cursor-pointer transition-colors hover:opacity-80`}
                        >
                          <div
                            className="text-xs font-medium truncate"
                            style={{
                              color:
                                selectedEvent && selectedEvent.id === event.id
                                  ? event.color
                                  : "#1D332C",
                            }}
                          >
                            {event.title}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#8B909A]">
                            <IoCalendarOutline className="text-xs" />
                            {formatDateRange(event.startDate, event.endDate)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Week View */}
        {viewMode === "week" && (
          <div className="grid grid-cols-7 h-full overflow-y-auto gap-1">
            {/* Week Day Headers */}
            {weekDays.map((day, index) => (
              <div
                key={index}
                className="p-3 text-center border-b border-gray-200 bg-gray-50 rounded-t-lg"
              >
                <div className="text-sm font-medium text-[#8B909A]">
                  {dayNames[day.getDay()]}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    day.toDateString() === new Date().toDateString()
                      ? "bg-[#1D332C] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : "text-[#1D332C]"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            ))}

            {/* Week Events */}
            {weekDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              return (
                <div
                  key={index}
                  className="p-2 border border-gray-100 rounded-b-lg bg-white min-h-[400px]"
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{
                        backgroundColor:
                          selectedEvent && selectedEvent.id === event.id
                            ? event.color + "40"
                            : event.color + "20",
                        borderLeft: `3px solid ${event.color}`,
                      }}
                      className="mb-2 p-2 rounded cursor-pointer transition-colors hover:opacity-80"
                    >
                      <div
                        className="text-xs font-medium truncate mb-1"
                        style={{
                          color:
                            selectedEvent && selectedEvent.id === event.id
                              ? event.color
                              : "#1D332C",
                        }}
                      >
                        {event.title}
                      </div>
                      <div className="text-xs text-[#8B909A] truncate">
                        {event.destination}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#8B909A] mt-1">
                        <IoCalendarOutline className="text-xs" />
                        {formatDateRange(event.startDate, event.endDate)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Month List View */}
        {viewMode === "month" && (
          <div className="h-full overflow-y-auto space-y-2">
            {events.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#8B909A]">No events this month</p>
              </div>
            ) : (
              events
                .sort((a, b) => a.startDate - b.startDate)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    style={{
                      backgroundColor:
                        selectedEvent && selectedEvent.id === event.id
                          ? event.color + "40"
                          : event.color + "10",
                      borderLeft: `4px solid ${event.color}`,
                    }}
                    className="p-4 rounded-lg cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4
                          className="font-semibold text-[#1D332C] mb-1"
                          style={{
                            color:
                              selectedEvent && selectedEvent.id === event.id
                                ? event.color
                                : "#1D332C",
                          }}
                        >
                          {event.title}
                        </h4>
                        <p className="text-sm text-[#8B909A]">
                          {event.destination}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: event.color + "20",
                          color: event.color,
                        }}
                      >
                        {event.eventType === "booking-linked"
                          ? event.bookingType
                          : "Event"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#8B909A]">
                      <div className="flex items-center gap-1">
                        <IoCalendarOutline />
                        <span>
                          {event.startDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {event.endDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{event.duration}</span>
                      {event.eventType === "standalone" && (
                        <>
                          <span>•</span>
                          <span>
                            {event.totalBookings}/{event.maxBookings} Booked
                          </span>
                        </>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-[#8B909A] mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Event Details Sidebar */}
      {selectedEvent && (
        <div className="w-80 bg-white rounded-lg p-6 overflow-y-auto">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1D332C]">
              {selectedEvent.title}
            </h3>
            <button
              onClick={handleCloseEventDetails}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Close event details"
            >
              <IoClose className="text-lg text-[#8B909A] hover:text-[#1D332C]" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Event Type Badge */}
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: selectedEvent.color + "20",
                  color: selectedEvent.color,
                }}
              >
                {selectedEvent.eventType === "booking-linked"
                  ? `${selectedEvent.bookingType} Booking`
                  : "Standalone Event"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEvent.status === "active"
                    ? "bg-green-100 text-green-700"
                    : selectedEvent.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedEvent.status}
              </span>
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <span className="text-sm text-[#8B909A]">Description:</span>
                <p className="text-sm font-medium text-[#1D332C] mt-1">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Destination */}
            <div>
              <span className="text-sm text-[#8B909A]">Destination:</span>
              <div className="mt-1">
                {typeof selectedEvent.destination === "string" ? (
                  (() => {
                    try {
                      // First try JSON.parse for valid JSON
                      const parsedDestination = JSON.parse(
                        selectedEvent.destination
                      );
                      return (
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-[#8B909A]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-[#1D332C]">
                              {parsedDestination?.address || "N/A"}
                            </span>
                          </div>
                          {parsedDestination?.city && (
                            <div className="text-xs text-[#8B909A]">
                              {parsedDestination.city}
                            </div>
                          )}
                          {parsedDestination?.link && (
                            <a
                              href={parsedDestination.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      );
                    } catch (e) {
                      // If JSON.parse fails, try to parse the JavaScript-like object string
                      try {
                        const destString = selectedEvent.destination;

                        // Extract values using regex patterns
                        const addressMatch =
                          destString.match(/address:\s*'([^']+)'/);
                        const cityMatch = destString.match(/city:\s*'([^']+)'/);
                        const linkMatch = destString.match(/link:\s*'([^']+)'/);

                        const parsedDestination = {
                          address: addressMatch ? addressMatch[1] : null,
                          city: cityMatch ? cityMatch[1] : null,
                          link: linkMatch ? linkMatch[1] : null,
                        };

                        return (
                          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-[#8B909A]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-sm font-medium text-[#1D332C]">
                                {parsedDestination?.address || "N/A"}
                              </span>
                            </div>
                            {parsedDestination?.city && (
                              <div className="text-xs text-[#8B909A]">
                                {parsedDestination.city}
                              </div>
                            )}
                            {parsedDestination?.link && (
                              <a
                                href={parsedDestination.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                View on Google Maps
                              </a>
                            )}
                          </div>
                        );
                      } catch (regexError) {
                        // If all parsing fails, treat as regular string
                        return (
                          <p className="text-sm font-medium text-[#1D332C]">
                            {selectedEvent.destination}
                          </p>
                        );
                      }
                    }
                  })()
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#8B909A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[#1D332C]">
                        {selectedEvent.destination?.address || "N/A"}
                      </span>
                    </div>
                    {selectedEvent.destination?.city && (
                      <div className="text-xs text-[#8B909A]">
                        {selectedEvent.destination.city}
                      </div>
                    )}
                    {selectedEvent.destination?.link && (
                      <a
                        href={selectedEvent.destination.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <span className="text-sm text-[#8B909A]">Duration:</span>
              <p className="text-sm font-medium text-[#1D332C]">
                {selectedEvent.duration}
              </p>
            </div>

            {/* Date Range */}
            <div>
              <span className="text-sm text-[#8B909A]">Date Range:</span>
              <p className="text-sm font-medium text-[#1D332C]">
                {selectedEvent.startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                -{" "}
                {selectedEvent.endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Bookings Info */}
            {selectedEvent.eventType === "standalone" && (
              <div>
                <span className="text-sm text-[#8B909A]">Bookings:</span>
                <p className="text-sm font-medium text-[#1D332C]">
                  {selectedEvent.totalBookings} / {selectedEvent.maxBookings}{" "}
                  {selectedEvent.maxBookings === 1 ? "Slot" : "Slots"} Filled
                </p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${
                        (selectedEvent.totalBookings /
                          selectedEvent.maxBookings) *
                        100
                      }%`,
                      backgroundColor: selectedEvent.color,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Guest Information */}
            {selectedEvent.eventType === "booking-linked" &&
              selectedEvent.linkedBooking && (
                <div>
                  <h4 className="text-sm font-medium text-[#1D332C] mb-3">
                    Guest Information
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#8B909A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[#1D332C]">
                        {selectedEvent.linkedBooking.guestDetails?.firstName}{" "}
                        {selectedEvent.linkedBooking.guestDetails?.lastName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#8B909A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm text-[#1D332C]">
                        {selectedEvent.linkedBooking.guestDetails?.email ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-[#8B909A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-sm text-[#1D332C]">
                        {selectedEvent.linkedBooking.guestDetails?.phone
                          ? typeof selectedEvent.linkedBooking.guestDetails
                              .phone === "object"
                            ? `${
                                selectedEvent.linkedBooking.guestDetails.phone
                                  .code || ""
                              } ${
                                selectedEvent.linkedBooking.guestDetails.phone
                                  .number || ""
                              }`.trim()
                            : selectedEvent.linkedBooking.guestDetails.phone
                          : "N/A"}
                      </span>
                    </div>

                    {selectedEvent.linkedBooking.guestDetails?.address && (
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-[#8B909A] mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm text-[#1D332C]">
                          {selectedEvent.linkedBooking.guestDetails.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Booking Details */}
            {selectedEvent.eventType === "booking-linked" &&
              selectedEvent.linkedBooking && (
                <div>
                  <h4 className="text-sm font-medium text-[#1D332C] mb-3">
                    Booking Details
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Booking ID:
                      </span>
                      <span className="text-sm text-[#1D332C] font-mono">
                        {selectedEvent.linkedBooking.bookingReference ||
                          selectedEvent.linkedBooking._id ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Booking Type:
                      </span>
                      <span className="text-sm text-[#1D332C] capitalize">
                        {selectedEvent.bookingType ||
                          selectedEvent.linkedBooking.bookingType ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Total Amount:
                      </span>
                      <span className="text-sm text-[#1D332C] font-medium">
                        $
                        {selectedEvent.linkedBooking.totalAmount ||
                          selectedEvent.linkedBooking.amount ||
                          0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Payment Status:
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          selectedEvent.linkedBooking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : selectedEvent.linkedBooking.paymentStatus ===
                              "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedEvent.linkedBooking.paymentStatus ===
                              "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedEvent.linkedBooking.paymentStatus || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Guests:
                      </span>
                      <span className="text-sm text-[#1D332C]">
                        {selectedEvent.linkedBooking.numberOfGuests ||
                          selectedEvent.linkedBooking.guests ||
                          1}{" "}
                        {selectedEvent.linkedBooking.numberOfGuests > 1 ||
                        selectedEvent.linkedBooking.guests > 1
                          ? "guests"
                          : "guest"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[#8B909A]">
                        Booking Status:
                      </span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          selectedEvent.linkedBooking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : selectedEvent.linkedBooking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedEvent.linkedBooking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedEvent.linkedBooking.status || "N/A"}
                      </span>
                    </div>

                    {selectedEvent.linkedBooking.specialRequests && (
                      <div>
                        <span className="text-sm font-medium text-[#8B909A] block mb-1">
                          Special Requests:
                        </span>
                        <p className="text-sm text-[#1D332C] bg-white p-2 rounded border">
                          {selectedEvent.linkedBooking.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Package/Hotel/Property Details */}
            {selectedEvent.eventType === "booking-linked" &&
              selectedEvent.linkedBooking && (
                <div>
                  <h4 className="text-sm font-medium text-[#1D332C] mb-3">
                    {selectedEvent.bookingType === "package"
                      ? "Package Details"
                      : selectedEvent.bookingType === "hotel"
                      ? "Hotel Details"
                      : selectedEvent.bookingType === "property"
                      ? "Property Details"
                      : "Service Details"}
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                    {selectedEvent.bookingType === "package" &&
                      selectedEvent.linkedBooking.package && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Package Name:
                            </span>
                            <span className="text-sm text-[#1D332C]">
                              {selectedEvent.linkedBooking.package.name ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Package Price:
                            </span>
                            <span className="text-sm text-[#1D332C] font-medium">
                              ${selectedEvent.linkedBooking.package.price || 0}
                            </span>
                          </div>
                        </>
                      )}

                    {selectedEvent.bookingType === "hotel" &&
                      selectedEvent.linkedBooking.hotel && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Hotel Name:
                            </span>
                            <span className="text-sm text-[#1D332C]">
                              {selectedEvent.linkedBooking.hotel.name || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Room Type:
                            </span>
                            <span className="text-sm text-[#1D332C]">
                              {selectedEvent.linkedBooking.roomType || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Room Price:
                            </span>
                            <span className="text-sm text-[#1D332C] font-medium">
                              $
                              {selectedEvent.linkedBooking.roomPrice ||
                                selectedEvent.linkedBooking.hotel.price ||
                                0}
                            </span>
                          </div>
                        </>
                      )}

                    {selectedEvent.bookingType === "property" &&
                      selectedEvent.linkedBooking.property && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Property Name:
                            </span>
                            <span className="text-sm text-[#1D332C]">
                              {selectedEvent.linkedBooking.property.name ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Property Type:
                            </span>
                            <span className="text-sm text-[#1D332C]">
                              {selectedEvent.linkedBooking.property.type ||
                                "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#8B909A]">
                              Property Price:
                            </span>
                            <span className="text-sm text-[#1D332C] font-medium">
                              ${selectedEvent.linkedBooking.property.price || 0}
                            </span>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              )}

            {/* Meeting Points (for standalone events) */}
            {selectedEvent.eventType === "standalone" &&
              (selectedEvent.startLocation || selectedEvent.endLocation) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-[#1D332C]">
                    Meeting Points
                  </h4>

                  {selectedEvent.startLocation && (
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: selectedEvent.color + "10" }}
                    >
                      <div className="text-xs text-[#8B909A] mb-1">Start:</div>
                      <div className="text-sm font-medium text-[#1D332C]">
                        {selectedEvent.startLocation}
                      </div>
                      <div className="text-xs text-[#8B909A]">
                        {selectedEvent.startDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  )}

                  {selectedEvent.endLocation && (
                    <div
                      className="rounded-lg p-3"
                      style={{ backgroundColor: selectedEvent.color + "10" }}
                    >
                      <div className="text-xs text-[#8B909A] mb-1">End:</div>
                      <div className="text-sm font-medium text-[#1D332C]">
                        {selectedEvent.endLocation}
                      </div>
                      <div className="text-xs text-[#8B909A]">
                        {selectedEvent.endDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Notes */}
            {selectedEvent.notes && (
              <div>
                <span className="text-sm text-[#8B909A]">Notes:</span>
                <p className="text-sm text-[#1D332C] mt-1">
                  {selectedEvent.notes}
                </p>
              </div>
            )}

            {/* User Info */}
            {selectedEvent.user && (
              <div>
                <span className="text-sm text-[#8B909A]">Created by:</span>
                <p className="text-sm font-medium text-[#1D332C]">
                  {selectedEvent.user.firstName} {selectedEvent.user.lastName}
                </p>
                {selectedEvent.user.email && (
                  <p className="text-xs text-[#8B909A]">
                    {selectedEvent.user.email}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2">
                <button className="flex-1 bg-[#1D332C] text-white px-4 py-2 rounded-lg hover:bg-[#2a4538] transition-colors text-sm font-medium">
                  Edit Event
                </button>
                {selectedEvent.eventType === "booking-linked" && (
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
