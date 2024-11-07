import React, { useState } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';

interface GuestCountSelectorProps {
  onChange: (guestCount: number | string | null) => void; // Allow null as a valid value
  value: number | string | null;
}

const GuestCountSelector: React.FC<GuestCountSelectorProps> = ({ onChange, value }) => {


  const options = [1, 2, 3, 4, 5, 6, 7, '8+'];

  const handleSelect = (option: number | string) => {
    if (option === 'All') {
      onChange(null); // Pass null to clear guest count
    } else if (option === '8+') {
      onChange(8); // Pass 8 to indicate 8 or more guests
    } else {
      onChange(option);
    }
  };

  return (
    <ScrollContainer className="flex space-x-2">
      <button
        onClick={() => handleSelect('All')}
        className={`px-4 py-2 rounded-full border ${
          value === null ? 'bg-accent text-white' : 'border-border'
        }`}
      >
        Any
      </button>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`w-10 min-w-10 h-10 flex items-center justify-center rounded-full border ${
            (value === option || (option === '8+' && typeof value === 'number' && value >= 8)) ? 'bg-accent text-white' : 'border-border'
          }`}
        >
          {option}
        </button>
      ))}
    </ScrollContainer>
  );
};

export default GuestCountSelector;
