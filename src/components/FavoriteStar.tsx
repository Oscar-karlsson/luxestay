import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

interface FavoriteStarProps {
  isFavorite: boolean;
}

const FavoriteStar: React.FC<FavoriteStarProps> = ({ isFavorite }) => (
  <span className="relative">
    {isFavorite ? (
      <AiFillStar className="text-3xl text-favoriteActive absolute" />  // Filled favorite star
    ) : (
      <AiFillStar className="text-3xl text-favoriteInactive absolute" />  // Inactive favorite star
    )}
    <AiOutlineStar className="text-3xl text-favoriteOutline relative" /> {/* Outlined star */}
  </span>
);

export default FavoriteStar;