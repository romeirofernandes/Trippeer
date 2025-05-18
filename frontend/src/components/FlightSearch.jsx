import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaSpinner, FaSearch, FaInfoCircle, FaFilter } from 'react-icons/fa';
import axios from 'axios';

// Common airport codes for major cities
const AIRPORT_CODES = {
  'new york': ['JFK', 'LGA', 'EWR'],
  'london': ['LHR', 'LGW', 'STN'],
  'paris': ['CDG', 'ORY'],
  'tokyo': ['NRT', 'HND'],
  'los angeles': ['LAX'],
  'chicago': ['ORD', 'MDW'],
  'dubai': ['DXB'],
  'singapore': ['SIN'],
  'hong kong': ['HKG'],
  'amsterdam': ['AMS'],
  'frankfurt': ['FRA'],
  'madrid': ['MAD'],
  'rome': ['FCO'],
  'munich': ['MUC'],
  'istanbul': ['IST'],
  'bangkok': ['BKK'],
  'sydney': ['SYD'],
  'mumbai': ['BOM'],
  'delhi': ['DEL'],
  'beijing': ['PEK'],
  'shanghai': ['PVG'],
  'seoul': ['ICN'],
  'toronto': ['YYZ'],
  'vancouver': ['YVR'],
  'berlin': ['BER'],
  'moscow': ['SVO'],
  'cairo': ['CAI'],
  'doha': ['DOH'],
  'abudhabi': ['AUH'],
  'jakarta': ['CGK'],
  'kuala lumpur': ['KUL'],
  'manila': ['MNL'],
  'osaka': ['KIX'],
  'milan': ['MXP'],
  'zurich': ['ZRH'],
  'vienna': ['VIE'],
  'brussels': ['BRU'],
  'copenhagen': ['CPH'],
  'stockholm': ['ARN'],
  'oslo': ['OSL'],
  'helsinki': ['HEL'],
  'warsaw': ['WAW'],
  'prague': ['PRG'],
  'budapest': ['BUD'],
  'athens': ['ATH'],
  'lisbon': ['LIS'],
  'dublin': ['DUB'],
  'manchester': ['MAN'],
  'birmingham': ['BHX'],
  'glasgow': ['GLA'],
  'edinburgh': ['EDI'],
  'bristol': ['BRS'],
  'newcastle': ['NCL'],
  'liverpool': ['LPL'],
  'cardiff': ['CWL'],
  'belfast': ['BFS'],
  'aberdeen': ['ABZ'],
  'inverness': ['INV'],
  'leeds': ['LBA'],
  'hull': ['HUY'],
  'plymouth': ['PLH'],
  'exeter': ['EXT'],
  'norwich': ['NWI'],
  'southampton': ['SOU'],
  'bournemouth': ['BOH'],
  'jersey': ['JER'],
  'guernsey': ['GCI'],
  'isle of man': ['IOM'],
  'gibraltar': ['GIB'],
  'malta': ['MLA'],
  'cyprus': ['LCA'],
  'crete': ['HER'],
  'rhodes': ['RHO'],
  'corfu': ['CFU'],
  'santorini': ['JTR'],
  'mykonos': ['JMK'],
  'zante': ['ZTH'],
  'kos': ['KGS'],
  'kefalonia': ['EFL'],
  'crete': ['HER'],
  'rhodes': ['RHO'],
  'corfu': ['CFU'],
  'santorini': ['JTR'],
  'mykonos': ['JMK'],
  'zante': ['ZTH'],
  'kos': ['KGS'],
  'kefalonia': ['EFL'],
};

// Mock airlines data
const AIRLINES = [
  { name: 'Air India', code: 'AI' },
  { name: 'IndiGo', code: '6E' },
  { name: 'Vistara', code: 'UK' },
  { name: 'SpiceJet', code: 'SG' },
  { name: 'AirAsia India', code: 'I5' },
  { name: 'Emirates', code: 'EK' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'Turkish Airlines', code: 'TK' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'Cathay Pacific', code: 'CX' },
  { name: 'Etihad Airways', code: 'EY' },
  { name: 'Air France', code: 'AF' },
  { name: 'KLM', code: 'KL' }
];

// Function to generate random time between 00:00 and 23:59
const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Function to generate mock flight data
const generateMockFlights = (sourceIata, destIata, date) => {
  const numFlights = Math.floor(Math.random() * 5) + 3; // 3-7 flights
  const flights = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
    const flightNumber = `${airline.code}${Math.floor(Math.random() * 1000) + 100}`;
    const departureTime = generateRandomTime();
    const arrivalTime = generateRandomTime();
    const status = ['scheduled', 'delayed', 'cancelled'][Math.floor(Math.random() * 3)];

    flights.push({
      airline: {
        name: airline.name,
        iata: airline.code
      },
      flight: {
        iata: flightNumber,
        number: flightNumber
      },
      departure: {
        airport: sourceIata,
        scheduled: `${date}T${departureTime}:00`
      },
      arrival: {
        airport: destIata,
        scheduled: `${date}T${arrivalTime}:00`
      },
      flight_status: status
    });
  }

  // Sort flights by departure time
  return flights.sort((a, b) => 
    a.departure.scheduled.localeCompare(b.departure.scheduled)
  );
};

const FlightSearch = ({ source, destination }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sourceIata, setSourceIata] = useState('');
  const [destIata, setDestIata] = useState('');
  const [availableAirports, setAvailableAirports] = useState({
    source: [],
    destination: []
  });
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState('all');
  const [availableAirlines, setAvailableAirlines] = useState([]);

  // Function to find airport codes for a city
  const findAirportCodes = (cityName) => {
    const normalizedCity = cityName.toLowerCase().trim();
    
    // Direct match
    if (AIRPORT_CODES[normalizedCity]) {
      return AIRPORT_CODES[normalizedCity];
    }

    // Partial match
    const matches = Object.entries(AIRPORT_CODES)
      .filter(([key]) => key.includes(normalizedCity) || normalizedCity.includes(key))
      .map(([_, codes]) => codes)
      .flat();

    return matches.length > 0 ? matches : null;
  };

  // Update airport codes when source or destination changes
  useEffect(() => {
    if (source) {
      const sourceCodes = findAirportCodes(source);
      setAvailableAirports(prev => ({ ...prev, source: sourceCodes || [] }));
      if (sourceCodes && sourceCodes.length > 0) {
        setSourceIata(sourceCodes[0]);
      }
    }
    if (destination) {
      const destCodes = findAirportCodes(destination);
      setAvailableAirports(prev => ({ ...prev, destination: destCodes || [] }));
      if (destCodes && destCodes.length > 0) {
        setDestIata(destCodes[0]);
      }
    }
  }, [source, destination]);

  const searchFlights = async (e) => {
    e.preventDefault();
    if (!sourceIata || !destIata) {
      setError('Please select valid airports for both source and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://api.aviationstack.com/v1/flights', {
        params: {
          access_key: import.meta.env.VITE_AVIATIONSTACK_API_KEY,
          dep_iata: sourceIata,
          arr_iata: destIata,
          limit: 5
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      const validFlights = (response.data.data || [])
        .filter(flight => 
          flight && 
          flight.airline && 
          flight.flight && 
          flight.departure && 
          flight.arrival
        )
        .slice(0, 5);

      if (validFlights.length === 0) {
        setError('No flights found for the selected route');
      } else {
        setFlights(validFlights);
        // Extract unique airlines from the flights
        const airlines = [...new Set(validFlights.map(flight => flight.airline.name))];
        setAvailableAirlines(airlines);
      }
    } catch (err) {
      console.error('Flight search error:', err);
      setError('Unable to fetch flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getFlightDate = (scheduledTime) => {
    const date = new Date(scheduledTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filterFlights = () => {
    let filteredFlights = flights;

    // Apply date/status filters
    switch (filterCriteria) {
      case 'today':
        filteredFlights = filteredFlights.filter(flight => 
          getFlightDate(flight.departure.scheduled) === 'Today'
        );
        break;
      case 'tomorrow':
        filteredFlights = filteredFlights.filter(flight => 
          getFlightDate(flight.departure.scheduled) === 'Tomorrow'
        );
        break;
      case 'scheduled':
        filteredFlights = filteredFlights.filter(flight => 
          flight.flight_status === 'scheduled'
        );
        break;
      case 'delayed':
        filteredFlights = filteredFlights.filter(flight => 
          flight.flight_status === 'delayed'
        );
        break;
    }

    // Apply airline filter
    if (selectedAirline !== 'all') {
      filteredFlights = filteredFlights.filter(flight => 
        flight.airline.name === selectedAirline
      );
    }

    return filteredFlights;
  };

  const renderFlights = () => {
    const filteredFlights = filterFlights();
    const flightsByDate = filteredFlights.reduce((acc, flight) => {
      const date = getFlightDate(flight.departure.scheduled);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(flight);
      return acc;
    }, {});

    return Object.entries(flightsByDate).map(([date, dateFlights]) => (
      <div key={date} className="mb-6">
        <h4 className="text-lg font-medium text-[#9cadce] mb-3">{date}</h4>
        <div className="grid gap-4">
          {dateFlights.map((flight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#232323] p-4 rounded-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#9cadce] font-medium">
                    {flight.airline?.name} - {flight.flight?.iata}
                  </p>
                  <p className="text-[#f8f8f8]">
                    {flight.departure?.airport} → {flight.arrival?.airport}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#9cadce]">
                    {flight.departure?.scheduled?.split('T')[1].slice(0, 5)} - {flight.arrival?.scheduled?.split('T')[1].slice(0, 5)}
                  </p>
                  <p className="text-[#f8f8f8]">
                    Status: <span className={flight.flight_status === 'scheduled' ? 'text-green-400' : 'text-yellow-400'}>
                      {flight.flight_status}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-[#161616] rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-[#f8f8f8]">Flight Search</h2>
      
      <form onSubmit={searchFlights} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#f8f8f8]">Route</label>
          <div className="bg-[#232323] p-4 rounded-xl space-y-4">
            <div>
              <p className="text-[#f8f8f8]">
                <span className="text-[#9cadce]">From:</span> {source}
              </p>
              {availableAirports.source.length > 0 && (
                <div className="mt-2">
                  <label className="text-sm text-[#9cadce]">Select Airport:</label>
                  <select
                    value={sourceIata}
                    onChange={(e) => setSourceIata(e.target.value)}
                    className="mt-1 w-full bg-[#161616] text-[#f8f8f8] rounded-lg p-2 border border-[#9cadce]/20"
                  >
                    {availableAirports.source.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-[#f8f8f8]">
                <span className="text-[#9cadce]">To:</span> {destination}
              </p>
              {availableAirports.destination.length > 0 && (
                <div className="mt-2">
                  <label className="text-sm text-[#9cadce]">Select Airport:</label>
                  <select
                    value={destIata}
                    onChange={(e) => setDestIata(e.target.value)}
                    className="mt-1 w-full bg-[#161616] text-[#f8f8f8] rounded-lg p-2 border border-[#9cadce]/20"
                  >
                    {availableAirports.destination.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="flex-1 py-3 px-6 flex items-center justify-center rounded-lg font-medium text-black bg-[#9cadce] hover:bg-[#8b9dbd]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !sourceIata || !destIata}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Searching Flights...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" /> Search Flights
              </>
            )}
          </motion.button>

          {flights.length > 0 && (
            <motion.button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="py-3 px-6 flex items-center justify-center rounded-lg font-medium text-[#f8f8f8] bg-[#232323] hover:bg-[#2a2a2a]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFilter className="mr-2" /> Filters
            </motion.button>
          )}
        </div>
      </form>

      {showFilters && flights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 bg-[#232323] p-4 rounded-xl space-y-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setFilterCriteria('all')}
              className={`p-2 rounded-lg text-sm ${
                filterCriteria === 'all' 
                  ? 'bg-[#9cadce] text-black' 
                  : 'bg-[#161616] text-[#f8f8f8]'
              }`}
            >
              All Flights
            </button>
            <button
              onClick={() => setFilterCriteria('today')}
              className={`p-2 rounded-lg text-sm ${
                filterCriteria === 'today' 
                  ? 'bg-[#9cadce] text-black' 
                  : 'bg-[#161616] text-[#f8f8f8]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilterCriteria('tomorrow')}
              className={`p-2 rounded-lg text-sm ${
                filterCriteria === 'tomorrow' 
                  ? 'bg-[#9cadce] text-black' 
                  : 'bg-[#161616] text-[#f8f8f8]'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setFilterCriteria('scheduled')}
              className={`p-2 rounded-lg text-sm ${
                filterCriteria === 'scheduled' 
                  ? 'bg-[#9cadce] text-black' 
                  : 'bg-[#161616] text-[#f8f8f8]'
              }`}
            >
              Scheduled
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-[#f8f8f8]">Filter by Airline</label>
            <select
              value={selectedAirline}
              onChange={(e) => setSelectedAirline(e.target.value)}
              className="w-full bg-[#161616] text-[#f8f8f8] rounded-lg p-2 border border-[#9cadce]/20"
            >
              <option value="all">All Airlines</option>
              {availableAirlines.map((airline) => (
                <option key={airline} value={airline}>
                  {airline}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-900 bg-opacity-30 text-red-400 rounded-lg"
        >
          <p className="flex items-center">
            <FaInfoCircle className="mr-2" /> {error}
          </p>
        </motion.div>
      )}

      {flights.length > 0 && (
        <div className="mt-6">
          {renderFlights()}
        </div>
      )}
    </div>
  );
};

export default FlightSearch; 