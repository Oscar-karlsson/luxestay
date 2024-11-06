'use client';
import React, { FunctionComponent, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";

interface SearchBarProps {
  placeholder: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
  onFilterClick: () => void; 
}


const SearchBar: FunctionComponent<SearchBarProps> = ({
  placeholder,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSuggestionClick,
  suggestions,
  setSuggestions,
  onFilterClick,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleClearInput = () => {
    onSearchChange('');
    setSuggestions([]); // Clear suggestions when input is cleared
  };

  useEffect(() => {
    if (suggestions.includes(searchQuery)) {
      setSuggestions([]); // Clear suggestions when a suggestion is selected
    }
  }, [searchQuery, suggestions, setSuggestions]);

  return (
    <div className="relative flex flex-col w-full max-w-lg mx-4">
      <div className="flex items-center w-full bg-white border rounded-full px-4 py-2 shadow-md">
      <FaSearch 
  className="mr-3 text-primaryText cursor-pointer" 
  onClick={onSearchSubmit} 
/>
<input
  type="text"
  value={searchQuery || ''} // Ensure value is always a string
  onChange={handleInputChange} 
  placeholder={placeholder}
  className="flex-grow focus:outline-none"
/>
        {searchQuery && (
          <FaTimes
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleClearInput}
          />
        )}
       <IoFilterCircleOutline 
  className="ml-3 text-primaryText text-3xl cursor-pointer" 
  onClick={onFilterClick} // Call the filter click handler here
/>
      </div>
      
      {/* Suggestions dropdown */}
    {/* Suggestions dropdown */}
{(suggestions && suggestions.length > 0) && (
  <ul className="absolute top-full mt-1 bg-white border rounded-md shadow-lg w-full max-w-lg z-50">
{suggestions.map((suggestion, index) => (
  <li
    key={index}
    className="p-2 cursor-pointer hover:bg-gray-100"
    onClick={() => {
      onSearchChange(suggestion); // Set input to selected suggestion
      setSuggestions([]);         // Directly clear suggestions here
    }}
  >
    {suggestion}
  </li>
))}
  </ul>
)}
    </div>
  );
};

export default SearchBar;