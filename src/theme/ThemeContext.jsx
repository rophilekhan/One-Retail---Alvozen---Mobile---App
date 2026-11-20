import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors.js';
import { typography } from './typography.js';
import { spacing } from './spacing.js';
import { radii } from './radii.js';
import { shadows } from './shadows.js';
import * as responsive from './responsive.js';

const ThemeContext = createContext(null);

/**
 * Global Theme Provider for OneRetail App
 * Supports 'light' | 'dark' | 'system'
 */
export const ThemeProvider = ({ children, initialMode = 'system' }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(initialMode);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const colors = isDark ? darkColors : lightColors;
  const currentShadows = {
    ...(isDark ? shadows.dark : shadows.light),
    dark: shadows.dark,
    light: shadows.light,
  };

  const toggleTheme = useMemo(
    () => () => {
      setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    },
    []
  );

  const theme = useMemo(
    () => ({
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
      colors,
      typography,
      spacing,
      radii,
      shadows: currentShadows,
      responsive,
    }),
    [isDark, themeMode, toggleTheme, colors, currentShadows]
  );

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the active theme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback default if used outside ThemeProvider
    return {
      isDark: true,
      themeMode: 'dark',
      colors: darkColors,
      typography,
      spacing,
      radii,
      shadows: {
        ...shadows.dark,
        dark: shadows.dark,
        light: shadows.light,
      },
      responsive,
      setThemeMode: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};

export default ThemeContext;
