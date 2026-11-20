import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';

/**
 * RegistrationProgress - Multi-Step Wizard Progress Bar
 * Exact port from OneRx matching Figma designs
 *
 * @param {Object} props
 * @param {number} props.currentStep - 1-based index
 * @param {number} [props.totalSteps=5]
 * @param {Object} [props.style]
 */
export const RegistrationProgress = ({ currentStep, totalSteps = 5, style }) => {
  const { isDark } = useTheme();

  const progressTrack = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const trackBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';
  const activeColors = isDark ? ['#00D2D3', '#009BA9'] : ['#0B4D66', '#06394F'];

  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <View style={[styles.progressContainer, style]}>
      <View
        style={[
          styles.progressBar,
          {
            backgroundColor: progressTrack,
            borderColor: trackBorder,
            borderWidth: 1,
          },
        ]}
      >
        <LinearGradient
          colors={activeColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.progressActive, { width: `${percentage}%` }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressActive: {
    height: '100%',
    borderRadius: 3,
  },
});

export default RegistrationProgress;
