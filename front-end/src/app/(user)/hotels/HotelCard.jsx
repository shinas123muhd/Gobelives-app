import React from 'react'
import { Heart, Wifi, Car, AirVent, Bath, Users, Star, Accessibility, DoorClosed } from 'lucide-react';
import Image from 'next/image';
const HotelCard = ({image, name, altText, averageRating, features = [], amenities = []}) => {
  console.log(features, "features")
  return (
    <div
    className="relative overflow-hidden flex gap-3 p-3 rounded-2xl bg-center bg-no-repeat bg-cover before:absolute before:inset-0 before:bg-black/70"
    style={{ backgroundImage: 'url(/images/HotelBg.jpg)' }}
  >
       
      {/* Left side - Image */}
      <div className="relative z-20 w-[285px]  overflow-hidden rounded-lg ">
      <Image
        src={image}
        alt={altText}
        width={500}
        height={500}
        className="object-cover h-full w-full"
        
      />
        
        {/* Heart icon */}
        <div className="absolute top-2 right-2 ">
          <div className='bg-white/50 p-3 rounded-xl'>
            <Heart className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1  text-white relative z-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div className='flex flex-col gap-2'>
            <h3 className="text-xl font-semibold text-white font-raleway w-2/3">{name}</h3>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                
                if (averageRating >= starValue) {
                  // Full star
                  return <Star key={i} className="w-5 h-5 fill-[#F2994A] text-[#F2994A]" />;
                } else if (averageRating >= starValue - 0.5) {
                  // Half star (you can use opacity or a half-star icon)
                  return <Star key={i} className="w-5 h-5 fill-[#F2994A] text-[#F2994A] opacity-60" />;
                } else {
                  // Empty star
                  return <Star key={i} className="w-5 h-5 fill-none text-gray-400" />;
                }
              })}
            </div>
            <h2 className="text-gray-300 text-base">{averageRating} (1200 Reviews)</h2>
          </div>
          
          {/* Status badges */}
          <div className="flex  gap-1 font-source-sans">
            <span className="bg-red-500 text-white whitespace-nowrap text-xs px-2 py-1 rounded text-center">
              Limited rooms
            </span>
            <span className="bg-green-500 text-white whitespace-nowrap text-xs px-2 py-1 rounded text-center">
              5% off
            </span>
          </div>
        </div>

        
        {/* Breakfast included */}
        {features.length > 0 && (<div className='flex gap-2'>
          {features.slice(0, 3).map((item)=>(<p className="text-[#008234] text-xs py-3 font-raleway" key={item.id}>{item.name}</p>))}
        </div>)}

        {/* Facilities */}
        {amenities.length > 0 && (<div className="mb-3 text-sm font-source-sans">
          <p className=" text-[#FFF4B8] mb-1">Facilities:</p>
          <div className='flex items-center gap-2'>
            {amenities.slice(0,3).map((item)=>(<div key={item.id} className="flex items-center gap-2 mb-2">
            <span className=" py-1 rounded">{item.name}</span>
            <Wifi className="w-5 h-5" />
          </div>))}
          </div>
        </div>)}

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