'use client';
import React, { useState } from 'react';
import TripCard from '@/components/TripCard';
import NoTripsCard from '@/components/NoTripsCard';

const tripsData = [
  {
    bookingId: '453453',
    bookingDate: 'October 12 - October 22',
    title: 'Buccara Villa El Nido',
    location: 'Marbella, Spain',
    imageUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-889026536061465920/original/3796f37b-1957-4df7-881e-7c3e10b52794.jpeg?im_w=1200', 
    isUpcoming: true,    // Upcoming trip
    isCompleted: false,
    isCanceled: false,
  },
  {
    bookingId: '789789',
    bookingDate: 'September 10 - September 20',
    title: 'Casa Blanca',
    location: 'Ibiza, Spain',
    imageUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-889026536061465920/original/3796f37b-1957-4df7-881e-7c3e10b52794.jpeg?im_w=1200',
    isUpcoming: false,
    isCompleted: true,    // Completed trip
    isCanceled: false,
  },
  {
    bookingId: '123123',
    bookingDate: 'August 01 - August 10',
    title: 'Ocean Breeze Villa',
    location: 'Malaga, Spain',
    imageUrl: 'https://a0.muscache.com/im/pictures/miso/Hosting-889026536061465920/original/3796f37b-1957-4df7-881e-7c3e10b52794.jpeg?im_w=1200',
    isUpcoming: false,
    isCompleted: false,
    isCanceled: true,     // Canceled trip
  },
  // Add more trips as needed...
];

const TripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'done'>('upcoming');

  const filteredTrips = tripsData.filter(trip => {
    if (activeTab === 'upcoming') {
      return trip.isUpcoming;
    } else if (activeTab === 'done') {
      return trip.isCompleted || trip.isCanceled;
    }
    return false;
  });

  return (
    <div className="p-6">
      {/* Toggle for Upcoming and Done */}
      <div className="flex justify-center mb-6">
        <button
          className={`w-32 py-2 font-semibold rounded-l-full ${activeTab === 'upcoming' ? 'bg-black text-white' : 'bg-gray-300 text-gray-500'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`w-32 py-2 font-semibold rounded-r-full ${activeTab === 'done' ? 'bg-black text-white' : 'bg-gray-300 text-gray-500'}`}
          onClick={() => setActiveTab('done')}
        >
          Done
        </button>
      </div>

      {/* Trip Cards */}
      {filteredTrips.length > 0 ? (
        filteredTrips.map(trip => (
<TripCard
  key={trip.bookingId}
  bookingId={trip.bookingId}
  bookingDate={trip.bookingDate}
  title={trip.title}
  location={trip.location}
  imageUrl={trip.imageUrl}
  isCanceled={trip.isCanceled}   
  isCompleted={trip.isCompleted} 
/>
        ))
      ) : (
        <NoTripsCard />
      )}
    </div>
  );
};

export default TripsPage;
