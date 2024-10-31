'use client';
import React, { useState, useEffect } from 'react';
import TripCard from '@/components/TripCard';
import NoTripsCard from '@/components/NoTripsCard';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from  '@/utils/firebase';
import { useUser } from '@clerk/nextjs';


interface TripData {
  bookingId: string;
  bookingDate: string;
  title: string;
  location: string;
  imageUrl: string;
  isUpcoming: boolean;
  isCompleted: boolean;
  isCanceled: boolean;
}

const TripsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'done'>('upcoming'); // Control current tab
  const [trips, setTrips] = useState<TripData[]>([]); // Store trips
  const [loading, setLoading] = useState<boolean>(true); // Loading status
  const { user } = useUser(); // Logged-in user

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) return;  // Skip if no user is logged in

      setLoading(true);  // Start loading

      const tripsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.id)  // Only fetch trips for this user
      );

      const tripDocs = await getDocs(tripsQuery);  // Fetch trip documents

      const tripData = tripDocs.docs.map((doc) => {
        const data = doc.data();
        const startDate = data.startDate.toDate();
        const endDate = data.endDate.toDate();
        
        return {
          bookingId: doc.id,
          bookingDate: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
          title: data.propertyTitle,
          location: data.location,
          imageUrl: data.imageUrl,
          isUpcoming: startDate > new Date() && data.status !== "canceled",
          isCompleted: endDate < new Date() && data.status !== "canceled",
          isCanceled: data.status === "canceled"
        };
      });

      setTrips(tripData);  // Update trips
      setLoading(false);   // End loading
    };

    fetchTrips();  // Call fetchTrips
  }, [user]);  // Rerun if user changes

  const filteredTrips = trips.filter(trip => {
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
