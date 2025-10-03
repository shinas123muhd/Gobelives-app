import React from 'react'
import Subtitle from '../components/Subtitle'
import LocationCard from '../components/LocationCard'

const Adventure = () => {
  return (
    <div className='px-14 py-5'>
        <Subtitle title={"Adventures"} desc={"Discover your next adventure with Destination, a feature designed to help you explore new places and experiences tailored just for you."}/>
        <div className='grid grid-cols-4 gap-6 py-4'>
          {Array.from({length:4}).map((_, index)=>(
            <div key={index}>
              <LocationCard/>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Adventure