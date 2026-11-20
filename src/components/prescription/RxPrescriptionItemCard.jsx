import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText, AppBadge } from '../core/index.js';
import {
  PillIcon,
  PillsMedicineIcon,
  HospitalClinicIcon,
} from '../../assets/vectors/index.js';

/**
 * RxPrescriptionItemCard - Renders a prescribed medicine item
 * Supports:
 * 1. Prescribed by Generic ID -> Mapped brands table (Brand – TP – MRP – Availability – Scheme)
 * 2. Prescribed by Brand Name -> In-stock scheme or Out-of-stock (Nearby pharmacies gated by reciprocal skuVisibilityEnabled + Alternate brands)
 *
 * @param {Object} props
 * @param {Object} props.item
 * @param {boolean} props.skuVisibilityEnabled
 * @param {Function} props.onNavigateSettings
 */
export const RxPrescriptionItemCard = ({
  item,
  skuVisibilityEnabled,
  onNavigateSettings,
}) => {
  const { colors, isDark } = useTheme();
  const isGenericPrescription = !item.brandName && Boolean(item.genericName);

  return (
    <GlassCard style={styles.itemCard}>
      {isGenericPrescription ? (
        /* Case A: Prescribed by Generic ID */
        <View style={{ width: '100%' }}>
          <View style={styles.itemHeaderRow}>
            <View style={{ flex: 1 }}>
              <AppBadge
                label="Prescribed by Generic"
                variant="accent"
                style={{ alignSelf: 'flex-start', marginBottom: 4 }}
              />
              <View style={styles.genericTitleRow}>
                <PillsMedicineIcon size={18} color={colors.brand?.accent} style={{ marginRight: 6 }} />
                <AppText variant="titleMedium" colorType="primary">
                  {item.genericName}
                </AppText>
              </View>
              <AppText variant="caption" colorType="muted">
                Generic ID: {item.genericId} • Prescribed Qty: {item.prescribedQuantity}
              </AppText>
            </View>
          </View>

          {/* Mapped Brands Table */}
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
              <View style={styles.brandRowLeft}>
                <PillIcon size={16} color={colors.brand?.primary} style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMediumMedium" colorType="primary">{mb.brandName}</AppText>
                  <AppText variant="caption" colorType="muted">
                    TP: PKR {mb.tp} • MRP: PKR {mb.mrp}
                  </AppText>
                </View>
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
              <View style={styles.brandTitleRow}>
                <PillIcon size={18} color={colors.brand?.primary} style={{ marginRight: 6 }} />
                <AppText variant="titleMedium" colorType="primary">
                  {item.brandName}
                </AppText>
              </View>
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

          {item.isAvailable && item.activeScheme && (
            <View style={{ marginTop: 6 }}>
              <AppBadge label={`Active Scheme: ${item.activeScheme}`} variant="brand" />
            </View>
          )}

          {!item.isAvailable && (
            <View style={styles.unavailabilitySection}>
              <View style={styles.subSectionHeader}>
                <AppText variant="bodySmallMedium" colorType="primary">
                  Nearby Pharmacy Availability
                </AppText>
                <AppBadge label="Reciprocal Network" variant="muted" size="sm" />
              </View>

              {skuVisibilityEnabled ? (
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
                      <HospitalClinicIcon size={18} color={colors.brand?.primary} style={{ marginRight: 8 }} />
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
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onNavigateSettings}
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

              {/* Alternate Brands */}
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
                    <PillsMedicineIcon size={16} color={colors.brand?.primary} style={{ marginRight: 8 }} />
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
};

const styles = StyleSheet.create({
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
  genericTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  brandRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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

export default RxPrescriptionItemCard;
