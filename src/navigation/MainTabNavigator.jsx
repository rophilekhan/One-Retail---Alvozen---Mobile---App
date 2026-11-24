import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingBottomBar } from '../components/core/index.js';
import { HomeDashboardScreen } from '../screens/home/HomeDashboardScreen.jsx';
import { TradeSchemesScreen } from '../screens/ecosystem/TradeSchemesScreen.jsx';
import { ImpactWalletScreen } from '../screens/wallet/ImpactWalletScreen.jsx';
import { SettingsScreen } from '../screens/settings/SettingsScreen.jsx';

const Tab = createBottomTabNavigator();

/**
 * MainTabNavigator - Core OneRetail Bottom Tab Navigator
 * Passing custom <FloatingBottomBar /> via the tabBar prop with 4 tabs + center QR FAB trigger.
 * Individual screens never mount the tab bar manually.
 */
export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={({ state, descriptors, navigation }) => {
        const currentRoute = state.routes[state.index];
        const activeTab = currentRoute?.name || 'HomeDashboard';

        return (
          <FloatingBottomBar
            activeTab={activeTab === 'HomeDashboard' ? 'Home' : activeTab}
            onTabPress={(tabId) => {
              const routeName = tabId === 'Home' ? 'HomeDashboard' : tabId;
              const targetRoute = state.routes.find((r) => r.name === routeName);
              if (targetRoute) {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: targetRoute.key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  navigation.navigate(routeName);
                }
              } else {
                navigation.navigate(routeName);
              }
            }}
            onFabPress={() => {
              navigation.navigate('QRScanner');
            }}
          />
        );
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Tab.Screen name="TradeSchemes" component={TradeSchemesScreen} />
      <Tab.Screen name="ImpactWallet" component={ImpactWalletScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
