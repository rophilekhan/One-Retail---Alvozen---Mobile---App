import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  useWindowDimensions,
  Alert,
  Linking,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
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
  MetricIconDisc,
} from '../core/index.js';
import {
  DARK_MAP_STYLE,
  DEFAULT_COORDINATES,
  reverseGeocode,
  searchPlacesOrAddress,
  requestLocationPermissionStatus,
  isCoordinatesString,
  parseCoordinatesString,
} from '../../services/geocodingService.js';
import {
  MapPinIcon,
  TargetMapIcon,
  CustomMapMarkerIcon,
  CloseIcon,
} from '../../assets/vectors/AuthIcons.jsx';

const parseFiniteCoord = (value) => {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') {
    return NaN;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
};

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
  const { colors, isDark, typography } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const mapHeight = Math.round(windowHeight * 0.56);
  const mapRef = useRef(null);
  const isMapReadyRef = useRef(false);

  // Parse initial coordinates with finite coercion
  const parsedCoords = isCoordinatesString(selectedAddress)
    ? parseCoordinatesString(selectedAddress)
    : null;

  const explicitLat = parseFiniteCoord(selectedCoordinates?.latitude ?? parsedCoords?.latitude);
  const explicitLng = parseFiniteCoord(selectedCoordinates?.longitude ?? parsedCoords?.longitude);
  const hasExplicitCoords = Number.isFinite(explicitLat) && Number.isFinite(explicitLng);

  const initialLat = hasExplicitCoords ? explicitLat : DEFAULT_COORDINATES.latitude;
  const initialLng = hasExplicitCoords ? explicitLng : DEFAULT_COORDINATES.longitude;

  const [currentCoords, setCurrentCoords] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const [currentAddress, setCurrentAddress] = useState(
    selectedAddress && !isCoordinatesString(selectedAddress) && selectedAddress !== 'Locating address...'
      ? selectedAddress
      : 'Saddar Town, Karachi'
  );

  const [currentArea, setCurrentArea] = useState('');
  const [currentCity, setCurrentCity] = useState('');

  const [region, setRegion] = useState({
    latitude: initialLat,
    longitude: initialLng,
    latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
    longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
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

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // Animate pin lift
  const animatePinLift = (lifting) => {
    Animated.spring(pinLiftAnim, {
      toValue: lifting ? 1 : 0,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const fetchAddressFromCoordinates = useCallback(async (latitude, longitude) => {
    const lat = parseFiniteCoord(latitude);
    const lng = parseFiniteCoord(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setIsFetching(true);
    try {
      const geoResult = await reverseGeocode(lat, lng);
      if (geoResult?.formattedAddress) {
        setCurrentAddress(geoResult.formattedAddress);
        setCurrentArea(geoResult.area || '');
        setCurrentCity(geoResult.city || '');
      } else {
        setCurrentAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch {
      setCurrentAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const applyLocation = useCallback((latitude, longitude, shouldReverseGeocode = true) => {
    const lat = parseFiniteCoord(latitude);
    const lng = parseFiniteCoord(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const coords = { latitude: lat, longitude: lng };
    const targetRegion = {
      ...coords,
      latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
      longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
    };
    setCurrentCoords(coords);
    setRegion(targetRegion);

    if (isMapReadyRef.current && mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }

    if (shouldReverseGeocode) {
      fetchAddressFromCoordinates(coords.latitude, coords.longitude);
    }
  }, [fetchAddressFromCoordinates]);

  const handleMapReady = useCallback(() => {
    isMapReadyRef.current = true;
    const lat = parseFiniteCoord(currentCoords?.latitude);
    const lng = parseFiniteCoord(currentCoords?.longitude);
    const targetRegion = {
      latitude: Number.isFinite(lat) ? lat : DEFAULT_COORDINATES.latitude,
      longitude: Number.isFinite(lng) ? lng : DEFAULT_COORDINATES.longitude,
      latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
      longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
    };
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }
  }, [currentCoords]);

  // Current GPS location trigger
  const handleCurrentLocation = useCallback(async (isAuto = false) => {
    try {
      setIsFetching(true);
      const { granted, status } = await requestLocationPermissionStatus();

      if (!granted) {
        setIsFetching(false);
        if (!isAuto) {
          if (status === 'blocked') {
            Alert.alert(
              'Location Permission Blocked',
              'Enable Location permission in device Settings to detect your pharmacy GPS position.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings().catch(() => { }),
                },
              ]
            );
          } else {
            AppToast.show({
              title: 'Location Permission Required',
              message: 'Please allow GPS location permission to pin automatically.',
              type: 'error',
            });
          }
        }
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          if (!position?.coords) {
            setIsFetching(false);
            return;
          }
          const lat = parseFiniteCoord(position.coords.latitude);
          const lng = parseFiniteCoord(position.coords.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            setIsFetching(false);
            return;
          }
          applyLocation(lat, lng, true);
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
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
      );
    } catch {
      setIsFetching(false);
    }
  }, [applyLocation]);

  const wasVisibleRef = useRef(false);

  // Reset/sync on modal open transitions
  useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      wasVisibleRef.current = true;
      const selLat = parseFiniteCoord(selectedCoordinates?.latitude);
      const selLng = parseFiniteCoord(selectedCoordinates?.longitude);
      if (Number.isFinite(selLat) && Number.isFinite(selLng)) {
        applyLocation(selLat, selLng, !selectedAddress || isCoordinatesString(selectedAddress));
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
    } else if (!visible) {
      wasVisibleRef.current = false;
      isMapReadyRef.current = false;
    }
  }, [
    visible,
    selectedAddress,
    selectedCoordinates?.latitude,
    selectedCoordinates?.longitude,
    applyLocation,
    handleCurrentLocation,
  ]);

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
    const lat = parseFiniteCoord(newRegion?.latitude);
    const lng = parseFiniteCoord(newRegion?.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setRegion(newRegion);
    setCurrentCoords({
      latitude: lat,
      longitude: lng,
    });

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchAddressFromCoordinates(lat, lng);
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

  const mapContainerStyle = [styles.mapCanvasHolder, { height: mapHeight }];
  const mapStyle = { width: '100%', height: mapHeight };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      title="Pin Pharmacy Location"
      style={{
        backgroundColor: colors.surface?.sheet || colors.surface?.card,
      }}
    >
      <View style={styles.modalRoot}>
        {/* Top Floating Glass Search Bar */}
        <View style={styles.floatingSearchContainer}>
          <View
            style={[
              styles.searchBarGlass,
              {
                backgroundColor: colors.surface?.cardElevated || colors.surface?.card,
                borderColor: colors.border?.card || colors.border?.subtle,
                shadowColor: isDark ? colors.camera?.shadow : colors.surface?.inputShadow,
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
                  backgroundColor: isDark ? colors.surface?.sheetElevated : colors.surface?.card,
                  borderColor: colors.border?.card || colors.border?.subtle,
                  shadowColor: isDark ? colors.camera?.shadow : colors.surface?.inputShadow,
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
                        borderBottomColor: colors.surface?.divider || colors.border?.subtle,
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

        {/* Map Canvas Holder with Explicit Pixel Height for Android Modals */}
        <View style={mapContainerStyle}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={mapStyle}
            initialRegion={region}
            customMapStyle={isDark ? DARK_MAP_STYLE : []}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onMapReady={handleMapReady}
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
                  {
                    color: colors.cta?.sliderKnob || colors.surface?.button,
                    fontFamily: fontFamilies.primaryMedium,
                  },
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
                  backgroundColor: colors.camera?.shadow || colors.surface?.tooltip,
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
                backgroundColor: colors.surface?.cardElevated || colors.surface?.card,
                borderColor: colors.border?.card || colors.border?.subtle,
                shadowColor: isDark ? colors.camera?.shadow : colors.surface?.inputShadow,
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
                backgroundColor: isDark ? colors.glass?.primary : colors.surface?.iconBg,
                borderColor: isDark ? colors.border?.card : colors.border?.pointsBadge,
              },
            ]}
          >
            <MetricIconDisc variant="teal" size={scale(36)} marginRight={scale(10)}>
              <MapPinIcon size={scale(18)} />
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
