import React from 'react'
import LocationCard from '../components/LocationCard'

const PopularPackages = () => {
  return (
    <div className='p-14'>
        <div className='font-raleway flex flex-col gap-4'>
        <h1 className='text-[#F2EEE2] text-4xl font-bold '>Popular packages </h1>
        <p className='text-[#B3BEBA]'>Check out the coolest packages and trips!</p>
        </div>
        <div className='grid grid-cols-4 gap-6 py-4'>
          {Array.from({length:8}).map((_, index)=>(
            <div key={index}>
              <LocationCard/>
            </div>
          ))}
        </div>
    </div>
  )
}

export default PopularPackages