'use client';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfileSkeleton = () => {
  return (
    <div className="p-4 max-w-md w-full mt-4 sm:bg-white sm:shadow-md sm:rounded-lg sm:p-6 sm:mt-6">
      {/* Avatar and Name Centered in the Same Row */}
      <div className="flex items-center justify-center mb-6 space-x-2">
        <Skeleton circle height={72} width={72} /> {/* Avatar */}
        <Skeleton height={24} width={150} /> {/* Name */}
      </div>

      {/* Account Settings Section */}
      <div className="mb-6">
        <Skeleton height={20} width="40%" className="mb-3" /> {/* Section title */}
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b">
            <Skeleton circle height={20} width={20} className="mr-4" /> {/* Icon */}
            <Skeleton height={16} width="60%" /> {/* Text */}
            <Skeleton height={16} width="8%" /> {/* Arrow */}
          </div>
        ))}
      </div>

      {/* Legal Section */}
      <div className="mb-6">
        <Skeleton height={20} width="40%" className="mb-3" /> {/* Section title */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b">
            <Skeleton circle height={20} width={20} className="mr-4" /> {/* Icon */}
            <Skeleton height={16} width="60%" /> {/* Text */}
            <Skeleton height={16} width="8%" /> {/* Arrow */}
          </div>
        ))}
      </div>

      {/* Sign Out Button */}
      <div className="text-center">
        <Skeleton height={36} width="40%" />
      </div>
    </div>
  );
};

export default ProfileSkeleton;
