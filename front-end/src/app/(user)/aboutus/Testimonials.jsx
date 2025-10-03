import React from 'react'
import TestimonialSlider from './TestimonialSlider'
import TestimonialCard from '../components/TestimonialCard'

const Testimonials = () => {
  return (
    <div className='py-10 flex flex-col gap-3 overflow-x-hidden'>
        <h1 className='font-source-sans text-4xl text-center text-[#E4DAD7] '>Our Travellers Loves Us</h1>
        <TestimonialSlider/>
    </div>
  )
}

export default Testimonials