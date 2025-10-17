import { Car, Clock, Star, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LocationCard = ({ id, image, title, alt, includes, reviews, price, features = [] }) => {
  console.log(id)

  return (
    <Link href={`/booking/${id}`} className="block">
      <div className='bg-[#0F1B17] p-4 rounded-t-2xl flex flex-col gap-3 justify-between  h-full '>
        <div className='flex flex-col gap-3'>
          <div className='w-full h-[180px] overflow-hidden rounded-t-2xl'>
            <Image src={image} alt='Location' height={180} width={278} className='h-full w-full object-cover rounded-t-2xl' />
          </div>
          <h2 className='font-raleway font-bold text-xl text-glow-white'>{title}</h2>
          <div className="flex flex-col gap-3 font-source-sans text-[#91A19C]">
            {features.slice(0, 3).map((item) => (<div key={item.id} className="flex items-center ">
              <Clock size={16} className="mr-1 " />
              <span className="text-sm">{item.name}</span>
            </div>))}

          </div>
        </div>
        <div className=''>
          <div className="border-t border-dotted border-gray-600 "></div>

          {/* Rating and Price */}
          <div className="flex items-end justify-between font-source-sans py-2">
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
              <h2 className='text-2xl text-glow-white font-bold font-raleway'>${price}</h2>
              <span className='text-gray-300 text-sm'>Per Person</span>
            </div>
          </div>
        </div>
        {/* Divider */}

      </div>
    </Link>
  )
}

export default LocationCard