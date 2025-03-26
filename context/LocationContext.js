import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [savedLocations, setSavedLocations] = useState([]);

  const addLocation = (location) => {
    setSavedLocations(prev => {
      // Check if location already exists
      const exists = prev.some(loc => loc.id === location.id);
      if (!exists) {
        return [...prev, location];
      }
      return prev;
    });
  };

  const removeLocation = (locationId) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
  };

  return (
    <LocationContext.Provider value={{ 
      savedLocations, 
      addLocation, 
      removeLocation 
    }}>
      {children}
    </LocationContext.Provider>
  );
}