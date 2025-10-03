"use client"
import React, { useState } from 'react';
import { Calendar, ShoppingCart, Share2, ChevronDown } from 'lucide-react';

const BookingCard = () => {
  const [fromDate, setFromDate] = useState('10/12/2025');
  const [toDate, setToDate] = useState('10/12/2025');
  const [guests, setGuests] = useState('2 adults');
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const guestOptions = [
    '1 adult',
    '2 adults',
    '3 adults',
    '4 adults',
    '5 adults',
    '6 adults',
    '2 adults, 1 child',
    '2 adults, 2 children',
  ];

  return (
    <div className="  flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Main Card */}
        <div className="bg-[#0D0D0D] rounded-t-3xl p-6 shadow-2xl border border-gray-700/50">
          {/* Header */}
          <h2 className="text-white text-xl font-semibold mb-6">Booking</h2>

          {/* From Date */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">From</label>
            <div className="relative">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-[#F9F9F91F] text-white px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 pr-10"
                placeholder="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            </div>
          </div>

          {/* To Date */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">To</label>
            <div className="relative">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full  bg-[#F9F9F91F] text-white px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 pr-10"
                placeholder="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            </div>
          </div>

          {/* No. of Guest Dropdown */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">No. of guest</label>
            <div className="relative">
              <button
                onClick={() => setIsGuestOpen(!isGuestOpen)}
                className="w-full  bg-[#F9F9F91F] text-white px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 flex items-center justify-between"
              >
                <span>{guests}</span>
                <ChevronDown className={`w-5 h-5 text-white transition-transform ${isGuestOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isGuestOpen && (
                <div className="absolute top-full mt-2 left-0 w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden z-10 border border-gray-700">
                  {guestOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setGuests(option);
                        setIsGuestOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subtotal */}
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm mb-1">Subtotal</p>
            <p className="text-white text-4xl font-bold">$499.99</p>
          </div>

          {/* Book Now Button */}
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 shadow-lg shadow-yellow-500/20">
            Book Now
            <ShoppingCart className="w-5 h-5" />
          </button>

          {/* Add To Yoke Button */}
          <button className="w-full bg-transparent border-2 border-gray-700 hover:border-gray-600 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4">
            <Share2 className="w-5 h-5" />
            Add To Yoke
          </button>

          {/* Refund Policy Link */}
          <div className="text-center">
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
              View Refund Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;