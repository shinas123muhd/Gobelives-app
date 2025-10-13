"use client"
import React from 'react'
import LocationCard from '../components/LocationCard'
import { useGetPackages } from '../api/hooks';
import LocationCardSkeleton from '../components/LocationCardSkeleton';

const PopularPackages = () => {
   const { data: packages, isLoading, isError, error } = useGetPackages(1, 20, "createdAt", "desc");
  return (
    <div className='p-14'>
        <div className='font-raleway flex flex-col gap-4'>
        <h1 className='text-[#F2EEE2] text-4xl font-bold '>Popular packages </h1>
        <p className='text-[#B3BEBA]'>Check out the coolest packages and trips!</p>
        </div>
        <div className='grid grid-cols-4 gap-6 py-4'>
          {isLoading
            ? [...Array(4)].map((_, idx) => (
                <LocationCardSkeleton key={idx} />
              ))
            : packages?.packages.slice(0,4).map((item) => (
                <LocationCard
                  key={item.id}
                  image={item.coverImage}
                  title={item.title}
                  price={item.price.sellingPrice}
                  features={item.featureHighlights}
                />
              ))}
        </div>
    </div>
  )
}

export default PopularPackages