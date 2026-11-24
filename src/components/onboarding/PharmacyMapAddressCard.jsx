import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, moderateScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText, AppInput, AppToast, GlassCard } from '../core/index.js';
import { MapPinIcon, TargetMapIcon } from '../../assets/vectors/index.js';
import {
  requestLocationPermission,
  reverseGeocode,
  DARK_MAP_STYLE,
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

  const handleQuickGps = async () => {
    try {
      setIsLocating(true);
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLocating(false);
        AppToast.show({
          title: 'Location Permission',
          message: 'Please allow location permission in device settings to detect GPS.',
          type: 'error',
        });
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          setIsLocating(false);
          if (position?.coords) {
            const { latitude, longitude } = position.coords;
            onCoordinatesChange?.({ latitude, longitude });
            try {
              const res = await reverseGeocode(latitude, longitude);
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
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
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
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          region={{
            latitude: coordinates?.latitude || 31.5204,
            longitude: coordinates?.longitude || 74.3587,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={{
              latitude: coordinates?.latitude || 31.5204,
              longitude: coordinates?.longitude || 74.3587,
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
              backgroundColor: isDark ? 'rgba(15, 23, 30, 0.92)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
              shadowColor: isDark ? '#000000' : (colors.surface?.inputShadow || '#6FB4C2'),
            },
          ]}
        >
          <TargetMapIcon size={scale(28)} />
        </TouchableOpacity>

        {/* Adjust Pin on Full Map Floating Pill Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenFullMap}
          style={[
            styles.adjustPinBtn,
            {
              backgroundColor: isDark ? 'rgba(10, 10, 12, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
              shadowColor: isDark ? '#000000' : (colors.surface?.inputShadow || '#6FB4C2'),
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
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F0F9FA',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 155, 169, 0.12)',
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
            {`GPS Coordinates: ${(coordinates?.latitude || 0).toFixed(5)}° N, ${(coordinates?.longitude || 0).toFixed(5)}° E`}
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
          backgroundColor: colors.surface?.card || '#FFFFFF',
          borderColor: colors.border?.card || 'rgba(0, 0, 0, 0.06)',
          shadowColor: colors.surface?.inputShadow || '#6FB4C2',
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
