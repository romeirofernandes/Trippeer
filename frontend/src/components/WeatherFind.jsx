import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaWind, FaUmbrella, FaTemperatureLow, FaTemperatureHigh, FaTshirt, FaInfoCircle, FaSpinner, FaLightbulb, FaExclamationTriangle, FaExchangeAlt } from 'react-icons/fa';
import { WiHumidity, WiThermometer } from 'react-icons/wi';
import { motion } from 'framer-motion';

const WeatherFind = ({ source, destination, showAfterGeneration = false, weatherInfo = null }) => {
  console.log("WeatherFind component rendered with source:", source, "and destination:", destination);
  const [sourceWeather, setSourceWeather] = useState(null);
  const [destinationWeather, setDestinationWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [weatherInsights, setWeatherInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Get API keys from environment variables
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
  const fetchWeather = async () => {
    if (!source || !destination) {
      setLoading(false);
      setError("Source and destination locations are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        console.error("Weather API key is missing. Check your .env file");
        throw new Error("Weather API key is missing");
      }

      console.log("Using API key:", API_KEY);
      console.log("Fetching weather data for:", source, destination);

      // Declare variables here
      let sourceResponse = null;
      let destResponse = null;

      // Fetch source weather
      try {
        sourceResponse = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: API_KEY,
              q: encodeURIComponent(source),
              days: 7,
              aqi: 'no',
              alerts: 'no'
            }
          }
        );

        if (!sourceResponse.data || !sourceResponse.data.current) {
          throw new Error(`Invalid response for source location: ${source}`);
        }

        setSourceWeather(sourceResponse.data);
        console.log("Source weather data:", sourceResponse.data);
      } catch (err) {
        console.error(`Error fetching source weather: ${err.message}`);
        throw new Error(`Error fetching source weather: ${err.message}`);
      }

      // Fetch destination weather
      try {
        destResponse = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json`,
          {
            params: {
              key: API_KEY,
              q: encodeURIComponent(destination),
              days: 7,
              aqi: 'no',
              alerts: 'no'
            }
          }
        );

        if (!destResponse.data || !destResponse.data.current) {
          throw new Error(`Invalid response for destination location: ${destination}`);
        }

        setDestinationWeather(destResponse.data);
        console.log("Destination weather data:", destResponse.data);
      } catch (err) {
        console.error(`Error fetching destination weather: ${err.message}`);
        throw new Error(`Error fetching destination weather: ${err.message}`);
      }
      console.log("Source weather API response:", sourceResponse?.data);
console.log("Destination weather API response:", destResponse?.data);
      // Only attempt to generate insights if we have valid data
      if (GEMINI_API_KEY) {
        if (
          sourceResponse &&
          sourceResponse.data &&
          sourceResponse.data.current &&
          destResponse &&
          destResponse.data &&
          destResponse.data.current
        ) {
          await generateWeatherInsights(sourceResponse.data, destResponse.data);
          await generateSuggestions(sourceResponse.data, destResponse.data);
        } else {
          console.warn("Skipping insights: missing current weather data");
        }
      } else {
        console.warn("Gemini API key missing - insights won't be generated");
      }

    } catch (err) {
      console.error("Weather data fetch error:", err);
      setError(`Failed to fetch weather data: ${err.message || "Unknown error"}`);

      // Clear any partial data
      setSourceWeather(null);
      setDestinationWeather(null);
      setSuggestions([]);
      setWeatherInsights(null);
    } finally {
      setLoading(false);
    }
  };

  if (source && destination) {
    fetchWeather();
  }
}, [source, destination, API_KEY]);

  // Helper function to create mock weather data if API fails but we have basic info
  const createMockWeatherData = (locationName, basicInfo) => {
    return {
      location: {
        name: locationName,
        country: locationName.split(',').pop()?.trim() || "Unknown Country",
      },
      current: {
        temp_c: basicInfo?.temperature || 20,
        condition: {
          text: basicInfo?.condition || "Partly cloudy"
        },
        humidity: basicInfo?.humidity || 65,
        wind_kph: 10,
        feelslike_c: basicInfo?.temperature || 20,
        precip_mm: 0
      },
      forecast: {
        forecastday: Array(7).fill(null).map((_, i) => ({
          date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
          day: {
            maxtemp_c: (basicInfo?.temperature || 20) + 3,
            mintemp_c: (basicInfo?.temperature || 20) - 3,
            condition: {
              text: basicInfo?.condition || "Partly cloudy"
            },
            daily_chance_of_rain: 20
          }
        }))
      }
    };
  };

  useEffect(() => {
    // Make weather data available to parent components through a global variable for access
    // But only if we have valid data from both locations
    if (sourceWeather && destinationWeather && 
        sourceWeather.current && destinationWeather.current) {
      try {
        // Calculate temperature difference
        const tempDiff = (destinationWeather.current.temp_c - sourceWeather.current.temp_c).toFixed(1);
        
        // Create an object with formatted weather data
        window.tripWeatherData = {
          sourceWeather: {
            temperature: sourceWeather.current.temp_c,
            condition: sourceWeather.current.condition.text,
            humidity: sourceWeather.current.humidity,
            windSpeed: sourceWeather.current.wind_kph
          },
          destinationWeather: {
            temperature: destinationWeather.current.temp_c,
            condition: destinationWeather.current.condition.text,
            humidity: destinationWeather.current.humidity,
            windSpeed: destinationWeather.current.wind_kph,
            forecast: destinationWeather.forecast.forecastday.map(day => ({
              date: day.date,
              maxTemp: day.day.maxtemp_c,
              minTemp: day.day.mintemp_c,
              condition: day.day.condition.text,
              chanceOfRain: day.day.daily_chance_of_rain
            }))
          },
          tempDiff: tempDiff
        };
      } catch (err) {
        console.error("Error formatting weather data:", err);
      }
    }
  }, [sourceWeather, destinationWeather]);

  // Function to generate detailed weather insights comparing the two locations
  const generateWeatherInsights = async (sourceData, destData) => {
    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      setWeatherInsights({
        summary: "Weather information is available, but detailed insights require an API key.",
        keyDifferences: ["Temperature variation", "Weather conditions", "Humidity levels"],
        recommendation: "Check the forecast details above to prepare for your trip."
      });
      return;
    }

    setInsightsLoading(true);

    try {
      const sourceTempC = sourceData.current.temp_c;
      const destTempC = destData.current.temp_c;
      const tempDiff = Math.abs(sourceTempC - destTempC).toFixed(1);
      const isDestWarmer = destTempC > sourceTempC;
      
      const sourceCondition = sourceData.current.condition.text;
      const destCondition = destData.current.condition.text;
      
      const sourceLocation = `${sourceData.location.name}, ${sourceData.location.country}`;
      const destLocation = `${destData.location.name}, ${destData.location.country}`;
      
      const destForecast = destData.forecast.forecastday.map(day => ({
        date: day.date,
        condition: day.day.condition.text,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        chanceOfRain: day.day.daily_chance_of_rain
      }));

      const prompt = `You are a climate and travel expert. Analyze the following weather data for a traveler going from ${sourceLocation} to ${destLocation}.
      
      SOURCE LOCATION (${sourceLocation}):
      - Current temperature: ${sourceTempC}°C
      - Current weather condition: ${sourceCondition}
      - Humidity: ${sourceData.current.humidity}%
      - Wind speed: ${sourceData.current.wind_kph} km/h
      
      DESTINATION LOCATION (${destLocation}):
      - Current temperature: ${destTempC}°C 
      - Current weather condition: ${destCondition}
      - Humidity: ${destData.current.humidity}%
      - Wind speed: ${destData.current.wind_kph} km/h
      
      TEMPERATURE DIFFERENCE:
      - The destination is ${tempDiff}°C ${isDestWarmer ? 'warmer' : 'cooler'} than the source
      
      DESTINATION 7-DAY FORECAST:
      ${JSON.stringify(destForecast, null, 2)}
      
      Based on this data, provide a concise weather analysis in JSON format with these fields:
      1. "summary": A 1-2 sentence overview of the key weather difference the traveler will experience
      2. "keyDifferences": Array of 3-4 specific climate factors that differ between locations
      3. "recommendation": A practical recommendation for the traveler based on the weather differences
      4. "phenomena": Any notable weather phenomena to be aware of at the destination
      
      Keep each field concise and directly relevant to the traveler's experience.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        }
      );

      // Parse the response
      try {
        const textContent = response.data.candidates[0].content.parts[0].text;
        
        // Find JSON content
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : textContent;
        
        // Parse the JSON
        const insightsData = JSON.parse(jsonStr);
        setWeatherInsights(insightsData);
      } catch (parseError) {
        console.error('Error parsing weather insights:', parseError);
        setWeatherInsights({
          summary: `When traveling from ${sourceLocation} to ${destLocation}, you'll experience a temperature difference of ${tempDiff}°C (${isDestWarmer ? 'warmer' : 'cooler'}).`,
          keyDifferences: [
            `Temperature (${sourceTempC}°C vs ${destTempC}°C)`,
            `Weather conditions (${sourceCondition} vs ${destCondition})`, 
            `Humidity (${sourceData.current.humidity}% vs ${destData.current.humidity}%)`
          ],
          recommendation: "Check the detailed forecast and pack accordingly for your trip."
        });
      }
    } catch (err) {
      console.error('Error generating weather insights:', err);
      setWeatherInsights({
        summary: `The weather in ${destination} differs from ${source}. Check the forecast for details.`,
        keyDifferences: ["Temperature", "Weather conditions", "Precipitation chances"],
        recommendation: "Pack for the specific conditions shown in the forecast above."
      });
    } finally {
      setInsightsLoading(false);
    }
  };

  // Function to generate AI-powered suggestions based on weather differences
  const generateSuggestions = async (sourceData, destData) => {
    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      setSuggestions([
        "Pack light and breathable clothing for warmer days at your destination.",
        "Don't forget an umbrella if precipitation is expected.",
        "Layer your clothing to adapt to changing temperatures.",
        "Consider the local weather pattesrns when planning outdoor activities."
      ]);
      return;
    }

    try {
      // Create a summary of the weather conditions
      const sourceTempC = sourceData.current.temp_c;
      const destTempC = destData.current.temp_c;
      const tempDiff = Math.abs(sourceTempC - destTempC).toFixed(1);
      const isDestWarmer = destTempC > sourceTempC;
      
      const sourceCondition = sourceData.current.condition.text;
      const destCondition = destData.current.condition.text;
      
      const destForecast = destData.forecast.forecastday.map(day => ({
        date: day.date,
        condition: day.day.condition.text,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        chanceOfRain: day.day.daily_chance_of_rain
      }));

      const prompt = `As a travel expert, provide 5 practical pieces of advice for someone traveling from ${source} (current temperature: ${sourceTempC}°C, ${sourceCondition}) to ${destination} (current temperature: ${destTempC}°C, ${destCondition}). The temperature difference is ${tempDiff}°C, with destination being ${isDestWarmer ? 'warmer' : 'cooler'}.

      Destination 7-day forecast summary: ${JSON.stringify(destForecast)}
      
      Focus on:
      1. Clothing recommendations based on the temperature difference and weather conditions
      2. Items to pack specifically for the destination weather
      3. Weather-appropriate activities
      4. Health considerations related to the climate change
      5. One weather-specific local custom or tip
      
      Format the response as a JSON array of 5 suggestion strings, each under 100 characters for compact display:
      ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"]`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        }
      );

      // Parse the response
      try {
        const textContent = response.data.candidates[0].content.parts[0].text;
        
        // Find JSON content
        const jsonMatch = textContent.match(/\[[\s\S]*\]/) || 
                          textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
        
        // Parse the JSON
        const suggestionsData = JSON.parse(jsonStr);
        setSuggestions(suggestionsData);
      } catch (parseError) {
        console.error('Error parsing suggestions:', parseError);
        setSuggestions([
          "Pack appropriate clothing for the destination's temperature difference.",
          "Consider the local weather when planning activities.",
          "Stay hydrated and protect yourself from the sun in warmer climates.",
          "Pack an umbrella or rain protection if precipitation is expected.",
          "Check local weather forecasts regularly during your stay."
        ]);
      }
    } catch (err) {
      console.error('Error generating suggestions:', err);
      setSuggestions([
        "Pack layers to adjust to changing temperatures.",
        "Consider the season at your destination when packing.",
        "Check the weather forecast before planning outdoor activities.",
        "Pack appropriate footwear for the expected conditions.",
        "Bring sun protection regardless of temperature."
      ]);
    }
  };

  // Function to get appropriate weather icon
  const getWeatherIcon = (condition) => {
    if (!condition) return <FaCloud />;
    
    const text = condition.text.toLowerCase();
    if (text.includes('sun') || text.includes('clear')) return <FaSun className="text-yellow-500" />;
    if (text.includes('rain') || text.includes('drizzle')) return <FaCloudRain className="text-blue-500" />;
    if (text.includes('snow') || text.includes('sleet') || text.includes('ice')) return <FaSnowflake className="text-blue-300" />;
    if (text.includes('cloud') || text.includes('overcast')) return <FaCloud className="text-gray-400" />;
    return <FaCloud className="text-gray-400" />;
  };

  // Day of week formatter
  const formatDay = (dateStr) => {
    if (!dateStr) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  // If showing only after generation is required and we don't have an itinerary yet
  // if (showAfterGeneration && !weatherInfo) {
  //   return null; // Don't render anything until travel plan is generated
  // }

  if (!source || !destination) {
    return (
      <div className="bg-indigo-50 p-6 rounded-lg text-center">
        <FaInfoCircle className="text-indigo-500 text-2xl mx-auto mb-2" />
        <p className="text-indigo-800">Please set your source and destination to view weather information.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaSun className="mr-2 text-yellow-500" /> Weather Comparison
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-indigo-500 mb-4" />
          <p className="text-gray-600">Fetching weather information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg shadow-md bg-[#111111] border border-[#232323]">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-[#f8f8f8]">
          <FaExclamationTriangle className="mr-2 text-red-500" /> Weather Error
        </h2>
        <div className="p-4 rounded-md bg-red-500/20 border border-red-500">
          <p className="flex items-center text-red-200">
            <FaInfoCircle className="mr-2 flex-shrink-0" /> {error}
          </p>
          <p className="mt-2 text-sm text-red-200">
            Check that your locations are valid and the API key is correctly configured.
          </p>
        </div>
        <div className="mt-4 text-sm text-[#9cadce]">
          <p>Troubleshooting steps:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-[#a0a0a0]">
            <li>Verify that "{source}" and "{destination}" are valid locations</li>
            <li>Check that your weather API key is valid in environment variables</li>
            <li>Ensure you have internet connectivity</li>
          </ul>
        </div>
      </div>
    );
  }

  // Calculate temperature difference
  const tempDiff = sourceWeather && destinationWeather ? 
    (destinationWeather.current.temp_c - sourceWeather.current.temp_c).toFixed(1) : 0;
  
  const tempDiffClass = tempDiff > 0 ? 'text-red-400' : (tempDiff < 0 ? 'text-blue-400' : 'text-gray-400');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Source Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#232323] rounded-xl p-4"
        >
          <h3 className="text-sm md:text-base font-medium text-[#f8f8f8] mb-3">Weather in {source}</h3>
          {sourceWeather ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#161616] flex items-center justify-center mr-3">
                    {getWeatherIcon(sourceWeather.current.condition)}
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-semibold text-[#f8f8f8]">
                      {sourceWeather.current.temp_c}°C
                    </p>
                    <p className="text-sm text-[#9cadce]">{sourceWeather.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#9cadce]">Humidity</p>
                  <p className="text-[#f8f8f8]">{sourceWeather.current.humidity}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20">
              <FaSpinner className="animate-spin text-[#9cadce]" />
            </div>
          )}
        </motion.div>

        {/* Destination Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#232323] rounded-xl p-4"
        >
          <h3 className="text-sm md:text-base font-medium text-[#f8f8f8] mb-3">Weather in {destination}</h3>
          {destinationWeather ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#161616] flex items-center justify-center mr-3">
                    {getWeatherIcon(destinationWeather.current.condition)}
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-semibold text-[#f8f8f8]">
                      {destinationWeather.current.temp_c}°C
                    </p>
                    <p className="text-sm text-[#9cadce]">{destinationWeather.current.condition.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#9cadce]">Humidity</p>
                  <p className="text-[#f8f8f8]">{destinationWeather.current.humidity}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20">
              <FaSpinner className="animate-spin text-[#9cadce]" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Temperature Difference */}
      {tempDiff !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#232323] rounded-xl p-4"
        >
          <h3 className="text-sm md:text-base font-medium text-[#f8f8f8] mb-3">Temperature Difference</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaExchangeAlt className="text-[#9cadce] mr-3" />
              <p className="text-[#f8f8f8]">
                {tempDiff > 0 ? 'Warmer' : 'Cooler'} by {Math.abs(tempDiff)}°C
              </p>
            </div>
            <div className="text-sm text-[#9cadce]">
              {tempDiff > 0 ? 'Pack lighter clothes' : 'Pack warmer clothes'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Weather Tips */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#232323] rounded-xl p-4"
        >
          <h3 className="text-sm md:text-base font-medium text-[#f8f8f8] mb-3">Weather Tips</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start text-sm md:text-base"
              >
                <FaInfoCircle className="text-[#9cadce] mt-1 mr-2 flex-shrink-0" />
                <span className="text-[#f8f8f8]">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherFind;
