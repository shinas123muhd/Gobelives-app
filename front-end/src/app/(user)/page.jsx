import React from 'react'
import BannerSection from './home/BannerSection'
import Featured from './home/Featured'
import WhyChooseUs from './home/WhyChooseUs'
import PopularPackages from './home/PopularPackages'
import TrendingNow from './home/TrendingNow'
import Adventure from './home/Adventure'
import EventPackages from './home/EventPackages'
import Gallery from './home/Gallery'



const page = () => {
  return (
    <div>
      <BannerSection/>
      <Featured/>
      <WhyChooseUs/>
      <PopularPackages/>
      <TrendingNow/>
      <Adventure/>
      <EventPackages/>
      <Gallery/>
    </div>
  )
}

export default page