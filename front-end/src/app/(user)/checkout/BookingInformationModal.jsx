import React from 'react';
import { Sparkles } from 'lucide-react';

export default function BookingInformationModal({ onClose, onBookNow }) {
  return (
    <div className="  flex items-center justify-center">
      <div className=" w-full bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#322F35] bg-opacity-60 px-6 py-4">
          <h2 className="text-gray-200 text-lg font-medium">
            Important information about your booking
          </h2>
        </div>

        {/* Content */}
        <div className="bg-black px-6 py-6 space-y-6">
          {/* List of rules */}
          <ol className="space-y-3 text-white">
            <li className="flex gap-3">
              <span className="font-semibold">1.</span>
              <span>
                This rate is non-refundable. If you change or cancel your booking you will not get a refund or credit to use for a future stay.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">2.</span>
              <span>
                Stay extensions will require a new reservation.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">3.</span>
              <span>
                Front desk staff will greet guests on arrival
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold">4.</span>
              <span>
                No refunds will be issued for late check-in or early check-out.
              </span>
            </li>
          </ol>

          {/* Terms acceptance text */}
          <p className="text-gray-300 text-sm">
            By clicking the button below, I acknowledge that I have reviewed the{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Privacy Statement
            </a>{' '}
            and have reviewd and accept the{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Rules and Restrictions
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#2F80ED] hover:text-blue-300 underline">
              Terms of Use
            </a>
            .
          </p>

          {/* Book Now Button */}
          <div className="flex justify-end pt-4">
            <button 
              onClick={onBookNow}
              className="bg-[#FFD700]/50  hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold px-14  py-3 rounded-full transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              Book Now
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}