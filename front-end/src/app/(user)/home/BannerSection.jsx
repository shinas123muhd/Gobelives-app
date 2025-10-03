import React from 'react'
import FilterBar from '../components/FilterBar'
import Image from 'next/image'

const BannerSection = () => {
  return (
    <div className="h-[calc(100vh-50px)] w-full relative">
      {/* Background Image */}
      <Image
        src="/images/HomeBanner.jpg"
        alt="Home Banner"
        fill
        priority

        className="object-cover"
      />
      <div className='absolute inset-0 bg-black/30 '></div>
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
<div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
    <h1 className='text-white text-5xl font-bold font-raleway'>Travel Redefined – AI-Powered Trips,<br /> Real Destinations</h1>
    <div>
      <FilterBar/>
    </div>
</div>

     </div>
  )
}

export default BannerSection