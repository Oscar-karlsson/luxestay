import React from 'react';
import { formatPrice } from '@/utils/formatPrice';  // Import the formatPrice function

interface BookingBarSmallProps {
  pricePerNight: number;
}

const BookingBarSmall: React.FC<BookingBarSmallProps> = ({ pricePerNight }) => {
    return (
      <div className="bg-navbar shadow-md p-4 flex justify-between items-center fixed bottom-0 left-0 right-4 z-10 border-t border-divider"> 
        <span className="text-lg font-bold">{formatPrice(pricePerNight)} / night</span>
        <button className="bg-accent text-white py-2 px-4 rounded">Request</button>
      </div>
    );
  };

export default BookingBarSmall;
