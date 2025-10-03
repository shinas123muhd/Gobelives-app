import React from 'react'

const Instruction = () => {
  return (
    <div className=' w-1/2  font-raleway flex flex-col gap-5 items-center '>
        <h2 className='text-3xl text-[#C4CDCA]  font-bold '>Simple 3 steps can Book your Dream Trip</h2>
        <p className=' text-[#B3BEBA] w-10/12  text-center'>Please fill the form below to receive a quote for your project. Feel free to add as much detail as needed.</p>
        <div className='flex gap-2 items-center'>
  {Array.from({ length: 4 }).map((_, index) => (
    <div key={index} className='flex gap-2 items-center'>
      <div className='w-7 h-7 flex justify-center items-center rounded-full bg-amber-500'>
        <span>{index + 1}</span>
      </div>
      {/* Render line only if not last item */}
      {index !== 3 && (
        <div className='bg-gray-500 h-1 w-20 rounded-full'></div>
      )}
    </div>
  ))}
</div>
    </div>
  )
}

export default Instruction