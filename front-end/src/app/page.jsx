import React from 'react'
import BannerSection from './(user)/home/BannerSection'
import Featured from './(user)/home/Featured'
import WhyChooseUs from './(user)/home/WhyChooseUs'
import PopularPackages from './(user)/home/PopularPackages'
import TrendingNow from './(user)/home/TrendingNow'
import Adventure from './(user)/home/Adventure'
import EventPackages from './(user)/home/EventPackages'
import Gallery from './(user)/home/Gallery'


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