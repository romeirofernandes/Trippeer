import React, { useState, useEffect, useRef,useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaSpinner,
  FaClock, FaSuitcase, FaUtensils, FaUmbrellaBeach,
  FaInfoCircle, FaDownload, FaShare, FaUser, FaSun,
  FaExchangeAlt, FaCloudSun, FaMoon, FaCloud, FaArrowRight, FaGlobeAmericas, FaSave, FaCheck
} from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import { auth, onAuthStateChanged } from '../firebase.config';
import debounce from 'lodash.debounce';

const Itinerary = () => {
  // Add this state variable at the top with other state declarations

  const [startTime, setStartTime] = useState("early"); // 'early', 'mid', 'late'
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('medium'); // 'low', 'medium', 'high'
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [hasGeneratedItinerary, setHasGeneratedItinerary] = useState(false);

  const [sourceOptions, setSourceOptions] = useState([]);
const [destinationOptions, setDestinationOptions] = useState([]);
const [sourceValid, setSourceValid] = useState(false);
const [destinationValid, setDestinationValid] = useState(false);
const [isSourceFocused, setIsSourceFocused] = useState(false);
const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [user, setUser] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const planeMarkerRef = useRef(null);
  const animationRef = useRef(null);
  const itineraryRef = useRef(null);
  const mapSectionRef = useRef(null);

  const interestOptions = [
    { value: 'nature', label: 'Nature & Outdoors' },
    { value: 'history', label: 'History & Culture' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'relaxation', label: 'Relaxation & Wellness' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'art', label: 'Arts & Museums' }
  ];

  const ValidLocationIndicator = () => (
  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  </div>
);
  // Helper function to toggle interests
  const toggleInterest = (value) => {
    if (interests.includes(value)) {
      setInterests(interests.filter(i => i !== value));
    } else {
      setInterests([...interests, value]);
    }
  };

  // Add this function to search for locations
const searchLocations = useCallback(
  debounce(async (query, setOptions) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

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
          // Fallback to the display name provided by the API
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
    }
  }, 300),
  []
);

// Handle source input change
const handleSourceChange = (e) => {
  const value = e.target.value;
  setSource(value);
  setSourceValid(false);
  searchLocations(value, setSourceOptions);
};

// Handle destination input change
const handleDestinationChange = (e) => {
  const value = e.target.value;
  setDestination(value);
  setDestinationValid(false);
  searchLocations(value, setDestinationOptions);
};

// Handle selection from dropdown
const handleSelectLocation = (location, isSource) => {
  if (isSource) {
    setSource(location.value);
    setSourceOptions([]);
    setSourceValid(true);
    setIsSourceFocused(false);
  } else {
    setDestination(location.value);
    setDestinationOptions([]);
    setDestinationValid(true);
    setIsDestinationFocused(false);
  }
};
  // Scroll to map section
  const scrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to itinerary section
  const scrollToItinerary = () => {
    itineraryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Modify your map initialization useEffect
  useEffect(() => {
    // Only try to initialize when we have source, destination, the container is available, and we've generated an itinerary
    if (mapContainer.current && source && destination && hasGeneratedItinerary) {
      console.log("Initializing or updating map");

      // Give the DOM a moment to fully render before initializing map
      const initMapTimeout = setTimeout(() => {
        // If the map doesn't exist yet, create it
        if (!mapRef.current) {
          console.log("Creating new map instance");
          mapRef.current = L.map(mapContainer.current).setView([20, 0], 2);

          // Use a dark theme map style
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(mapRef.current);

          // Create custom plane icon
          const planeIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/1342/1342659.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          // Add invisible plane marker (will be shown during animation)
          planeMarkerRef.current = L.marker([0, 0], {
            icon: planeIcon,
            rotationAngle: 0,
            rotationOrigin: 'center center'
          });
        } else {
          // If map already exists, make sure it's properly sized for its container
          console.log("Map already exists, invalidating size");
          mapRef.current.invalidateSize(true);
        }

        // Always update map with current source and destination
        updateMap(source, destination);
      }, 100); // Short delay to ensure container is ready

      return () => clearTimeout(initMapTimeout);
    }
  }, [mapContainer.current, source, destination, hasGeneratedItinerary]);

  useEffect(() => {
    // Clean up the map when component unmounts
    return () => {
      console.log("Component unmounting, cleaning up map");
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // Get the current user when the component loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  // Function to get coordinates from location name
  const getCoordinates = async (location) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: location,
          format: 'json',
          limit: 1
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          coords: [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)],
          country: response.data[0].display_name.split(', ').slice(-1)[0]
        };
      }
      throw new Error(`Location not found: ${location}`);
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  };

  // Function to fetch dummy weather information
  const fetchWeatherInfo = async (country) => {
    // This would normally call a weather API
    const weatherTypes = ['Sunny', 'Partly Cloudy', 'Rainy', 'Clear', 'Stormy'];
    const randomTemp = Math.floor(Math.random() * 35) + 5; // 5-40°C
    const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    return {
      temperature: randomTemp,
      condition: weatherType,
      humidity: Math.floor(Math.random() * 60) + 30 // 30-90%
    };
  };

  // Function to fetch currency information
  const fetchCurrencyInfo = async (country) => {
    const currencyMap = {
      'United States': { code: 'USD', symbol: '$', name: 'US Dollar' },
      'France': { code: 'EUR', symbol: '€', name: 'Euro' },
      'Japan': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      'United Kingdom': { code: 'GBP', symbol: '£', name: 'British Pound' },
      'Australia': { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
      'Canada': { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
      'China': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
      'India': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      'Brazil': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
      'Mexico': { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
    };

    // Default currency info
    let currencyInfo = { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1.0 };

    // Try to find the country in our map
    for (const [key, value] of Object.entries(currencyMap)) {
      if (country.includes(key)) {
        currencyInfo = {
          ...value,
          exchangeRate: (Math.random() * 2 + 0.5).toFixed(2) // Random exchange rate between 0.5 and 2.5
        };
        break;
      }
    }

    return currencyInfo;
  };

  // Enhanced function to generate itinerary with Gemini API
  const generateItinerary = async (sourceName, destName, days, travelersCount, budgetLevel, interestsList, startTimePreference) => {
  try {
    // Get API key from environment variable
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      console.error('Missing Gemini API key in environment variables');
      throw new Error('API key not configured');
    }

    const interestsText = interestsList.length > 0
      ? `Interests include: ${interestsList.join(', ')}.`
      : '';

    const budgetText = {
      'low': 'on a limited budget (budget-friendly options)',
      'medium': 'with a moderate budget (mid-range options)',
      'high': 'with a luxury budget (high-end experiences)'
    }[budgetLevel];
    
    const startTimeText = {
      'early': 'Start the day early, with breakfast around 7:00 AM - 8:00 AM',
      'mid': 'Start the day at a regular pace, with breakfast around 8:00 AM - 9:00 AM',
      'late': 'Start the day in a relaxed manner, with breakfast around 9:00 AM - 10:00 AM'
    }[startTimePreference];

    const prompt = `You are a travel expert who creates detailed itineraries. Create a ${days}-day travel itinerary from ${sourceName} to ${destName} for ${travelersCount} travelers ${budgetText}. ${interestsText} 

${startTimeText} and schedule activities throughout the day in a logical sequence. For each day, include 4-6 activities with specific time slots (e.g., "09:00 AM - 10:30 AM"). Include breakfast, lunch and dinner with specific time slots. Make sure activities are appropriate for the destination and align with the travelers' interests and budget.

Also include estimated flight time in hours and approximate distance in km.

At the end, provide 2-3 accommodation suggestions appropriate for the entire stay (not different accommodations for each day), considering the budget level.

Return ONLY as JSON with this structure:
{
  "flightTime": number,
  "distance": number,
  "days": [
    {
      "day": number,
      "activities": [
        {
          "time": string (e.g., "09:00 AM - 11:30 AM"),
          "description": string
        }
      ]
    }
  ],
  "accommodationSuggestions": [
    {
      "name": string,
      "description": string,
      "priceRange": string
    }
  ],
  "travelTips": [string, string, string]
}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        }
      );

      // Parse the response
      let itineraryData;

      try {
        // Extract the text content from Gemini's response format
        const textContent = response.data.candidates[0].content.parts[0].text;

        // Find JSON content within the response (in case it's wrapped in markdown or other text)
        const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) ||
                          textContent.match(/{[\s\S]*}/);

        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;

        // Parse the JSON
        itineraryData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        throw new Error('Invalid response format from Gemini API');
      }

      // Return in expected format
      return {
        flightTime: itineraryData.flightTime,
        distance: itineraryData.distance,
        days: itineraryData.days,
        travelTips: itineraryData.travelTips || [
          "Remember to check visa requirements before traveling",
          "Currency exchange rates may vary, check before departure",
          "Always have travel insurance for international trips"
        ]
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);

      // Update the fallback data in the catch block of generateItinerary function

return {
  flightTime: Math.floor(Math.random() * 10) + 2,
  distance: Math.floor(Math.random() * 5000) + 500,
  days: Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    activities: [
      {
        time: "08:00 AM - 09:00 AM",
        description: "Breakfast at hotel"
      },
      {
        time: "09:30 AM - 12:00 PM",
        description: `Explore ${destName}'s city center`
      },
      {
        time: "12:30 PM - 02:00 PM",
        description: `Lunch at a popular local restaurant`
      },
      {
        time: "02:30 PM - 05:00 PM",
        description: `Visit popular tourist attractions in ${destName}`
      },
      {
        time: "06:00 PM - 08:00 PM",
        description: `Dinner and evening entertainment`
      }
    ]
  })),
  accommodationSuggestions: [
    {
      name: `${destName} Central Hotel`,
      description: "Comfortable accommodation in a central location with easy access to main attractions",
      priceRange: `${budget === 'high' ? '$$$' : (budget === 'medium' ? '$$' : '$')}`
    },
    {
      name: `${destName} Plaza Suites`,
      description: "Modern rooms with city views and complimentary breakfast",
      priceRange: `${budget === 'high' ? '$$$' : (budget === 'medium' ? '$$' : '$')}`
    }
  ],
  travelTips: [
    "Remember to check visa requirements before traveling",
    "Currency exchange rates may vary, check before departure",
    "Always have travel insurance for international trips"
  ]
};
    }
  };
// Add this time adjustment function before the return statement

// Function to adjust activity times earlier or later
const handleAdjustTimes = (dayIndex, direction) => {
  if (!itinerary || !itinerary.days) return;
  
  // Create a deep copy of the itinerary to modify
  const updatedItinerary = JSON.parse(JSON.stringify(itinerary));
  const day = updatedItinerary.days[dayIndex];
  
  if (!day || !day.activities) return;
  
  // Amount to adjust (in hours)
  const adjustment = direction === 'earlier' ? -1 : 1;
  
  // Adjust each activity's time
  day.activities = day.activities.map(activity => {
    if (!activity.time) return activity;
    
    // Parse time 
    const [timeRange, period] = activity.time.split(' ');
    const [startTime, endTime] = timeRange.split(' - ');
    
    // Function to adjust a time string by hours
    const adjustTime = (timeStr, periodStr, hours) => {
      const [hourStr, minuteStr] = timeStr.split(':');
      let hour = parseInt(hourStr);
      const isPM = periodStr === 'PM' && hour !== 12;
      const isAM = periodStr === 'AM' || hour === 12;
      
      // Convert to 24-hour format
      if (isPM) hour += 12;
      if (isAM && hour === 12) hour = 0;
      
      // Adjust hour
      hour = (hour + hours + 24) % 24;
      
      // Convert back to 12-hour format
      const newPeriod = hour >= 12 ? 'PM' : 'AM';
      const newHour = hour % 12 || 12;
      
      return {
        time: `${newHour}:${minuteStr}`,
        period: newPeriod
      };
    };
    
    // Adjust start and end times
    const [startPart, startPeriod] = startTime.includes(' ') ? startTime.split(' ') : [startTime, period];
    const [endPart, endPeriod] = endTime.includes(' ') ? endTime.split(' ') : [endTime, period];
    
    const adjustedStart = adjustTime(startPart, startPeriod || period, adjustment);
    const adjustedEnd = adjustTime(endPart, endPeriod || period, adjustment);
    
    // Format the new time string
    const newTime = `${adjustedStart.time} ${adjustedStart.period} - ${adjustedEnd.time} ${adjustedEnd.period}`;
    
    return {
      ...activity,
      time: newTime
    };
  });
  
  // Update the itinerary with adjusted times
  setItinerary(updatedItinerary);
};
  // Calculate bearing between two points
  const calculateBearing = (startLat, startLng, destLat, destLng) => {
    const toRad = (value) => (value * Math.PI) / 180;
    startLat = toRad(startLat);
    startLng = toRad(startLng);
    destLat = toRad(destLat);
    destLng = toRad(destLng);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  // Updated map function
  const updateMap = async (sourceLocation, destLocation) => {
    if (!mapContainer.current) {
      console.error("Map container is not available");
      return;
    }

    if (!mapRef.current) {
      console.log("Initializing map on demand");
      mapRef.current = L.map(mapContainer.current).setView([20, 0], 2);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(mapRef.current);
    }

    console.log("Updating map with:", sourceLocation, destLocation);
    try {
      // Get coordinates and country info for source and destination
      const sourceData = await getCoordinates(sourceLocation);
      const destData = await getCoordinates(destLocation);

      console.log("Source data:", sourceData);
      console.log("Destination data:", destData);

      const sourceCoords = sourceData.coords;
      const destCoords = destData.coords;

      // Fetch weather and currency info for destination
      const weatherData = await fetchWeatherInfo(destData.country);
      const currencyData = await fetchCurrencyInfo(destData.country);

      // Set state with this information
      setWeatherInfo(weatherData);
      setCurrency(currencyData);

      // Use coordinates for Leaflet [lat, lng] format
      const sourceLatLng = [sourceCoords[0], sourceCoords[1]];
      const destLatLng = [destCoords[0], destCoords[1]];

      console.log("Source LatLng:", sourceLatLng);
      console.log("Dest LatLng:", destLatLng);

      // Remove existing markers and route if they exist
      if (sourceMarkerRef.current) mapRef.current.removeLayer(sourceMarkerRef.current);
      if (destMarkerRef.current) mapRef.current.removeLayer(destMarkerRef.current);
      if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current);
      if (planeMarkerRef.current) planeMarkerRef.current.removeFrom(mapRef.current);
      if (animationRef.current) clearInterval(animationRef.current);

      // Use custom markers with our color scheme
      sourceMarkerRef.current = L.circleMarker(sourceLatLng, {
        radius: 8,
        fillColor: '#9cadce',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(mapRef.current)
        .bindPopup(`<b>${sourceLocation}</b><br>Starting point`);

      destMarkerRef.current = L.circleMarker(destLatLng, {
        radius: 8,
        fillColor: '#ff9cadce',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(mapRef.current)
        .bindPopup(`<b>${destLocation}</b><br>Destination`);

      // Draw a curved route line for a more realistic flight path
      const controlPoint = [
        (sourceLatLng[0] + destLatLng[0]) / 2 + (Math.random() * 10 - 5),
        (sourceLatLng[1] + destLatLng[1]) / 2 + (Math.random() * 10 - 5)
      ];

      // Create an arc path between the points
      const pointsArray = [];
      const steps = 100;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Quadratic Bezier curve formula
        const lat = Math.pow(1-t, 2) * sourceLatLng[0] +
                  2 * (1-t) * t * controlPoint[0] +
                  Math.pow(t, 2) * destLatLng[0];

        const lng = Math.pow(1-t, 2) * sourceLatLng[1] +
                  2 * (1-t) * t * controlPoint[1] +
                  Math.pow(t, 2) * destLatLng[1];

        pointsArray.push([lat, lng]);
      }

      // Draw route line with our color scheme
      routeLayerRef.current = L.polyline(pointsArray, {
        color: '#9cadce',
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(mapRef.current);

      // Create a simple plane icon (more reliable than images)
      const planeIcon = L.divIcon({
        className: 'plane-icon',
        html: '<div style="color: #9cadce; font-size: 20px; transform: rotate(0deg);">✈️</div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Add plane marker
      planeMarkerRef.current = L.marker(sourceLatLng, {
        icon: planeIcon
      }).addTo(mapRef.current);

      // Fit map bounds to show both markers
      const bounds = L.latLngBounds(sourceLatLng, destLatLng);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });

      // Animate plane along the route
      let step = 0;
      animationRef.current = setInterval(() => {
        if (step >= pointsArray.length - 1) {
          clearInterval(animationRef.current);
          return;
        }

        planeMarkerRef.current.setLatLng(pointsArray[step]);

        // Update rotation (simpler approach for emoji)
        if (step < pointsArray.length - 1) {
          const currentPoint = pointsArray[step];
          const nextPoint = pointsArray[step + 1];
          const bearing = calculateBearing(
            currentPoint[0], currentPoint[1],
            nextPoint[0], nextPoint[1]
          );

          // Update the HTML with new rotation
          const planeDiv = L.DomUtil.get(planeMarkerRef.current._icon).querySelector('div');
          if (planeDiv) {
            planeDiv.style.transform = `rotate(${bearing}deg)`;
          }
        }

        step++;
      }, 50);

    } catch (error) {
      console.error('Error updating map:', error);
      setError('Failed to show locations on map. Please check your inputs.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      // Update map with source and destination
      await updateMap(source, destination);

      // Generate itinerary using Gemini API
      const generatedItinerary = await generateItinerary(
        source,
        destination,
        days,
        travelers,
        budget,
        interests,
        startTime
      );

      setItinerary(generatedItinerary);
      setHasGeneratedItinerary(true);
      
      // Save the trip data to database if user is logged in
      if (user) {
        await saveTrip(generatedItinerary);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate itinerary. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save trip to database
  const saveTrip = async (generatedItinerary) => {
    try {
      let weatherInfo = {
        sourceWeather: window.tripWeatherData?.sourceWeather || {
          temperature: 20,
          condition: "Unknown",
          humidity: 50
        },
        destinationWeather: window.tripWeatherData?.destinationWeather || {
          temperature: 25,
          condition: "Unknown",
          humidity: 60
        },
        tempDiff: window.tripWeatherData?.tempDiff || 5
      };
      
      let currencyInfo = {
        sourceInfo: window.tripCurrencyData?.sourceInfo || {
          code: "USD",
          name: "US Dollar",
          symbol: "$"
        },
        destinationInfo: window.tripCurrencyData?.destinationInfo || {
          code: "EUR", 
          name: "Euro",
          symbol: "€"
        },
        exchangeRate: window.tripCurrencyData?.exchangeRate || 0.92
      };
      
      // If we don't have the window data, use our existing state data
      if (!window.tripWeatherData && weatherInfo) {
        weatherInfo = {
          sourceWeather: {
            temperature: weatherInfo.temperature || 20,
            condition: weatherInfo.condition || "Unknown",
            humidity: weatherInfo.humidity || 50
          },
          destinationWeather: {
            temperature: weatherInfo.temperature || 25,
            condition: weatherInfo.condition || "Unknown", 
            humidity: weatherInfo.humidity || 60
          },
          tempDiff: 5 // Default difference
        };
      }
      
      if (!window.tripCurrencyData && currency) {
        currencyInfo = {
          sourceInfo: {
            code: "USD",
            name: "US Dollar", 
            symbol: "$"
          },
          destinationInfo: {
            code: currency.code || "EUR",
            name: currency.name || "Euro",
            symbol: currency.symbol || "€"
          },
          exchangeRate: currency.exchangeRate || 0.92
        };
      }

      // Prepare the data to be saved
      const tripData = {
        firebaseUID: user.uid,
        source,
        destination,
        days,
        travelers,
        budget,
        interests,
        itinerary: generatedItinerary,
        weatherInfo: weatherInfo,
        currencyInfo: currencyInfo
      };

      // Save to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trips`,
        tripData
      );

      setSaveSuccess('Trip saved successfully to your dashboard!');
      
      // You can show a notification or update UI to indicate successful save
      console.log('Trip saved:', response.data);
    } catch (error) {
      console.error('Error saving trip:', error);
      setSaveError('Failed to save trip to your dashboard. Please try again.');
    }
  };

  // Function to download itinerary as PDF (simplified to text for this demo)
  const downloadItinerary = () => {
    if (!itinerary) return;

    // Create text content
    let content = `TRAVEL ITINERARY: ${source} to ${destination}\n`;
    content += `Duration: ${days} days | Travelers: ${travelers}\n`;
    content += `Flight Time: ${itinerary.flightTime} hours | Distance: ${itinerary.distance} km\n\n`;

    // Add day by day information
    itinerary.days.forEach(day => {
      content += `DAY ${day.day}\n`;
      day.activities.forEach((activity, i) => {
        content += `Activity ${i+1}: ${activity}\n`;
      });
      content += `Accommodation: ${day.accommodation.name} - ${day.accommodation.description}\n\n`;
    });

    // Add travel tips
    content += "TRAVEL TIPS:\n";
    itinerary.travelTips.forEach((tip, i) => {
      content += `- ${tip}\n`;
    });

    // Create a blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destination}-itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to share itinerary (simplified mock)
  const shareItinerary = () => {
    alert(`Share feature activated! In a real app, this would open sharing options to email or social media.`);
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return <FaCloud />;

    const conditionLower = condition.toLowerCase();

    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <FaSun />;
    } else if (conditionLower.includes('night') || conditionLower.includes('dark')) {
      return <FaMoon />;
    } else {
      return <FaCloud />;
    }
  };

  // Currency Converter Component
  const CurrencyConverter = ({ source, destination }) => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);

    useEffect(() => {
      // Fetch exchange rate data from an API
      const fetchExchangeRate = async () => {
        try {
          // In a real app, you would call a currency exchange API here
          // For this example, we'll use a mock exchange rate
          const mockRate = 0.85; // 1 USD = 0.85 EUR
          setExchangeRate(mockRate);
          setConvertedAmount((amount * mockRate).toFixed(2));
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      };

      fetchExchangeRate();
    }, [amount, fromCurrency, toCurrency]);

    return (
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Currency Converter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1" style={{ color: '#9cadce' }}>Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full p-2 rounded-md text-white"
              style={{ backgroundColor: '#111111', borderColor: '#9cadce', borderWidth: '1px' }}
            />
          </div>
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium mb-1" style={{ color: '#9cadce' }}>From</label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 rounded-md text-white"
              style={{ backgroundColor: '#111111', borderColor: '#9cadce', borderWidth: '1px' }}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium mb-1" style={{ color: '#9cadce' }}>To</label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 rounded-md text-white"
              style={{ backgroundColor: '#111111', borderColor: '#9cadce', borderWidth: '1px' }}
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
        </div>
        {convertedAmount && (
          <div className="mt-4 p-4 rounded-md" style={{ backgroundColor: '#111111' }}>
            <p className="text-lg font-medium" style={{ color: '#9cadce' }}>
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </p>
            <p className="text-sm" style={{ color: '#9cadce' }}>
              Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Weather Find Component
  const WeatherFind = ({ location }) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
      // Fetch weather data from an API
      const fetchWeatherData = async () => {
        try {
          // In a real app, you would call a weather API here
          // For this example, we'll use mock data
          const mockData = {
            temperature: 22,
            condition: 'Sunny',
            humidity: 65,
            windSpeed: 10
          };
          setWeatherData(mockData);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };

      fetchWeatherData();
    }, [location]);

    return (
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Weather in {location}</h2>
        {weatherData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: '#9cadce' }}>
                <FaSun className="text-black text-2xl" />
              </div>
              <div>
                <p className="text-lg font-medium" style={{ color: '#9cadce' }}>{weatherData.condition}</p>
                <p className="text-sm" style={{ color: '#9cadce' }}>{weatherData.temperature}°C</p>
              </div>
            </div>
            <div>
              <p className="text-sm" style={{ color: '#9cadce' }}>Humidity: {weatherData.humidity}%</p>
              <p className="text-sm" style={{ color: '#9cadce' }}>Wind Speed: {weatherData.windSpeed} km/h</p>
            </div>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#9cadce' }}>Loading weather data...</p>
        )}
      </div>
    );
  };

  // Add a save button to the itinerary section
  const renderSaveButton = () => {
    if (!user) {
      return (
        <div className="text-sm text-gray-500 mt-2">
          <span className="flex items-center">
            <FaInfoCircle className="mr-1" /> Sign in to save this itinerary to your dashboard
          </span>
        </div>
      );
    }

    return (
      <motion.button
        onClick={() => saveTrip(itinerary)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
        style={{ backgroundColor: '#9cadce' }}  // In a real app, this would open sharing options to email or social media.
        whileHover={{ scale: 1.05 }}          // For this example, we'll use a mock exchange rate
        whileTap={{ scale: 0.95 }}
      >
        <FaSave className="mr-2" /> Save to Dashboard
      </motion.button>
    );
  };

  // Add success or error message displays for saving
  const renderSaveStatus = () => {
    if (saveSuccess) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm"
        >
          <p className="flex items-center">
            <FaCheck className="mr-1" /> {saveSuccess}
          </p>
        </motion.div>
      );
    }

    if (saveError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm"
        >
          <p className="flex items-center">
            <FaInfoCircle className="mr-1" /> {saveError}
          </p>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#080808' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: '#ffffff' }}>
            <motion.span
              className="inline-block px-4 py-1 rounded-lg shadow-md"
              style={{ backgroundColor: '#9cadce' }}
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaPlane className="inline-block mr-2" /> Wanderlust
            </motion.span>
          </h1>
          <p className="mt-3 max-w-4xl mx-auto text-xl sm:mt-4" style={{ color: '#9cadce' }}>
            Your AI-powered travel planner for memorable adventures
          </p>
        </motion.div>

        {/* SECTION 1: TRIP DETAILS FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl shadow-xl overflow-hidden mb-8"
          style={{ backgroundColor: '#111111', borderColor: '#9cadce', borderWidth: '1px' }}
        >
          <div className="p-6">
            {/* Trip Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Plan Your Adventure</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 

<div>
  <label htmlFor="source" className="block text-sm font-medium" style={{ color: '#9cadce' }}>
    Starting From
  </label>
  <div className="mt-1 relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaMapMarkerAlt style={{ color: '#9cadce' }} />
    </div>
    <input
      type="text"
      id="source"
      value={source}
      onChange={handleSourceChange}
      onFocus={() => setIsSourceFocused(true)}
      onBlur={() => setTimeout(() => setIsSourceFocused(false), 200)}
      className={`block w-full pl-10 pr-4 py-3 sm:text-sm rounded-lg text-white 
        ${sourceValid ? 'border-green-500' : ''}`}
      style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
      placeholder="Enter a city or country..."
      required
      autoComplete="off"
      
    />
    {sourceValid && <ValidLocationIndicator />}
    {isSourceFocused && sourceOptions.length > 0 && (
      <div className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-[#9cadce] rounded-md shadow-lg max-h-60 overflow-auto">
        {sourceOptions.map((option, index) => (
          <div
            key={index}
            className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-[#2a2a2a]"
            onClick={() => handleSelectLocation(option, true)}
          >
            {option.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<div>
  <label htmlFor="destination" className="block text-sm font-medium" style={{ color: '#9cadce' }}>
    Destination
  </label>
  <div className="mt-1 relative rounded-md shadow-sm">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FaMapMarkerAlt style={{ color: '#9cadce' }} />
    </div>
    <input
      type="text"
      id="destination"
      value={destination}
      onChange={handleDestinationChange}
      onFocus={() => setIsDestinationFocused(true)}
      onBlur={() => setTimeout(() => setIsDestinationFocused(false), 200)}
      className={`block w-full pl-10 pr-4 py-3 sm:text-sm rounded-lg text-white
        ${destinationValid ? 'border-green-500' : ''}`}
      style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
      placeholder="Enter a city or country..."
      required
      autoComplete="off"
    />
    {destinationValid && <ValidLocationIndicator />}
    {isDestinationFocused && destinationOptions.length > 0 && (
      <div className="absolute z-10 mt-1 w-full bg-[#1a1a1a] border border-[#9cadce] rounded-md shadow-lg max-h-60 overflow-auto">
        {destinationOptions.map((option, index) => (
          <div
            key={index}
            className="px-4 py-2 text-sm text-white cursor-pointer hover:bg-[#2a2a2a]"
            onClick={() => handleSelectLocation(option, false)}
          >
            {option.label}
          </div>
        ))}
      </div>
    )}
  </div>
</div>


                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="days" className="block text-sm font-medium" style={{ color: '#9cadce' }}>
                      Trip Duration (Days)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt style={{ color: '#9cadce' }} />
                      </div>
                      <input
                        type="number"
                        id="days"
                        min="1"
                        max="30"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="block w-full pl-10 pr-4 py-3 sm:text-sm rounded-lg text-white"
                        style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="travelers" className="block text-sm font-medium" style={{ color: '#9cadce' }}>
                      Number of Travelers
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser style={{ color: '#9cadce' }} />
                      </div>
                      <input
                        type="number"
                        id="travelers"
                        min="1"
                        max="20"
                        value={travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value))}
                        className="block w-full pl-10 pr-4 py-3 sm:text-sm rounded-lg text-white"
                        style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9cadce' }}>Budget Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <input
                        type="radio"
                        id="budget-low"
                        name="budget"
                        className="sr-only"
                        checked={budget === 'low'}
                        onChange={() => setBudget('low')}
                      />
                      <label
                        htmlFor="budget-low"
                        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
                          budget === 'low'
                            ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
                            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
                        }`}
                      >
                        <span className="block text-sm font-medium">Economy</span>
                        <span className="block text-xs mt-1">$ Budget-friendly</span>
                      </label>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <input
                        type="radio"
                        id="budget-medium"
                        name="budget"
                        className="sr-only"
                        checked={budget === 'medium'}
                        onChange={() => setBudget('medium')}
                      />
                      <label
                        htmlFor="budget-medium"
                        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
                          budget === 'medium'
                            ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
                            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
                        }`}
                      >
                        <span className="block text-sm font-medium">Standard</span>
                        <span className="block text-xs mt-1">$$ Mid-range</span>
                      </label>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <input
                        type="radio"
                        id="budget-high"
                        name="budget"
                        className="sr-only"
                        checked={budget === 'high'}
                        onChange={() => setBudget('high')}
                      />
                      <label
                        htmlFor="budget-high"
                        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
                          budget === 'high'
                            ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
                            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
                        }`}
                      >
                        <span className="block text-sm font-medium">Luxury</span>
                        <span className="block text-xs mt-1">$$$ Premium</span>
                      </label>
                    </motion.div>
                  </div>
                  

<div>
  <label className="block text-sm font-medium mb-2" style={{ color: '#9cadce' }}>Daily Start Time</label>
  <div className="grid grid-cols-3 gap-3">
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <input
        type="radio"
        id="time-early"
        name="startTime"
        className="sr-only"
        checked={startTime === 'early'}
        onChange={() => setStartTime('early')}
      />
      <label
        htmlFor="time-early"
        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
          startTime === 'early'
            ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
        }`}
      >
        <span className="block text-sm font-medium">Early Bird</span>
        <span className="block text-xs mt-1">Start at 7-8 AM</span>
      </label>
    </motion.div>

    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <input
        type="radio"
        id="time-mid"
        name="startTime"
        className="sr-only"
        checked={startTime === 'mid'}
        onChange={() => setStartTime('mid')}
      />
      <label
        htmlFor="time-mid"
        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
          startTime === 'mid'
          ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
        }`}
      >
        <span className="block text-sm font-medium">Regular</span>
        <span className="block text-xs mt-1">Start at 8-9 AM</span>
      </label>
    </motion.div>

    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <input
        type="radio"
        id="time-late"
        name="startTime"
        className="sr-only"
        checked={startTime === 'late'}
        onChange={() => setStartTime('late')}
      />
      <label
        htmlFor="time-late"
        className={`cursor-pointer flex flex-col items-center justify-center w-full p-3 rounded-lg ${
          startTime === 'late'
            ? 'bg-[#1a1a1a] border-2 border-[#9cadce] text-[#9cadce]'
            : 'border border-gray-600 hover:border-[#9cadce] text-gray-300'
        }`}
      >
        <span className="block text-sm font-medium">Relaxed</span>
        <span className="block text-xs mt-1">Start at 9-10 AM</span>
      </label>
    </motion.div>
  </div>
</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#9cadce' }}>Travel Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interestOptions.map((option) => (
                      <motion.div key={option.value} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <input
                          type="checkbox"
                          id={`interest-${option.value}`}
                          className="sr-only"
                          checked={interests.includes(option.value)}
                          onChange={() => toggleInterest(option.value)}
                        />
                        <label
                          htmlFor={`interest-${option.value}`}
                          className={`cursor-pointer flex items-center justify-center w-full px-3 py-2 text-xs rounded-lg ${
                            interests.includes(option.value)
                              ? 'bg-[#1a1a1a] text-[#9cadce] border-2 border-[#9cadce]'
                              : 'border border-gray-600 text-gray-300 hover:border-[#9cadce]'
                          }`}
                        >
                          {option.label}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">

<motion.button
  type="submit"
  disabled={loading || !sourceValid || !destinationValid}
  className={`w-full py-3 px-6 flex items-center justify-center rounded-md shadow-sm font-medium ${
    loading || !sourceValid || !destinationValid
      ? 'bg-gray-600 cursor-not-allowed text-gray-300'
      : 'bg-[#9cadce] hover:bg-opacity-80 text-black'
  }`}
  whileHover={!loading && sourceValid && destinationValid ? { scale: 1.02 } : {}}
  whileTap={!loading && sourceValid && destinationValid ? { scale: 0.98 } : {}}
>
  {loading ? (
    <>
      <FaSpinner className="animate-spin mr-2" /> Generating Itinerary...
    </>
  ) : (
    'Create Travel Plan'
  )}
</motion.button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-900 bg-opacity-30 text-red-400 rounded-lg border border-red-700"
                  >
                    <p className="flex items-center">
                      <FaInfoCircle className="mr-2" /> {error}
                    </p>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Travel Tips and Info */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Travel Insights</h2>
              <motion.div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
                whileHover={{ boxShadow: '0 0 15px rgba(156, 173, 206, 0.3)' }}
              >
                <h3 className="text-lg font-medium mb-4" style={{ color: '#9cadce' }}>Tips for Amazing Trips</h3>
                <ul className="space-y-3">
                  <motion.li
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FaSuitcase className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                    <p className="text-gray-300">Pack light and smart. Check the weather forecast for your destination.</p>
                  </motion.li>
                  <motion.li
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaUtensils className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                    <p className="text-gray-300">Research local cuisine and try regional specialties for an authentic experience.</p>
                  </motion.li>
                  <motion.li
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaUmbrellaBeach className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                    <p className="text-gray-300">Balance planned activities with free time for spontaneous exploration.</p>
                  </motion.li>
                  <motion.li
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FaClock className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                    <p className="text-gray-300">Adjust to the local time zone quickly by staying awake until the local night time.</p>
                  </motion.li>
                  <motion.li
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FaSun className="mt-1 mr-3" style={{ color: '#9cadce' }} />
                    <p className="text-gray-300">Protect yourself from the sun with sunscreen, even on cloudy days at popular destinations.</p>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Map View Section */}
        {hasGeneratedItinerary && (
          <div ref={mapSectionRef} className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#ffffff' }}>Your Journey Map</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <motion.div
                  key="map"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  ref={mapContainer}
                  className="h-96 md:h-[500px] w-full rounded-lg border border-[#9cadce] shadow-lg overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(156, 173, 206, 0.2)' }}
                ></motion.div>
              </div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-lg shadow-md p-4 mb-6"
                  style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
                >
                  <h3 className="text-lg font-medium mb-4" style={{ color: '#9cadce' }}>Trip Overview</h3>
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                          <FaPlane className="text-black text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">From: {source}</p>
                          <p className="text-sm font-medium text-white">To: {destination}</p>
                        </div>
                      </div>
                    </motion.div>

                    {itinerary && (
                      <>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                              <FaClock className="text-black text-sm" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Flight Duration</p>
                              <p className="text-sm font-medium text-white">{itinerary.flightTime} hours</p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                              <FaMapMarkerAlt className="text-black text-sm" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Distance</p>
                              <p className="text-sm font-medium text-white">{itinerary.distance} kilometers</p>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}

                    {weatherInfo && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                            {getWeatherIcon(weatherInfo.condition)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Weather in {destination}</p>
                            <p className="text-sm font-medium text-white">
                              {weatherInfo.condition}, {weatherInfo.temperature}°C
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currency && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                            <span className="text-black font-bold">{currency.symbol}</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Local Currency</p>
                            <p className="text-sm font-medium text-white">
                              {currency.name} ({currency.code})
                            </p>
                            <p className="text-xs text-gray-500">
                              1 USD = {currency.exchangeRate} {currency.code}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <motion.button
                  onClick={scrollToItinerary}
                  className="w-full py-3 px-4 flex items-center justify-center rounded-md shadow-sm font-medium text-black"
                  style={{ backgroundColor: '#9cadce' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!itinerary}
                >
                  <FaArrowRight className="mr-2" /> View Detailed Itinerary
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* Itinerary Section */}
        {itinerary && (
          <div ref={itineraryRef} className="mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                {source} to {destination} Itinerary
              </h2>
              <div className="flex space-x-2">
                {/* Add the save button here */}
                {renderSaveButton()}
                <motion.button
                  onClick={downloadItinerary}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black"
                  style={{ backgroundColor: '#9cadce' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaDownload className="mr-2" /> Download
                </motion.button>
                <motion.button
                  onClick={shareItinerary}
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm"
                  style={{ borderColor: '#9cadce', color: '#9cadce' }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(156, 173, 206, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShare className="mr-2" /> Share
                </motion.button>
              </div>
            </motion.div>
            {/* Display save status */}
            {renderSaveStatus()}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 rounded-lg mb-6"
              style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
            >
              <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                    <FaCalendarAlt className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#9cadce' }}>Duration</p>
                    <p className="text-sm font-bold text-white">{days} Days</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                    <FaUser className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#9cadce' }}>Travelers</p>
                    <p className="text-sm font-bold text-white">{travelers} Persons</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                    <FaClock className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#9cadce' }}>Flight Time</p>
                    <p className="text-sm font-bold text-white">{itinerary.flightTime} Hours</p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#9cadce' }}>
                    <FaMapMarkerAlt className="text-black" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#9cadce' }}>Distance</p>
                    <p className="text-sm font-bold text-white">{itinerary.distance} km</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Day-by-day itinerary as timeline */}
// Replace the existing timeline component with this enhanced version

{/* Day-by-day itinerary as timeline */}
<div className="space-y-8 mb-8">
  {itinerary.days.map((day, index) => (
    <motion.div
      key={index}
      className="rounded-lg shadow-md overflow-hidden"
      style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ boxShadow: '0 0 15px rgba(156, 173, 206, 0.2)' }}
    >
      <div className="px-4 py-3" style={{ backgroundColor: '#9cadce' }}>
        <h3 className="font-semibold text-black">Day {day.day}</h3>
      </div>
      <div className="p-4">
        {/* Time ruler */}
        <div className="relative flex items-center mb-6">
          <div className="h-1 bg-[#9cadce] opacity-30 flex-grow"></div>
          <div className="absolute w-full flex justify-between px-2">
            <span className="text-[10px] text-[#9cadce]">06:00</span>
            <span className="text-[10px] text-[#9cadce]">12:00</span>
            <span className="text-[10px] text-[#9cadce]">18:00</span>
            <span className="text-[10px] text-[#9cadce]">00:00</span>
          </div>
        </div>
        
        {/* Activities on timeline */}
        <div className="space-y-4 relative">
          {day.activities.map((activity, i) => {
            // Parse time to position activities on timeline
            const timeString = activity.time || "";
            const startTime = timeString.split(' - ')[0];
            const startHour = parseInt(startTime.split(':')[0]) + (startTime.includes('PM') && !startTime.includes('12:') ? 12 : 0);
            const timePosition = ((startHour - 6 + 24) % 24) / 18 * 100; // Position based on 6am-midnight range
            
            return (
              <motion.div
                key={i}
                className="relative border-l-2 pl-4 pb-2"
                style={{ 
                  borderColor: '#9cadce',
                  marginLeft: `${Math.min(Math.max(timePosition, 0), 100)}%` 
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                whileHover={{ x: 5 }}
              >
                {/* Timeline dot */}
                <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#9cadce]"></div>
                
                {/* Activity card */}
                <div className="bg-[#111111] p-3 rounded-lg">
                  <p className="text-sm font-medium text-[#9cadce] mb-1">
                    {activity.time || `Activity ${i + 1}`}
                  </p>
                  <p className="text-gray-300">{activity.description || activity}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Time adjustment buttons */}
      <div className="px-4 py-2 bg-[#111111] flex justify-between items-center">
        <span className="text-xs text-[#9cadce]">Adjust times:</span>
        <div className="flex space-x-2">
          <button 
            className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#9cadce] hover:bg-[#9cadce] hover:text-black transition-colors"
            onClick={() => handleAdjustTimes(index, 'earlier')}
          >
            Earlier
          </button>
          <button 
            className="text-xs px-2 py-1 rounded bg-[#1a1a1a] text-[#9cadce] hover:bg-[#9cadce] hover:text-black transition-colors"
            onClick={() => handleAdjustTimes(index, 'later')}
          >
            Later
          </button>
        </div>
      </div>
    </motion.div>
  ))}
</div>
            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
  className="rounded-lg p-4 mb-6"
  style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
>
  <h3 className="font-semibold mb-3" style={{ color: '#9cadce' }}>
    <FaSuitcase className="inline-block mr-2" /> Accommodation Suggestions
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {itinerary.accommodationSuggestions?.map((accommodation, index) => (
      <motion.div
        key={index}
        className="bg-[#111111] p-4 rounded-lg"
        whileHover={{ scale: 1.02, backgroundColor: '#1e1e1e' }}
      >
        <h4 className="font-medium text-[#9cadce] mb-1">{accommodation.name}</h4>
        <p className="text-sm text-gray-300 mb-2">{accommodation.description}</p>
        <p className="text-xs inline-block px-2 py-1 rounded" 
           style={{ backgroundColor: 'rgba(156, 173, 206, 0.2)', color: '#9cadce' }}>
          {accommodation.priceRange}
        </p>
      </motion.div>
    ))}
  </div>
</motion.div>
            {/* Travel Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-lg p-4 mb-6"
              style={{ backgroundColor: '#1a1a1a', borderColor: '#9cadce', borderWidth: '1px' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: '#9cadce' }}>Travel Tips for {destination}</h3>
              <ul className="space-y-2">
                {itinerary.travelTips.map((tip, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    whileHover={{ x: 5 }}
                  >
                    <FaInfoCircle className="text-[#9cadce] mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}

        {/* Weather Section */}
        {itinerary && source && destination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <WeatherFind 
              source={source} 
              destination={destination}
              showAfterGeneration={true}
              weatherInfo={weatherInfo}
            />
          </motion.div>
        )}

        {/* Currency Section */}
        {itinerary && source && destination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CurrencyConverter source={source} destination={destination} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;
