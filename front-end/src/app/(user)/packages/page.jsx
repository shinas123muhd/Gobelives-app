import React from 'react'
import PageTitle from '../components/PageTitle'
import BannerComp from '../components/BannerComp'
import CityBased from './CityBased'
import WavesBased from './WavesBased'
import MountainBased from './MountainBased'
import Gallery from '../home/Gallery'

const page = () => {
  return (
    <div>
        <PageTitle title={"Packages"} path={"/home/packages"} pathname={"Home/Packages"}/>
        <CityBased/>
        <WavesBased/>
        <MountainBased/>
        <Gallery/>
    </div>
  )
}

export default page