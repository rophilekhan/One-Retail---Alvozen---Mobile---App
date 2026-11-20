import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  AppScreenContainer,
  AppText,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
  AppToast,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useAuthStore } from '../../store/useAuthStore.js';
import { PermissionGuard } from '../../components/common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import {
  PrescriptionsPerDayWidget,
  TopBrandsTerritoryCard,
  TerritoryBenchmarkingCard,
} from '../../components/home/index.js';
import {
  TierGemIcon,
  PillIcon,
  PillsMedicineIcon,
  TransferArrowsIconSvg,
  CalendarIcon,
  HospitalClinicIcon,
  MapPinIcon,
} from '../../assets/vectors/index.js';

/**
 * HomeDashboardScreen - OneRetail Main Dashboard
 * Mandated by ONERETAIL_PRD.md:
 * - Territory header showing Pharmacy Name, Territory badge, and quick nav to Profile & Staff
 * - Quick actions: Scan Rx QR & Upload Closing Data (for non-integrated POS)
 * - Prescriptions per day analytics
 * - Top Brands in Territory & Sales Share
 * - Territory Benchmarking
 * - Ecosystem quick action links
 * Features exact OneRx vector assets (Zero emoji/text placeholders).
 *
 * @param {Object} props
 * @param {Object} props.navigation
 */
export const HomeDashboardScreen = ({ navigation }) => {
  const { colors, spacing } = useTheme();
  const pharmacy = usePharmacyStore();
  const user = useAuthStore((s) => s.user);

  const pharmacyName = pharmacy.name || user?.name || 'City Meds Pharmacy';
  const territoryName = pharmacy.territory?.name || 'PECHS / Tariq Road, Karachi';
  const piiTier = pharmacy.piiTier || 'Key Account';
  const isSystemIntegrated = pharmacy.isSystemIntegrated || false;

  const handleUploadClosingData = () => {
    AppToast.show({
      title: 'Daily Closing Data Uploaded',
      message: 'Sales off-take synced. +10 PII Points added to your daily sharing score.',
      type: 'success',
    });
  };

  return (
    <AppScreenContainer scrollable={true} withAmbientGlow={true} withBottomNavClearance={true}>
      {/* 1. Territory & Pharmacy Header */}
      <View style={styles.screenHeader}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PharmacyProfile')}
          style={{ flex: 1 }}
          accessibilityRole="button"
          accessibilityLabel="View Pharmacy Profile"
        >
          <AppText variant="headlineMedium" colorType="primary" numberOfLines={1}>
            {pharmacyName}
          </AppText>
          <View style={styles.territoryRow}>
            <MapPinIcon size={14} color={colors.brand?.primary} />
            <AppText variant="caption" colorType="muted" style={{ marginLeft: 4 }}>
              Territory: {territoryName} • <AppText variant="caption" colorType="brand">Profile &gt;</AppText>
            </AppText>
          </View>
        </TouchableOpacity>

        <View style={styles.headerBadgesRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('StaffList')}
            style={{ marginRight: 6 }}
          >
            <AppBadge label="Staff" variant="neutral" size="sm" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PharmacyProfile')}
            style={styles.tierHeaderPill}
          >
            <TierGemIcon tier={piiTier} size={20} isApex={false} style={{ marginRight: 4 }} />
            <AppBadge label={piiTier} variant="brand" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Quick Action Bar */}
      <View style={styles.quickActionsContainer}>
        {/* Scan Prescription QR */}
        <PermissionGuard
          permission={PERMISSIONS.SCAN_QR_DEVICE}
          fallback={
            <GlassCard style={styles.actionCard}>
              <AppText variant="caption" colorType="muted">
                Scan QR restricted for your role. Contact Pharmacy Admin.
              </AppText>
            </GlassCard>
          }
        >
          <GlassCard style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <MetricIconDisc variant="teal" size={38} marginRight={10}>
                <PillsMedicineIcon size={22} color="#FFFFFF" />
              </MetricIconDisc>
              <View style={{ flex: 1 }}>
                <View style={styles.actionTitleRow}>
                  <AppText variant="titleMedium" colorType="primary">
                    Scan Prescription QR
                  </AppText>
                  <AppBadge label="+10 Pts" variant="accent" size="sm" />
                </View>
                <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                  Validate patient digital Rx, generic mapping & reciprocal stocks
                </AppText>
              </View>
            </View>
            <View style={{ marginTop: verticalScale(10) }}>
              <AppButton
                variant="primary"
                size="md"
                title="Open Prescription QR Scanner"
                onPress={() => navigation.navigate('QRScanner')}
              />
            </View>
          </GlassCard>
        </PermissionGuard>

        {/* Upload Closing Data (Displayed when !isSystemIntegrated) */}
        {!isSystemIntegrated && (
          <PermissionGuard
            permission={PERMISSIONS.UPLOAD_CLOSING_DATA}
            fallback={null}
          >
            <GlassCard style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <MetricIconDisc variant="purple" size={38} marginRight={10}>
                  <TransferArrowsIconSvg size={20} color="#FFFFFF" />
                </MetricIconDisc>
                <View style={{ flex: 1 }}>
                  <AppText variant="titleMedium" colorType="primary">
                    Upload Daily Closing Data
                  </AppText>
                  <AppText variant="caption" colorType="muted">
                    Manual pharmacy off-take sync (+10 PII Points daily)
                  </AppText>
                </View>
                <AppButton
                  variant="secondary"
                  size="xs"
                  title="Upload CSV / Excel"
                  onPress={handleUploadClosingData}
                />
              </View>
            </GlassCard>
          </PermissionGuard>
        )}
      </View>

      {/* 3. Prescriptions Per Day Analytics */}
      <PrescriptionsPerDayWidget todayCount={38} weeklyAverage={34} />

      {/* 4. Top Brands in Territory & Sales Share */}
      <TopBrandsTerritoryCard territoryName={territoryName} />

      {/* 5. Territory Benchmarking */}
      <TerritoryBenchmarkingCard territoryName={territoryName} />

      {/* 6. Ecosystem Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionGridItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('TradeSchemes')}
        >
          <GlassCard style={styles.actionCardInner}>
            <MetricIconDisc variant="purple" size={38} marginRight={8}>
              <CalendarIcon size={18} color="#FFFFFF" />
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">Trade Schemes</AppText>
              <AppText variant="caption" colorType="muted">Discount slabs</AppText>
            </View>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionGridItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('DistributorConnect')}
        >
          <GlassCard style={styles.actionCardInner}>
            <MetricIconDisc variant="teal" size={38} marginRight={8}>
              <HospitalClinicIcon size={18} color="#FFFFFF" />
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMediumMedium" colorType="primary">Distributor</AppText>
              <AppText variant="caption" colorType="muted">PO & Expiry</AppText>
            </View>
          </GlassCard>
        </TouchableOpacity>
      </View>

      <View style={{ height: verticalScale(16) }} />
    </AppScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
  },
  territoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  headerBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionsContainer: {
    marginVertical: verticalScale(4),
  },
  actionCard: {
    width: '100%',
    marginVertical: verticalScale(5),
    padding: scale(14),
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(6),
  },
  actionGridItem: {
    flex: 1,
    marginHorizontal: scale(3),
  },
  actionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
  },
});

export default HomeDashboardScreen;
