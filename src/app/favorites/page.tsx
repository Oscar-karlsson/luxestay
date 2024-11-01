'use client';
import { fetchFavoriteProperties } from '@/services/favoritesService';
import FavoriteCard from '@/components/FavoriteCard';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { getReviewsForProperty } from '@/services/reviewService';




type Property = {
  id: string;
  title: string;
  city: string;
  country: string;
  price: number;
  rating: number;
  userID: string;
  isFavorite: boolean;
  images: string[];
  reviews?: { name: string; review: string; date: string; ranking: number }[];
};


const FavoritesPage = () => {
  const { user } = useUser();  // Retrieve the logged-in user
  const userId = user ? user.id : null;  // Get the user ID directly
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);



// Fetch favorite properties from Firestore for the current user
useEffect(() => {
  const fetchFavoritesWithReviews = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const favorites = await fetchFavoriteProperties(userId);

      const favoritesWithRatings = await Promise.all(
        favorites.map(async (property) => {
          const reviews = await getReviewsForProperty(property.id);
          const totalReviews = reviews.length;
          const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

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

  fetchFavoritesWithReviews();
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
        property={property} 
        userId={userId} 
        averageRating={property.averageRating} 
        totalReviews={property.totalReviews} 
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
