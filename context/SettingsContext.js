import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export default function SettingsProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SettingsContext.Provider value={{
      unitSystem,
      setUnitSystem,
      notificationsEnabled,
      setNotificationsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
}