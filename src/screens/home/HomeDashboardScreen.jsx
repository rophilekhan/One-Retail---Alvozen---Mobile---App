import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppScreenContainer } from '../../components/core/index.js';
import { verticalScale, scale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import {
  HomeHeader,
  TerritoryAnalyticsCard,
  HomeOperationalActions,
  TopBrandsTerritoryCard,
  TerritoryBenchmarkingCard,
} from '../../components/home/index.js';

/**
 * HomeDashboardScreen - OneRetail Main Dashboard
 * Matches OneRx DashboardScreen hierarchy:
 * 1. HomeHeader (Location switcher, Staff Profile, 3D Glass notification bell, PII Tier)
 * 2. TerritoryAnalyticsCard (Segmented pills, hero DM Mono counter, welcome growth badge, 7-day sparkline, PII points)
 * 3. HomeOperationalActions (Scan Prescription QR, Upload Closing Data, Retail Operations cards)
 * 4. TopBrandsTerritoryCard (Ranked brands & sales share progress bar)
 * 5. TerritoryBenchmarkingCard (Competitive benchmarks vs territory averages)
 *
 * Thin, declarative screen strictly under 350 lines.
 */
export const HomeDashboardScreen = ({ navigation }) => {
  const pharmacy = usePharmacyStore();
  const territoryName =
    typeof pharmacy.territory === 'string'
      ? pharmacy.territory || 'PECHS / Tariq Road, Karachi'
      : pharmacy.territory?.name || 'PECHS / Tariq Road, Karachi';

  return (
    <AppScreenContainer
      scrollable={true}
      withAmbientGlow={true}
      withBottomNavClearance={true}
      withHorizontalPadding={false}
    >
      <HomeHeader />

      <TerritoryAnalyticsCard territoryName={territoryName} />

      <View style={styles.contentWrap}>
        <HomeOperationalActions />

        <TopBrandsTerritoryCard territoryName={territoryName} />

        <TerritoryBenchmarkingCard territoryName={territoryName} />
      </View>
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentWrap: {
    paddingHorizontal: scale(20),
    width: '100%',
  },
});

export default HomeDashboardScreen;
