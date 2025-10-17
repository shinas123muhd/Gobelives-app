"use client";
import Image from 'next/image';
import React, { useState } from 'react';

export default function TourPackageSelector({ selectedTime, setTime }) {
  const [selectedPackage, setSelectedPackage] = useState('with-hotels');

  const times = ['7am', '8am', '9am', '10am', '11am'];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1D332C] py-6 px-4 sm:px-8 lg:px-14 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-4">
          {/* Package With Hotels */}
          <div
            onClick={() => setSelectedPackage('with-hotels')}
            className={`w-full border-2 rounded-2xl p-4 sm:p-6 shadow-xl transition-all text-left ${
              selectedPackage === 'with-hotels'
                ? 'border-teal-600'
                : 'border-white hover:border-teal-600'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-3">
              {/* Radio indicator */}
              <div className="mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === 'with-hotels'
                      ? 'border-[#F0CC00] bg-[#F0CC00]'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedPackage === 'with-hotels' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>

              <div className="flex-1 font-source-sans">
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-2 font-raleway">
                  Package Price With Hotels
                </h3>
                <div className="flex flex-wrap gap-3 sm:gap-5 text-xs sm:text-sm text-gray-300">
                  <span>Includes 5 star Hotels</span>
                  <span>Break Fast</span>
                  <span>Private Car With Driver</span>
                  <span>Private Guide</span>
                </div>

                {/* Pickup Time Selector */}
                <div className="rounded-lg py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-gray-400 text-xs sm:text-sm flex flex-col gap-4 w-full sm:w-auto">
                    <h1 className="text-white text-sm sm:text-base">Select Pickup Time</h1>
                    <div className="flex gap-2 flex-wrap">
                      {times.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering package select
                            setTime(time);
                          }}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-base sm:text-lg font-medium border border-[#FFE96C] transition-all ${
                            selectedTime === time
                              ? 'bg-[#FFEB7A] text-gray-900'
                              : 'text-gray-300 hover:bg-[#FFEB7A]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-[#FFD70014] gap-2 w-full sm:w-fit text-white rounded-sm mb-4">
                      <Image
                        src={"/svgs/Share.svg"}
                        alt="Verified"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      <span className="text-sm sm:text-base">
                        Cancel for free up to 48 hours before your trip.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 items-start sm:items-end w-full sm:w-auto">
                    <p className="bg-[#EE6E6E] py-1 px-2 text-black rounded-md font-medium text-xs sm:text-sm">
                      Book today and earn 350 points!
                    </p>
                    <p className="bg-[#26AB5F] py-1 px-2 text-black rounded-md font-medium text-xs sm:text-sm">
                      20% off
                    </p>
                    <p className="font-light text-xs sm:text-sm">Include one room</p>
                    <div className="py-3 sm:py-5 flex gap-4 items-center">
                      <span className="line-through text-[#EE6E6E] text-sm sm:text-base">
                        $2880
                      </span>
                      <span className="text-white font-bold text-lg sm:text-xl">
                        $2500
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Without Stay */}
          <div
            onClick={() => setSelectedPackage('without-stay')}
            className={`w-full border-2 rounded-2xl p-4 sm:p-6 shadow-xl transition-all text-left ${
              selectedPackage === 'without-stay'
                ? 'border-teal-600'
                : 'border-white hover:border-teal-600'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === 'without-stay'
                      ? 'border-[#F0CC00] bg-[#F0CC00]'
                      : 'border-gray-600'
                  }`}
                >
                  {selectedPackage === 'without-stay' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-white text-lg sm:text-xl font-semibold">
                  Package Price Without Stay
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="line-through text-[#EE6E6E] text-sm sm:text-base">
                  $2880
                </span>
                <span className="text-white font-bold text-lg sm:text-xl">
                  $2500
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}