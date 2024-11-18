import React, { useState } from 'react';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import { timeAgo } from '@/utils/dateUtils';

interface ReviewCardProps {
  name: string;
  review: string;
  date: string;
  ranking?: number;
  profileImageUrl?: string;
  onShowMore: (review: string) => void; 
  isFullContent?: boolean;  
}
  
const ReviewCard: React.FC<ReviewCardProps> = ({ name, review, date, ranking, profileImageUrl, onShowMore, isFullContent = false }) => {
  const maxLength = 100;
  const displayReview = isFullContent ? review : review.length > maxLength ? `${review.substring(0, maxLength)}...` : review;

  
    return (
      <div className="review-card bg-gray-100 p-4 rounded-lg shadow-md space-y-3 h-64 overflow-hidden">
        <div className="flex items-center space-x-4">
          {/* Display user profile picture */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
  <Image
    src={profileImageUrl || '/profile.png'}
    alt={`${name}'s profile picture`}
    width={48}
    height={48}
    className="object-cover w-full h-full"
  />
</div>
<div>
    <p className="font-semibold">{name}</p>
    <div className="flex items-center space-x-1 text-sm text-gray-500">
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <AiFillStar
                    key={index}
                    className={index < (ranking || 0) ? 'text-yellow-500' : 'text-gray-300'}
                />
            ))}
        </div>
        <span className="mx-1">•</span>
        <span>{timeAgo(date)}</span>
    </div>
</div>
        </div>
  
        <div className="text-primaryText break-words">
    {displayReview}
</div>
  
        {/* Show More button */}
        {review.length > maxLength && !isFullContent && (
    <button onClick={() => onShowMore(review)} className="text-accent text-b1-mobile font-semi-bold underline text-sm" aria-label={`Show full review for ${name}`}>
        Show More
    </button>
)}
  
        
      </div>
    );
  };
  

export default ReviewCard;
