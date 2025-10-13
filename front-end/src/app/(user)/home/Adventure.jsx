"use client"
import React from 'react'
import Subtitle from '../components/Subtitle'
import LocationCard from '../components/LocationCard'
import { useGetPackages } from '../api/hooks'
import LocationCardSkeleton from '../components/LocationCardSkeleton'

const Adventure = () => {
   const { data: packages, isLoading, isError, error } = useGetPackages(1, 20, "createdAt", "desc");
  return (
    <div className='px-14 py-5'>
        <Subtitle title={"Adventures"} desc={"Discover your next adventure with Destination, a feature designed to help you explore new places and experiences tailored just for you."}/>
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

export default Adventure