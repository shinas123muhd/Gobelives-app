"use client"

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { PiShareFat } from "react-icons/pi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BookingCard = ({price}) => {

  const router = useRouter();

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [guests, setGuests] = useState("2 adults");
  const [isGuestOpen, setIsGuestOpen] = useState(false);

  const guestOptions = [
    "1 adult",
    "2 adults",
    "3 adults",
    "4 adults",
    "5 adults",
    "6 adults",
    "2 adults, 1 child",
    "2 adults, 2 children",
  ];

  const handleBooking = () => {
  const params = new URLSearchParams({
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString(),
    guests,
    price: price.toString(),
  });
  router.push(`/checkout?${params.toString()}`);
};

  return (
    <>
      <style>{`
        /* Custom Modern DatePicker Styles */
        .react-datepicker {
          font-family: inherit;
          border: none;
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 221, 26, 0.1);
          padding: 20px;
        }

        .react-datepicker__header {
          background: transparent;
          border: none;
          padding: 0 0 16px 0;
        }

        .react-datepicker__current-month {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        .react-datepicker__day-names {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .react-datepicker__day-name {
          color: #6b7280;
          font-size: 11px;
          font-weight: 600;
          width: 36px;
          line-height: 36px;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .react-datepicker__month {
          margin: 0;
        }

        .react-datepicker__week {
          display: flex;
          justify-content: space-between;
        }

        .react-datepicker__day {
          color: #e5e7eb;
          width: 36px;
          height: 36px;
          line-height: 36px;
          margin: 2px;
          border-radius: 8px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
          font-weight: 500;
        }

        .react-datepicker__day:hover {
          background: rgba(255, 221, 26, 0.15);
          color: #FFDD1A;
          transform: scale(1.08);
        }

        .react-datepicker__day--selected {
          background: linear-gradient(135deg, #FFDD1A 0%, #FFC700 100%);
          color: #000;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(255, 221, 26, 0.4);
          transform: scale(1.05);
        }

        .react-datepicker__day--selected:hover {
          background: linear-gradient(135deg, #FFE347 0%, #FFDD1A 100%);
          color: #000;
        }

        .react-datepicker__day--keyboard-selected {
          background: rgba(255, 221, 26, 0.2);
          color: #FFDD1A;
        }

        .react-datepicker__day--today {
          font-weight: 700;
          color: #FFDD1A;
          position: relative;
          background: rgba(255, 221, 26, 0.1);
        }

        .react-datepicker__day--today::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #FFDD1A;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 221, 26, 0.6);
        }

        .react-datepicker__day--outside-month {
          color: #374151;
          opacity: 0.4;
        }

        .react-datepicker__day--disabled {
          color: #1f2937;
          cursor: not-allowed;
        }

        .react-datepicker__day--disabled:hover {
          background: transparent;
          transform: none;
          color: #1f2937;
        }

        .react-datepicker__navigation {
          top: 18px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 221, 26, 0.1);
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 221, 26, 0.2);
        }

        .react-datepicker__navigation:hover {
          background: rgba(255, 221, 26, 0.2);
          border-color: rgba(255, 221, 26, 0.4);
        }

        .react-datepicker__navigation--previous {
          left: 20px;
        }

        .react-datepicker__navigation--next {
          right: 20px;
        }

        .react-datepicker__navigation-icon::before {
          border-color: #FFDD1A;
          border-width: 2px 2px 0 0;
          width: 7px;
          height: 7px;
          top: 11px;
        }

        .react-datepicker__triangle {
          display: none;
        }

        .react-datepicker-popper {
          z-index: 9999;
        }

        .react-datepicker__input-container input {
          cursor: pointer;
        }

        /* Range highlighting */
        .react-datepicker__day--in-range {
          background: rgba(255, 221, 26, 0.15);
          color: #FFDD1A;
          border-radius: 0;
        }

        .react-datepicker__day--in-selecting-range {
          background: rgba(255, 221, 26, 0.1);
          color: #e5e7eb;
        }

        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background: linear-gradient(135deg, #FFDD1A 0%, #FFC700 100%);
          color: #000;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(255, 221, 26, 0.4);
        }
      `}</style>

      <div className="flex items-start justify-center font-source-sans min-h-screen  ">
        <div className="w-full max-w-sm">
          <div className="bg-[#0D0D0D] rounded-2xl p-5 shadow-2xl border border-gray-700/40">
            <h2 className="text-white text-lg font-semibold mb-5">Booking</h2>

            {/* From Date */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">From</label>
              <div className="relative">
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="w-full bg-[#F9F9F91F] text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 pr-10"
                  wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">To</label>
              <div className="relative">
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={fromDate}
                  className="w-full bg-[#F9F9F91F] text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 pr-10"
                  wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>

            {/* Guests Dropdown */}
            <div className="mb-5">
              <label className="text-gray-400 text-sm mb-1 block">No. of guests</label>
              <div className="relative">
                <button
                  onClick={() => setIsGuestOpen(!isGuestOpen)}
                  className="w-full bg-[#F9F9F91F] text-white px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500/50 flex items-center justify-between"
                >
                  <span>{guests}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white transition-transform ${
                      isGuestOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isGuestOpen && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 border border-gray-700">
                    {guestOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setGuests(option);
                          setIsGuestOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors text-sm"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-center mb-4 font-raleway">
              <p className="text-gray-400 text-xs mb-1">Subtotal</p>
              <p className="text-white text-3xl font-bold">₹{price ? price.toFixed(2) : "0.00"}</p>
            </div>

            {/* Book Now Button */}
            <div className="flex justify-center pb-3">
              <button onClick={handleBooking} className="relative w-full flex justify-center bg-[#FFDD1A] hover:bg-yellow-500 text-black font-semibold py-2 rounded-xl ring-2 ring-[#362B0040] ring-inset transition duration-200 items-center gap-2 cursor-pointer overflow-hidden">
                <h2>Book Now</h2>
                <Image
                src={"/svgs/ButtonStar.svg"}
                alt="Star"
                width={24}
                height={24}
              />
              </button>
            </div>

            {/* Add To Vote Button */}
            <button className="w-full bg-transparent border border-gray-700 hover:border-gray-600 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 mb-3 text-sm">
              <PiShareFat className="w-4 h-4" />
              Add To Vote
            </button>

            {/* Refund Policy */}
            <div className="text-center">
              <button className="text-[#FFD700] hover:text-yellow-300 font-raleway font-semibold text-sm transition">
                View Refund Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCard;