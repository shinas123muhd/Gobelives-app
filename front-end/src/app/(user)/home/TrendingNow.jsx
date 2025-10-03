import Image from 'next/image'
import React from 'react'
import MainButton from '../components/MainButton'
import { Heart, MapPin, Share } from 'lucide-react'


const TrendingNow = () => {
  return (
    <div className="h-[calc(100vh-50px)] w-full relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/TrendingNow.jpg"
        alt="Home Banner"
        fill
        priority

        className="object-cover"
      />
      <div className='absolute inset-0 bg-black/50 '></div>
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
<div className='absolute h-full right-10 translate-y-1/3 '>
    <div className='flex flex-col gap-2'>
        <div className='py-1 px-3 bg-[#162721] w-fit rounded-3xl'>
        <h2 className='font-source-sans text-[#FFFFFF] text-sm'>Trending Now</h2>
          </div>
          
          <h1 className='font-raleway text-3xl text-glow-white font-semibold'>Check out the coolest <br />party vibes!</h1>
          <p className='font-source-sans text-white/90 text-sm w-4/5'>Book your next party with us and get personalized venue suggestions and exclusive packages!</p>
          <div className='flex items-center gap-2'>
            <MainButton/>
            <div className='bg-white/20 p-3 rounded-full '>
            
            <Heart color="#FFD700" fill="#FFD700"/>
            </div>
            <div className='bg-white/20 p-3 rounded-full '>
            <Share color="#FFD700" fill="#FFD700" />
            </div>
          </div>
        </div>
        
    </div>
    
</div>

  )
}

export default TrendingNow