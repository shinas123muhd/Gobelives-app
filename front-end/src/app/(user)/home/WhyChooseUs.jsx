import Home from '@/app/page';
import { Package, Users } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import MainButton from '../components/MainButton';

const WhyChooseUs = () => {
    const features = [
        {
          icon: <Users className="w-6 h-6 text-blue-500" />,
          title: "Group Bookings",
          description: "Gatherings, group trips turn birthdays and retreats into unforgettable experiences."
        },
        {
          icon: <Home className="w-6 h-6 text-blue-500" />,
          title: "Accommodation",
          description: "Flexible and varied accommodation options."
        },
        {
          icon: <Package className="w-6 h-6 text-blue-500" />,
          title: "Packaged Tour",
          description: "Check Out the Coolest Benefit Packages."
        }
      ];
    
  return (
    <div className="h-[calc(100vh-50px)] w-full relative">
      {/* Background Image */}
      <Image

        src="/images/WhyChoose.jpg"
        alt="Home Banner"
        fill
        priority

        className="object-cover"
      />
      <div className='absolute inset-0 bg-gradient-to-r from-white to-white/0'></div>
      {/* Bottom Fill Image */}
      <div className="absolute bottom-0 w-full z-10">
  <Image
    src="/images/BottomFill.png"
    alt="Bottom Zigzag Decoration"
    width={1920}   // real width of the image
    height={200}   // real height of the image
    className="w-full h-auto"
  />
</div>
<div className='absolute inset-0 flex  items-start p-10 '>
    <div className='w-1/2 text-black flex flex-col gap-3'>
    <h1 className='text-black text-3xl font-bold font-raleway'>Why Choose Us</h1>
    <p className='w-2/3'>Enjoy different experiences in every place you visit and discover new and affordable adventures of course.</p>
    <div className="space-y-4 flex flex-col gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 hover:bg-white p-3 group rounded-2xl transform transition-all duration-200 ease-in-out">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed w-2/3 group-hover:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            <div>
              <MainButton text={"Organize a group trip"} bgColor={"#FFD700"} />
            </div>
          </div>
    </div>
    <div>
    <Image
    src="/images/RotatingAd.png"
    alt="Bottom Zigzag Decoration"
    width={174}   // real width of the image
    height={174}   // real height of the image
    className="w-full h-auto animate-spin"
    style={{
        animation: 'spin 10s linear infinite' // 3 seconds per rotation
      }}
  />
    </div>
</div>

     </div>
  )
}

export default WhyChooseUs