import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import PriceRangeFilter from './PriceRangeFilter';
import { useSearch } from '@/context/SearchContext';
import NumberFilter from './NumberFIlter';
import PropertyTypeFilter from './PropertyTypeFilter';
import CheckboxFilter from './CheckboxFilter';
import { featuresOptions, houseRulesOptions, servicesOptions, safetyFeaturesOptions } from '@/data/propertyOptions';
import GuestCountSelector from './GuestCountSelector';

interface FilterModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
  }
  
  const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onRequestClose }) => {
    const { 
        minPrice, maxPrice, setPriceRange,
        beds, setBeds,
        bedrooms, setBedrooms,
        bathrooms, setBathrooms,
        guestCount, setGuestCount,
        selectedTypes, setSelectedTypes,
        selectedFeatures, setSelectedFeatures,
        selectedHouseRules, setSelectedHouseRules,
        selectedServices, setSelectedServices,
        selectedSafetyFeatures, setSelectedSafetyFeatures,
        filteredProperties, 
        resetFilters 
      } = useSearch();



    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, [isOpen]);

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Filter Options"
    className="filter-modal"
    overlayClassName="filter-overlay"
    ariaHideApp={false}
    
  >
    {/* Modal Header */}
    <div className="filter-header flex items-center border-b pb-2 mb-4">
  <FaTimes onClick={onRequestClose} className="cursor-pointer text-gray-500 mr-4" />
  <h2 className="filter-title text-xl font-bold flex-grow text-center">Filter</h2>
</div>

    {/* Modal Content */}
    <div className="filter-content overflow-y-auto flex-grow pb-20 max-h-[80vh]">
         {/* Price Range Filter */}
         <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={setPriceRange}
        />

<div className="border-b my-4"></div> {/* Divider */}

     {/* Number Filters */}
     <h3 className="text-lg font-semibold mb-2">Rooms and beds</h3>
     <NumberFilter label="Bedrooms" onChange={setBedrooms} min={1} max={8} value={bedrooms} />
<NumberFilter label="Beds" onChange={setBeds} min={1} max={8} value={beds} />
<NumberFilter label="Bathrooms" onChange={setBathrooms} min={1} max={8} value={bathrooms} />

<div className="border-b my-4"></div> {/* Divider */}
 {/* Guest Count Selector */}
 <h3 className="text-lg font-semibold mb-2">Number of guests</h3>
 <GuestCountSelector onChange={setGuestCount} value={guestCount} />
        <div className="border-b my-4"></div> {/* Divider */}

    {/* Property Type Filter */}
    <h3 className="text-lg font-semibold mb-2">Property Type</h3>
      <PropertyTypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
      
      <div className="border-b my-4"></div> {/* Divider */}

  {/* Features Filter */}
  <CheckboxFilter
          title="Features"
          options={featuresOptions}
          selectedOptions={selectedFeatures}
          onChange={setSelectedFeatures}
        />
        <div className="border-b my-4"></div> {/* Divider */}

        {/* House Rules Filter */}
        <CheckboxFilter
          title="House Rules"
          options={houseRulesOptions}
          selectedOptions={selectedHouseRules}
          onChange={setSelectedHouseRules}
        />
        <div className="border-b my-4"></div> {/* Divider */}

        {/* Services Filter */}
        <CheckboxFilter
          title="Services"
          options={servicesOptions}
          selectedOptions={selectedServices}
          onChange={setSelectedServices}
        />
        <div className="border-b my-4"></div> {/* Divider */}

        {/* Safety Features Filter */}
        <CheckboxFilter
          title="Safety Features"
          options={safetyFeaturesOptions}
          selectedOptions={selectedSafetyFeatures}
          onChange={setSelectedSafetyFeatures}
        />
    

</div>
    {/* Modal Footer */}
    <div className="filter-footer fixed bottom-0 left-0 w-full border-t bg-white flex justify-between items-center px-4 py-3">
    <button onClick={resetFilters} className="text-primaryText font-semibold">
  Clear All
</button>
      <button onClick={onRequestClose} className="bg-primaryButton text-primaryButtonText px-4 py-2 rounded-lg font-semibold">
  Show Results ({filteredProperties.length})
</button>
    </div>
  </Modal>
);
};

export default FilterModal;
