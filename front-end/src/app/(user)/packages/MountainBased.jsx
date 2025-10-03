import React from 'react'
import LocationCard from '../components/LocationCard'
import BannerComp from '../components/BannerComp'
import Subtitle from '../components/Subtitle'

const MountainBased = () => {
  return (
    <div>
        <BannerComp image={"/images/MountainBased.png"} title={"CityBased"}/>
        <div className='p-14'>
        <div className='flex justify-between items-center'>
        <Subtitle title={"Mountains"} desc={"Explore the stunning Views from our latest gallery exhibition!"}/>
        
        </div>
        <div className='grid grid-cols-4 gap-6 py-4'>
          {Array.from({length:8}).map((_, index)=>(
            <div key={index}>
              <LocationCard/>
            </div>
          ))}
        </div>
        
    </div>
    </div>
  )
}

export default MountainBased