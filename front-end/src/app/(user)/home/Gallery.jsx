import React from 'react'
import Subtitle from '../components/Subtitle'
import LocationCard from '../components/LocationCard'
import MainButton from '../components/MainButton'
import Image from 'next/image'

const Gallery = () => {
  return (
    <div className='p-14'>
        <div className='flex justify-between items-center'>
        <Subtitle title={"From The Gallery"} desc={"Explore the stunning Views from our latest gallery exhibition!"}/>
        <MainButton/>
        </div>
        <div className='grid grid-cols-4 gap-8 py-4'>
            {Array.from({length:4}).map((_, index) =>(<div key={index} className='h-[320px] w-full'>
                <Image src={"/images/Gallery1.jpg"} height={320} width={304} className='h-full w-full object-cover rounded-2xl'/>
            </div>))}
        </div>
        
    </div>
  )
}

export default Gallery