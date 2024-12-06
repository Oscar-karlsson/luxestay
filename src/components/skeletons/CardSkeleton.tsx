'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
  return (
    <div className="rounded-lg overflow-hidden w-full relative mt-6">
      {/* Image Skeleton */}
      <div className="relative h-48 lg:h-64 w-full">
      <Skeleton
  height="100%"
  borderRadius="12px 12px 0 0" // Top-left and top-right rounded
/>
</div>

      {/* Content Skeleton */}
      <div className="bg-white p-4 rounded-b-lg">
  <div className="space-y-2">
    {/* Title Skeleton */}
    <Skeleton height={20} width="75%" />

    {/* Location Skeleton */}
    <Skeleton height={18} width="60%" />

    {/* Price Skeleton */}
    <Skeleton height={18} width="40%" />
  </div>
</div>

      {/* Rating Skeleton */}
      <div className="absolute top-4 right-4">
        <Skeleton circle height={24} width={24} />
      </div>
    </div>
  );
};

export default CardSkeleton;
