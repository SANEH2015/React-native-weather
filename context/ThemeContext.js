import React, { createContext, useState, useMemo } from 'react';

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = useMemo(() => ({
    isDarkMode,
    colors: {
      background: isDarkMode ? '#121212' : '#f8f9fa',
      text: isDarkMode ? '#ffffff' : '#121212',
      primary: isDarkMode ? '#BB86FC' : '#6200ee',
      card: isDarkMode ? '#1e1e1e' : '#ffffff'
    },
    toggleTheme
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}