'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Property {
    price: number;
    beds: number;
    bedrooms: number;
    bathrooms: number;
    guestCount: number | string;
    type: string;
    features: string[];
    houseRules: string[];
    services: string[];
    safetyFeatures: string[];
  }



interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredProperties: any[];
    setFilteredProperties: (properties: any[]) => void;
    suggestions: string[];
    setSuggestions: (suggestions: string[]) => void;
    minPrice: number;
    maxPrice: number;
    setPriceRange: (min: number, max: number) => void;
    beds: number | null;
    setBeds: (beds: number | null) => void;
    bedrooms: number | null;
    setBedrooms: (bedrooms: number | null) => void;
    bathrooms: number | null;
    setBathrooms: (bathrooms: number | null) => void;
    guestCount: number | string | null;
    setGuestCount: (guestCount: number | string | null) => void;
    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;
    selectedFeatures: string[];
    setSelectedFeatures: (features: string[]) => void;
    selectedHouseRules: string[];
    setSelectedHouseRules: (rules: string[]) => void;
    selectedServices: string[];
    setSelectedServices: (services: string[]) => void;
    selectedSafetyFeatures: string[];
    setSelectedSafetyFeatures: (features: string[]) => void;
    resetFilters: () => void;
  }




  const SearchContext = createContext<SearchContextType | undefined>(undefined);

  export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [initialProperties, setInitialProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(50000);
    const [beds, setBeds] = useState<number | null>(null);
    const [bedrooms, setBedrooms] = useState<number | null>(null);
    const [bathrooms, setBathrooms] = useState<number | null>(null);
    const [guestCount, setGuestCount] = useState<number | string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedHouseRules, setSelectedHouseRules] = useState<string[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedSafetyFeatures, setSelectedSafetyFeatures] = useState<string[]>([]);
  

    // Fetch properties from Firestore on initial load
      // Fetch properties from Firestore
      useEffect(() => {
        const db = getFirestore();
        const fetchProperties = async () => {
          const snapshot = await getDocs(collection(db, "properties"));
          const propertiesData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              bathrooms: Number(data.baths),         // Convert 'baths' to number and rename to 'bathrooms'
              beds: Number(data.beds),               // Convert 'beds' to number
              bedrooms: Number(data.bedrooms),       // Convert 'bedrooms' to number
              guestCount: Number(data.maxGuests),    // Convert 'maxGuests' to number and rename to 'guestCount'
              price: Number(data.price),             // Convert 'price' to number, if it’s a string
              type: data.propertyType || data.type,  // Use 'propertyType' if available, fallback to 'type'
            } as Property;
          });
          setInitialProperties(propertiesData);
        };
        fetchProperties();
      }, []);

  // Filtering logic
  useEffect(() => {
    let updatedProperties = [...initialProperties];  // Use initialProperties as the base

    

    // Price range filter
    updatedProperties = updatedProperties.filter(
        (property) => property.price >= minPrice && (maxPrice === 50000 || property.price <= maxPrice)
      );

    // Beds, Bedrooms, Bathrooms, and Guest Count filters
    if (beds !== null) updatedProperties = updatedProperties.filter((property) => property.beds >= beds);
    if (bedrooms !== null) updatedProperties = updatedProperties.filter((property) => property.bedrooms >= bedrooms);
    if (bathrooms !== null) updatedProperties = updatedProperties.filter((property) => property.bathrooms >= bathrooms);
    if (guestCount !== null && guestCount !== 'All') {
        updatedProperties = updatedProperties.filter((property) => property.guestCount >= guestCount);
    }

    // Property Type filter
    if (selectedTypes.length > 0) {
        updatedProperties = updatedProperties.filter((property) => selectedTypes.includes(property.type));
      }

    // Features, House Rules, Services, and Safety Features filters
    if (selectedFeatures.length > 0) {
      updatedProperties = updatedProperties.filter((property) =>
        selectedFeatures.every((feature) => property.features.includes(feature))
      );
    }
    if (selectedHouseRules.length > 0) {
      updatedProperties = updatedProperties.filter((property) =>
        selectedHouseRules.every((rule) => property.houseRules.includes(rule))
      );
    }
    if (selectedServices.length > 0) {
      updatedProperties = updatedProperties.filter((property) =>
        selectedServices.every((service) => property.services.includes(service))
      );
    }
    if (selectedSafetyFeatures.length > 0) {
      updatedProperties = updatedProperties.filter((property) =>
        selectedSafetyFeatures.every((safety) => property.safetyFeatures.includes(safety))
      );
    }

    setFilteredProperties(updatedProperties);
  }, [
    initialProperties,
    minPrice,
    maxPrice,
    beds,
    bedrooms,
    bathrooms,
    guestCount,
    selectedTypes,
    selectedFeatures,
    selectedHouseRules,
    selectedServices,
    selectedSafetyFeatures,
  ]);

  // Reset function to clear all filters
  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(50000);
    setBeds(null);
    setBedrooms(null);
    setBathrooms(null);
    setGuestCount(null);
    setSelectedTypes([]);
    setSelectedFeatures([]);
    setSelectedHouseRules([]);
    setSelectedServices([]);
    setSelectedSafetyFeatures([]);
  
    // Reset `filteredProperties` to `initialProperties` after clearing all filters
    setFilteredProperties(initialProperties);
  };

    const setPriceRange = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
      };

  return (
    <SearchContext.Provider
    value={{
      searchQuery,
      setSearchQuery,
      filteredProperties,
      setFilteredProperties,
      suggestions,
      setSuggestions,
      minPrice,
      maxPrice,
      setPriceRange,
      beds,
      setBeds,
      bedrooms,
      setBedrooms,
      bathrooms,
      setBathrooms,
      guestCount,
      setGuestCount,
      selectedTypes,
      setSelectedTypes,
      selectedFeatures,
      setSelectedFeatures,
      selectedHouseRules,
      setSelectedHouseRules,
      selectedServices,
      setSelectedServices,
      selectedSafetyFeatures,
      setSelectedSafetyFeatures,
      resetFilters,
    }}
  >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};