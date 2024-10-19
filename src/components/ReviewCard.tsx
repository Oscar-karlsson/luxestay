import React, { useState } from 'react';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';
import { timeAgo } from '@/utils/dateUtils';

interface ReviewCardProps {
  name: string;
  review: string;
  date: string;
  ranking?: number;  // Make ranking optional
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, review, date, ranking }) => {
  const [showFullReview, setShowFullReview] = useState(false);
  const maxLength = 100; // Maximum number of characters before truncating

  // Toggle between showing full review and truncated version
  const toggleShowMore = () => {
    setShowFullReview(!showFullReview);
  };

  // Show truncated review if it's longer than maxLength
  const truncatedReview = review.length > maxLength ? review.substring(0, maxLength) + '...' : review;

  return (
    <div className="review-card bg-gray-100 p-4 rounded-lg shadow-md space-y-3">
      <div className="flex items-center space-x-4">
        {/* Placeholder profile picture */}
        <Image
          src="/profile.png"
          alt={`${name}'s profile picture`}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{timeAgo(date)}</p>
        </div>
      </div>

      <div className="text-gray-700">
        {showFullReview ? review : truncatedReview}
      </div>

      {/* Show More / Show Less button */}
      {review.length > maxLength && (
        <button onClick={toggleShowMore} className="text-blue-500 underline text-sm">
          {showFullReview ? 'Show Less' : 'Show More'}
        </button>
      )}

      <div className="flex items-center space-x-1">
        {/* Display ranking as stars */}
        {[...Array(5)].map((_, index) => (
          <AiFillStar
            key={index}
            className={index < (ranking || 0) ? 'text-yellow-500' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm text-gray-500">
          {ranking !== undefined && ranking !== null ? `(${ranking.toFixed(1)})` : '(No rating)'}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
