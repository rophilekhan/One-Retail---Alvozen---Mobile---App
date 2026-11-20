import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { FloatingBottomBar } from '../components/core/index.js';
import { scale } from '../theme/responsive.js';
import { HomeDashboardScreen } from '../screens/home/HomeDashboardScreen.jsx';
import { TradeSchemesScreen } from '../screens/ecosystem/TradeSchemesScreen.jsx';
import { ImpactWalletScreen } from '../screens/wallet/ImpactWalletScreen.jsx';
import { SettingsScreen } from '../screens/settings/SettingsScreen.jsx';

/**
 * MainTabNavigator - Core OneRetail Nav with FloatingBottomBar & Center QR FAB
 * Switches between:
 * - Home: Territory Dashboard & Rx Scans Analytics
 * - Schemes: Manufacturer Discount Slabs & Bonus Deals
 * - Impact: PII Tier Status, Points Breakdown & Financial Wallet
 * - Settings: Reciprocal SKU Visibility & Pharma Controls
 */
export const MainTabNavigator = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleFabPress = () => {
    navigation.navigate('QRScanner');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'Schemes':
        return <TradeSchemesScreen navigation={navigation} />;
      case 'Impact':
        return <ImpactWalletScreen navigation={navigation} />;
      case 'Settings':
        return <SettingsScreen navigation={navigation} />;
      case 'Home':
      default:
        return <HomeDashboardScreen navigation={navigation} />;
    }
  };

  const tabsConfig = [
    {
      id: 'Home',
      label: 'Home',
      icon: (color, isActive) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M10.19 2.83 3.64 8.07c-1.12.9-1.64 2.38-1.64 3.82v7.11c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3v-7.11c0-1.44-.52-2.92-1.64-3.82l-6.55-5.24a2.99 2.99 0 0 0-3.62 0Z"
            fill={isActive ? '#009BA9' : 'none'}
            stroke={isActive ? '#009BA9' : color}
            strokeWidth={isActive ? '0' : '1.8'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {isActive ? <Path d="M12 15v3.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" /> : null}
        </Svg>
      ),
    },
    {
      id: 'Schemes',
      label: 'Schemes',
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16.75 3.56V2C16.75 1.59 16.41 1.25 16 1.25s-.75.34-.75.75v1.5H8.75V2C8.75 1.59 8.41 1.25 8 1.25s-.75.34-.75.75v1.56C4.55 3.81 3.24 5.42 3.04 7.81c-.02.29.22.53.5.53h16.92c.29 0 .53-.25.5-.53-.2-2.39-1.51-4-4.21-4.25Z"
            fill={color}
          />
          <Path
            opacity={0.4}
            d="M20 9.84c.55 0 1 .45 1 1v6.16c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V10.84c0-.55.45-1 1-1h16Z"
            fill={color}
          />
        </Svg>
      ),
    },
    {
      id: 'Impact',
      label: 'Impact',
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: (color) => (
        <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
          <Circle cx="5" cy="12" r="2.2" fill={color} />
          <Circle cx="12" cy="12" r="2.2" fill={color} />
          <Circle cx="19" cy="12" r="2.2" fill={color} />
        </Svg>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      {renderActiveScreen()}
      <FloatingBottomBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onFabPress={handleFabPress}
        tabs={tabsConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainTabNavigator;