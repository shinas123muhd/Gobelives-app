"use client";
import React from 'react';
import { Sparkles } from 'lucide-react';

export default function BookingInformationModal({ onClose, onBookNow, confirm, data }) {
  console.log(data);

  return (
    <div className="flex items-center justify-center py-4 sm:py-5 ">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-3xl bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden ">
        {/* Header */}
        <div className="bg-[#322F35] bg-opacity-60 px-4 sm:px-6 py-3 sm:py-4">
          <h2 className="text-gray-200 text-base sm:text-lg font-medium">
            Important information about your booking
          </h2>
        </div>

        {/* Content */}
        <div className="bg-black px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* List of rules */}
          <ol className="space-y-3 text-white text-sm sm:text-base">
            <li className="flex gap-3">
              <span className="font-semibold">1.</span>
              <span>
                This rate is non-refundable. If you change or cancel your booking you will not get a refund or credit to use for a future stay.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">2.</span>
              <span>Stay extensions will require a new reservation.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">3.</span>
              <span>Front desk staff will greet guests on arrival.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">4.</span>
              <span>No refunds will be issued for late check-in or early check-out.</span>
            </li>
          </ol>

          {/* Terms acceptance text */}
          <p className="text-gray-300 text-xs sm:text-sm">
            By clicking the button below, I acknowledge that I have reviewed the{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Privacy Statement
            </a>{' '}
            and have reviewed and accept the{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Rules and Restrictions
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Terms of Use
            </a>.
          </p>

          {/* Book Now Button */}
          <div className="flex justify-end pt-3 sm:pt-4">
            <button
              onClick={onBookNow}
              className={`${confirm ? 'bg-[#FFD700]' : 'bg-[#FFD700]/50 cursor-not-allowed'} hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold px-8 sm:px-14 py-2 sm:py-3 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-sm`}
            >
              Book Now
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}