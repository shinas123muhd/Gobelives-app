"use client";

import React, { useState } from 'react';
import BookingForm from './BookingForm';
import PaymentForm from './PaymentForm';
import { TourDetailsCard } from './TourDetailsCard';
import { PriceDetailsCard } from './PriceDetailsCard';
import { ShareExpensesCard } from './ShareExpenseCard';
import BookingInformationModal from './BookingInformationModal';

const MainSection = ({
    id,
    bookingType,
    fromDate,
    toDate,
    guests,
    price,
    selectedTime,
}) => {
  const [userData, setUserData] = useState(null);
  const [confirm, setConfirm] = useState(false);
  console.log(userData);

  const handleSubmit = (formValues) => {
    setUserData(formValues);
    setConfirm(true);
  };

  
  const bookingDetails = {
    id,
    bookingType,
    fromDate,
    toDate,
    guests,
    price,
    selectedTime,
    userData,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-7xl mx-auto">
        <div className="md:col-span-2 space-y-4">
          <BookingForm onSubmit={handleSubmit} />
          <BookingInformationModal confirm={confirm} data={bookingDetails}/>
        </div>
        <div className="md:col-span-1 space-y-4">
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
        </div>
      </div>
    </div>
  );
};

export default MainSection;