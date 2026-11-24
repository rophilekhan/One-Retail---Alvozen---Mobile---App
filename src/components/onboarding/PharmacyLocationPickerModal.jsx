import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import {
  AppText,
  AppButton,
  AppInput,
  AppModal,
  AppToast,
  GlassCard,
  MetricIconDisc,
} from '../core/index.js';
import {
  reverseGeocode,
  searchPlacesOrAddress,
  requestLocationPermission,
  isCoordinatesString,
  parseCoordinatesString,
} from '../../services/geocodingService.js';
import {
  MapPinIcon,
  TargetMapIcon,
  CustomMapMarkerIcon,
  CloseIcon,
} from '../../assets/vectors/AuthIcons.jsx';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#131B24' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8898AA' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F161E' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#2B394A' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#2B394A' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#0D141C' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1C2735' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#5C748D' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#102636' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#243346' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#7E91A6' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1A5360' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#123D47' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#8BE4ED' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#7E91A6' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091018' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3E566E' }] },
];

/**
 * PharmacyLocationPickerModal
 *
 * Professional Google Maps Location Picker matching OneRx UX:
 * - Real MapView (PROVIDER_GOOGLE) with custom dark mode theme
 * - Animated center floating brand pin that lifts while dragging and settles on release
 * - Debounced reverse geocoding on pan release
 * - Floating glass address search bar with autocomplete dropdown
 * - Current GPS location floating target button
 * - Bottom glass confirmation sheet showing resolved address & coordinates
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onAddLocation
 * @param {string} [props.selectedAddress]
 * @param {Object} [props.selectedCoordinates]
 */
export const PharmacyLocationPickerModal = ({
  visible,
  onClose,
  onAddLocation,
  selectedAddress,
  selectedCoordinates,
}) => {
  const { colors, isDark, radii, typography } = useTheme();
  const mapRef = useRef(null);

  // Parse initial coordinates
  const parsedCoords = isCoordinatesString(selectedAddress)
    ? parseCoordinatesString(selectedAddress)
    : null;

  const hasExplicitCoords = Boolean(
    (selectedCoordinates?.latitude && selectedCoordinates?.longitude) ||
    (parsedCoords?.latitude && parsedCoords?.longitude)
  );

  const initialLat = hasExplicitCoords
    ? Number(selectedCoordinates?.latitude || parsedCoords?.latitude)
    : 31.5204;
  const initialLng = hasExplicitCoords
    ? Number(selectedCoordinates?.longitude || parsedCoords?.longitude)
    : 74.3587;

  const [currentCoords, setCurrentCoords] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const [currentAddress, setCurrentAddress] = useState(
    selectedAddress && !isCoordinatesString(selectedAddress) && selectedAddress !== 'Locating address...'
      ? selectedAddress
      : 'Main Boulevard, Gulberg III, Lahore'
  );

  const [currentArea, setCurrentArea] = useState('');
  const [currentCity, setCurrentCity] = useState('');

  const [region, setRegion] = useState({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Pin animation: lifts on drag, drops on release
  const pinLiftAnim = useRef(new Animated.Value(0)).current;
  const debounceTimerRef = useRef(null);
  const searchDebounceRef = useRef(null);

  // Animate pin lift
  const animatePinLift = (lifting) => {
    Animated.spring(pinLiftAnim, {
      toValue: lifting ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    setIsFetching(true);
    try {
      const geoResult = await reverseGeocode(latitude, longitude);
      if (geoResult?.formattedAddress) {
        setCurrentAddress(geoResult.formattedAddress);
        setCurrentArea(geoResult.area || '');
        setCurrentCity(geoResult.city || '');
      } else {
        setCurrentAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      }
    } catch {
      setCurrentAddress(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } finally {
      setIsFetching(false);
    }
  };

  const applyLocation = (latitude, longitude, shouldReverseGeocode = true) => {
    const coords = { latitude: Number(latitude), longitude: Number(longitude) };
    const targetRegion = {
      ...coords,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setCurrentCoords(coords);
    setRegion(targetRegion);

    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 700);
    }

    if (shouldReverseGeocode) {
      fetchAddressFromCoordinates(coords.latitude, coords.longitude);
    }
  };

  // Current GPS location trigger
  const handleCurrentLocation = async (isAuto = false) => {
    try {
      setIsFetching(true);
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        setIsFetching(false);
        if (!isAuto) {
          AppToast.show({
            title: 'Location Permission Required',
            message: 'Please enable GPS location permission in device settings to pin automatically.',
            type: 'error',
          });
        }
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          if (!position?.coords) {
            setIsFetching(false);
            return;
          }
          const { latitude, longitude } = position.coords;
          applyLocation(latitude, longitude, true);
        },
        (error) => {
          setIsFetching(false);
          if (!isAuto) {
            AppToast.show({
              title: 'GPS Signal Unavailable',
              message: error?.message || 'Could not acquire GPS position.',
              type: 'error',
            });
          }
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    } catch {
      setIsFetching(false);
    }
  };

  // Reset/sync on modal open
  useEffect(() => {
    if (visible) {
      if (selectedCoordinates?.latitude && selectedCoordinates?.longitude) {
        const lat = Number(selectedCoordinates.latitude);
        const lng = Number(selectedCoordinates.longitude);
        applyLocation(lat, lng, !selectedAddress || isCoordinatesString(selectedAddress));
        if (selectedAddress && !isCoordinatesString(selectedAddress)) {
          setCurrentAddress(selectedAddress);
        }
      } else if (isCoordinatesString(selectedAddress)) {
        const coords = parseCoordinatesString(selectedAddress);
        if (coords) {
          applyLocation(coords.latitude, coords.longitude, true);
        } else {
          handleCurrentLocation(true);
        }
      } else {
        handleCurrentLocation(true);
      }
    }
  }, [visible]);

  // Handle region change during pan
  const handleRegionChange = () => {
    if (!isDragging) {
      setIsDragging(true);
      animatePinLift(true);
    }
  };

  // Handle region change complete
  const handleRegionChangeComplete = (newRegion) => {
    setIsDragging(false);
    animatePinLift(false);
    setRegion(newRegion);
    setCurrentCoords({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }, 400);
  };

  // Handle search query changes
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlacesOrAddress(text);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const handleSelectSearchResult = (item) => {
    setSearchQuery('');
    setSearchResults([]);
    setCurrentAddress(item.formattedAddress || item.title);
    applyLocation(item.latitude, item.longitude, false);
  };

  const handleConfirm = () => {
    if (onAddLocation && currentCoords) {
      onAddLocation({
        address: currentAddress,
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        area: currentArea,
        city: currentCity,
      });
    }
    onClose();
  };

  // Pin animation styles
  const pinTranslateY = pinLiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const shadowScale = pinLiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.65],
  });

  const shadowOpacity = pinLiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.12],
  });

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      title="Pin Pharmacy Location"
      style={{
        backgroundColor: colors.surface?.sheet || (isDark ? '#0A0A0C' : '#FFFFFF'),
        height: '82%',
      }}
    >
      <View style={styles.modalRoot}>
        {/* Top Floating Glass Search Bar */}
        <View style={styles.floatingSearchContainer}>
          <View
            style={[
              styles.searchBarGlass,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 30, 0.94)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
                shadowColor: isDark ? '#000000' : (colors.surface?.inputShadow || '#6FB4C2'),
              },
            ]}
          >
            <MapPinIcon size={scale(18)} color={colors.brand.primary} />
            <AppInput
              placeholder="Search area, landmark or street in Pakistan..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              wrapperStyle={styles.searchInputInner}
              style={{ flex: 1, marginVertical: 0 }}
              inputStyle={{ fontSize: scaleFont(13.5), paddingVertical: 0 }}
            />
            {isSearching ? (
              <ActivityIndicator size="small" color={colors.brand.primary} />
            ) : searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <CloseIcon size={scale(16)} color={colors.text.secondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <View
              style={[
                styles.searchResultsCard,
                {
                  backgroundColor: isDark ? '#141E28' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                  shadowColor: isDark ? '#000000' : '#6FB4C2',
                },
              ]}
            >
              <ScrollView
                style={{ maxHeight: verticalScale(180) }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                nestedScrollEnabled={true}
              >
                {searchResults.map((item, idx) => (
                  <TouchableOpacity
                    key={`${item.latitude}-${item.longitude}-${idx}`}
                    activeOpacity={0.7}
                    onPress={() => handleSelectSearchResult(item)}
                    style={[
                      styles.searchResultItem,
                      idx < searchResults.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                      },
                    ]}
                  >
                    <MapPinIcon size={scale(16)} color={colors.brand.primary} />
                    <View style={{ flex: 1, marginLeft: scale(10) }}>
                      <AppText
                        variant="bodyMediumMedium"
                        colorType="primary"
                        numberOfLines={1}
                        style={{ fontSize: scaleFont(13) }}
                      >
                        {item.title}
                      </AppText>
                      <AppText
                        variant="caption"
                        colorType="muted"
                        numberOfLines={1}
                        style={{ fontSize: scaleFont(11), marginTop: 1 }}
                      >
                        {item.subtitle}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Map Canvas Holder */}
        <View style={styles.mapCanvasHolder}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={region}
            customMapStyle={isDark ? DARK_MAP_STYLE : []}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChange={handleRegionChange}
            onRegionChangeComplete={handleRegionChangeComplete}
          />

          {/* Center Fixed Teardrop Brand Pin with Animated Lift */}
          <View style={styles.centerPinContainer} pointerEvents="none">
            {/* Floating Live Tooltip */}
            <View
              style={[
                styles.pinTooltipPill,
                {
                  backgroundColor: colors.brand.primary,
                  shadowColor: colors.brand.primary,
                },
              ]}
            >
              <AppText
                style={[
                  styles.pinTooltipText,
                  { fontFamily: fontFamilies.primaryMedium },
                ]}
              >
                {isFetching ? 'Locating address...' : 'Pharmacy Pin'}
              </AppText>
            </View>
            <View
              style={[
                styles.pinTooltipArrow,
                { borderTopColor: colors.brand.primary },
              ]}
            />

            {/* Animated Pin */}
            <Animated.View
              style={{
                transform: [{ translateY: pinTranslateY }],
              }}
            >
              <CustomMapMarkerIcon size={scale(44)} color={colors.brand.primary} />
            </Animated.View>

            {/* Animated Ground Contact Shadow Ring */}
            <Animated.View
              style={[
                styles.pinGroundShadow,
                {
                  transform: [{ scaleX: shadowScale }, { scaleY: shadowScale }],
                  opacity: shadowOpacity,
                },
              ]}
            />
          </View>

          {/* Floating Glass Circular Current GPS Button */}
          <TouchableOpacity
            style={[
              styles.fabGpsButton,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 30, 0.92)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
                shadowColor: isDark ? '#000000' : (colors.surface?.inputShadow || '#6FB4C2'),
              },
            ]}
            activeOpacity={0.85}
            onPress={() => handleCurrentLocation(false)}
            accessibilityRole="button"
            accessibilityLabel="Locate Current GPS Position"
          >
            <TargetMapIcon size={scale(36)} />
          </TouchableOpacity>
        </View>

        {/* Bottom Glass Confirmation Sheet */}
        <View style={styles.bottomConfirmationSection}>
          <View
            style={[
              styles.resolvedAddressCard,
              {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F0F9FA',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 155, 169, 0.15)',
              },
            ]}
          >
            <MetricIconDisc variant="teal" size={scale(36)} marginRight={scale(10)}>
              <MapPinIcon size={scale(18)} color="#FFFFFF" />
            </MetricIconDisc>
            <View style={{ flex: 1 }}>
              <AppText
                variant="bodyMediumMedium"
                colorType="primary"
                numberOfLines={2}
                style={{ fontSize: scaleFont(13.5) }}
              >
                {currentAddress}
              </AppText>
              <AppText
                style={[
                  styles.coordMonoText,
                  typography?.monoSmall,
                  { color: colors.brand.primary, fontFamily: fontFamilies.monoRegular },
                ]}
              >
                {`Lat: ${currentCoords.latitude.toFixed(5)}, Lng: ${currentCoords.longitude.toFixed(5)}`}
              </AppText>
            </View>
          </View>

          <AppButton
            variant="primary"
            title="Confirm Pharmacy Location"
            onPress={handleConfirm}
            style={{ width: '100%', marginTop: verticalScale(12) }}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  floatingSearchContainer: {
    position: 'absolute',
    top: verticalScale(10),
    left: scale(14),
    right: scale(14),
    zIndex: 50,
  },
  searchBarGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
  searchInputInner: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: verticalScale(46),
    paddingHorizontal: scale(6),
  },
  searchResultsCard: {
    marginTop: verticalScale(6),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
  },
  mapCanvasHolder: {
    flex: 1,
    width: '100%',
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    position: 'relative',
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -scale(22),
    marginTop: -verticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  pinTooltipPill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: scale(999),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  pinTooltipText: {
    color: '#FFFFFF',
    fontSize: scaleFont(11),
    fontWeight: '600',
  },
  pinTooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(5),
    borderRightWidth: scale(5),
    borderTopWidth: verticalScale(5),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: verticalScale(2),
  },
  pinGroundShadow: {
    width: scale(18),
    height: verticalScale(6),
    borderRadius: scale(9),
    backgroundColor: '#000000',
    marginTop: -verticalScale(4),
  },
  fabGpsButton: {
    position: 'absolute',
    bottom: verticalScale(16),
    right: scale(16),
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 40,
  },
  bottomConfirmationSection: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  resolvedAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  coordMonoText: {
    fontSize: scaleFont(11.5),
    marginTop: verticalScale(2),
  },
});

export default PharmacyLocationPickerModal;
