"use client"

import React, { useState } from 'react'
import BookingForm from './BookingForm'
import PaymentForm from './PaymentForm'
import { TourDetailsCard } from './TourDetailsCard'
import { PriceDetailsCard } from './PriceDetailsCard'
import { ShareExpensesCard } from './ShareExpenseCard'
import BookingInformationModal from './BookingInformationModal'

const MainSection = () => {
    const [userData, setUserData] = useState(null);
    const [confirm, setConfirm] = useState(false)
    console.log(userData)

    const handleSubmit = (formValues) => {
        setUserData(formValues);
        setConfirm(true);
    };
  return (
    <div>
        <div className='grid grid-cols-3 gap-5'>
            <div className='col-span-2'>
                <BookingForm onSubmit={handleSubmit}/>
                <BookingInformationModal confirm={confirm}/>
            </div>
            <div className='col-span-1'>
            <TourDetailsCard 
                title="Majestic Agra Getaway"
                rating={4.5}
                reviewCount={1240}
                />

                <PriceDetailsCard 
                roomCount={1}
                nightCount={2}
                pricePerNight={120.32}
                />

                {/* <ShareExpensesCard 
                pricePerPerson={120.32}
                taxAndFees={9.68}
                /> */}
            </div>
        </div>
        
    </div>
  )
}

export default MainSection