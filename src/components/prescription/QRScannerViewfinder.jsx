import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { GlassCard, AppText } from '../core/index.js';

/**
 * QRScannerViewfinder - Animated Camera Reticle for Prescription Scanner
 *
 * @param {Object} props
 * @param {string} [props.instructionText='Center the QR code from the digital prescription within the frame']
 */
export const QRScannerViewfinder = ({
  instructionText = 'Center the QR code from the digital prescription within the frame',
}) => {
  const { colors } = useTheme();
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [laserAnim]);

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scale(200)],
  });

  return (
    <GlassCard style={styles.viewfinderCard}>
      <View style={styles.viewfinderBox}>
        {/* Frame Corner Accents */}
        <View style={[styles.corner, styles.cornerTL, { borderColor: colors.brand?.primary }]} />
        <View style={[styles.corner, styles.cornerTR, { borderColor: colors.brand?.primary }]} />
        <View style={[styles.corner, styles.cornerBL, { borderColor: colors.brand?.primary }]} />
        <View style={[styles.corner, styles.cornerBR, { borderColor: colors.brand?.primary }]} />

        {/* Animated Laser Bar */}
        <Animated.View
          style={[
            styles.laserBar,
            {
              backgroundColor: colors.brand?.primary,
              shadowColor: colors.brand?.primary,
              transform: [{ translateY: laserTranslateY }],
            },
          ]}
        />

        <Svg width={scale(70)} height={scale(70)} viewBox="0 0 24 24" fill="none" opacity={0.3}>
          <Path
            d="M3 9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            stroke={colors.brand?.primary}
            strokeWidth="1.5"
          />
          <Path d="M7 12h10" stroke={colors.brand?.primary} strokeWidth="1.5" strokeDasharray="2 2" />
        </Svg>
      </View>

      <AppText variant="caption" colorType="muted" style={styles.instruction}>
        {instructionText}
      </AppText>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  viewfinderCard: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  viewfinderBox: {
    width: scale(240),
    height: scale(220),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: scale(24),
    height: scale(24),
    borderWidth: 3,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  laserBar: {
    position: 'absolute',
    top: 10,
    left: scale(10),
    right: scale(10),
    height: 2.5,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  instruction: {
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
});

export default QRScannerViewfinder;
