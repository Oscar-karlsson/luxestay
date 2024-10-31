'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { FaCheck } from 'react-icons/fa';

const ConfirmationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const [bookingData, setBookingData] = useState<any>(null);

  // Fetch booking data from Firestore
  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnapshot = await getDoc(bookingRef);

        if (bookingSnapshot.exists()) {
          setBookingData(bookingSnapshot.data());
        } else {
          console.error('No such booking found');
        }
      };

      fetchBooking();
    }
  }, [bookingId]);

  // If booking data is still loading
  if (!bookingData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Convert timestamps and set up destructured values
  const {
    propertyTitle = 'Unknown Property',
    location = 'Unknown Location',
    startDate,
    endDate,
    pricePerNight = 0,
    cleaningFee = 0,
    serviceFee = 0,
    imageUrl,
  } = bookingData;

  const nights = endDate && startDate ? (endDate.toDate() - startDate.toDate()) / (1000 * 60 * 60 * 24) : 0;
  const total = pricePerNight * nights + cleaningFee + serviceFee;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Booking Confirmed!</h1>
      <div className="w-16 h-16 border-8 border-black rounded-full flex items-center justify-center mb-6">
  <FaCheck className="text-black text-4xl" /> {/* Use the checkmark icon */}
</div>
      
      {/* Booking Details Card */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <p className="text-lg font-medium mb-2">Booking ID: {bookingId}</p>
        <p className="text-sm text-gray-600 mb-4">
          Booking Date: {startDate?.toDate().toLocaleDateString()} - {endDate?.toDate().toLocaleDateString()}
        </p>
        
        <div className="flex items-center mb-4">
          <img src={imageUrl || '/default-image.jpg'} alt={propertyTitle} className="w-16 h-16 rounded-md mr-4"/>
          <div>
            <h2 className="text-lg font-semibold">{propertyTitle}</h2>
            <p className="text-gray-500">{location}</p>
          </div>
        </div>

        {/* Price Details */}
        <div className="border-t border-gray-200 pt-4">
          <p className="font-medium mb-2">Price details</p>
          <div className="flex justify-between mb-1">
            <span>{`€${pricePerNight} x ${nights} nights`}</span>
            <span>{`€${pricePerNight * nights}`}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Cleaning fee</span>
            <span>{`€${cleaningFee}`}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Service fee</span>
            <span>{`€${serviceFee}`}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total (EUR)</span>
            <span>{`€${total}`}</span>
          </div>
        </div>
      </div>

      <p className="text-lg mt-8">Enjoy your stay!</p>
      <button
        onClick={() => router.push('/')}
        className="mt-4 bg-black text-white py-2 px-6 rounded-md font-semibold"
      >
        Return to home
      </button>
    </div>
  );
};

export default ConfirmationPage;
