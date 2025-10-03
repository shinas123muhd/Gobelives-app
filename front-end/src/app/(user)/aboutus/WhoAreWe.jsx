import React from 'react'
import BannerComp from '../components/BannerComp'

const WhoAreWe = () => {
  return (
    <div>
        <BannerComp title={"Who are we"} image={"/images/Whatarewe.jpg"} mainTitle={"What are we"}/>
        <div className='px-14 py-8 font-source-sans flex flex-col gap-3'>
            <h2 className='text-4xl'>🎯 Who We Are</h2>
            <p className='w-3/5 text-2xl text-white/56 font-normal'>
            We are a passionate travel team on a mission to make your journeys smooth, fun, and full of memories. Whether you're a solo explorer, a family on vacation, or a couple looking for an escape — we're here to make it easy, exciting, and just right for you.</p>
        </div>
    </div>
  )
}

export default WhoAreWe