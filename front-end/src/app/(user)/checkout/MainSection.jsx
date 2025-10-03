import React from 'react'
import BookingForm from './BookingForm'
import PaymentForm from './PaymentForm'
import { TourDetailsCard } from './TourDetailsCard'
import { PriceDetailsCard } from './PriceDetailsCard'
import { ShareExpensesCard } from './ShareExpenseCard'
import BookingInformationModal from './BookingInformationModal'

const MainSection = () => {
  return (
    <div>
        <div className='grid grid-cols-3 gap-5'>
            <div className='col-span-2'>
                <BookingForm/>
                <PaymentForm/>
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

                <ShareExpensesCard 
                pricePerPerson={120.32}
                taxAndFees={9.68}
                />
            </div>
        </div>
        <div className='grid grid-cols-3'>
            <div className='col-span-2'>
                <BookingInformationModal/>
            </div>
        </div>
    </div>
  )
}

export default MainSection