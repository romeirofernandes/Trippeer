import { useState, useEffect } from 'react';
import { FaExchangeAlt, FaSpinner, FaInfoCircle, FaArrowRight, FaLightbulb, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const CurrencyConverter = ({ source, destination }) => {
  console.log("CurrencyConverter component rendered with source:", source, "and destination:", destination);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [travelTips, setTravelTips] = useState([]);

  // Get API key from environment variables
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    const fetchCurrencyData = async () => {

      
      // Add console logs to debug
      console.log(`Fetching currency data for: ${source} → ${destination}`);
      console.log(`%c[CURRENCY] Fetching data for: ${source} → ${destination}`, 'background: #9cadce; color: black; padding: 2px 5px; border-radius: 2px;');
  console.log(`%c[CURRENCY] API Key available: ${!!GEMINI_API_KEY}`, 'background: #9cadce; color: black; padding: 2px 5px; border-radius: 2px;');
      if (!source || !destination) {
        setLoading(false);
        return;
      }

      try {
        // Simple prompt to get currency info for both locations
        const prompt = `Give me currency information for a traveler going from "${source}" to "${destination}".
        
        Return ONLY a JSON object without any additional text:
        {
          "currencies": [
            {
              "country": "${source}",
              "currencyCode": "three-letter code",
              "currencyName": "full currency name",
              "currencySymbol": "symbol"
            },
            {
              "country": "${destination}", 
              "currencyCode": "three-letter code",
              "currencyName": "full currency name",
              "currencySymbol": "symbol"
            }
          ],
          "exchangeRate": "approximate exchange rate as number",
          "tips": [
            "tip 1 about currency exchange",
            "tip 2 about payment methods",
            "tip 3 about money safety",
            "tip 4 about banking/ATMs",
            "tip 5 about local customs"
          ]
        }`;
        
        // Call the Gemini API
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
              responseMimeType: "application/json"
            }
          }
        );
        
        // Debug the response
        console.log("API response received");
        
        // Parse the response
        const textContent = response.data.candidates[0].content.parts[0].text;
        
        // Clean up the response to extract just the JSON part
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : textContent;
        
        // Parse JSON
        const data = JSON.parse(jsonStr);
        console.log("Parsed currency data:", data);
        
        // Set the data in state
        setCurrencies(data.currencies || []);
        setTravelTips(data.tips || []);
        
        // Make currency data available to parent components
        if (data.currencies && data.currencies.length >= 2) {
          window.tripCurrencyData = {
            sourceInfo: {
              code: data.currencies[0].currencyCode,
              name: data.currencies[0].currencyName,
              symbol: data.currencies[0].currencySymbol,
              country: data.currencies[0].country
            },
            destinationInfo: {
              code: data.currencies[1].currencyCode,
              name: data.currencies[1].currencyName,
              symbol: data.currencies[1].currencySymbol,
              country: data.currencies[1].country
            },
            exchangeRate: data.exchangeRate || 1.0
          };
          
          console.log("Currency data saved for trip:", window.tripCurrencyData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching currency information:', err);
        setError('Could not load currency information. Please try again later.');
        
        // Fallback data
        const fallbackData = {
          currencies: [
            {
              country: source,
              currencyCode: "USD",
              currencyName: "US Dollar",
              currencySymbol: "$"
            },
            {
              country: destination,
              currencyCode: "EUR",
              currencyName: "Euro",
              currencySymbol: "€"
            }
          ],
          exchangeRate: 0.93,
          tips: [
            "Compare exchange rates at banks, ATMs, and exchange bureaus for the best deal.",
            "Inform your bank about travel plans to avoid card blocks on foreign transactions.",
            "Carry small amounts of local currency for immediate expenses upon arrival.",
            "Use credit cards with no foreign transaction fees when possible.",
            "Keep receipts from currency exchanges in case of disputes."
          ]
        };
        
        setCurrencies(fallbackData.currencies);
        setTravelTips(fallbackData.tips);
        
        // Also set global data for parent components
        window.tripCurrencyData = {
          sourceInfo: {
            code: fallbackData.currencies[0].currencyCode,
            name: fallbackData.currencies[0].currencyName,
            symbol: fallbackData.currencies[0].currencySymbol,
            country: fallbackData.currencies[0].country
          },
          destinationInfo: {
            code: fallbackData.currencies[1].currencyCode,
            name: fallbackData.currencies[1].currencyName,
            symbol: fallbackData.currencies[1].currencySymbol,
            country: fallbackData.currencies[1].country
          },
          exchangeRate: fallbackData.exchangeRate
        };
        
        setLoading(false);
      }
    };

    fetchCurrencyData();
  }, [source, destination]);

  if (!source || !destination) {
    return (
      <div className="bg-[#1a1a1a] p-6 rounded-lg text-center">
        <FaInfoCircle className="text-[#9cadce] text-2xl mx-auto mb-2" />
        <p className="text-white">Please set your source and destination to use the currency converter.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaExchangeAlt className="mr-2 text-[#9cadce]" /> Currency Converter
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-[#9cadce] mb-4" />
          <p className="text-gray-400">Fetching currency information...</p>
        </div>
      </div>
    );
  }

  if (currencies.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <FaExchangeAlt className="mr-2 text-[#9cadce]" /> Currency Converter
        </h2>
        <div className="bg-red-900 bg-opacity-30 p-4 rounded-md text-red-400">
          <p className="flex items-center">
            <FaInfoCircle className="mr-2" /> {error || 'Failed to load currency information.'}
          </p>
        </div>
      </div>
    );
  }
  
  // Extract source and destination currencies
  const sourceCurrency = currencies[0];
  const destCurrency = currencies[1];
  
  // Get exchange rate and ensure it's a number
  const exchangeRate = parseFloat(window.tripCurrencyData?.exchangeRate) || 1.0;

  // Sample amounts to convert
  const amounts = [10, 50, 100, 500, 1000];

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-md p-4 md:p-6 border border-[#9cadce] border-opacity-20">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
        <FaExchangeAlt className="mr-2 text-[#9cadce]" /> Currency Converter
      </h2>
      
      {/* Currency Information */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-sm md:text-base font-medium text-[#9cadce] mb-3">Currencies on your route</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {currencies.map((currency, i) => (
            <div key={i} className="bg-[#252525] px-4 py-3 rounded-lg flex items-center justify-between sm:justify-start">
              <span className="font-medium text-white text-sm md:text-base">{currency.country}</span>
              <span className="hidden sm:inline mx-2 text-gray-500">|</span>
              <span className="font-medium text-[#9cadce] text-sm md:text-base">{currency.currencySymbol} {currency.currencyCode}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Conversion Table */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-sm md:text-base font-medium text-[#9cadce] mb-3">Quick Conversion</h3>
        <div className="bg-[#252525] rounded-lg p-4">
          <div className="flex items-center justify-center mb-4">
            <div className="text-white text-sm md:text-base">{sourceCurrency.currencyCode}</div>
            <FaArrowRight className="text-[#9cadce] mx-3 md:mx-4" />
            <div className="text-white text-sm md:text-base">{destCurrency.currencyCode}</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <div key={amount} className="bg-[#1a1a1a] p-3 rounded-lg flex justify-between items-center">
                <span className="text-gray-400 text-sm md:text-base">
                  {amount} {sourceCurrency.currencySymbol}
                </span>
                <span className="text-white font-medium text-sm md:text-base">
                  {(amount * exchangeRate).toFixed(2)} {destCurrency.currencySymbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Travel Tips */}
      {travelTips.length > 0 && (
        <div className="mb-4">
          <h3 className="flex items-center text-sm md:text-base font-medium text-[#9cadce] mb-3">
            <FaLightbulb className="mr-2 text-yellow-500" /> Currency & Money Tips
          </h3>
          <div className="bg-[#252525] rounded-lg p-4">
            <ul className="space-y-3">
              {travelTips.map((tip, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#9cadce] bg-opacity-20 flex items-center justify-center mt-0.5 mr-3">
                    <span className="text-xs font-medium text-[#9cadce]">{i + 1}</span>
                  </div>
                  <span className="text-gray-300 text-sm md:text-base leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs md:text-sm text-gray-500 text-center md:text-left">
        Exchange rate: 1 {sourceCurrency.currencySymbol} = {Number(exchangeRate).toFixed(4)} {destCurrency.currencySymbol}
      </div>
    </div>
  );
};

export default CurrencyConverter;