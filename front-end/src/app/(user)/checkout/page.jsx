"use client";
import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Instruction from './Instruction';
import TourPackageSelector from './TourPackageSelector';
import MainSection from './MainSection';
import TrendingNow from '../home/TrendingNow';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const [selectedTime, setSelectedTime] = useState('7am');

  const params = useSearchParams();
  const fromDate = new Date(params.get("fromDate"));
  const toDate = new Date(params.get("toDate"));
  const guests = params.get("guests");
  const price = params.get("price");
  const bookingType = params.get("bookingType");
  const id = params.get("id");


  console.log({ fromDate, toDate, guests, price, selectedTime });

  return (
    <div className="overflow-x-hidden">
      <PageTitle
        title={"Checkout"}
        path={"/checkout"}
        pathname={"Home/Checkout"}
      />
      <div className="px-2 lg:px-14 py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto">
        <Instruction />
        <TourPackageSelector selectedTime={selectedTime} setTime={setSelectedTime} />
        <MainSection 
          id={id}
          fromDate={fromDate}
          bookingType={bookingType}
          toDate={toDate}
          guests={guests}
          price={price}
          selectedTime={selectedTime}
        />
      </div>
      <div className="py-4 sm:py-5 lg:py-6">
        <TrendingNow />
      </div>
    </div>
  );
};

export default Page;