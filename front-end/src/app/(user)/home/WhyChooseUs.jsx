
import { ArrowUpRight, HomeIcon, Package, Users } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import MainButton from '../components/MainButton';

const WhyChooseUs = () => {
    const features = [
        {
          icon: "/svgs/Flight.svg",
          title: "Group Bookings",
          description: "Gatherings, group trips turn birthdays and retreats into unforgettable experiences."
        },
        {
          icon: "/svgs/Hotel.svg",
          title: "Accommodation",
          description: "Flexible and varied accommodation options."
        },
        {
          icon: "/svgs/Lugguage.svg",
          title: "Packaged Tour",
          description: "Check Out the Coolest Benefit Packages."
        }
      ];
    
  return (
    <div className="h-screen w-full relative">
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
    <div className=" flex flex-col ">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 hover:bg-white showdow-xl p-3 group rounded-2xl transform transition-all duration-200 ease-in-out">
                <div className="flex-shrink-0 w-12 h-12  flex items-center justify-center">
                  <Image src={feature.icon} height={6} width={6} className='h-6 w-6 object-contain'/>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold  text-[#1D332C] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-[#636363] text-lg leading-relaxed w-2/3 ">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
            <div className='flex items-center gap-5 py-5'>
              <MainButton text={"Organize a group trip"}  />
              <div>
              
              <button className={`relative cursor-pointer bg-[#0F1B17] whitespace-nowrap text-[black]  font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg overflow-hidden`} 
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}>
              <h2 className='text-[#FFD700]'>Chat with Us</h2>
              <div> 
              <ArrowUpRight size={20} color='#FFD700' />
              </div> 
              </button>
              </div>
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