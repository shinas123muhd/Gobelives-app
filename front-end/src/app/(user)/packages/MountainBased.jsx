"use client"
import React from 'react'
import LocationCard from '../components/LocationCard'
import BannerComp from '../components/BannerComp'
import Subtitle from '../components/Subtitle'
import LocationCardSkeleton from '../components/LocationCardSkeleton'
import { useGetPackages } from '../api/hooks'

const MountainBased = () => {
  const { data: packages, isLoading, isError, error } = useGetPackages(1, 20, "createdAt", "desc", "68d535a896a9c34b778f3017");
  console.log(packages?.packages)
  const MountainPackages = packages?.packages || [];
  return (
    <div>
        <BannerComp image={"/images/MountainBased.png"} title={"CityBased"}/>
        <div className='p-14'>
        <div className='flex justify-between items-center'>
        <Subtitle title={"Mountains"} desc={"Explore the stunning Views from our latest gallery exhibition!"}/>
        
        </div>
        <div className='grid grid-cols-4 gap-6 py-4'>
          {isLoading
            ? [...Array(4)].map((_, idx) => (
                <LocationCardSkeleton key={idx} />
              ))
            : MountainPackages?.map((item) => (
                <LocationCard
                  key={item.id}
                  id={item.id}
                  image={item.coverImage}
                  title={item.title}
                  price={item.price.sellingPrice}
                  features={item.featureHighlights}
                />
              ))}
        </div>
        
    </div>
    </div>
  )
}

export default MountainBased