'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import SearchBar from './SearchBar';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';
import { useSearch } from '@/context/SearchContext';

const TopNavbar = () => {
  const pathname = usePathname();
  const [properties, setProperties] = useState<any[]>([]);
  const { searchQuery, setSearchQuery, suggestions, setSuggestions, filteredProperties, setFilteredProperties } = useSearch();



  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
};


  useEffect(() => {
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'properties'));
      const propertiesData = querySnapshot.docs.map(doc => doc.data());
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
        setSuggestions([]);
        return;
    }

    const fetchSuggestions = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'properties'));
      const properties = querySnapshot.docs.map(doc => doc.data());
      
      const locationSuggestions = Array.from(
        new Set(
          properties
            .flatMap(property => [property.city, property.country])
            .filter(location => 
              location && 
              location.toLowerCase().startsWith(searchQuery.toLowerCase())
            )
        )
      );
  
      setSuggestions(locationSuggestions.slice(0, 5)); // Limit suggestions to 5 items
    };
  
    fetchSuggestions();
  }, [searchQuery]);

  // Function to handle when a suggestion is clicked
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const filtered = properties.filter(property =>
      property.city.toLowerCase().includes(suggestion.toLowerCase()) ||
      property.country.toLowerCase().includes(suggestion.toLowerCase())
    );
    setFilteredProperties(filtered);
    setSuggestions([]);
};

  const handleSearchSubmit = () => {
    console.log("Search submitted for:", searchQuery);
    if (!searchQuery) {
      setFilteredProperties(properties); // Reset to all properties if search is empty
    } else {
      const filtered = properties.filter(property =>
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    }
    setSuggestions([]); // Clear suggestions after search
  };

    return (
        <nav className="bg-navbar shadow-bottom  justify-between items-center p-4 md:flex hidden px-8"> {/* Only show on medium screens and larger */}
  <div className="flex items-center">
        <Link href="/">
          <img 
            src="/LuxeStay.svg"  // Image with text for larger screens
            alt="LuxeStay"
            className="hidden lg:block h-10"  // Hidden on small screens, visible on larger screens
          />
          <img 
            src="/LuxeStay - No_Text.svg"  // Image without text for smaller screens
            alt="LuxeStay - No Text"
            className="block lg:hidden h-10"  // Visible on small screens, hidden on larger screens
          />
        </Link>
      </div>
      
 {/* Search Bar */}
 <SearchBar 
placeholder="Where to?" 
searchQuery={searchQuery} 
onSearchChange={handleSearchChange} 
onSuggestionClick={handleSuggestionClick}
onSearchSubmit={handleSearchSubmit}
suggestions={suggestions}
setSuggestions={setSuggestions}  
/>




      <div className="flex items-center space-x-4">
       
                <Link href="/favorites" className={` text-link font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105 ${pathname === '/favorites' ? 'font-extrabold text-accent' : ''}`}>
                    Favorites
                </Link>
                <Link href="/trips" className={`text-link font-semibold hover:text-link-hover transition duration-200 transform hover:scale-105 ${pathname === '/trips' ? 'font-extrabold text-accent' : ''}`}>
                    Trips
                </Link>
                <Link href="/profile" className={`text-primary-text-color flex items-center space-x-2 ${pathname === '/profile' ? 'font-extrabold text-accent' : ''}`}>
                    <CgProfile className="text-3xl" />
                </Link>
      </div>
    </nav>
      );
    };

export default TopNavbar;