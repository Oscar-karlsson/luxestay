import React from 'react';
import PropertyCard from '../components/PropertyCard';
import propertyData from '../data/properties.json'; 
import SearchBar from '@/components/SearchBar';

const Explore = () => {
  return (
    <div className="p-4 pb-24">
   

 {/* Search Bar */}
 <div className="sticky top-0 z-50 md:hidden">
        <SearchBar placeholder="Where to?" />
      </div>


      {/* Property Listings */}
      <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {propertyData.map((property) => (
            <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            pricePerNight={property.pricePerNight}
            rating={property.rating}
            isFavorite={property.isFavorite}
            images={property.images} // Pass the array of images
          />
        ))}
      </div>
    </div>
  );
};

export default Explore;
