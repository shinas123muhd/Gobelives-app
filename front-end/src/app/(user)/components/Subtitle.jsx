import React from 'react'

const Subtitle = ({title, desc}) => {
  return (
    <div className='font-raleway flex flex-col gap-4 w-full '>
        <h1 className='text-[#F2EEE2] text-4xl font-bold '>{title} </h1>
        <p className='text-[#B3BEBA] w-2/3  '>{desc}</p>
        </div>
  )
}

export default Subtitle