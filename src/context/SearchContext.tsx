'use client'
import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProperties: any[];
  setFilteredProperties: (properties: any[]) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filteredProperties,
        setFilteredProperties,
        suggestions,
        setSuggestions,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};