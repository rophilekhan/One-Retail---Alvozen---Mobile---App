import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { AppText, AppBackButton } from '../global/index.js';

// Fallback catalog of alternate / mapped brands
const FALLBACK_BRANDS = [
  {
    brandId: 'b_glucophage_500',
    brand: 'Sanofi Aventis',
    name: 'Glucophage SR',
    brandName: 'Glucophage SR',
    strength: '500mg',
    tp: 135,
    mrp: 160,
    isAvailable: true,
    activeScheme: '10+1 Bonus',
  },
  {
    brandId: 'b_glycomet_500',
    brand: 'USV Pharma',
    name: 'Glycomet GP',
    brandName: 'Glycomet GP',
    strength: '500mg',
    tp: 120,
    mrp: 145,
    isAvailable: true,
    activeScheme: '5% Trade Off',
  },
  {
    brandId: 'b_obimet_500',
    brand: 'Cipla Ltd',
    name: 'Obimet SR',
    brandName: 'Obimet SR',
    strength: '500mg',
    tp: 110,
    mrp: 130,
    isAvailable: false,
    activeScheme: null,
  },
  {
    brandId: 'b_cetapin_500',
    brand: 'Sun Pharma',
    name: 'Cetapin XR',
    brandName: 'Cetapin XR',
    strength: '500mg',
    tp: 140,
    mrp: 170,
    isAvailable: true,
    activeScheme: null,
  },
];

export const MedicineBrandsView = ({
  medicine = {},
  onClose,
  onSetViewState,
  onSelectBrand,
  onPressAvailableStores,
  hideHeader = false,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [brands, setBrands] = useState(
    Array.isArray(medicine?.mappedBrands) && medicine.mappedBrands.length > 0
      ? medicine.mappedBrands
      : Array.isArray(medicine?.alternateBrands) && medicine.alternateBrands.length > 0
      ? medicine.alternateBrands
      : FALLBACK_BRANDS
  );

  useEffect(() => {
    if (medicine?.mappedBrands?.length > 0) {
      setBrands(medicine.mappedBrands);
    } else if (medicine?.alternateBrands?.length > 0) {
      setBrands(medicine.alternateBrands);
    }
  }, [medicine]);

  return (
    <View style={styles.viewContainer}>
      {!hideHeader && (
        <View style={styles.header}>
          <AppBackButton
            onPress={() => (onSetViewState ? onSetViewState('SEARCH') : onClose?.())}
            size={scale(36)}
            style={styles.backBtn}
          />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
              {medicine?.name || medicine?.brandName || medicine?.genericName || 'Metformin 500mg'}
            </AppText>
            <AppText style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              {medicine?.type || medicine?.use || medicine?.genericId || 'Diabetes management'}
            </AppText>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {brands.map((item, idx) => {
          const isAvail = item.isAvailable !== false && item.stock !== 'Out of Stock';
          const brandTitle = item.brandName || item.name;
          const companyName = item.brand || item.manufacturer || 'Authorized Manufacturer';
          const tp = item.tp || 0;
          const mrp = item.mrp || 0;
          const scheme = item.activeScheme;

          return (
            <TouchableOpacity
              key={item.brandId || idx}
              activeOpacity={0.7}
              onPress={() => onSelectBrand?.(item, medicine)}
              style={[
                styles.brandCard,
                {
                  backgroundColor: colors.surface.durationTabBg || (isDark ? 'rgba(255,255,255,0.05)' : '#F5F5F5'),
                  borderColor: colors.border.subtle || (isDark ? 'rgba(255,255,255,0.08)' : '#ECEEF2'),
                  borderWidth: 1,
                },
              ]}
            >
              {/* Header row: Company name + Clickable Available Tag */}
              <View style={styles.cardHeaderRow}>
                <AppText style={[styles.brandCompany, { color: colors.text.brandCompany || colors.text.secondary }]}>
                  {companyName}
                </AppText>

                {/* Clickable Available Tag (stops propagation to trigger nearby stores) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={(e) => {
                    e?.stopPropagation?.();
                    if (onPressAvailableStores) {
                      onPressAvailableStores(item);
                    } else if (onSetViewState) {
                      onSetViewState('PHARMACIES', item);
                    }
                  }}
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isAvail
                        ? colors.status?.availableBg || 'rgba(73, 200, 143, 0.12)'
                        : isDark
                        ? 'rgba(255, 75, 75, 0.2)'
                        : 'rgba(255, 75, 75, 0.12)',
                      borderColor: isAvail ? colors.status?.available || '#49C88F' : colors.status?.error || '#FF4B4B',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: isAvail
                          ? colors.status?.available || '#49C88F'
                          : colors.status?.error || '#FF4B4B',
                      },
                    ]}
                  />
                  <AppText
                    style={[
                      styles.statusBadgeText,
                      {
                        color: isAvail
                          ? colors.status?.available || '#49C88F'
                          : colors.status?.error || '#FF4B4B',
                      },
                    ]}
                  >
                    {isAvail ? 'Available' : 'Out of Stock'}
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Middle row: Brand Title */}
              <AppText style={[styles.brandName, { color: colors.text.primary }]}>
                {brandTitle} {item.strength ? `• ${item.strength}` : ''}
              </AppText>

              {/* Footer row: TP & MRP in DMMono-Medium + Active Scheme */}
              <View style={styles.cardFooterRow}>
                <AppText
                  style={[
                    styles.priceText,
                    {
                      color: colors.text.primary,
                      fontFamily: fontFamilies.monoMedium || 'DMMono-Medium',
                      flexShrink: 1,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {tp > 0 || mrp > 0 ? `TP: Rs. ${tp} • MRP: Rs. ${mrp}` : ''}
                </AppText>

                {scheme ? (
                  <View
                    style={[
                      styles.schemeBadge,
                      {
                        backgroundColor: isDark ? 'rgba(251, 107, 3, 0.15)' : 'rgba(251, 107, 3, 0.1)',
                        borderColor: colors.brand?.accent || '#FB6B03',
                      },
                    ]}
                  >
                    <AppText style={[styles.schemeBadgeText, { color: colors.brand?.accent || '#FB6B03' }]}>
                      {scheme}
                    </AppText>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.schemeBadge,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                        borderColor: colors.border?.subtle,
                      },
                    ]}
                  >
                    <AppText style={[styles.schemeBadgeText, { color: colors.text.muted }]}>
                      No Scheme
                    </AppText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {!hideHeader && (
        <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
          <TouchableOpacity
            style={[
              styles.footerCloseBtn,
              {
                borderColor: colors.border.modalCloseBtn || colors.border.subtle,
                backgroundColor: colors.surface.modalCloseBtnBg || (isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF'),
                marginBottom: insets.bottom > 0 ? spacing.xs : spacing.md,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <AppText style={[styles.closeBtnText, { color: colors.text.modalCloseBtn || colors.brand?.primary }]}>
              Close
            </AppText>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.titleLarge,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    marginTop: spacing.xxs,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  brandCard: {
    flexDirection: 'column',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    marginBottom: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  brandCompany: {
    ...typography.caption,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  statusDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    marginRight: scale(5),
  },
  statusBadgeText: {
    ...typography.badge,
    fontWeight: '600',
  },
  brandName: {
    ...typography.bodyLarge,
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  priceText: {
    ...typography.monoClinical,
  },
  schemeBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  schemeBadgeText: {
    ...typography.badge,
    fontWeight: '600',
  },
  bottomBarContainer: {
    width: '100%',
    paddingTop: spacing.xs,
  },
  footerCloseBtn: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  closeBtnText: {
    ...typography.bodyLarge,
  },
});

export default MedicineBrandsView;
