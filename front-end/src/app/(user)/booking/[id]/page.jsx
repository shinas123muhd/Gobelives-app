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

const page = () => {
    const images = Array(6).fill("/images/Booking1.png");
  return (
    <div className='p-14'>
      <TopSection/>
        <div className='grid grid-cols-5  '>
          
            <div className='col-span-3  w-full'>
                
                <ImageSection images={images}/>
                <TourInfoCard/>
                <TourDetailsSections/>
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