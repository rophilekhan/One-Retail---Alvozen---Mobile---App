import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore.js';
import { SplashScreen } from '../screens/auth/SplashScreen.jsx';
import AuthNavigator from './AuthNavigator.jsx';
import MainTabNavigator from './MainTabNavigator.jsx';

// Core Feature Screens
import { HomeDashboardScreen, UploadClosingDataScreen } from '../screens/home/index.js';
import { PharmacyProfileScreen } from '../screens/profile/PharmacyProfileScreen.jsx';
import { StaffListScreen } from '../screens/staff/StaffListScreen.jsx';
import { StaffFormScreen } from '../screens/staff/StaffFormScreen.jsx';
import { QRScannerScreen } from '../screens/prescription/QRScannerScreen.jsx';
import { ScannedRxResultScreen } from '../screens/prescription/ScannedRxResultScreen.jsx';
import { DispenseConfirmationScreen } from '../screens/prescription/DispenseConfirmationScreen.jsx';
import { TradeSchemesScreen } from '../screens/ecosystem/TradeSchemesScreen.jsx';
import { DistributorConnectScreen } from '../screens/ecosystem/DistributorConnectScreen.jsx';
import { EngageScreen } from '../screens/ecosystem/EngageScreen.jsx';
import { ImpactWalletScreen, EarningsScreen, PointsEarnedScreen } from '../screens/wallet/index.js';
import { SettingsScreen } from '../screens/settings/SettingsScreen.jsx';

// Modals
import {
  SubstituteSearchModalScreen,
  CashoutWithdrawModalScreen,
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

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Splash / Loading state while hydrating encrypted storage
  if (!isHydrated) {
    return <SplashScreen autoNavigate={false} />;
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
          <Stack.Screen
            name="UploadClosingData"
            component={UploadClosingDataScreen}
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
            name="ImpactIndex"
            component={ImpactWalletScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Earnings"
            component={EarningsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="PointsEarned"
            component={PointsEarnedScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Transparent Modal group for bottom sheets, popups and scanner */}
          <Stack.Group
            screenOptions={{
              presentation: 'transparentModal',
              animation: 'fade',
            }}
          >
            <Stack.Screen
              name="SubstituteSearchModal"
              component={SubstituteSearchModalScreen}
            />
            <Stack.Screen
              name="CashoutWithdrawModal"
              component={CashoutWithdrawModalScreen}
            />
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

export default RootNavigator;
