import React from 'react'
import { Heart, Wifi, Car, AirVent, Bath, Users, Star, Accessibility, DoorClosed } from 'lucide-react';
import Image from 'next/image';
const HotelCard = () => {
  return (
    <div
    className="relative overflow-hidden flex p-3 rounded-2xl bg-center bg-no-repeat bg-cover before:absolute before:inset-0 before:bg-black/70"
    style={{ backgroundImage: 'url(/images/HotelBg.jpg)' }}
  >
       
      {/* Left side - Image */}
      <div className="relative z-20">
      <Image
  src="/images/Hotel1.jpg"
  alt="Hotel"
  width={285}
  height={238}
  className="object-cover rounded-lg relative"
/>
        
        {/* Heart icon */}
        <div className="absolute top-2 right-2">
          <Heart className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-3 text-white relative z-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div className='flex flex-col gap-2'>
            <h3 className="text-2xl font-semibold text-white font-raleway">Lakeside Motel Warefront</h3>
            <div className="flex items-center gap-2  ">
            <div className="flex items-center gap-0.5">
  {/* 4 filled stars */}
  {[...Array(4)].map((_, i) => (
    <Star key={i} className="w-5 h-5 fill-[#F2994A] text-[#F2994A]" />
  ))}

  {/* 1 gray (empty) star */}
  <Star className="w-5 h-5 text-gray-400" />
</div>
              <h2 className="text-gray-300 text-base ">4.5 (1200 Reviews)</h2>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex  gap-1 font-source-sans">
            <span className="bg-red-500 text-white  text-xs px-2 py-1 rounded text-center">
              Limited rooms
            </span>
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded text-center">
              5% off
            </span>
          </div>
        </div>

        {/* Breakfast included */}
        <p className="text-[#008234] text-xs py-3 font-raleway">Breakfast included · Free cancellation</p>

        {/* Facilities */}
        <div className="mb-3 text-base font-source-sans">
          <p className=" text-[#FFF4B8] mb-1">Facilities:</p>
          <div className="flex items-center gap-2 mb-2">
            <span className=" py-1 rounded">10 Mbps</span>
            <Wifi className="w-5 h-5" />
            <span className="text-sm">Mini bar</span>
            <Car className="w-5 h-5" />
            <span className="text-sm">A/c</span>
            <AirVent className="w-5 h-5" />
          </div>
          
          <div className="text-sm text-[#FFF4B8] mb-1 font-source-sans">Special Facilities:</div>
          <div className="flex items-center gap-2 font-source-sans py-2">
            <span className="text-sm">Wheel Chair</span>
            <Accessibility className ="w-5 h-5"/>
            <span className="text-sm">Lift</span>
            <DoorClosed  className ="w-5 h-5"/>
          </div>
        </div>

        {/* Pricing section */}
        <div className="absolute bottom-3 right-3 text-right">
          <div className="text-xs text-gray-300">Per night/392</div>
          <div className="text-lg font-bold">Total: $163</div>
          <div className="text-xs text-gray-300 mb-2">2 nights, 2 adults</div>
          
          <button className="bg-[#FFD700] hover:bg-yellow-600 text-[#0F1B17] text-sm font-raleway font-medium px-3 py-1.5 rounded flex items-center gap-1">
            See availability
            <span>→</span>
          </button>
        </div>
      
    </div>
    </div>
  )
}

export default HotelCard