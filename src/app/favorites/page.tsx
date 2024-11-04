'use client';
import { fetchFavoriteProperties } from '@/services/favoritesService';
import FavoriteCard from '@/components/FavoriteCard';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { getReviewsForProperty } from '@/services/reviewService';
import { calculateRatingData } from '@/utils/ratingUtils';




type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: string;
  rating: number;
  userID: string;
  isFavorite: boolean;
  imageUrls: string[];
  reviews?: { name: string; review: string; date: string; ranking: number }[];
  averageRating?: number; 
  totalReviews?: number;
};


const FavoritesPage = () => {
  const { user } = useUser();  // Retrieve the logged-in user
  const userId = user ? user.id : '';   // Get the user ID directly
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);



// Fetch favorite properties from Firestore for the current user
useEffect(() => {
  const fetchFavoritesWithRatings = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const favorites = await fetchFavoriteProperties(userId); // Ensure favorites is fetched here

      const favoritesWithRatings = await Promise.all(
        favorites.map(async (property) => {
          const reviews = await getReviewsForProperty(property.id);
          const { averageRating, totalReviews } = calculateRatingData(reviews);

          return {
            ...property,
            averageRating,
            totalReviews,
          };
        })
      );

      setFavoriteProperties(favoritesWithRatings);
    } catch (error) {
      console.error('Error fetching favorite properties with reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchFavoritesWithRatings();
}, [userId]);

if (loading) {
  return <div>Loading favorite properties...</div>;
}



return (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Your Favorite Properties</h1>
    {favoriteProperties.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProperties.map((property) => (
        <FavoriteCard 
        key={property.id}
        property={property} 
        userId={userId} 
        averageRating={property.averageRating || 0}
        totalReviews={property.totalReviews || 0}
      />
        ))}
      </div>
    ) : (
      <p className="text-lg text-gray-600">You have no favorite properties yet.</p>
    )}
  </div>
);
};

export default FavoritesPage;
