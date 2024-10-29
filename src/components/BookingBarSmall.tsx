import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/formatPrice';

interface BookingBarSmallProps {
  pricePerNight: number;
}

const BookingBarSmall: React.FC<BookingBarSmallProps> = ({ pricePerNight }) => {
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set default dates on mount
  useEffect(() => {
    const today = new Date();
    const formattedCheckIn = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0]; // 3 days from now
    const formattedCheckOut = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0]; // 6 days from now
    setCheckIn(formattedCheckIn);
    setCheckOut(formattedCheckOut);
  }, []);

  // Format dates to display
  const displayDates = checkIn && checkOut ? `${new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : '';

  return (
    <div className="bg-navbar shadow-md p-4 flex justify-between items-center fixed bottom-0 left-0 right-4 z-10 border-t border-divider">
      <div>
        <span className="text-lg font-bold">{formatPrice(pricePerNight)} / night</span>
        <div onClick={() => setIsModalOpen(true)} className="text-sm text-primaryText underline cursor-pointer mt-1">
          {displayDates || 'Select Dates'}
        </div>
      </div>
      <button className="bg-accent text-white py-2 px-4 rounded">Request</button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-4/5 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
            <label>
              Check-in:
              <input
                type="date"
                className="border p-2 w-full mt-2"
                value={checkIn || ''}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </label>
            <label className="mt-4 block">
              Check-out:
              <input
                type="date"
                className="border p-2 w-full mt-2"
                value={checkOut || ''}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </label>
            <button className="bg-primaryButton text-primaryButtonText py-2 px-4 rounded mt-4 w-full" onClick={() => setIsModalOpen(false)}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingBarSmall;
