import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme, fontFamilies } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import {
  GlassCard,
  AppText,
  MetricIconDisc,
  DetailsChevronButton,
} from '../core/index.js';
import {
  DARK_MAP_STYLE,
  DEFAULT_COORDINATES,
} from '../../services/geocodingService.js';

const LocationPinSvg = ({ size = 18, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="10" r="2.6" stroke={color} strokeWidth="1.8" />
  </Svg>
);

/**
 * PharmacyLocationCard - Card 4: Verified Address, GPS Coordinates & Embedded Map Preview
 */
export const PharmacyLocationCard = ({
  addressText,
  latitude,
  longitude,
  onPressChangePin,
}) => {
  const { colors, isDark, radii, spacing, typography } = useTheme();
  const discIconColor = isDark ? colors.text.primary : colors.brand.primaryDark;
  const mapRef = useRef(null);
  const isMapReadyRef = useRef(false);

  const safeLat = Number.isFinite(latitude) ? latitude : DEFAULT_COORDINATES.latitude;
  const safeLng = Number.isFinite(longitude) ? longitude : DEFAULT_COORDINATES.longitude;

  const mapRegion = useMemo(
    () => ({
      latitude: safeLat,
      longitude: safeLng,
      latitudeDelta: DEFAULT_COORDINATES.latitudeDelta,
      longitudeDelta: DEFAULT_COORDINATES.longitudeDelta,
    }),
    [safeLat, safeLng]
  );

  useEffect(() => {
    if (isMapReadyRef.current && mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(mapRegion, 300);
    }
  }, [mapRegion]);

  const handleMapReady = useCallback(() => {
    isMapReadyRef.current = true;
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(mapRegion, 300);
    }
  }, [mapRegion]);

  return (
    <GlassCard>
      <View style={[styles.cardHeaderRow, { marginBottom: spacing.sm }]}>
        <AppText
          style={[
            typography.titleMedium,
            styles.cardTitleText,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
        >
          Pharmacy Location
        </AppText>
        <DetailsChevronButton label="Change Pin" onPress={onPressChangePin} />
      </View>

      <View style={[styles.addressRow, { gap: spacing.sm }]}>
        <View style={styles.pinDiscWrap}>
          <MetricIconDisc size={36} variant="first_visit">
            <LocationPinSvg size={scale(18)} color={discIconColor} />
          </MetricIconDisc>
        </View>

        <View style={styles.addressRightCol}>
          <AppText
            style={[styles.streetAddressText, { color: colors.text.primary }]}
            numberOfLines={3}
          >
            {addressText}
          </AppText>
          <AppText
            isMono
            style={[styles.gpsCoordsText, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {`${safeLat.toFixed(5)}, ${safeLng.toFixed(5)}`}
          </AppText>
        </View>
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.mapPreviewWrap,
          {
            marginTop: spacing.md,
            borderRadius: radii.lg,
            borderColor: colors.border.subtle,
          },
        ]}
      >
        <MapView
          key={`${safeLat.toFixed(5)}-${safeLng.toFixed(5)}-${isDark ? 'dark' : 'light'}`}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={mapRegion}
          onMapReady={handleMapReady}
          customMapStyle={isDark ? DARK_MAP_STYLE : []}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          toolbarEnabled={false}
          liteMode={Platform.OS === 'android'}
        >
          <Marker
            coordinate={{ latitude: safeLat, longitude: safeLng }}
            pinColor={colors.brand.primary}
          />
        </MapView>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitleText: {
    fontFamily: fontFamilies.primaryMedium,
    flex: 1,
    marginRight: scale(8),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pinDiscWrap: {
    flexShrink: 0,
    marginTop: verticalScale(2),
  },
  addressRightCol: {
    flex: 1,
  },
  streetAddressText: {
    fontFamily: fontFamilies.primaryRegular,
    fontSize: scaleFont(13),
    lineHeight: verticalScale(19),
  },
  gpsCoordsText: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: scaleFont(11),
    lineHeight: scaleFont(15),
    fontVariant: ['tabular-nums'],
    marginTop: verticalScale(4),
  },
  mapPreviewWrap: {
    height: verticalScale(140),
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
  },
});

export default PharmacyLocationCard;
