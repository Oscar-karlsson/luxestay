import React, { useState } from 'react';

interface GuestCountSelectorProps {
  onChange: (guestCount: number | string) => void;
  value: number | string | null;
}

const GuestCountSelector: React.FC<GuestCountSelectorProps> = ({ onChange, value }) => {
    const [selectedGuests, setSelectedGuests] = useState<number | string | null>(value);
  
    const options = [1, 2, 3, 4, 5, 6, 7, '8+'];
  
    const handleSelect = (option: number | string) => {
        setSelectedGuests(option);
        if (option === '8+') {
          onChange(8); // Pass 8 to indicate 8 or more guests
        } else {
          onChange(option);
        }
      };
  
    return (
        <div className="overflow-x-auto">
        <div className="flex space-x-2">
          <button
            onClick={() => handleSelect('All')}
            className={`px-4 py-2 rounded-full border ${
              selectedGuests === 'All' ? 'bg-accent text-white' : 'border-border'
            }`}
          >
            Any
          </button>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                selectedGuests === option ? 'bg-accent text-white' : 'border-border'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default GuestCountSelector;
