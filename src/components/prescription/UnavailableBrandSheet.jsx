import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { radii } from '../../theme/radii.js';
import { AppText, AppModal, AppBadge, AppButton } from '../core/index.js';
import { OptionPills } from './OptionPills.jsx';
import {
  PillIcon,
  PillsMedicineIcon,
  PinIcon,
  HospitalClinicIcon,
} from '../../assets/vectors/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

const TABS = ['Alternate Brands', 'Nearby Pharmacies'];

// Fallback alternate brands catalog for offline or default mock items
const FALLBACK_ALTERNATE_BRANDS = [
  {
    brandId: 'alt_calpol_plus',
    name: 'Calpol Plus',
    brandName: 'Calpol Plus',
    genericName: 'Paracetamol + Caffeine',
    manufacturer: 'GSK Pakistan',
    packSize: "20's Tablet Pack",
    tp: 80,
    mrp: 95,
    stock: 'In Stock',
    isAvailable: true,
  },
  {
    brandId: 'alt_disprin_extra',
    name: 'Disprin Extra',
    brandName: 'Disprin Extra',
    genericName: 'Paracetamol + Caffeine',
    manufacturer: 'Reckitt Benckiser',
    packSize: "30's Tablet Pack",
    tp: 75,
    mrp: 90,
    stock: 'In Stock',
    isAvailable: true,
  },
  {
    brandId: 'alt_febril_extra',
    name: 'Febril Extra',
    brandName: 'Febril Extra',
    genericName: 'Paracetamol + Caffeine',
    manufacturer: 'Martin Dow Ltd',
    packSize: "20's Tablet Pack",
    tp: 70,
    mrp: 85,
    stock: 'In Stock',
    isAvailable: true,
  },
];

// Fallback nearby pharmacies with stock
const FALLBACK_NEARBY_PHARMACIES = [
  {
    id: 'ph_1',
    name: 'City Care Pharmacy',
    location: 'PECHS Block 6, Main Shahrah-e-Faisal',
    distanceKm: '0.4',
    stockUnits: 40,
    phone: '021-34567890',
  },
  {
    id: 'ph_2',
    name: 'Al-Shifa Meds',
    location: 'Tariq Road Commercial Area',
    distanceKm: '0.9',
    stockUnits: 25,
    phone: '021-34567891',
  },
  {
    id: 'ph_3',
    name: 'Medix Express',
    location: 'Bahadurabad Chowrangi',
    distanceKm: '1.2',
    stockUnits: 18,
    phone: '021-34567892',
  },
];

/**
 * UnavailableBrandSheet
 *
 * Model directly on OneRx BrandsModal.jsx + PharmacyMapView.jsx.
 * Segmented switcher:
 * - Tab 1: Alternate Brands (Same Generic) with TP, MRP, and "Select Alternate" CTA.
 * - Tab 2: Nearby Pharmacies Stock, gated by reciprocal skuVisibilityEnabled.
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Object} props.item - The unavailable prescribed item
 * @param {Function} props.onSelectAlternate
 * @param {Function} props.onNavigateSettings
 */
export const UnavailableBrandSheet = ({
  visible,
  onClose,
  item = {},
  onSelectAlternate,
  onNavigateSettings,
}) => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('Alternate Brands');
  const skuVisibilityEnabled = usePharmacyStore((s) => s.skuVisibilityEnabled);

  const prescribedBrand = item?.brandName || item?.name || 'Panadol Extra';
  const genericMolecule = item?.genericName || 'Paracetamol + Caffeine';
  const prescribedQuantity = item?.prescribedQuantity || 20;

  const alternateBrands =
    Array.isArray(item?.alternateBrands) && item.alternateBrands.length > 0
      ? item.alternateBrands
      : FALLBACK_ALTERNATE_BRANDS;

  const nearbyPharmacies =
    Array.isArray(item?.nearbyPharmacies) && item.nearbyPharmacies.length > 0
      ? item.nearbyPharmacies
      : FALLBACK_NEARBY_PHARMACIES;

  const handleSelectAlt = (altBrand) => {
    onClose?.();
    onSelectAlternate?.(altBrand, item);
  };

  const handleCall = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(() => {});
    }
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      style={styles.modalSurface}
    >
      <View style={styles.sheetContainer}>
        {/* Top Header with Close Button */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
              Unavailable Brand Resolution
            </AppText>
            <AppText style={[styles.headerSubtitle, { color: colors.text.muted }]}>
              Resolve prescribed stock shortage with in-stock alternates or network lookup
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

        {/* Top Prescribed Item Summary Banner */}
        <View
          style={[
            styles.summaryBanner,
            {
              backgroundColor: isDark ? 'rgba(255, 75, 75, 0.08)' : 'rgba(255, 75, 75, 0.05)',
              borderColor: colors.status?.error || '#FF4B4B',
            },
          ]}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerTitleRow}>
              <PillIcon size={18} color={colors.status?.error || '#FF4B4B'} style={{ marginRight: scale(6) }} />
              <AppText style={[styles.bannerBrandText, { color: colors.text.primary }]}>
                {prescribedBrand}
              </AppText>
            </View>
            <AppText style={[styles.bannerGenericText, { color: colors.text.muted }]}>
              Generic: {genericMolecule} • Prescribed Qty: {prescribedQuantity}
            </AppText>
          </View>

          <View
            style={[
              styles.outOfStockBadge,
              {
                backgroundColor: isDark ? 'rgba(255, 75, 75, 0.2)' : 'rgba(255, 75, 75, 0.12)',
                borderColor: colors.status?.error || '#FF4B4B',
              },
            ]}
          >
            <AppText style={[styles.outOfStockText, { color: colors.status?.error || '#FF4B4B' }]}>
              Out of Stock
            </AppText>
          </View>
        </View>

        {/* Dual Segmented Pill Switcher (OptionPills Style) */}
        <OptionPills
          options={TABS}
          selected={activeTab}
          onSelect={setActiveTab}
          style={styles.segmentedTabs}
        />

        {/* TAB 1: Alternate Brands (Same Generic) */}
        {activeTab === 'Alternate Brands' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.sectionHeadingWrap}>
              <AppText style={[styles.sectionHeading, { color: colors.text.primary }]}>
                Available Therapeutic Substitutes ({alternateBrands.length})
              </AppText>
              <AppText style={[styles.sectionSubheading, { color: colors.text.muted }]}>
                Same Molecule: {genericMolecule}
              </AppText>
            </View>

            {alternateBrands.map((alt, idx) => {
              const altName = alt.brandName || alt.name;
              return (
                <View
                  key={alt.brandId || idx}
                  style={[
                    styles.altCard,
                    {
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      borderColor: colors.border?.card || (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                    },
                  ]}
                >
                  {/* Strict Vertical Stack inside card */}
                  <View style={styles.cardCol}>
                    {/* 1. Header with Brand & Manufacturer */}
                    <View style={styles.altTitleRow}>
                      <View style={{ flex: 1, paddingRight: scale(8) }}>
                        <View style={styles.altNameInline}>
                          <PillsMedicineIcon size={16} color={colors.brand?.primary} style={{ marginRight: scale(6) }} />
                          <AppText style={[styles.altBrandName, { color: colors.text.primary }]}>
                            {altName}
                          </AppText>
                        </View>
                        <AppText style={[styles.altManufacturer, { color: colors.text.muted }]}>
                          {alt.manufacturer || 'Approved Generic Alternative'} • {alt.packSize || "Standard Pack"}
                        </AppText>
                      </View>

                      {/* In Stock Badge */}
                      <View
                        style={[
                          styles.inStockBadge,
                          {
                            backgroundColor: colors.status?.availableBg || 'rgba(73, 200, 143, 0.12)',
                            borderColor: colors.status?.available || '#49C88F',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.inStockDot,
                            { backgroundColor: colors.status?.available || '#49C88F' },
                          ]}
                        />
                        <AppText
                          style={[
                            styles.inStockText,
                            { color: colors.status?.available || '#49C88F' },
                          ]}
                        >
                          In Stock
                        </AppText>
                      </View>
                    </View>

                    {/* 2. TP & MRP Price Block (DMMono-Medium) */}
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
                          PKR {Number(alt.tp || 0).toLocaleString()}
                        </AppText>
                      </View>

                      <View style={[styles.priceDivider, { backgroundColor: colors.border?.subtle }]} />

                      <View style={styles.priceCol}>
                        <AppText style={[styles.priceLabel, { color: colors.text.muted }]}>
                          RETAIL PRICE (MRP)
                        </AppText>
                        <AppText style={[styles.priceValue, { color: colors.text.primary }]}>
                          PKR {Number(alt.mrp || 0).toLocaleString()}
                        </AppText>
                      </View>
                    </View>

                    {/* 3. Action Button: Select Alternate */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleSelectAlt(alt)}
                      style={[
                        styles.selectAltBtn,
                        { backgroundColor: colors.brand?.primary || '#009BA9' },
                      ]}
                    >
                      <AppText style={styles.selectAltBtnText}>
                        Select Alternate for Dispense
                      </AppText>
                      <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M9 18L15 12L9 6"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* TAB 2: Nearby Pharmacies Availability */}
        {activeTab === 'Nearby Pharmacies' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            {skuVisibilityEnabled ? (
              <View>
                <View style={styles.sectionHeadingWrap}>
                  <AppText style={[styles.sectionHeading, { color: colors.text.primary }]}>
                    Network Stores with In-Stock SKU ({nearbyPharmacies.length})
                  </AppText>
                  <AppText style={[styles.sectionSubheading, { color: colors.text.muted }]}>
                    Reciprocal SKU Visibility active • Real-time verified inventory
                  </AppText>
                </View>

                {nearbyPharmacies.map((pharm, pIdx) => {
                  return (
                    <View
                      key={pharm.id || pIdx}
                      style={[
                        styles.pharmacyCard,
                        {
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                          borderColor: colors.border?.card || (isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'),
                        },
                      ]}
                    >
                      {/* Strictly vertical stack inside card */}
                      <View style={styles.cardCol}>
                        <View style={styles.pharmaHeaderRow}>
                          <View style={styles.pharmaIconCircle}>
                            <HospitalClinicIcon size={18} color={colors.brand?.primary} />
                          </View>

                          <View style={{ flex: 1, paddingHorizontal: scale(8) }}>
                            <AppText style={[styles.pharmacyName, { color: colors.text.primary }]}>
                              {pharm.name}
                            </AppText>
                            <AppText style={[styles.pharmacyLocation, { color: colors.text.muted }]}>
                              {pharm.location || 'Local Registered Retailer'}
                            </AppText>
                          </View>

                          {/* Distance Pill in monoClinical + PinIcon */}
                          <View
                            style={[
                              styles.distancePill,
                              {
                                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9',
                                borderColor: colors.border?.subtle,
                              },
                            ]}
                          >
                            <PinIcon color={colors.brand?.primary} />
                            <AppText style={[styles.distanceText, { color: colors.text.primary }]}>
                              {pharm.distanceKm} km
                            </AppText>
                          </View>
                        </View>

                        {/* Stock Units & Contact Row */}
                        <View style={styles.pharmaFooterRow}>
                          <View
                            style={[
                              styles.inStockBadge,
                              {
                                backgroundColor: colors.status?.availableBg || 'rgba(73, 200, 143, 0.12)',
                                borderColor: colors.status?.available || '#49C88F',
                              },
                            ]}
                          >
                            <AppText
                              style={[
                                styles.inStockText,
                                { color: colors.status?.available || '#49C88F' },
                              ]}
                            >
                              {pharm.stockUnits} units in stock
                            </AppText>
                          </View>

                          {pharm.phone && (
                            <TouchableOpacity
                              activeOpacity={0.7}
                              onPress={() => handleCall(pharm.phone)}
                              style={[
                                styles.callBtn,
                                {
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                                  borderColor: colors.border?.subtle,
                                },
                              ]}
                            >
                              <AppText style={[styles.callBtnText, { color: colors.brand?.primary }]}>
                                Call Store: {pharm.phone}
                              </AppText>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              /* Privacy Notice Card when skuVisibilityEnabled === false */
              <View
                style={[
                  styles.privacyCard,
                  {
                    backgroundColor: isDark ? 'rgba(251, 107, 3, 0.08)' : 'rgba(251, 107, 3, 0.05)',
                    borderColor: colors.brand?.accent || '#FB6B03',
                  },
                ]}
              >
                <View style={styles.privacyIconWrap}>
                  <Svg width={scale(28)} height={scale(28)} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke={colors.brand?.accent || '#FB6B03'}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <Path
                      d="M12 8v4M12 16h.01"
                      stroke={colors.brand?.accent || '#FB6B03'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>

                <AppText style={[styles.privacyTitle, { color: colors.text.primary }]}>
                  Nearby Pharmacy Stock is Locked
                </AppText>

                <AppText style={[styles.privacyBody, { color: colors.text.muted }]}>
                  You have disabled SKU Visibility in your Store Settings. Under OneRetail's reciprocal data policy, pharmacies that do not share stock visibility cannot view real-time stock at neighboring pharmacies.
                </AppText>

                <AppButton
                  variant="primary"
                  title="Go to Settings & Enable SKU Visibility"
                  onPress={() => {
                    onClose?.();
                    onNavigateSettings?.();
                  }}
                  style={{ marginTop: verticalScale(14) }}
                />
              </View>
            )}
          </ScrollView>
        )}
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
    marginBottom: verticalScale(10),
  },
  headerTitle: {
    fontSize: scaleFont(19),
    lineHeight: scaleFont(24),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  headerSubtitle: {
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
    marginLeft: scale(8),
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(12),
    borderRadius: scale(14),
    borderWidth: 1.2,
    marginBottom: verticalScale(12),
  },
  bannerLeft: {
    flex: 1,
    paddingRight: scale(8),
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerBrandText: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(20),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  bannerGenericText: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(3),
  },
  outOfStockBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  outOfStockText: {
    fontSize: scaleFont(11),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  segmentedTabs: {
    marginBottom: verticalScale(12),
  },
  listContent: {
    paddingBottom: verticalScale(30),
  },
  sectionHeadingWrap: {
    marginBottom: verticalScale(10),
  },
  sectionHeading: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(18),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  sectionSubheading: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  altCard: {
    borderRadius: scale(16),
    borderWidth: 1,
    padding: scale(14),
    marginBottom: verticalScale(10),
  },
  cardCol: {
    flexDirection: 'column',
    width: '100%',
  },
  altTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(10),
  },
  altNameInline: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  altBrandName: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(21),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  altManufacturer: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(3),
  },
  inStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  inStockDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    marginRight: scale(6),
  },
  inStockText: {
    fontSize: scaleFont(11.5),
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
  selectAltBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(44),
    borderRadius: radii.pill,
    gap: scale(6),
  },
  selectAltBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(13.5),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  pharmacyCard: {
    borderRadius: scale(16),
    borderWidth: 1,
    padding: scale(14),
    marginBottom: verticalScale(10),
  },
  pharmaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  pharmaIconCircle: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyName: {
    fontSize: scaleFont(15),
    lineHeight: scaleFont(19),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
  pharmacyLocation: {
    fontSize: scaleFont(12),
    lineHeight: scaleFont(15),
    fontFamily: fontFamilies.primaryRegular,
    marginTop: verticalScale(2),
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  distanceText: {
    ...typography.monoClinical,
  },
  pharmaFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: verticalScale(8),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  callBtn: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  callBtnText: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
  },
  privacyCard: {
    padding: scale(18),
    borderRadius: scale(18),
    borderWidth: 1.5,
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  privacyIconWrap: {
    marginBottom: verticalScale(10),
  },
  privacyTitle: {
    fontSize: scaleFont(17),
    lineHeight: scaleFont(22),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  privacyBody: {
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
    fontFamily: fontFamilies.primaryRegular,
    textAlign: 'center',
    paddingHorizontal: scale(10),
  },
});

export default UnavailableBrandSheet;
