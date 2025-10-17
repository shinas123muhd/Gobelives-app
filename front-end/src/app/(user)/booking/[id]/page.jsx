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
import { useParams } from 'next/navigation';

const page = () => {
  const { id } = useParams();
  const { data: packages, isLoading, isError, error } = useGetPackages({id: id});
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
                <MapLocation location = {packages?.location.link}/>
            </div>
            <div className='col-span-2'>
                <BookingCard price={packages?.price.sellingPrice}/>
            </div>
        </div>
        <NearBy/>
        <RatingsAndReview/>
    </div>
  )
}

export default page