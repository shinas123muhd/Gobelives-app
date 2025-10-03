"use client"
import React, { useState } from 'react';

export default function TourPackageSelector() {
  const [selectedTime, setSelectedTime] = useState('7am');
  const [selectedPackage, setSelectedPackage] = useState('with-hotels');

  const times = ['7am', '8am', '9am', '10am', '11am'];

  return (
    <div className='py-10'>
      <div className=" bg-[#1D332C] py-6 px-14 flex items-center justify-center">
        <div className="w-full space-y-4">

          {/* Package With Hotels */}
          <div
            onClick={() => setSelectedPackage('with-hotels')}
            className={`w-full border-2 rounded-2xl p-6 shadow-xl transition-all text-left ${
              selectedPackage === 'with-hotels'
                ? 'border-teal-600'
                : 'border-white hover:border-teal-600'
            }`}
          >
            <div className="flex items-start gap-3 ">
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
                <h3 className="text-white text-lg font-semibold mb-2 font-raleway">
                  Package Price With Hotels
                </h3>
                <div className="flex flex-wrap gap-5 text-sm text-gray-300">
                  <span>Includes 5 star Hotels</span>
                  <span>Break Fast</span>
                  <span>Private Car With Driver</span>
                  <span>Private Guide</span>
                </div>

                {/* Pickup Time Selector */}
                <div className="rounded-lg py-3 flex justify-between ">
                  <div className="text-gray-400 text-xs flex flex-col gap-4">
                <h1 className="text-white text-sm">Select Pickup Time</h1>
                  <div className="flex gap-2 flex-wrap">
                    {times.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent triggering package select
                          setSelectedTime(time);
                        }}
                        className={`px-4 py-2 rounded-sm text-sm font-medium border border-[#FFE96C] transition-all ${
                          selectedTime === time
                            ? 'bg-[#FFEB7A] text-gray-900'
                            : ' text-gray-300 hover:bg-[#FFEB7A]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center px-5 py-2 bg-[#FFD70014] gap-2 w-fit text-white rounded-sm mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className=''>Cancel for free up to 48 hours before your trip.</span>
                </div>
                </div>
                
                <div className='flex flex-col gap-3 items-end'>
                <p className='bg-[#EE6E6E] py-1 px-2  text-black rounded-md font-medium'>Book today and earn 350 points!</p>
                      <p className='bg-[#26AB5F] p-1 px-2 text-black rounded-md font-medium'>20% off</p>
                      <p className='font-light'>Include one room</p>
                      <div className='py-5 flex gap-4 items-center'>
                        <span className='line-through text-[#EE6E6E] '>$2880</span>
                        <span className='line-through text-white font-bold text-xl'>$2500</span>
                      </div>
                </div>

               </div>
              </div>
            
            </div>
          </div>

          {/* Package Without Stay */}
          <div
            onClick={() => setSelectedPackage('without-stay')}
            className={`w-full border-2 rounded-2xl p-6 shadow-xl transition-all text-left ${
              selectedPackage === 'without-stay'
                ? 'border-teal-600'
                : 'border-white hover:border-teal-600'
            }`}
          >
            <div className="flex items-center justify-between">
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
                <span className="text-white text-lg font-semibold">
                  Package Price Without Stay
                </span>
              </div>
              <div className=' flex gap-4 items-center'>
                        <span className='line-through text-[#EE6E6E] '>$2880</span>
                        <span className='line-through text-white font-bold text-xl'>$2500</span>
                      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
