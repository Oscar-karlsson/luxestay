'use client';
import { fetchFavoriteProperties } from '@/services/favoritesService';
import FavoriteCard from '@/components/FavoriteCard';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';




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
  const getFavorites = async () => {
    if (!userId) return;  // Ensure userId is available before fetching
    setLoading(true);
    try {
      const favorites = await fetchFavoriteProperties(userId);  // Fetch favorites using the userId
      setFavoriteProperties(favorites);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
    } finally {
      setLoading(false);
    }
  };

  getFavorites();
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
         <FavoriteCard property={property} userId={userId} />
        ))}
      </div>
    ) : (
      <p className="text-lg text-gray-600">You have no favorite properties yet.</p>
    )}
  </div>
);
};

export default FavoritesPage;
