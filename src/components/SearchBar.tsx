'use client';
import React, { FunctionComponent, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { IoFilterCircleOutline } from "react-icons/io5";

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: FunctionComponent<SearchBarProps> = ({ placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  return (
    <div className="relative flex flex-grow mx-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-full py-2 px-4 flex-grow focus:outline-none pl-10 pr-10"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primaryText" />
      {inputValue && (
        <FaTimes
  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-primaryText cursor-pointer hover:text-primaryText-hover rounded-full hover:bg-gray-200 p-1 text-xl"
  onClick={handleClearInput}
/>
      )}
      <IoFilterCircleOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primaryText cursor-pointer text-3xl" />
    </div>
  );
};

export default SearchBar;