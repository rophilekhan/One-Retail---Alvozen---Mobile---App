import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  AppScreenContainer,
  AppText,
  AppHeader,
  GlassCard,
  AppBadge,
  AppButton,
  MetricIconDisc,
} from '../../components/core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { useDispenseStore } from '../../store/useDispenseStore.js';

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
            <AppText variant="headlineSmall" colorType="primary">
              {rx.prescriptionNumber}
            </AppText>
            <AppText variant="caption" colorType="muted">
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

      {rx.items?.map((item, index) => {
        const isGenericPrescription = !item.brandName && Boolean(item.genericName);

        return (
          <GlassCard key={item.id || index} style={styles.itemCard}>
            {/* Case A: Prescribed by Generic ID (PRD: Generic Name with mapped brands) */}
            {isGenericPrescription ? (
              <View style={{ width: '100%' }}>
                <View style={styles.itemHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <AppBadge label="Prescribed by Generic" variant="accent" style={{ alignSelf: 'flex-start', marginBottom: 4 }} />
                    <AppText variant="titleMedium" colorType="primary">
                      {item.genericName}
                    </AppText>
                    <AppText variant="caption" colorType="muted">
                      Generic ID: {item.genericId} • Prescribed Qty: {item.prescribedQuantity}
                    </AppText>
                  </View>
                </View>

                {/* Mapped Brands Table (Brand – TP – MRP – Availability – Scheme) */}
                <AppText variant="bodySmallMedium" colorType="brand" style={{ marginTop: 10, marginBottom: 6 }}>
                  Mapped Brands for this Generic:
                </AppText>

                {item.mappedBrands?.map((mb, mIdx) => (
                  <View
                    key={mIdx}
                    style={[
                      styles.mappedBrandRow,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)',
                        borderColor: colors.border?.subtle,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText variant="bodyMediumMedium" colorType="primary">{mb.brandName}</AppText>
                      <AppText variant="caption" colorType="muted">
                        TP: PKR {mb.tp} • MRP: PKR {mb.mrp}
                      </AppText>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <AppBadge
                        label={mb.isAvailable ? 'In Stock' : 'Out of Stock'}
                        variant={mb.isAvailable ? 'success' : 'muted'}
                        size="sm"
                      />
                      {mb.activeScheme ? (
                        <AppText variant="caption" colorType="accent" style={{ marginTop: 2, fontWeight: '600' }}>
                          {mb.activeScheme}
                        </AppText>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              /* Case B: Prescribed by Brand Name */
              <View style={{ width: '100%' }}>
                <View style={styles.itemHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="titleMedium" colorType="primary">
                      {item.brandName}
                    </AppText>
                    <AppText variant="caption" colorType="muted">
                      {item.genericName} • {item.dosageForm} • Qty: {item.prescribedQuantity}
                    </AppText>
                    <AppText variant="caption" colorType="muted">
                      TP: PKR {item.tp} • MRP: PKR {item.mrp}
                    </AppText>
                  </View>
                  <AppBadge
                    label={item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    variant={item.isAvailable ? 'success' : 'error'}
                  />
                </View>

                {/* If In Stock: Scheme badge */}
                {item.isAvailable && item.activeScheme && (
                  <View style={{ marginTop: 6 }}>
                    <AppBadge label={`Active Scheme: ${item.activeScheme}`} variant="brand" />
                  </View>
                )}

                {/* If Out of Stock: Nearby Pharmacies (gated by skuVisibilityEnabled) */}
                {!item.isAvailable && (
                  <View style={styles.unavailabilitySection}>
                    <View style={styles.subSectionHeader}>
                      <AppText variant="bodySmallMedium" colorType="primary">
                        Nearby Pharmacy Availability
                      </AppText>
                      <AppBadge label="Reciprocal Network" variant="muted" size="sm" />
                    </View>

                    {skuVisibilityEnabled ? (
                      /* SKU Visibility is Enabled: Show nearby pharmacies */
                      <View>
                        {item.nearbyPharmacies?.map((pharm, pIdx) => (
                          <View
                            key={pIdx}
                            style={[
                              styles.nearbyPharmaRow,
                              {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                borderColor: colors.border?.subtle,
                              },
                            ]}
                          >
                            <View style={{ flex: 1 }}>
                              <AppText variant="bodyMediumMedium" colorType="primary">{pharm.name}</AppText>
                              <AppText variant="caption" colorType="muted">
                                Distance: {pharm.distanceKm} km away • Ph: {pharm.phone}
                              </AppText>
                            </View>
                            <AppBadge label={`${pharm.stockUnits} in stock`} variant="success" size="sm" />
                          </View>
                        ))}
                      </View>
                    ) : (
                      /* SKU Visibility is Disabled: Educational lock prompt */
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Settings')}
                        style={[
                          styles.lockedNoticeBox,
                          {
                            backgroundColor: isDark ? 'rgba(251, 107, 3, 0.08)' : 'rgba(251, 107, 3, 0.05)',
                            borderColor: colors.brand?.accent,
                          },
                        ]}
                      >
                        <AppText variant="bodySmallMedium" colorType="accent">
                          Nearby Stock Visibility is Locked
                        </AppText>
                        <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                          You have turned off SKU Visibility in Settings. In accordance with OneRetail's reciprocal data policy, you cannot view stock availability at other pharmacies. Tap here to enable SKU Visibility.
                        </AppText>
                      </TouchableOpacity>
                    )}

                    {/* Alternate Brands of the Same Generic (PRD Mandated) */}
                    <View style={{ marginTop: verticalScale(12) }}>
                      <AppText variant="bodySmallMedium" colorType="primary" style={{ marginBottom: 6 }}>
                        Alternate Brands (Same Generic: {item.genericName})
                      </AppText>
                      {item.alternateBrands?.map((alt, aIdx) => (
                        <View
                          key={aIdx}
                          style={[
                            styles.altBrandRow,
                            {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.02)',
                              borderColor: colors.border?.subtle,
                            },
                          ]}
                        >
                          <View style={{ flex: 1 }}>
                            <AppText variant="bodyMediumMedium" colorType="primary">{alt.name}</AppText>
                            <AppText variant="caption" colorType="muted">
                              TP: PKR {alt.tp} • MRP: PKR {alt.mrp}
                            </AppText>
                          </View>
                          <AppBadge label={alt.stock} variant="brand" size="sm" />
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </GlassCard>
        );
      })}

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
  patientBadgeWrap: {
    padding: scale(8),
    borderRadius: scale(8),
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },
  itemCard: {
    width: '100%',
    marginVertical: verticalScale(6),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mappedBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    marginVertical: verticalScale(3),
  },
  unavailabilitySection: {
    marginTop: verticalScale(10),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  subSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  nearbyPharmaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    marginVertical: verticalScale(3),
  },
  lockedNoticeBox: {
    padding: scale(10),
    borderRadius: scale(10),
    borderWidth: 1,
    marginVertical: verticalScale(4),
  },
  altBrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(8),
    borderRadius: scale(8),
    borderWidth: 1,
    marginVertical: verticalScale(3),
  },
});

export default ScannedRxResultScreen;