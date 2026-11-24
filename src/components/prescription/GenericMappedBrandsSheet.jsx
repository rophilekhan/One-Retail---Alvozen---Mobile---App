import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppText, AppModal, AppBadge, GlassCard } from '../core/index.js';
import { OptionPills } from './OptionPills.jsx';
import { HighlightedText } from './HighlightedText.jsx';
import { PillIcon, ShieldCheckIcon } from '../../assets/vectors/index.js';

// Fallback seed catalog of mapped brands for generic prescriptions
const SEED_MAPPED_BRANDS = [
  {
    brandId: 'b_risek_20',
    brandName: 'Risek 20mg',
    manufacturer: 'Getz Pharma Ltd',
    packSize: "14's Capsule Pack",
    tp: 135,
    mrp: 160,
    isAvailable: true,
    activeScheme: '10+1 Bonus',
  },
  {
    brandId: 'b_omega_20',
    brandName: 'Omega 20mg',
    manufacturer: 'Ferozsons Laboratories',
    packSize: "14's Capsule Pack",
    tp: 120,
    mrp: 145,
    isAvailable: true,
    activeScheme: '5% Trade Off',
  },
  {
    brandId: 'b_omee_20',
    brandName: 'Omee 20mg',
    manufacturer: 'Searle Company Ltd',
    packSize: "14's Capsule Pack",
    tp: 110,
    mrp: 130,
    isAvailable: false,
    activeScheme: null,
  },
  {
    brandId: 'b_losec_20',
    brandName: 'Losec 20mg',
    manufacturer: 'GSK Pakistan',
    packSize: "14's Capsule Pack",
    tp: 180,
    mrp: 210,
    isAvailable: true,
    activeScheme: null,
  },
];

const FILTER_TABS = ['All Brands', 'In Stock', 'Active Scheme'];

/**
 * GenericMappedBrandsSheet
 *
 * Model directly on OneRx BrandsModal.jsx + MedicineBrandsView.jsx.
 * Opens when scanning a Generic-ID QR code or tapping any Generic item.
 * Displays Generic Molecule Name + Generic ID badge, live search input with
 * search highlighting, OneRx-style filter pills, and mapped brand cards.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} props.genericItem
 * @param {Function} props.onSelectBrand
 */
export const GenericMappedBrandsSheet = ({
  visible,
  onClose,
  genericItem = {},
  onSelectBrand,
}) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Brands');

  const genericName = genericItem?.genericName || 'Omeprazole 20mg Capsule';
  const genericId = genericItem?.genericId || 'gen_omeprazole_20';
  const prescribedQuantity = genericItem?.prescribedQuantity || 14;

  const rawBrands =
    Array.isArray(genericItem?.mappedBrands) && genericItem.mappedBrands.length > 0
      ? genericItem.mappedBrands
      : SEED_MAPPED_BRANDS;

  // Filter & search brands
  const filteredBrands = useMemo(() => {
    return rawBrands.filter((brand) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        brand.brandName?.toLowerCase().includes(q) ||
        brand.manufacturer?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeFilter === 'In Stock') {
        return brand.isAvailable === true;
      }
      if (activeFilter === 'Active Scheme') {
        return Boolean(brand.activeScheme && brand.activeScheme !== 'No Scheme');
      }
      return true;
    });
  }, [rawBrands, searchQuery, activeFilter]);

  const handleSelect = (brand) => {
    onClose?.();
    onSelectBrand?.(brand, genericItem);
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      style={styles.modalSurface}
    >
      <View style={styles.sheetContainer}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <View style={styles.genericBadgeRow}>
              <AppBadge label="Generic ID Prescribed" variant="accent" size="sm" />
              <View
                style={[
                  styles.genericIdChip,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    borderColor: colors.border?.subtle,
                  },
                ]}
              >
                <AppText style={[styles.genericIdText, { color: colors.text.muted }]}>
                  {genericId}
                </AppText>
              </View>
            </View>

            <AppText style={[styles.genericTitle, { color: colors.text.primary }]}>
              {genericName}
            </AppText>

            <AppText style={[styles.genericSubtitle, { color: colors.text.muted }]}>
              Select in-stock brand to dispense • Prescribed Qty: {prescribedQuantity}
            </AppText>
          </View>

          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.closeBtn,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                borderColor: colors.border?.subtle,
              },
            ]}
          >
            <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6L18 18"
                stroke={colors.text.primary}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Live Search Input with Search Icon & Clear */}
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
              borderColor: colors.border?.card || (isDark ? '#2E2E32' : '#E2E8F0'),
            },
          ]}
        >
          <Svg width={scale(18)} height={scale(18)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke={isDark ? '#94A3B8' : '#64748B'}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>

          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search mapped brand or company..."
            placeholderTextColor={isDark ? '#94A3B8' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearBtn}
            >
              <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={isDark ? '#94A3B8' : '#94A3B8'} strokeWidth="1.4" />
                <Path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke={isDark ? '#94A3B8' : '#94A3B8'} strokeWidth="1.4" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Pills (OneRx OptionPills Style) */}
        <OptionPills
          options={FILTER_TABS}
          selected={activeFilter}
          onSelect={setActiveFilter}
          style={styles.filterPillsRow}
        />

        {/* Mapped Brands List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {filteredBrands.length === 0 ? (
            <View style={styles.emptyState}>
              <AppText style={{ color: colors.text.muted, fontSize: scaleFont(13) }}>
                No brands match "{searchQuery}" under {activeFilter}.
              </AppText>
            </View>
          ) : (
            filteredBrands.map((brand, idx) => {
              const isAvailable = brand.isAvailable !== false;
              const hasScheme = Boolean(brand.activeScheme && brand.activeScheme !== 'No Scheme');

              return (
                <TouchableOpacity
                  key={brand.brandId || idx}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(brand)}
                  style={[
                    styles.brandCard,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      borderColor: colors.border?.card || (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                    },
                  ]}
                >
                  {/* Strict Vertical Stack inside each card */}
                  <View style={styles.cardCol}>
                    {/* 1. Brand Title & Manufacturer */}
                    <View style={styles.brandTitleRow}>
                      <View style={styles.brandNameBlock}>
                        <View style={styles.nameIconInline}>
                          <PillIcon size={16} color={colors.brand?.primary} style={{ marginRight: scale(6) }} />
                          <HighlightedText
                            text={brand.brandName}
                            searchQuery={searchQuery}
                            style={[styles.brandNameText, { color: colors.text.primary }]}
                          />
                        </View>
                        <AppText style={[styles.manufacturerText, { color: colors.text.muted }]}>
                          {brand.manufacturer || 'Authorized Manufacturer'} • {brand.packSize || 'Standard Pack'}
                        </AppText>
                      </View>

                      {/* Select Action Pill */}
                      <View
                        style={[
                          styles.selectPill,
                          {
                            backgroundColor: isAvailable
                              ? (colors.brand?.primary || '#009BA9')
                              : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'),
                          },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.selectPillText,
                            { color: isAvailable ? '#FFFFFF' : (isDark ? '#94A3B8' : '#64748B') },
                          ]}
                        >
                          {isAvailable ? 'Dispense >' : 'Select'}
                        </AppText>
                      </View>
                    </View>

                    {/* 2. TP & MRP Price Block (typography.monoClinical) */}
                    <View
                      style={[
                        styles.priceBlock,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                          borderColor: colors.border?.subtle,
                        },
                      ]}
                    >
                      <View style={styles.priceCol}>
                        <AppText style={[styles.priceLabel, { color: colors.text.muted }]}>
                          TRADE PRICE (TP)
                        </AppText>
                        <AppText style={[styles.priceValue, { color: colors.text.primary }]}>
                          PKR {Number(brand.tp || 0).toLocaleString()}
                        </AppText>
                      </View>

                      <View style={[styles.priceDivider, { backgroundColor: colors.border?.subtle }]} />

                      <View style={styles.priceCol}>
                        <AppText style={[styles.priceLabel, { color: colors.text.muted }]}>
                          RETAIL PRICE (MRP)
                        </AppText>
                        <AppText style={[styles.priceValue, { color: colors.text.primary }]}>
                          PKR {Number(brand.mrp || 0).toLocaleString()}
                        </AppText>
                      </View>
                    </View>

                    {/* 3. Availability & Active Scheme Row */}
                    <View style={styles.badgesRow}>
                      <View
                        style={[
                          styles.statusPill,
                          {
                            backgroundColor: isAvailable
                              ? (colors.status?.availableBg || 'rgba(73, 200, 143, 0.12)')
                              : (isDark ? 'rgba(255, 75, 75, 0.15)' : 'rgba(255, 75, 75, 0.1)'),
                            borderColor: isAvailable
                              ? (colors.status?.available || '#49C88F')
                              : (colors.status?.error || '#FF4B4B'),
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: isAvailable
                                ? (colors.status?.available || '#49C88F')
                                : (colors.status?.error || '#FF4B4B'),
                            },
                          ]}
                        />
                        <AppText
                          style={[
                            styles.statusPillText,
                            {
                              color: isAvailable
                                ? (colors.status?.available || '#49C88F')
                                : (colors.status?.error || '#FF4B4B'),
                            },
                          ]}
                        >
                          {isAvailable ? 'In Stock' : 'Out of Stock'}
                        </AppText>
                      </View>

                      {hasScheme ? (
                        <View
                          style={[
                            styles.schemePill,
                            {
                              backgroundColor: isDark
                                ? 'rgba(251, 107, 3, 0.15)'
                                : 'rgba(251, 107, 3, 0.1)',
                              borderColor: colors.brand?.accent || '#FB6B03',
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.schemePillText,
                              { color: colors.brand?.accent || '#FB6B03' },
                            ]}
                          >
                            Scheme: {brand.activeScheme}
                          </AppText>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.neutralSchemePill,
                            {
                              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
                              borderColor: colors.border?.subtle,
                            },
                          ]}
                        >
                          <AppText style={[styles.neutralSchemeText, { color: colors.text.muted }]}>
                            Standard Trade
                          </AppText>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalSurface: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(14),
    maxHeight: '92%',
  },
  sheetContainer: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  titleWrap: {
    flex: 1,
    paddingRight: scale(10),
  },
  genericBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
    gap: scale(8),
  },
  genericIdChip: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  genericIdText: {
    ...typography.monoSmall,
  },
  genericTitle: {
    fontSize: scaleFont(19),
    lineHeight: scaleFont(24),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    marginTop: verticalScale(2),
  },
  genericSubtitle: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(16),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  closeBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchInputContainer: {
    height: verticalScale(44),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: scale(8),
    paddingVertical: 0,
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.primary,
  },
  clearBtn: {
    padding: scale(4),
  },
  filterPillsRow: {
    marginBottom: verticalScale(14),
  },
  listContent: {
    paddingBottom: verticalScale(30),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(28),
  },
  brandCard: {
    borderRadius: scale(16),
    borderWidth: 1,
    padding: scale(14),
    marginBottom: verticalScale(10),
  },
  cardCol: {
    flexDirection: 'column',
    width: '100%',
  },
  brandTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  brandNameBlock: {
    flex: 1,
    paddingRight: scale(8),
  },
  nameIconInline: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  brandNameText: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(21),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  manufacturerText: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(3),
  },
  selectPill: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectPillText: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(10),
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  priceCol: {
    flex: 1,
  },
  priceLabel: {
    fontSize: scaleFont(10),
    lineHeight: scaleFont(13),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  priceValue: {
    ...typography.monoClinical,
    marginTop: verticalScale(2),
  },
  priceDivider: {
    width: 1,
    height: verticalScale(24),
    marginHorizontal: scale(10),
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(6),
  },
  statusPillText: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
  schemePill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  schemePillText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  neutralSchemePill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  neutralSchemeText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryRegular,
  },
});

export default GenericMappedBrandsSheet;
