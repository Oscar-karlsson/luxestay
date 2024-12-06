'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FavoritesSmallScreenSkeleton = () => {
  return (
    <div className="flex items-start space-x-4 mt-4 bg-white rounded-lg shadow-md p-4">
      {/* Image Skeleton */}
      <div className="w-24 h-24 rounded-md overflow-hidden">
        <Skeleton height="100%" />
      </div>
      
      {/* Text Skeleton */}
      <div className="flex-1 space-y-2">
        <Skeleton height={20} width="80%" />
        <Skeleton height={16} width="60%" />
        <Skeleton height={16} width="40%" />
      </div>
      
      {/* Favorite Icon Skeleton */}
      <div>
        <Skeleton circle height={24} width={24} />
      </div>
    </div>
  );
};

export default FavoritesSmallScreenSkeleton;
