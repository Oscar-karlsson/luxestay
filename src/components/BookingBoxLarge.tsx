import React from 'react';
import { formatPrice } from '@/utils/formatPrice';  // Import the formatPrice function

interface BookingBoxLargeProps {
  pricePerNight: number;
}

const BookingBoxLarge: React.FC<BookingBoxLargeProps> = ({ pricePerNight }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg ">
      <div className="mb-4 text-xl font-bold">{formatPrice(pricePerNight)} / night</div>  {/* Use formatPrice */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label>Check-in</label>
          <input type="date" className="border p-2 w-full" />
        </div>
        <div>
          <label>Check-out</label>
          <input type="date" className="border p-2 w-full" />
        </div>
      </div>
      <div className="mb-4">
        <label>Guests</label>
        <input type="number" className="border p-2 w-full" min="1" />
      </div>
      <button className="bg-accent text-white py-2 px-4 w-full rounded">Request</button>
    </div>
  );
};

export default BookingBoxLarge;
