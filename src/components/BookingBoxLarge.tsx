import React, { useState, useEffect } from 'react';
import { formatPrice } from '@/utils/formatPrice';

interface BookingBoxLargeProps {
  price: number;
  onRequestBooking: () => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: number) => void;
}




const BookingBoxLarge: React.FC<BookingBoxLargeProps> = ({ price, onRequestBooking, setCheckIn, setCheckOut, setGuests }) => {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuestsState] = useState(1);
  
  useEffect(() => {
    const today = new Date();
    const formattedCheckIn = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];
    const formattedCheckOut = new Date(today.setDate(today.getDate() + 5)).toISOString().split('T')[0];
    setCheckInDate(formattedCheckIn);
    setCheckOutDate(formattedCheckOut);
    setCheckIn(formattedCheckIn);
    setCheckOut(formattedCheckOut);
    setGuests(1);
  }, [setCheckIn, setCheckOut]);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <div className="mb-4 text-xl font-bold">{formatPrice(price)} / night</div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label>Check-in</label>
          <input
  type="date"
  className="border p-2 w-full"
  value={checkInDate}
  onChange={(e) => {
    setCheckInDate(e.target.value);
    setCheckIn(e.target.value);
  }}
/>
        </div>
        <div>
          <label>Check-out</label>
          <input
  type="date"
  className="border p-2 w-full"
  value={checkOutDate}
  onChange={(e) => {
    setCheckOutDate(e.target.value);
    setCheckOut(e.target.value);
  }}
/>
        </div>
      </div>
      <div className="mb-4">
        <label>Guests</label>
        <input
          type="number"
          className="border p-2 w-full"
          min="1"
          value={guests}
          onChange={(e) => {
            const value = Number(e.target.value);
            setGuestsState(value);
            setGuests(value);
          }}
        />
      </div>
      <button onClick={onRequestBooking} className="bg-accent text-white py-2 px-4 w-full rounded">
        Request
      </button>
    </div>
  );
};

export default BookingBoxLarge;
