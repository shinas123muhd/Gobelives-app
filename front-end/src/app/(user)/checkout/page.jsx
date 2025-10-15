"use client"
import React, { useState } from 'react'
import PageTitle from '../components/PageTitle'
import Instruction from './Instruction'
import TourPackageSelector from './TourPackageSelector'
import MainSection from './MainSection'
import TrendingNow from '../home/TrendingNow'
import { useSearchParams } from 'next/navigation'

const page = () => {

  const [selectedTime, setSelectedTime] = useState('7am');
  

  const params = useSearchParams();
  const fromDate = new Date(params.get("fromDate"));
  const toDate = new Date(params.get("toDate"));
  const guests = params.get("guests");
  const price = params.get("price");

  console.log({ fromDate, toDate, guests, price, selectedTime });
  return (
    <div>
        <PageTitle title={"Checkout"} path={"/checkout"} pathname={"Home/Checkout"}/>
        <div className='p-14'>
          <Instruction/>
          <TourPackageSelector selectedTime={selectedTime} setTime={setSelectedTime}/>
          <MainSection />
          
          
        </div>
        <div className='py-5'>
            <TrendingNow/>
          </div>
    </div>
  )
}

export default page