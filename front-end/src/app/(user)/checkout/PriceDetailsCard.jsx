"use client";
import { useState } from "react";

export function PriceDetailsCard({
  roomCount = 1,
  nightCount = 2,
  pricePerNight = 120.32,
  taxAndFees = 9.68,
  redeemedPoints = 0,
  onApplyCoupon = () => {},
}) {
  const [couponCode, setCouponCode] = useState('');

  const subtotal = roomCount * nightCount * pricePerNight;
  const total = subtotal + taxAndFees - redeemedPoints;

  return (
    <div className="py-4 sm:py-5 font-source-sans ">
      <div className="bg-black rounded-2xl p-4 sm:p-5 shadow-xl max-w-sm mx-auto sm:mx-0 space-y-4">
        {/* Header */}
        <div className="bg-[#FFCC00] text-gray-900 font-bold px-4 sm:px-5 py-2 sm:py-3 rounded-t-2xl -mt-4 sm:-mt-5 -mx-4 sm:-mx-5 mb-4">
          Price Details
        </div>

        {/* Room and Night Details */}
        <div className="space-y-2 text-[#F9F9F9]">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>1 room X {nightCount} nights</span>
            <span className="font-semibold">${pricePerNight.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Tax and service fees</span>
            <span className="font-semibold">${taxAndFees.toFixed(2)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700"></div>

        {/* Total */}
        <div className="flex justify-between">
          <span className="text-white text-base sm:text-lg font-bold">Total</span>
          <span className="text-white text-lg sm:text-2xl font-bold">${total.toFixed(0)}</span>
        </div>

        {/* Redeem Points */}
        {redeemedPoints > 0 && (
          <div className="bg-teal-900 bg-opacity-30 rounded-lg p-2 sm:p-3">
            <p className="text-teal-400 text-xs sm:text-sm font-medium">
              Redeem Points: -${redeemedPoints.toFixed(0)}
            </p>
          </div>
        )}

        {/* Coupon Code */}
        <div className="space-y-2">
          <label className="block text-gray-300 text-xs sm:text-sm">Coupon code</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="SAVE-VACATION"
              className="flex-1 bg-[#1A1A1A] text-[#F9F9F93D] rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => onApplyCoupon(couponCode)}
              className="bg-[#0F1B17] hover:bg-[#FFD700] text-[#FFD700] whitespace-nowrap hover:text-[#0F1B17] font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors"
            >
              Apply Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}