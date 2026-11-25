import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/index.js';
import { scale, verticalScale, scaleFont } from '../../theme/responsive.js';
import { fontFamilies } from '../../theme/typography.js';
import { AppText } from '../core/index.js';

/**
 * PointTransactionCard
 *
 * Matching exact specification from OneRx:
 * - Solid card with smooth rounded corners (scale(20))
 * - Top: Solid capsule pill tags, with mono font for alphanumeric IDs
 * - Middle: Description text in clean Sans typography
 * - Divider: 1px hairline horizontal separator line
 * - Bottom: Timestamp in Mono on left, Points in mono (+40 pts) + arrow + [ 20 Rs ] mono pill on right
 *
 * @param {Object} props
 * @param {Array<string>} [props.badges]
 * @param {string} props.description
 * @param {string} props.timestamp
 * @param {number|string} props.points
 * @param {number|string} props.currencyValue
 */
export const PointTransactionCard = memo(({
  badges = [],
  description,
  timestamp,
  points,
  currencyValue,
}) => {
  const { isDark } = useTheme();

  const formattedPoints =
    typeof points === 'number'
      ? points > 0
        ? `+${points}`
        : `${points}`
      : String(points).startsWith('+')
        ? points
        : `+${points}`;

  // Check if a badge is a code or contains alphanumeric ID like RX20341
  const isCodeBadge = (text) => /\d/.test(text) || /^[A-Z0-9_-]+$/.test(text);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1F1F1F' : '#F5F5F5',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
          borderWidth: isDark ? 1 : 0,
        },
      ]}
    >
      {/* 1. Top Row: Capsule Badge Pills */}
      {badges && badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.map((badgeText, idx) => {
            const isCode = isCodeBadge(badgeText);
            return (
              <View
                key={idx}
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                    borderWidth: isDark ? 1 : 0,
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.badgeText,
                    isCode && styles.badgeTextMono,
                    { color: isDark ? '#FFFFFF' : '#020202' },
                  ]}
                >
                  {badgeText}
                </AppText>
              </View>
            );
          })}
        </View>
      )}

      {/* 2. Middle: Description Text in Clean Sans */}
      <AppText
        style={[
          styles.description,
          { color: isDark ? '#FFFFFF' : '#020202' },
        ]}
      >
        {description}
      </AppText>

      {/* 3. Subtle Horizontal Divider Line */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : '#EBEBEB',
          },
        ]}
      />

      {/* 4. Bottom Row: Date/Time on Left, Points/Currency on Right */}
      <View style={styles.bottomRow}>
        {/* Timestamp in Mono */}
        <AppText
          style={[
            styles.timestampTextMono,
            { color: isDark ? '#9CA3AF' : '#737373' },
          ]}
        >
          {timestamp}
        </AppText>

        {/* Right Conversion Group */}
        <View style={styles.rightGroup}>
          <AppText
            style={[
              styles.pointsTextMono,
              { color: isDark ? '#38BDF8' : '#0F4761' },
            ]}
          >
            {formattedPoints}
          </AppText>
          <AppText
            style={[
              styles.ptsTextMono,
              { color: isDark ? '#9CA3AF' : '#787878' },
            ]}
          >
            {' pts'}
          </AppText>

          <AppText
            style={[
              styles.arrowText,
              { color: isDark ? '#6B7280' : '#8A8A8A' },
            ]}
          >
            {' → '}
          </AppText>

          <View
            style={[
              styles.currencyPill,
              {
                backgroundColor: isDark ? '#2B2B2B' : '#FFFFFF',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                borderWidth: isDark ? 1 : 0,
              },
            ]}
          >
            <AppText
              style={[
                styles.currencyTextMono,
                { color: isDark ? '#E2E8F0' : '#787878' },
              ]}
            >
              {currencyValue}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(10),
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: verticalScale(10),
  },
  badgePill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(999),
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: scaleFont(11.5),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  badgeTextMono: {
    fontFamily: fontFamilies.monoMedium || fontFamilies.mono,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: scaleFont(14.5),
    fontFamily: fontFamilies.primaryMedium,
    fontWeight: '500',
    lineHeight: scaleFont(21),
    letterSpacing: -0.2,
    marginBottom: verticalScale(12),
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: verticalScale(12),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampTextMono: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.primary,
    fontWeight: '400',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsTextMono: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.3,
  },
  ptsTextMono: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
    marginLeft: scale(2),
  },
  arrowText: {
    fontSize: scaleFont(13),
    fontFamily: fontFamilies.primary,
    marginHorizontal: scale(6),
  },
  currencyPill: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: scale(999),
  },
  currencyTextMono: {
    fontSize: scaleFont(12),
    fontFamily: fontFamilies.mono,
    fontVariant: ['tabular-nums'],
  },
});

export default PointTransactionCard;
