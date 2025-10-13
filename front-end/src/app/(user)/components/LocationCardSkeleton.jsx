import { Car, Clock, Star, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

// Skeleton Loader Component
const LocationCardSkeleton = () => (
  <div className="bg-[#0F1B17] p-4 rounded-t-2xl flex flex-col gap-3 animate-pulse">
    {/* Image */}
    <div className="w-full h-[180px] bg-gray-700 rounded-t-2xl"></div>

    {/* Title */}
    <div className="h-6 w-3/4 bg-gray-600 rounded-md"></div>

    {/* Features */}
    <div className="flex flex-col gap-2">
      <div className="h-4 w-1/2 bg-gray-600 rounded-md"></div>
      <div className="h-4 w-2/3 bg-gray-600 rounded-md"></div>
      <div className="h-4 w-1/3 bg-gray-600 rounded-md"></div>
    </div>

    {/* Divider */}
    <div className="border-t border-dotted border-gray-600"></div>

    {/* Rating and Price */}
    <div className="flex items-end justify-between">
      {/* Rating */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-600 rounded-full"></div>
          ))}
        </div>
        <div className="h-3 w-12 bg-gray-600 rounded-md mt-1"></div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1 items-end">
        <div className="h-6 w-16 bg-gray-600 rounded-md"></div>
        <div className="h-3 w-10 bg-gray-600 rounded-md"></div>
      </div>
    </div>
  </div>
)
export default LocationCardSkeleton