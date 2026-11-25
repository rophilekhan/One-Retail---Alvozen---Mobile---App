import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  GlassCard,
  AppText,
  AppBadge,
  AppButton,
  MetricIconDisc,
  AppToast,
} from '../core/index.js';
import { PermissionGuard } from '../common/PermissionGuard.jsx';
import { PERMISSIONS } from '../../store/useStaffStore.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import {
  PillsMedicineIcon,
  QRScannerIcon,
  TransferArrowsIconSvg,
  CalendarIcon,
  HospitalClinicIcon,
} from '../../assets/vectors/index.js';

/**
 * HomeOperationalActions
 * Operational Action Cards styled identically to OneRx DrugInfoLibrary.jsx & Dashboard action cards:
 * 1. Scan Prescription QR CTA (guarded by SCAN_QR_DEVICE / SCAN_QR_PLUGIN)
 * 2. Upload Closing Data CTA (guarded by UPLOAD_CLOSING_DATA, shown when !isSystemIntegrated)
 * 3. 150x148 rounded-24px Quick Action Cards for Trade Schemes & Distributor Connect
 */
export const HomeOperationalActions = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const isSystemIntegrated = usePharmacyStore((s) => s.isSystemIntegrated);

  const handleUploadClosing = () => {
    navigation.navigate('UploadClosingData');
  };

  return (
    <View style={styles.container}>
      {/* 1. Scan Prescription QR CTA Card */}
      <PermissionGuard
        permission={PERMISSIONS.SCAN_QR_DEVICE}
        fallback={
          <GlassCard style={styles.restrictedCard}>
            <AppText variant="caption" colorType="muted">
              Scan QR is restricted for your staff role. Contact Pharmacy Admin.
            </AppText>
          </GlassCard>
        }
      >
        <GlassCard style={styles.mainActionCard}>
          <View style={styles.cardHeaderRow}>
            <MetricIconDisc variant="teal" size={40} marginRight={12}>
              <QRScannerIcon size={22} color={isDark ? '#38D6E5' : '#0F4761'} strokeWidth={2.2} />
            </MetricIconDisc>
            <View style={styles.headerTextCol}>
              <View style={styles.titleBadgeRow}>
                <AppText variant="titleMedium" colorType="primary" style={styles.actionTitle}>
                  Scan Prescription QR
                </AppText>
                <AppBadge label="+10 Pts" variant="accent" size="sm" isMono={true} />
              </View>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                Validate patient digital Rx, generic mapping & reciprocal stocks
              </AppText>
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <AppButton
              variant="primary"
              size="md"
              title="Open Prescription QR Scanner"
              onPress={() => navigation.navigate('QRScanner')}
            />
          </View>
        </GlassCard>
      </PermissionGuard>

      {/* 2. Upload Closing Data (Non-integrated POS sync) */}
      {!isSystemIntegrated && (
        <PermissionGuard
          permission={PERMISSIONS.UPLOAD_CLOSING_DATA}
          fallback={null}
        >
          <GlassCard style={styles.secondaryActionCard}>
            <View style={styles.cardHeaderRow}>
              <MetricIconDisc variant="purple" size={40} marginRight={12}>
                <TransferArrowsIconSvg size={20} color={isDark ? '#C084FC' : '#5B21B6'} />
              </MetricIconDisc>
              <View style={styles.headerTextCol}>
                <View style={styles.titleBadgeRow}>
                  <AppText variant="titleMedium" colorType="primary" style={styles.actionTitle}>
                    Upload Closing Data
                  </AppText>
                  <AppBadge label="+10 Pts" variant="brand" size="sm" isMono={true} />
                </View>
                <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                  Manual pharmacy off-take sync (CSV / Excel format)
                </AppText>
              </View>
            </View>

            <View style={styles.buttonWrap}>
              <AppButton
                variant="secondary"
                size="md"
                title="Upload Closing File"
                onPress={handleUploadClosing}
              />
            </View>
          </GlassCard>
        </PermissionGuard>
      )}

      {/* 3. Section Header for Quick Domain Cards */}
      <View style={styles.sectionHeaderRow}>
        <AppText variant="titleLarge" colorType="primary" style={styles.sectionHeaderTitle}>
          Retail Operations
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TradeSchemes')}
          style={styles.headerArrowBtn}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View all trade schemes"
        >
          <Svg width={scale(14)} height={scale(14)} viewBox="0 0 12 12" fill="none">
            <Path
              d="M1 11L11 1M11 1H4.5M11 1V7.5"
              stroke={isDark ? '#009BA9' : '#020202'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* 4. OneRx-Style 150x148 Rounded 24px Quick Action Cards */}
      <View style={styles.quickCardsRow}>
        {/* Card 1: Trade Schemes */}
        <TouchableOpacity
          style={[
            styles.opCard,
            {
              backgroundColor: isDark ? '#001F22' : '#BDF1F6',
              borderColor: isDark ? 'rgba(0, 155, 169, 0.25)' : 'rgba(0, 155, 169, 0.15)',
            },
          ]}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Trade Schemes: Browse pharma discount slabs"
          onPress={() => navigation.navigate('TradeSchemes')}
        >
          <View style={styles.iconDisc}>
            <CalendarIcon size={22} color={isDark ? '#38D6E5' : '#0F4761'} />
          </View>
          <View style={styles.opCardInfo}>
            <AppText
              style={[
                styles.opCardTitle,
                { color: isDark ? '#FFFFFF' : '#020202' },
              ]}
            >
              Trade Schemes
            </AppText>
            <AppText
              style={[
                styles.opCardSubtitle,
                { color: isDark ? '#ABABAB' : '#4B5563' },
              ]}
              numberOfLines={2}
            >
              Pharma discount slabs & purchase offers
            </AppText>
          </View>
        </TouchableOpacity>

        {/* Card 2: Distributor Connect */}
        <TouchableOpacity
          style={[
            styles.opCard,
            {
              backgroundColor: isDark ? '#1E192D' : '#EDE8F8',
              borderColor: isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.15)',
            },
          ]}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Distributor Connect: Purchase orders and expiry claims"
          onPress={() => navigation.navigate('DistributorConnect')}
        >
          <View style={styles.iconDisc}>
            <HospitalClinicIcon size={22} color={isDark ? '#C084FC' : '#5B21B6'} />
          </View>
          <View style={styles.opCardInfo}>
            <AppText
              style={[
                styles.opCardTitle,
                { color: isDark ? '#FFFFFF' : '#020202' },
              ]}
            >
              Distributor
            </AppText>
            <AppText
              style={[
                styles.opCardSubtitle,
                { color: isDark ? '#ABABAB' : '#4B5563' },
              ]}
              numberOfLines={2}
            >
              Purchase Orders & expiry returns
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(4),
    width: '100%',
  },
  mainActionCard: {
    width: '100%',
    marginBottom: verticalScale(14),
  },
  secondaryActionCard: {
    width: '100%',
    marginBottom: verticalScale(14),
  },
  restrictedCard: {
    width: '100%',
    marginBottom: verticalScale(10),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerTextCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    letterSpacing: -0.2,
  },
  buttonWrap: {
    marginTop: verticalScale(12),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(12),
  },
  sectionHeaderTitle: {
    letterSpacing: -0.4,
  },
  headerArrowBtn: {
    padding: scale(4),
  },
  quickCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    gap: scale(12),
  },
  opCard: {
    flex: 1,
    height: verticalScale(148),
    borderRadius: scale(24),
    padding: scale(16),
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  iconDisc: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  opCardInfo: {
    gap: verticalScale(4),
  },
  opCardTitle: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: scaleFont(17),
    lineHeight: verticalScale(22),
    letterSpacing: -0.2,
  },
  opCardSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: scaleFont(12),
    lineHeight: verticalScale(16),
    letterSpacing: -0.2,
  },
});

export default HomeOperationalActions;
