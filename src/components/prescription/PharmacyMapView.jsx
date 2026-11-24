import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { fontFamilies, typography } from '../../theme/typography.js';
import { spacing } from '../../theme/spacing.js';
import { radii } from '../../theme/radii.js';
import { shadows } from '../../theme/shadows.js';
import { scale, scaleFont, verticalScale } from '../../theme/responsive.js';
import { AppText, AppBackButton } from '../global/index.js';
import { usePharmacyStore } from '../../store/usePharmacyStore.js';

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b687f' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#141c28' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#172130' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#192638' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2d42' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#255e4e' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f4e41' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1522' }] },
];

const FALLBACK_PHARMACIES = [
  {
    id: 1,
    name: 'Shaheen Chemist',
    location: 'PECHS Commercial Area',
    address: 'Plot 42-B, PECHS Commercial Area, Karachi',
    brands: 4,
    distance: '0.4 km',
    distanceKm: '0.4',
    status: 'In Stock',
    stockUnits: 40,
    phone: '021-34567890',
    latitude: 24.8620,
    longitude: 67.0650,
  },
  {
    id: 2,
    name: 'Al-Noor Pharmacy',
    location: 'Tariq Road Block 2',
    address: '15-C, Main Tariq Road, Karachi',
    brands: 4,
    distance: '0.9 km',
    distanceKm: '0.9',
    status: 'In Stock',
    stockUnits: 25,
    phone: '021-34567891',
    latitude: 24.8710,
    longitude: 67.0600,
  },
  {
    id: 3,
    name: 'Medix Pharmacy',
    location: 'Bahadurabad Chowrangi',
    address: 'Shop 4, Alamgir Road, Bahadurabad, Karachi',
    brands: 4,
    distance: '1.2 km',
    distanceKm: '1.2',
    status: 'In Stock',
    stockUnits: 18,
    phone: '021-34567892',
    latitude: 24.8820,
    longitude: 67.0680,
  },
  {
    id: 4,
    name: 'Habib Medical Store',
    location: 'Sharah-e-Faisal',
    address: 'Business Avenue, PECHS Block 6, Karachi',
    brands: 4,
    distance: '3.1 km',
    distanceKm: '3.1',
    status: 'Out of Stock',
    stockUnits: 0,
    phone: '021-34567893',
    latitude: 24.8650,
    longitude: 67.0780,
  },
];

export const PharmacyMapView = ({
  viewState = 'PHARMACIES',
  selectedPharmacy,
  setSelectedPharmacy,
  onClose,
  onSetViewState,
  onNavigateSettings,
  medicine = {},
  hideHeader = false,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const skuVisibilityEnabled = usePharmacyStore((s) => s.skuVisibilityEnabled);
  const pharmacies = FALLBACK_PHARMACIES;

  // STEP 3: Store Location on Google Map (Map Mode)
  if (viewState === 'PHARMACY_MAP') {
    const activeStore = selectedPharmacy || pharmacies[0];
    const storeLatitude = activeStore.latitude || 24.8620;
    const storeLongitude = activeStore.longitude || 67.0650;

    return (
      <View style={styles.viewContainer}>
        {/* Exact OneRx Header: LEFT Back Button, NO right-side cross X button */}
        {!hideHeader && (
          <View style={styles.header}>
            <AppBackButton
              onPress={() => onSetViewState('PHARMACIES')}
              size={scale(36)}
              style={styles.backBtn}
            />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
                {activeStore.name}
              </AppText>
              <AppText style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
                {activeStore.distance} • {activeStore.status}
              </AppText>
            </View>
          </View>
        )}

        {/* Live Google Map */}
        <View style={styles.mapWrapper}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={isDark ? darkMapStyle : []}
            initialRegion={{
              latitude: storeLatitude,
              longitude: storeLongitude,
              latitudeDelta: 0.035,
              longitudeDelta: 0.035,
            }}
          >
            <Marker coordinate={{ latitude: storeLatitude, longitude: storeLongitude }} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.markerContainer}>
                <View style={[styles.markerTooltip, { backgroundColor: colors.surface.tooltip || (isDark ? '#262626' : '#000000') }]}>
                  <AppText style={[styles.markerTooltipText, { color: colors.text.inverse || '#FFFFFF' }]}>
                    {activeStore.name}
                  </AppText>
                </View>
                <View style={[styles.markerTriangle, { borderTopColor: colors.surface.tooltip || (isDark ? '#262626' : '#000000') }]} />

                <View style={styles.pinWrapper}>
                  <Svg width={scale(28)} height={scale(34)} viewBox="0 0 28 34" fill="none">
                    <Path
                      d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 34 14 34C14 34 28 24.5 28 14C28 6.26801 21.732 0 14 0Z"
                      fill={colors.brand.accent || '#FB6B03'}
                    />
                    <Circle cx="14" cy="13" r="4.5" fill="#FFFFFF" />
                  </Svg>
                </View>
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Address Pill */}
        <View
          style={[
            styles.addressPill,
            {
              backgroundColor: colors.surface.card,
              borderColor: colors.border.subtle,
              ...(isDark ? (shadows?.dark?.none || shadows?.none) : (shadows?.light?.subtle || shadows?.subtle)),
            },
          ]}
        >
          <LinearGradient
            colors={
              Array.isArray(colors.input?.iconTeal)
                ? colors.input.iconTeal
                : colors.input?.iconTeal
                ? [colors.input.iconTeal, '#FFFFFF']
                : ['#DAF3F7', '#EAF7F8']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.addressIconBadge, { borderWidth: isDark ? 1 : 0, borderColor: colors.border.subtle }]}
          >
            <Svg width={scale(28)} height={scale(28)} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z"
                stroke={colors.text.primary}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="12" cy="9" r="3" stroke={colors.text.primary} strokeWidth="1.3" />
            </Svg>
          </LinearGradient>

          <AppText style={[styles.addressText, { color: colors.text.primary }]} numberOfLines={1}>
            {activeStore.address || activeStore.location}
          </AppText>
        </View>

        <View style={{ flex: 1 }} />

        <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
          <TouchableOpacity
            style={[
              styles.footerCloseBtn,
              {
                borderColor: colors.border.subtle,
                backgroundColor: colors.surface.modalCloseBtnBg || 'transparent',
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
      </View>
    );
  }

  // STEP 2: Nearby Medical Stores (List Mode)
  return (
    <View style={styles.viewContainer}>
      {!hideHeader && (
        <View style={styles.header}>
          <AppBackButton
            onPress={() => onSetViewState('BRANDS')}
            size={scale(36)}
            style={styles.backBtn}
          />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <AppText style={[styles.headerTitle, { color: colors.text.primary }]}>
              Nearby Brand Availability
            </AppText>
            <AppText style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              3 Nearby Pharmacies • In Stock
            </AppText>
          </View>
        </View>
      )}

      {skuVisibilityEnabled ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {pharmacies.map((pharma) => {
            const isAvail = pharma.status === 'In Stock';
            const statusColor = isAvail ? (colors.status?.available || '#49C88F') : (colors.brand?.accent || '#FB6B03');
            const distanceStr = String(pharma?.distance ?? '0 km');
            const distNum = distanceStr.includes(' ') ? distanceStr.split(' ')[0] : distanceStr;

            return (
              <TouchableOpacity
                key={pharma.id}
                style={[
                  styles.pharmacyCard,
                  {
                    backgroundColor: colors.surface.inputSecondary || (isDark ? 'rgba(255,255,255,0.05)' : '#F5F6F8'),
                    borderColor: colors.border.card || colors.border.subtle,
                    borderWidth: 1,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedPharmacy(pharma);
                  onSetViewState('PHARMACY_MAP');
                }}
              >
                <View style={{ flex: 1, marginRight: spacing.md }}>
                  <AppText style={[styles.pharmacyName, { color: colors.text.primary }]}>
                    {pharma.name}
                  </AppText>
                  <View style={styles.detailsRow}>
                    <AppText style={[styles.statusText, { color: statusColor }]}>{pharma.status}</AppText>
                    <AppText style={[styles.dotSeparator, { color: colors.text.tertiary }]}>{' • '}</AppText>
                    <AppText style={[styles.detailText, { color: colors.text.secondary }]}>{pharma.location}</AppText>
                    <AppText style={[styles.dotSeparator, { color: colors.text.tertiary }]}>{' • '}</AppText>
                    <AppText style={[styles.detailText, { color: colors.text.secondary }]}>
                      {pharma.stockUnits ? `${pharma.stockUnits} units` : `${pharma.brands} Brands`}
                    </AppText>
                  </View>
                </View>
                <View style={styles.distanceContainer}>
                  <AppText style={[styles.distanceNumber, { color: colors.text.primary }]}>{distNum}</AppText>
                  <AppText style={[styles.distanceUnit, { color: colors.text.secondary }]}>km</AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        /* Reciprocal SKU Visibility Gate Notice */
        <ScrollView contentContainerStyle={styles.listContent}>
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
              <Svg width={scale(32)} height={scale(32)} viewBox="0 0 24 24" fill="none">
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

            <AppText style={[styles.privacyBody, { color: colors.text.secondary }]}>
              SKU Visibility is turned OFF in Store Settings. Under OneRetail's reciprocal policy, pharmacies that do not share stock visibility cannot view real-time stock at neighboring pharmacies.
            </AppText>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onClose?.();
                onNavigateSettings?.();
              }}
              style={[styles.settingsBtn, { backgroundColor: colors.brand?.primary || '#009BA9' }]}
            >
              <AppText style={styles.settingsBtnText}>
                Go to Settings & Enable SKU Visibility
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <SafeAreaView edges={['bottom']} style={styles.bottomBarContainer}>
        <TouchableOpacity
          style={[
            styles.footerCloseBtn,
            {
              borderColor: colors.border.subtle,
              backgroundColor: colors.surface.modalCloseBtnBg || 'transparent',
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
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  backBtn: { justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...typography.titleMedium },
  headerSubtitle: { ...typography.caption, marginTop: spacing.xxs },
  listContent: { paddingBottom: spacing.lg },
  pharmacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
    borderRadius: radii.card,
    marginBottom: spacing.md,
  },
  pharmacyName: { ...typography.bodyMedium, marginBottom: spacing.xxs },
  detailsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' },
  statusText: { ...typography.badge },
  dotSeparator: { ...typography.bodyMediumMedium },
  detailText: { ...typography.caption },
  distanceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  distanceNumber: {
    fontSize: scaleFont(24),
    lineHeight: scaleFont(24),
    fontFamily: fontFamilies.mono,
    fontWeight: '400',
  },
  distanceUnit: { ...typography.caption, marginLeft: spacing.xs },
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
  closeBtnText: { ...typography.bodyLarge },
  mapWrapper: {
    height: verticalScale(280),
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  map: { width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center' },
  markerTooltip: {
    paddingHorizontal: spacing.md,
    paddingVertical: verticalScale(7),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.light.tooltip,
  },
  markerTooltipText: { ...typography.captionMedium },
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
  pinWrapper: { alignItems: 'center', marginTop: verticalScale(1) },
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
  addressText: { flex: 1, marginLeft: spacing.sm, ...typography.bodyMedium },
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
  settingsBtn: {
    height: verticalScale(44),
    paddingHorizontal: scale(16),
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primaryBold,
    fontWeight: '700',
  },
});

export default PharmacyMapView;
