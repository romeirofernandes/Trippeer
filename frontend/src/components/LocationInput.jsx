import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaSpinner, FaCheck, FaSearch, FaInfoCircle } from 'react-icons/fa';
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
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for a city..."
          className="w-full bg-[#232323] text-[#f8f8f8] rounded-xl md:rounded-2xl p-3 md:p-4 pl-10 text-sm md:text-base border border-[#9cadce]/20 focus:outline-none focus:ring-2 focus:ring-[#9cadce]/30"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9cadce]" />
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && options.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-10 w-full mt-2 bg-[#232323] rounded-xl md:rounded-2xl shadow-lg border border-[#9cadce]/20 max-h-60 overflow-y-auto"
        >
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleSelectLocation(option)}
              className="w-full px-4 py-3 text-left hover:bg-[#161616] transition-colors duration-200 flex items-center space-x-3"
              whileHover={{ x: 5 }}
            >
              <FaMapMarkerAlt className="text-[#9cadce] flex-shrink-0" />
              <div>
                <p className="text-sm md:text-base text-[#f8f8f8]">{option.label}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <FaSpinner className="animate-spin text-[#9cadce]" />
        </div>
      )}

      {/* Error Message */}
      {!isValid && inputValue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-red-900 bg-opacity-30 text-red-400 rounded-lg text-sm md:text-base"
        >
          <p className="flex items-center">
            <FaInfoCircle className="mr-2" /> Please select a valid location from the dropdown
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LocationInput;