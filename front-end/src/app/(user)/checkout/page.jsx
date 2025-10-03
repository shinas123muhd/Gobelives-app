import React from 'react'
import PageTitle from '../components/PageTitle'
import Instruction from './Instruction'
import TourPackageSelector from './TourPackageSelector'
import MainSection from './MainSection'
import TrendingNow from '../home/TrendingNow'

const page = () => {
  return (
    <div>
        <PageTitle title={"Checkout"} path={"/checkout"} pathname={"Home/Checkout"}/>
        <div className='p-14'>
          <Instruction/>
          <TourPackageSelector/>
          <MainSection/>
          
          
        </div>
        <div className='py-5'>
            <TrendingNow/>
          </div>
    </div>
  )
}

export default page