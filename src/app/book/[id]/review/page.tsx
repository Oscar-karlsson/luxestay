'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';
import CustomModal from '@/components/CustomModal';

const BookingReviewPage = () => {
  const { id } = useParams();
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
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1', 10);
  const price = parseFloat(searchParams.get('price') || '3500');
  const propertyTitle = searchParams.get('title') || 'Villa Ocean Pearl';
  const propertyLocation = searchParams.get('location') || 'Marbella, Spain';
  const imageUrl = searchParams.get('imageUrl') || '/default-image.jpg';

  const cleaningFee = 200;
  const serviceFee = 300;

  const calculateTotalPrice = () => {
    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    return nights * price + cleaningFee + serviceFee;
  };

  const handleProceedToPayment = () => {
    router.push(`/book/${id}/payment?propertyId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&price=${price}&title=${propertyTitle}&location=${propertyLocation}&imageUrl=${encodeURIComponent(imageUrl)}&cleaningFee=${cleaningFee}&serviceFee=${serviceFee}&totalPrice=${calculateTotalPrice()}`);
  };

  const content = (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button className="text-lg mr-4" onClick={() => router.back()}>
          &larr;
        </button>
        <h1 className="text-xl font-semibold">Booking Request</h1>
      </div>

      {/* Property Details */}
      <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4 mb-6">
        <Image
         src={imageUrl} 
         alt={propertyTitle}
          width={60} height={60} 
          className="rounded-md" />
        <div>
          <h2 className="text-lg font-semibold">{propertyTitle}</h2>
          <p className="text-gray-500">{propertyLocation}</p>
        </div>
      </div>

      {/* Check-In / Check-Out & Guest Selection */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <label className="block font-semibold text-gray-600 mb-2">Check-in / Checkout</label>
        <div className="flex items-center space-x-2">
          <input type="text" value={`${checkIn} - ${checkOut}`} readOnly className="border p-2 w-full rounded" />
          <input type="text" value={`${guests} guest${guests > 1 ? 's' : ''}`} readOnly className="border p-2 w-full rounded" />
        </div>
      </div>

      {/* Price Details */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Price details</h3>
        <div className="flex justify-between">
          <span>{`${formatPrice(price)} x ${(new Date(checkOut).getDate() - new Date(checkIn).getDate())} nights`}</span>
          <span>{formatPrice(price * (new Date(checkOut).getDate() - new Date(checkIn).getDate()))}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Cleaning Fee</span>
          <span>{formatPrice(cleaningFee)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>Service Fee</span>
          <span>{formatPrice(serviceFee)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total (EUR)</span>
          <span>{formatPrice(calculateTotalPrice())}</span>
        </div>
      </div>

      {/* Proceed to Payment Button */}
      <button
        onClick={handleProceedToPayment}
        className="bg-black text-white py-2 px-4 w-full rounded-lg font-semibold"
      >
        Payment
      </button>
    </div>
  );

  return (
    <>
      {isSmallScreen ? (
        <CustomModal isOpen={true} onClose={() => router.back()}>
          {content}
        </CustomModal>
      ) : (
        content
      )}
    </>
  );
};

export default BookingReviewPage;