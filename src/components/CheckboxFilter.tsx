import React, { useState } from 'react';

interface CheckboxFilterProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  maxVisible?: number; // Optional maximum number of initially visible options
  showMoreText?: string; // Optional text for the "Show More" button
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ title, options, selectedOptions, onChange, maxVisible = 5, showMoreText = "Show More" }) => {
    const [showAll, setShowAll] = useState(false);
  
    const handleToggle = (option: string) => {
      const updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((selected) => selected !== option)
        : [...selectedOptions, option];
      onChange(updatedOptions);
    };
  
    const visibleOptions = showAll ? options : options.slice(0, maxVisible);

  return (
    <div className="mb-4">
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {visibleOptions.map((option) => (
          <label key={option} className="flex text-b1-mobile items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleToggle(option)}
              className="form-checkbox h-5 w-5 accent-accent text-accent"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {options.length > maxVisible && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-accent hover:underline"
        >
          {showMoreText}
        </button>
      )}
    </div>
  );
};

export default CheckboxFilter;
