import Image from 'next/image'
import React from 'react'

const Section1 = () => {
  return (
    <div className=''>
        <div className='w-1/2 text-[#E4E4D7] flex flex-col gap-6 p-14 '>
            <h1 className='font-raleway font-bold  text-4xl'>Exploring the Hidden Gems of the Amalfi Coast</h1>
            <p className='font-source-sans text-xl'>Discover the breathtaking beauty and hidden treasures of Italy's Amalfi Coast. From picturesque villages to stunning beaches, this guide will take you through the must-see spots.</p>
        </div>
        <Image src={"/images/BlogBanner.png"} alt='banner' height={774} width={1440} className='h-full w-full object-cover'/>
        <p className='font-source-sans p-14 w-1/2 text-xl'>The Amalfi Coast is a stunning stretch of coastline in Southern Italy, renowned for its picturesque landscapes, charming villages, and crystal-clear waters. As you travel along the winding roads, you'll be greeted with breathtaking views at every turn. This guide will take you through some of the hidden gems that make the Amalfi Coast a must-visit destination. From the bustling town of Positano to the serene beaches of Ravello, each stop offers a unique experience that captures the essence of Italian charm. Whether you're looking for adventure, relaxation, or a taste of local culture, the Amalfi Coast has something for everyone.</p>
        <div className='flex overflow-x-hidden  gap-5'>
            {Array.from({length:6}).map((_, index)=>(<Image key={index}  src={"/images/BlogImg1.png"} alt='Blog' height={420} width={540} className=' h-[420px] w-[540px] rounded-2xl object-cover'/>))}
        </div>
        <p className='font-source-sans p-14 w-1/2 text-xl'>Beyond the popular tourist spots, the Amalfi Coast is home to lesser-known treasures that are waiting to be explored. Venture off the beaten path to discover quaint fishing villages, hidden coves, and historic sites that offer a glimpse into the region's rich history and culture. Whether you're hiking the scenic trails of the Path of the Gods or sampling the local cuisine at a family-run trattoria, you'll find that the Amalfi Coast is full of surprises. Embrace the slower pace of life and take the time to immerse yourself in the beauty and tranquility of this enchanting destination.</p>
    </div>
  )
}

export default Section1