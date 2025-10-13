"use client"
import Image from 'next/image'
import React from 'react'
import TopSection from './TopSection'
import ImageSection from './ImageSection'
import TourInfoCard from './TourInfoCard'
import TourDetailsSections from './TourDetails'
import MapLocation from './MapLocation'
import NearBy from './NearBy'
import RatingsAndReview from './RatingsAndReview'
import BookingCard from './BookingCard'
import { useGetPackages } from '../../api/hooks'

const page = () => {
  const { data: packages, isLoading, isError, error } = useGetPackages({id:"68e4aaa1653a8b448aa18ce6"});
  console.log(packages)

    const images = Array(6).fill("/images/Booking1.png");
    console.log(packages?.images)
  return (
    <div className='p-14'>
      <TopSection title={packages?.title}/>
        <div className='grid grid-cols-5'>
          
            <div className='col-span-3  w-full'>
                
                <ImageSection images={packages?.images}/>
                <TourInfoCard features = {packages?.featureHighlights}/>
                <TourDetailsSections 
                  description={packages?.description} 
                  whatsInside={packages?.whatsInside}
                  activities={packages?.activities}
                  priceDetails = {packages?.price}
                  precautions={packages?.healthSafetyMeasures}
                  languages = {packages?.languages}
                  duration = {packages?.duration}
                  capacity = {packages?.capacity}
                  meetingPoint = {packages?.meetingPoint}
                />
                <MapLocation/>
            </div>
            <div className='col-span-2'>
                <BookingCard/>
            </div>
        </div>
        <NearBy/>
        <RatingsAndReview/>
    </div>
  )
}

export default page