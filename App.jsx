import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/theme/ThemeContext.jsx';
import RootNavigator from './src/navigation/RootNavigator.jsx';
import { navigationRef } from './src/navigation/navigationService.js';
import AppToast from './src/components/core/AppToast.jsx';

/**
 * OneRetail - Main Application Entry Point
 * Wires SafeAreaProvider, ThemeProvider, NavigationContainer, RootNavigator and AppToast.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialMode="system">
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
          <AppToast />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
