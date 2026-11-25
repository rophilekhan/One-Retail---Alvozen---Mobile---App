import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, AppInput, AppToast, GlassCard } from '../core/index.js';
import { MapPinIcon, TargetMapIcon } from '../../assets/vectors/index.js';
import {
  requestLocationPermissionStatus,
  reverseGeocode,
  DARK_MAP_STYLE,
  DEFAULT_COORDINATES,
  parseFiniteCoord,
} from '../../services/geocodingService.js';

/**
 * PharmacyMapAddressCard
 * Modular domain card providing interactive Google MapView preview, quick GPS locate FAB,
 * full map trigger pill, physical street address AppInput, and live GPS coordinates badge.
 *
 * @param {Object} props
 * @param {string} props.address
 * @param {Function} props.onAddressChange
 * @param {Object} props.coordinates
 * @param {Function} props.onCoordinatesChange
 * @param {Function} props.onOpenFullMap
 */
export const PharmacyMapAddressCard = ({
  address,
  onAddressChange,
  coordinates,
  onCoordinatesChange,
  onOpenFullMap,
}) => {
  const { colors, isDark, radii, typography } = useTheme();
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef(null);
  const isMapReadyRef = useRef(false);

  const parsedLat = parseFiniteCoord(coordinates?.latitude);
  const parsedLng = parseFiniteCoord(coordinates?.longitude);
  const safeLat = Number.isFinite(parsedLat) ? parsedLat : DEFAULT_COORDINATES.latitude;
  const safeLng = Number.isFinite(parsedLng) ? parsedLng : DEFAULT_COORDINATES.longitude;

  const targetRegion = useMemo(
    () => ({
      latitude: safeLat,
      longitude: safeLng,
      latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
      longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
    }),
    [safeLat, safeLng]
  );

  const handleMapReady = useCallback(() => {
    isMapReadyRef.current = true;
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }
  }, [targetRegion]);

  useEffect(() => {
    if (isMapReadyRef.current && mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(targetRegion, 300);
    }
  }, [targetRegion]);

  const handleQuickGps = async () => {
    try {
      setIsLocating(true);
      const { granted, status } = await requestLocationPermissionStatus();
      if (!granted) {
        setIsLocating(false);
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
            title: 'Location Permission',
            message: 'Please allow location permission in device settings to detect GPS.',
            type: 'error',
          });
        }
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          setIsLocating(false);
          if (position?.coords) {
            const lat = parseFiniteCoord(position.coords.latitude);
            const lng = parseFiniteCoord(position.coords.longitude);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            onCoordinatesChange?.({ latitude: lat, longitude: lng });
            if (isMapReadyRef.current && mapRef.current?.animateToRegion) {
              mapRef.current.animateToRegion(
                {
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
                  longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
                },
                300
              );
            }
            try {
              const res = await reverseGeocode(lat, lng);
              if (res?.formattedAddress) {
                onAddressChange?.(res.formattedAddress);
              }
            } catch {
              // Ignore geocode error
            }
            AppToast.show({
              title: 'Location Updated',
              message: 'Current GPS position pinned successfully.',
              type: 'success',
            });
          }
        },
        (error) => {
          setIsLocating(false);
          AppToast.show({
            title: 'GPS Signal Unavailable',
            message: error?.message || 'Could not acquire GPS position.',
            type: 'error',
          });
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
      );
    } catch {
      setIsLocating(false);
    }
  };

  const cardContent = (
    <View style={styles.cardInner}>
      {/* Live Interactive MapView */}
      <View style={styles.mapCanvasHolder}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={targetRegion}
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onMapReady={handleMapReady}
        >
          <Marker
            coordinate={{
              latitude: safeLat,
              longitude: safeLng,
            }}
            title="Pharmacy Location"
            description={address}
          />
        </MapView>

        {/* Quick Floating GPS Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleQuickGps}
          style={[
            styles.quickGpsFab,
            {
              backgroundColor: colors.surface?.cardElevated || colors.surface?.card,
              borderColor: colors.border?.card || colors.border?.subtle,
              shadowColor: isDark ? colors.camera?.shadow : colors.surface?.inputShadow,
            },
          ]}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.brand.primary} />
          ) : (
            <TargetMapIcon size={scale(28)} />
          )}
        </TouchableOpacity>

        {/* Adjust Pin on Full Map Floating Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenFullMap}
          style={[
            styles.adjustPinBtn,
            {
              backgroundColor: colors.surface?.cardElevated || colors.surface?.card,
              borderColor: colors.border?.card || colors.border?.subtle,
              shadowColor: isDark ? colors.camera?.shadow : colors.surface?.inputShadow,
            },
          ]}
        >
          <MapPinIcon size={scale(14)} color={colors.brand.primary} />
          <AppText
            style={[
              styles.adjustPinText,
              { color: colors.text.primary, fontFamily: fontFamilies.primaryMedium },
            ]}
          >
            Adjust Pin on Full Map
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Address Input & Live Coordinate Badge */}
      <View style={styles.addressFormBlock}>
        <AppInput
          label="Pharmacy Physical Address"
          placeholder="e.g. Shop #4, Main Market, Gulberg III, Lahore"
          value={address}
          onChangeText={onAddressChange}
          iconTone="teal"
          iconLeft={<MapPinIcon size={scale(18)} color={colors.text.primary} />}
          style={{ width: '100%', marginVertical: 0 }}
        />

        <View
          style={[
            styles.coordBadge,
            {
              backgroundColor: isDark ? colors.glass?.primary : colors.surface?.iconBg,
              borderColor: isDark ? colors.border?.card : colors.border?.pointsBadge,
            },
          ]}
        >
          <AppText
            style={[
              styles.coordText,
              typography?.monoSmall,
              { color: colors.brand.primary, fontFamily: fontFamilies.monoRegular },
            ]}
          >
            {`GPS Coordinates: ${safeLat.toFixed(5)}° N, ${safeLng.toFixed(5)}° E`}
          </AppText>
        </View>
      </View>
    </View>
  );

  return isDark ? (
    <GlassCard radius={radii.card} style={styles.cardOuter} contentStyle={{ padding: 0 }}>
      {cardContent}
    </GlassCard>
  ) : (
    <View
      style={[
        styles.cardOuter,
        styles.lightCard,
        {
          backgroundColor: colors.surface?.card,
          borderColor: colors.border?.card,
          shadowColor: colors.surface?.inputShadow,
        },
      ]}
    >
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    width: '100%',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  lightCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 3,
  },
  cardInner: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: moderateScale(24),
    overflow: 'hidden',
  },
  mapCanvasHolder: {
    height: verticalScale(190),
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
  },
  map: {
    width: '100%',
    height: verticalScale(190),
  },
  quickGpsFab: {
    position: 'absolute',
    top: verticalScale(10),
    right: scale(10),
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  adjustPinBtn: {
    position: 'absolute',
    bottom: verticalScale(12),
    right: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(999),
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  adjustPinText: {
    fontSize: scaleFont(12),
  },
  addressFormBlock: {
    padding: scale(16),
    gap: verticalScale(10),
  },
  coordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    borderWidth: 1,
  },
  coordText: {
    fontSize: scaleFont(11.5),
  },
});

export default PharmacyMapAddressCard;
