import React, { useState } from 'react';

interface NumberFilterProps {
  label: string;
  onChange: (value: number | null) => void; // Passing null when set to "All"
  value: number | null;
  max?: number; // Optional max value
  min?: number; // Optional min value
}

const NumberFilter: React.FC<NumberFilterProps> = ({ label, onChange, max, min, value }) => {


  const handleIncrease = () => {
    const newValue = (value ?? 0) + 1;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const handleDecrease = () => {
    if (value === null || value === (min ?? 1)) {
      onChange(null); // Reset to "All"
      return;
    }
    const newValue = value - 1;
    onChange(newValue);
  };

  return (
    <div className="flex items-center justify-between py-2">
      {/* Label */}
      <span className="font-medium">{label}</span>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Decrease Button */}
        <button
  onClick={handleDecrease}
  className={`w-8 h-8 border rounded-full ${value === null || value === (min ?? 1) ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={value === null}
>
  −
</button>

        {/* Display All or Current Count */}
        <span className="font-semibold w-8 text-center">
  {value !== null ? (max !== undefined && value >= max ? `${max}+` : value) : "All"}
</span>

        {/* Increase Button */}
        <button
  onClick={handleIncrease}
  className={`w-8 h-8 border rounded-full bg-primary text-primaryText ${max !== undefined && value !== null && value >= max ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={max !== undefined && value !== null && value >= max}
>
  +
</button>
      </div>
    </div>
  );
};

export default NumberFilter;
