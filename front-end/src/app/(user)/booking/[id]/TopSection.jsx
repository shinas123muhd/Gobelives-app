import Image from 'next/image'
import React from 'react'

const TopSection = () => {
  return (

            <div className="">
                <h1 className='text-[#C4CDCA] text-3xl font-bold w-1/2 '>Majestic Agra Getaway: Explore the Taj Mahal & Timeless Wonders</h1>
                <div className='flex items-center gap-3 font-source-sans '>
                    <div className='flex items-center gap-1 border-r-4 text-[#C4CDCA] border-black/50 pr-3'>
                        <Image src={"/svgs/LocationIcon.svg"} width={10} height={10} className='w-3 h-4 object-contain'/>
                        <h2 >Delhi</h2>
                    </div>
                    <div className='flex items-center gap-2 py-5 '>
                        <div className='flex items-center'>
                        {Array.from({length:5}).map((_, index)=>(
                            <Image key={index} src={"/svgs/RatingStar.svg"} width={10} height={10} className='w-4 h-4'/>
                        ))}
                        </div>
                        <h2>(348 Reviews)</h2>
                    </div>
                    </div>
        </div>
  )
}

export default TopSection