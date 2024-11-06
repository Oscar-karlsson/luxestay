import React, { useState, useEffect } from 'react';
import { Range } from 'react-range';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ minPrice, maxPrice, onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleRangeChange = (values: number[]) => {
    setPriceRange(values);
    onPriceChange(values[0], values[1]);
  };

  const handleInputChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    onPriceChange(newRange[0], newRange[1]);
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Price Range</h3>

      {/* Range Slider */}
      <Range
        values={priceRange}
        step={100}
        min={0}
        max={50000}
        onChange={handleRangeChange}
        renderTrack={({ props, children }) => (
          <div {...props} className="h-2 bg-gray-300 rounded-full mt-3">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="h-4 w-4 bg-blue-500 rounded-full cursor-pointer" />
        )}
      />

      {/* Input Fields for Min and Max */}
      <div className="flex justify-between mt-4 space-x-4">
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold">Min Price</label>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handleInputChange(0, Number(e.target.value))}
            className="w-24 p-1 border border-gray-300 rounded"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold">Max Price</label>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handleInputChange(1, Number(e.target.value))}
            className="w-24 p-1 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
