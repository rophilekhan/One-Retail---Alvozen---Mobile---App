import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore.js';
import { useTheme } from '../theme/index.js';
import { AppScreenContainer, AppText } from '../components/core/index.js';
import AuthNavigator from './AuthNavigator.jsx';
import MainTabNavigator from './MainTabNavigator.jsx';

// Core Feature Screens
import { PharmacyProfileScreen } from '../screens/profile/PharmacyProfileScreen.jsx';
import { StaffListScreen } from '../screens/staff/StaffListScreen.jsx';
import { StaffFormScreen } from '../screens/staff/StaffFormScreen.jsx';
import { QRScannerScreen } from '../screens/prescription/QRScannerScreen.jsx';
import { ScannedRxResultScreen } from '../screens/prescription/ScannedRxResultScreen.jsx';
import { DispenseConfirmationScreen } from '../screens/prescription/DispenseConfirmationScreen.jsx';
import { TradeSchemesScreen } from '../screens/ecosystem/TradeSchemesScreen.jsx';
import { DistributorConnectScreen } from '../screens/ecosystem/DistributorConnectScreen.jsx';
import { EngageScreen } from '../screens/ecosystem/EngageScreen.jsx';
import { ImpactWalletScreen } from '../screens/wallet/ImpactWalletScreen.jsx';
import { SettingsScreen } from '../screens/settings/SettingsScreen.jsx';

// Modals
import {
  QRScannerModal,
  DispenseConfirmModal,
  SubstitutePickerModal,
  StaffCreateModal,
} from './ModalNavigator.jsx';

const Stack = createNativeStackNavigator();

/**
 * RootNavigator - Application Root Navigation Router
 * Selects Auth vs MainTabs based on authentication state
 * and mounts feature stacks and global modal routes.
 */
export const RootNavigator = () => {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const { colors } = useTheme();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Splash / Loading state while hydrating encrypted storage
  if (!isHydrated) {
    return (
      <AppScreenContainer withAmbientGlow={true}>
        <View style={styles.splashContainer}>
          <AppText variant="headlineLarge" colorType="primary" style={styles.splashTitle}>
            OneRetail
          </AppText>
          <AppText variant="bodyLarge" colorType="brand" style={styles.splashSubtitle}>
            by Alvozen
          </AppText>
          <ActivityIndicator
            size="large"
            color={colors.brand?.primary || '#009BA9'}
            style={styles.loader}
          />
        </View>
      </AppScreenContainer>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Group>
          {/* Main Tab Bar Navigation */}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />

          {/* Profile & Staff Hierarchy */}
          <Stack.Screen
            name="PharmacyProfile"
            component={PharmacyProfileScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="StaffList"
            component={StaffListScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="StaffForm"
            component={StaffFormScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Prescription Scanning & Dispense Flow */}
          <Stack.Screen
            name="QRScanner"
            component={QRScannerScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="ScannedRxResult"
            component={ScannedRxResultScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="DispenseConfirmation"
            component={DispenseConfirmationScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Ecosystem: Trade Schemes, Distributor Connect & Engage */}
          <Stack.Screen
            name="TradeSchemes"
            component={TradeSchemesScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="DistributorConnect"
            component={DistributorConnectScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Engage"
            component={EngageScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Wallet & Settings */}
          <Stack.Screen
            name="ImpactWallet"
            component={ImpactWalletScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Modal group for popups and scanner */}
          <Stack.Group
            screenOptions={{
              presentation: 'transparentModal',
              animation: 'fade',
            }}
          >
            <Stack.Screen name="QRScannerModal" component={QRScannerModal} />
            <Stack.Screen name="DispenseConfirmModal" component={DispenseConfirmModal} />
            <Stack.Screen name="SubstitutePickerModal" component={SubstitutePickerModal} />
            <Stack.Screen name="StaffCreateModal" component={StaffCreateModal} />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    marginTop: 4,
    letterSpacing: 0.5,
  },
  loader: {
    marginTop: 24,
  },
});

export default RootNavigator;