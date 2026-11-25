import React, { useMemo, useRef, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { shadows } from '../../theme/shadows.js';
import { scale, scaleFont, verticalScale } from '../../theme/responsive.js';
import { AppText, AppButton } from '../core/index.js';
import {
  ChevronLeftSvg,
  LocationPinIcon,
  MapTeardropPinIcon,
} from '../../assets/vectors/PrescriptionIcons.jsx';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';
import { DARK_MAP_STYLE, DEFAULT_COORDINATES, parseFiniteCoord } from '../../services/geocodingService.js';

const FALLBACK_PHARMACIES = [
  {
    id: 1,
    name: 'Shaheen Chemist',
    location: 'Gulshan-e-Iqbal',
    address: 'Plot 42-B, Block 13-A, Gulshan-e-Iqbal, Karachi',
    brands: 4,
    distance: '3.5 km',
    distanceKm: '3.5',
    status: 'Nearby',
    stockUnits: 40,
    latitude: 24.918,
    longitude: 67.097,
  },
  {
    id: 2,
    name: 'Al-Noor Pharmacy',
    location: 'DHA Phase 6',
    address: '15-C, Shahbaz Commercial, DHA Phase 6, Karachi',
    brands: 4,
    distance: '5.2 km',
    distanceKm: '5.2',
    status: 'Distant',
    stockUnits: 25,
    latitude: 24.806,
    longitude: 67.065,
  },
  {
    id: 3,
    name: 'Medix Pharmacy',
    location: 'Clifton, Block 5',
    address: 'Shop 4, Boat Basin Avenue, Clifton Block 5, Karachi',
    brands: 4,
    distance: '1.8 km',
    distanceKm: '1.8',
    status: 'Nearby',
    stockUnits: 18,
    latitude: 24.825,
    longitude: 67.028,
  },
  {
    id: 4,
    name: 'Habib Medical Store',
    location: 'North Nazimabad',
    address: 'Block H, Main Shahrah-e-Sher Shah Suri, Karachi',
    brands: 4,
    distance: '7.1 km',
    distanceKm: '7.1',
    status: 'Distant',
    stockUnits: 12,
    latitude: 24.941,
    longitude: 67.043,
  },
];

const resolveNearbyPharmacies = (medicine = {}) => {
  const customList = Array.isArray(medicine?.nearbyPharmacies) ? medicine.nearbyPharmacies : [];
  if (customList.length === 0) return FALLBACK_PHARMACIES;

  return customList.map((entry, idx) => {
    const seed = FALLBACK_PHARMACIES[idx % FALLBACK_PHARMACIES.length];
    const distKm =
      entry.distanceKm ||
      (entry.distance ? String(entry.distance).split(' ')[0] : seed.distanceKm);
    const numericDist = parseFloat(distKm);
    const derivedStatus =
      entry.status || (!isNaN(numericDist) && numericDist <= 4 ? 'Nearby' : 'Distant');

    return {
      ...seed,
      ...entry,
      id: entry.id || idx + 1,
      name: entry.name || seed.name,
      location: entry.location || seed.location,
      address: entry.address || entry.location || seed.address,
      distanceKm: distKm,
      distance: entry.distance || `${distKm} km`,
      status: derivedStatus,
      stockUnits: entry.stockUnits !== undefined ? entry.stockUnits : seed.stockUnits,
      latitude: entry.latitude || seed.latitude,
      longitude: entry.longitude || seed.longitude,
    };
  });
};

/**
 * PharmacyMapView - View 2 (Nearby Stores List) & View 3 (Store Google Map Pin)
 * Exact 1:1 port of OneRx PharmacyMapView with reciprocal SKU Visibility gating.
 *
 * @param {Object} props
 * @param {'PHARMACIES' | 'PHARMACY_MAP'} [props.viewState='PHARMACIES']
 * @param {Object} props.selectedPharmacy
 * @param {Function} props.setSelectedPharmacy
 * @param {Function} props.onClose
 * @param {Function} [props.onBack]
 * @param {Function} props.onSetViewState
 * @param {Function} [props.onNavigateSettings]
 * @param {Object} [props.medicine]
 */
export const PharmacyMapView = ({
  viewState = 'PHARMACIES',
  selectedPharmacy,
  setSelectedPharmacy,
  onClose,
  onBack,
  onSetViewState,
  onNavigateSettings,
  medicine = {},
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const isMapReadyRef = useRef(false);
  const skuVisibilityEnabled = usePharmacyStore((s) => s.skuVisibilityEnabled);
  const pharmacies = useMemo(() => resolveNearbyPharmacies(medicine), [medicine]);

  const activeStore = selectedPharmacy || pharmacies[0];
  const parsedLat = parseFiniteCoord(activeStore?.latitude);
  const parsedLng = parseFiniteCoord(activeStore?.longitude);
  const storeLatitude = Number.isFinite(parsedLat) ? parsedLat : DEFAULT_COORDINATES.latitude;
  const storeLongitude = Number.isFinite(parsedLng) ? parsedLng : DEFAULT_COORDINATES.longitude;

  const targetRegion = useMemo(
    () => ({
      latitude: storeLatitude,
      longitude: storeLongitude,
      latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
      longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
    }),
    [storeLatitude, storeLongitude]
  );

  const handleMapReady = useCallback(() => {
    isMapReadyRef.current = true;
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }
  }, [targetRegion]);

  useEffect(() => {
    if (viewState === 'PHARMACY_MAP' && isMapReadyRef.current && mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }
  }, [viewState, targetRegion]);

  // VIEW 3: Google Map Pin View
  if (viewState === 'PHARMACY_MAP') {

    return (
      <View style={styles.viewContainer}>
        {/* Exact OneRx Header: Left < back chevron + Title "Nearby Brand Availability" */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onSetViewState?.('PHARMACIES')}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeftSvg size={20} color={colors.text.primary} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <AppText style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
              Nearby Brand Availability
            </AppText>
          </View>
        </View>

        {/* Rounded Google Map Card (height: verticalScale(230), borderRadius: radii.card) */}
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={isDark ? DARK_MAP_STYLE : []}
            initialRegion={targetRegion}
            onMapReady={handleMapReady}
          >
            <Marker
              coordinate={{ latitude: storeLatitude, longitude: storeLongitude }}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.markerTooltip, { backgroundColor: colors.surface.tooltip }]}>
                  <AppText style={[styles.markerTooltipText, { color: colors.text.inverse }]}>
                    {activeStore.name || 'Shaheen Chemist'}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.markerTriangle,
                    { borderTopColor: colors.surface.tooltip },
                  ]}
                />
                <View style={styles.pinWrapper}>
                  <MapTeardropPinIcon
                    pinColor={colors.brand.accent}
                    dotColor={colors.cta.sliderKnob}
                    width={28}
                    height={34}
                  />
                </View>
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Address Pill Card Below Map */}
        <View
          style={[
            styles.addressPill,
            {
              backgroundColor: colors.surface.card,
              borderColor: colors.border.subtle,
              ...(isDark ? shadows.dark.none : shadows.light.subtle),
            },
          ]}
        >
          <LinearGradient
            colors={
              Array.isArray(colors.input?.iconTeal)
                ? colors.input.iconTeal
                : [colors.input?.iconTeal || colors.pastel.teal, colors.surface.card]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.addressIconBadge,
              {
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border.subtle,
              },
            ]}
          >
            <LocationPinIcon size={24} color={colors.text.primary} strokeWidth={1.3} />
          </LinearGradient>

          <AppText style={[styles.addressText, { color: colors.text.primary }]} numberOfLines={1}>
            {activeStore.address || activeStore.location}
          </AppText>
        </View>

        <View style={styles.flexSpacer} />

        {/* Full-Width Rounded Pill Close Button */}
        <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
          <TouchableOpacity
            style={[
              styles.footerCloseBtn,
              {
                borderColor: colors.border.modalCloseBtn,
                backgroundColor: colors.surface.modalCloseBtnBg,
                marginBottom: insets.bottom > 0 ? spacing.xs : spacing.sm,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <AppText style={[styles.closeBtnText, { color: colors.text.modalCloseBtn }]}>
              Close
            </AppText>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // VIEW 2: Nearby Brand Availability Pharmacy List
  const handleBackFromList = () => {
    if (onBack) {
      onBack();
    } else if (onSetViewState) {
      onSetViewState('SEARCH');
    } else {
      onClose?.();
    }
  };

  return (
    <View style={styles.viewContainer}>
      {/* Exact OneRx Header: Left < back chevron + Title + Subtitle */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackFromList}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftSvg size={20} color={colors.text.primary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <AppText style={[styles.headerTitle, { color: colors.text.primary }]} numberOfLines={1}>
            Nearby Brand Availability
          </AppText>
          <AppText
            style={[styles.headerSubtitleMono, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            4 Nearby Pharmacies • 7 Distant Pharmacies
          </AppText>
        </View>
      </View>

      {skuVisibilityEnabled ? (
        <ScrollView
          style={styles.flexList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {pharmacies.map((pharma) => {
            const isNearby = pharma.status === 'Nearby' || pharma.status === 'In Stock';
            const statusColor = isNearby ? colors.status.available : colors.brand.accent;
            const distanceStr = String(pharma?.distance ?? '0 km');
            const distNum = distanceStr.includes(' ') ? distanceStr.split(' ')[0] : distanceStr;

            return (
              <TouchableOpacity
                key={pharma.id}
                style={[
                  styles.pharmacyCard,
                  {
                    backgroundColor: colors.surface.inputSecondary,
                    borderColor: colors.border.card,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedPharmacy(pharma);
                  onSetViewState?.('PHARMACY_MAP', pharma);
                }}
              >
                <View style={styles.pharmacyInfoCol}>
                  <AppText style={[styles.pharmacyName, { color: colors.text.primary }]}>
                    {pharma.name}
                  </AppText>
                  <View style={styles.detailsRow}>
                    <AppText style={[styles.statusText, { color: statusColor }]}>
                      {pharma.status}
                    </AppText>
                    <AppText style={[styles.dotSeparator, { color: colors.text.tertiary }]}>
                      {' • '}
                    </AppText>
                    <AppText
                      style={[styles.detailText, { color: colors.text.secondary }]}
                      numberOfLines={1}
                    >
                      {pharma.location}
                    </AppText>
                  </View>
                </View>

                <View style={styles.distanceContainer}>
                  <AppText style={[styles.distanceNumber, { color: colors.text.primary }]}>
                    {distNum}
                  </AppText>
                  <AppText style={[styles.distanceUnit, { color: colors.text.secondary }]}>
                    km
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        /* Reciprocal SKU Visibility Gate Notice when SKU Visibility is OFF in Settings */
        <ScrollView style={styles.flexList} contentContainerStyle={styles.listContent}>
          <View
            style={[
              styles.privacyCard,
              {
                backgroundColor: colors.status.accentBg,
                borderColor: colors.brand.accent,
              },
            ]}
          >
            <View style={styles.privacyIconWrap}>
              <Svg width={scale(32)} height={scale(32)} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke={colors.brand.accent}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M12 8v4M12 16h.01"
                  stroke={colors.brand.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <AppText style={[styles.privacyTitle, { color: colors.text.primary }]}>
              Nearby Pharmacy Stock is Locked
            </AppText>

            <AppText style={[styles.privacyBody, { color: colors.text.secondary }]}>
              Nearby pharmacy SKU availability is hidden because SKU Visibility is turned OFF in Settings. Enable SKU Visibility to share stock and unlock nearby availability.
            </AppText>

            <AppButton
              variant="primary"
              size="md"
              title="Enable SKU Visibility in Settings"
              onPress={() => {
                onClose?.();
                onNavigateSettings?.();
              }}
            />
          </View>
        </ScrollView>
      )}

      {/* Full-Width Rounded Pill Close Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
        <TouchableOpacity
          style={[
            styles.footerCloseBtn,
            {
              borderColor: colors.border.modalCloseBtn,
              backgroundColor: colors.surface.modalCloseBtnBg,
              marginBottom: insets.bottom > 0 ? spacing.xs : spacing.sm,
            },
          ]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <AppText style={[styles.closeBtnText, { color: colors.text.modalCloseBtn }]}>
            Close
          </AppText>
        </TouchableOpacity>
      </SafeAreaView>
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
    flexShrink: 0,
  },
  backBtn: {
    padding: spacing.xs,
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    ...typography.titleMedium,
  },
  headerSubtitleMono: {
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    fontSize: scaleFont(11.5),
    lineHeight: scaleFont(15),
    marginTop: spacing.xxs,
  },
  flexList: {
    flex: 1,
  },
  flexSpacer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  pharmacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  pharmacyInfoCol: {
    flex: 1,
    marginRight: spacing.md,
  },
  pharmacyName: {
    ...typography.bodyMedium,
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  statusText: {
    ...typography.badge,
  },
  dotSeparator: {
    ...typography.bodyMediumMedium,
  },
  detailText: {
    ...typography.caption,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexShrink: 0,
  },
  distanceNumber: {
    fontSize: scaleFont(24),
    lineHeight: scaleFont(24),
    fontFamily: fontFamilies.monoMedium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  distanceUnit: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  bottomBarContainer: {
    width: '100%',
    paddingTop: spacing.xs,
    flexShrink: 0,
  },
  footerCloseBtn: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  closeBtnText: {
    ...typography.bodyLarge,
  },
  mapWrapper: {
    height: verticalScale(230),
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  map: {
    width: '100%',
    height: verticalScale(230),
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerTooltip: {
    paddingHorizontal: spacing.md,
    paddingVertical: verticalScale(7),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.light.tooltip,
  },
  markerTooltipText: {
    ...typography.captionMedium,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: scale(6),
    borderRightWidth: scale(6),
    borderTopWidth: scale(7),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -verticalScale(0.5),
  },
  pinWrapper: {
    alignItems: 'center',
    marginTop: verticalScale(1),
  },
  addressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: scale(6),
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: spacing.xs,
  },
  addressIconBadge: {
    width: scale(38),
    height: scale(38),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addressText: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.bodyMedium,
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
    fontSize: scaleFont(16),
    lineHeight: scaleFont(21),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: verticalScale(6),
  },
  privacyBody: {
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(17),
    fontFamily: fontFamilies.primaryRegular,
    textAlign: 'center',
    paddingHorizontal: scale(10),
    marginBottom: verticalScale(14),
  },
});

export default PharmacyMapView;
