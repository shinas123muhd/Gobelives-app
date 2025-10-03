import React from 'react'
import BannerComp from '../components/BannerComp'

const OurMission = () => {
  return (
    <div>
        <BannerComp title={"Our Mission"} image={"/images/OurMission.jpg"} mainTitle={"Our Mission"}/>
        <div className='px-14 py-8 font-source-sans flex flex-col gap-3'>
            <h2 className='text-4xl'>🎯 Our Mission</h2>
            <div className='text-2xl text-white/56 font-normal'>
           <p>
        At our core, we believe travel should be more than just moving from one
        place to another — it should be a story to remember.
      </p>

      <p>We’re here to:</p>

      <ul className="list-disc list-inside space-y-2">
        <li>Help you explore new places with ease and joy</li>
        <li>Offer personalised and hassle-free travel plans</li>
        <li>
          Bring you unique and meaningful experiences that connect you with
          people, cultures, and nature
        </li>
        <li>
          Promote responsible tourism and help you discover hidden gems
        </li>
        <li>
          Make sure your journey is filled with comfort, adventure, and
          unforgettable moments
        </li>
      </ul>

      <p>
        Every trip you take with us is built with love, care, and a touch of
        magic. ✨
      </p>
           </div>
        </div>
    </div>
  )
}

export default OurMission