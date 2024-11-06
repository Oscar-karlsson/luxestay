import React, { useState } from 'react';
import { FaHome, FaBuilding, FaHotel } from 'react-icons/fa';
import {  GiWoodCabin } from 'react-icons/gi';
import { MdCottage, MdChalet  } from "react-icons/md";

interface PropertyTypeFilterProps {
    selectedTypes: string[];
    onTypeChange: (types: string[]) => void;
}

// Define the property types and their icons directly inside the component
const propertyTypeOptions = [
  { type: 'Villa', icon: <FaHome /> },
  { type: 'Apartment', icon: <FaBuilding /> },
  { type: 'Penthouse', icon: <FaHotel /> },
  { type: 'Cabin', icon: <GiWoodCabin /> },
  { type: 'Cottage', icon: <MdCottage  /> },
  { type: 'Luxury Condo', icon: <FaHotel /> },
  { type: 'Chalet', icon: <MdChalet  /> },
];

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({ selectedTypes, onTypeChange }) => {
  const handleToggleType = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type) // Remove if already selected
      : [...selectedTypes, type];               // Add if not selected
    onTypeChange(updatedTypes);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {propertyTypeOptions.map((option) => (
        <button
          key={option.type}
          onClick={() => handleToggleType(option.type)}
          className={`inline-flex items-center p-2 border rounded-md ${
            selectedTypes.includes(option.type) ? 'border-border bg-blue-100' : 'border-gray-300'
          }`}
        >
          <span className="mr-2 text-lg">{option.icon}</span>
          <span>{option.type}</span>
        </button>
      ))}
    </div>
  );
};

export default PropertyTypeFilter;
