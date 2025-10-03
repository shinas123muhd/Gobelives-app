import React from 'react'
import BannerComp from '../components/BannerComp'

const OurVision = () => {
  return (
    <div>
        <BannerComp title={"Our Vision"} image={"/images/OurVision.jpg"} mainTitle={"Our Vision"}/>
        <div className='px-14 py-8 font-source-sans flex flex-col gap-3'>
            <h2 className='text-4xl'>🎯 Our Vision</h2>
            <div className='text-2xl text-white/56 font-normal'>
            <p>
        We dream big! Our goal is to become a travel brand that people trust and
        love, all around the world.
      </p>

      <p>Here’s what we’re working towards:</p>

      <ul className="list-disc list-inside space-y-2">
        <li>Making travel easy, eco-friendly, and open to everyone</li>
        <li>
          Using smart tech and great ideas to improve how people travel
        </li>
        <li>
          Inspiring millions to see the world, confidently and responsibly
        </li>
        <li>
          Creating a strong travel community that values culture, people, and
          the planet
        </li>
      </ul>

      <p>
        We’re not just planning trips — we’re helping shape a better way to
        travel.
      </p>
            </div>
        </div>
    </div>
  )
}

export default OurVision