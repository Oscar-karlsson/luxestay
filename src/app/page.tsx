'use client';
import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { firestore } from '@/utils/firebase'; // Import Firebase setup
import SearchBar from '@/components/SearchBar';
import { getReviewsForProperty } from '@/services/reviewService';
import { calculateRatingData } from '@/utils/ratingUtils';
import { useSearch } from '@/context/SearchContext';

const Explore = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const { searchQuery, setSearchQuery, filteredProperties, setFilteredProperties, suggestions, setSuggestions } = useSearch();
  const [loading, setLoading] = useState(true);
  

  // Fetch property data from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'properties'));
        const propertiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const property = { id: doc.id, ...doc.data() };
            const reviews = await getReviewsForProperty(property.id);
            const { averageRating, totalReviews } = calculateRatingData(reviews);

            return {
              ...property,
              averageRating,
              totalReviews,
            };
          })
        );

        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties with reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [setFilteredProperties]);

useEffect(() => {
  if (!searchQuery) {
    setFilteredProperties(properties);
    setSuggestions([]);
    return;
  }

  const filtered = properties.filter(property =>
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
  setFilteredProperties(filtered);

  const locationSuggestions = Array.from(
    new Set(
      properties
        .flatMap(property => [property.city, property.country])
        .filter(location =>
          location && location.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
    )
  );
  setSuggestions(locationSuggestions.slice(0, 5));
}, [searchQuery, properties, setFilteredProperties, setSuggestions]);
  
  if (loading) {
    return <div>Loading properties...</div>; // Show loading indicator while data is being fetched
  }

  return (
    <div>
    {/* Sticky Search Bar: full-width and remains visible during scrolling */}
    <div className="sticky top-0 z-50 md:hidden w-full bg-primary border-b flex items-center justify-center h-20">
    <SearchBar
  placeholder="Where to?"
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onSearchSubmit={() => setFilteredProperties(filteredProperties)}
  onSuggestionClick={(suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Clear suggestions here
  }}
  suggestions={suggestions}
  setSuggestions={setSuggestions} // Ensure setSuggestions is passed here
/>

    </div>

    {/* Main content container for property listings */}
    <div className="container mx-auto p-6">
      <div className="mt-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                city={property.city}
                country={property.country}
                price={property.price}
                averageRating={property.averageRating}
                totalReviews={property.totalReviews}
                isFavorite={property.isFavorite || false}
                userId={property.userId}
                imageUrls={property.imageUrls || []}
              />
            ))
          ) : (
            <p>No properties found.</p>
        )}
      </div>
    </div>
  </div>
);
};

export default Explore;
