import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale } from '../../theme/responsive.js';
import { AppText, AppBackButton } from '../core/index.js';

/**
 * OnboardingStepHeader - Standardized Header with Back Button & Step Progress
 *
 * @param {Object} props
 * @param {number} props.currentStep - Current step number (e.g. 1)
 * @param {number} [props.totalSteps=4] - Total registration steps
 * @param {string} props.title - Step screen title
 * @param {string} [props.subtitle] - Descriptive subtitle
 * @param {Function} [props.onBack] - Custom back handler (defaults to navigation.goBack)
 * @param {Object} [props.navigation] - Navigation object
 */
export const OnboardingStepHeader = ({
  currentStep,
  totalSteps = 4,
  title,
  subtitle,
  onBack,
  navigation,
}) => {
  const { colors, isDark, spacing } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  const progressTrack = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const trackBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const activeGradient = isDark
    ? [colors.brand?.primary, colors.brand?.primaryLight || colors.brand?.primary]
    : [colors.brand?.primaryDark, colors.brand?.primary];

  return (
    <View style={styles.container}>
      {/* Top Nav Row */}
      <View style={styles.topRow}>
        <AppBackButton onPress={handleBack} />
        <View style={styles.stepBadge}>
          <AppText variant="captionMedium" colorType="brand">
            Step {currentStep} of {totalSteps}
          </AppText>
        </View>
      </View>

      {/* Progress Bar Track */}
      <View style={[styles.progressTrack, { backgroundColor: progressTrack, borderColor: trackBorder }]}>
        <LinearGradient
          colors={activeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${percentage}%` }]}
        />
      </View>

      {/* Screen Title & Subtitle */}
      <View style={styles.titleWrap}>
        <AppText variant="headlineMedium" colorType="primary" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="bodyMedium" colorType="muted" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(14),
  },
  stepBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    backgroundColor: 'rgba(0, 155, 169, 0.12)',
  },
  progressTrack: {
    height: verticalScale(6),
    borderRadius: scale(3),
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    marginBottom: verticalScale(16),
  },
  progressBar: {
    height: '100%',
    borderRadius: scale(3),
  },
  titleWrap: {
    marginTop: verticalScale(4),
  },
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: verticalScale(4),
    lineHeight: scale(20),
  },
});

export default OnboardingStepHeader;
