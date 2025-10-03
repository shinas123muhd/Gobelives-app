import { Car, Clock, Star, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const LocationCard = () => {
  return (
    <div className='bg-[#0F1B17] p-4 rounded-t-2xl flex flex-col gap-3'>
        <div>
            <Image src={"/images/Mountain.jpg"} height={180} width={278} className='object-cover rounded-t-2xl'/>
        </div>
        <h2 className='font-raleway font-bold text-xl text-glow-white'>Backwater Bliss – Alleppey Escape</h2>
        <div className="flex flex-col gap-3 font-source-sans text-[#91A19C]">
            <div className="flex items-center ">
              <Clock size={16} className="mr-1 " />
              <span className="text-sm">4days Stay</span>
            </div>
            <div className="flex items-center ">
              <Car size={16} className="mr-1 " />
              <span className="text-sm">Transport Facility</span>
            </div>
            <div className="flex items-center ">
              <Users size={16} className="mr-1 " />
              <span className="text-sm">Family Plan</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dotted border-gray-600 "></div>

          {/* Rating and Price */}
          <div className="flex items-end justify-between font-source-sans">
            <div className="flex flex-col items-start gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className="text-yellow-400 fill-current" 
                  />
                ))}
              </div>
              <span className="text-gray-300 text-sm ">584 reviews</span>
            </div>
           <div className='flex flex-col '>
            <h2 className='text-2xl text-glow-white font-bold font-raleway'>$349.00</h2>
            <span className='text-gray-300 text-sm'>Per Person</span>
           </div>
          </div>



    </div>
  )
}

export default LocationCard