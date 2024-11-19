'use client';
import React, { useEffect, useState } from 'react';
import PropertyCard from '../../components/PropertyCard';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { firestore } from '@/utils/firebase'; // Import Firebase setup
import SearchBar from '@/components/SearchBar';
import { getReviewsForProperty } from '@/services/reviewService';
import { calculateRatingData } from '@/utils/ratingUtils';
import { useSearch } from '@/context/SearchContext';
import FilterModal from '@/components/FilterModal';
import { useUser, SignIn } from '@clerk/clerk-react';
import { useSignInModal } from '@/components/SignInModalContext';

const Explore = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const { searchQuery, setSearchQuery, filteredProperties, setFilteredProperties, suggestions, setSuggestions } = useSearch();
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
const openFilterModal = () => setIsFilterModalOpen(true);
const closeFilterModal = () => setIsFilterModalOpen(false);
const { showSignInModal, setShowSignInModal } = useSignInModal();
const closeModal = () => setShowSignInModal(false);
const { user } = useUser();

const requireLogin = () => {
  if (!user) {
    setShowSignInModal(true);
    console.log("requireLogin called: opening sign-in modal");
  }
};
  

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
  setSuggestions={setSuggestions}
  onFilterClick={openFilterModal} // Pass the filter modal function here
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
                requireLogin={requireLogin}
              />
            ))
          ) : (
            <p>No properties found.</p>
        )}

<FilterModal isOpen={isFilterModalOpen} onRequestClose={closeFilterModal} />
      </div>
    </div>

    {showSignInModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="relative">
      <SignIn />
      <button
        onClick={() => setShowSignInModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
        style={{ background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: '1' }}
      >
        &times;
      </button>
    </div>
  </div>
)}
  </div>
);
};

export default Explore;
