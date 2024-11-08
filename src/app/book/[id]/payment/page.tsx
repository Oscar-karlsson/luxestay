'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import CardForm from '@/components/CardForm';
import PaymentLayout from './PaymentLayout';
import CustomModal from '@/components/CustomModal';


const PaymentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Determine if it's a small screen
    useEffect(() => {
      const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);


  // Retrieve data from query parameters
  const propertyTitle = searchParams.get('title') || 'Property Name';
  const propertyLocation = searchParams.get('location') || 'Location';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const nights = Math.max(
    1,
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
  const cleaningFee = parseFloat(searchParams.get('cleaningFee') || '0');
  const serviceFee = parseFloat(searchParams.get('serviceFee') || '0');
  const totalPrice = parseFloat(searchParams.get('totalPrice') || '0');
  const imageUrl = searchParams.get('imageUrl') || '/default-image.jpg';
  const guests = parseInt(searchParams.get('guests') || '1', 10);

  // Define propertyId, startDate, and endDate after checkIn and checkOut
  const propertyId = searchParams.get('propertyId') || '';
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  
  if (!propertyId) {
    console.error("Error: Property ID is missing or invalid.");
    console.log("Invalid property information. Please try again.");
  }

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch client secret from backend API on mount
  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalPrice * 100 }), // Amount in cents
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [totalPrice]);



   // Define handlePaymentSuccess function with bookingId parameter
   const handlePaymentSuccess = (bookingId: string) => {
    console.log('Payment confirmed');
    router.push(`/book/${propertyId}/confirmation?bookingId=${bookingId}`);
  };

  const content = (
    <div className="max-w-md mx-auto p-6">
      <button className="text-lg mb-4" onClick={() => router.back()}>
        &larr; Back
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Payments</h2>
      
      {/* Property Details Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={imageUrl}
            alt={propertyTitle}
            width={60}
            height={60}
            className="rounded-md"
          />
          <div>
            <h3 className="text-lg font-semibold">{propertyTitle}</h3>
            <p className="text-gray-500">{propertyLocation}</p>
          </div>
        </div>
        
        <p className="text-gray-500 mb-1">Guests: {guests}</p>
        <p className="text-gray-500">Booking Date: {checkIn} - {checkOut}</p>
        
        {/* Price Details */}
        <hr className="my-4" />
        <p className="font-semibold mb-1">Price details</p>
        <div className="flex justify-between mb-1">
          <span>{`${formatPrice(price)} x ${nights} night${nights > 1 ? 's' : ''}`}</span>
          <span>{formatPrice(price * nights)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Cleaning fee</span>
          <span>{formatPrice(cleaningFee)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Service fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total (EUR)</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Payment Method */}
      {clientSecret && (
        <CardForm
          clientSecret={clientSecret}
          handlePaymentSuccess={handlePaymentSuccess} 
          propertyId={propertyId}
          startDate={startDate}
          endDate={endDate}
          propertyTitle={propertyTitle}
          imageUrl={imageUrl}
          location={propertyLocation}
          pricePerNight={price}
          cleaningFee={cleaningFee}
          serviceFee={serviceFee}
        />
      )}
    </div>
  );

  // Render the PaymentPage
  return (
    <PaymentLayout>
      {isSmallScreen ? (
        <CustomModal isOpen={true} onClose={() => router.back()}>
          {content}
        </CustomModal>
      ) : (
        <>{content}</>
      )}
    </PaymentLayout>
  );
};

export default PaymentPage;
