import React from 'react';
import { AiFillStar } from 'react-icons/ai';

interface RatingDisplayProps {
    averageRating: number;
    totalReviews: number;
  }
  
  const RatingDisplay: React.FC<RatingDisplayProps> = ({ averageRating = 0, totalReviews }) => (
    <div className="flex items-center space-x-1 text-gray-600">
      <AiFillStar className="text-yellow-500" />
      <span className="ml-1 font-semibold">
        {averageRating.toFixed(1)}
      </span>
      <span className="text-sm">({totalReviews})</span>
    </div>
  );

export default RatingDisplay;