import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaSpinner, 
  FaClock, FaSuitcase, FaUtensils, FaUmbrellaBeach, 
  FaInfoCircle, FaDownload, FaShare, FaUser, FaSun,
  FaExchangeAlt
} from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotatedmarker';
import CurrencyConverter from './CurrencyConverter';

const Itinerary = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState('medium'); // 'low', 'medium', 'high'
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('details'); // 'details', 'map', 'itinerary', 'currency'
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [currency, setCurrency] = useState(null);
  
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const planeMarkerRef = useRef(null);
  const animationRef = useRef(null);
  
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

  // Helper function to toggle interests
  const toggleInterest = (value) => {
    if (interests.includes(value)) {
      setInterests(interests.filter(i => i !== value));
    } else {
      setInterests([...interests, value]);
    }
  };
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    
    // Create map with a more modern tile layer
    mapRef.current = L.map(mapContainer.current).setView([20, 0], 2);
    
    // Use a nicer map style (Stamen Terrain)
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      subdomains: 'abcd'
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
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
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
          coords: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)],
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
  const generateItinerary = async (sourceName, destName, days, travelersCount, budgetLevel, interestsList) => {
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

      const prompt = `You are a travel expert who creates detailed itineraries. Create a ${days}-day travel itinerary from ${sourceName} to ${destName} for ${travelersCount} travelers ${budgetText}. ${interestsText} Include estimated flight time in hours, approximate distance in km, and 3 activities for each day that are appropriate for the destination and align with the travelers' interests and budget. Also include a recommended hotel or accommodation for each night.

      Return as JSON with this structure:
      {
        "flightTime": number,
        "distance": number,
        "days": [
          {
            "day": number,
            "activities": [string, string, string],
            "accommodation": {
              "name": string,
              "description": string
            }
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
      
      // More detailed fallback data if API call fails
      return {
        flightTime: Math.floor(Math.random() * 10) + 2,
        distance: Math.floor(Math.random() * 5000) + 500,
        days: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          activities: [
            `Explore ${destName}'s city center`,
            `Try local cuisine in ${destName}`,
            `Visit popular tourist attractions in ${destName}`
          ],
          accommodation: {
            name: `${destName} Central Hotel`,
            description: "Comfortable accommodation in a central location"
          }
        })),
        travelTips: [
          "Remember to check visa requirements before traveling",
          "Currency exchange rates may vary, check before departure",
          "Always have travel insurance for international trips"
        ]
      };
    }
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
  
  // Update map with source, destination and animate plane
  const updateMap = async (sourceLocation, destLocation) => {
    if (!mapRef.current) return;
    
    try {
      // Get coordinates and country info for source and destination
      const sourceData = await getCoordinates(sourceLocation);
      const destData = await getCoordinates(destLocation);
      
      const sourceCoords = sourceData.coords;
      const destCoords = destData.coords;
      
      // Fetch weather and currency info for destination
      const weatherData = await fetchWeatherInfo(destData.country);
      const currencyData = await fetchCurrencyInfo(destData.country);
      
      // Set state with this information
      setWeatherInfo(weatherData);
      setCurrency(currencyData);
      
      // Swap coordinates for Leaflet [lat, lng] format
      const sourceLatLng = [sourceCoords[1], sourceCoords[0]];
      const destLatLng = [destCoords[1], destCoords[0]];
      
      // Remove existing markers and route if they exist
      if (sourceMarkerRef.current) mapRef.current.removeLayer(sourceMarkerRef.current);
      if (destMarkerRef.current) mapRef.current.removeLayer(destMarkerRef.current);
      if (routeLayerRef.current) mapRef.current.removeLayer(routeLayerRef.current);
      if (planeMarkerRef.current) planeMarkerRef.current.removeFrom(mapRef.current);
      if (animationRef.current) clearInterval(animationRef.current);
      
      // Use nicer icons for source and destination markers
      // Create markers with custom icons
      const sourceIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container">
            <div class="pulse-ring"></div>
            <div class="marker source-marker">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });
      
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container">
            <div class="pulse-ring"></div>
            <div class="marker dest-marker">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });
      
      // Add source marker with popup
      sourceMarkerRef.current = L.marker(sourceLatLng, {
        icon: sourceIcon
      })
        .addTo(mapRef.current)
        .bindPopup(`<b>${sourceLocation}</b><br>Starting point`);
      
      // Add destination marker with popup
      destMarkerRef.current = L.marker(destLatLng, {
        icon: destIcon
      })
        .addTo(mapRef.current)
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
      
      // Draw fancy route line
      routeLayerRef.current = L.polyline(pointsArray, {
        color: '#4F46E5',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(mapRef.current);
      
      // Calculate bearing for plane rotation
      const bearing = calculateBearing(
        sourceLatLng[0], sourceLatLng[1],
        destLatLng[0], destLatLng[1]
      );
      
      // Create plane icon
      const planeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1342/1342659.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      // Add plane marker
      planeMarkerRef.current = L.marker(sourceLatLng, {
        icon: planeIcon,
        rotationAngle: bearing,
        rotationOrigin: 'center center'
      }).addTo(mapRef.current);
      
      // Animate plane along the curved route
      let step = 0;
      
      // Fit map bounds to show both markers
      const bounds = L.latLngBounds(sourceLatLng, destLatLng);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      
      // Animate plane along the route
      animationRef.current = setInterval(() => {
        if (step >= pointsArray.length - 1) {
          clearInterval(animationRef.current);
          return;
        }
        
        planeMarkerRef.current.setLatLng(pointsArray[step]);
        
        // Calculate bearing between current point and next point for smooth rotation
        if (step < pointsArray.length - 1) {
          const currentPoint = pointsArray[step];
          const nextPoint = pointsArray[step + 1];
          const currentBearing = calculateBearing(
            currentPoint[0], currentPoint[1],
            nextPoint[0], nextPoint[1]
          );
          planeMarkerRef.current.setRotationAngle(currentBearing);
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
    
    try {
      // Update map with source and destination
      await updateMap(source, destination);
      
      // Switch to map tab
      setCurrentTab('map');
      
      // Generate itinerary using Gemini API
      const generatedItinerary = await generateItinerary(
        source, 
        destination, 
        days, 
        travelers, 
        budget, 
        interests
      );
      
      setItinerary(generatedItinerary);
      
      // Switch to itinerary tab when ready
      setCurrentTab('itinerary');
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate itinerary. Please check your inputs and try again.');
      setCurrentTab('details'); // Stay on details tab if there's an error
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight sm:text-5xl">
            <span className="inline-block transform -rotate-3 bg-indigo-100 px-4 py-1 rounded-lg shadow-md">
              <FaPlane className="inline-block mr-2" /> Wanderlust
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-indigo-600 sm:mt-4">
            Your AI-powered travel planner for memorable adventures
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                currentTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setCurrentTab('details')}
            >
              Trip Details
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                currentTab === 'map'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setCurrentTab('map')}
              disabled={!source || !destination}
            >
              Map View
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                currentTab === 'itinerary'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setCurrentTab('itinerary')}
              disabled={!itinerary}
            >
              Itinerary
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm sm:text-base ${
                currentTab === 'currency'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setCurrentTab('currency')}
              disabled={!source || !destination}
            >
              <FaExchangeAlt className="inline-block mr-1" /> Currency
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Trip Details Tab */}
            {currentTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Trip Form */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Plan Your Adventure</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                          Starting From
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="h-5 w-5 text-indigo-500" />
                          </div>
                          <input
                            type="text"
                            id="source"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                            placeholder="New York, Tokyo..."
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                          Destination
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaMapMarkerAlt className="h-5 w-5 text-red-500" />
                          </div>
                          <input
                            type="text"
                            id="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                            placeholder="Paris, Bangkok..."
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                          Trip Duration (Days)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="h-5 w-5 text-indigo-500" />
                          </div>
                          <input
                            type="number"
                            id="days"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">
                          Number of Travelers
                                                </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-indigo-500" />
                          </div>
                          <input
                            type="number"
                            id="travelers"
                            min="1"
                            max="20"
                            value={travelers}
                            onChange={(e) => setTravelers(parseInt(e.target.value))}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget Level</label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
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
                                ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                                : 'border border-gray-300 hover:border-indigo-300'
                            }`}
                          >
                            <span className="block text-sm font-medium">Economy</span>
                            <span className="block text-xs mt-1">$ Budget-friendly</span>
                          </label>
                        </div>
                        
                        <div>
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
                                ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                                : 'border border-gray-300 hover:border-indigo-300'
                            }`}
                          >
                            <span className="block text-sm font-medium">Standard</span>
                            <span className="block text-xs mt-1">$$ Mid-range</span>
                          </label>
                        </div>
                        
                        <div>
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
                                ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700'
                                : 'border border-gray-300 hover:border-indigo-300'
                            }`}
                          >
                            <span className="block text-sm font-medium">Luxury</span>
                            <span className="block text-xs mt-1">$$$ Premium</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travel Interests</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {interestOptions.map((option) => (
                          <div key={option.value}>
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
                                  ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={loading || !source || !destination}
                        className={`w-full py-3 px-6 flex items-center justify-center rounded-md shadow-sm text-white font-medium ${
                          loading || !source || !destination
                            ? 'bg-indigo-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" /> Generating Itinerary...
                          </>
                        ) : (
                          'Create Travel Plan'
                        )}
                      </button>
                    </div>
                  </form>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                      <p className="flex items-center">
                        <FaInfoCircle className="mr-2" /> {error}
                      </p>
                    </div>
                  )}
                </div>

                {/* Travel Tips and Info */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Travel Insights</h2>
                  <div className="bg-indigo-50 p-6 rounded-xl">
                    <h3 className="text-lg font-medium text-indigo-900 mb-4">Tips for Amazing Trips</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FaSuitcase className="mt-1 mr-3 text-indigo-500" />
                        <p className="text-gray-700">Pack light and smart. Check the weather forecast for your destination.</p>
                      </li>
                      <li className="flex items-start">
                        <FaUtensils className="mt-1 mr-3 text-indigo-500" />
                        <p className="text-gray-700">Research local cuisine and try regional specialties for an authentic experience.</p>
                      </li>
                      <li className="flex items-start">
                        <FaUmbrellaBeach className="mt-1 mr-3 text-indigo-500" />
                        <p className="text-gray-700">Balance planned activities with free time for spontaneous exploration.</p>
                      </li>
                      <li className="flex items-start">
                        <FaClock className="mt-1 mr-3 text-indigo-500" />
                        <p className="text-gray-700">Adjust to the local time zone quickly by staying awake until the local night time.</p>
                      </li>
                      <li className="flex items-start">
                        <FaSun className="mt-1 mr-3 text-indigo-500" />
                        <p className="text-gray-700">Protect yourself from the sun with sunscreen, even on cloudy days at popular destinations.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Map Tab */}
            {currentTab === 'map' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div 
                    ref={mapContainer} 
                    className="h-96 md:h-[500px] w-full rounded-lg border border-gray-300 shadow-inner"
                  ></div>
                </div>
                <div>
                  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <FaPlane className="text-indigo-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">From: {source}</p>
                            <p className="text-sm font-medium text-gray-900">To: {destination}</p>
                          </div>
                        </div>
                      </div>
                      
                      {itinerary && (
                        <>
                          <div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <FaClock className="text-indigo-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Flight Duration</p>
                                <p className="text-sm font-medium text-gray-900">{itinerary.flightTime} hours</p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                <FaMapMarkerAlt className="text-indigo-600 text-sm" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Distance</p>
                                <p className="text-sm font-medium text-gray-900">{itinerary.distance} kilometers</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {weatherInfo && (
                        <div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <FaSun className="text-indigo-600 text-sm" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Weather in {destination}</p>
                              <p className="text-sm font-medium text-gray-900">
                                {weatherInfo.condition}, {weatherInfo.temperature}°C
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {currency && (
                        <div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <span className="text-indigo-600 font-bold">{currency.symbol}</span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Local Currency</p>
                              <p className="text-sm font-medium text-gray-900">
                                {currency.name} ({currency.code})
                              </p>
                              <p className="text-xs text-gray-500">
                                1 USD = {currency.exchangeRate} {currency.code}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentTab('itinerary')}
                    className={`w-full py-3 px-4 flex items-center justify-center rounded-md shadow-sm text-white font-medium ${
                      !itinerary
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                    disabled={!itinerary}
                  >
                    View Detailed Itinerary
                  </button>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {currentTab === 'itinerary' && itinerary && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {source} to {destination} Itinerary
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadItinerary}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <FaDownload className="mr-2" /> Download
                    </button>
                    <button
                      onClick={shareItinerary}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50"
                    >
                      <FaShare className="mr-2" /> Share
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaCalendarAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600">Duration</p>
                        <p className="text-sm font-bold">{days} Days</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaUser className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600">Travelers</p>
                        <p className="text-sm font-bold">{travelers} Persons</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaClock className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600">Flight Time</p>
                        <p className="text-sm font-bold">{itinerary.flightTime} Hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaMapMarkerAlt className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600">Distance</p>
                        <p className="text-sm font-bold">{itinerary.distance} km</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day-by-day itinerary */}
                <div className="space-y-8 mb-8">
                  {itinerary.days.map((day, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-indigo-600 px-4 py-3 text-white">
                        <h3 className="font-semibold">Day {day.day}</h3>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-700 mb-3">Activities</h4>
                        <ul className="space-y-3 mb-4">
                          {day.activities.map((activity, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-3">
                                {i + 1}
                              </span>
                              <span className="text-gray-700">{activity}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <h4 className="font-medium text-gray-700 mb-2">Accommodation</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-indigo-700">{day.accommodation.name}</p>
                          <p className="text-sm text-gray-600">{day.accommodation.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Travel Tips */}
                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-indigo-900 mb-3">Travel Tips for {destination}</h3>
                  <ul className="space-y-2">
                    {itinerary.travelTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <FaInfoCircle className="text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setCurrentTab('details')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Plan Another Trip
                  </button>
                </div>
              </div>
            )}
            
            {/* Currency Converter Tab */}
            {currentTab === 'currency' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Currency Converter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CurrencyConverter source={source} destination={destination} />
                  </div>
                  <div>
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Currency Tips</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <FaInfoCircle className="mt-1 mr-3 text-indigo-500" />
                          <p className="text-gray-700">Always check the exchange rate before exchanging currency at your destination.</p>
                        </li>
                        <li className="flex items-start">
                          <FaInfoCircle className="mt-1 mr-3 text-indigo-500" />
                          <p className="text-gray-700">Credit cards often offer better exchange rates than currency exchange services.</p>
                        </li>
                        <li className="flex items-start">
                          <FaInfoCircle className="mt-1 mr-3 text-indigo-500" />
                          <p className="text-gray-700">Inform your bank about your travel plans to avoid card blocks.</p>
                        </li>
                        <li className="flex items-start">
                          <FaInfoCircle className="mt-1 mr-3 text-indigo-500" />
                          <p className="text-gray-700">Keep some local currency for small purchases and emergencies.</p>
                        </li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => setCurrentTab('itinerary')}
                      className={`w-full py-3 px-4 flex items-center justify-center rounded-md shadow-sm text-white font-medium ${
                        !itinerary
                          ? 'bg-indigo-300 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                      disabled={!itinerary}
                    >
                      Back to Itinerary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;