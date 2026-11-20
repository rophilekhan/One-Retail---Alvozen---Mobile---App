import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale } from '../../theme/responsive.js';
import AppText from './AppText.jsx';
import AppBackButton from './AppBackButton.jsx';

/**
 * AppHeader - Screen Top Navigation Bar
 * Integrates glassmorphic AppBackButton with SVG chevron (never raw '<' text)
 *
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {boolean} [props.showBack=true]
 * @param {Function} [props.onBack]
 * @param {React.ReactNode} [props.rightElement]
 * @param {number} [props.progress] - Value 0 to 1 for multi-step progress bar
 * @param {Object} [props.style]
 * @param {Object} [props.titleStyle]
 */
export const AppHeader = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightElement,
  progress,
  style,
  titleStyle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        {showBack ? (
          <AppBackButton onPress={onBack} size={scale(40)} />
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <View style={styles.titleContainer}>
          {title ? (
            <AppText
              variant="titleMedium"
              align="center"
              numberOfLines={1}
              colorType="primary"
              style={titleStyle}
            >
              {title}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText
              variant="caption"
              align="center"
              colorType="muted"
              numberOfLines={1}
            >
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <View style={styles.rightContainer}>
          {rightElement || <View style={styles.backPlaceholder} />}
        </View>
      </View>

      {/* Optional Progress Bar for Multi-step Wizard */}
      {typeof progress === 'number' && (
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: colors.border?.subtle || 'rgba(0,0,0,0.06)' },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
                backgroundColor: colors.brand?.primary || '#009BA9',
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backPlaceholder: {
    width: scale(40),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightContainer: {
    minWidth: scale(40),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 3,
    width: '100%',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default AppHeader;
