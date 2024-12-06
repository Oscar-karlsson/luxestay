'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TripsSkeleton = () => {
    return (
      <div className="bg-card shadow-lg rounded-lg p-4 mb-4 max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
        {/* Booking ID and Booking Date */}
        <div className="mb-4">
          <Skeleton height={16} width="50%" className="mb-1" /> {/* Row 1 */}
          <Skeleton height={16} width="40%" /> {/* Row 2 */}
        </div>
  
        {/* Image and Details */}
        <div className="flex items-start mb-2">
          <Skeleton height={64} width={64} className="rounded-lg mr-4" /> {/* Image */}
          <div className="flex-grow">
            <Skeleton height={20} width="60%" className="mb-1" /> {/* Title */}
            <Skeleton height={16} width="50%" /> {/* Location */}
          </div>
        </div>
  
     {/* Buttons */}
<div className="mt-4 flex space-x-4">
  {/* Button 1 */}
  <div className="flex-1">
    <Skeleton height={36} width="100%" className="rounded-lg" />
  </div>
  {/* Button 2 */}
  <div className="flex-1">
    <Skeleton height={36} width="100%" className="rounded-lg" />
  </div>
</div>
    </div>
  );
};
  
  

export default TripsSkeleton;
