"use client";
import React from "react";

const BookingCalendar = () => {
  // Calendar data for December 2025
  const currentMonth = "Dec 2025";
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Calendar grid data - December 2025 starts on Monday
  const calendarData = [
    // Previous month days (November 2025)
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    // December 2025 days
    { day: 1, isCurrentMonth: true, hasBooking: false },
    { day: 2, isCurrentMonth: true, hasBooking: false },
    { day: 3, isCurrentMonth: true, hasBooking: false },
    { day: 4, isCurrentMonth: true, hasBooking: false },
    { day: 5, isCurrentMonth: true, hasBooking: false },
    { day: 6, isCurrentMonth: true, hasBooking: false },
    { day: 7, isCurrentMonth: true, hasBooking: false },
    { day: 8, isCurrentMonth: true, hasBooking: true, isHighlighted: true }, // Highlighted date
    { day: 9, isCurrentMonth: true, hasBooking: false },
    { day: 10, isCurrentMonth: true, hasBooking: false },
    { day: 11, isCurrentMonth: true, hasBooking: false },
    { day: 12, isCurrentMonth: true, hasBooking: false },
    { day: 13, isCurrentMonth: true, hasBooking: false },
    { day: 14, isCurrentMonth: true, hasBooking: false },
    { day: 15, isCurrentMonth: true, hasBooking: true, hasMultiple: true }, // Multiple bookings
    { day: 16, isCurrentMonth: true, hasBooking: false },
    { day: 17, isCurrentMonth: true, hasBooking: false },
    { day: 18, isCurrentMonth: true, hasBooking: false },
    { day: 19, isCurrentMonth: true, hasBooking: false },
    { day: 20, isCurrentMonth: true, hasBooking: false },
    { day: 21, isCurrentMonth: true, hasBooking: false },
    { day: 22, isCurrentMonth: true, hasBooking: true, hasMultiple: true }, // Multiple bookings
    { day: 23, isCurrentMonth: true, hasBooking: false },
    { day: 24, isCurrentMonth: true, hasBooking: false },
    { day: 25, isCurrentMonth: true, hasBooking: false },
    { day: 26, isCurrentMonth: true, hasBooking: false },
    { day: 27, isCurrentMonth: true, hasBooking: false },
    { day: 28, isCurrentMonth: true, hasBooking: false },
    { day: 29, isCurrentMonth: true, hasBooking: false },
    { day: 30, isCurrentMonth: true, hasBooking: false },
    { day: 31, isCurrentMonth: true, hasBooking: false },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Booking Calendar
        </h3>
        <span className="text-lg font-bold text-gray-900">{currentMonth}</span>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.map((date, index) => (
          <div
            key={index}
            className={`
              relative text-center py-2 text-sm cursor-pointer rounded-lg transition-colors
              ${
                date.isCurrentMonth
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-gray-400"
              }
              ${
                date.isHighlighted
                  ? "bg-yellow-400 text-white font-semibold"
                  : ""
              }
            `}
          >
            {date.day}

            {/* Multiple bookings indicator */}
            {date.hasMultiple && !date.isHighlighted && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;
