import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AppText, AppButton, AppModal, AppToast } from '../core/index.js';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { MapPinIcon } from '../../assets/vectors/index.js';
import Svg, { Path, Circle } from 'react-native-svg';

/**
 * LocationPickerModal - Interactive Location Picker Bottom Sheet
 * Modeled after OneRx LocationPickerModal with coordinate & address resolution
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {Function} props.onClose
 * @param {Function} props.onAddLocation
 * @param {string} [props.selectedAddress]
 * @param {Object} [props.selectedCoordinates]
 */
export const LocationPickerModal = ({
  visible,
  onClose,
  onAddLocation,
  selectedAddress,
  selectedCoordinates,
}) => {
  const { colors, isDark } = useTheme();

  const [coords, setCoords] = useState(
    selectedCoordinates || { latitude: 31.5204, longitude: 74.3587 }
  );
  const [address, setAddress] = useState(
    selectedAddress || 'Main Boulevard, Gulberg III, Lahore, Pakistan'
  );
  const [isLocating, setIsLocating] = useState(false);

  const handleCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setCoords({ latitude: 31.5204, longitude: 74.3587 });
      setAddress('Main Boulevard, Gulberg III, Lahore, Pakistan');
      AppToast.show({
        title: 'Location Detected',
        message: 'Current GPS coordinates pinned successfully.',
        type: 'success',
      });
    }, 600);
  };

  const handleConfirm = () => {
    if (onAddLocation) {
      onAddLocation({
        address,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    }
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      onClose={onClose}
      type="bottomSheet"
      title="Pin Pharmacy Location"
    >
      <View style={styles.container}>
        {/* Map Placeholder / Visual Canvas */}
        <View
          style={[
            styles.mapCanvas,
            {
              backgroundColor: isDark ? '#141A21' : '#E8F4F8',
              borderColor: colors.border?.card || 'rgba(255,255,255,0.12)',
            },
          ]}
        >
          {/* Grid lines simulating map streets */}
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Path d="M 0 60 L 400 60" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="2" />
            <Path d="M 0 140 L 400 140" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="3" />
            <Path d="M 120 0 L 120 220" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="3" />
            <Path d="M 260 0 L 260 220" stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeWidth="2" />
          </Svg>

          {/* Center Map Pin (Uber Style) */}
          <View style={styles.centerPinWrap} pointerEvents="none">
            <View
              style={[
                styles.tooltip,
                { backgroundColor: colors.brand?.primary || '#009BA9' },
              ]}
            >
              <AppText variant="captionMedium" style={{ color: '#FFFFFF' }}>
                Pharmacy Pin
              </AppText>
            </View>
            <View style={[styles.tooltipArrow, { borderTopColor: colors.brand?.primary || '#009BA9' }]} />
            <MapPinIcon size={36} color={colors.brand?.primary || '#009BA9'} />
          </View>

          {/* Floating Target GPS Button */}
          <TouchableOpacity
            style={[
              styles.targetBtn,
              {
                backgroundColor: isDark ? '#020202' : '#FFFFFF',
                borderColor: colors.border?.subtle,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleCurrentLocation}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx="12" cy="12" r="8" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" />
              <Circle cx="12" cy="12" r="3" fill={colors.brand?.primary || '#009BA9'} />
              <Path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke={colors.brand?.primary || '#009BA9'} strokeWidth="2" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Address and Coordinates Details */}
        <View style={styles.detailsSection}>
          <View
            style={[
              styles.addressCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FBFC',
                borderColor: colors.border?.subtle,
              },
            ]}
          >
            <MapPinIcon size={20} color={colors.brand?.primary || '#009BA9'} />
            <View style={{ flex: 1, marginLeft: scale(10) }}>
              <AppText variant="bodyMediumMedium" colorType="primary" numberOfLines={2}>
                {address}
              </AppText>
              <AppText variant="caption" colorType="muted" style={{ marginTop: 2 }}>
                Lat: {coords.latitude.toFixed(4)}, Lng: {coords.longitude.toFixed(4)}
              </AppText>
            </View>
          </View>

          <AppButton
            variant="primary"
            title="Set This Location"
            onPress={handleConfirm}
            style={{ width: '100%', marginTop: verticalScale(14) }}
          />
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(8),
  },
  mapCanvas: {
    height: verticalScale(200),
    width: '100%',
    borderRadius: scale(18),
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPinWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -verticalScale(16),
  },
  tooltip: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: scale(5),
    borderRightWidth: scale(5),
    borderTopWidth: verticalScale(6),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 2,
  },
  targetBtn: {
    position: 'absolute',
    right: scale(12),
    bottom: verticalScale(12),
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  detailsSection: {
    marginTop: verticalScale(14),
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(14),
    borderRadius: scale(16),
    borderWidth: 1,
  },
});

export default LocationPickerModal;
