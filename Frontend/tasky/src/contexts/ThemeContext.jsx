import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const isDark = false; // Set isDark to a fixed false

  // Removed useEffect and toggleTheme

  return (
    <ThemeContext.Provider value={{ isDark }}> {/* Only provide isDark */}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 