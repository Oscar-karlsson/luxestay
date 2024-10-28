'use client';
import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore methods
import { firestore } from '@/utils/firebase'; // Import Firebase setup
import SearchBar from '@/components/SearchBar';


const Explore = () => {
  const [properties, setProperties] = useState<any[]>([]); // State to store fetched properties
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Fetch property data from Firestore
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const querySnapshot = await getDocs(collection(firestore, 'properties')); // Fetch data from Firestore
        const propertiesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map documents to properties array
        setProperties(propertiesData); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchProperties(); // Call the function to fetch properties
  }, []);

  if (loading) {
    return <div>Loading properties...</div>; // Show loading indicator while data is being fetched
  }

  return (
    <div className="container mx-auto p-6">
      {/* Search Bar */}
      <div className="sticky top-0 z-50 md:hidden">
        <SearchBar placeholder="Where to?" />
      </div>

      {/* Property Listings */}
      <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            city={property.city}
            country={property.country}
            price={property.price}
            rating={property.rating ? parseFloat(property.rating) : 0}
            isFavorite={property.isFavorite || false}
            userId={property.userId}
            imageUrls={property.imageUrls || []}   // Handle cases where no images are available
            />
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
