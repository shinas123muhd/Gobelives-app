"use client"
import React from 'react'
import Subtitle from '../components/Subtitle'
import LocationCard from '../components/LocationCard'
import MainButton from '../components/MainButton'
import Image from 'next/image'
import { useGetGallery } from '../api/hooks'
import GallerySkeleton from '../components/GallerySkeleton'

const Gallery = () => {
  const {data, isLoading, isError} = useGetGallery();
  
  return (
    <div className='p-14'>
        <div className='flex justify-between items-center'>
        <Subtitle title={"From The Gallery"} desc={"Explore the stunning Views from our latest gallery exhibition!"}/>
        <div>
        <button className={`relative cursor-pointer bg-[#0F1B17] whitespace-nowrap text-[black]  font-semibold py-1 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg overflow-hidden`} 
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}>
              <h2 className='text-[#FFD700]'>Chat with Us</h2>
              <div> 
              <Image src={"/svgs/StarYellow.svg"} alt='Star' width={24} height={24} className='h-12 w-12 object-contain'/>
              </div> 
              </button>
        </div>
        </div>
        {isLoading ? (
    <GallerySkeleton count={4} />
  ) : (
    <div className='grid grid-cols-4 gap-8 py-4'>
      {data?.map((item) => (
        <div key={item.id} className='h-[320px] w-full'>
          <Image
            src={item.image.url}
            alt={item.image.altText}
            height={600}
            width={600}
            quality={100}
            className='h-full w-full object-cover rounded-2xl'
          />
        </div>
      ))}
    </div>
  )}
        
    </div>
  )
}

export default Gallery