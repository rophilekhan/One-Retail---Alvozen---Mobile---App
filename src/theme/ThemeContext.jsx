import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { lightColors, darkColors } from './colors.js';
import { typography } from './typography.js';
import { spacing } from './spacing.js';
import { radii } from './radii.js';
import { shadows } from './shadows.js';
import * as responsive from './responsive.js';
import { scale, scaleFont } from './responsive.js';

const ThemeContext = createContext(null);

/**
 * FloatingDevThemeToggle - Floating Developer Helper Component
 * Quick cycle between 'dark' -> 'light' -> 'system'
 */
export const FloatingDevThemeToggle = () => {
  const { themeMode, setThemeMode, isDark } = useTheme();

  const handleCycleTheme = () => {
    if (themeMode === 'dark') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('system');
    } else {
      setThemeMode('dark');
    }
  };

  const getLabel = () => {
    switch (themeMode) {
      case 'dark':
        return '🌙 Dark';
      case 'light':
        return '☀️ Light';
      case 'system':
      default:
        return `⚙️ Sys (${isDark ? 'D' : 'L'})`;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handleCycleTheme}
      style={[
        styles.devToggle,
        {
          backgroundColor: isDark ? 'rgba(0, 155, 169, 0.9)' : 'rgba(15, 71, 97, 0.9)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Cycle theme mode"
    >
      <View style={styles.devToggleInner}>
        {/* Simple text label */}
        <View style={styles.textWrap}>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Global Theme Provider for OneRetail App
 * Supports 'light' | 'dark' | 'system' + optional floating dev theme toggle
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'light' | 'dark' | 'system'} [props.initialMode='system']
 * @param {boolean} [props.showDevToggle=false]
 */
export const ThemeProvider = ({
  children,
  initialMode = 'system',
  showDevToggle = false,
}) => {
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
      {showDevToggle && <FloatingDevThemeToggle />}
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

const styles = StyleSheet.create({
  devToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    right: 16,
    zIndex: 999999,
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16),
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  devToggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemeContext;