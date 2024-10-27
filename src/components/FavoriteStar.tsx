import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { addFavorite, removeFavorite } from '@/services/favoritesService';
import { useUser } from '@clerk/clerk-react'; // Import useUser from Clerk

interface FavoriteStarProps {
  propertyId: string;
  isFavorite: boolean;
}

const FavoriteStar: React.FC<FavoriteStarProps> = ({ propertyId, isFavorite }) => {
  const { user } = useUser(); // Get the current user
  const [favorite, setFavorite] = useState(isFavorite);

  const handleToggleFavorite = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userId = user.id; // Get the user ID from Clerk

    try {
      if (favorite) {
        await removeFavorite({ userId, propertyId });
        console.log("Removed from favorites");
      } else {
        await addFavorite({ userId, propertyId });
        console.log("Added to favorites");
      }
      setFavorite(!favorite); // Toggle the local state
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <span onClick={handleToggleFavorite} className="relative cursor-pointer">
      {favorite ? (
        <AiFillStar className="text-3xl text-favoriteActive absolute" />
      ) : (
        <AiFillStar className="text-3xl text-favoriteInactive absolute" />
      )}
      <AiOutlineStar className="text-3xl text-favoriteOutline relative" />
    </span>
  );
};

export default FavoriteStar;
