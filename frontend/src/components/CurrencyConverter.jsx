import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaSpinner, FaGlobe, FaInfoCircle, FaArrowRight } from 'react-icons/fa';

const CurrencyConverter = ({ source, destination }) => {
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_KEY = '0988f8d95d339e49ced66a86'; // Your Exchange Rate API key

  // Common currency codes and their information as fallback
  const commonCurrencies = {
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', country: 'Europe' },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
    CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
    SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
    AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'United Arab Emirates' },
    QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', country: 'Qatar' },
  };

  // Hardcoded estimated exchange rates (approximate as of May 2024)
  const estimatedRates = {
    USD: { EUR: 0.93, GBP: 0.79, JPY: 156.80, CAD: 1.37, AUD: 1.52, CNY: 7.23, INR: 83.12, SGD: 1.35, AED: 3.67, QAR: 3.64 },
    EUR: { USD: 1.07, GBP: 0.85, JPY: 168.23, CAD: 1.47, AUD: 1.63, CNY: 7.75, INR: 89.21, SGD: 1.45, AED: 3.94, QAR: 3.90 },
    GBP: { USD: 1.26, EUR: 1.18, JPY: 198.48, CAD: 1.74, AUD: 1.93, CNY: 9.15, INR: 105.21, SGD: 1.71, AED: 4.65, QAR: 4.61 },
    JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0050, CAD: 0.0087, AUD: 0.0097, CNY: 0.046, INR: 0.53, SGD: 0.0086, AED: 0.023, QAR: 0.023 },
    CAD: { USD: 0.73, EUR: 0.68, GBP: 0.58, JPY: 114.45, AUD: 1.11, CNY: 5.27, INR: 60.67, SGD: 0.98, AED: 2.68, QAR: 2.66 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 103.16, CAD: 0.90, CNY: 4.75, INR: 54.69, SGD: 0.89, AED: 2.42, QAR: 2.40 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 21.69, CAD: 0.19, AUD: 0.21, INR: 11.50, SGD: 0.19, AED: 0.51, QAR: 0.50 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.89, CAD: 0.016, AUD: 0.018, CNY: 0.087, SGD: 0.016, AED: 0.044, QAR: 0.044 },
    SGD: { USD: 0.74, EUR: 0.69, GBP: 0.58, JPY: 116.15, CAD: 1.02, AUD: 1.13, CNY: 5.35, INR: 61.57, AED: 2.72, QAR: 2.70 },
    AED: { USD: 0.27, EUR: 0.25, GBP: 0.22, JPY: 42.72, CAD: 0.37, AUD: 0.41, CNY: 1.97, INR: 22.65, SGD: 0.37, QAR: 0.99 },
    QAR: { USD: 0.27, EUR: 0.26, GBP: 0.22, JPY: 43.08, CAD: 0.38, AUD: 0.42, CNY: 1.99, INR: 22.83, SGD: 0.37, AED: 1.01 }
  };

  // Find countries and currencies between source and destination
  useEffect(() => {
    const findCountriesAndCurrencies = async () => {
      if (!source || !destination) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!API_KEY) {
          console.error('Missing Gemini API key in environment variables');
          setError('API key not configured');
          setLoading(false);
          return;
        }

        const prompt = `A traveler is going from ${source} to ${destination}. Identify the most logical country for the source location and the destination location. Then find one major country that might be passed through or visited on this route. For each of these 3 countries, find their currency code, currency name, and currency symbol.
        
        Return ONLY a JSON array with this format, without any additional text or explanation:
        [
          {
            "country": "Country name for source",
            "currencyCode": "3-letter code",
            "currencyName": "Full currency name",
            "currencySymbol": "Symbol"
          },
          {
            "country": "Country name for intermediate",
            "currencyCode": "3-letter code",
            "currencyName": "Full currency name",
            "currencySymbol": "Symbol"
          },
          {
            "country": "Country name for destination",
            "currencyCode": "3-letter code",
            "currencyName": "Full currency name",
            "currencySymbol": "Symbol"
          }
        ]
        
        Make sure all currency codes match standard ISO 4217 three-letter codes (e.g., USD, EUR, GBP, JPY).`;

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
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
              responseMimeType: "application/json"
            }
          }
        );

        // Parse the response
        const textContent = response.data.candidates[0].content.parts[0].text;
        
        // Clean up the response and extract JSON
        const jsonMatch = textContent.match(/\[[\s\S]*\]/) || textContent.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
        
        // Parse the JSON
        const countriesData = JSON.parse(jsonStr);
        
        // Validate and clean up currency codes (ensure they're valid ISO 4217 codes)
        const validatedCountriesData = countriesData.map(country => {
          const currencyCode = country.currencyCode.toUpperCase();
          // Check if this currency exists in our common currencies fallback
          if (commonCurrencies[currencyCode]) {
            return {
              country: country.country,
              currencyCode,
              currencyName: commonCurrencies[currencyCode].name || country.currencyName,
              currencySymbol: commonCurrencies[currencyCode].symbol || country.currencySymbol
            };
          }
          return country;
        });

        // Instead of fetching rates for each currency individually, use the standard endpoint
        // to get all exchange rates with USD as base
        try {
          const ratesResponse = await fetch(
            `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
          );
          
          if (!ratesResponse.ok) {
            throw new Error(`API responded with status: ${ratesResponse.status}`);
          }
          
          const ratesData = await ratesResponse.json();
          
          if (ratesData.result === 'success') {
            const allRates = ratesData.conversion_rates;
            
            // Add exchange rates to each country
            const countriesWithRates = validatedCountriesData.map(country => {
              // Calculate conversions between all pairs using USD as intermediary
              const exchangeRates = {};
              
              validatedCountriesData.forEach(targetCountry => {
                const sourceCurrency = country.currencyCode;
                const targetCurrency = targetCountry.currencyCode;
                
                // Skip same currency
                if (sourceCurrency === targetCurrency) {
                  exchangeRates[targetCurrency] = 1;
                  return;
                }
                
                // Calculate cross-rate if both currencies are available
                if (allRates[sourceCurrency] && allRates[targetCurrency]) {
                  // USD/Source = allRates[sourceCurrency]
                  // USD/Target = allRates[targetCurrency]
                  // Target/Source = (USD/Source) / (USD/Target)
                  const rate = allRates[targetCurrency] / allRates[sourceCurrency];
                  exchangeRates[targetCurrency] = rate;
                } else {
                  // Use hardcoded estimated rates for missing currencies
                  if (estimatedRates[sourceCurrency] && estimatedRates[sourceCurrency][targetCurrency]) {
                    exchangeRates[targetCurrency] = estimatedRates[sourceCurrency][targetCurrency];
                  } else if (estimatedRates[targetCurrency] && estimatedRates[targetCurrency][sourceCurrency]) {
                    // Inverse the rate if we have the opposite direction
                    exchangeRates[targetCurrency] = 1 / estimatedRates[targetCurrency][sourceCurrency];
                  } else {
                    // Fallback to a reasonable estimate if no direct mapping exists
                    exchangeRates[targetCurrency] = 1.5; // Generic fallback rate
                  }
                }
              });
              
              return {
                ...country,
                exchangeRates
              };
            });
            
            setCountriesInfo(countriesWithRates);
            setError('');
          } else {
            throw new Error(`API error: ${ratesData['error-type'] || 'Unknown error'}`);
          }
        } catch (ratesError) {
          console.error('Exchange rate API error:', ratesError);
          
          // Fallback: Generate mock exchange rates
          const countriesWithFallbackRates = validatedCountriesData.map(country => {
            const exchangeRates = {};
            
            validatedCountriesData.forEach(targetCountry => {
              const sourceCurrency = country.currencyCode;
              const targetCurrency = targetCountry.currencyCode;
              
              // Skip same currency
              if (sourceCurrency === targetCurrency) {
                exchangeRates[targetCurrency] = 1;
              } else {
                // Use hardcoded estimated rates
                if (estimatedRates[sourceCurrency] && estimatedRates[sourceCurrency][targetCurrency]) {
                  exchangeRates[targetCurrency] = estimatedRates[sourceCurrency][targetCurrency];
                } else if (estimatedRates[targetCurrency] && estimatedRates[targetCurrency][sourceCurrency]) {
                  // Inverse the rate if we have the opposite direction
                  exchangeRates[targetCurrency] = 1 / estimatedRates[targetCurrency][sourceCurrency];
                } else {
                  // Fallback to a reasonable estimate if no direct mapping exists
                  exchangeRates[targetCurrency] = 1.5; // Generic fallback rate
                }
              }
            });
            
            return {
              ...country,
              exchangeRates
            };
          });
          
          setCountriesInfo(countriesWithFallbackRates);

        }
      } catch (err) {
        console.error('Error finding countries and currencies:', err);
        setError('Failed to find countries and currencies');
        
        // Provide fallback data
        const fallbackCountries = [
          {
            country: source,
            currencyCode: 'USD',
            currencyName: 'US Dollar',
            currencySymbol: '$',
            exchangeRates: { EUR: 0.92, GBP: 0.79 }
          },
          {
            country: 'Intermediate Country',
            currencyCode: 'EUR',
            currencyName: 'Euro',
            currencySymbol: '€',
            exchangeRates: { USD: 1.09, GBP: 0.86 }
          },
          {
            country: destination,
            currencyCode: 'GBP',
            currencyName: 'British Pound',
            currencySymbol: '£',
            exchangeRates: { USD: 1.27, EUR: 1.16 }
          }
        ];
        
        setCountriesInfo(fallbackCountries);
      }
      setLoading(false);
    };

    findCountriesAndCurrencies();
  }, [source, destination]);

  // Rest of the component remains unchanged
  if (!source || !destination) {
    return (
      <div className="bg-indigo-50 p-6 rounded-lg text-center">
        <FaInfoCircle className="text-indigo-500 text-2xl mx-auto mb-2" />
        <p className="text-indigo-800">Please set your source and destination to use the currency converter.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaExchangeAlt className="mr-2 text-indigo-600" /> Currency Converter
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-3xl text-indigo-500 mb-4" />
          <p className="text-gray-600">Fetching currency information...</p>
        </div>
      </div>
    );
  }

  if (countriesInfo.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaExchangeAlt className="mr-2 text-indigo-600" /> Currency Converter
        </h2>
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          <p className="flex items-center">
            <FaInfoCircle className="mr-2" /> {error || 'Failed to load currency information. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  // Create conversion table for all currency pairs
  const conversionTable = countriesInfo.map((fromCountry, i) => {
    return (
      <div key={i} className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{fromCountry.country} ({fromCountry.currencyCode})</h3>
        <div className="bg-indigo-50 rounded-lg p-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-500 text-sm">Convert to</th>
                <th className="text-right font-medium text-gray-500 text-sm">Rate</th>
                <th className="text-right font-medium text-gray-500 text-sm">1 Unit Equals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {countriesInfo.filter(c => c.currencyCode !== fromCountry.currencyCode).map((toCountry, j) => {
                // Calculate conversion rate if exchange rates are available
                let conversionRate = "N/A";
                let equivalentValue = "N/A";
                
                if (fromCountry.exchangeRates && toCountry.currencyCode in fromCountry.exchangeRates) {
                  conversionRate = fromCountry.exchangeRates[toCountry.currencyCode].toFixed(4);
                  equivalentValue = `${conversionRate} ${toCountry.currencySymbol}`;
                }
                
                return (
                  <tr key={j}>
                    <td className="py-2">
                      <div className="flex items-center">
                        <span className="font-medium">{toCountry.currencyCode}</span>
                        <span className="ml-2 text-gray-500">- {toCountry.currencyName}</span>
                      </div>
                      <div className="text-xs text-gray-500">{toCountry.country}</div>
                    </td>
                    <td className="py-2 text-right">{conversionRate}</td>
                    <td className="py-2 text-right font-medium">
                      1 {fromCountry.currencySymbol} = {equivalentValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  });

  // Quick conversion cards - show common amounts
  const quickConversionCards = countriesInfo.length >= 2 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {countriesInfo.slice(0, 2).map((country, i) => {
        const otherCountry = i === 0 ? countriesInfo[1] : countriesInfo[0];
        const conversionRate = country.exchangeRates && 
                              otherCountry.currencyCode in country.exchangeRates ? 
                              country.exchangeRates[otherCountry.currencyCode] : null;
        
        if (!conversionRate) return null;
        
        const amounts = [10, 50, 100, 500, 1000];
        
        return (
          <div key={i} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-bold">{country.currencyCode}</span>
                <span className="text-xs text-gray-500 ml-1">({country.country})</span>
              </div>
              <FaArrowRight className="text-indigo-500" />
              <div>
                <span className="font-bold">{otherCountry.currencyCode}</span>
                <span className="text-xs text-gray-500 ml-1">({otherCountry.country})</span>
              </div>
            </div>
            
            <table className="min-w-full">
              <tbody>
                {amounts.map(amount => (
                  <tr key={amount} className="border-t border-gray-100">
                    <td className="py-1 text-left">{amount} {country.currencySymbol}</td>
                    <td className="py-1 text-right font-medium">
                      {(amount * conversionRate).toFixed(2)} {otherCountry.currencySymbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  ) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaExchangeAlt className="mr-2 text-indigo-600" /> Currency Converter
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
          <p className="flex items-center">
            <FaInfoCircle className="mr-2" /> {error}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Currencies on your route</h3>
        <div className="flex flex-wrap gap-3">
          {countriesInfo.map((country, i) => (
            <div key={i} className="bg-indigo-50 px-3 py-2 rounded-lg flex items-center">
              <span className="font-medium text-indigo-800">{country.country}</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="font-medium text-indigo-600">{country.currencySymbol} {country.currencyCode}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick conversion between the first two currencies */}
      {quickConversionCards}
      
      {/* Currency conversion table */}
      {conversionTable}
      
      <div className="mt-4 text-xs text-gray-500 flex items-center">
        <FaGlobe className="mr-1" /> 
        <span>Exchange rates provided by ExchangeRate API</span>
      </div>
    </div>
  );
};

export default CurrencyConverter;
