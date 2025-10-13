import React from 'react'
import PageTitle from '../components/PageTitle'
import HotelList from './HotelList'
import TrendingNow from '../home/TrendingNow'

const page = () => {
  return (
    <div>
        <PageTitle title={"Hotels"} path={"/hotels"} pathname={"Home/Hotels"}/>
        <HotelList/>
        <div className='pb-10'>
          <TrendingNow/>
        </div>
    </div>
  )
}

export default page