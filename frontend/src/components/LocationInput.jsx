import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';

const LocationInput = ({ value, onChange }) => {
  // Track the display text separately from the full location object
  const [inputValue, setInputValue] = useState(value?.label || '');
  const [options, setOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(!!value?.lat);
  
  // Update input value when external value changes
  useEffect(() => {
    if (value && typeof value === 'object' && value.label) {
      setInputValue(value.label);
      setIsValid(true);
    }
  }, [value]);

  // Search locations with debounce
  const searchLocations = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setOptions([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: query,
              format: 'json',
              addressdetails: 1,
              limit: 5,
              'accept-language': 'en'
            }
          }
        );

        // Filter to include only cities, towns, or countries
        const validLocations = response.data.filter(location => {
          return (
            location.type === 'city' || 
            location.type === 'administrative' ||
            (location.address && 
              (location.address.city || 
               location.address.town || 
               location.address.state || 
               location.address.country))
          );
        });

        const formattedOptions = validLocations.map(location => {
          // Create a human-readable display name
          let displayName = '';
          const address = location.address;

          if (address) {
            const parts = [];
            if (address.city) parts.push(address.city);
            else if (address.town) parts.push(address.town);
            
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);
            
            displayName = parts.join(', ');
          } else {
            displayName = location.display_name.split(',').slice(0, 2).join(',');
          }

          return {
            value: displayName,
            label: displayName,
            lat: location.lat,
            lon: location.lon
          };
        });

        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error searching locations:', error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 150),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(false);
    searchLocations(value);
    
    // If user clears the input, inform parent component
    if (!value) {
      onChange(null);
    }
  };

  // Handle location selection
  const handleSelectLocation = (option) => {
    setInputValue(option.label); // Set just the display text for the input
    setIsValid(true);
    setIsFocused(false);
    onChange(option); // Pass the full object to parent
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#f8f8f8]">
        Starting Location
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaMapMarkerAlt className="text-[#9cadce]" />
        </div>
        <input
          type="text"
          value={inputValue} // Use the display text here
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`w-full pl-10 pr-4 py-2 bg-[#161616] border ${isValid ? 'border-green-500' : 'border-[#232323]'} rounded-lg 
            focus:ring-2 focus:ring-[#9cadce] transition-all text-[#f8f8f8]`}
          placeholder="Enter a city or country..."
          required
          autoComplete="off"
        />
        
        {isValid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaCheck className="text-green-500" />
          </div>
        )}
        
        {!isValid && inputValue && (
          <p className="mt-1 text-xs text-yellow-400">
            Please select a valid location from the dropdown
          </p>
        )}
        
        {/* Dropdown menu */}
        {isFocused && (
          <div className="absolute z-10 mt-1 w-full bg-[#161616] rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-[#9cadce] flex items-center">
                <FaSpinner className="animate-spin mr-2" /> Searching...
              </div>
            ) : options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-[#f8f8f8] cursor-pointer hover:bg-[#2a2a2a]"
                  onClick={() => handleSelectLocation(option)}
                >
                  {option.label}
                </div>
              ))
            ) : inputValue.length >= 2 ? (
              <div className="px-4 py-2 text-sm text-[#9cadce]">No results found</div>
            ) : (
              <div className="px-4 py-2 text-sm text-[#9cadce]">Type at least 2 characters</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInput;