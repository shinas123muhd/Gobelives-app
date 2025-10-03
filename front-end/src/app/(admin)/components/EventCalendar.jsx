"use client";
import React, { useState } from "react";
import { IoChevronDown, IoCalendarOutline, IoClose } from "react-icons/io5";

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("day");

  // Sample events data matching the image
  const events = [
    {
      id: 1,
      title: "Special Travel Days",
      startDate: new Date(2025, 11, 3), // Dec 3
      endDate: new Date(2025, 11, 7), // Dec 7
      destination: "India",
      duration: "4 Days",
      totalBookings: 25,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
        { name: "User 3", avatar: "/api/placeholder/32/32" },
        { name: "User 4", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Delhi Airport",
          date: "07 Dec 2025",
        },
        end: {
          location: "Delhi Airport",
          date: "08 Dec 2025",
        },
      },
    },
    {
      id: 2,
      title: "Holiday Travel Days",
      startDate: new Date(2025, 11, 7), // Dec 7
      endDate: new Date(2025, 11, 8), // Dec 8
      destination: "Thailand",
      duration: "1 Day",
      totalBookings: 15,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Bangkok Airport",
          date: "07 Dec 2025",
        },
        end: {
          location: "Bangkok Airport",
          date: "08 Dec 2025",
        },
      },
    },
    {
      id: 3,
      title: "Adventure Trip Season",
      startDate: new Date(2025, 11, 12), // Dec 12
      endDate: new Date(2025, 11, 17), // Dec 17
      destination: "Nepal",
      duration: "5 Days",
      totalBookings: 30,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
        { name: "User 3", avatar: "/api/placeholder/32/32" },
        { name: "User 4", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Kathmandu Airport",
          date: "12 Dec 2025",
        },
        end: {
          location: "Kathmandu Airport",
          date: "17 Dec 2025",
        },
      },
    },
    {
      id: 4,
      title: "Beach Vibes",
      startDate: new Date(2025, 11, 17), // Dec 17
      endDate: new Date(2025, 11, 22), // Dec 22
      destination: "Maldives",
      duration: "5 Days",
      totalBookings: 20,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
        { name: "User 3", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Male Airport",
          date: "17 Dec 2025",
        },
        end: {
          location: "Male Airport",
          date: "22 Dec 2025",
        },
      },
    },
    {
      id: 5,
      title: "Holiday Travel Days",
      startDate: new Date(2025, 11, 22), // Dec 22
      endDate: new Date(2025, 11, 30), // Dec 30
      destination: "Japan",
      duration: "8 Days",
      totalBookings: 35,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
        { name: "User 3", avatar: "/api/placeholder/32/32" },
        { name: "User 4", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Tokyo Airport",
          date: "22 Dec 2025",
        },
        end: {
          location: "Tokyo Airport",
          date: "30 Dec 2025",
        },
      },
    },
    {
      id: 6,
      title: "Special Travel Days",
      startDate: new Date(2026, 0, 1), // Jan 1
      endDate: new Date(2026, 0, 7), // Jan 7
      destination: "Singapore",
      duration: "6 Days",
      totalBookings: 28,
      users: [
        { name: "User 1", avatar: "/api/placeholder/32/32" },
        { name: "User 2", avatar: "/api/placeholder/32/32" },
        { name: "User 3", avatar: "/api/placeholder/32/32" },
      ],
      meetingPoints: {
        start: {
          location: "Changi Airport",
          date: "01 Jan 2026",
        },
        end: {
          location: "Changi Airport",
          date: "07 Jan 2026",
        },
      },
    },
  ];

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

  const days = getDaysInMonth(currentDate);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return (
    <div className="flex gap-3 h-full overflow-hidden  ">
      {/* Calendar Section */}
      <div className="flex-1 bg-white h-full flex flex-col rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          {/* Month/Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#1D332C]">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <IoChevronDown className="text-[#8B909A] text-sm" />
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

        {/* Calendar Grid */}
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
                        className={`mb-1 p-1 rounded cursor-pointer transition-colors ${
                          selectedEvent && selectedEvent.id === event.id
                            ? "bg-blue-200 border-2 border-blue-400"
                            : "bg-yellow-100 hover:bg-yellow-200"
                        }`}
                      >
                        <div
                          className={`text-xs font-medium truncate ${
                            selectedEvent && selectedEvent.id === event.id
                              ? "text-blue-800"
                              : "text-[#1D332C]"
                          }`}
                        >
                          {event.title}
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            selectedEvent && selectedEvent.id === event.id
                              ? "text-blue-600"
                              : "text-[#8B909A]"
                          }`}
                        >
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
      </div>

      {/* Event Details Sidebar */}
      {selectedEvent && (
        <div className="w-80 bg-white rounded-lg p-6">
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
            <div>
              <span className="text-sm text-[#8B909A]">Destination:</span>
              <p className="text-sm font-medium text-[#1D332C]">
                {selectedEvent.destination}
              </p>
            </div>

            <div>
              <span className="text-sm text-[#8B909A]">Duration:</span>
              <p className="text-sm font-medium text-[#1D332C]">
                {selectedEvent.duration}
              </p>
            </div>

            <div>
              <span className="text-sm text-[#8B909A]">Total Bookings:</span>
              <p className="text-sm font-medium text-[#1D332C]">
                {selectedEvent.totalBookings} Users
              </p>

              {/* User Avatars */}
              <div className="flex -space-x-2 mt-2">
                {selectedEvent.users.map((user, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Points */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[#1D332C]">
                Meeting Points
              </h4>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-[#8B909A] mb-1">Start:</div>
                <div className="text-sm font-medium text-[#1D332C]">
                  {selectedEvent.meetingPoints.start.location}
                </div>
                <div className="text-xs text-[#8B909A]">
                  {selectedEvent.meetingPoints.start.date}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-[#8B909A] mb-1">End:</div>
                <div className="text-sm font-medium text-[#1D332C]">
                  {selectedEvent.meetingPoints.end.location}
                </div>
                <div className="text-xs text-[#8B909A]">
                  {selectedEvent.meetingPoints.end.date}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
