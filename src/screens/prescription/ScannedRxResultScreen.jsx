import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';
import { ShieldCheckIcon } from '../../assets/vectors/index.js';
import { RxPrescriptionItemCard } from '../../components/prescription/index.js';

/**
 * ScannedRxResultScreen - Prescription Inspection & Stock Availability
 * Mandated by ONERETAIL_PRD.md:
 * - Generic mapped brands with TP, MRP, Availability Status, Active Scheme
 * - Nearby pharmacy availability gated by reciprocal `skuVisibilityEnabled`
 * - Alternate brands of the same generic with TP and MRP
 *
 * @param {Object} props
 * @param {Object} props.navigation
 * @param {Object} props.route
 */
export const ScannedRxResultScreen = ({ navigation, route }) => {
  const { colors, spacing, isDark } = useTheme();
  const rx = route?.params?.prescription || useDispenseStore((s) => s.activePrescription);
  const skuVisibilityEnabled = usePharmacyStore((s) => s.skuVisibilityEnabled);

  if (!rx) {
    return (
      <AppScreenContainer withAmbientGlow={true}>
        <AppHeader title="Scanned Prescription" onBack={() => navigation.goBack()} />
        <GlassCard style={styles.card}>
          <AppText variant="titleMedium" colorType="primary">No active prescription</AppText>
          <AppButton
            variant="primary"
            title="Scan Prescription"
            onPress={() => navigation.replace('QRScanner')}
            style={{ marginTop: 12 }}
          />
        </GlassCard>
      </AppScreenContainer>
    );
  }

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true}>
      <AppHeader title="Prescription Details" onBack={() => navigation.goBack()} />

      {/* Prescription Metadata Card */}
      <GlassCard style={styles.card}>
        <View style={styles.rxHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.rxNumberRow}>
              <ShieldCheckIcon size={20} color={colors.brand?.primary} style={{ marginRight: 6 }} />
              <AppText variant="headlineSmall" colorType="primary">
                {rx.prescriptionNumber}
              </AppText>
            </View>
            <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
              {rx.doctorName} • Date: {rx.date}
            </AppText>
          </View>
          <AppBadge label="Verified Digital Rx" variant="brand" />
        </View>

        <View style={[styles.patientBadgeWrap, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
          <AppText variant="bodySmall" colorType="primary">
            Patient: <AppText variant="bodyMediumMedium" colorType="primary">{rx.patientName}</AppText> ({rx.patientAge || 'Adult'})
          </AppText>
        </View>
      </GlassCard>

      {/* Items List */}
      <AppText variant="titleMedium" colorType="primary" style={styles.sectionTitle}>
        Prescribed Items & Availability ({rx.items?.length || 0})
      </AppText>

      {rx.items?.map((item, index) => (
        <RxPrescriptionItemCard
          key={item.id || index}
          item={item}
          skuVisibilityEnabled={skuVisibilityEnabled}
          onNavigateSettings={() => navigation.navigate('Settings')}
        />
      ))}

      <View style={{ height: spacing.md }} />

      {/* Proceed to Dispense Confirmation Button */}
      <AppButton
        variant="primary"
        title="Proceed to Dispense Confirmation"
        onPress={() => navigation.navigate('DispenseConfirmation')}
      />

      <View style={{ height: verticalScale(20) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: verticalScale(6),
  },
  rxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rxNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientBadgeWrap: {
    padding: scale(8),
    borderRadius: scale(8),
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },
});

export default ScannedRxResultScreen;
