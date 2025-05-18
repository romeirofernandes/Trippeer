import React, { createContext, useReducer } from 'react';

export const TravelContext = createContext();

const initialState = {
  budget: '',
  duration: 7,
  startLocation: '',
  mood: '😊',
  weather: 'sunny',
  tripType: 'solo',
  maxTravelTime: 6,
  destinations: null,
  loading: false,
  error: null
};

const travelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BUDGET':
      return { ...state, budget: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_LOCATION':
      return { ...state, startLocation: action.payload };
    case 'SET_MOOD':
      return { ...state, mood: action.payload };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload };
    case 'SET_TRIP_TYPE':
      return { ...state, tripType: action.payload };
    case 'SET_MAX_TRAVEL_TIME':
      return { ...state, maxTravelTime: action.payload };
    case 'SET_DESTINATIONS':
      return { ...state, destinations: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const TravelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(travelReducer, initialState);

  return (
    <TravelContext.Provider value={{ state, dispatch }}>
      {children}
    </TravelContext.Provider>
  );
};