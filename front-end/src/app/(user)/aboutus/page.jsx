import React from 'react'
import PageTitle from '../components/PageTitle'
import WhoAreWe from './WhoAreWe'
import OurVision from './OurVision'
import OurMission from './OurMission'
import OurJourney from './OurJourney'
import Testimonials from './Testimonials'

const page = () => {
  return (
    <div>
        <PageTitle title={"About Us"} path={"/aboutus"} pathname={"home/AboutUs"}/>
        <WhoAreWe/>
        <OurMission/>
        <OurVision/>
        <OurJourney/>
        <Testimonials/>
    </div>
  )
}

export default page