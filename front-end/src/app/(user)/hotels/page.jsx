import React from 'react'
import PageTitle from '../components/PageTitle'
import HotelList from './HotelList'
import TrendingNow from '../home/TrendingNow'

const page = () => {
  return (
    <div>
        <PageTitle title={"Hotels"} path={"/hotels"} pathname={"Home/Hotels"}/>
        <HotelList/>
        <TrendingNow/>

    </div>
  )
}

export default page